import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import {
  loadOnboardingPreferences,
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
};

type AscensionThemeContextValue = {
  theme: AscensionTheme;
  setUniverse: (universe: OnboardingUniverse) => Promise<void>;
};

const themes: Record<OnboardingUniverse, AscensionTheme> = {
  aurora: {
    id: "aurora",
    name: "Aurore",
    isLight: false,
    backgroundGradient: ["#060506", "#180D12", "#3B1B18", "#12212A", "#031017"],
    surfaceGradient: ["#2B1816", "#07131B"],
    cardGradient: ["rgba(87, 47, 38, 0.72)", "rgba(21, 24, 29, 0.92)", "rgba(4, 10, 14, 0.98)"],
    buttonGradient: ["#FFF4CD", "#FFC96F", "#F08B49", "#7B3E1D"],
    accent: "#FFB45E",
    accentSoft: "#FFE0A3",
    accentBorder: "rgba(255, 180, 94, 0.34)",
    text: "#FFF8EF",
    textMuted: "#D4BDB2",
    surface: "#071017",
    glow: "rgba(255, 148, 76, 0.18)",
    glowSoft: "rgba(255, 180, 94, 0.060)"
  },
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
    glowSoft: "rgba(240, 184, 78, 0.046)"
  },
  elegance: {
    id: "elegance",
    name: "Élégance",
    isLight: true,
    backgroundGradient: ["#F7F4EE", "#EEE8DD", "#FDFBF7", "#E7E0D4", "#F9F6F0"],
    surfaceGradient: ["#FFFFFF", "#EFE8DD"],
    cardGradient: ["rgba(255, 255, 255, 0.96)", "rgba(243, 238, 229, 0.98)", "rgba(228, 220, 206, 0.96)"],
    buttonGradient: ["#2A241C", "#66533B", "#B9975B", "#F5D896"],
    accent: "#B9975B",
    accentSoft: "#FFF5CF",
    accentBorder: "rgba(185, 151, 91, 0.34)",
    text: "#171513",
    textMuted: "#6F675B",
    surface: "#FFFFFF",
    glow: "rgba(185, 151, 91, 0.20)",
    glowSoft: "rgba(185, 151, 91, 0.075)"
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
    glowSoft: "rgba(99, 230, 162, 0.052)"
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
    glowSoft: "rgba(110, 168, 255, 0.052)"
  },
  cosmos: {
    id: "cosmos",
    name: "Cosmos",
    isLight: false,
    backgroundGradient: ["#05020B", "#10091F", "#1A1238", "#090E27", "#02040A"],
    surfaceGradient: ["#1D1234", "#050711"],
    cardGradient: ["rgba(54, 34, 82, 0.76)", "rgba(13, 12, 31, 0.94)", "rgba(4, 5, 14, 0.99)"],
    buttonGradient: ["#FFF4FF", "#DDA8FF", "#8C5CFF", "#3E1F8A"],
    accent: "#B47CFF",
    accentSoft: "#F0D7FF",
    accentBorder: "rgba(180, 124, 255, 0.34)",
    text: "#FCF7FF",
    textMuted: "#BFB3D7",
    surface: "#060711",
    glow: "rgba(180, 124, 255, 0.17)",
    glowSoft: "rgba(180, 124, 255, 0.056)"
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
      if (preferences.universe) {
        setUniverseState(preferences.universe);
      }
    });
  }, []);

  const value = useMemo<AscensionThemeContextValue>(
    () => ({
      theme: themes[universe],
      async setUniverse(nextUniverse) {
        setUniverseState(nextUniverse);
        await saveOnboardingPreferences({ universe: nextUniverse });
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

export function getAscensionTheme(universe: OnboardingUniverse) {
  return themes[universe];
}
