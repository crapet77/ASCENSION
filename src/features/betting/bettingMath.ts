import { Bet } from "@/types/domain";

export const initialBankroll = 1000;

export function getBetProfit(bet: Bet) {
  // Le profit est volontairement calcule sans conseil de pari : V1 reste centree gestion et statistiques.
  if (bet.result === "won") {
    return bet.stake * (bet.odds - 1);
  }

  if (bet.result === "lost") {
    return -bet.stake;
  }

  return 0;
}

export function getBettingStats(bets: Bet[]) {
  const settledBets = bets.filter((bet) => bet.result === "won" || bet.result === "lost");
  const profit = bets.reduce((total, bet) => total + getBetProfit(bet), 0);
  const wins = settledBets.filter((bet) => bet.result === "won").length;
  const totalStaked = bets.reduce((total, bet) => total + bet.stake, 0);
  // ROI simple : performance nette divisee par le total mise.
  const roi = totalStaked > 0 ? (profit / totalStaked) * 100 : 0;

  return {
    bankroll: initialBankroll + profit,
    profit,
    roi,
    winRate: settledBets.length > 0 ? (wins / settledBets.length) * 100 : 0,
    pending: bets.filter((bet) => bet.result === "pending").length
  };
}
