import {
  readLocalTomorrowPredictions
} from "@/features/ascensionEngine/localSource";
import { AscensionAIService } from "@/features/ascensionAI";
import { pendingTicketResults } from "@/features/liveResults";
import { MarketOpportunitiesPayload } from "@/features/markets/types";
import {
  OfficialTicketResult,
  TicketApiPayload,
  TomorrowPredictionsPayload
} from "@/features/tickets/types";

export type AscensionEngine = {
  todayPredictions: () => Promise<TicketApiPayload>;
  tomorrowPredictions: () => Promise<TomorrowPredictionsPayload>;
  officialResults: () => Promise<OfficialTicketResult[]>;
  marketOpportunities: () => Promise<MarketOpportunitiesPayload>;
};

/**
 * Ascension Engine is the single entry point for prediction intelligence.
 *
 * UI screens and feature storage must not read local prediction data directly.
 * When Ascension AI or a sports API is ready, replace the two local source calls
 * below and keep the rest of the application unchanged.
 */
export const ascensionEngine: AscensionEngine = {
  async todayPredictions() {
    return AscensionAIService.getSportPredictions();
  },

  async tomorrowPredictions() {
    // Later, this will read tomorrow watchlist predictions from Ascension AI/API.
    return readLocalTomorrowPredictions();
  },

  async officialResults() {
    return pendingTicketResults();
  },

  async marketOpportunities() {
    return AscensionAIService.getMarketOpportunities();
  }
};

export async function todayPredictions() {
  return ascensionEngine.todayPredictions();
}

export async function tomorrowPredictions() {
  return ascensionEngine.tomorrowPredictions();
}

export async function officialResults() {
  return ascensionEngine.officialResults();
}

export async function marketOpportunities() {
  return ascensionEngine.marketOpportunities();
}
