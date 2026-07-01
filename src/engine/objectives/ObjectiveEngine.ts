import {
  getObjectiveEngineProgress,
  syncObjectiveDefinitionsWithProgress
} from "@/engine/objectives/calculations";
import { ObjectiveDefinition, ObjectiveEngineState } from "@/engine/objectives/model";
import {
  fetchObjectiveDefinitions,
  fetchObjectiveRuntimeData,
  persistObjectiveDefinitions
} from "@/engine/objectives/services";

export const ObjectiveEngine = {
  async getState(): Promise<ObjectiveEngineState> {
    const [definitions, runtimeData] = await Promise.all([
      fetchObjectiveDefinitions(),
      fetchObjectiveRuntimeData()
    ]);
    const progress = getObjectiveEngineProgress(definitions, runtimeData);
    const syncedDefinitions = syncObjectiveDefinitionsWithProgress(definitions, progress.objectives);

    if (hasStatusChanged(definitions, syncedDefinitions)) {
      await persistObjectiveDefinitions(syncedDefinitions);
    }

    return {
      ...progress,
      runtimeData
    };
  },

  async saveObjectives(objectives: ObjectiveDefinition[]) {
    await persistObjectiveDefinitions(objectives);
    return this.getState();
  }
};

function hasStatusChanged(
  previousObjectives: ObjectiveDefinition[],
  nextObjectives: ObjectiveDefinition[]
) {
  return previousObjectives.some((objective, index) => objective.status !== nextObjectives[index]?.status);
}
