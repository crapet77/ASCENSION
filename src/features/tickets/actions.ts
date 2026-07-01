import { AscensionTicket, AscensionTicketResultStatus } from "@/features/tickets/types";

export function parseTicketAmount(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function canPlayTicket(ticket: AscensionTicket) {
  return parseTicketAmount(ticket.input.realOdds) > 0 && parseTicketAmount(ticket.input.stake) > 0;
}

export function markTicketAsPlayed(ticket: AscensionTicket): AscensionTicket {
  return {
    ...ticket,
    savedAt: new Date().toISOString(),
    input: {
      ...ticket.input,
      playStatus: "played"
    },
    selection: {
      ...ticket.selection,
      status: "pending"
    }
  };
}

export function ignoreTicket(ticket: AscensionTicket): AscensionTicket {
  return {
    ...ticket,
    input: {
      ...ticket.input,
      playStatus: "not_played"
    }
  };
}

export function settleTicket(
  ticket: AscensionTicket,
  status: Exclude<AscensionTicketResultStatus, "pending">,
  officialScore?: string
): AscensionTicket {
  const now = new Date().toISOString();

  return {
    ...ticket,
    syncedAt: now,
    selection: {
      ...ticket.selection,
      status,
      officialResult: status,
      scoreFinal: officialScore,
      officialScore,
      resultUpdatedAt: now
    }
  };
}
