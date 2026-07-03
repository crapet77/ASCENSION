import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/constants/theme";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

type HeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function Header({ eyebrow, title, subtitle }: HeaderProps) {
  const { theme } = useAscensionTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.eyebrow, { color: theme.accentSoft }]}>{eyebrow}</Text>
      <Text style={[styles.title, { color: theme.text, textShadowColor: theme.glow }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.md
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: typography.eyebrowTracking,
    textTransform: "uppercase"
  },
  title: {
    color: colors.white,
    fontSize: 29,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: typography.titleTracking,
    lineHeight: 37,
    textShadowColor: "rgba(240, 184, 78, 0.12)",
    textShadowRadius: 12
  },
  subtitle: {
    color: "#C8C8C8",
    fontSize: 13,
    lineHeight: 22,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    letterSpacing: 0.18
  }
});
