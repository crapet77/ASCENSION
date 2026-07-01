import { getBankrollStats } from "@/features/bankroll/math";
import { BankrollState } from "@/features/bankroll/types";
import { isSettledResult } from "@/features/tickets/pronosticStatus";
import { AscensionTicket } from "@/features/tickets/types";

export function getOfficialSportSelection(tickets: AscensionTicket[]) {
  return tickets.find((ticket) => ticket.input.playStatus === "not_decided") ?? null;
}

export function getPendingSportTickets(tickets: AscensionTicket[]) {
  return tickets.filter(
    (ticket) => ticket.input.playStatus === "played" && ticket.selection.status === "pending"
  );
}

export function getSportHistoryTickets(tickets: AscensionTicket[]) {
  return tickets.filter(
    (ticket) => ticket.input.playStatus === "played" && isSettledResult(ticket.selection.status)
  );
}

export function getSportStats(bankroll: BankrollState) {
  return getBankrollStats(bankroll);
}
