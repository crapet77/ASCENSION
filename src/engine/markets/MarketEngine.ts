import {
  getBestMarketOpportunities,
  getDailyMarketOpportunity,
  getSecondaryMarketOpportunities,
  normalizeMarketOpportunity
} from "@/engine/markets/calculations";
import {
  getFinishedMarketOpportunities,
  loadMarketHistory,
  saveMarketHistory
} from "@/engine/markets/marketHistory";
import { MarketEngineState } from "@/engine/markets/model";
import { getMarketStats } from "@/engine/markets/marketStats";
import {
  loadStoredMarketOpportunities,
  saveStoredMarketOpportunities
} from "@/engine/markets/storage";
import { fetchMarketOpportunities } from "@/engine/markets/services";

export const MarketEngine = {
  async getState(): Promise<MarketEngineState> {
    const payload = await fetchMarketOpportunities();
    const localOpportunities = payload.opportunities.map(normalizeMarketOpportunity);
    const storedOpportunities = await loadStoredMarketOpportunities();
    const storedHistory = await loadMarketHistory();
    const opportunities = storedOpportunities ?? localOpportunities;
    const finishedOpportunities = getFinishedMarketOpportunities(opportunities);
    const history = mergeHistory(storedHistory, finishedOpportunities);

    if (!storedOpportunities) {
      await saveStoredMarketOpportunities(opportunities);
    }

    if (finishedOpportunities.length > 0) {
      await saveMarketHistory(history);
    }

    return {
      opportunities,
      bestOpportunities: getBestMarketOpportunities(opportunities),
      dailyOpportunity: getDailyMarketOpportunity(opportunities),
      secondaryOpportunities: getSecondaryMarketOpportunities(opportunities),
      history,
      stats: getMarketStats(opportunities),
      generatedAt: payload.generatedAt,
      source: payload.source
    };
  },

  saveOpportunities: saveStoredMarketOpportunities
};

function mergeHistory(
  storedHistory: ReturnType<typeof getFinishedMarketOpportunities>,
  finishedOpportunities: ReturnType<typeof getFinishedMarketOpportunities>
) {
  const byId = new Map(storedHistory.map((opportunity) => [opportunity.id, opportunity]));

  finishedOpportunities.forEach((opportunity) => {
    byId.set(opportunity.id, opportunity);
  });

  return Array.from(byId.values());
}
