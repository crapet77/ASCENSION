import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { colors, radii, spacing, typography } from "@/constants/theme";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

type PremiumButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function PremiumButton({ label, icon, onPress, style, disabled = false }: PremiumButtonProps) {
  const { theme } = useAscensionTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.pressable,
        { shadowColor: theme.accent },
        style,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed
      ]}
    >
      <LinearGradient
        colors={theme.buttonGradient}
        locations={[0, 0.30, 0.68, 1]}
        style={styles.inner}
      >
        <View style={styles.lightLine} />
        <View style={styles.metalReflection} />
        <Ionicons name={icon} color={theme.isLight ? colors.white : colors.black} size={15} />
        <Text style={[styles.label, { color: theme.isLight ? colors.white : colors.black }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    minHeight: 38,
    borderRadius: 17,
    shadowColor: "#F1C66F",
    shadowOpacity: 0.20,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.96
  },
  disabled: {
    opacity: 0.55
  },
  inner: {
    minHeight: 38,
    borderRadius: 17,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.38)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    overflow: "hidden"
  },
  lightLine: {
    position: "absolute",
    top: 3,
    left: spacing.sm,
    right: spacing.sm,
    height: 1,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.74)"
  },
  metalReflection: {
    position: "absolute",
    bottom: 3,
    left: spacing.sm,
    right: spacing.sm,
    height: 1,
    borderRadius: radii.pill,
    backgroundColor: "rgba(100, 54, 7, 0.22)"
  },
  label: {
    color: colors.black,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.7
  }
});
