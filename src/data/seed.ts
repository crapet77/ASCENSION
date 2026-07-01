import { Bet, DailyObjective, Habit } from "@/types/domain";

export const habits: Habit[] = [
  {
    id: "h1",
    title: "Reveil discipline",
    category: "mental",
    streak: 18,
    targetPerWeek: 7,
    completedToday: true
  },
  {
    id: "h2",
    title: "Entrainement",
    category: "physical",
    streak: 9,
    targetPerWeek: 5,
    completedToday: false
  },
  {
    id: "h3",
    title: "Session focus 90 min",
    category: "focus",
    streak: 12,
    targetPerWeek: 6,
    completedToday: true
  }
];

export const dailyObjectives: DailyObjective[] = [
  { id: "o1", label: "Completer 3 habitudes", done: true },
  { id: "o2", label: "Planifier la journee", done: true },
  { id: "o3", label: "Analyser la bankroll", done: false }
];

export const weeklyProgress = [72, 88, 64, 94, 80, 58, 76];

export const bets: Bet[] = [];
