import { PropsWithChildren } from "react";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/constants/theme";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

type SectionProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
}>;

export function Section({ title, action, children }: SectionProps) {
  const { theme } = useAscensionTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.accentSoft }]}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm
  },
  header: {
    minHeight: 32,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 1.7,
    lineHeight: 21,
    textTransform: "uppercase"
  }
});
