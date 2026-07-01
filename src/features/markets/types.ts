export type MarketCategory = "action" | "etf" | "crypto" | "matiere_premiere" | "devise" | "indice";

export type MarketDirection = "achat" | "vente" | "surveillance";

export type MarketOpportunityStatus = "forecast" | "watchlist" | "validated" | "ignored" | "finished";

export type MarketOpportunity = {
  id: string;
  date: string;
  category: MarketCategory;
  asset: string;
  direction: MarketDirection;
  estimatedCurrentPrice: string;
  entryZone: string;
  target: string;
  stopLoss: string;
  risk: string;
  ascensionScore: number;
  confidenceLevel: string;
  confidenceStars: number;
  shortAnalysis: string;
  status: MarketOpportunityStatus;
};

export type MarketOpportunitiesPayload = {
  opportunities: MarketOpportunity[];
  generatedAt: string;
  source: "local" | "ai" | "api";
};
