import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { colors, spacing } from "@/constants/theme";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

type AppScreenProps = PropsWithChildren<{
  scroll?: boolean;
}>;

export function AppScreen({ children, scroll = true }: AppScreenProps) {
  const { theme } = useAscensionTheme();
  const twinkle = useRef(new Animated.Value(0)).current;
  const entrance = useRef(new Animated.Value(0)).current;
  const stars = useMemo<Array<{ left: `${number}%`; top: `${number}%`; opacity: number; size: number }>>(
    () => [
      { left: "24%", top: "7%", opacity: 0.09, size: 0.9 },
      { left: "34%", top: "11%", opacity: 0.14, size: 1 },
      { left: "43%", top: "8%", opacity: 0.12, size: 0.8 },
      { left: "57%", top: "9%", opacity: 0.16, size: 1 },
      { left: "66%", top: "13%", opacity: 0.12, size: 0.8 },
      { left: "75%", top: "11%", opacity: 0.09, size: 0.9 },
      { left: "16%", top: "15%", opacity: 0.06, size: 0.8 },
      { left: "82%", top: "16%", opacity: 0.07, size: 0.8 },
      { left: "29%", top: "18%", opacity: 0.08, size: 0.7 },
      { left: "71%", top: "19%", opacity: 0.08, size: 0.7 },
      { left: "48%", top: "20%", opacity: 0.06, size: 0.7 },
      { left: "10%", top: "28%", opacity: 0.035, size: 0.65 },
      { left: "90%", top: "30%", opacity: 0.035, size: 0.65 },
      { left: "38%", top: "36%", opacity: 0.030, size: 0.6 },
      { left: "61%", top: "42%", opacity: 0.030, size: 0.6 }
    ],
    []
  );

  const entranceStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0]
        })
      }
    ]
  };
  const content = <Animated.View style={[styles.content, entranceStyle]}>{children}</Animated.View>;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true
    }).start();
  }, [entrance]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, {
          toValue: 1,
          duration: 7200,
          useNativeDriver: true
        }),
        Animated.timing(twinkle, {
          toValue: 0,
          duration: 7600,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [twinkle]);

  const twinkleStyle = {
    opacity: twinkle.interpolate({
      inputRange: [0, 1],
      outputRange: [0.38, 0.76]
    })
  };

  return (
    <LinearGradient colors={theme.backgroundGradient} style={styles.root}>
      <LinearGradient
        pointerEvents="none"
        colors={[theme.glow, theme.glowSoft, "rgba(0, 0, 0, 0)"]}
        locations={[0, 0.28, 1]}
        style={styles.centralLight}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[theme.glow, theme.glowSoft, "rgba(0, 0, 0, 0)"]}
        locations={[0, 0.28, 1]}
        style={[styles.lightBeam, styles.lightBeamLeft]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[theme.glow, theme.glowSoft, "rgba(0, 0, 0, 0)"]}
        locations={[0, 0.30, 1]}
        style={[styles.lightBeam, styles.lightBeamRight]}
      />
      <View pointerEvents="none" style={[styles.ambientHalo, { backgroundColor: theme.glowSoft, shadowColor: theme.accentSoft }]} />
      <View pointerEvents="none" style={[styles.logoDustHalo, { backgroundColor: theme.glowSoft, shadowColor: theme.accent }]} />
      <View pointerEvents="none" style={styles.carbonLayer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={`carbon-a-${index}`} style={[styles.carbonLine, styles.carbonLineA, { top: 260 + index * 196 }]} />
        ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={`carbon-b-${index}`} style={[styles.carbonLine, styles.carbonLineB, { top: 372 + index * 196 }]} />
        ))}
      </View>
      <Svg pointerEvents="none" style={styles.geometryLayer} viewBox="0 0 430 932" preserveAspectRatio="none">
        <Path d="M-42 142 C78 196 316 196 472 142" stroke={theme.accentBorder} strokeWidth="0.65" fill="none" />
        <Path d="M-30 143 C96 206 308 206 462 143" stroke="rgba(255, 239, 185, 0.060)" strokeWidth="1.5" fill="none" />
        <Path d="M-40 224 L470 86" stroke="rgba(244, 201, 108, 0.030)" strokeWidth="0.55" />
        <Path d="M-44 332 L470 654" stroke="rgba(244, 201, 108, 0.030)" strokeWidth="0.55" />
        <Path d="M-36 646 L466 336" stroke="rgba(244, 201, 108, 0.038)" strokeWidth="0.6" />
        <Path d="M-18 216 L448 464" stroke="rgba(255, 255, 255, 0.016)" strokeWidth="0.55" />
      </Svg>
      <View pointerEvents="none" style={[styles.arcSpark, { backgroundColor: theme.accent, shadowColor: theme.accent }]} />
      <Animated.View pointerEvents="none" style={[styles.starsLayer, twinkleStyle]}>
        {stars.map((star, index) => (
          <View
            key={`${star.left}-${index}`}
            style={[
              styles.star,
              {
                left: star.left,
                top: star.top,
                opacity: star.opacity,
                width: star.size,
                height: star.size,
                backgroundColor: theme.accent
              }
            ]}
          />
        ))}
      </Animated.View>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  centralLight: {
    position: "absolute",
    top: -12,
    alignSelf: "center",
    width: 168,
    height: 330,
    borderBottomLeftRadius: 84,
    borderBottomRightRadius: 84,
    opacity: 0.58
  },
  lightBeam: {
    position: "absolute",
    top: -8,
    width: 54,
    height: 280,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28
  },
  lightBeamLeft: {
    left: "43%",
  },
  lightBeamRight: {
    right: "42%",
  },
  ambientHalo: {
    position: "absolute",
    top: 68,
    alignSelf: "center",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(228, 169, 69, 0.046)",
    shadowColor: colors.goldSoft,
    shadowOpacity: 0.18,
    shadowRadius: 108,
    shadowOffset: { width: 0, height: 0 }
  },
  logoDustHalo: {
    position: "absolute",
    top: 124,
    alignSelf: "center",
    width: 360,
    height: 72,
    borderRadius: 180,
    backgroundColor: "rgba(228, 169, 69, 0.022)",
    shadowColor: colors.gold,
    shadowOpacity: 0.12,
    shadowRadius: 56,
    shadowOffset: { width: 0, height: 0 }
  },
  geometryLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.92
  },
  starsLayer: {
    ...StyleSheet.absoluteFillObject
  },
  carbonLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
    overflow: "hidden"
  },
  carbonLine: {
    position: "absolute",
    left: -210,
    width: 860,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.014)"
  },
  carbonLineA: {
    transform: [{ rotate: "-28deg" }]
  },
  carbonLineB: {
    backgroundColor: "rgba(228, 169, 69, 0.018)",
    transform: [{ rotate: "28deg" }]
  },
  star: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 214, 119, 0.76)"
  },
  arcSpark: {
    position: "absolute",
    top: 143,
    alignSelf: "center",
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255, 240, 176, 0.86)",
    shadowColor: colors.goldSoft,
    shadowOpacity: 0.62,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }
  },
  safeArea: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 120
  },
  content: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
    gap: 24
  }
});
