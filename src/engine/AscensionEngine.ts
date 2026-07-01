import { AcademyEngine, AcademyEngineState } from "@/engine/academy";
import { MarketEngine, MarketEngineState } from "@/engine/markets";
import { ObjectiveEngine, ObjectiveEngineState } from "@/engine/objectives";
import { SportEngine, SportEngineState } from "@/engine/sport";

export type AscensionDomain = "sport" | "markets" | "objectives" | "academy";

export type AscensionEngineState = {
  sport: SportEngineState;
  markets: MarketEngineState;
  objectives: ObjectiveEngineState;
  academy: AcademyEngineState;
  generatedAt: string;
};

export const AscensionEngine = {
  sport: SportEngine,
  markets: MarketEngine,
  objectives: ObjectiveEngine,
  academy: AcademyEngine,

  async getState(): Promise<AscensionEngineState> {
    const [sport, markets, objectives, academy] = await Promise.all([
      SportEngine.getState(),
      MarketEngine.getState(),
      ObjectiveEngine.getState(),
      AcademyEngine.getState()
    ]);

    return {
      sport,
      markets,
      objectives,
      academy,
      generatedAt: new Date().toISOString()
    };
  }
};
