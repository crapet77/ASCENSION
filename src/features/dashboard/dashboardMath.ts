import { DailyObjective, Habit } from "@/types/domain";

export function getDisciplineScore(habits: Habit[], objectives: DailyObjective[]) {
  // Le score V1 combine l'execution des habitudes et les objectifs du jour.
  const habitCompletion = habits.filter((habit) => habit.completedToday).length / habits.length;
  const objectiveCompletion =
    objectives.filter((objective) => objective.done).length / objectives.length;

  return Math.round((habitCompletion * 0.6 + objectiveCompletion * 0.4) * 100);
}

export function getBestStreak(habits: Habit[]) {
  return Math.max(...habits.map((habit) => habit.streak));
}
