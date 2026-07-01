import AsyncStorage from "@react-native-async-storage/async-storage";

import { MarketEngineOpportunity } from "@/engine/markets/model";

export const MARKET_HISTORY_STORAGE_KEY = "@ascension/engine/markets/history/v1";

export async function loadMarketHistory() {
  const rawHistory = await AsyncStorage.getItem(MARKET_HISTORY_STORAGE_KEY);
  return rawHistory ? (JSON.parse(rawHistory) as MarketEngineOpportunity[]) : [];
}

export async function saveMarketHistory(history: MarketEngineOpportunity[]) {
  await AsyncStorage.setItem(MARKET_HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function getFinishedMarketOpportunities(opportunities: MarketEngineOpportunity[]) {
  return opportunities.filter((opportunity) => opportunity.status === "finished");
}
