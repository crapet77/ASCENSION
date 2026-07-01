import { BankrollBet } from "@/features/bankroll/types";

export const ASCENSION_INITIAL_CAPITAL = 32;

export const realAscensionHistoryBets: BankrollBet[] = [
  {
    id: "real-ascension-2026-06-23-colombie-double-chance-over-05",
    source: "ticket",
    sourceId: "history-2026-06-23-colombie-double-chance-over-05",
    event: "Colombie ou match nul + Plus de 0,5 but",
    odds: 1.20,
    stake: 2,
    result: "won",
    placedAt: "2026-06-23",
    settledAt: "2026-06-23"
  },
  {
    id: "real-ascension-2026-06-24-bresil-gagne",
    source: "ticket",
    sourceId: "history-2026-06-24-bresil-gagne",
    event: "Brésil gagne",
    odds: 1.32,
    stake: 2,
    result: "won",
    placedAt: "2026-06-24",
    settledAt: "2026-06-24"
  },
  {
    id: "real-ascension-2026-06-24-suisse-double-chance",
    source: "ticket",
    sourceId: "history-2026-06-24-suisse-double-chance",
    event: "Suisse ou match nul",
    odds: 1.32,
    stake: 2,
    result: "won",
    placedAt: "2026-06-24",
    settledAt: "2026-06-24"
  },
  {
    id: "real-ascension-2026-06-24-maroc-gagne",
    source: "ticket",
    sourceId: "history-2026-06-24-maroc-gagne",
    event: "Maroc gagne",
    odds: 1.21,
    stake: 2,
    result: "won",
    placedAt: "2026-06-24",
    settledAt: "2026-06-24"
  },
  {
    id: "real-ascension-2026-06-25-japon-suede-over-15",
    source: "ticket",
    sourceId: "history-2026-06-25-japon-suede-over-15",
    event: "Japon - Suède : Plus de 1,5 buts",
    odds: 1.24,
    stake: 2,
    result: "won",
    placedAt: "2026-06-25",
    settledAt: "2026-06-25"
  },
  {
    id: "real-ascension-2026-06-25-etats-unis-double-chance",
    source: "ticket",
    sourceId: "history-2026-06-25-etats-unis-double-chance",
    event: "États-Unis ou match nul",
    odds: 1.29,
    stake: 2,
    result: "lost",
    placedAt: "2026-06-25",
    settledAt: "2026-06-25"
  },
  {
    id: "real-ascension-2026-06-25-allemagne-double-chance-over-05",
    source: "ticket",
    sourceId: "history-2026-06-25-allemagne-double-chance-over-05",
    event: "Allemagne ou match nul + Plus de 0,5 but",
    odds: 1.20,
    stake: 2,
    result: "lost",
    placedAt: "2026-06-25",
    settledAt: "2026-06-25"
  },
  {
    id: "real-ascension-2026-06-27-argentine-gagne",
    source: "ticket",
    sourceId: "history-2026-06-27-argentine-gagne",
    event: "Argentine gagne",
    odds: 1.15,
    stake: 2,
    result: "won",
    placedAt: "2026-06-27",
    settledAt: "2026-06-27"
  },
  {
    id: "real-ascension-2026-06-27-angleterre-gagne",
    source: "ticket",
    sourceId: "history-2026-06-27-angleterre-gagne",
    event: "Angleterre gagne",
    odds: 1.15,
    stake: 2,
    result: "won",
    placedAt: "2026-06-27",
    settledAt: "2026-06-27"
  },
  {
    id: "real-ascension-2026-06-28-canada-gagne",
    source: "ticket",
    sourceId: "history-2026-06-28-canada-gagne",
    event: "Canada gagne",
    odds: 1.64,
    stake: 2,
    result: "won",
    placedAt: "2026-06-28",
    settledAt: "2026-06-28"
  }
];

export const removedDemoBetIds = new Set([
  "ticket-asc-ticket-psg-om",
  "ticket-asc-ticket-real-barca",
  "asc-ticket-psg-om",
  "asc-ticket-real-barca"
]);
