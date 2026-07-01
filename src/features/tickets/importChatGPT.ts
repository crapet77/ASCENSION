import {
  filterTomorrowPredictionsWithoutTickets,
  getTicketCategoryKey,
  getTicketMatchKey,
  getTomorrowPredictionCategoryKey,
  getTomorrowPredictionMatchKey
} from "@/features/tickets/categoryDedupe";
import { AscensionTicket, TomorrowPrediction } from "@/features/tickets/types";

type ChatGPTSelection = {
  date?: string;
  sport?: string;
  competition?: string;
  heure?: string;
  kickoffTime?: string;
  match?: string;
  market?: string;
  marche?: string;
  recommendedMarket?: string;
  estimatedOdds?: number | string;
  realOdds?: number | string;
  stake?: number | string;
  scoreAscension?: number;
  confidence?: string;
  confidenceLevel?: string;
  strengths?: string[];
  pointsForts?: string[];
  risks?: string[];
  risques?: string[];
  conclusion?: string;
  explanation?: string;
  explication?: string;
  status?: string;
  result?: string;
};

export type ChatGPTImportResult = {
  tickets: AscensionTicket[];
  tomorrowPredictions: TomorrowPrediction[];
  importedTickets: number;
  importedTomorrowPredictions: number;
};

export function importChatGPTSelections(params: {
  json: string;
  tickets: AscensionTicket[];
  tomorrowPredictions: TomorrowPrediction[];
}): ChatGPTImportResult {
  const parsed = JSON.parse(params.json) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Le JSON doit être une liste de sélections.");
  }

  const ticketMap = new Map(params.tickets.map((ticket) => [ticket.selection.id, ticket]));
  const tomorrowMap = new Map(params.tomorrowPredictions.map((prediction) => [prediction.id, prediction]));
  let importedTickets = 0;
  let importedTomorrowPredictions = 0;

  parsed.forEach((item) => {
    const selection = normalizeSelection(item as ChatGPTSelection);

    if (selection.status === "prevision_demain") {
      removeMatchingTicket(ticketMap, selection);
      tomorrowMap.set(selection.id, toTomorrowPrediction(selection));
      importedTomorrowPredictions += 1;
      return;
    }

    const ticket = toTicket(selection);
    removeMatchingImportedTicket(ticketMap, ticket);
    removeOtherOfficialSelectionForSameDay(ticketMap, ticket);
    removeMatchingTomorrowPrediction(tomorrowMap, ticket);
    ticketMap.set(selection.id, ticket);
    importedTickets += 1;
  });

  const tickets = Array.from(ticketMap.values());

  return {
    tickets,
    tomorrowPredictions: filterTomorrowPredictionsWithoutTickets(Array.from(tomorrowMap.values()), tickets),
    importedTickets,
    importedTomorrowPredictions
  };
}

type NormalizedSelection = Required<Pick<ChatGPTSelection, "date" | "sport" | "competition" | "match" | "market">> & {
  id: string;
  estimatedOdds?: number;
  realOdds?: string;
  stake?: string;
  scoreAscension: number;
  confidence: string;
  kickoffTime: string;
  strengths: string[];
  risks: string[];
  conclusion?: string;
  explanation: string;
  status: string;
  result?: string;
};

function normalizeSelection(selection: ChatGPTSelection): NormalizedSelection {
  const date = requiredText(selection.date, "date");
  const match = requiredText(selection.match, "match");
  const market = requiredText(selection.market ?? selection.marche ?? selection.recommendedMarket, "market");
  const status = normalizeStatus(selection.status);

  return {
    id: `chatgpt-${date}-${slugify(match)}-${slugify(market)}`,
    date,
    sport: requiredText(selection.sport, "sport"),
    competition: requiredText(selection.competition, "competition"),
    match,
    market,
    estimatedOdds: parseOptionalNumber(selection.estimatedOdds),
    realOdds: formatInputNumber(selection.realOdds),
    stake: formatInputNumber(selection.stake),
    scoreAscension: Number.isFinite(selection.scoreAscension) ? Number(selection.scoreAscension) : 0,
    confidence: cleanText(selection.confidence ?? selection.confidenceLevel) || "À jouer",
    kickoffTime: cleanText(selection.kickoffTime ?? selection.heure) || "À jouer",
    strengths: normalizeTextList(selection.strengths ?? selection.pointsForts),
    risks: normalizeTextList(selection.risks ?? selection.risques),
    conclusion: cleanText(selection.conclusion),
    explanation:
      cleanText(selection.explanation ?? selection.explication) ??
      (selection.result ? `Résultat : ${selection.result}` : "Analyse importée depuis ChatGPT."),
    status,
    result: cleanText(selection.result)
  };
}

function toTicket(selection: NormalizedSelection): AscensionTicket {
  const resultStatus = toResultStatus(selection.status);
  const playStatus =
    selection.status === "ignore"
      ? "not_played"
      : selection.status === "preselection" || selection.status === "a_valider"
        ? "not_decided"
        : "played";
  const now = new Date().toISOString();

  return {
    selection: {
      id: selection.id,
      providerSelectionId: selection.id,
      date: selection.date,
      sport: selection.sport,
      competition: selection.competition,
      match: selection.match,
      kickoffTime: selection.kickoffTime,
      market: selection.market,
      recommendedMarket: selection.market,
      pick: selection.market,
      estimatedOdds: selection.estimatedOdds,
      ascensionScore: selection.scoreAscension,
      confidenceLevel: selection.confidence,
      strengths: selection.strengths,
      risks: selection.risks,
      conclusion: selection.conclusion,
      explanation: selection.explanation,
      status: resultStatus,
      scoreFinal: selection.result,
      officialResult: resultStatus !== "pending" ? resultStatus : undefined,
      officialScore: selection.result,
      resultUpdatedAt: resultStatus !== "pending" ? now : undefined
    },
    input: {
      realOdds: selection.realOdds ?? "",
      stake: selection.stake ?? "",
      playStatus
    },
    savedAt: now,
    syncedAt: resultStatus !== "pending" ? now : undefined
  };
}

function toTomorrowPrediction(selection: NormalizedSelection): TomorrowPrediction {
  return {
    id: selection.id,
    date: selection.date,
    sport: selection.sport,
    kickoffTime: selection.kickoffTime,
    competition: selection.competition,
    match: selection.match,
    plannedMarket: selection.market,
    estimatedOdds: selection.estimatedOdds,
    ascensionScore: selection.scoreAscension,
    provisionalConfidence: selection.confidence,
    checkpoints: selection.result ? [selection.result] : ["À jouer demain"],
    status: "confirm_tomorrow"
  };
}

function removeOtherOfficialSelectionForSameDay(
  ticketMap: Map<string, AscensionTicket>,
  nextTicket: AscensionTicket
) {
  if (nextTicket.input.playStatus !== "not_decided") {
    return;
  }

  Array.from(ticketMap.values()).forEach((ticket) => {
    if (
      ticket.selection.id !== nextTicket.selection.id &&
      ticket.selection.date === nextTicket.selection.date &&
      ticket.input.playStatus === "not_decided"
    ) {
      ticketMap.delete(ticket.selection.id);
    }
  });
}

function removeMatchingImportedTicket(
  ticketMap: Map<string, AscensionTicket>,
  nextTicket: AscensionTicket
) {
  const nextTicketKey = getTicketCategoryKey(nextTicket);
  const nextTicketMatchKey = getTicketMatchKey(nextTicket);

  Array.from(ticketMap.values()).forEach((ticket) => {
    if (
      ticket.selection.id !== nextTicket.selection.id &&
      (getTicketCategoryKey(ticket) === nextTicketKey || getTicketMatchKey(ticket) === nextTicketMatchKey)
    ) {
      ticketMap.delete(ticket.selection.id);
    }
  });
}

function removeMatchingTomorrowPrediction(
  tomorrowMap: Map<string, TomorrowPrediction>,
  ticket: AscensionTicket
) {
  const ticketKey = getTicketCategoryKey(ticket);

  Array.from(tomorrowMap.values()).forEach((prediction) => {
    if (
      prediction.id === ticket.selection.id ||
      getTomorrowPredictionCategoryKey(prediction) === ticketKey ||
      getTomorrowPredictionMatchKey(prediction) === getTicketMatchKey(ticket)
    ) {
      tomorrowMap.delete(prediction.id);
    }
  });
}

function removeMatchingTicket(
  ticketMap: Map<string, AscensionTicket>,
  selection: NormalizedSelection
) {
  const tomorrowPrediction = toTomorrowPrediction(selection);
  const tomorrowKey = getTomorrowPredictionCategoryKey(tomorrowPrediction);

  Array.from(ticketMap.values()).forEach((ticket) => {
    if (
      ticket.selection.id === selection.id ||
      getTicketCategoryKey(ticket) === tomorrowKey ||
      getTicketMatchKey(ticket) === getTomorrowPredictionMatchKey(tomorrowPrediction)
    ) {
      ticketMap.delete(ticket.selection.id);
    }
  });
}

function toResultStatus(status: string) {
  if (status === "gagne") {
    return "won";
  }

  if (status === "perdu") {
    return "lost";
  }

  if (status === "annule") {
    return "void";
  }

  return "pending";
}

function normalizeStatus(status?: string) {
  const normalized = (status ?? "preselection")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (["preselection", "a_valider", "en_attente", "gagne", "perdu", "annule", "ignore", "prevision_demain"].includes(normalized)) {
    return normalized;
  }

  throw new Error(`Statut non reconnu : ${status}`);
}

function requiredText(value: string | undefined, fieldName: string) {
  const text = cleanText(value);

  if (!text) {
    throw new Error(`Champ manquant : ${fieldName}`);
  }

  return text;
}

function parseOptionalNumber(value: number | string | null | undefined) {
  if (value === undefined || value === null || value === "" || String(value).toLowerCase() === "null" || String(value).toLowerCase() === "à confirmer") {
    return undefined;
  }

  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatInputNumber(value: number | string | null | undefined) {
  if (value === undefined || value === null || value === "" || String(value).toLowerCase() === "null") {
    return undefined;
  }

  return String(value).replace(".", ",");
}

function cleanText(value: string | undefined | null) {
  const text = value?.trim();

  if (!text || text.toLowerCase() === "null") {
    return undefined;
  }

  return text;
}

function normalizeTextList(value: string[] | undefined) {
  return (value ?? []).map(cleanText).filter((item): item is string => Boolean(item));
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
