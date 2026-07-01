import {
  getOfficialSportSelection,
  getPendingSportTickets,
  getSportHistoryTickets,
  getSportStats
} from "@/engine/sport/calculations";
import {
  loadSportBankroll,
  loadSportTickets,
  saveSportTickets,
  syncSportBankroll
} from "@/engine/sport/storage";
import { refreshSportResults } from "@/engine/sport/services";
import { SportEngineState } from "@/engine/sport/model";
import { AscensionTicket } from "@/features/tickets/types";

export const SportEngine = {
  async getState(): Promise<SportEngineState> {
    const tickets = await loadSportTickets();
    const syncedResults = await refreshSportResults(tickets);
    const currentTickets = syncedResults.tickets;

    if (syncedResults.didUpdate) {
      await saveSportTickets(currentTickets);
    }

    const bankroll = await syncSportBankroll(currentTickets);

    return {
      officialSelection: getOfficialSportSelection(currentTickets),
      pendingTickets: getPendingSportTickets(currentTickets),
      historyTickets: getSportHistoryTickets(currentTickets),
      bankroll,
      stats: getSportStats(bankroll)
    };
  },

  async saveTickets(tickets: AscensionTicket[]) {
    await saveSportTickets(tickets);
    return syncSportBankroll(tickets);
  },

  loadBankroll: loadSportBankroll
};
