import { ENEMY_CONFIG } from "../config/enemy-stats.config";

export interface DifficultyMultipliers {
  health: number;
  attackDamage: number;
  attackSpeed: number;
  energyReward: number;
  meteoriteReward: number;
  specificAreaReward: number;
}

/**
 * Calculate difficulty multipliers based on area and stage.
 *
 * Each area has 5 stages. Total stages = (area - 1) * 5 + stage.
 * Stats scale exponentially (or linearly for attack speed).
 *
 * @param areaNumber Current area (1-indexed)
 * @param stageNumber Current stage within area (1-indexed)
 */
export const getEnemyCalculationMultipliers = (
  areaNumber: number,
  stageNumber: number
): DifficultyMultipliers => {
  const { AREA_SCALING } = ENEMY_CONFIG;

  // Calculate total stages completed (0-indexed for power calculation)
  // e.g., Area 3 Stage 2 = (3-1)*5 + 2 - 1 = 11
  const currentStageNumber = (areaNumber - 1) * 5 + stageNumber - 1;

  return {
    health: AREA_SCALING.health ** currentStageNumber,
    attackDamage: AREA_SCALING.attackDamage ** currentStageNumber,
    attackSpeed: AREA_SCALING.attackSpeed * currentStageNumber, // Linear increase
    energyReward: AREA_SCALING.energyReward ** currentStageNumber,
    meteoriteReward: AREA_SCALING.meteoriteReward ** currentStageNumber,
    specificAreaReward: AREA_SCALING.specificAreaReward ** currentStageNumber,
  };
};
