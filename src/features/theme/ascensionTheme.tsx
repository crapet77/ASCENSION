import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import {
  loadOnboardingPreferences,
  normalizeOnboardingUniverse,
  OnboardingUniverse,
  saveOnboardingPreferences
} from "@/features/onboarding/onboardingStorage";

export type AscensionTheme = {
  id: OnboardingUniverse;
  name: string;
  isLight: boolean;
  backgroundGradient: [string, string, string, string, string];
  surfaceGradient: [string, string];
  cardGradient: [string, string, string];
  buttonGradient: [string, string, string, string];
  accent: string;
  accentSoft: string;
  accentBorder: string;
  text: string;
  textMuted: string;
  surface: string;
  glow: string;
  glowSoft: string;
  success: string;
  danger: string;
  line: string;
  overlay: string;
};

type AscensionThemeContextValue = {
  theme: AscensionTheme;
  setUniverse: (universe: OnboardingUniverse | string) => Promise<void>;
};

const themes: Record<OnboardingUniverse, AscensionTheme> = {
  carbon: {
    id: "carbon",
    name: "Carbone",
    isLight: false,
    backgroundGradient: ["#000000", "#020100", "#080604", "#050403", "#000000"],
    surfaceGradient: ["#111111", "#050505"],
    cardGradient: ["rgba(31, 30, 25, 0.86)", "rgba(8, 8, 8, 0.96)", "rgba(3, 3, 3, 0.99)"],
    buttonGradient: ["#FFF8D7", "#F9D98B", "#DFA545", "#9F6417"],
    accent: "#F0B84E",
    accentSoft: "#FFF2B8",
    accentBorder: "rgba(228, 169, 69, 0.28)",
    text: "#F8F7F2",
    textMuted: "#A7A7AA",
    surface: "#050505",
    glow: "rgba(240, 184, 78, 0.16)",
    glowSoft: "rgba(240, 184, 78, 0.046)",
    success: "#63E6A2",
    danger: "#FF6B6B",
    line: "rgba(255, 242, 184, 0.14)",
    overlay: "rgba(255, 255, 255, 0.055)"
  },
  nature: {
    id: "nature",
    name: "Nature",
    isLight: false,
    backgroundGradient: ["#020604", "#07110B", "#0E1D12", "#07120B", "#020604"],
    surfaceGradient: ["#102017", "#050B07"],
    cardGradient: ["rgba(20, 43, 28, 0.88)", "rgba(7, 17, 10, 0.96)", "rgba(3, 8, 5, 0.99)"],
    buttonGradient: ["#EFFFF1", "#9BE7A8", "#39A969", "#17603A"],
    accent: "#63E6A2",
    accentSoft: "#CBFFD9",
    accentBorder: "rgba(99, 230, 162, 0.30)",
    text: "#F5FFF8",
    textMuted: "#A7BBAE",
    surface: "#061009",
    glow: "rgba(99, 230, 162, 0.16)",
    glowSoft: "rgba(99, 230, 162, 0.052)",
    success: "#6EE7B7",
    danger: "#FF7B8B",
    line: "rgba(203, 255, 217, 0.14)",
    overlay: "rgba(203, 255, 217, 0.055)"
  },
  ocean: {
    id: "ocean",
    name: "Océan",
    isLight: false,
    backgroundGradient: ["#00050A", "#03101D", "#071B30", "#03101D", "#00050A"],
    surfaceGradient: ["#0B1A2A", "#02070D"],
    cardGradient: ["rgba(14, 36, 58, 0.88)", "rgba(4, 13, 24, 0.96)", "rgba(1, 6, 12, 0.99)"],
    buttonGradient: ["#EAF6FF", "#9FD5FF", "#3E8DD6", "#174D87"],
    accent: "#6EA8FF",
    accentSoft: "#D6EBFF",
    accentBorder: "rgba(110, 168, 255, 0.30)",
    text: "#F4FAFF",
    textMuted: "#A7B7C8",
    surface: "#02070D",
    glow: "rgba(110, 168, 255, 0.16)",
    glowSoft: "rgba(110, 168, 255, 0.052)",
    success: "#6EE7B7",
    danger: "#FF7B8B",
    line: "rgba(214, 235, 255, 0.14)",
    overlay: "rgba(214, 235, 255, 0.052)"
  },
  blossom: {
    id: "blossom",
    name: "Blossom",
    isLight: false,
    backgroundGradient: ["#140F22", "#171127", "#1E1630", "#171127", "#0B0813"],
    surfaceGradient: ["#2A1E3E", "#1E1630"],
    cardGradient: ["rgba(42, 30, 62, 0.88)", "rgba(30, 22, 48, 0.96)", "rgba(20, 15, 34, 0.99)"],
    buttonGradient: ["#FFF0FB", "#FFB7E8", "#F58CCF", "#A94C8C"],
    accent: "#F58CCF",
    accentSoft: "#FFB7E8",
    accentBorder: "rgba(245, 140, 207, 0.34)",
    text: "#FFFFFF",
    textMuted: "#D9CBE8",
    surface: "#1E1630",
    glow: "rgba(245, 140, 207, 0.18)",
    glowSoft: "rgba(245, 140, 207, 0.060)",
    success: "#6EE7B7",
    danger: "#FF7B8B",
    line: "rgba(255, 183, 232, 0.16)",
    overlay: "rgba(255, 183, 232, 0.060)"
  },
  cosmos: {
    id: "cosmos",
    name: "Cosmos",
    isLight: false,
    backgroundGradient: ["#02030A", "#070A18", "#111432", "#170D2A", "#02030A"],
    surfaceGradient: ["#171535", "#050713"],
    cardGradient: ["rgba(36, 32, 76, 0.72)", "rgba(13, 15, 39, 0.92)", "rgba(3, 5, 16, 0.98)"],
    buttonGradient: ["#FFFFFF", "#E6DCFF", "#A78BFA", "#4C1D95"],
    accent: "#8B5CF6",
    accentSoft: "#E9D5FF",
    accentBorder: "rgba(196, 181, 253, 0.34)",
    text: "#FCFAFF",
    textMuted: "#C7C0E8",
    surface: "#050713",
    glow: "rgba(139, 92, 246, 0.22)",
    glowSoft: "rgba(139, 92, 246, 0.072)",
    success: "#6EE7B7",
    danger: "#FF7B8B",
    line: "rgba(233, 213, 255, 0.16)",
    overlay: "rgba(233, 213, 255, 0.062)"
  }
};

const AscensionThemeContext = createContext<AscensionThemeContextValue>({
  theme: themes.carbon,
  setUniverse: async () => undefined
});

export function AscensionThemeProvider({ children }: PropsWithChildren) {
  const [universe, setUniverseState] = useState<OnboardingUniverse>("carbon");

  useEffect(() => {
    loadOnboardingPreferences().then((preferences) => {
      const nextUniverse = normalizeOnboardingUniverse(preferences.universe) ?? "carbon";
      if (nextUniverse) {
        setUniverseState(nextUniverse);
      }
    });
  }, []);

  const value = useMemo<AscensionThemeContextValue>(
    () => ({
      theme: themes[universe] ?? themes.blossom,
      async setUniverse(nextUniverse) {
        const normalizedUniverse = normalizeOnboardingUniverse(nextUniverse) ?? "blossom";
        setUniverseState(normalizedUniverse);
        await saveOnboardingPreferences({ universe: normalizedUniverse });
      }
    }),
    [universe]
  );

  return (
    <AscensionThemeContext.Provider value={value}>
      {children}
    </AscensionThemeContext.Provider>
  );
}

export function useAscensionTheme() {
  return useContext(AscensionThemeContext);
}

export function getAscensionTheme(universe: OnboardingUniverse | string | null | undefined) {
  return themes[normalizeOnboardingUniverse(universe) ?? "carbon"] ?? themes.blossom;
}
