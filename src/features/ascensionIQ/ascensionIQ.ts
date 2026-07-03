import { AcademyEngineState, AcademyLesson } from "@/engine/academy";
import { ObjectiveEngineState } from "@/engine/objectives";
import { getBankrollStats } from "@/features/bankroll/math";
import { BankrollState } from "@/features/bankroll/types";
import { DisciplineProfile } from "@/features/discipline/disciplineProfile";
import { AscensionTicket } from "@/features/tickets/types";
import { XpProfile } from "@/features/xp/xpSystem";

export type AscensionIQSkillId =
  | "budget"
  | "savings"
  | "investment"
  | "markets"
  | "crypto"
  | "realEstate"
  | "tax"
  | "entrepreneurship"
  | "discipline"
  | "pronostics";

export type AscensionIQSkill = {
  id: AscensionIQSkillId;
  label: string;
  progress: number;
};

export type AscensionIQBadge = {
  id: string;
  title: string;
  unlocked: boolean;
};

export type AscensionIQProfile = {
  score: number;
  level: string;
  skills: AscensionIQSkill[];
  strengths: AscensionIQSkill[];
  improvements: AscensionIQSkill[];
  badges: AscensionIQBadge[];
  coachRecommendation: string;
};

export type AscensionIQInput = {
  academyState: AcademyEngineState | null;
  xpProfile: XpProfile | null;
  bankroll: BankrollState | null;
  tickets: AscensionTicket[];
  objectiveState: ObjectiveEngineState | null;
  disciplineProfile: DisciplineProfile | null;
};

const skillLabels: Record<AscensionIQSkillId, string> = {
  budget: "Budget",
  savings: "Épargne",
  investment: "Investissement",
  markets: "Bourse",
  crypto: "Crypto",
  realEstate: "Immobilier",
  tax: "Fiscalité",
  entrepreneurship: "Entrepreneuriat",
  discipline: "Discipline",
  pronostics: "Pronostics"
};

const skillOrder: AscensionIQSkillId[] = [
  "budget",
  "savings",
  "investment",
  "markets",
  "crypto",
  "realEstate",
  "tax",
  "entrepreneurship",
  "discipline",
  "pronostics"
];

export function calculateAscensionIQ(input: AscensionIQInput): AscensionIQProfile {
  const completedLessons = getCompletedLessons(input.academyState);
  const lessonTitles = completedLessons.map((lesson) => lesson.title.toLowerCase());
  const bankrollStats = input.bankroll ? getBankrollStats(input.bankroll) : null;
  const playedTickets = input.tickets.filter((ticket) => ticket.input.playStatus === "played");
  const settledTickets = playedTickets.filter((ticket) => ticket.selection.status === "won" || ticket.selection.status === "lost");
  const wonTickets = settledTickets.filter((ticket) => ticket.selection.status === "won");
  const achievedObjectives = input.objectiveState?.achievedObjectives.length ?? 0;
  const academyProgress = input.academyState?.progressPercent ?? 0;
  const xpProgress = Math.min(100, ((input.xpProfile?.xp ?? input.academyState?.profile.xp ?? 0) / 1500) * 100);
  const winRate = settledTickets.length > 0 ? (wonTickets.length / settledTickets.length) * 100 : bankrollStats?.winRate ?? 0;

  const rawScores: Record<AscensionIQSkillId, number> = {
    budget: scoreFromLessons(lessonTitles, ["budget", "mission à chaque euro", "dépense"], 18) + achievedObjectives * 8,
    savings: scoreFromLessons(lessonTitles, ["épargne", "bouclier", "sécurité"], 20),
    investment: scoreFromLessons(lessonTitles, ["invest", "intérêts composés", "etf", "diversifier", "risque", "temps"], 12) + academyProgress * 0.20,
    markets: scoreFromLessons(lessonTitles, ["bourse", "marchés", "etf", "action"], 14),
    crypto: scoreFromLessons(lessonTitles, ["crypto"], 36),
    realEstate: scoreFromLessons(lessonTitles, ["immobilier", "appartement", "résidence"], 30),
    tax: scoreFromLessons(lessonTitles, ["fiscalité", "impôt", "tax"], 36),
    entrepreneurship: scoreFromLessons(lessonTitles, ["entrepreneur", "business", "revenu"], 30),
    discipline: (input.disciplineProfile?.score ?? 0) * 0.72 + (input.disciplineProfile?.currentStreak ?? 0) * 3 + xpProgress * 0.12,
    pronostics: playedTickets.length * 7 + winRate * 0.35 + Math.max(bankrollStats?.profit ?? 0, 0) * 3
  };
  const skills = skillOrder.map((id) => ({
    id,
    label: skillLabels[id],
    progress: clamp(Math.round(rawScores[id]), 0, 100)
  }));
  const averageSkill = skills.reduce((total, skill) => total + skill.progress, 0) / skills.length;
  const score = Math.round(averageSkill * 3);
  const strengths = [...skills].sort((left, right) => right.progress - left.progress).slice(0, 3);
  const improvements = [...skills].sort((left, right) => left.progress - right.progress).slice(0, 3);

  return {
    score,
    level: getIQLevel(score),
    skills,
    strengths,
    improvements,
    badges: getIQBadges(skills, input.disciplineProfile?.currentStreak ?? 0, playedTickets.length),
    coachRecommendation: getIQCoachRecommendation(improvements[0], academyProgress)
  };
}

function getCompletedLessons(state: AcademyEngineState | null) {
  return state?.modules.flatMap((module) => module.lessons).filter((lesson) => lesson.status === "completed") ?? [];
}

function scoreFromLessons(lessonTitles: string[], keywords: string[], pointsPerMatch: number) {
  const matches = lessonTitles.filter((title) => keywords.some((keyword) => title.includes(keyword))).length;
  return Math.min(100, matches * pointsPerMatch);
}

function getIQLevel(score: number) {
  if (score >= 260) {
    return "Architecte Financier";
  }

  if (score >= 210) {
    return "Investisseur Structuré";
  }

  if (score >= 150) {
    return "Investisseur Débutant";
  }

  if (score >= 80) {
    return "Apprenti Ascension";
  }

  return "Explorateur Financier";
}

function getIQBadges(skills: AscensionIQSkill[], streak: number, playedTicketsCount: number): AscensionIQBadge[] {
  const byId = new Map(skills.map((skill) => [skill.id, skill.progress]));

  return [
    { id: "budget-master", title: "Maître du Budget", unlocked: (byId.get("budget") ?? 0) >= 70 },
    { id: "patient-investor", title: "Investisseur Patient", unlocked: (byId.get("investment") ?? 0) >= 60 },
    { id: "discipline-7", title: "Discipline 7 jours", unlocked: streak >= 7 },
    { id: "crypto-beginner", title: "Débutant Crypto", unlocked: (byId.get("crypto") ?? 0) >= 25 },
    { id: "pronostic-analyst", title: "Analyste Pronostics", unlocked: playedTicketsCount >= 5 || (byId.get("pronostics") ?? 0) >= 50 }
  ];
}

function getIQCoachRecommendation(weakestSkill: AscensionIQSkill | undefined, academyProgress: number) {
  if (!weakestSkill) {
    return "Continue l'Academy pour renforcer tes bases.";
  }

  if (academyProgress < 35) {
    return "Continue l'Academy pour renforcer tes bases avant les modules avancés.";
  }

  return `Travaille la compétence ${weakestSkill.label} pour augmenter ton Ascension IQ.`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
