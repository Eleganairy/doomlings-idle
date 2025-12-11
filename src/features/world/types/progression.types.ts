// Top level -> The game has a total of 3 worlds
export interface WorldProgress {
  currentAreaId: number;
  currentStageNumber: number;
  areaProgress: Record<number, AreaProgress>;
}

// Second level, the game has a total of 10 areas per world
export interface AreaProgress {
  areaId: number;
  stages: StageProgress[];
  currentStage: number;
}

// Third level, the game has a total of 5 stages per area
export interface StageProgress {
  stageNumber: number;
  enemiesKilled: number;
  enemiesRequired: number;
  isCompleted: boolean;
  isUnlocked: boolean;
}
