import {
  completeAcademyMission,
  completeAcademyLesson,
  getAcademyProgressPercent,
  getAcademyProgression,
  getAcademyUnlocks,
  getActiveMissions,
  getActiveLevel,
  getActiveModule,
  getCertifiedLevels,
  getCompletedModules,
  getCompletedMissions,
  getNextBadge,
  getRequiredModules,
  getSortedModules,
  submitAcademyQuiz
} from "@/engine/academy/calculations";
import { AcademyEngineState } from "@/engine/academy/model";
import {
  fetchAcademyProfile,
  persistAcademyProfile
} from "@/engine/academy/services";

export const AcademyEngine = {
  async getState(): Promise<AcademyEngineState> {
    const profile = await fetchAcademyProfile();

    return {
      profile,
      levels: getSortedModules(profile.modules).length ? profile.levels : profile.levels,
      activeLevel: getActiveLevel(profile.levels),
      certifiedLevels: getCertifiedLevels(profile.levels),
      progression: getAcademyProgression(profile.levels),
      modules: getSortedModules(profile.modules),
      requiredModules: getRequiredModules(profile.modules),
      activeModule: getActiveModule(profile.modules),
      completedModules: getCompletedModules(profile.modules),
      activeMissions: getActiveMissions(profile.missions),
      completedMissions: getCompletedMissions(profile.missions),
      nextBadge: getNextBadge(profile.badges),
      unlocks: getAcademyUnlocks(profile),
      progressPercent: getAcademyProgression(profile.levels).progressPercent || getAcademyProgressPercent(profile.modules)
    };
  },

  async completeMission(missionId: string) {
    const profile = await fetchAcademyProfile();
    const nextProfile = completeAcademyMission(profile, missionId);
    await persistAcademyProfile(nextProfile);
    return this.getState();
  },

  async completeLesson(moduleId: string, lessonId: string) {
    const profile = await fetchAcademyProfile();
    const nextProfile = completeAcademyLesson(profile, moduleId, lessonId);
    await persistAcademyProfile(nextProfile);
    return this.getState();
  },

  async submitQuiz(moduleId: string, answers: number[]) {
    const profile = await fetchAcademyProfile();
    const nextProfile = submitAcademyQuiz(profile, moduleId, answers);
    await persistAcademyProfile(nextProfile);
    return this.getState();
  }
};
