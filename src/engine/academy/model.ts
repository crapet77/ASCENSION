export type AcademyMissionStatus = "locked" | "active" | "completed";
export type AcademyModuleStatus = "locked" | "available" | "completed";
export type AcademyLessonStatus = "locked" | "available" | "completed";
export type AcademyQuizStatus = "locked" | "available" | "passed";
export type AcademyModuleCategory = "finance" | "sport" | "markets" | "discipline" | "ai";
export type AcademyUnlockFeature = "sport" | "markets" | "ai";
export type AcademyProgressStatus = "locked" | "in_progress" | "validated" | "certified";
export type AcademyLevelCategory = "foundations" | "investment" | "risk" | "opportunities";

export type AcademyMission = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: AcademyMissionStatus;
};

export type AcademyBadge = {
  id: string;
  title: string;
  unlocked: boolean;
  unlockedAt?: string;
};

export type AcademyLessonContent = {
  intro: string;
  sections: string[];
  takeaway: string;
  example: string;
  estimatedMinutes?: number;
  quizQuestions?: AcademyQuizQuestion[];
  successMessage?: string;
};

export type AcademyLesson = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: AcademyLessonStatus;
  completedAt?: string;
  intro?: string;
  sections?: string[];
  takeaway?: string;
  example?: string;
  estimatedMinutes?: number;
  content?: string;
  summary?: string;
  duration?: string;
  quizQuestions?: AcademyQuizQuestion[];
  successMessage?: string;
};

export type AcademyQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
};

export type AcademyQuiz = {
  id: string;
  title: string;
  xpReward: number;
  requiredScore: number;
  status: AcademyQuizStatus;
  questions: AcademyQuizQuestion[];
  score?: number;
  completedAt?: string;
};

export type AcademyCertification = {
  id: string;
  title: string;
  requiredScore: number;
  xpReward: number;
  status: AcademyProgressStatus;
  score?: number;
  certifiedAt?: string;
};

export type AcademyChapter = {
  id: string;
  title: string;
  shortLesson: string;
  estimatedMinutes: number;
  summary: string;
  illustration: string;
  xpReward: number;
  badgeTitle: string;
  status: AcademyProgressStatus;
  completedAt?: string;
  quiz: AcademyQuiz;
  content?: AcademyLessonContent;
  lessons?: AcademyLesson[];
};

export type AcademyLevel = {
  id: string;
  order: number;
  title: string;
  category: AcademyLevelCategory;
  description: string;
  status: AcademyProgressStatus;
  chapters: AcademyChapter[];
  certification: AcademyCertification;
  unlocks: AcademyUnlockFeature[];
};

export type AcademyProgression = {
  totalLevels: number;
  certifiedLevels: number;
  totalChapters: number;
  validatedChapters: number;
  progressPercent: number;
  activeLevelId: string | null;
  activeChapterId: string | null;
};

export type AcademyModule = {
  id: string;
  title: string;
  description: string;
  category: AcademyModuleCategory;
  order: number;
  required: boolean;
  status: AcademyModuleStatus;
  lessons: AcademyLesson[];
  quiz: AcademyQuiz;
  unlocks: AcademyUnlockFeature[];
};

export type AcademyUnlockState = Record<AcademyUnlockFeature, boolean>;

export type AcademyProfile = {
  academyVersion: "v1" | "v2";
  xp: number;
  level: string;
  disciplineDays: number;
  levels: AcademyLevel[];
  modules: AcademyModule[];
  missions: AcademyMission[];
  badges: AcademyBadge[];
  updatedAt: string;
};

export type AcademyEngineState = {
  profile: AcademyProfile;
  levels: AcademyLevel[];
  activeLevel: AcademyLevel | null;
  certifiedLevels: AcademyLevel[];
  progression: AcademyProgression;
  modules: AcademyModule[];
  requiredModules: AcademyModule[];
  activeModule: AcademyModule | null;
  completedModules: AcademyModule[];
  activeMissions: AcademyMission[];
  completedMissions: AcademyMission[];
  nextBadge: AcademyBadge | null;
  unlocks: AcademyUnlockState;
  progressPercent: number;
};
