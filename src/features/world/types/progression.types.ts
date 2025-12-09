export interface StageProgress {
  stageNumber: number;
  enemiesKilled: number;
  enemiesRequired: number;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface AreaProgress {
  areaId: number;
  stages: StageProgress[];
  currentStage: number;
}

export interface PlayerProgress {
  currentAreaId: number;
  currentStageNumber: number;
  areaProgress: Record<number, AreaProgress>;
}
