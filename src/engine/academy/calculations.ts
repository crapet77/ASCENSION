import {
  AcademyBadge,
  AcademyLevel,
  AcademyMission,
  AcademyModule,
  AcademyProfile,
  AcademyProgression,
  AcademyUnlockState
} from "@/engine/academy/model";

export function getAcademyLevel(xp: number) {
  if (xp >= 10000) {
    return "Ascension Elite";
  }

  if (xp >= 6000) {
    return "Diamant";
  }

  if (xp >= 3000) {
    return "Platine";
  }

  if (xp >= 1500) {
    return "Or";
  }

  if (xp >= 500) {
    return "Argent";
  }

  return "Bronze";
}

export function getActiveMissions(missions: AcademyMission[]) {
  return missions.filter((mission) => mission.status === "active");
}

export function getCompletedMissions(missions: AcademyMission[]) {
  return missions.filter((mission) => mission.status === "completed");
}

export function getNextBadge(badges: AcademyBadge[]) {
  return badges.find((badge) => !badge.unlocked) ?? null;
}

export function getSortedModules(modules: AcademyModule[]) {
  return [...modules].sort((left, right) => left.order - right.order);
}

export function getRequiredModules(modules: AcademyModule[]) {
  return getSortedModules(modules).filter((module) => module.required);
}

export function getCompletedModules(modules: AcademyModule[]) {
  return getSortedModules(modules).filter((module) => module.status === "completed");
}

export function getActiveModule(modules: AcademyModule[]) {
  return getSortedModules(modules).find((module) => module.status === "available") ?? null;
}

export function getSortedLevels(levels: AcademyLevel[]) {
  return [...levels].sort((left, right) => left.order - right.order);
}

export function getActiveLevel(levels: AcademyLevel[]) {
  return getSortedLevels(levels).find((level) => level.status === "in_progress") ?? null;
}

export function getCertifiedLevels(levels: AcademyLevel[]) {
  return getSortedLevels(levels).filter((level) => level.status === "certified");
}

export function getAcademyProgression(levels: AcademyLevel[]): AcademyProgression {
  const sortedLevels = getSortedLevels(levels);
  const chapters = sortedLevels.flatMap((level) => level.chapters);
  const activeLevel = getActiveLevel(sortedLevels);
  const activeChapter = activeLevel?.chapters.find((chapter) => chapter.status === "in_progress") ?? null;
  const validatedChapters = chapters.filter(
    (chapter) => chapter.status === "validated" || chapter.status === "certified"
  );

  return {
    totalLevels: sortedLevels.length,
    certifiedLevels: getCertifiedLevels(sortedLevels).length,
    totalChapters: chapters.length,
    validatedChapters: validatedChapters.length,
    progressPercent: chapters.length > 0 ? Math.round((validatedChapters.length / chapters.length) * 100) : 100,
    activeLevelId: activeLevel?.id ?? null,
    activeChapterId: activeChapter?.id ?? null
  };
}

export function getAcademyUnlocks(profile: AcademyProfile): AcademyUnlockState {
  const certifiedLevels = getCertifiedLevels(profile.levels ?? []);
  const completedModules = getCompletedModules(profile.modules);
  const completedUnlocks = [
    ...certifiedLevels.flatMap((level) => level.unlocks),
    ...completedModules.flatMap((module) => module.unlocks)
  ];
  const allRequiredCompleted = getRequiredModules(profile.modules).every((module) => module.status === "completed");

  return {
    sport: completedUnlocks.includes("sport"),
    markets: completedUnlocks.includes("markets"),
    ai: completedUnlocks.includes("ai") || allRequiredCompleted
  };
}

export function getAcademyProgressPercent(modules: AcademyModule[]) {
  const requiredModules = getRequiredModules(modules);

  if (requiredModules.length === 0) {
    return 100;
  }

  const completedCount = requiredModules.filter((module) => module.status === "completed").length;
  return Math.round((completedCount / requiredModules.length) * 100);
}

export function completeAcademyLesson(
  profile: AcademyProfile,
  moduleId: string,
  lessonId: string
): AcademyProfile {
  let earnedXp = 0;
  const now = new Date().toISOString();
  let completedModuleOrder: number | null = null;
  let completedLevelOrder: number | null = null;
  const modulesAfterLesson = profile.modules.map((module) => {
    if (module.id !== moduleId || module.status !== "available") {
      return module;
    }

    const lessons = module.lessons.map((lesson) => {
      if (lesson.id !== lessonId || lesson.status === "completed" || lesson.status === "locked") {
        return lesson;
      }

      earnedXp += lesson.xpReward;
      return {
        ...lesson,
        status: "completed" as const,
        completedAt: now
      };
    });
    const nextLockedLessonIndex = lessons.findIndex((lesson) => lesson.status === "locked");
    const unlockedLessons = lessons.map((lesson, index) =>
      index === nextLockedLessonIndex ? { ...lesson, status: "available" as const } : lesson
    );
    const allLessonsCompleted = unlockedLessons.every((lesson) => lesson.status === "completed");
    const shouldCompleteModule = allLessonsCompleted && module.quiz.status !== "passed";

    if (shouldCompleteModule) {
      earnedXp += module.quiz.xpReward;
      completedModuleOrder = module.order;
    }

    return {
      ...module,
      status: allLessonsCompleted ? "completed" as const : module.status,
      lessons: unlockedLessons,
      quiz: allLessonsCompleted
        ? {
            ...module.quiz,
            status: "passed" as const,
            score: module.quiz.score ?? 100,
            completedAt: module.quiz.completedAt ?? now
          }
        : module.quiz
    };
  });
  const levelsAfterLesson = profile.levels.map((level) => {
    if (level.id !== moduleId || level.status !== "in_progress") {
      return level;
    }

    const chapters = level.chapters.map((chapter) => {
      if (chapter.lessons?.some((lesson) => lesson.id === lessonId)) {
        const lessons = chapter.lessons.map((lesson) =>
          lesson.id === lessonId && lesson.status !== "completed" && lesson.status !== "locked"
            ? { ...lesson, status: "completed" as const, completedAt: now }
            : lesson
        );
        const allLessonsCompleted = lessons.every((lesson) => lesson.status === "completed");

        return {
          ...chapter,
          lessons,
          status: allLessonsCompleted ? "validated" as const : chapter.status,
          completedAt: allLessonsCompleted ? now : chapter.completedAt,
          quiz: allLessonsCompleted
            ? {
                ...chapter.quiz,
                status: "passed" as const,
                score: 100,
                completedAt: now
              }
            : chapter.quiz
        };
      }

      if (chapter.id !== lessonId || chapter.status === "validated" || chapter.status === "certified" || chapter.status === "locked") {
        return chapter;
      }

      return {
        ...chapter,
        status: "validated" as const,
        completedAt: now,
        quiz: {
          ...chapter.quiz,
          status: "passed" as const,
          score: 100,
          completedAt: now
        }
      };
    });
    const nextLockedChapterIndex = chapters.findIndex((chapter) => chapter.status === "locked");
    const unlockedChapters = chapters.map((chapter, index) =>
      index === nextLockedChapterIndex
        ? { ...chapter, status: "in_progress" as const, quiz: { ...chapter.quiz, status: "available" as const } }
        : chapter
    );
    const allChaptersValidated = unlockedChapters.every(
      (chapter) => chapter.status === "validated" || chapter.status === "certified"
    );

    if (allChaptersValidated && level.certification.status !== "certified") {
      completedLevelOrder = level.order;

      return {
        ...level,
        status: "certified" as const,
        chapters: unlockedChapters.map((chapter) => ({ ...chapter, status: "certified" as const })),
        certification: {
          ...level.certification,
          status: "certified" as const,
          score: level.certification.score ?? 100,
          certifiedAt: level.certification.certifiedAt ?? now
        }
      };
    }

    return {
      ...level,
      chapters: unlockedChapters,
      certification: allChaptersValidated && level.certification.status !== "certified"
        ? { ...level.certification, status: "in_progress" as const }
        : level.certification
    };
  });
  const xp = profile.xp + earnedXp;
  const modules = unlockNextAcademyModule(modulesAfterLesson, completedModuleOrder);
  const levels = unlockNextAcademyLevel(levelsAfterLesson, completedLevelOrder);

  return {
    ...profile,
    xp,
    level: getAcademyLevel(xp),
    levels,
    modules,
    badges: unlockAcademyBadges(profile.badges, levels, now),
    updatedAt: now
  };
}

export function autoValidateFinishedAcademy(profile: AcademyProfile): AcademyProfile {
  let earnedXp = 0;
  let changed = false;
  let completedModuleOrder: number | null = null;
  let completedLevelOrder: number | null = null;
  const now = new Date().toISOString();

  const modulesAfterValidation = profile.modules.map((module) => {
    if (module.status !== "available") {
      return module;
    }

    const allLessonsCompleted = module.lessons.length > 0 && module.lessons.every((lesson) => lesson.status === "completed");

    if (!allLessonsCompleted) {
      return module;
    }

    changed = true;
    completedModuleOrder = module.order;

    if (module.quiz.status !== "passed") {
      earnedXp += module.quiz.xpReward;
    }

    return {
      ...module,
      status: "completed" as const,
      quiz: {
        ...module.quiz,
        status: "passed" as const,
        score: module.quiz.score ?? 100,
        completedAt: module.quiz.completedAt ?? now
      }
    };
  });

  const levelsAfterValidation = profile.levels.map((level) => {
    if (level.status !== "in_progress" || level.certification.status === "certified") {
      return level;
    }

    const allChaptersValidated = level.chapters.every(
      (chapter) => chapter.status === "validated" || chapter.status === "certified"
    );

    if (!allChaptersValidated) {
      return level;
    }

    changed = true;
    completedLevelOrder = level.order;

    return {
      ...level,
      status: "certified" as const,
      chapters: level.chapters.map((chapter) => ({ ...chapter, status: "certified" as const })),
      certification: {
        ...level.certification,
        status: "certified" as const,
        score: level.certification.score ?? 100,
        certifiedAt: level.certification.certifiedAt ?? now
      }
    };
  });

  if (!changed) {
    return profile;
  }

  const modules = unlockNextAcademyModule(modulesAfterValidation, completedModuleOrder);
  const levels = unlockNextAcademyLevel(levelsAfterValidation, completedLevelOrder);
  const xp = profile.xp + earnedXp;

  return {
    ...profile,
    xp,
    level: getAcademyLevel(xp),
    levels,
    modules,
    badges: unlockAcademyBadges(profile.badges, levels, now),
    updatedAt: now
  };
}

export function submitAcademyQuiz(
  profile: AcademyProfile,
  moduleId: string,
  answers: number[]
): AcademyProfile {
  let earnedXp = 0;
  const now = new Date().toISOString();
  let completedModuleOrder: number | null = null;
  const modulesAfterQuiz = profile.modules.map((module) => {
    if (module.id !== moduleId || module.status !== "available" || module.quiz.status !== "available") {
      return module;
    }

    const correctAnswers = module.quiz.questions.filter(
      (question, index) => answers[index] === question.correctOptionIndex
    ).length;
    const score = Math.round((correctAnswers / module.quiz.questions.length) * 100);

    if (score < module.quiz.requiredScore) {
      return {
        ...module,
        quiz: {
          ...module.quiz,
          score
        }
      };
    }

    earnedXp += module.quiz.xpReward;
    completedModuleOrder = module.order;

    return {
      ...module,
      status: "completed" as const,
      quiz: {
        ...module.quiz,
        status: "passed" as const,
        score,
        completedAt: now
      }
    };
  });
  const levelsAfterCertification = profile.levels.map((level) => {
    if (level.id !== moduleId || level.status !== "in_progress" || level.certification.status === "certified") {
      return level;
    }

    const allChaptersValidated = level.chapters.every(
      (chapter) => chapter.status === "validated" || chapter.status === "certified"
    );

    if (!allChaptersValidated) {
      return level;
    }

    return {
      ...level,
      status: "certified" as const,
      chapters: level.chapters.map((chapter) => ({ ...chapter, status: "certified" as const })),
      certification: {
        ...level.certification,
        status: "certified" as const,
        score: 100,
        certifiedAt: now
      }
    };
  });
  const levels = unlockNextAcademyLevel(levelsAfterCertification, completedModuleOrder);
  const modules = unlockNextAcademyModule(modulesAfterQuiz, completedModuleOrder);
  const xp = profile.xp + earnedXp;

  return {
    ...profile,
    xp,
    level: getAcademyLevel(xp),
    levels,
    modules,
    badges: unlockAcademyBadges(profile.badges, levels, now),
    updatedAt: now
  };
}

export function completeAcademyMission(profile: AcademyProfile, missionId: string): AcademyProfile {
  const missions = profile.missions.map((mission) =>
    mission.id === missionId && mission.status !== "completed"
      ? { ...mission, status: "completed" as const }
      : mission
  );
  const completedMission = profile.missions.find(
    (mission) => mission.id === missionId && mission.status !== "completed"
  );
  const xp = profile.xp + (completedMission?.xpReward ?? 0);

  return {
    ...profile,
    xp,
    level: getAcademyLevel(xp),
    missions,
    updatedAt: new Date().toISOString()
  };
}

function unlockNextAcademyModule(modules: AcademyModule[], completedModuleOrder: number | null) {
  if (completedModuleOrder === null) {
    return modules;
  }

  const nextLockedModule = getSortedModules(modules).find(
    (module) => module.order > completedModuleOrder && module.status === "locked"
  );

  if (!nextLockedModule) {
    return modules;
  }

  return modules.map((module) => {
    if (module.id !== nextLockedModule.id) {
      return module;
    }

    return {
      ...module,
      status: "available" as const,
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        status: "available" as const
      }))
    };
  });
}

function unlockNextAcademyLevel(levels: AcademyLevel[], completedLevelOrder: number | null) {
  if (completedLevelOrder === null) {
    return levels;
  }

  const nextLockedLevel = getSortedLevels(levels).find(
    (level) => level.order > completedLevelOrder && level.status === "locked"
  );

  if (!nextLockedLevel) {
    return levels;
  }

  return levels.map((level) => {
    if (level.id !== nextLockedLevel.id) {
      return level;
    }

    return {
      ...level,
      status: "in_progress" as const,
      chapters: level.chapters.map((chapter, index) => ({
        ...chapter,
        status: index === 0 ? "in_progress" as const : chapter.status,
        quiz: index === 0 ? { ...chapter.quiz, status: "available" as const } : chapter.quiz
      })),
      certification: {
        ...level.certification,
        status: "in_progress" as const
      }
    };
  });
}

function unlockAcademyBadges(badges: AcademyBadge[], levels: AcademyLevel[], now: string) {
  const certifiedLevels = getCertifiedLevels(levels);
  const hasFoundations = certifiedLevels.some((level) => level.category === "foundations");
  const allLevelsCertified = certifiedLevels.length === levels.length;

  return badges.map((badge) => {
    if (badge.id === "badge-foundations" && hasFoundations) {
      return { ...badge, unlocked: true, unlockedAt: badge.unlockedAt ?? now };
    }

    if (badge.id === "badge-certified-v2" && allLevelsCertified) {
      return { ...badge, unlocked: true, unlockedAt: badge.unlockedAt ?? now };
    }

    return badge;
  });
}
