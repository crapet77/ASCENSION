import AsyncStorage from "@react-native-async-storage/async-storage";

import { ObjectiveDefinition } from "@/engine/objectives/model";

export const OBJECTIVE_ENGINE_STORAGE_KEY = "@ascension/engine/objectives/v2";

const localObjectiveDefinitions: ObjectiveDefinition[] = [];

const removedSeedObjectiveIds = new Set([
  "objective-bankroll-5000",
  "objective-profit-250",
  "objective-roi-10",
  "objective-bets-30",
  "objective-discipline-30"
]);

export async function loadObjectiveDefinitions() {
  const rawObjectives = await AsyncStorage.getItem(OBJECTIVE_ENGINE_STORAGE_KEY);
  if (!rawObjectives) {
    return localObjectiveDefinitions;
  }

  const parsedObjectives = JSON.parse(rawObjectives) as ObjectiveDefinition[];
  return parsedObjectives.filter((objective) => !removedSeedObjectiveIds.has(objective.id));
}

export async function saveObjectiveDefinitions(objectives: ObjectiveDefinition[]) {
  await AsyncStorage.setItem(OBJECTIVE_ENGINE_STORAGE_KEY, JSON.stringify(objectives));
}
