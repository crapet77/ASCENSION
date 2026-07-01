import { AscensionTicket, TomorrowPrediction } from "@/features/tickets/types";

function normalizeKeyPart(value: string | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getTicketCategoryKey(ticket: AscensionTicket) {
  return [
    normalizeKeyPart(ticket.selection.date),
    normalizeKeyPart(ticket.selection.match),
    normalizeKeyPart(ticket.selection.recommendedMarket ?? ticket.selection.market)
  ].join("|");
}

export function getTicketMatchKey(ticket: AscensionTicket) {
  return [normalizeKeyPart(ticket.selection.date), normalizeKeyPart(ticket.selection.match)].join("|");
}

export function getTomorrowPredictionCategoryKey(prediction: TomorrowPrediction) {
  return [
    normalizeKeyPart(prediction.date),
    normalizeKeyPart(prediction.match),
    normalizeKeyPart(prediction.plannedMarket)
  ].join("|");
}

export function getTomorrowPredictionMatchKey(prediction: TomorrowPrediction) {
  return [normalizeKeyPart(prediction.date), normalizeKeyPart(prediction.match)].join("|");
}

export function filterTomorrowPredictionsWithoutTickets(
  predictions: TomorrowPrediction[],
  tickets: AscensionTicket[]
) {
  const ticketIds = new Set(tickets.map((ticket) => ticket.selection.id));
  const ticketKeys = new Set(tickets.map(getTicketCategoryKey));
  const ticketMatchKeys = new Set(tickets.map(getTicketMatchKey));

  return predictions.filter(
    (prediction) =>
      !ticketIds.has(prediction.id) &&
      !ticketKeys.has(getTomorrowPredictionCategoryKey(prediction)) &&
      !ticketMatchKeys.has(getTomorrowPredictionMatchKey(prediction)) &&
      prediction.status !== "rejected"
  );
}
