import { MarketOpportunitiesPayload } from "@/features/markets/types";

export const localMarketOpportunitiesPayload: MarketOpportunitiesPayload = {
  generatedAt: new Date().toISOString(),
  source: "local",
  opportunities: []
};
