import {
  BankrollBet,
  BankrollState,
  BankrollStats,
  BankrollTransaction
} from "@/features/bankroll/types";

export function createEmptyBankrollState(): BankrollState {
  return {
    initialCapital: null,
    transactions: [],
    bets: [],
    updatedAt: new Date().toISOString()
  };
}

export function getBankrollBetProfit(bet: Pick<BankrollBet, "odds" | "result" | "stake">) {
  if (bet.result === "won") {
    return bet.stake * Math.max(bet.odds - 1, 0);
  }

  if (bet.result === "lost") {
    return -bet.stake;
  }

  return 0;
}

export function getBankrollBetGrossReturn(bet: Pick<BankrollBet, "odds" | "result" | "stake">) {
  if (bet.result === "won") {
    return bet.stake * bet.odds;
  }

  if (bet.result === "void") {
    return bet.stake;
  }

  return 0;
}

export function getBankrollStats(state: BankrollState): BankrollStats {
  const initialCapital = state.initialCapital ?? 0;
  const deposits = sumTransactions(state.transactions, "deposit");
  const withdrawals = sumTransactions(state.transactions, "withdrawal");
  const placedBets = state.bets.filter((bet) => bet.result !== "void");
  const settledBets = placedBets.filter((bet) => bet.result === "won" || bet.result === "lost");
  const wonBets = settledBets.filter((bet) => bet.result === "won");
  const lostBets = settledBets.filter((bet) => bet.result === "lost");
  const voidBets = state.bets.filter((bet) => bet.result === "void");
  const pendingBets = state.bets.filter((bet) => bet.result === "pending");
  const totalStaked = settledBets.reduce((total, bet) => total + bet.stake, 0);
  const grossReturn = state.bets.reduce((total, bet) => total + getBankrollBetGrossReturn(bet), 0);
  const profit = state.bets.reduce((total, bet) => total + getBankrollBetProfit(bet), 0);
  const currentCapital = initialCapital + deposits - withdrawals + profit;
  const roi = totalStaked > 0 ? (profit / totalStaked) * 100 : 0;
  const winRate = settledBets.length > 0 ? (wonBets.length / settledBets.length) * 100 : 0;

  return {
    initialCapital,
    deposits,
    withdrawals,
    totalStaked,
    grossReturn,
    profit,
    currentCapital,
    roi,
    placedCount: state.bets.length,
    settledCount: settledBets.length,
    pendingCount: pendingBets.length,
    wonCount: wonBets.length,
    lostCount: lostBets.length,
    voidCount: voidBets.length,
    winRate
  };
}

export function setInitialCapital(state: BankrollState, initialCapital: number): BankrollState {
  return touch({
    ...state,
    initialCapital
  });
}

export function addBankrollTransaction(
  state: BankrollState,
  transaction: Omit<BankrollTransaction, "id" | "createdAt">
): BankrollState {
  return touch({
    ...state,
    transactions: [
      {
        ...transaction,
        id: `txn-${Date.now()}`,
        createdAt: new Date().toISOString()
      },
      ...state.transactions
    ]
  });
}

export function upsertBankrollBet(state: BankrollState, bet: BankrollBet): BankrollState {
  const existingIndex = state.bets.findIndex((currentBet) => currentBet.id === bet.id);

  if (existingIndex === -1) {
    return touch({
      ...state,
      bets: [bet, ...state.bets]
    });
  }

  const bets = [...state.bets];
  bets[existingIndex] = bet;

  return touch({
    ...state,
    bets
  });
}

export function removeBankrollBetsBySource(state: BankrollState, source: BankrollBet["source"]) {
  return touch({
    ...state,
    bets: state.bets.filter((bet) => bet.source !== source)
  });
}

function sumTransactions(transactions: BankrollTransaction[], type: BankrollTransaction["type"]) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

function touch(state: BankrollState): BankrollState {
  return {
    ...state,
    updatedAt: new Date().toISOString()
  };
}
