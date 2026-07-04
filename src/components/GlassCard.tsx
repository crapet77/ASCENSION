import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { radii, spacing } from "@/constants/theme";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  elevated?: boolean;
}>;

export function useGlassCardPalette() {
  const { theme } = useAscensionTheme();

  return {
    accent: theme.accent,
    accentSoft: theme.accentSoft,
    border: theme.accentBorder,
    danger: theme.danger,
    glow: theme.glow,
    glowSoft: theme.glowSoft,
    line: theme.line,
    overlay: theme.overlay,
    secondary: theme.textMuted,
    success: theme.success,
    surface: theme.surface,
    title: theme.text
  };
}

export function GlassCard({ children, style, contentStyle, elevated = true }: GlassCardProps) {
  const { theme } = useAscensionTheme();
  const isCosmos = theme.id === "cosmos";
  const shadowOpacity = isCosmos ? (elevated ? 0.30 : 0.12) : elevated ? 0.20 : 0.08;
  const shadowRadius = isCosmos ? 44 : 34;
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true
    }).start();
  }, [entrance]);

  const entranceStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0]
        })
      },
      {
        scale: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [0.992, 1]
        })
      }
    ]
  };

  return (
    <Animated.View
      style={[
        styles.shell,
        entranceStyle,
        {
          borderColor: theme.accentBorder,
          shadowColor: theme.accent,
          shadowOpacity,
          shadowRadius,
          backgroundColor: theme.surface
        },
        style
      ]}
    >
      <BlurView intensity={isCosmos ? 42 : theme.isLight ? 24 : 34} tint={theme.isLight ? "light" : "dark"} style={StyleSheet.absoluteFill} />
      <LinearGradient
        pointerEvents="none"
        colors={theme.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[
          styles.reflection,
          { backgroundColor: isCosmos ? "rgba(233, 213, 255, 0.30)" : theme.isLight ? "rgba(255, 255, 255, 0.72)" : "rgba(255, 255, 255, 0.24)" }
        ]}
      />
      <View pointerEvents="none" style={[styles.topTint, { backgroundColor: theme.overlay }]} />
      <View pointerEvents="none" style={[styles.innerGlow, isCosmos && styles.cosmosInnerGlow, { backgroundColor: isCosmos ? theme.glow : theme.glowSoft }]} />
      {contentStyle ? <View style={contentStyle}>{children}</View> : children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: 1,
    borderRadius: radii.lg,
    overflow: "hidden",
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 18 },
    elevation: 5
  },
  reflection: {
    position: "absolute",
    top: 0,
    left: spacing.md,
    right: spacing.md,
    height: 1,
    borderRadius: radii.pill
  },
  topTint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    opacity: 0.72
  },
  innerGlow: {
    position: "absolute",
    top: -30,
    right: -40,
    width: 140,
    height: 100,
    borderRadius: 70
  },
  cosmosInnerGlow: {
    width: 170,
    height: 126,
    borderRadius: 85,
    opacity: 0.42
  },
  content: {}
});
