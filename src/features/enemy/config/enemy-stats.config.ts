import { EnemyRarity, EnemyType } from "../types/enemy.types";

export const ENEMY_CONFIG = {
  BASE: {
    maxHealth: 10,
    attackDamage: 1,
    attackSpeed: 2000, // 1 attack every 2 seconds
    currencyReward: 1,
  },

  AREA_SCALING: {
    maxHealth: 1.5,
    attackDamage: 1.5,
    attackSpeed: 1.2,
    currencyReward: 2,
  },

  RARITY: {
    [EnemyRarity.COMMON]: {
      maxHealth: 1,
      attackDamage: 1,
      currencyReward: 1,
    },
    [EnemyRarity.UNCOMMON]: {
      maxHealth: 1.3,
      attackDamage: 1.2,
      currencyReward: 1.5,
    },
    [EnemyRarity.RARE]: {
      maxHealth: 1.6,
      attackDamage: 1.5,
      currencyReward: 2,
    },
  },

  TYPE: {
    [EnemyType.FAST]: {
      maxHealth: 0.8,
      attackDamage: 1,
      attackSpeed: 0.8,
    },
    [EnemyType.STANDARD]: {
      maxHealth: 1,
      attackDamage: 1,
      attackSpeed: 1,
    },
    [EnemyType.STRONG]: {
      maxHealth: 0.9,
      attackDamage: 1.3,
      attackSpeed: 0.9,
    },
    [EnemyType.TANK]: {
      maxHealth: 1.5,
      attackDamage: 1,
      attackSpeed: 0.7,
    },
  },
} as const;
