import { atom } from "jotai";
import type { PlayerProgress } from "../types/progression.types";
import { createInitialAreaProgress } from "../config/progression.config";

/**
 * Initial player progress state
 * Starts at Area 1, Stage 1
 */
const initialPlayerProgress: PlayerProgress = {
  currentAreaId: 1,
  currentStageNumber: 1,
  areaProgress: {
    1: createInitialAreaProgress(1),
  },
};

/**
 * Main atom storing the player's progression state
 */
export const playerProgressAtom = atom<PlayerProgress>(initialPlayerProgress);

/**
 * Derived atom for getting the current area's progress
 */
export const currentAreaProgressAtom = atom((get) => {
  const progress = get(playerProgressAtom);
  return progress.areaProgress[progress.currentAreaId];
});

/**
 * Derived atom for getting the current stage's progress
 */
export const currentStageProgressAtom = atom((get) => {
  const areaProgress = get(currentAreaProgressAtom);
  return areaProgress.stages.find(
    (stage) => stage.stageNumber === areaProgress.currentStage
  );
});
