/**
 * Enemy List Configuration
 *
 * Defines all enemies for each area using EnemyDefinition.
 * Stats are calculated from base values with rarity and type multipliers.
 */

import type { EnemyDefinition } from "../../entity/types/entity.types";
import { createEnemyDefinition } from "../helpers/create-enemy-definition.helper";
import { EnemyRarity, EnemyType } from "../types/enemy.types";

// ====================================================================================
// AREA 1 - GRASSLANDS
// ====================================================================================

export const ENEMY_LIST_AREA_1: Record<string, EnemyDefinition> = {
  HEDGEHOG: createEnemyDefinition({
    name: "Spiky Hedgehog",
    description: "A small but fast creature.",
    areaNumber: 1,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.FAST,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  SNAIL: createEnemyDefinition({
    name: "Snail",
    description: "A slow but sturdy creature.",
    areaNumber: 1,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.TANK,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  HAMMER_SQUIRREL: createEnemyDefinition({
    name: "Field mouse",
    description: "A standard enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "/enemy/Mouse1.png",
    icon: "/enemy/Mouse1.png",
  }),
  WILD_RABBIT: createEnemyDefinition({
    name: "Wild rabbit",
    description: "A stronger enemy.",
    areaNumber: 1,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STRONG,
    sprite: "/enemy/Rabbit1.png",
    icon: "/enemy/Rabbit1.png",
  }),
  RED_FOX: createEnemyDefinition({
    name: "Red fox",
    description: "A rare and powerful predator.",
    areaNumber: 1,
    rarity: EnemyRarity.RARE,
    type: EnemyType.STRONG,
    sprite: "/enemy/RedFox1.png",
    icon: "/enemy/RedFox1.png",
  }),
};

// ====================================================================================
// AREA 2 - URBAN SEWERS
// ====================================================================================

export const ENEMY_LIST_AREA_2: Record<string, EnemyDefinition> = {
  SEWER_RAT: createEnemyDefinition({
    name: "Sewer rat",
    description: "A quick nuisance from the depths.",
    areaNumber: 2,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.FAST,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  TRASH_PANDS: createEnemyDefinition({
    name: "Trash panda",
    description: "Nearly indestructible pest.",
    areaNumber: 2,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.TANK,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  MUTANT_RACCOON: createEnemyDefinition({
    name: "Mutant raccoon",
    description: "Twisted by toxic waste.",
    areaNumber: 2,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  RUST_DOG: createEnemyDefinition({
    name: "Rust dog",
    description: "A vicious scavenger.",
    areaNumber: 2,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STRONG,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  WASTE_ALLIGATOR: createEnemyDefinition({
    name: "Waste alligator",
    description: "Apex predator of the sewers.",
    areaNumber: 2,
    rarity: EnemyRarity.RARE,
    type: EnemyType.STRONG,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
};

// ====================================================================================
// AREA 3 - MUSHROOM GROVE
// ====================================================================================

export const ENEMY_LIST_AREA_3: Record<string, EnemyDefinition> = {
  SPORE_BOT: createEnemyDefinition({
    name: "Spore bat",
    description: "A hostile plant with sharp thorns.",
    areaNumber: 3,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.STRONG,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  BLOOM_SHROOM: createEnemyDefinition({
    name: "Bloom shroom",
    description: "Strangling vines that move with purpose.",
    areaNumber: 3,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.STANDARD,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  CARNIVOROUS_PLANT: createEnemyDefinition({
    name: "Carnivorous Plant",
    description: "A flesh-eating flower.",
    areaNumber: 3,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  POISON_IVY_SERPENT: createEnemyDefinition({
    name: "Poison Ivy Serpent",
    description: "A venomous plant creature.",
    areaNumber: 3,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.FAST,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  ANCIENT_TREANT: createEnemyDefinition({
    name: "Ancient Treant",
    description: "A massive tree guardian.",
    areaNumber: 3,
    rarity: EnemyRarity.RARE,
    type: EnemyType.TANK,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
};
