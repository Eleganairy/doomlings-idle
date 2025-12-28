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
    sprite: "/enemy/grasslands-enemies/Hedgehog.png",
    icon: "/enemy/grasslands-enemies/Hedgehog.png",
  }),
  SNAIL: createEnemyDefinition({
    name: "Snail",
    description: "A slow but sturdy creature.",
    areaNumber: 1,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.TANK,
    sprite: "/enemy/grasslands-enemies/Snail.png",
    icon: "/enemy/grasslands-enemies/Snail.png",
  }),
  WILD_RABBIT: createEnemyDefinition({
    name: "Wild rabbit",
    description: "A stronger enemy with big teeth.",
    areaNumber: 1,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STRONG,
    sprite: "/enemy/grasslands-enemies/Rabbit.png",
    icon: "/enemy/grasslands-enemies/Rabbit.png",
  }),
  RED_FOX: createEnemyDefinition({
    name: "Red Fox",
    description: "An enemies with furry claws.",
    areaNumber: 1,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "/enemy/grasslands-enemies/RedFox.png",
    icon: "/enemy/grasslands-enemies/RedFox.png",
  }),
  HAMMER_SQUIRREL: createEnemyDefinition({
    name: "Hammer Squirrel",
    description: "Why is a squirrel holding a hammer and why is it glowing?",
    areaNumber: 1,
    rarity: EnemyRarity.RARE,
    type: EnemyType.STRONG,
    sprite: "/enemy/grasslands-enemies/Squirrel.png",
    icon: "/enemy/grasslands-enemies/Squirrel.png",
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
    sprite: "/enemy/subway-enemies/Mouse.png",
    icon: "/enemy/subway-enemies/Mouse.png",
  }),
  TRASH_PANDA: createEnemyDefinition({
    name: "Trash panda",
    description: "Nearly indestructible pest.",
    areaNumber: 2,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.TANK,
    sprite: "/enemy/subway-enemies/TrashPanda.png",
    icon: "/enemy/subway-enemies/TrashPanda.png",
  }),
  MUTANT_RACCOON: createEnemyDefinition({
    name: "Mutant raccoon",
    description: "Twisted by toxic waste.",
    areaNumber: 2,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "/enemy/subway-enemies/TrashPanda.png",
    icon: "/enemy/subway-enemies/TrashPanda.png",
  }),
  RUST_DOG: createEnemyDefinition({
    name: "Rust dog",
    description: "A vicious scavenger.",
    areaNumber: 2,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STRONG,
    sprite: "/enemy/subway-enemies/Dog.png",
    icon: "/enemy/subway-enemies/Dog.png",
  }),
  WASTE_ALLIGATOR: createEnemyDefinition({
    name: "Waste alligator",
    description: "Apex predator of the sewers.",
    areaNumber: 2,
    rarity: EnemyRarity.RARE,
    type: EnemyType.STRONG,
    sprite: "/enemy/subway-enemies/Alligator.png",
    icon: "/enemy/subway-enemies/Alligator.png",
  }),
};

// ====================================================================================
// AREA 3 - MUSHROOM GROVE
// ====================================================================================

export const ENEMY_LIST_AREA_3: Record<string, EnemyDefinition> = {
  SPORE_BAT: createEnemyDefinition({
    name: "Spore bat",
    description: "A hostile plant with sharp thorns.",
    areaNumber: 3,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.STRONG,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  CAP_POPPER: createEnemyDefinition({
    name: "Cap popper",
    description: "Strangling vines that move with purpose.",
    areaNumber: 3,
    rarity: EnemyRarity.COMMON,
    type: EnemyType.STANDARD,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  BLOOM_SHROOM: createEnemyDefinition({
    name: "Bloom shroom",
    description: "A flesh-eating flower.",
    areaNumber: 3,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.STANDARD,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  MYCELIUM_CREEPY_CRAWLER: createEnemyDefinition({
    name: "Mycelium creepy crawler",
    description: "A venomous plant crawler.",
    areaNumber: 3,
    rarity: EnemyRarity.UNCOMMON,
    type: EnemyType.FAST,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
  TOXIC_BLOOM_LARVA: createEnemyDefinition({
    name: "Toxic bloom larva",
    description: "A massive tree guardian.",
    areaNumber: 3,
    rarity: EnemyRarity.RARE,
    type: EnemyType.TANK,
    sprite: "/enemy/Snail1.png",
    icon: "/enemy/Snail1.png",
  }),
};
