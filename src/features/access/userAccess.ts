import AsyncStorage from "@react-native-async-storage/async-storage";

import { AcademyEngineState } from "@/engine/academy";

export type UserAccessMode = "guest" | "account" | "admin";
export type AccountRole = "user" | "admin";
export type UserLevel = "beginner" | "intermediate" | "advanced";
export type UserLevelTestStatus = "not_started" | "completed";
export type AdvancedModuleKey = "sport" | "markets" | "crypto" | "ai" | "advancedStats";
export type SubscriptionStatus = "none" | "active" | "expired";

export type UserLevelTest = {
  status: UserLevelTestStatus;
  level: UserLevel | null;
  completedAt: string | null;
};

export type EligibilityState = {
  majorityConfirmed: boolean;
  checkedAt: string | null;
};

export type AccountProfile = {
  displayName?: string;
  age?: number;
  role: AccountRole;
  createdAt: string;
};

export type UnlockedModules = Record<AdvancedModuleKey, boolean>;
export type PremiumAccess = Record<AdvancedModuleKey, boolean>;

export type UserAccessState = {
  mode: UserAccessMode;
  guestMode: boolean;
  accountMode: boolean;
  adminMode: boolean;
  fullAccess: boolean;
  account: AccountProfile | null;
  subscriptionStatus: SubscriptionStatus;
  eligibility: EligibilityState;
  userLevelTest: UserLevelTest;
  unlockedModules: UnlockedModules;
  premiumAccess: PremiumAccess;
  academyProgress: number;
  discoveryMessage: string;
  updatedAt: string;
};

export const USER_ACCESS_STORAGE_KEY = "@ascension/user-access/v1";

const discoveryMessage =
  "Tu peux explorer librement. Crée un compte seulement si tu veux sauvegarder ta progression.";

const defaultUserAccessState: UserAccessState = {
  mode: "guest",
  guestMode: true,
  accountMode: false,
  adminMode: false,
  fullAccess: false,
  account: null,
  subscriptionStatus: "none",
  eligibility: {
    majorityConfirmed: false,
    checkedAt: null
  },
  userLevelTest: {
    status: "not_started",
    level: null,
    completedAt: null
  },
  unlockedModules: {
    sport: false,
    markets: false,
    crypto: false,
    ai: false,
    advancedStats: false
  },
  premiumAccess: {
    sport: false,
    markets: false,
    crypto: false,
    ai: false,
    advancedStats: false
  },
  academyProgress: 0,
  discoveryMessage,
  updatedAt: new Date().toISOString()
};

const allModulesUnlocked: UnlockedModules = {
  sport: true,
  markets: true,
  crypto: true,
  ai: true,
  advancedStats: true
};

const allPremiumAccess: PremiumAccess = {
  sport: true,
  markets: true,
  crypto: true,
  ai: true,
  advancedStats: true
};

export const UserAccessService = {
  async getState(academyState?: AcademyEngineState): Promise<UserAccessState> {
    const storedState = await loadStoredAccessState();
    return hydrateAccessState(storedState, academyState);
  },

  async completeLevelTest(level: UserLevel, academyState?: AcademyEngineState) {
    const storedState = await loadStoredAccessState();
    const nextState: UserAccessState = {
      ...storedState,
      userLevelTest: {
        status: "completed",
        level,
        completedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };

    await saveStoredAccessState(nextState);
    return hydrateAccessState(nextState, academyState);
  },

  async activateAccountMode(account: Partial<AccountProfile> = {}, academyState?: AcademyEngineState) {
    const storedState = await loadStoredAccessState();
    const nextState: UserAccessState = {
      ...storedState,
      mode: "account",
      guestMode: false,
      accountMode: true,
      adminMode: false,
      account: {
        ...account,
        role: "user",
        createdAt: storedState.account?.createdAt ?? new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };

    await saveStoredAccessState(nextState);
    return hydrateAccessState(nextState, academyState);
  },

  async activateAdminMode(account: Partial<AccountProfile> = {}, academyState?: AcademyEngineState) {
    const storedState = await loadStoredAccessState();
    const nextState: UserAccessState = {
      ...storedState,
      mode: "admin",
      guestMode: false,
      accountMode: true,
      adminMode: true,
      fullAccess: true,
      account: {
        ...account,
        role: "admin",
        createdAt: storedState.account?.createdAt ?? new Date().toISOString()
      },
      subscriptionStatus: "active",
      eligibility: {
        majorityConfirmed: true,
        checkedAt: new Date().toISOString()
      },
      unlockedModules: allModulesUnlocked,
      premiumAccess: allPremiumAccess,
      updatedAt: new Date().toISOString()
    };

    await saveStoredAccessState(nextState);
    return hydrateAccessState(nextState, academyState);
  },

  async setSubscriptionStatus(status: SubscriptionStatus, academyState?: AcademyEngineState) {
    const storedState = await loadStoredAccessState();
    const nextState: UserAccessState = {
      ...storedState,
      subscriptionStatus: status,
      updatedAt: new Date().toISOString()
    };

    await saveStoredAccessState(nextState);
    return hydrateAccessState(nextState, academyState);
  },

  async confirmEligibility(academyState?: AcademyEngineState) {
    const storedState = await loadStoredAccessState();
    const nextState: UserAccessState = {
      ...storedState,
      eligibility: {
        majorityConfirmed: true,
        checkedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };

    await saveStoredAccessState(nextState);
    return hydrateAccessState(nextState, academyState);
  },

  async returnToGuestMode(academyState?: AcademyEngineState) {
    const storedState = await loadStoredAccessState();
    const nextState: UserAccessState = {
      ...storedState,
      mode: "guest",
      guestMode: true,
      accountMode: false,
      adminMode: false,
      fullAccess: false,
      account: null,
      subscriptionStatus: "none",
      eligibility: defaultUserAccessState.eligibility,
      unlockedModules: defaultUserAccessState.unlockedModules,
      premiumAccess: defaultUserAccessState.premiumAccess,
      updatedAt: new Date().toISOString()
    };

    await saveStoredAccessState(nextState);
    return hydrateAccessState(nextState, academyState);
  }
};

async function loadStoredAccessState() {
  const rawState = await AsyncStorage.getItem(USER_ACCESS_STORAGE_KEY);
  return rawState ? normalizeAccessState(JSON.parse(rawState) as UserAccessState) : defaultUserAccessState;
}

async function saveStoredAccessState(state: UserAccessState) {
  await AsyncStorage.setItem(USER_ACCESS_STORAGE_KEY, JSON.stringify(state));
}

function hydrateAccessState(state: UserAccessState, academyState?: AcademyEngineState): UserAccessState {
  const academyProgress = academyState?.progressPercent ?? state.academyProgress;
  const hasCompletedLevelTest = state.userLevelTest.status === "completed";
  const academyUnlocks = academyState?.unlocks ?? { sport: false, markets: false, ai: false };
  const isAdmin = state.adminMode || state.account?.role === "admin";
  const hasPremiumRequirements = state.subscriptionStatus === "active" && state.eligibility.majorityConfirmed;
  const unlockedModules = {
    sport: isAdmin || (hasCompletedLevelTest && academyUnlocks.sport),
    markets: isAdmin || (hasCompletedLevelTest && academyUnlocks.markets),
    crypto: isAdmin || (hasCompletedLevelTest && academyUnlocks.markets),
    ai: isAdmin || (hasCompletedLevelTest && academyUnlocks.ai),
    advancedStats: isAdmin || (hasCompletedLevelTest && academyProgress >= 100)
  };

  return {
    ...state,
    guestMode: state.mode === "guest",
    accountMode: state.mode === "account" || state.mode === "admin",
    adminMode: isAdmin,
    fullAccess: isAdmin,
    academyProgress,
    discoveryMessage,
    unlockedModules,
    premiumAccess: {
      sport: isAdmin || (hasPremiumRequirements && unlockedModules.sport),
      markets: isAdmin || (hasPremiumRequirements && unlockedModules.markets),
      crypto: isAdmin || (hasPremiumRequirements && unlockedModules.crypto),
      ai: isAdmin || (hasPremiumRequirements && unlockedModules.ai),
      advancedStats: isAdmin || (hasPremiumRequirements && unlockedModules.advancedStats)
    }
  };
}

function normalizeAccessState(state: UserAccessState): UserAccessState {
  return {
    ...defaultUserAccessState,
    ...state,
    userLevelTest: {
      ...defaultUserAccessState.userLevelTest,
      ...state.userLevelTest
    },
    unlockedModules: {
      ...defaultUserAccessState.unlockedModules,
      ...state.unlockedModules
    },
    premiumAccess: {
      ...defaultUserAccessState.premiumAccess,
      ...state.premiumAccess
    },
    eligibility: {
      ...defaultUserAccessState.eligibility,
      ...state.eligibility
    },
    discoveryMessage
  };
}
