/**
 * Spawn Enemy Helper
 *
 * Creates Enemy Entity instances from the enemy pool with difficulty scaling.
 * Uses EnemyDefinition directly - no legacy type conversion needed.
 */

import { Entity } from "../../entity/entity.class";
import type { EnemyDefinition } from "../../entity/types/entity.types";
import { getEnemyCalculationMultipliers } from "../../enemy/helpers/get-enemy-calculated-stats.helper";
import { EnemyRarity } from "../../enemy/types/enemy.types";

// ====================================================================================
// WEIGHTED POOL SELECTION
// ====================================================================================

/**
 * Get weighted enemy pool for random selection.
 * Higher rarity = lower spawn weight.
 */
function getWeightedEnemyPool(
  enemies: Record<string, EnemyDefinition>
): EnemyDefinition[] {
  const pool: EnemyDefinition[] = [];

  Object.values(enemies).forEach((enemy) => {
    let weight = 1;

    switch (enemy.rarity) {
      case EnemyRarity.COMMON:
        weight = 50;
        break;
      case EnemyRarity.UNCOMMON:
        weight = 30;
        break;
      case EnemyRarity.RARE:
        weight = 20;
        break;
    }

    for (let i = 0; i < weight; i++) {
      pool.push(enemy);
    }
  });

  return pool;
}

// ====================================================================================
// DIFFICULTY SCALING
// ====================================================================================

/**
 * Apply area/stage difficulty scaling to an EnemyDefinition.
 * Returns a new definition with scaled stats.
 */
function applyDifficultyScaling(
  definition: EnemyDefinition,
  multipliers: ReturnType<typeof getEnemyCalculationMultipliers>
): EnemyDefinition {
  const scaledHealth = Math.floor(
    definition.baseStats.maxHealth * multipliers.health
  );
  const scaledAttack = Math.floor(
    definition.baseStats.attackDamage * multipliers.attackDamage
  );
  const scaledSpeed =
    definition.baseStats.attackSpeed + multipliers.attackSpeed;

  // Scale energy drops
  const scaledDrops = definition.lootTable.drops.map((drop) => {
    if (drop.type === "energy") {
      return {
        ...drop,
        minAmount: Math.floor(drop.minAmount * multipliers.energyReward),
        maxAmount: Math.floor(drop.maxAmount * multipliers.energyReward),
      };
    }
    if (drop.type === "meteorite") {
      return {
        ...drop,
        maxAmount: Math.max(1, Math.floor(multipliers.meteoriteReward)),
      };
    }
    return drop;
  });

  return {
    ...definition,
    baseStats: {
      ...definition.baseStats,
      maxHealth: scaledHealth,
      attackDamage: scaledAttack,
      attackSpeed: scaledSpeed,
    },
    lootTable: {
      drops: scaledDrops,
    },
  };
}

// ====================================================================================
// SPAWN FUNCTION
// ====================================================================================

/**
 * Spawn an enemy Entity from the enemy pool.
 *
 * @param enemyPool Record of enemy definitions (from area config)
 * @param areaId Current area ID for difficulty scaling
 * @param stageNumber Current stage number for difficulty scaling
 * @param position Battlefield position (0=front, 1=middle, 2=back)
 */
export function spawnEnemyFromPool(
  enemyPool: Record<string, EnemyDefinition>,
  areaId: number,
  stageNumber: number,
  position: 0 | 1 | 2
): Entity {
  // Get weighted pool and select random enemy
  const pool = getWeightedEnemyPool(enemyPool);
  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedEnemy = pool[randomIndex];

  // Calculate difficulty multipliers for current area/stage
  const multipliers = getEnemyCalculationMultipliers(areaId, stageNumber);

  // Apply difficulty scaling to the definition
  const scaledDefinition = applyDifficultyScaling(selectedEnemy, multipliers);

  // Create and return Entity
  return Entity.createEnemy(scaledDefinition, position);
}
