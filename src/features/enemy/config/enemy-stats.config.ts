import { EnemyRarity, EnemyType } from "../types/enemy.types";

export const ENEMY_CONFIG = {
  BASE: {
    health: 50,
    attackDamage: 5,
    attackSpeed: 500, // 1 attack every 2 seconds
    currencyReward: 10,
  },

  AREA_SCALING: {
    health: 1.5,
    attackDamage: 1.4,
    attackSpeed: 1.3,
    currencyReward: 1.5,
  },

  RARITY: {
    [EnemyRarity.COMMON]: {
      health: 1,
      attackDamage: 1,
      currencyReward: 1,
    },
    [EnemyRarity.UNCOMMON]: {
      health: 1.5,
      attackDamage: 1.3,
      currencyReward: 2,
    },
    [EnemyRarity.RARE]: {
      health: 2,
      attackDamage: 2,
      currencyReward: 2.5,
    },
    [EnemyRarity.LEGENDARY]: {
      health: 4,
      attackDamage: 3.5,
      currencyReward: 5,
    },
  },

  TYPE: {
    [EnemyType.FAST]: {
      health: 0.7,
      attackDamage: 1.2,
      attackSpeed: 0.6,
    },
    [EnemyType.STANDARD]: {
      health: 1,
      attackDamage: 1,
      attackSpeed: 1,
    },
    [EnemyType.STRONG]: {
      health: 1,
      attackDamage: 1.8,
      attackSpeed: 1.3,
    },
    [EnemyType.TANK]: {
      health: 2,
      attackDamage: 0.8,
      attackSpeed: 1.5,
    },
  },
} as const;
