import { AcademyEngineState, AcademyLesson, AcademyModule } from "@/engine/academy";

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

  if (progress >= 80) {
    return {
      title: "Conseil du coach",
      text: "Tu es proche de valider ton parcours actuel. Termine une leçon courte aujourd'hui pour garder l'élan.",
      progressLabel: `${progress}% validé`
    };
  }

  if (progress >= 35) {
    return {
      title: "Conseil du coach",
      text: "Ton socle commence à se construire. Continue avec régularité, même si tu avances doucement.",
      progressLabel: `${progress}% validé`
    };
  }

  return {
    title: "Conseil du coach",
    text: recommendation.action,
    progressLabel: `${progress}% validé`
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
