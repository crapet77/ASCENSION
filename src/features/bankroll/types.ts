import { BetResult } from "@/types/domain";

export type BankrollTransactionType = "deposit" | "withdrawal";

export type BankrollTransaction = {
  id: string;
  type: BankrollTransactionType;
  amount: number;
  note?: string;
  createdAt: string;
};

export type BankrollBetSource = "manual" | "ticket";

export type BankrollBet = {
  id: string;
  source: BankrollBetSource;
  sourceId?: string;
  event: string;
  odds: number;
  stake: number;
  result: BetResult;
  placedAt: string;
  settledAt?: string;
};

export type BankrollState = {
  initialCapital: number | null;
  transactions: BankrollTransaction[];
  bets: BankrollBet[];
  updatedAt: string;
};

export type BankrollStats = {
  initialCapital: number;
  deposits: number;
  withdrawals: number;
  totalStaked: number;
  grossReturn: number;
  profit: number;
  currentCapital: number;
  roi: number;
  placedCount: number;
  settledCount: number;
  pendingCount: number;
  wonCount: number;
  lostCount: number;
  voidCount: number;
  winRate: number;
};
