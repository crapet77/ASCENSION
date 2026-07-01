import { AscensionTicket } from "@/features/tickets/types";

function parseMoney(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getTicketProfit(ticket: AscensionTicket) {
  if (ticket.input.playStatus !== "played") {
    return 0;
  }

  const stake = parseMoney(ticket.input.stake);
  const odds = parseMoney(ticket.input.realOdds);

  if (ticket.selection.status === "won") {
    return stake * Math.max(odds - 1, 0);
  }

  if (ticket.selection.status === "lost") {
    return -stake;
  }

  return 0;
}

export function getTicketStats(tickets: AscensionTicket[], initialBankroll: number | null) {
  const playedTickets = tickets.filter((ticket) => ticket.input.playStatus === "played");
  const settledTickets = playedTickets.filter(
    (ticket) => ticket.selection.status === "won" || ticket.selection.status === "lost"
  );
  const wonTickets = settledTickets.filter((ticket) => ticket.selection.status === "won");
  const totalStaked = playedTickets.reduce((total, ticket) => total + parseMoney(ticket.input.stake), 0);
  const profit = tickets.reduce((total, ticket) => total + getTicketProfit(ticket), 0);
  const roi = totalStaked > 0 ? (profit / totalStaked) * 100 : 0;
  const winRate = settledTickets.length > 0 ? (wonTickets.length / settledTickets.length) * 100 : 0;

  return {
    bankroll: (initialBankroll ?? 0) + profit,
    initialBankroll: initialBankroll ?? 0,
    playedCount: playedTickets.length,
    profit,
    roi,
    winRate
  };
}
