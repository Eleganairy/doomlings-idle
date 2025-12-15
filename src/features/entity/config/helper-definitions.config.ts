/**
 * Helper Entity Definitions
 *
 * Defines helper entities that can be spawned by enemies and bosses.
 * Helpers fight alongside their spawner but don't drop loot.
 */

import {
  AbilityTrigger,
  AbilityEffectType,
  AbilityTarget,
  type HelperDefinition,
} from "../types/entity.types";

// ====================================================================================
// HELPER DEFINITIONS
// ====================================================================================

/**
 * Basic Minion - Simple weak helper with no abilities
 */
export const BASIC_MINION: HelperDefinition = {
  id: "basic_minion",
  baseStats: {
    name: "Minion",
    description: "A weak creature summoned to aid its master.",
    maxHealth: 15,
    attackDamage: 2,
    attackSpeed: 0.8,
    critChance: 0,
    icon: "/enemy/Snail1.png",
    sprite: "/enemy/Snail1.png",
  },
  abilities: [],
};

/**
 * Goblin Minion - Small goblin helper spawned by goblin enemies
 */
export const GOBLIN_MINION: HelperDefinition = {
  id: "goblin_minion",
  baseStats: {
    name: "Goblin Minion",
    description: "A small goblin that fights for its leader.",
    maxHealth: 20,
    attackDamage: 3,
    attackSpeed: 1.0,
    critChance: 0,
    icon: "/enemy/Snail1.png", // TODO: Add goblin sprite
    sprite: "/enemy/Snail1.png",
  },
  abilities: [],
};

/**
 * Skeleton Warrior - Undead helper with higher damage
 */
export const SKELETON_WARRIOR: HelperDefinition = {
  id: "skeleton_warrior",
  baseStats: {
    name: "Skeleton Warrior",
    description: "An undead soldier risen to fight.",
    maxHealth: 25,
    attackDamage: 5,
    attackSpeed: 0.7,
    critChance: 5,
    icon: "/enemy/Snail1.png", // TODO: Add skeleton sprite
    sprite: "/enemy/Snail1.png",
  },
  abilities: [],
};

/**
 * Healing Sprite - Helper that heals its allies
 */
export const HEALING_SPRITE: HelperDefinition = {
  id: "healing_sprite",
  baseStats: {
    name: "Healing Sprite",
    description: "A magical creature that heals nearby allies.",
    maxHealth: 10,
    attackDamage: 1,
    attackSpeed: 0.5,
    critChance: 0,
    icon: "/enemy/Snail1.png", // TODO: Add sprite sprite
    sprite: "/enemy/Snail1.png",
  },
  abilities: [
    {
      id: "minor_heal",
      name: "Minor Heal",
      description: "Heals all allies for 10% of their max health",
      icon: "/abilities/heal.png",
      trigger: AbilityTrigger.ON_ABILITY_READY,
      cooldownMs: 6000, // 6 seconds
      effects: [
        {
          type: AbilityEffectType.HEAL,
          target: AbilityTarget.FRIENDLY_ALL, // Heals enemy side
          healPercent: 10,
        },
      ],
    },
  ],
};

/**
 * Vine Tentacle - Plant helper spawned by forest enemies
 */
export const VINE_TENTACLE: HelperDefinition = {
  id: "vine_tentacle",
  baseStats: {
    name: "Vine Tentacle",
    description: "A grasping plant appendage.",
    maxHealth: 30,
    attackDamage: 4,
    attackSpeed: 0.6,
    critChance: 0,
    icon: "/enemy/Snail1.png", // TODO: Add vine sprite
    sprite: "/enemy/Snail1.png",
  },
  abilities: [
    {
      id: "entangle",
      name: "Entangle",
      description: "Slows a player's attack speed by 20% for 5 seconds",
      icon: "/abilities/slow.png",
      trigger: AbilityTrigger.ON_SPAWN,
      cooldownMs: 0,
      effects: [
        {
          type: AbilityEffectType.STAT_MODIFY,
          target: AbilityTarget.ENEMY_SINGLE, // Targets player side
          statModifications: [
            {
              stat: "attackSpeed",
              type: "percent",
              value: -20, // -20% attack speed
              durationMs: 5000,
            },
          ],
        },
      ],
    },
  ],
};

// ====================================================================================
// HELPER DEFINITIONS REGISTRY
// ====================================================================================

/**
 * All available helper definitions indexed by ID
 */
export const HELPER_DEFINITIONS: Record<string, HelperDefinition> = {
  basic_minion: BASIC_MINION,
  goblin_minion: GOBLIN_MINION,
  skeleton_warrior: SKELETON_WARRIOR,
  healing_sprite: HEALING_SPRITE,
  vine_tentacle: VINE_TENTACLE,
};

/**
 * Get a helper definition by ID
 */
export function getHelperDefinition(id: string): HelperDefinition | undefined {
  return HELPER_DEFINITIONS[id];
}
