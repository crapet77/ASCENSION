export type MasterclassCategoryId =
  | "crypto"
  | "markets"
  | "realEstate"
  | "entrepreneurship"
  | "tax"
  | "international";

export type MasterclassDifficulty = "Débutant" | "Intermédiaire" | "Avancé";
export type MasterclassAvailability = "available" | "soon";
export type MasterclassProgressStatus = "not_started" | "in_progress" | "completed";

export type MasterclassCategory = {
  id: MasterclassCategoryId;
  icon: string;
  title: string;
  description: string;
};

export type MasterclassItem = {
  id: string;
  categoryId: MasterclassCategoryId;
  icon: string;
  title: string;
  difficulty: MasterclassDifficulty;
  estimatedDuration: string;
  availability: MasterclassAvailability;
  structure: {
    chapters: string[];
    hasIllustrations: boolean;
    hasQuiz: boolean;
    hasCaseStudies: boolean;
    hasSummary: boolean;
    hasFinalBadge: boolean;
  };
};

export type MasterclassProgressEntry = {
  masterclassId: string;
  status: MasterclassProgressStatus;
  startedAt?: string;
  completedAt?: string;
};

export type MasterclassStats = {
  startedCount: number;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type MasterclassState = {
  categories: MasterclassCategory[];
  masterclasses: MasterclassItem[];
  progress: MasterclassProgressEntry[];
  stats: MasterclassStats;
};
