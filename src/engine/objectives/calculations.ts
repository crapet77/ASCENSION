import {
  ObjectiveCategory,
  ObjectiveDefinition,
  ObjectiveProgress,
  ObjectiveRuntimeData,
  ObjectiveStatus
} from "@/engine/objectives/model";

export function getObjectiveProgress(
  objective: ObjectiveDefinition,
  runtimeData: ObjectiveRuntimeData
): ObjectiveProgress {
  const currentValue = getCurrentValueForObjective(objective.category, runtimeData);
  const progressPercent =
    objective.targetValue > 0 ? Math.min((currentValue / objective.targetValue) * 100, 100) : 0;
  const status = resolveObjectiveStatus(objective.status, currentValue, objective.targetValue);

  return {
    id: objective.id,
    title: objective.title,
    category: objective.category,
    currentValue,
    targetValue: objective.targetValue,
    progressPercent,
    status,
    estimatedTimeLabel: getEstimatedTimeLabel(objective.category, currentValue, objective.targetValue),
    createdAt: objective.createdAt,
    archivedAt: objective.archivedAt
  };
}

export function getObjectiveEngineProgress(
  objectives: ObjectiveDefinition[],
  runtimeData: ObjectiveRuntimeData
) {
  const progress = objectives.map((objective) => getObjectiveProgress(objective, runtimeData));

  return {
    objectives: progress,
    activeObjectives: progress.filter((objective) => objective.status === "active"),
    achievedObjectives: progress.filter((objective) => objective.status === "achieved"),
    archivedObjectives: progress.filter((objective) => objective.status === "archived")
  };
}

export function syncObjectiveDefinitionsWithProgress(
  definitions: ObjectiveDefinition[],
  progress: ObjectiveProgress[]
) {
  const progressById = new Map(progress.map((objective) => [objective.id, objective]));

  return definitions.map((definition) => {
    const currentProgress = progressById.get(definition.id);

    if (!currentProgress || definition.status === "archived") {
      return definition;
    }

    return {
      ...definition,
      status: currentProgress.status
    };
  });
}

function getCurrentValueForObjective(category: ObjectiveCategory, data: ObjectiveRuntimeData) {
  switch (category) {
    case "bankroll_target":
      return data.bankroll;
    case "profit_target":
      return data.profit;
    case "roi_target":
      return data.roi;
    case "analyzed_bets_target":
      return data.analyzedBets;
    case "discipline_streak_target":
      return data.disciplineStreak;
  }
}

function resolveObjectiveStatus(
  storedStatus: ObjectiveStatus,
  currentValue: number,
  targetValue: number
): ObjectiveStatus {
  if (storedStatus === "archived") {
    return "archived";
  }

  return currentValue >= targetValue ? "achieved" : "active";
}

function getEstimatedTimeLabel(category: ObjectiveCategory, currentValue: number, targetValue: number) {
  const remainingValue = Math.max(targetValue - currentValue, 0);

  if (remainingValue === 0) {
    return "Objectif atteint";
  }

  if (category === "discipline_streak_target") {
    return `Environ ${Math.ceil(remainingValue)} jour(s)`;
  }

  if (category === "analyzed_bets_target") {
    return `Encore ${Math.ceil(remainingValue)} pari(s)`;
  }

  return null;
}
