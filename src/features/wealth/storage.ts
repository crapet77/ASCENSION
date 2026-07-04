import AsyncStorage from "@react-native-async-storage/async-storage";

import { normalizeWealthState } from "@/features/wealth/calculations";
import { REAL_WEALTH_SOURCE_VERSION, realWealthState } from "@/features/wealth/realWealthData";
import { WealthState } from "@/features/wealth/types";

export const WEALTH_STORAGE_KEY = "@ascension/wealth/v1";

export async function loadWealthState(): Promise<WealthState> {
  const rawState = await AsyncStorage.getItem(WEALTH_STORAGE_KEY);

  if (!rawState) {
    const seededState = normalizeWealthState(realWealthState);
    await saveWealthState(seededState);
    return seededState;
  }

  const normalizedState = normalizeWealthState(JSON.parse(rawState) as Partial<WealthState>);

  if (normalizedState.sourceVersion !== REAL_WEALTH_SOURCE_VERSION) {
    const seededState = normalizeWealthState(realWealthState);
    await saveWealthState(seededState);
    return seededState;
  }

  return normalizedState;
}

export async function saveWealthState(state: WealthState) {
  await AsyncStorage.setItem(
    WEALTH_STORAGE_KEY,
    JSON.stringify(normalizeWealthState({ ...state, updatedAt: new Date().toISOString() }))
  );
}
