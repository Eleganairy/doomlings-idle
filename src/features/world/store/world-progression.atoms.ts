import { atom } from "jotai";
import { createInitialAreaProgress } from "../config/world-progression.config";
import type { WorldProgress } from "../types/progression.types";

/**
 * Initial player progress state
 * Starts at Area 1, Stage 1
 */
const initialWorldProgress: WorldProgress = {
  currentAreaId: 1,
  currentStageNumber: 1,
  areaProgress: {
    1: createInitialAreaProgress(1),
  },
};

/**
 * Main atom storing the player's progression state
 */
export const worldProgressAtom = atom<WorldProgress>(initialWorldProgress);

/**
 * Derived atom for getting the current area's progress
 */
export const currentAreaProgressAtom = atom((get) => {
  const progress = get(worldProgressAtom);
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
