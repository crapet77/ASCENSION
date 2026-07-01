import { localOfficialResults } from "@/features/tickets/seed";
import { OfficialTicketResult } from "@/features/tickets/types";

export async function fetchMockLiveResults(): Promise<OfficialTicketResult[]> {
  return localOfficialResults;
}
