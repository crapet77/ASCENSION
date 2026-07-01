import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { radii, spacing } from "@/constants/theme";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  elevated?: boolean;
}>;

export function GlassCard({ children, style, contentStyle, elevated = true }: GlassCardProps) {
  const { theme } = useAscensionTheme();

  return (
    <View
      style={[
        styles.shell,
        {
          borderColor: theme.accentBorder,
          shadowColor: theme.accent,
          shadowOpacity: elevated ? (theme.isLight ? 0.16 : 0.22) : 0.08
        },
        style
      ]}
    >
      <BlurView intensity={theme.isLight ? 24 : 34} tint={theme.isLight ? "light" : "dark"} style={StyleSheet.absoluteFill} />
      <LinearGradient
        pointerEvents="none"
        colors={theme.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[styles.reflection, { backgroundColor: theme.isLight ? "rgba(255, 255, 255, 0.72)" : "rgba(255, 255, 255, 0.20)" }]} />
      <View pointerEvents="none" style={[styles.innerGlow, { backgroundColor: theme.glowSoft }]} />
      {contentStyle ? <View style={contentStyle}>{children}</View> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: 1,
    borderRadius: radii.md,
    overflow: "hidden",
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 4
  },
  reflection: {
    position: "absolute",
    top: 0,
    left: spacing.md,
    right: spacing.md,
    height: 1,
    borderRadius: radii.pill
  },
  innerGlow: {
    position: "absolute",
    top: -30,
    right: -40,
    width: 140,
    height: 100,
    borderRadius: 70
  },
  content: {}
});
