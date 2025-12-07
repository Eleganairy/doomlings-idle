import { EnemyRarity } from "../../enemy/types/enemy.types";
import type { Enemy } from "../types/combat.types";
import {
  calculateDifficultyMultiplier,
  applyDifficultyMultiplier,
} from "../../world/helpers/calculate-difficulty-multiplier.helper";

// Weight enemies by rarity for selection
export function getWeightedEnemyPool(enemies: Record<string, Enemy>) {
  const pool: Enemy[] = [];

  Object.values(enemies).forEach((enemy) => {
    let weight = 1;

    switch (enemy.rarity) {
      case EnemyRarity.COMMON:
        weight = 50; // 50% chance
        break;
      case EnemyRarity.UNCOMMON:
        weight = 30; // 30% chance
        break;
      case EnemyRarity.RARE:
        weight = 20; // 0% chance
        break;
    }

    // Add enemy multiple times based on weight
    for (let i = 0; i < weight; i++) {
      pool.push(enemy);
    }
  });

  return pool;
}

/**
 * Select random enemy from weighted pool and apply difficulty scaling
 *
 * @param enemies - Pool of enemies to select from
 * @param areaId - Current area ID for difficulty scaling
 * @param stageNumber - Current stage number for difficulty scaling
 * @returns Scaled enemy with difficulty multiplier applied
 */
export function getRandomEnemy(
  enemies: Record<string, Enemy>,
  areaId: number,
  stageNumber: number
): Enemy {
  const pool = getWeightedEnemyPool(enemies);
  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedEnemy = pool[randomIndex];

  // Calculate difficulty multipliers based on area and stage
  // Pass the enemy's base attack speed for linear scaling
  const multipliers = calculateDifficultyMultiplier(
    areaId,
    stageNumber,
    selectedEnemy.attackSpeed
  );

  // Apply difficulty scaling to enemy stats
  return applyDifficultyMultiplier(selectedEnemy, multipliers);
}
