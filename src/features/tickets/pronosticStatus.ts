import {
  AscensionPronosticStatus,
  AscensionTicket,
  AscensionTicketResultStatus
} from "@/features/tickets/types";

export const pronosticStatusLabel: Record<AscensionPronosticStatus, string> = {
  pre_selection: "Sélection officielle Ascension",
  played: "Joué",
  not_played: "Non joué",
  pending: "En attente",
  won: "Gagné",
  lost: "Perdu",
  void: "Annulé"
};

export function isSettledResult(status: AscensionTicketResultStatus) {
  return status === "won" || status === "lost" || status === "void";
}

export function getPronosticStatus(ticket: AscensionTicket): AscensionPronosticStatus {
  if (ticket.input.playStatus === "not_played") {
    return "not_played";
  }

  if (ticket.input.playStatus !== "played") {
    return "pre_selection";
  }

  if (isSettledResult(ticket.selection.status)) {
    return ticket.selection.status;
  }

  return "pending";
}
