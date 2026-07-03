import { router, Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

import { colors, radii, spacing, typography } from "@/constants/theme";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

const tabSwipeRoutes = [
  { name: "index", path: "/", title: "Accueil", icon: "home-outline" },
  { name: "ticket", path: "/ticket", title: "Pronostics", icon: "receipt-outline" },
  { name: "markets", path: "/markets", title: "Marchés", icon: "trending-up-outline" },
  { name: "ascension-ai-market", path: "/ascension-ai-market", title: "AI Master", icon: "sparkles-outline" },
  { name: "academy", path: "/academy", title: "Academy", icon: "book-outline" },
  { name: "discipline", path: "/discipline", title: "Objectifs", icon: "checkmark-circle-outline" },
  { name: "profile", path: "/profile", title: "Profil", icon: "person-outline" }
] as const;

export default function TabsLayout() {
  const { theme } = useAscensionTheme();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const currentTabIndex = useMemo(() => {
    const currentPath = pathname === "/index" ? "/" : pathname;
    const tabIndex = tabSwipeRoutes.findIndex((route) => route.path === currentPath);
    return tabIndex >= 0 ? tabIndex : 0;
  }, [pathname]);
  const dragX = useSharedValue(0);
  const gestureDirection = useSharedValue<1 | -1 | 0>(0);
  const transitionProgress = useSharedValue(0);
  const screenWidth = useSharedValue(width);
  const previewDirection = useSharedValue<1 | -1 | 0>(0);
  const previewRoute = previewIndex !== null ? tabSwipeRoutes[previewIndex] : null;

  useEffect(() => {
    screenWidth.value = width;
  }, [screenWidth, width]);

  useEffect(() => {
    dragX.value = 0;
    gestureDirection.value = 0;
    transitionProgress.value = 0;
    previewDirection.value = 0;
    setPreviewIndex(null);
  }, [dragX, gestureDirection, pathname, previewDirection, transitionProgress]);

  const setSwipePreview = useCallback(
    (direction: 1 | -1) => {
      const nextIndex = currentTabIndex + direction;
      setPreviewIndex(tabSwipeRoutes[nextIndex] ? nextIndex : null);
    },
    [currentTabIndex]
  );
  const finishSwipe = useCallback(
    (direction: 1 | -1) => {
      const nextIndex = currentTabIndex + direction;
      const nextRoute = tabSwipeRoutes[nextIndex];

      if (!nextRoute) {
        dragX.value = 0;
        transitionProgress.value = 0;
        setPreviewIndex(null);
        return;
      }

      router.replace(nextRoute.path);
    },
    [currentTabIndex, dragX, transitionProgress]
  );
  const tabSwipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-28, 28])
        .failOffsetY([-22, 22])
        .onBegin(() => {
          gestureDirection.value = 0;
          previewDirection.value = 0;
        })
        .onUpdate((event) => {
          const horizontalDistance = Math.abs(event.translationX);
          const verticalDistance = Math.abs(event.translationY);
          const nextDirection = event.translationX < 0 ? 1 : -1;
          const hasNeighbor = nextDirection === 1 ? currentTabIndex < tabSwipeRoutes.length - 1 : currentTabIndex > 0;

          if (!hasNeighbor || horizontalDistance < 10 || horizontalDistance < verticalDistance * 1.35) {
            dragX.value = withSpring(0, { damping: 24, stiffness: 230 });
            transitionProgress.value = withTiming(0, { duration: 120 });
            return;
          }

          if (previewDirection.value !== nextDirection) {
            previewDirection.value = nextDirection;
            runOnJS(setSwipePreview)(nextDirection);
          }

          gestureDirection.value = nextDirection;
          dragX.value = event.translationX;
          transitionProgress.value = Math.min(horizontalDistance / screenWidth.value, 1);
        })
        .onEnd((event) => {
          const direction = gestureDirection.value;
          const horizontalDistance = Math.abs(event.translationX);
          const shouldComplete = direction !== 0 && (horizontalDistance > screenWidth.value * 0.4 || Math.abs(event.velocityX) > 820);

          if (!shouldComplete) {
            dragX.value = withSpring(0, { damping: 24, stiffness: 230 });
            transitionProgress.value = withTiming(0, { duration: 180 });
            previewDirection.value = 0;
            gestureDirection.value = 0;
            runOnJS(setPreviewIndex)(null);
            return;
          }

          dragX.value = withTiming(-direction * screenWidth.value, { duration: 240 }, (finished) => {
            if (finished) {
              runOnJS(finishSwipe)(direction);
            }
          });
          transitionProgress.value = withTiming(1, { duration: 220 });
        }),
    [currentTabIndex, dragX, finishSwipe, gestureDirection, previewDirection, screenWidth, setSwipePreview, transitionProgress]
  );
  const currentPageStyle = useAnimatedStyle(() => {
    const opacity = interpolate(Math.abs(dragX.value), [0, screenWidth.value * 0.85], [1, 0.72], Extrapolation.CLAMP);
    const scale = interpolate(Math.abs(dragX.value), [0, screenWidth.value], [1, 0.982], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX: dragX.value }, { scale }]
    };
  });
  const previewPageStyle = useAnimatedStyle(() => {
    const direction = previewDirection.value || gestureDirection.value || 1;
    const baseOffset = direction * screenWidth.value;
    const translateX = baseOffset + dragX.value;
    const opacity = interpolate(transitionProgress.value, [0, 0.16, 1], [0, 0.55, 1], Extrapolation.CLAMP);
    const scale = interpolate(transitionProgress.value, [0, 1], [0.985, 1], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX }, { scale }]
    };
  });

  return (
    <GestureDetector gesture={tabSwipeGesture}>
      <View style={styles.root}>
        {previewRoute ? (
          <Animated.View pointerEvents="none" style={[styles.previewPage, previewPageStyle]}>
            <LinearTabPreview title={previewRoute.title} icon={previewRoute.icon} />
          </Animated.View>
        ) : null}
        <Animated.View style={[styles.activePage, currentPageStyle]}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: theme.accent,
              tabBarInactiveTintColor: theme.textMuted,
              animation: "fade",
              tabBarLabelStyle: styles.label,
              tabBarIconStyle: styles.icon,
              tabBarStyle: [
                styles.tabBar,
                {
                  borderTopColor: theme.accentBorder,
                  backgroundColor: theme.surface,
                  shadowColor: theme.accent
                }
              ],
              tabBarBackground: () => <BlurView intensity={44} tint="dark" style={StyleSheet.absoluteFill} />
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Accueil",
                tabBarIcon: ({ color }) => <Ionicons name="home-outline" color={color} size={20} />
              }}
            />
            <Tabs.Screen
              name="ticket"
              options={{
                title: "Pronostics",
                tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" color={color} size={20} />
              }}
            />
            <Tabs.Screen
              name="markets"
              options={{
                title: "Marchés",
                tabBarIcon: ({ color }) => <Ionicons name="trending-up-outline" color={color} size={20} />
              }}
            />
            <Tabs.Screen
              name="ascension-ai-market"
              options={{
                title: "AI Master",
                tabBarIcon: ({ color }) => <Ionicons name="sparkles-outline" color={color} size={20} />
              }}
            />
            <Tabs.Screen
              name="academy"
              options={{
                title: "Academy",
                tabBarIcon: ({ color }) => <Ionicons name="book-outline" color={color} size={20} />
              }}
            />
            <Tabs.Screen
              name="discipline"
              options={{
                title: "Objectifs",
                tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle-outline" color={color} size={20} />
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Profil",
                tabBarIcon: ({ color }) => <Ionicons name="person-outline" color={color} size={20} />
              }}
            />
            <Tabs.Screen
              name="betting"
              options={{
                href: null
              }}
            />
          </Tabs>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

function LinearTabPreview({ title, icon }: { title: string; icon: keyof typeof Ionicons.glyphMap }) {
  const { theme } = useAscensionTheme();

  return (
    <View style={[styles.previewSurface, { backgroundColor: theme.surface }]}>
      <View style={[styles.previewGlow, { backgroundColor: theme.glow, shadowColor: theme.accent }]} />
      <View style={[styles.previewCard, { borderColor: theme.accentBorder, backgroundColor: theme.overlay, shadowColor: theme.accent }]}>
        <View style={[styles.previewIcon, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
          <Ionicons name={icon} size={32} color={theme.accentSoft} />
        </View>
        <Text style={[styles.previewEyebrow, { color: theme.textMuted }]}>ASCENSION</Text>
        <Text style={[styles.previewTitle, { color: theme.text }]}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: "hidden"
  },
  activePage: {
    flex: 1
  },
  previewPage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0
  },
  previewSurface: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: 96,
    alignItems: "center",
    justifyContent: "center"
  },
  previewGlow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.70,
    shadowOpacity: 0.22,
    shadowRadius: 72,
    shadowOffset: { width: 0, height: 0 }
  },
  previewCard: {
    width: "100%",
    minHeight: 220,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    shadowOpacity: 0.18,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 18 }
  },
  previewIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs
  },
  previewEyebrow: {
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 2.2
  },
  previewTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.3
  },
  tabBar: {
    position: "absolute",
    minHeight: 74,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 229, 166, 0.24)",
    backgroundColor: "rgba(3, 3, 3, 0.72)",
    shadowColor: colors.gold,
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -10 }
  },
  icon: {
    marginTop: 3
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.25,
    marginTop: 1
  }
});
