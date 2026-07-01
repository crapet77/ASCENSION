import { MarketEngineFilters, MarketEngineOpportunity } from "@/engine/markets/model";
import { MarketOpportunity } from "@/features/markets/types";

export function normalizeMarketOpportunity(opportunity: MarketOpportunity): MarketEngineOpportunity {
  return {
    ...opportunity,
    confidenceStars: opportunity.confidenceStars ?? 3,
    stopLoss: opportunity.stopLoss || opportunity.risk
  };
}

export function filterMarketOpportunities(
  opportunities: MarketEngineOpportunity[],
  filters: MarketEngineFilters = {}
) {
  return opportunities
    .filter((opportunity) => !filters.categories || filters.categories.includes(opportunity.category))
    .filter((opportunity) => !filters.directions || filters.directions.includes(opportunity.direction))
    .filter((opportunity) => !filters.statuses || filters.statuses.includes(opportunity.status))
    .sort((left, right) => right.ascensionScore - left.ascensionScore)
    .slice(0, filters.limit ?? 3);
}

export function getBestMarketOpportunities(opportunities: MarketEngineOpportunity[]) {
  return filterMarketOpportunities(opportunities, {
    statuses: ["forecast", "watchlist", "validated"],
    limit: 3
  });
}

export function getDailyMarketOpportunity(opportunities: MarketEngineOpportunity[]) {
  return getBestMarketOpportunities(opportunities)[0] ?? null;
}

export function getSecondaryMarketOpportunities(opportunities: MarketEngineOpportunity[]) {
  return getBestMarketOpportunities(opportunities).slice(1, 3);
}
