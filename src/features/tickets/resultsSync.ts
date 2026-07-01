import { officialResults } from "@/features/ascensionEngine";
import { AscensionTicket } from "@/features/tickets/types";

export async function updateResults(tickets: AscensionTicket[]) {
  // Results are provided by the Live Results service through Ascension Engine.
  const results = await officialResults();
  const resultByProviderId = new Map(
    results.map((result) => [result.providerSelectionId, result])
  );

  let didUpdate = false;

  const syncedTickets = tickets.map((ticket) => {
    const providerSelectionId = ticket.selection.providerSelectionId;

    if (
      ticket.input.playStatus !== "played" ||
      !providerSelectionId ||
      ticket.selection.status !== "pending"
    ) {
      return ticket;
    }

    const officialResult = resultByProviderId.get(providerSelectionId);

    if (!officialResult) {
      return ticket;
    }

    if (officialResult.status === "pending") {
      return ticket;
    }

    didUpdate = true;
    const scoreFinal = officialResult.scoreFinal ?? officialResult.officialScore;

    return {
      ...ticket,
      selection: {
        ...ticket.selection,
        status: officialResult.status,
        officialResult: officialResult.status,
        scoreFinal,
        officialScore: scoreFinal,
        resultUpdatedAt: officialResult.settledAt
      },
      syncedAt: new Date().toISOString()
    };
  });

  return {
    didUpdate,
    tickets: syncedTickets
  };
}

export const syncOfficialTicketResults = updateResults;
