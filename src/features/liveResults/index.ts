import { fetchMockLiveResults } from "@/features/liveResults/mockLiveResultsClient";
import { OfficialTicketResult } from "@/features/tickets/types";

export type LiveResultsService = {
  pendingTicketResults: () => Promise<OfficialTicketResult[]>;
};

export const liveResultsService: LiveResultsService = {
  async pendingTicketResults() {
    // Later, this is the only place that should call the sports results API.
    return fetchMockLiveResults();
  }
};

export async function pendingTicketResults() {
  return liveResultsService.pendingTicketResults();
}
