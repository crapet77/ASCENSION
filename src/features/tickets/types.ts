export type AscensionTicketPlayStatus = "not_decided" | "played" | "not_played";

export type AscensionTicketResultStatus = "pending" | "won" | "lost" | "void";

export type AscensionPronosticStatus =
  | "pre_selection"
  | "played"
  | "not_played"
  | "pending"
  | "won"
  | "lost"
  | "void";

export type TomorrowPredictionStatus = "forecast" | "confirm_tomorrow" | "rejected";

export type AscensionSelection = {
  id: string;
  providerSelectionId?: string;
  date: string;
  sport: string;
  competition: string;
  match: string;
  kickoffTime: string;
  market: string;
  recommendedMarket?: string;
  pick: string;
  estimatedOdds?: number;
  ascensionScore: number;
  confidenceLevel?: string;
  strengths?: string[];
  risks?: string[];
  conclusion?: string;
  explanation: string;
  status: AscensionTicketResultStatus;
  scoreFinal?: string;
  officialResult?: AscensionTicketResultStatus;
  officialScore?: string;
  resultUpdatedAt?: string;
};

export type AscensionTicketInput = {
  realOdds: string;
  stake: string;
  playStatus: AscensionTicketPlayStatus;
};

export type AscensionTicket = {
  selection: AscensionSelection;
  input: AscensionTicketInput;
  savedAt: string;
  syncedAt?: string;
};

export type TicketApiPayload = {
  selections: AscensionSelection[];
  initialTickets?: AscensionTicket[];
  generatedAt: string;
  source: "api" | "ai" | "local";
};

export type TomorrowPrediction = {
  id: string;
  date: string;
  sport: string;
  kickoffTime: string;
  competition: string;
  match: string;
  plannedMarket: string;
  estimatedOdds?: number;
  ascensionScore: number;
  provisionalConfidence: string;
  checkpoints: string[];
  status: TomorrowPredictionStatus;
};

export type TomorrowPredictionsPayload = {
  predictions: TomorrowPrediction[];
  generatedAt: string;
  source: "api" | "ai" | "local";
};

export type OfficialTicketResult = {
  providerSelectionId: string;
  status: AscensionTicketResultStatus;
  scoreFinal?: string;
  officialScore?: string;
  settledAt: string;
};
