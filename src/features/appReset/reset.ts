import AsyncStorage from "@react-native-async-storage/async-storage";

import { BANKROLL_STATE_STORAGE_KEY, BANKROLL_STORAGE_KEY } from "@/features/bankroll/storage";
import { TICKETS_STORAGE_KEY } from "@/features/tickets/storage";
import { USER_ACCESS_STORAGE_KEY } from "@/features/access/userAccess";
import { ONBOARDING_STORAGE_KEY } from "@/features/onboarding/onboardingStorage";

const RESET_KEYS = [
  BANKROLL_STORAGE_KEY,
  BANKROLL_STATE_STORAGE_KEY,
  TICKETS_STORAGE_KEY,
  USER_ACCESS_STORAGE_KEY,
  ONBOARDING_STORAGE_KEY,
  "@ascension/betting/v1",
  "@ascension/discipline/v1",
  "@ascension/objectives/v1",
  "@ascension/history/v1"
];

export async function resetAscensionData() {
  await AsyncStorage.multiRemove(RESET_KEYS);
}
