import {
  OfficialTicketResult,
  TicketApiPayload,
  TomorrowPredictionsPayload
} from "@/features/tickets/types";

export const localTicketPayload: TicketApiPayload = {
  generatedAt: new Date().toISOString(),
  source: "local",
  selections: [],
  initialTickets: [
    {
      selection: {
        id: "ascension-today-2026-06-30-france-suede",
        providerSelectionId: "ascension-today-2026-06-30-france-suede",
        date: "2026-06-30",
        sport: "Football",
        competition: "Sélection officielle Ascension",
        match: "France vs Suède",
        kickoffTime: "16:00",
        market: "France qualifiée",
        recommendedMarket: "France qualifiée",
        pick: "France qualifiée",
        estimatedOdds: 1.11,
        ascensionScore: 91,
        confidenceLevel: "Élevé",
        strengths: [],
        risks: [],
        conclusion: undefined,
        explanation: "Sélection officielle Ascension du jour.",
        status: "pending"
      },
      input: {
        realOdds: "",
        stake: "",
        playStatus: "not_decided"
      },
      savedAt: "2026-06-30T08:00:00.000Z"
    },
    {
      selection: {
        id: "ascension-today-2026-06-29-bresil-japon",
        providerSelectionId: "ascension-today-2026-06-29-bresil-japon",
        date: "2026-06-29",
        sport: "Football",
        competition: "Pronostic Ascension",
        match: "Brésil vs Japon",
        kickoffTime: "18:00",
        market: "Brésil gagne",
        recommendedMarket: "Brésil gagne",
        pick: "Brésil gagne",
        estimatedOdds: 1.68,
        ascensionScore: 88,
        confidenceLevel: "Élevé",
        strengths: [
          "Le Brésil présente un profil supérieur sur le papier.",
          "Marché simple à suivre et facile à vérifier.",
          "Cote réelle validée à 1,68.",
          "Ticket déjà terminé avec résultat favorable."
        ],
        risks: [
          "Aucun risque restant : le résultat est déjà connu."
        ],
        conclusion: "Ticket terminé et gagné. Ascension le conserve dans l'historique pour que le suivi reste complet.",
        explanation: "Résultat : Victoire du Brésil.",
        status: "won",
        scoreFinal: "Victoire du Brésil",
        officialResult: "won",
        officialScore: "Victoire du Brésil",
        resultUpdatedAt: "2026-06-29T20:00:00.000Z"
      },
      input: {
        realOdds: "1,68",
        stake: "2",
        playStatus: "played"
      },
      savedAt: "2026-06-29T17:55:00.000Z",
      syncedAt: "2026-06-29T20:00:00.000Z"
    },
    {
      selection: {
        id: "ascension-today-2026-06-29-allemagne-paraguay",
        providerSelectionId: "ascension-today-2026-06-29-allemagne-paraguay",
        date: "2026-06-29",
        sport: "Football",
        competition: "Pronostic Ascension",
        match: "Allemagne vs Paraguay",
        kickoffTime: "21:00",
        market: "Allemagne gagne",
        recommendedMarket: "Allemagne gagne",
        pick: "Allemagne gagne",
        estimatedOdds: 1.33,
        ascensionScore: 90,
        confidenceLevel: "Très élevé",
        strengths: [
          "L'Allemagne domine les statistiques offensives.",
          "Adversaire inférieur sur le papier.",
          "Effectif presque au complet.",
          "Modèle Ascension favorable."
        ],
        risks: [
          "Rotation possible en fin de match."
        ],
        conclusion: "Sélection très solide. C'est le pari le plus fiable de la journée.",
        explanation: "Ticket joué et en attente du résultat officiel.",
        status: "pending"
      },
      input: {
        realOdds: "1,33",
        stake: "2",
        playStatus: "played"
      },
      savedAt: "2026-06-29T20:50:00.000Z"
    }
  ]
};

export const removedLocalTicketIds = new Set([
  "local-ascension-football-over-05",
  "local-ascension-tennis-winner",
  "local-ascension-basket-spread"
]);

export const localOfficialResults: OfficialTicketResult[] = [
  {
    providerSelectionId: "ascension-today-2026-06-29-allemagne-paraguay",
    status: "lost",
    scoreFinal: "Allemagne 0-0 Paraguay",
    officialScore: "Allemagne 0-0 Paraguay",
    settledAt: "2026-06-30T00:00:00.000Z"
  }
];

export const localTomorrowPredictionsPayload: TomorrowPredictionsPayload = {
  generatedAt: new Date().toISOString(),
  source: "local",
  predictions: [
    {
      id: "tomorrow-ascension-2026-06-30-france-suede",
      date: "2026-06-30",
      sport: "Football",
      kickoffTime: "16:00",
      competition: "Prévision Ascension",
      match: "France vs Suède",
      plannedMarket: "France gagne",
      estimatedOdds: 1.26,
      ascensionScore: 82,
      provisionalConfidence: "Élevée",
      checkpoints: [
        "Compositions",
        "Blessures",
        "Rotation offensive",
        "Cote toujours >= 1,20"
      ],
      status: "confirm_tomorrow"
    },
    {
      id: "tomorrow-ascension-2026-06-30-cote-ivoire-norvege",
      date: "2026-06-30",
      sport: "Football",
      kickoffTime: "19:00",
      competition: "Prévision Ascension",
      match: "Côte d’Ivoire vs Norvège",
      plannedMarket: "Norvège gagne ou nul / ou Norvège qualification selon cote disponible",
      ascensionScore: 68,
      provisionalConfidence: "Moyenne",
      checkpoints: [
        "Marché exact disponible sur Winamax",
        "Forme d’Haaland",
        "Composition Norvège",
        "Prudence car match à élimination directe"
      ],
      status: "confirm_tomorrow"
    },
    {
      id: "tomorrow-ascension-2026-07-01-mexique-equateur",
      date: "2026-07-01",
      sport: "Football",
      kickoffTime: "03:00",
      competition: "Prévision Ascension",
      match: "Mexique vs Équateur",
      plannedMarket: "Mexique ou nul",
      ascensionScore: 72,
      provisionalConfidence: "Moyenne+",
      checkpoints: [
        "Horaire exact en France",
        "Cote double chance disponible",
        "Compositions",
        "Fatigue/dynamique"
      ],
      status: "confirm_tomorrow"
    }
  ]
};
