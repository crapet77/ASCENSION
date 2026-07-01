export type Habit = {
  id: string;
  title: string;
  category: "mental" | "physical" | "focus";
  streak: number;
  targetPerWeek: number;
  completedToday: boolean;
};

export type BetResult = "pending" | "won" | "lost" | "void";

export type Bet = {
  id: string;
  event: string;
  odds: number;
  stake: number;
  result: BetResult;
  placedAt: string;
};

export type DailyObjective = {
  id: string;
  label: string;
  done: boolean;
};
