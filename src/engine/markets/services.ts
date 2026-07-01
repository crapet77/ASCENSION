import { AscensionAIService } from "@/features/ascensionAI";

export async function fetchMarketOpportunities() {
  return AscensionAIService.getMarketOpportunities();
}
