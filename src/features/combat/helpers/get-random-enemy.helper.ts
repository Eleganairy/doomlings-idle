import { EnemyRarity } from "../../enemy/types/enemy.types";
import type { Enemy } from "../types/combat.types";

// Weight enemies by rarity for selection
export function getWeightedEnemyPool(enemies: Record<string, Enemy>) {
  const pool: Enemy[] = [];

  Object.values(enemies).forEach((enemy) => {
    let weight = 1;

    switch (enemy.rarity) {
      case EnemyRarity.COMMON:
        weight = 80; // 80% chance
        break;
      case EnemyRarity.UNCOMMON:
        weight = 20; // 20% chance
        break;
      case EnemyRarity.RARE:
        weight = 0; // 0% chance
        break;
    }

    // Add enemy multiple times based on weight
    for (let i = 0; i < weight; i++) {
      pool.push(enemy);
    }
  });

  return pool;
}

// Select random enemy from weighted pool
export function getRandomEnemy(enemies: Record<string, Enemy>): Enemy {
  const pool = getWeightedEnemyPool(enemies);
  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedEnemy = pool[randomIndex];

  // Return a copy with full health
  return selectedEnemy;
}
