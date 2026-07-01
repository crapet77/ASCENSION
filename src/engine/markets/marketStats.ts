import { MarketEngineOpportunity } from "@/engine/markets/model";
import {
  MarketCategory,
  MarketOpportunityStatus
} from "@/features/markets/types";

export type MarketStats = {
  total: number;
  displayedToday: number;
  averageScore: number;
  byCategory: Record<MarketCategory, number>;
  byStatus: Record<MarketOpportunityStatus, number>;
};

const emptyCategoryStats: Record<MarketCategory, number> = {
  action: 0,
  etf: 0,
  crypto: 0,
  matiere_premiere: 0,
  devise: 0,
  indice: 0
};

const emptyStatusStats: Record<MarketOpportunityStatus, number> = {
  forecast: 0,
  watchlist: 0,
  validated: 0,
  ignored: 0,
  finished: 0
};

export function getMarketStats(opportunities: MarketEngineOpportunity[]): MarketStats {
  const byCategory = { ...emptyCategoryStats };
  const byStatus = { ...emptyStatusStats };
  const scoreTotal = opportunities.reduce((total, opportunity) => {
    byCategory[opportunity.category] += 1;
    byStatus[opportunity.status] += 1;
    return total + opportunity.ascensionScore;
  }, 0);

  return {
    total: opportunities.length,
    displayedToday: Math.min(opportunities.length, 3),
    averageScore: opportunities.length > 0 ? Math.round(scoreTotal / opportunities.length) : 0,
    byCategory,
    byStatus
  };
}
