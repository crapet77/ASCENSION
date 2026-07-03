import {
  AscensionTicket,
  AscensionTicketResultStatus,
  OfficialTicketResult,
  TicketApiPayload,
  TomorrowPredictionsPayload
} from "@/features/tickets/types";

type RealAscensionTicketSeed = {
  id: string;
  date: string;
  match: string;
  market: string;
  odds: number;
  score: string;
  status: AscensionTicketResultStatus;
  kickoffTime?: string;
};

const realAscensionTicketSeeds: RealAscensionTicketSeed[] = [
  {
    id: "real-2026-06-23-colombie-rd-congo-double-chance-over-05",
    date: "2026-06-23",
    match: "Colombie vs RD Congo",
    market: "Double chance Colombie ou nul + Plus de 0,5 but",
    odds: 1.20,
    score: "Colombie 1 - 0 RD Congo",
    status: "won"
  },
  {
    id: "real-2026-06-24-bresil-ecosse-victoire-bresil",
    date: "2026-06-24",
    match: "Brésil vs Écosse",
    market: "Victoire Brésil",
    odds: 1.32,
    score: "Écosse 0 - 3 Brésil",
    status: "won"
  },
  {
    id: "real-2026-06-24-suisse-canada-double-chance",
    date: "2026-06-24",
    match: "Suisse vs Canada",
    market: "Double chance Suisse ou nul",
    odds: 1.32,
    score: "Suisse 2 - 1 Canada",
    status: "won"
  },
  {
    id: "real-2026-06-24-maroc-haiti-victoire-maroc",
    date: "2026-06-24",
    match: "Maroc vs Haïti",
    market: "Victoire Maroc",
    odds: 1.21,
    score: "Maroc 4 - 2 Haïti",
    status: "won"
  },
  {
    id: "real-2026-06-25-japon-suede-over-15",
    date: "2026-06-25",
    match: "Japon vs Suède",
    market: "Plus de 1,5 but",
    odds: 1.24,
    score: "Japon 1 - 1 Suède",
    status: "won"
  },
  {
    id: "real-2026-06-25-equateur-allemagne-double-chance-over-05",
    date: "2026-06-25",
    match: "Équateur vs Allemagne",
    market: "Double chance Allemagne ou nul + Plus de 0,5 but",
    odds: 1.20,
    score: "Équateur 2 - 1 Allemagne",
    status: "lost"
  },
  {
    id: "real-2026-06-25-turquie-etats-unis-double-chance",
    date: "2026-06-25",
    match: "Turquie vs États-Unis",
    market: "Double chance États-Unis ou nul",
    odds: 1.29,
    score: "Turquie 3 - 2 États-Unis",
    status: "lost"
  },
  {
    id: "real-2026-06-27-jordanie-argentine-victoire-argentine",
    date: "2026-06-27",
    match: "Jordanie vs Argentine",
    market: "Victoire Argentine",
    odds: 1.15,
    score: "Jordanie 1 - 3 Argentine",
    status: "won"
  },
  {
    id: "real-2026-06-27-panama-angleterre-victoire-angleterre",
    date: "2026-06-27",
    match: "Panama vs Angleterre",
    market: "Victoire Angleterre",
    odds: 1.15,
    score: "Panama 0 - 2 Angleterre",
    status: "won"
  },
  {
    id: "real-2026-06-29-bresil-japon-victoire-bresil",
    date: "2026-06-29",
    match: "Brésil vs Japon",
    market: "Victoire Brésil",
    odds: 1.68,
    score: "Brésil 2 - 1 Japon",
    status: "won"
  },
  {
    id: "real-2026-06-29-allemagne-paraguay-victoire-allemagne",
    date: "2026-06-29",
    match: "Allemagne vs Paraguay",
    market: "Victoire Allemagne",
    odds: 1.33,
    score: "Allemagne 1 - 1 Paraguay, Paraguay gagne aux tirs au but",
    status: "lost"
  },
  {
    id: "real-2026-06-30-mexique-equateur-double-chance-over-05",
    date: "2026-06-30",
    match: "Mexique vs Équateur",
    market: "Double chance Mexique ou nul + Plus de 0,5 but",
    odds: 1.44,
    score: "Mexique 2 - 0 Équateur",
    status: "won"
  },
  {
    id: "real-2026-06-30-france-suede-victoire-france",
    date: "2026-06-30",
    match: "France vs Suède",
    market: "Victoire France",
    odds: 1.28,
    score: "France 3 - 0 Suède",
    status: "won"
  },
  {
    id: "real-2026-07-01-angleterre-rd-congo-over-15",
    date: "2026-07-01",
    match: "Angleterre vs RD Congo",
    market: "Plus de 1,5 but",
    odds: 1.31,
    score: "Angleterre 2 - 1 RD Congo",
    status: "won"
  },
  {
    id: "real-2026-07-01-etats-unis-bosnie-over-15",
    date: "2026-07-01",
    match: "États-Unis vs Bosnie-Herzégovine",
    market: "Plus de 1,5 but",
    odds: 1.20,
    score: "États-Unis 2 - 0 Bosnie-Herzégovine",
    status: "won"
  },
  {
    id: "real-2026-07-02-espagne-autriche-qualification-espagne",
    date: "2026-07-02",
    match: "Espagne vs Autriche",
    market: "Qualification Espagne",
    odds: 1.13,
    score: "à venir",
    status: "pending"
  },
  {
    id: "real-2026-07-02-espagne-autriche-over-15",
    date: "2026-07-02",
    match: "Espagne vs Autriche",
    market: "Plus de 1,5 but",
    odds: 1.21,
    score: "à venir",
    status: "pending"
  }
];

export const realAscensionTickets: AscensionTicket[] = realAscensionTicketSeeds.map(createRealAscensionTicket);

export const localTicketPayload: TicketApiPayload = {
  generatedAt: new Date().toISOString(),
  source: "local",
  selections: [],
  initialTickets: realAscensionTickets
};

export const removedLocalTicketIds = new Set([
  "local-ascension-football-over-05",
  "local-ascension-tennis-winner",
  "local-ascension-basket-spread",
  "ascension-today-2026-06-30-france-suede",
  "ascension-today-2026-06-29-bresil-japon",
  "ascension-today-2026-06-29-allemagne-paraguay",
  "ascension-2026-07-02-angleterre-rd-congo-over-15",
  "ascension-2026-07-02-usa-bosnie-over-15",
  "ascension-2026-07-02-espagne-autriche-qualification",
  "ascension-2026-07-02-espagne-autriche-over-15"
]);

export const localOfficialResults: OfficialTicketResult[] = [];

export const localTomorrowPredictionsPayload: TomorrowPredictionsPayload = {
  generatedAt: new Date().toISOString(),
  source: "local",
  predictions: []
};

function createRealAscensionTicket(seed: RealAscensionTicketSeed): AscensionTicket {
  const isPending = seed.status === "pending";
  const settledAt = isPending ? undefined : `${seed.date}T22:00:00.000Z`;
  const savedAt = `${seed.date}T12:00:00.000Z`;

  return {
    selection: {
      id: seed.id,
      providerSelectionId: seed.id,
      date: seed.date,
      sport: "Football",
      competition: "Historique réel Ascension",
      match: seed.match,
      kickoffTime: seed.kickoffTime ?? (isPending ? "À venir" : "Terminé"),
      market: seed.market,
      recommendedMarket: seed.market,
      pick: seed.market,
      estimatedOdds: seed.odds,
      ascensionScore: 0,
      confidenceLevel: isPending ? "En attente" : "Résultat officiel",
      strengths: [],
      risks: [],
      conclusion: isPending ? undefined : `Ticket ${seed.status === "won" ? "gagné" : "perdu"} selon le résultat officiel.`,
      explanation: isPending ? "Score officiel à venir." : `Score officiel : ${seed.score}.`,
      status: seed.status,
      scoreFinal: isPending ? undefined : seed.score,
      officialResult: isPending ? undefined : seed.status,
      officialScore: isPending ? undefined : seed.score,
      resultUpdatedAt: settledAt
    },
    input: {
      realOdds: seed.odds.toFixed(2),
      stake: "2",
      playStatus: "played"
    },
    savedAt,
    syncedAt: settledAt
  };
}
