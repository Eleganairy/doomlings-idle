import { EnemyRarity, EnemyType, type Enemy } from "../types/enemy.types";
import { calculateEnemyStats } from "../helpers/calculate-enemy-stats.helper";

export const ENEMY_LIST_AREA_1: Record<string, Enemy> = {
  FIELD_MOUSE: calculateEnemyStats({
    name: "Field Mouse",
    description: "A standard enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.STANDARD,
  }),
  GRASSHOPPER: calculateEnemyStats({
    name: "Grasshopper",
    description: "A small and quick enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.FAST,
  }),
  WILD_RABBIT: calculateEnemyStats({
    name: "Wild Rabbit",
    description: "A more strong enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.RARE,
    type: EnemyType.STRONG,
  }),
};

export const ENEMY_LIST_AREA_2: Record<string, Enemy> = {
  THORN_BUSH: calculateEnemyStats({
    name: "Thorn Bush",
    description: "A more strong enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.STRONG,
  }),
  CARNIVOROUS_PLANT: calculateEnemyStats({
    name: "Carnivorous Plant",
    description: "A standard enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
  }),
  ANCIENT_TREANT: calculateEnemyStats({
    name: "Ancient Treant",
    description: "A more tanky enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.RARE,
    type: EnemyType.TANK,
  }),
};
