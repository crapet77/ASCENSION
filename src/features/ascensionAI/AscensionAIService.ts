import {
  readLocalMarketOpportunities,
  readLocalTodayPredictions
} from "@/features/ascensionEngine/localSource";
import { importChatGPTSelections } from "@/features/tickets/importChatGPT";
import {
  AscensionAIImportParams,
  AscensionAIServiceContract
} from "@/features/ascensionAI/types";

/**
 * AscensionAIService is the only client-side entry point for AI-driven content.
 *
 * Security rule:
 * - Never store an OpenAI key or any provider key in the mobile app.
 * - Future AI calls must go to the private Ascension backend only.
 * - The Ascension backend will hold provider credentials and call OpenAI/API services server-side.
 */
export const AscensionAIService: AscensionAIServiceContract = {
  async getSportPredictions() {
    // Temporary local source. Later: fetch from the Ascension backend.
    return readLocalTodayPredictions();
  },

  async getMarketOpportunities() {
    // Temporary local source. Later: fetch from the Ascension backend.
    return readLocalMarketOpportunities();
  },

  importFromJson(params: AscensionAIImportParams) {
    return importChatGPTSelections(params);
  }
};
