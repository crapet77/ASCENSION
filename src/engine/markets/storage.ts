import AsyncStorage from "@react-native-async-storage/async-storage";

import { MarketEngineOpportunity } from "@/engine/markets/model";

export const MARKET_ENGINE_STORAGE_KEY = "@ascension/engine/markets/v2";

const removedSeedMarketOpportunityIds = new Set([
  "market-2026-06-30-btc-opportunity",
  "market-2026-06-30-gold-watch",
  "market-2026-06-30-sp500-forecast"
]);

export async function loadStoredMarketOpportunities() {
  const rawOpportunities = await AsyncStorage.getItem(MARKET_ENGINE_STORAGE_KEY);
  if (!rawOpportunities) {
    return null;
  }

  const parsedOpportunities = JSON.parse(rawOpportunities) as MarketEngineOpportunity[];
  return parsedOpportunities.filter((opportunity) => !removedSeedMarketOpportunityIds.has(opportunity.id));
}

export async function saveStoredMarketOpportunities(opportunities: MarketEngineOpportunity[]) {
  await AsyncStorage.setItem(MARKET_ENGINE_STORAGE_KEY, JSON.stringify(opportunities));
}
