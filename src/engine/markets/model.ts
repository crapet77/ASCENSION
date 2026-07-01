import {
  MarketCategory,
  MarketDirection,
  MarketOpportunity,
  MarketOpportunityStatus
} from "@/features/markets/types";
import { MarketStats } from "@/engine/markets/marketStats";

export type MarketEngineOpportunity = MarketOpportunity;

export type MarketEngineFilters = {
  categories?: MarketCategory[];
  directions?: MarketDirection[];
  statuses?: MarketOpportunityStatus[];
  limit?: number;
};

export type MarketEngineState = {
  opportunities: MarketEngineOpportunity[];
  bestOpportunities: MarketEngineOpportunity[];
  dailyOpportunity: MarketEngineOpportunity | null;
  secondaryOpportunities: MarketEngineOpportunity[];
  history: MarketEngineOpportunity[];
  stats: MarketStats;
  generatedAt: string;
  source: "local" | "ai" | "api";
};
