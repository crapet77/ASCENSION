import AsyncStorage from "@react-native-async-storage/async-storage";

export type OnboardingUniverse = "aurora" | "carbon" | "elegance" | "nature" | "ocean" | "cosmos";
export type OnboardingGoal = "learn" | "wealth" | "invest" | "opportunities";

export type OnboardingPreferences = {
  completed: boolean;
  universe: OnboardingUniverse | null;
  goal: OnboardingGoal | null;
  completedAt: string | null;
};

export const ONBOARDING_STORAGE_KEY = "@ascension/onboarding/v1";

const defaultOnboardingPreferences: OnboardingPreferences = {
  completed: false,
  universe: null,
  goal: null,
  completedAt: null
};

export async function loadOnboardingPreferences() {
  const rawPreferences = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
  return rawPreferences
    ? { ...defaultOnboardingPreferences, ...(JSON.parse(rawPreferences) as OnboardingPreferences) }
    : defaultOnboardingPreferences;
}

export async function saveOnboardingPreferences(preferences: Partial<OnboardingPreferences>) {
  const currentPreferences = await loadOnboardingPreferences();
  const nextPreferences = {
    ...currentPreferences,
    ...preferences
  };

  await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(nextPreferences));
  return nextPreferences;
}

export async function completeOnboarding(preferences: Pick<OnboardingPreferences, "universe" | "goal">) {
  return saveOnboardingPreferences({
    ...preferences,
    completed: true,
    completedAt: new Date().toISOString()
  });
}
