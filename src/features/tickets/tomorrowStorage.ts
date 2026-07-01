import AsyncStorage from "@react-native-async-storage/async-storage";

import { tomorrowPredictions } from "@/features/ascensionEngine";
import { TomorrowPrediction } from "@/features/tickets/types";

export const TOMORROW_PREDICTIONS_STORAGE_KEY = "@ascension/tickets/tomorrow-predictions/v1";

export async function loadTomorrowPredictions() {
  const [enginePredictions, rawPredictions] = await Promise.all([
    tomorrowPredictions(),
    AsyncStorage.getItem(TOMORROW_PREDICTIONS_STORAGE_KEY)
  ]);

  const storedPredictions = rawPredictions ? (JSON.parse(rawPredictions) as TomorrowPrediction[]) : [];
  const predictionsById = new Map<string, TomorrowPrediction>();

  enginePredictions.predictions.forEach((prediction) => predictionsById.set(prediction.id, prediction));
  storedPredictions.forEach((prediction) => predictionsById.set(prediction.id, prediction));

  return Array.from(predictionsById.values());
}

export async function saveTomorrowPredictions(predictions: TomorrowPrediction[]) {
  await AsyncStorage.setItem(TOMORROW_PREDICTIONS_STORAGE_KEY, JSON.stringify(predictions));
}
