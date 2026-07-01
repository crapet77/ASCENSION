import { MarketOpportunitiesPayload } from "@/features/markets/types";

export const localMarketOpportunitiesPayload: MarketOpportunitiesPayload = {
  generatedAt: new Date().toISOString(),
  source: "local",
  opportunities: [
    {
      id: "market-2026-06-30-btc-opportunity",
      date: "2026-06-30",
      category: "crypto",
      asset: "Bitcoin (BTC)",
      direction: "achat",
      estimatedCurrentPrice: "107 250 $",
      entryZone: "106 500 - 107 500 $",
      target: "112 000 $",
      stopLoss: "103 900 $",
      risk: "Invalidation sous 103 900 $",
      ascensionScore: 89,
      confidenceLevel: "Très élevée",
      confidenceStars: 5,
      shortAnalysis:
        "Bitcoin reste l'opportunité la plus lisible du jour. La zone d'entrée est proche du prix actuel, le risque est défini, et le potentiel de reprise reste favorable tant que le support est respecté.",
      status: "validated"
    },
    {
      id: "market-2026-06-30-gold-watch",
      date: "2026-06-30",
      category: "matiere_premiere",
      asset: "Or",
      direction: "surveillance",
      estimatedCurrentPrice: "2 335 $",
      entryZone: "2 315 - 2 330 $",
      target: "2 380 $",
      stopLoss: "2 295 $",
      risk: "Sensibilité forte au dollar et aux taux",
      ascensionScore: 78,
      confidenceLevel: "Moyenne+",
      confidenceStars: 3,
      shortAnalysis:
        "L'or reste intéressant en protection, mais Ascension attend une entrée plus propre avant validation. La zone actuelle demande de la patience.",
      status: "watchlist"
    },
    {
      id: "market-2026-06-30-sp500-forecast",
      date: "2026-06-30",
      category: "indice",
      asset: "S&P 500",
      direction: "surveillance",
      estimatedCurrentPrice: "5 480 pts",
      entryZone: "5 430 - 5 460 pts",
      target: "5 560 pts",
      stopLoss: "5 390 pts",
      risk: "Faux signal possible si le marché manque de volume",
      ascensionScore: 74,
      confidenceLevel: "Moyenne",
      confidenceStars: 3,
      shortAnalysis:
        "L'indice reste constructif, mais le signal n'est pas encore assez net. Ascension le classe en prévision avant confirmation.",
      status: "forecast"
    }
  ]
};
