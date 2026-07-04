import AsyncStorage from "@react-native-async-storage/async-storage";

import { masterclassCategories, masterclasses } from "@/features/masterclass/data";
import { MasterclassProgressEntry, MasterclassState } from "@/features/masterclass/types";

export const MASTERCLASS_STORAGE_KEY = "@ascension/masterclass/v1";

export async function loadMasterclassState(): Promise<MasterclassState> {
  const rawProgress = await AsyncStorage.getItem(MASTERCLASS_STORAGE_KEY);
  const progress = rawProgress ? (JSON.parse(rawProgress) as MasterclassProgressEntry[]) : [];

  return {
    categories: masterclassCategories,
    masterclasses,
    progress,
    stats: getMasterclassStats(progress)
  };
}

export async function saveMasterclassProgress(progress: MasterclassProgressEntry[]) {
  await AsyncStorage.setItem(MASTERCLASS_STORAGE_KEY, JSON.stringify(progress));
}

export async function startMasterclass(masterclassId: string) {
  const state = await loadMasterclassState();
  const existing = state.progress.find((entry) => entry.masterclassId === masterclassId);

  if (existing) {
    return state;
  }

  const nextProgress: MasterclassProgressEntry[] = [
    ...state.progress,
    {
      masterclassId,
      status: "in_progress",
      startedAt: new Date().toISOString()
    }
  ];
  await saveMasterclassProgress(nextProgress);
  return loadMasterclassState();
}

export async function completeMasterclass(masterclassId: string) {
  const state = await loadMasterclassState();
  const now = new Date().toISOString();
  const existing = state.progress.find((entry) => entry.masterclassId === masterclassId);
  const nextProgress: MasterclassProgressEntry[] = existing
    ? state.progress.map((entry) =>
        entry.masterclassId === masterclassId
          ? { ...entry, status: "completed", completedAt: now, startedAt: entry.startedAt ?? now }
          : entry
      )
    : [
        ...state.progress,
        {
          masterclassId,
          status: "completed",
          startedAt: now,
          completedAt: now
        }
      ];

  await saveMasterclassProgress(nextProgress);
  return loadMasterclassState();
}

function getMasterclassStats(progress: MasterclassProgressEntry[]) {
  const startedCount = progress.filter((entry) => entry.status === "in_progress" || entry.status === "completed").length;
  const completedCount = progress.filter((entry) => entry.status === "completed").length;
  const totalCount = masterclasses.length;

  return {
    startedCount,
    completedCount,
    totalCount,
    progressPercent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  };
}
