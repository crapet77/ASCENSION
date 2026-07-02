import AsyncStorage from "@react-native-async-storage/async-storage";

import { todayPredictions } from "@/features/ascensionEngine";
import { removedLocalTicketIds } from "@/features/tickets/seed";
import { AscensionTicket, AscensionTicketInput, TicketApiPayload } from "@/features/tickets/types";

export const TICKETS_STORAGE_KEY = "@ascension/tickets/v1";

const defaultInput: AscensionTicketInput = {
  realOdds: "",
  stake: "",
  playStatus: "not_decided"
};

export function createDefaultTickets(payload: TicketApiPayload): AscensionTicket[] {
  if (payload.initialTickets) {
    return payload.initialTickets;
  }

  return payload.selections.map((selection) => ({
    selection,
    input: { ...defaultInput },
    savedAt: payload.generatedAt
  }));
}

export async function loadTickets() {
  const dailyPronosticsPayload = await todayPredictions();
  const rawTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
  const defaultTickets = createDefaultTickets(dailyPronosticsPayload);

  if (!rawTickets) {
    return defaultTickets;
  }

  const parsedTickets = (JSON.parse(rawTickets) as AscensionTicket[])
    .filter((ticket) => !removedLocalTicketIds.has(ticket.selection.id))
    .map(normalizeTicketInput)
    .map(clearInvalidSimulatedResult);
  const byId = new Map(parsedTickets.map((ticket) => [ticket.selection.id, ticket]));
  const defaultIds = new Set(defaultTickets.map((ticket) => ticket.selection.id));
  const storedOnlyTickets = parsedTickets.filter((ticket) => !defaultIds.has(ticket.selection.id));

  return [
    ...defaultTickets.map((ticket) => mergeStoredTicket(ticket, byId.get(ticket.selection.id))),
    ...storedOnlyTickets
  ];
}

function clearInvalidSimulatedResult(ticket: AscensionTicket): AscensionTicket {
  if (
    ticket.selection.id !== "ascension-today-2026-06-29-allemagne-paraguay" ||
    ticket.selection.officialScore !== "Victoire de l'Allemagne"
  ) {
    return ticket;
  }

  return {
    ...ticket,
    syncedAt: undefined,
    selection: {
      ...ticket.selection,
      status: "pending",
      scoreFinal: undefined,
      officialResult: undefined,
      officialScore: undefined,
      resultUpdatedAt: undefined
    }
  };
}

function normalizeTicketInput(ticket: AscensionTicket): AscensionTicket {
  return {
    ...ticket,
    input: {
      realOdds: normalizeInputValue(ticket.input.realOdds),
      stake: normalizeInputValue(ticket.input.stake),
      playStatus: ticket.input.playStatus ?? "not_decided"
    }
  };
}

function normalizeInputValue(value: unknown) {
  if (value === null || value === undefined || String(value).toLowerCase() === "null") {
    return "";
  }

  return String(value);
}

export async function saveTickets(tickets: AscensionTicket[]) {
  await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
}

function mergeStoredTicket(defaultTicket: AscensionTicket, storedTicket?: AscensionTicket) {
  if (!storedTicket) {
    return defaultTicket;
  }

  return {
    ...defaultTicket,
    input: storedTicket.input,
    savedAt: storedTicket.savedAt,
    syncedAt: storedTicket.syncedAt,
    selection: {
      ...defaultTicket.selection,
      comment: storedTicket.selection.comment,
      status: storedTicket.selection.status,
      scoreFinal: storedTicket.selection.scoreFinal,
      officialResult: storedTicket.selection.officialResult,
      officialScore: storedTicket.selection.officialScore,
      resultUpdatedAt: storedTicket.selection.resultUpdatedAt
    }
  };
}
