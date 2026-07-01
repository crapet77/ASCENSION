import { getBankrollStats } from "@/features/bankroll/math";
import { loadBankrollState } from "@/features/bankroll/storage";
import { loadHabits } from "@/features/discipline/storage";
import { getBestStreak } from "@/features/dashboard/dashboardMath";
import { ObjectiveDefinition, ObjectiveRuntimeData } from "@/engine/objectives/model";
import {
  loadObjectiveDefinitions,
  saveObjectiveDefinitions
} from "@/engine/objectives/storage";

export async function fetchObjectiveDefinitions() {
  return loadObjectiveDefinitions();
}

export async function persistObjectiveDefinitions(objectives: ObjectiveDefinition[]) {
  await saveObjectiveDefinitions(objectives);
}

export async function fetchObjectiveRuntimeData(): Promise<ObjectiveRuntimeData> {
  const [bankroll, habits] = await Promise.all([loadBankrollState(), loadHabits()]);
  const stats = getBankrollStats(bankroll);

  return {
    bankroll: stats.currentCapital,
    profit: stats.profit,
    roi: stats.roi,
    analyzedBets: stats.placedCount,
    winRate: stats.winRate,
    disciplineStreak: getBestStreak(habits)
  };
}
