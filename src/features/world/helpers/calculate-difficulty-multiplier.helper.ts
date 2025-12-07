/**
 * Difficulty multipliers for different enemy stats
 */
export interface DifficultyMultipliers {
  /** Multiplier for health and attack damage */
  healthDamage: number;
  /** Absolute attack speed value (attacks per second) */
  attackSpeed: number;
  /** Multiplier for energy rewards (same scaling as healthDamage) */
  energyReward: number;
}

/**
 * Calculate the difficulty multipliers for enemies based on area and stage
 *
 * Health/Damage/Energy Formula: multiplier = (3^(stage - 1)) × (405^(area - 1))
 * Attack Speed Formula: baseSpeed + (0.2 × (totalStages - 1))
 *   where totalStages = (area - 1) × 5 + stage
 *
 * @param areaId - The current area ID (1-based)
 * @param stageNumber - The current stage number (1-5)
 * @param baseAttackSpeed - The base attack speed before scaling (default 0.5)
 * @returns Object containing multipliers for health/damage/energy and absolute value for attack speed
 *
 * @example
 * // Area 1, Stage 1: Base stats
 * calculateDifficultyMultiplier(1, 1, 0.5)
 * // Returns { healthDamage: 1.0, attackSpeed: 0.5, energyReward: 1.0 }
 *
 * @example
 * // Area 1, Stage 2: +0.2 APS, ×3 rewards
 * calculateDifficultyMultiplier(1, 2, 0.5)
 * // Returns { healthDamage: 3.0, attackSpeed: 0.7, energyReward: 3.0 }
 *
 * @example
 * // Area 1, Stage 5: +0.8 APS, ×81 rewards
 * calculateDifficultyMultiplier(1, 5, 0.5)
 * // Returns { healthDamage: 81.0, attackSpeed: 1.3, energyReward: 81.0 }
 *
 * @example
 * // Area 2, Stage 1: +1.0 APS (5 stages completed), ×405 rewards
 * calculateDifficultyMultiplier(2, 1, 0.5)
 * // Returns { healthDamage: 405.0, attackSpeed: 1.5, energyReward: 405.0 }
 */
export const calculateDifficultyMultiplier = (
  areaId: number,
  stageNumber: number,
  baseAttackSpeed: number = 0.5
): DifficultyMultipliers => {
  // Health and Damage scaling
  const HEALTH_DAMAGE_STAGE_MULTIPLIER = 3; // Each stage multiplies by 3
  const HEALTH_DAMAGE_AREA_MULTIPLIER = 405; // Each area multiplies by 405 (3^4 × 5)

  const healthDamageStageScaling = Math.pow(
    HEALTH_DAMAGE_STAGE_MULTIPLIER,
    stageNumber - 1
  );
  const healthDamageAreaScaling = Math.pow(
    HEALTH_DAMAGE_AREA_MULTIPLIER,
    areaId - 1
  );
  const healthDamageMultiplier =
    healthDamageStageScaling * healthDamageAreaScaling;

  // Attack Speed scaling (linear: +0.2 per stage)
  const ATTACK_SPEED_PER_STAGE = 0.2;

  // Calculate total stages completed (including previous areas)
  const totalStagesCompleted = (areaId - 1) * 5 + (stageNumber - 1);

  // Add 0.2 for each stage completed
  const attackSpeed =
    baseAttackSpeed + ATTACK_SPEED_PER_STAGE * totalStagesCompleted;

  return {
    healthDamage: healthDamageMultiplier,
    attackSpeed: attackSpeed,
    energyReward: healthDamageMultiplier, // Same scaling as health/damage
  };
};

/**
 * Apply difficulty multipliers to enemy stats
 *
 * @param baseStats - The base enemy stats
 * @param multipliers - The difficulty multipliers to apply
 * @returns Enemy stats with multipliers applied
 */
export const applyDifficultyMultiplier = <
  T extends {
    maxHealth: number;
    currentHealth: number;
    attackDamage: number;
    attackSpeed: number;
    lootTable: { energy: number };
  }
>(
  baseStats: T,
  multipliers: DifficultyMultipliers
): T => {
  return {
    ...baseStats,
    maxHealth: Math.floor(baseStats.maxHealth * multipliers.healthDamage),
    currentHealth: Math.floor(
      baseStats.currentHealth * multipliers.healthDamage
    ),
    attackDamage: Math.floor(baseStats.attackDamage * multipliers.healthDamage),
    attackSpeed: multipliers.attackSpeed, // Use absolute value, not multiplier
    lootTable: {
      ...baseStats.lootTable,
      energy: Math.floor(baseStats.lootTable.energy * multipliers.energyReward),
    },
  };
};
