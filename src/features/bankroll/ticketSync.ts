import { BankrollBet, BankrollState } from "@/features/bankroll/types";
import { parseTicketAmount } from "@/features/tickets/actions";
import { AscensionTicket } from "@/features/tickets/types";

export function syncTicketsToBankroll(state: BankrollState, tickets: AscensionTicket[]): BankrollState {
  const ticketBets = tickets
    .map(ticketToBankrollBet)
    .filter((bet): bet is BankrollBet => bet !== null);
  const preservedBets = state.bets.filter((bet) => bet.source !== "ticket" || bet.sourceId?.startsWith("history-"));

  return {
    ...state,
    bets: [...ticketBets, ...preservedBets],
    updatedAt: new Date().toISOString()
  };
}

function ticketToBankrollBet(ticket: AscensionTicket): BankrollBet | null {
  if (ticket.input.playStatus !== "played") {
    return null;
  }

  const odds = parseTicketAmount(ticket.input.realOdds);
  const stake = parseTicketAmount(ticket.input.stake);

  if (odds <= 0 || stake <= 0) {
    return null;
  }

  return {
    id: `ticket-${ticket.selection.id}`,
    source: "ticket",
    sourceId: ticket.selection.id,
    event: ticket.selection.match,
    odds,
    stake,
    result: ticket.selection.status,
    placedAt: ticket.savedAt,
    settledAt: ticket.selection.resultUpdatedAt
  };
}
