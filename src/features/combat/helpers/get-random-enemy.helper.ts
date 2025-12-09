import {
  getEnemyCalculatedStats,
  getEnemyCalculationMultipliers,
} from "../../enemy/helpers/get-enemy-calculated-stats.helper";
import { EnemyRarity } from "../../enemy/types/enemy.types";
import type { Enemy } from "../types/combat.types";

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
        weight = 20; // 20% chance
        break;
    }

    // Add enemy multiple times based on weight
    for (let i = 0; i < weight; i++) {
      pool.push(enemy);
    }
  });

  return pool;
}

//Get random enemy from pool and apply difficulty scaling
export function getRandomEnemy(
  enemies: Record<string, Enemy>,
  areaId: number,
  stageNumber: number
): Enemy {
  const pool = getWeightedEnemyPool(enemies);
  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedEnemy = pool[randomIndex];

  // Calculate difficulty multipliers based on area and stage
  const multipliers = getEnemyCalculationMultipliers(areaId, stageNumber);

  // Apply difficulty scaling to enemy stats
  return getEnemyCalculatedStats(selectedEnemy, multipliers);
}
