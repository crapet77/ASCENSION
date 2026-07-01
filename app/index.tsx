import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { AscensionLogo } from "@/components/AscensionLogo";
import { brand } from "@/constants/brand";
import { colors, spacing } from "@/constants/theme";
import { loadOnboardingPreferences } from "@/features/onboarding/onboardingStorage";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

const tabsRoute = "/(tabs)" as never;
const onboardingRoute = "/onboarding" as never;

export default function LaunchScreen() {
  const { theme } = useAscensionTheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadOnboardingPreferences().then((preferences) => {
        router.replace(preferences.completed ? tabsRoute : onboardingRoute);
      });
    }, 1400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient colors={theme.backgroundGradient} style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <AscensionLogo />
          <Text style={styles.version}>V1 · Discipline, sport, objectifs</Text>
        </View>
        <Text style={styles.footer}>{brand.motto}</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    padding: spacing.lg
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg
  },
  version: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  },
  footer: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center"
  }
});
