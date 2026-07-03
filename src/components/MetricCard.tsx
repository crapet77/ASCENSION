import { StyleSheet, Text, View } from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { colors, radii, shadows, spacing, typography } from "@/constants/theme";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: "gold" | "neutral" | "success" | "danger";
};

export function MetricCard({ label, value, detail, tone = "neutral" }: MetricCardProps) {
  const { theme } = useAscensionTheme();
  const accent = tone === "success" ? theme.success : tone === "danger" ? theme.danger : theme.accent;

  return (
    <GlassCard style={styles.card} contentStyle={styles.content}>
      <View style={styles.carbonLineA} />
      <View style={styles.carbonLineB} />
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.value, { color: tone === "success" ? theme.success : tone === "danger" ? theme.danger : theme.text, textShadowColor: theme.glow }]}>{value}</Text>
      {detail ? <Text style={[styles.detail, { color: theme.textMuted }]}>{detail}</Text> : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 156
  },
  content: {
    padding: 19,
    gap: spacing.xs,
    overflow: "hidden"
  },
  carbonLineA: {
    position: "absolute",
    top: 24,
    left: -24,
    width: 240,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.026)",
    transform: [{ rotate: "-18deg" }]
  },
  carbonLineB: {
    position: "absolute",
    bottom: 22,
    right: -28,
    width: 240,
    height: 1,
    backgroundColor: "rgba(255, 229, 166, 0.038)",
    transform: [{ rotate: "18deg" }]
  },
  accent: {
    width: 28,
    height: 3,
    borderRadius: radii.pill,
    marginBottom: spacing.xs
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    letterSpacing: 0.55,
    textTransform: "uppercase",
    lineHeight: 17
  },
  value: {
    color: colors.white,
    fontSize: 24,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.1,
    lineHeight: 31,
    textShadowColor: "rgba(228, 169, 69, 0.20)",
    textShadowRadius: 12
  },
  detail: {
    color: "#C8C8C8",
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    letterSpacing: 0.05,
    lineHeight: 16
  }
});
