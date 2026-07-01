import AsyncStorage from "@react-native-async-storage/async-storage";

import { MarketEngineOpportunity } from "@/engine/markets/model";

export const MARKET_ENGINE_STORAGE_KEY = "@ascension/engine/markets/v2";

export async function loadStoredMarketOpportunities() {
  const rawOpportunities = await AsyncStorage.getItem(MARKET_ENGINE_STORAGE_KEY);
  return rawOpportunities ? (JSON.parse(rawOpportunities) as MarketEngineOpportunity[]) : null;
}

export async function saveStoredMarketOpportunities(opportunities: MarketEngineOpportunity[]) {
  await AsyncStorage.setItem(MARKET_ENGINE_STORAGE_KEY, JSON.stringify(opportunities));
}
