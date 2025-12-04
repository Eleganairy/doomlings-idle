import { EnemyRarity, type Enemy } from "../../enemy/types/enemy.types";

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
        weight = 15; // 15% chance
        break;
      case EnemyRarity.LEGENDARY:
        weight = 5; // 5% chance
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
  return {
    ...selectedEnemy,
    currentHealth: selectedEnemy.health,
  };
}
