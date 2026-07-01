export type ObjectiveCategory =
  | "bankroll_target"
  | "profit_target"
  | "roi_target"
  | "analyzed_bets_target"
  | "discipline_streak_target";

export type ObjectiveStatus = "active" | "achieved" | "archived";

export type ObjectiveDefinition = {
  id: string;
  title: string;
  category: ObjectiveCategory;
  targetValue: number;
  status: ObjectiveStatus;
  createdAt: string;
  archivedAt?: string;
};

export type ObjectiveRuntimeData = {
  bankroll: number;
  profit: number;
  roi: number;
  analyzedBets: number;
  winRate: number;
  disciplineStreak: number;
};

export type ObjectiveProgress = {
  id: string;
  title: string;
  category: ObjectiveCategory;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  status: ObjectiveStatus;
  estimatedTimeLabel: string | null;
  createdAt: string;
  archivedAt?: string;
};

export type ObjectiveEngineState = {
  objectives: ObjectiveProgress[];
  activeObjectives: ObjectiveProgress[];
  achievedObjectives: ObjectiveProgress[];
  archivedObjectives: ObjectiveProgress[];
  runtimeData: ObjectiveRuntimeData;
};

export type FinancialObjective = ObjectiveDefinition;
