import {
  localTicketPayload,
  localTomorrowPredictionsPayload
} from "@/features/tickets/seed";
import { localMarketOpportunitiesPayload } from "@/features/markets/seed";
import { MarketOpportunitiesPayload } from "@/features/markets/types";
import {
  TicketApiPayload,
  TomorrowPredictionsPayload
} from "@/features/tickets/types";

export async function readLocalTodayPredictions(): Promise<TicketApiPayload> {
  return localTicketPayload;
}

export async function readLocalTomorrowPredictions(): Promise<TomorrowPredictionsPayload> {
  return localTomorrowPredictionsPayload;
}

export async function readLocalMarketOpportunities(): Promise<MarketOpportunitiesPayload> {
  return {
    ...localMarketOpportunitiesPayload,
    opportunities: localMarketOpportunitiesPayload.opportunities.slice(0, 3)
  };
}
