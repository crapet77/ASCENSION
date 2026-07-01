import AsyncStorage from "@react-native-async-storage/async-storage";

import { ObjectiveDefinition } from "@/engine/objectives/model";

export const OBJECTIVE_ENGINE_STORAGE_KEY = "@ascension/engine/objectives/v2";

const localObjectiveDefinitions: ObjectiveDefinition[] = [
  {
    id: "objective-bankroll-5000",
    title: "Atteindre 5 000 € de bankroll",
    category: "bankroll_target",
    targetValue: 5000,
    status: "active",
    createdAt: "2026-06-30T08:00:00.000Z"
  },
  {
    id: "objective-profit-250",
    title: "Atteindre 250 € de bénéfice",
    category: "profit_target",
    targetValue: 250,
    status: "active",
    createdAt: "2026-06-30T08:00:00.000Z"
  },
  {
    id: "objective-roi-10",
    title: "Atteindre 10 % de ROI",
    category: "roi_target",
    targetValue: 10,
    status: "active",
    createdAt: "2026-06-30T08:00:00.000Z"
  },
  {
    id: "objective-bets-30",
    title: "Analyser 30 paris",
    category: "analyzed_bets_target",
    targetValue: 30,
    status: "active",
    createdAt: "2026-06-30T08:00:00.000Z"
  },
  {
    id: "objective-discipline-30",
    title: "Atteindre 30 jours de discipline",
    category: "discipline_streak_target",
    targetValue: 30,
    status: "active",
    createdAt: "2026-06-30T08:00:00.000Z"
  }
];

export async function loadObjectiveDefinitions() {
  const rawObjectives = await AsyncStorage.getItem(OBJECTIVE_ENGINE_STORAGE_KEY);
  return rawObjectives ? (JSON.parse(rawObjectives) as ObjectiveDefinition[]) : localObjectiveDefinitions;
}

export async function saveObjectiveDefinitions(objectives: ObjectiveDefinition[]) {
  await AsyncStorage.setItem(OBJECTIVE_ENGINE_STORAGE_KEY, JSON.stringify(objectives));
}
