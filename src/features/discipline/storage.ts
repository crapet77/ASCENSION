import AsyncStorage from "@react-native-async-storage/async-storage";

import { Habit } from "@/types/domain";

export const DISCIPLINE_STORAGE_KEY = "@ascension/discipline/v1";

export async function loadHabits(): Promise<Habit[]> {
  const rawHabits = await AsyncStorage.getItem(DISCIPLINE_STORAGE_KEY);

  if (!rawHabits) {
    return [];
  }

  const parsedHabits = JSON.parse(rawHabits) as Habit[];
  return Array.isArray(parsedHabits) ? parsedHabits : [];
}

export async function saveHabits(habits: Habit[]) {
  await AsyncStorage.setItem(DISCIPLINE_STORAGE_KEY, JSON.stringify(habits));
}
