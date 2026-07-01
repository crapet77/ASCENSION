import { PropsWithChildren } from "react";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/constants/theme";

type SectionProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
}>;

export function Section({ title, action, children }: SectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
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
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.titleTracking,
    lineHeight: 22
  }
});
