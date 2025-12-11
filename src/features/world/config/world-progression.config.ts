import type { AreaProgress, StageProgress } from "../types/progression.types";

/**
 * Configuration constants for stage progression
 */

/** Number of stages in each area */
export const STAGES_PER_AREA = 5;

/** Number of enemies that must be defeated to complete a stage */
export const ENEMIES_PER_STAGE = 10;

/**
 * Creates initial progress data for a new area
 * @param areaId - The ID of the area to initialize
 * @returns AreaProgress object with stage 1 unlocked, others locked
 */
export const createInitialAreaProgress = (areaId: number): AreaProgress => {
  const stages: StageProgress[] = [];

  for (let i = 1; i <= STAGES_PER_AREA; i++) {
    stages.push({
      stageNumber: i,
      enemiesKilled: 0,
      enemiesRequired: ENEMIES_PER_STAGE,
      isCompleted: false,
      isUnlocked: i === 1, // Only first stage is unlocked initially
    });
  }

  return {
    areaId,
    stages,
    currentStage: 1,
  };
};
