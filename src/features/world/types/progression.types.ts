/**
 * Stage Progression Types
 *
 * Defines the data structures for tracking player progress through
 * area stages in the game.
 */

/**
 * Represents progress for a single stage within an area
 */
export interface StageProgress {
  /** Stage number (1-5) */
  stageNumber: number;
  /** Number of enemies killed on this stage */
  enemiesKilled: number;
  /** Number of enemies required to complete this stage */
  enemiesRequired: number;
  /** Whether this stage has been completed */
  isCompleted: boolean;
  /** Whether this stage is unlocked and can be played */
  isUnlocked: boolean;
}

/**
 * Represents progress for all stages in a single area
 */
export interface AreaProgress {
  /** The area ID this progress belongs to */
  areaId: number;
  /** Progress for each of the 5 stages */
  stages: StageProgress[];
  /** The currently active stage number (1-5) */
  currentStage: number;
}

/**
 * Represents the player's overall progression state
 */
export interface PlayerProgress {
  /** The currently active area ID */
  currentAreaId: number;
  /** The currently active stage number within the current area */
  currentStageNumber: number;
  /** Progress data for each area, keyed by area ID */
  areaProgress: Record<number, AreaProgress>;
}
