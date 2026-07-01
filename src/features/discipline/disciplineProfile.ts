import AsyncStorage from "@react-native-async-storage/async-storage";

import { getBankrollStats } from "@/features/bankroll/math";
import { BankrollBet, BankrollState } from "@/features/bankroll/types";
import { DailyObjective, Habit } from "@/types/domain";

export type DisciplineDayStatus = "respected" | "partial" | "missed" | "future";

export type DisciplineDay = {
  date: string;
  label: string;
  status: DisciplineDayStatus;
};

export type DisciplineProfile = {
  score: number;
  xp: number;
  level: string;
  currentStreak: number;
  week: DisciplineDay[];
  updatedAt: string;
};

export const DISCIPLINE_PROFILE_STORAGE_KEY = "@ascension/discipline/profile/v1";

const levelThresholds = [
  { level: "Ascension Elite", xp: 10000 },
  { level: "Diamant", xp: 6000 },
  { level: "Platine", xp: 3000 },
  { level: "Or", xp: 1500 },
  { level: "Argent", xp: 500 },
  { level: "Bronze", xp: 0 }
];

export async function loadDisciplineProfile() {
  const rawProfile = await AsyncStorage.getItem(DISCIPLINE_PROFILE_STORAGE_KEY);
  return rawProfile ? (JSON.parse(rawProfile) as DisciplineProfile) : null;
}

export async function saveDisciplineProfile(profile: DisciplineProfile) {
  await AsyncStorage.setItem(DISCIPLINE_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function calculateDisciplineProfile(params: {
  bankroll: BankrollState;
  habits: Habit[];
  objectives: DailyObjective[];
  today?: Date;
}): DisciplineProfile {
  const today = startOfDay(params.today ?? new Date());
  const stats = getBankrollStats(params.bankroll);
  const week = getCurrentWeek(today).map((date) =>
    getDisciplineDay(date, today, params.bankroll, params.habits)
  );
  const scoredDays = week.filter((day) => day.status !== "future");
  const weekScore =
    scoredDays.length > 0
      ? scoredDays.reduce((total, day) => total + getDayScore(day.status), 0) / scoredDays.length
      : 0;
  const completedHabitRatio =
    params.habits.length > 0
      ? params.habits.filter((habit) => habit.completedToday).length / params.habits.length
      : 0;
  const completedObjectiveRatio =
    params.objectives.length > 0
      ? params.objectives.filter((objective) => objective.done).length / params.objectives.length
      : 0;
  const manualBetPenalty = Math.min(getManualBetCount(params.bankroll.bets) * 4, 18);
  const inactivityPenalty = Math.min(getRecentInactivityCount(week) * 3, 12);
  const bankrollRespectBonus = respectsBankroll(params.bankroll) ? 8 : -8;
  const score = clamp(
    Math.round(
      weekScore * 0.5 +
        completedHabitRatio * 22 +
        completedObjectiveRatio * 12 +
        bankrollRespectBonus -
        manualBetPenalty -
        inactivityPenalty
    ),
    0,
    100
  );
  const xp = calculateDisciplineXp({
    bankroll: params.bankroll,
    currentStreak: getCurrentDisciplineStreak(params.bankroll, today),
    greenDays: week.filter((day) => day.status === "respected").length,
    completedHabits: params.habits.filter((habit) => habit.completedToday).length,
    achievedObjectiveCount: getAchievedObjectiveCount(params.bankroll, params.objectives)
  });

  return {
    score,
    xp,
    level: getDisciplineLevel(xp),
    currentStreak: getCurrentDisciplineStreak(params.bankroll, today),
    week,
    updatedAt: new Date().toISOString()
  };
}

function getDisciplineDay(
  date: Date,
  today: Date,
  bankroll: BankrollState,
  habits: Habit[]
): DisciplineDay {
  if (date.getTime() > today.getTime()) {
    return {
      date: toDateKey(date),
      label: getDayLabel(date),
      status: "future"
    };
  }

  return {
    date: toDateKey(date),
    label: getDayLabel(date),
    status: getDayStatus(date, bankroll, habits)
  };
}

function getDayStatus(date: Date, bankroll: BankrollState, habits: Habit[]): DisciplineDayStatus {
  const dayBets = bankroll.bets.filter((bet) => getBetDateKey(bet) === toDateKey(date));
  const ticketBets = dayBets.filter((bet) => bet.source === "ticket");
  const manualBets = dayBets.filter((bet) => bet.source === "manual");

  if (manualBets.length > 0) {
    return "missed";
  }

  if (ticketBets.length > 0) {
    return ticketBets.every((bet) => respectsStake(bankroll, bet)) ? "respected" : "partial";
  }

  if (isToday(date) && habits.some((habit) => habit.completedToday)) {
    return "partial";
  }

  return "missed";
}

function calculateDisciplineXp(params: {
  bankroll: BankrollState;
  currentStreak: number;
  greenDays: number;
  completedHabits: number;
  achievedObjectiveCount: number;
}) {
  const stats = getBankrollStats(params.bankroll);
  const settledBets = params.bankroll.bets.filter(
    (bet) => bet.result === "won" || bet.result === "lost" || bet.result === "void"
  ).length;

  return (
    300 +
    stats.placedCount * 35 +
    settledBets * 12 +
    params.currentStreak * 24 +
    params.greenDays * 18 +
    params.completedHabits * 20 +
    params.achievedObjectiveCount * 150 +
    (stats.profit > 0 ? 120 : 0)
  );
}

function getAchievedObjectiveCount(bankroll: BankrollState, objectives: DailyObjective[]) {
  const stats = getBankrollStats(bankroll);
  return objectives.filter((objective) => objective.done).length + (stats.profit > 0 ? 1 : 0);
}

function getCurrentDisciplineStreak(bankroll: BankrollState, today: Date) {
  let streak = 0;

  for (let index = 0; index < 365; index += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const status = getDayStatus(date, bankroll, []);

    if (status !== "respected") {
      break;
    }

    streak += 1;
  }

  return streak;
}

function getDisciplineLevel(xp: number) {
  return levelThresholds.find((threshold) => xp >= threshold.xp)?.level ?? "Bronze";
}

function respectsBankroll(bankroll: BankrollState) {
  return bankroll.bets.every((bet) => respectsStake(bankroll, bet));
}

function respectsStake(bankroll: BankrollState, bet: BankrollBet) {
  const initialCapital = bankroll.initialCapital ?? 0;

  if (initialCapital <= 0) {
    return true;
  }

  return bet.stake <= initialCapital * 0.1;
}

function getManualBetCount(bets: BankrollBet[]) {
  return bets.filter((bet) => bet.source === "manual").length;
}

function getRecentInactivityCount(week: DisciplineDay[]) {
  return week.filter((day) => day.status === "missed").length;
}

function getDayScore(status: DisciplineDayStatus) {
  if (status === "respected") {
    return 100;
  }

  if (status === "partial") {
    return 62;
  }

  if (status === "missed") {
    return 18;
  }

  return 0;
}

function getCurrentWeek(today: Date) {
  const monday = new Date(today);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

function getBetDateKey(bet: BankrollBet) {
  return String(bet.settledAt ?? bet.placedAt).slice(0, 10);
}

function isToday(date: Date) {
  return toDateKey(date) === toDateKey(new Date());
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function getDayLabel(date: Date) {
  return ["D", "L", "M", "M", "J", "V", "S"][date.getDay()];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
