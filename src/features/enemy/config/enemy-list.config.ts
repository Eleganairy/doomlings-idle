import { EnemyRarity, EnemyType } from "../types/enemy.types";
import { calculateEnemyStats } from "../helpers/calculate-enemy-stats.helper";
import type { Enemy } from "../../combat/types/combat.types";

export const ENEMY_LIST_AREA_1: Record<string, Enemy> = {
  GRASSHOPPER: calculateEnemyStats({
    name: "Grasshopper",
    description: "A small and quick enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.FAST,
    sprite: "../../../../enemy/Snail1.png",
  }),
  SNAIL: calculateEnemyStats({
    name: "Snail",
    description: "A small and quick enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.TANK,
    sprite: "../../../../enemy/Snail1.png",
  }),
  FIELD_MOUSE: calculateEnemyStats({
    name: "Field mouse",
    description: "A standard enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "../../../../enemy/Mouse1.png",
  }),
  WILD_RABBIT: calculateEnemyStats({
    name: "Wild rabbit",
    description: "A more strong enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STRONG,
    sprite: "../../../../enemy/Rabbit1.png",
  }),
  RED_FOX: calculateEnemyStats({
    name: "Red fox",
    description: "A more strong enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.RARE,
    type: EnemyType.STRONG,
    sprite: "../../../../enemy/RedFox1.png",
  }),
};

export const ENEMY_LIST_AREA_2: Record<string, Enemy> = {
  SEWER_RAT: calculateEnemyStats({
    name: "Sewer rat",
    description: "A small and quick enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.FAST,
    sprite: "../../../../enemy/Snail1.png",
  }),
  COCKROACH: calculateEnemyStats({
    name: "Cockroach",
    description: "A small and quick enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.TANK,
    sprite: "../../../../enemy/Snail1.png",
  }),
  MUTANT_RACCOON: calculateEnemyStats({
    name: "Mutant raccoon",
    description: "A standard enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "../../../../enemy/Snail1.png",
  }),
  FERAL_DOG: calculateEnemyStats({
    name: "Feral dog",
    description: "A more strong enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STRONG,
    sprite: "../../../../enemy/Snail1.png",
  }),
  WASTE_ALLIGATOR: calculateEnemyStats({
    name: "Waste alligator",
    description: "A more strong enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.RARE,
    type: EnemyType.STRONG,
    sprite: "../../../../enemy/Snail1.png",
  }),
};

export const ENEMY_LIST_AREA_3: Record<string, Enemy> = {
  THORN_BUSH: calculateEnemyStats({
    name: "Thorn Bush",
    description: "A more strong enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.STRONG,
    sprite: "../../../../enemy/Snail1.png",
  }),
  VINE_CREEPER: calculateEnemyStats({
    name: "Carnivorous Plant",
    description: "A standard enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.STANDARD,
    sprite: "../../../../enemy/Snail1.png",
  }),
  CARNIVOROUS_PLANT: calculateEnemyStats({
    name: "Carnivorous Plant",
    description: "A standard enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "../../../../enemy/Snail1.png",
  }),
  POISON_IVY_SERPENT: calculateEnemyStats({
    name: "Carnivorous Plant",
    description: "A standard enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "../../../../enemy/Snail1.png",
  }),
  ANCIENT_TREANT: calculateEnemyStats({
    name: "Ancient Treant",
    description: "A more tanky enemy.",
    areaNumber: 2,
    rarity: EnemyRarity.RARE,
    type: EnemyType.TANK,
    sprite: "../../../../enemy/Snail1.png",
  }),
};
