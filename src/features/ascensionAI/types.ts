import { ChatGPTImportResult } from "@/features/tickets/importChatGPT";
import { MarketOpportunitiesPayload } from "@/features/markets/types";
import {
  AscensionTicket,
  TicketApiPayload,
  TomorrowPrediction
} from "@/features/tickets/types";

export type AscensionAIImportParams = {
  json: string;
  tickets: AscensionTicket[];
  tomorrowPredictions: TomorrowPrediction[];
};

export type AscensionAIServiceContract = {
  getSportPredictions: () => Promise<TicketApiPayload>;
  getMarketOpportunities: () => Promise<MarketOpportunitiesPayload>;
  importFromJson: (params: AscensionAIImportParams) => ChatGPTImportResult;
};
