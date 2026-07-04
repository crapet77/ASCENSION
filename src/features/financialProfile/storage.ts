import AsyncStorage from "@react-native-async-storage/async-storage";

import { normalizeFinancialProfile } from "@/features/financialProfile/calculations";
import { FinancialProfile } from "@/features/financialProfile/types";
import { REAL_WEALTH_SOURCE_VERSION, realFinancialProfile } from "@/features/wealth/realWealthData";

export const FINANCIAL_PROFILE_STORAGE_KEY = "@ascension/financial-profile/v1";

export async function loadFinancialProfile(): Promise<FinancialProfile> {
  const rawProfile = await AsyncStorage.getItem(FINANCIAL_PROFILE_STORAGE_KEY);

  if (!rawProfile) {
    const seededProfile = normalizeFinancialProfile(realFinancialProfile);
    await saveFinancialProfile(seededProfile);
    return seededProfile;
  }

  const normalizedProfile = normalizeFinancialProfile(JSON.parse(rawProfile) as Partial<FinancialProfile>);

  if (normalizedProfile.sourceVersion !== REAL_WEALTH_SOURCE_VERSION) {
    const seededProfile = normalizeFinancialProfile(realFinancialProfile);
    await saveFinancialProfile(seededProfile);
    return seededProfile;
  }

  return normalizedProfile;
}

export async function saveFinancialProfile(profile: FinancialProfile) {
  await AsyncStorage.setItem(
    FINANCIAL_PROFILE_STORAGE_KEY,
    JSON.stringify(normalizeFinancialProfile({ ...profile, updatedAt: new Date().toISOString() }))
  );
}
