import { BankrollState, BankrollStats } from "@/features/bankroll/types";
import { AscensionTicket } from "@/features/tickets/types";

export type SportEngineState = {
  officialSelection: AscensionTicket | null;
  pendingTickets: AscensionTicket[];
  historyTickets: AscensionTicket[];
  bankroll: BankrollState;
  stats: BankrollStats;
};
