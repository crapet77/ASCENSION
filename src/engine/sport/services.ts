import { AscensionAIService } from "@/features/ascensionAI";
import { updateResults } from "@/features/tickets/resultsSync";
import { AscensionTicket } from "@/features/tickets/types";

export async function fetchSportPredictions() {
  return AscensionAIService.getSportPredictions();
}

export async function refreshSportResults(tickets: AscensionTicket[]) {
  return updateResults(tickets);
}
