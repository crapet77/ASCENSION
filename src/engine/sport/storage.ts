import { loadBankrollState, saveBankrollState } from "@/features/bankroll/storage";
import { syncTicketsToBankroll } from "@/features/bankroll/ticketSync";
import { loadTickets, saveTickets } from "@/features/tickets/storage";
import { AscensionTicket } from "@/features/tickets/types";

export async function loadSportTickets() {
  return loadTickets();
}

export async function saveSportTickets(tickets: AscensionTicket[]) {
  await saveTickets(tickets);
}

export async function loadSportBankroll() {
  return loadBankrollState();
}

export async function syncSportBankroll(tickets: AscensionTicket[]) {
  const bankroll = await loadBankrollState();
  const syncedBankroll = syncTicketsToBankroll(bankroll, tickets);
  await saveBankrollState(syncedBankroll);
  return syncedBankroll;
}
