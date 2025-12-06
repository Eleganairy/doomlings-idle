/**
 * Calculate the difficulty multiplier for enemies based on area and stage
 *
 * @param areaId - The current area ID (1-based)
 * @param stageNumber - The current stage number (1-5)
 * @returns The combined difficulty multiplier
 *
 * @example
 * // Area 1, Stage 1
 * calculateDifficultyMultiplier(1, 1) // Returns 1.0
 *
 * @example
 * // Area 1, Stage 5
 * calculateDifficultyMultiplier(1, 5) // Returns 5.0625 (1.5^4)
 *
 * @example
 * // Area 2, Stage 1
 * calculateDifficultyMultiplier(2, 1) // Returns 1.5
 *
 * @example
 * // Area 2, Stage 5
 * calculateDifficultyMultiplier(2, 5) // Returns 7.59375 (1.5 * 1.5^4)
 */
export const calculateDifficultyMultiplier = (
  areaId: number,
  stageNumber: number
): number => {
  const STAGE_MULTIPLIER = 1.5;
  const AREA_MULTIPLIER = 1.5;

  // Calculate stage scaling: 1.5^(stageNumber - 1)
  const stageScaling = Math.pow(STAGE_MULTIPLIER, stageNumber - 1);

  // Calculate area scaling: 1.5^(areaId - 1)
  const areaScaling = Math.pow(AREA_MULTIPLIER, areaId - 1);

  // Return combined multiplier
  return stageScaling * areaScaling;
};

/**
 * Apply a difficulty multiplier to enemy stats
 *
 * @param baseStats - The base enemy stats
 * @param multiplier - The difficulty multiplier to apply
 * @returns Enemy stats with multiplier applied
 */
export const applyDifficultyMultiplier = <
  T extends {
    maxHealth: number;
    currentHealth: number;
    attackDamage: number;
    lootTable: { energy: number };
  }
>(
  baseStats: T,
  multiplier: number
): T => {
  return {
    ...baseStats,
    maxHealth: Math.floor(baseStats.maxHealth * multiplier),
    currentHealth: Math.floor(baseStats.currentHealth * multiplier),
    attackDamage: Math.floor(baseStats.attackDamage * multiplier),
    lootTable: {
      ...baseStats.lootTable,
      energy: Math.floor(baseStats.lootTable.energy * multiplier),
    },
  };
};
