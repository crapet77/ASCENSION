import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/constants/theme";

type DailyWelcomeProps = {
  title?: string;
  subtitle?: string;
};

export function DailyWelcome({
  title = "Bonjour Jérôme",
  subtitle = "Chaque petit pas compte aujourd’hui."
}: DailyWelcomeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: typography.fontFamily
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: typography.fontFamily
  }
});
