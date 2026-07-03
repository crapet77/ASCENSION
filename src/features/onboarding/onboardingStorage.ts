import AsyncStorage from "@react-native-async-storage/async-storage";

export type OnboardingUniverse = "carbon" | "nature" | "ocean" | "blossom" | "cosmos";
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
  let storedPreferences: Partial<OnboardingPreferences> & { universe?: string | null } = {};

  if (rawPreferences) {
    try {
      storedPreferences = JSON.parse(rawPreferences) as Partial<OnboardingPreferences> & { universe?: string | null };
    } catch {
      storedPreferences = {};
    }
  }

  const preferences = {
    ...defaultOnboardingPreferences,
    ...storedPreferences
  };

  const nextPreferences = {
    ...preferences,
    universe: normalizeOnboardingUniverse(preferences.universe)
  };

  if (preferences.universe !== nextPreferences.universe) {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(nextPreferences));
  }

  return nextPreferences;
}

export async function saveOnboardingPreferences(preferences: Partial<OnboardingPreferences>) {
  const currentPreferences = await loadOnboardingPreferences();
  const incomingPreferences = preferences as Partial<OnboardingPreferences> & { universe?: string | null };
  const hasUniverse = Object.prototype.hasOwnProperty.call(incomingPreferences, "universe");
  const nextPreferences = {
    ...currentPreferences,
    ...preferences,
    universe: hasUniverse ? normalizeOnboardingUniverse(incomingPreferences.universe) : currentPreferences.universe
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

export function normalizeOnboardingUniverse(universe: string | null | undefined): OnboardingUniverse | null {
  if (!universe) {
    return null;
  }

  const normalizedUniverse = universe
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalizedUniverse === "carbon" || normalizedUniverse === "carbone") {
    return "carbon";
  }

  if (normalizedUniverse === "nature") {
    return "nature";
  }

  if (normalizedUniverse === "ocean" || normalizedUniverse === "oceans") {
    return "ocean";
  }

  if (normalizedUniverse === "blossom") {
    return "blossom";
  }

  if (normalizedUniverse === "cosmos") {
    return "cosmos";
  }

  if (
    normalizedUniverse === "aurora" ||
    normalizedUniverse === "aurore" ||
    normalizedUniverse === "elegance" ||
    normalizedUniverse === "elegant" ||
    normalizedUniverse === "girly"
  ) {
    return "blossom";
  }

  return "blossom";
}
