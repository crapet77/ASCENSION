import { AcademyEngineState, AcademyLesson, AcademyModule } from "@/engine/academy";
import { ObjectiveEngineState } from "@/engine/objectives";
import { getBankrollStats } from "@/features/bankroll/math";
import { BankrollState } from "@/features/bankroll/types";
import { DisciplineProfile } from "@/features/discipline/disciplineProfile";
import { AscensionTicket } from "@/features/tickets/types";
import { XpProfile } from "@/features/xp/xpSystem";

export type AscensionCoachRecommendation = {
  title: string;
  level: string;
  action: string;
  nextLessonId?: string;
  nextModuleId?: string;
};

export type AscensionLessonCoach = {
  summary: string[];
  questions: string[];
  nextStep: string;
};

export type AscensionIntelligenceInput = {
  academyState: AcademyEngineState | null;
  xpProfile: XpProfile | null;
  bankroll: BankrollState;
  tickets: AscensionTicket[];
  objectiveState: ObjectiveEngineState | null;
  disciplineProfile: DisciplineProfile;
  today?: Date;
};

export type AscensionIntelligenceCoach = {
  recommendation: string;
  mission: string;
  encouragement: string;
  nextStep: string;
  contextLabel: string;
};

const academyRecommendationPool = [
  "Continue la prochaine leçon Academy.",
  "Reprends une leçon courte aujourd'hui.",
  "Revois la dernière notion avant d'avancer.",
  "Avance d'une seule section, sans chercher la perfection.",
  "Lis une leçon et note une idée applicable dès aujourd'hui.",
  "Continue ton parcours pédagogique avant de chercher une opportunité.",
  "Consolide une base Academy aujourd'hui.",
  "Choisis une leçon simple et termine-la calmement."
];

const financeRecommendationPool = [
  "Ajoute un objectif financier simple aujourd'hui.",
  "Clarifie un montant, une date et une raison.",
  "Vérifie si ton objectif principal est encore réaliste.",
  "Transforme une envie financière en plan mesurable.",
  "Note le prochain euro que tu veux protéger.",
  "Revois ton budget avant d'ajouter une nouvelle décision.",
  "Construis une petite avance plutôt qu'une grosse promesse.",
  "Donne une mission à ton prochain euro."
];

const investmentRecommendationPool = [
  "Revois les ETF avant d'observer les marchés.",
  "Revois les intérêts composés pour garder le long terme en tête.",
  "Relis une notion sur le risque avant d'agir.",
  "Rappelle-toi que le temps travaille mieux que la précipitation.",
  "Compare ton horizon avant de choisir un placement.",
  "Revois la diversification avant de regarder une opportunité.",
  "Garde une approche simple : réserve, horizon, régularité.",
  "Prépare ton premier plan d'investissement en quatre lignes."
];

const sportRecommendationPool = [
  "Tes derniers pronostics sont solides : garde la méthode.",
  "Analyse uniquement les sélections officielles Ascension.",
  "Ne joue rien qui ne respecte pas ta bankroll.",
  "Laisse les paris en attente vivre jusqu'au résultat officiel.",
  "Une bonne journée peut aussi être une journée sans pari.",
  "Vérifie la cote et la mise avant toute validation.",
  "Reste froid : le résultat ne doit pas décider de ta discipline.",
  "Observe les tickets en attente sans changer ton plan."
];

const missionPool = [
  "Termine une leçon Academy.",
  "Écris un objectif financier en une phrase.",
  "Note une dépense que tu veux mieux comprendre.",
  "Vérifie ta bankroll avant toute décision.",
  "Relis une notion clé pendant cinq minutes.",
  "Mets à jour un objectif existant.",
  "Choisis une action financière simple et fais-la aujourd'hui.",
  "Prends deux minutes pour regarder ta progression.",
  "Garde ta méthode, même si tu n'agis pas aujourd'hui.",
  "Transforme une idée en action mesurable."
];

const encouragementPool = [
  "Tu avances mieux quand tu restes simple.",
  "La régularité construit plus que l'intensité.",
  "Chaque leçon terminée renforce ta liberté future.",
  "Une petite action répétée vaut mieux qu'un grand plan abandonné.",
  "Ton calme est une compétence financière.",
  "La discipline ne dépend pas du résultat du jour.",
  "Tu construis quelque chose de durable.",
  "Avancer lentement reste avancer.",
  "Les compétences restent quand les opportunités passent.",
  "Tu es en train de bâtir une méthode."
];

const nextStepPool = [
  "Ouvre Academy et continue la prochaine leçon.",
  "Va dans Objectifs et vérifie ton objectif principal.",
  "Va dans Pronostics seulement si une sélection officielle existe.",
  "Consulte ta progression avant d'ajouter une nouvelle action.",
  "Reviens à la base : budget, épargne, discipline.",
  "Choisis une seule action et termine-la.",
  "Garde le focus sur le prochain petit progrès.",
  "Prends une décision calme, puis arrête-toi."
];

export function generateAscensionIntelligenceCoach(input: AscensionIntelligenceInput): AscensionIntelligenceCoach {
  const today = input.today ?? new Date();
  const seed = getDailySeed(today);
  const academyRecommendation = getAcademyCoachRecommendation(input.academyState);
  const bankrollStats = getBankrollStats(input.bankroll);
  const completedLessons = input.academyState?.modules.flatMap((module) => module.lessons).filter((lesson) => lesson.status === "completed") ?? [];
  const pendingTickets = input.tickets.filter((ticket) => ticket.input.playStatus === "played" && ticket.selection.status === "pending");
  const wonTickets = input.tickets.filter((ticket) => ticket.input.playStatus === "played" && ticket.selection.status === "won");
  const lostTickets = input.tickets.filter((ticket) => ticket.input.playStatus === "played" && ticket.selection.status === "lost");
  const activeObjectives = input.objectiveState?.activeObjectives ?? [];
  const achievedObjectives = input.objectiveState?.achievedObjectives ?? [];
  const nextLevel = input.xpProfile?.nextLevel;
  const progressToNextLevel = input.xpProfile?.progressToNextLevel ?? 0;
  const winRate = wonTickets.length + lostTickets.length > 0 ? (wonTickets.length / (wonTickets.length + lostTickets.length)) * 100 : bankrollStats.winRate;

  if (input.academyState && input.academyState.progressPercent >= 75) {
    return {
      recommendation: nextLevel && progressToNextLevel >= 70
        ? `Tu es proche du niveau ${nextLevel}. Termine une leçon pour garder l'élan.`
        : academyRecommendation.title,
      mission: pick(missionPool, seed + 1),
      encouragement: pick(encouragementPool, seed + completedLessons.length),
      nextStep: academyRecommendation.action,
      contextLabel: academyRecommendation.level
    };
  }

  if (pendingTickets.length > 0) {
    return {
      recommendation: pick(sportRecommendationPool, seed + pendingTickets.length),
      mission: "Surveille tes paris en attente sans modifier ton plan.",
      encouragement: winRate >= 70 ? "Tes derniers pronostics sont excellents. Reste fidèle à la méthode." : pick(encouragementPool, seed + 2),
      nextStep: "Attends le résultat officiel avant toute conclusion.",
      contextLabel: `${pendingTickets.length} pari${pendingTickets.length > 1 ? "s" : ""} en attente`
    };
  }

  if (bankrollStats.profit > 0 && bankrollStats.settledCount > 0) {
    return {
      recommendation: "Ta bankroll progresse, continue à suivre tes résultats avec calme.",
      mission: "Vérifie ton historique et garde exactement la même méthode.",
      encouragement: winRate >= 70 ? "Tes derniers pronostics sont excellents. La discipline reste ton avantage." : pick(encouragementPool, seed + 3),
      nextStep: academyRecommendation.title,
      contextLabel: `Bankroll +${bankrollStats.profit.toFixed(2)} €`
    };
  }

  if (bankrollStats.profit < 0 && bankrollStats.settledCount > 0) {
    return {
      recommendation: "Ta bankroll traverse une baisse. Reviens à la méthode avant toute nouvelle décision.",
      mission: "Relis une leçon Academy et évite les décisions impulsives aujourd'hui.",
      encouragement: "Un résultat négatif ne casse pas une méthode disciplinée.",
      nextStep: academyRecommendation.action,
      contextLabel: `Bankroll ${bankrollStats.profit.toFixed(2)} €`
    };
  }

  if (activeObjectives.length === 0 && achievedObjectives.length === 0) {
    return {
      recommendation: pick(financeRecommendationPool, seed),
      mission: "Crée un objectif simple : montant, raison, date.",
      encouragement: "Un objectif clair rend chaque décision plus facile.",
      nextStep: "Va dans Objectifs et ajoute une première cible.",
      contextLabel: "Objectifs à construire"
    };
  }

  if (input.disciplineProfile.currentStreak >= 7) {
    return {
      recommendation: `Ta série de ${input.disciplineProfile.currentStreak} jours montre une vraie discipline.`,
      mission: pick(missionPool, seed + input.disciplineProfile.currentStreak),
      encouragement: "La constance devient ton avantage.",
      nextStep: academyRecommendation.nextLessonId ? academyRecommendation.title : pick(nextStepPool, seed),
      contextLabel: `${input.disciplineProfile.currentStreak} jours de série`
    };
  }

  if (input.academyState?.activeModule?.title.toLowerCase().includes("investissement")) {
    return {
      recommendation: pick(investmentRecommendationPool, seed + completedLessons.length),
      mission: "Revois une notion d'investissement avant toute opportunité.",
      encouragement: pick(encouragementPool, seed + 4),
      nextStep: academyRecommendation.title,
      contextLabel: input.academyState.activeModule.title
    };
  }

  return {
    recommendation: academyRecommendation.title || pick(academyRecommendationPool, seed),
    mission: pick(missionPool, seed + (input.xpProfile?.xp ?? 0)),
    encouragement: pick(encouragementPool, seed + input.disciplineProfile.score),
    nextStep: academyRecommendation.action || pick(nextStepPool, seed),
    contextLabel: academyRecommendation.level
  };
}

export function getAcademyCoachRecommendation(state: AcademyEngineState | null): AscensionCoachRecommendation {
  if (!state) {
    return {
      title: "Continue ton parcours Academy.",
      level: "Chargement du parcours",
      action: "Ouvre Academy et reprends la prochaine leçon disponible."
    };
  }

  const activeModule = getActiveCoachModule(state);
  const nextLesson = activeModule?.lessons.find((lesson) => lesson.status !== "completed") ?? null;
  const completedLessons = activeModule?.lessons.filter((lesson) => lesson.status === "completed").length ?? 0;
  const totalLessons = activeModule?.lessons.length ?? 0;

  if (activeModule && nextLesson) {
    const nextLessonIndex = activeModule.lessons.findIndex((lesson) => lesson.id === nextLesson.id) + 1;

    return {
      title: `Continue la leçon ${nextLessonIndex} : ${nextLesson.title}.`,
      level: `${activeModule.title} · ${completedLessons}/${totalLessons} leçons`,
      action: getDailyCoachAction(activeModule, nextLesson),
      nextLessonId: nextLesson.id,
      nextModuleId: activeModule.id
    };
  }

  const lastCompletedModule = [...state.completedModules].sort((left, right) => right.order - left.order)[0];

  return {
    title: lastCompletedModule ? `Revois ${lastCompletedModule.title}.` : "Ajoute un objectif financier simple aujourd'hui.",
    level: lastCompletedModule ? "Niveau validé" : "Parcours à lancer",
    action: lastCompletedModule
      ? "Choisis une notion clé et applique-la à une décision réelle."
      : "Écris un objectif clair : montant, raison, date."
  };
}

export function getAcademyCoachAdvice(state: AcademyEngineState | null) {
  const recommendation = getAcademyCoachRecommendation(state);
  const progress = state?.progressPercent ?? 0;
  const completedLessons = state?.modules.flatMap((module) => module.lessons).filter((lesson) => lesson.status === "completed").length ?? 0;
  const reminder = pick(encouragementPool, getDailySeed(new Date()) + completedLessons);

  if (progress >= 80) {
    return {
      title: "Conseil du coach",
      text: "Tu es proche de valider ton parcours actuel. Termine une leçon courte aujourd'hui pour garder l'élan.",
      progressLabel: `${progress}% validé`,
      nextLesson: recommendation.title,
      reminder
    };
  }

  if (progress >= 35) {
    return {
      title: "Conseil du coach",
      text: "Ton socle commence à se construire. Continue avec régularité, même si tu avances doucement.",
      progressLabel: `${progress}% validé`,
      nextLesson: recommendation.title,
      reminder
    };
  }

  return {
    title: "Conseil du coach",
    text: recommendation.action,
    progressLabel: `${progress}% validé`,
    nextLesson: recommendation.title,
    reminder
  };
}

export function getLessonCoachSummary(lesson: AcademyLesson | null, module: AcademyModule | null): AscensionLessonCoach {
  const lessonTitle = lesson?.title ?? "cette leçon";
  const moduleTitle = module?.title ?? "Academy";
  const quizQuestions = lesson?.quizQuestions ?? [];

  return {
    summary: [
      `Tu viens de renforcer une base importante : ${lessonTitle}.`,
      `Cette notion sert directement ton parcours ${moduleTitle}.`,
      "Le plus important maintenant est de transformer l'idée en action simple."
    ],
    questions: quizQuestions.slice(0, 3).map((question) => question.question),
    nextStep: getLessonNextStep(lesson, module)
  };
}

function getActiveCoachModule(state: AcademyEngineState) {
  return state.modules.find((module) => module.status === "available" && module.lessons.some((lesson) => lesson.status !== "completed"))
    ?? state.modules.find((module) => module.lessons.some((lesson) => lesson.status !== "completed"))
    ?? null;
}

function getDailyCoachAction(module: AcademyModule, lesson: AcademyLesson) {
  const title = `${module.title} ${lesson.title}`.toLowerCase();

  if (title.includes("intérêts composés")) {
    return "Revois les intérêts composés et note une somme que tu pourrais investir chaque mois.";
  }

  if (title.includes("objectif")) {
    return "Ajoute un objectif financier simple aujourd'hui : montant, date, raison.";
  }

  if (title.includes("budget")) {
    return "Donne une mission à ton prochain euro avant de le dépenser.";
  }

  if (title.includes("épargne")) {
    return "Calcule le montant de ton premier bouclier financier.";
  }

  return "Lis une leçon courte, puis applique une seule idée dans ta journée.";
}

function getLessonNextStep(lesson: AcademyLesson | null, module: AcademyModule | null) {
  if (!lesson || !module) {
    return "Continue ton parcours Academy.";
  }

  const index = module.lessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = index >= 0 ? module.lessons[index + 1] : null;

  if (nextLesson) {
    return `Continue avec : ${nextLesson.title}.`;
  }

  return "Passe au quiz du chapitre pour valider tes connaissances.";
}

function getDailySeed(date: Date) {
  return Math.floor(date.getTime() / 86_400_000);
}

function pick(items: string[], seed: number) {
  return items[Math.abs(seed) % items.length] ?? items[0] ?? "";
}
