import { EnemyRarity, EnemyType } from "../types/enemy.types";

export const ENEMY_CONFIG = {
  BASE: {
    maxHealth: 10,
    attackDamage: 1,
    attackSpeed: 0.5, // 0.5 attacks per second
    energyReward: 1,
  },

  AREA_SCALING: {
    maxHealth: 2.5,
    attackDamage: 2.5,
    // Note: energyReward scaling is now handled by difficulty multiplier
  },

  RARITY: {
    [EnemyRarity.COMMON]: {
      maxHealth: 1,
      attackDamage: 1,
      energyReward: 1,
    },
    [EnemyRarity.UNCOMMON]: {
      maxHealth: 1.3,
      attackDamage: 1.2,
      energyReward: 1.5,
    },
    [EnemyRarity.RARE]: {
      maxHealth: 1.6,
      attackDamage: 1.5,
      energyReward: 2,
    },
  },

  TYPE: {
    [EnemyType.FAST]: {
      maxHealth: 0.8,
      attackDamage: 1,
      attackSpeed: 1.2, // 20% faster attacks
    },
    [EnemyType.STANDARD]: {
      maxHealth: 1,
      attackDamage: 1,
      attackSpeed: 1,
    },
    [EnemyType.STRONG]: {
      maxHealth: 0.9,
      attackDamage: 1.3,
      attackSpeed: 0.9, // 10% slower attacks
    },
    [EnemyType.TANK]: {
      maxHealth: 1.5,
      attackDamage: 1,
      attackSpeed: 0.7, // 30% slower attacks
    },
  },
} as const;
