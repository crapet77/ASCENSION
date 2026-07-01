import { AcademyProfile } from "@/engine/academy/model";
import {
  loadAcademyProfile,
  saveAcademyProfile
} from "@/engine/academy/storage";

export async function fetchAcademyProfile() {
  return loadAcademyProfile();
}

export async function persistAcademyProfile(profile: AcademyProfile) {
  await saveAcademyProfile(profile);
}
