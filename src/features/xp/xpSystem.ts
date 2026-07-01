import AsyncStorage from "@react-native-async-storage/async-storage";

import { AcademyMission, AcademyModule } from "@/engine/academy";
import { ObjectiveProgress } from "@/engine/objectives";
import { BankrollState } from "@/features/bankroll/types";
import { DisciplineProfile } from "@/features/discipline/disciplineProfile";
import { AscensionTicket } from "@/features/tickets/types";

export type XpEventType =
  | "official_selection_played"
  | "complete_bet_registered"
  | "risky_bet_ignored"
  | "bankroll_respected"
  | "daily_mission_completed"
  | "academy_lesson_read"
  | "objective_achieved"
  | "discipline_streak_7";

export type XpHistoryEvent = {
  id: string;
  type: XpEventType;
  label: string;
  xp: number;
  earnedAt: string;
};

export type XpBadge = {
  id: string;
  title: string;
  unlocked: boolean;
  unlockedAt?: string;
};

export type XpProfile = {
  xp: number;
  level: string;
  nextLevel: string | null;
  currentLevelXp: number;
  nextLevelXp: number | null;
  progressToNextLevel: number;
  history: XpHistoryEvent[];
  badges: XpBadge[];
  updatedAt: string;
};

export const XP_PROFILE_STORAGE_KEY = "@ascension/xp/profile/v1";

export const levelThresholds = [
  { level: "Ascension Elite", xp: 10000 },
  { level: "Diamant", xp: 6000 },
  { level: "Platine", xp: 3000 },
  { level: "Or", xp: 1500 },
  { level: "Argent", xp: 500 },
  { level: "Bronze", xp: 0 }
];

export const defaultXpProfile: XpProfile = {
  xp: 0,
  level: "Bronze",
  nextLevel: "Argent",
  currentLevelXp: 0,
  nextLevelXp: 500,
  progressToNextLevel: 0,
  history: [],
  badges: [],
  updatedAt: ""
};

export async function loadXpProfile() {
  const rawProfile = await AsyncStorage.getItem(XP_PROFILE_STORAGE_KEY);
  return rawProfile ? (JSON.parse(rawProfile) as XpProfile) : defaultXpProfile;
}

export async function saveXpProfile(profile: XpProfile) {
  await AsyncStorage.setItem(XP_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function calculateXpProfile(params: {
  bankroll: BankrollState;
  tickets: AscensionTicket[];
  academyMissions: AcademyMission[];
  academyModules?: AcademyModule[];
  objectives: ObjectiveProgress[];
  disciplineProfile: DisciplineProfile;
  today?: Date;
}): XpProfile {
  const today = params.today ?? new Date();
  const history = [
    ...getTicketXpEvents(params.tickets, params.bankroll),
    ...getDailyMissionEvents(params.tickets, today),
    ...getAcademyXpEvents(params.academyMissions, params.academyModules ?? []),
    ...getObjectiveXpEvents(params.objectives),
    ...getDisciplineStreakEvents(params.disciplineProfile.currentStreak, today)
  ].sort((left, right) => left.earnedAt.localeCompare(right.earnedAt));
  const xp = history.reduce((total, event) => total + event.xp, 0);
  const levelInfo = getLevelInfo(xp);

  return {
    xp,
    ...levelInfo,
    history,
    badges: getXpBadges(xp, params.disciplineProfile.currentStreak),
    updatedAt: new Date().toISOString()
  };
}

function getTicketXpEvents(tickets: AscensionTicket[], bankroll: BankrollState) {
  return tickets.flatMap((ticket): XpHistoryEvent[] => {
    const earnedAt = ticket.savedAt;
    const events: XpHistoryEvent[] = [];

    if (ticket.input.playStatus === "played") {
      events.push({
        id: `xp-played-${ticket.selection.id}`,
        type: "official_selection_played",
        label: "Sélection officielle Ascension jouée",
        xp: 20,
        earnedAt
      });
    }

    if (hasCompleteStakeAndOdds(ticket)) {
      events.push({
        id: `xp-complete-bet-${ticket.selection.id}`,
        type: "complete_bet_registered",
        label: "Pari enregistré avec cote et mise",
        xp: 10,
        earnedAt
      });
    }

    if (ticket.input.playStatus === "not_played") {
      events.push({
        id: `xp-ignored-${ticket.selection.id}`,
        type: "risky_bet_ignored",
        label: "Pari ignoré avec discipline",
        xp: 10,
        earnedAt
      });
    }

    if (ticket.input.playStatus === "played" && respectsBankroll(ticket, bankroll)) {
      events.push({
        id: `xp-bankroll-${ticket.selection.id}`,
        type: "bankroll_respected",
        label: "Bankroll respectée",
        xp: 20,
        earnedAt
      });
    }

    return events;
  });
}

function getDailyMissionEvents(tickets: AscensionTicket[], today: Date): XpHistoryEvent[] {
  const todayKey = toDateKey(today);
  const hasPlayedToday = tickets.some(
    (ticket) => ticket.input.playStatus === "played" && ticket.savedAt.slice(0, 10) === todayKey
  );

  if (!hasPlayedToday) {
    return [];
  }

  return [
    {
      id: `xp-daily-mission-${todayKey}`,
      type: "daily_mission_completed",
      label: "Mission du jour terminée",
      xp: 30,
      earnedAt: today.toISOString()
    }
  ];
}

function getAcademyXpEvents(missions: AcademyMission[], modules: AcademyModule[]) {
  const lessonEvents = modules.flatMap((module) =>
    module.lessons
      .filter((lesson) => lesson.status === "completed")
      .map((lesson): XpHistoryEvent => ({
        id: `xp-academy-lesson-${module.id}-${lesson.id}`,
        type: "academy_lesson_read",
        label: `Leçon Academy lue : ${lesson.title}`,
        xp: lesson.xpReward,
        earnedAt: lesson.completedAt ?? new Date().toISOString()
      }))
  );

  const missionEvents = missions
    .filter((mission) => mission.status === "completed")
    .map((mission): XpHistoryEvent => ({
      id: `xp-academy-${mission.id}`,
      type: "academy_lesson_read",
      label: `Leçon Academy lue : ${mission.title}`,
      xp: 15,
      earnedAt: new Date().toISOString()
    }));

  return [...lessonEvents, ...missionEvents];
}

function getObjectiveXpEvents(objectives: ObjectiveProgress[]) {
  return objectives
    .filter((objective) => objective.status === "achieved")
    .map((objective): XpHistoryEvent => ({
      id: `xp-objective-${objective.id}`,
      type: "objective_achieved",
      label: `Objectif atteint : ${objective.title}`,
      xp: 50,
      earnedAt: new Date().toISOString()
    }));
}

function getDisciplineStreakEvents(currentStreak: number, today: Date) {
  const earnedAt = today.toISOString();
  const sevenDayBlocks = Math.floor(currentStreak / 7);

  return Array.from({ length: sevenDayBlocks }, (_, index): XpHistoryEvent => ({
    id: `xp-streak-7-${index + 1}`,
    type: "discipline_streak_7",
    label: `Série de ${7 * (index + 1)} jours de discipline`,
    xp: 100,
    earnedAt
  }));
}

function hasCompleteStakeAndOdds(ticket: AscensionTicket) {
  return parseAmount(ticket.input.realOdds) > 0 && parseAmount(ticket.input.stake) > 0;
}

function respectsBankroll(ticket: AscensionTicket, bankroll: BankrollState) {
  const initialCapital = bankroll.initialCapital ?? 0;

  if (initialCapital <= 0) {
    return true;
  }

  return parseAmount(ticket.input.stake) <= initialCapital * 0.1;
}

function getLevelInfo(xp: number) {
  const descendingThresholds = levelThresholds;
  const ascendingThresholds = [...levelThresholds].reverse();
  const currentLevel = descendingThresholds.find((threshold) => xp >= threshold.xp) ?? descendingThresholds[descendingThresholds.length - 1];
  const nextLevel = ascendingThresholds.find((threshold) => threshold.xp > xp) ?? null;
  const nextLevelXp = nextLevel?.xp ?? null;
  const currentLevelXp = currentLevel.xp;
  const progressToNextLevel = nextLevelXp
    ? Math.min(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100, 100)
    : 100;

  return {
    level: currentLevel.level,
    nextLevel: nextLevel?.level ?? null,
    currentLevelXp,
    nextLevelXp,
    progressToNextLevel
  };
}

function getXpBadges(xp: number, currentStreak: number): XpBadge[] {
  return [
    {
      id: "badge-first-500-xp",
      title: "500 XP",
      unlocked: xp >= 500,
      unlockedAt: xp >= 500 ? new Date().toISOString() : undefined
    },
    {
      id: "badge-1500-xp",
      title: "1500 XP",
      unlocked: xp >= 1500,
      unlockedAt: xp >= 1500 ? new Date().toISOString() : undefined
    },
    {
      id: "badge-7-days",
      title: "7 jours de discipline",
      unlocked: currentStreak >= 7,
      unlockedAt: currentStreak >= 7 ? new Date().toISOString() : undefined
    }
  ];
}

function parseAmount(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
