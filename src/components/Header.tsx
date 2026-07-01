import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/constants/theme";

type HeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function Header({ eyebrow, title, subtitle }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
    fontWeight: "700",
    letterSpacing: typography.eyebrowTracking,
    textTransform: "uppercase"
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
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
    letterSpacing: 0.06
  }
});
