import AsyncStorage from "@react-native-async-storage/async-storage";

import { createEmptyBankrollState, setInitialCapital } from "@/features/bankroll/math";
import { realAscensionHistoryBets, removedDemoBetIds } from "@/features/bankroll/seed";
import { BankrollState } from "@/features/bankroll/types";

export const BANKROLL_STORAGE_KEY = "@ascension/bankroll/v1";
export const BANKROLL_STATE_STORAGE_KEY = "@ascension/bankroll/state/v1";

export async function loadBankrollState(): Promise<BankrollState> {
  const rawState = await AsyncStorage.getItem(BANKROLL_STATE_STORAGE_KEY);

  if (rawState) {
    return withRealAscensionHistory(normalizeBankrollState(JSON.parse(rawState) as Partial<BankrollState>));
  }

  const legacyInitialBankroll = await loadInitialBankroll();
  const emptyState = withRealAscensionHistory(createEmptyBankrollState());
  return legacyInitialBankroll === null ? emptyState : setInitialCapital(emptyState, legacyInitialBankroll);
}

export async function saveBankrollState(state: BankrollState) {
  await AsyncStorage.setItem(BANKROLL_STATE_STORAGE_KEY, JSON.stringify(withRealAscensionHistory(normalizeBankrollState(state))));
}

export async function loadInitialBankroll() {
  const state = await readStoredBankrollState();

  if (state?.initialCapital !== undefined && state.initialCapital !== null) {
    return state.initialCapital;
  }

  const rawBankroll = await AsyncStorage.getItem(BANKROLL_STORAGE_KEY);
  const parsedBankroll = rawBankroll ? Number(rawBankroll) : null;
  return Number.isFinite(parsedBankroll) ? parsedBankroll : null;
}

export async function saveInitialBankroll(bankroll: number) {
  const state = await loadBankrollState();
  await saveBankrollState(setInitialCapital(state, bankroll));
  await AsyncStorage.setItem(BANKROLL_STORAGE_KEY, String(bankroll));
}

export async function clearInitialBankroll() {
  await AsyncStorage.multiRemove([BANKROLL_STORAGE_KEY, BANKROLL_STATE_STORAGE_KEY]);
}

async function readStoredBankrollState() {
  const rawState = await AsyncStorage.getItem(BANKROLL_STATE_STORAGE_KEY);
  return rawState ? normalizeBankrollState(JSON.parse(rawState) as Partial<BankrollState>) : null;
}

function normalizeBankrollState(state: Partial<BankrollState>): BankrollState {
  return {
    initialCapital: typeof state.initialCapital === "number" ? state.initialCapital : null,
    transactions: Array.isArray(state.transactions) ? state.transactions : [],
    bets: Array.isArray(state.bets) ? state.bets : [],
    updatedAt: state.updatedAt ?? new Date().toISOString()
  };
}

function withRealAscensionHistory(state: BankrollState): BankrollState {
  const cleanedBets = state.bets.filter((bet) => !removedDemoBetIds.has(bet.id) && !removedDemoBetIds.has(bet.sourceId ?? ""));
  const byId = new Map(cleanedBets.map((bet) => [bet.id, bet]));

  realAscensionHistoryBets.forEach((bet) => {
    byId.set(bet.id, bet);
  });

  return {
    ...state,
    initialCapital: state.initialCapital,
    bets: Array.from(byId.values()).sort((left, right) => right.placedAt.localeCompare(left.placedAt)),
    updatedAt: new Date().toISOString()
  };
}
