import AsyncStorage from "@react-native-async-storage/async-storage";

import { MarketEngineOpportunity } from "@/engine/markets/model";

export const MARKET_HISTORY_STORAGE_KEY = "@ascension/engine/markets/history/v1";

const removedSeedMarketOpportunityIds = new Set([
  "market-2026-06-30-btc-opportunity",
  "market-2026-06-30-gold-watch",
  "market-2026-06-30-sp500-forecast"
]);

export async function loadMarketHistory() {
  const rawHistory = await AsyncStorage.getItem(MARKET_HISTORY_STORAGE_KEY);
  if (!rawHistory) {
    return [];
  }

  const parsedHistory = JSON.parse(rawHistory) as MarketEngineOpportunity[];
  return parsedHistory.filter((opportunity) => !removedSeedMarketOpportunityIds.has(opportunity.id));
}

export async function saveMarketHistory(history: MarketEngineOpportunity[]) {
  await AsyncStorage.setItem(MARKET_HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function getFinishedMarketOpportunities(opportunities: MarketEngineOpportunity[]) {
  return opportunities.filter((opportunity) => opportunity.status === "finished");
}
