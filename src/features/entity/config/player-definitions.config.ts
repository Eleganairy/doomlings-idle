/**
 * Player Slime Definitions
 *
 * Defines all playable slime characters with their stats and abilities.
 * Each slime type has unique characteristics and optional special abilities.
 */

import {
  AbilityTrigger,
  AbilityEffectType,
  AbilityTarget,
  type PlayerDefinition,
} from "../types/entity.types";

// ====================================================================================
// PLAYER SLIME DEFINITIONS
// ====================================================================================

/**
 * Basic Slime - The starter slime with no special abilities
 * Balanced stats, good for beginners
 */
export const BASIC_SLIME: PlayerDefinition = {
  id: "basic_slime",
  baseStats: {
    name: "Slime",
    description: "A friendly blob of goo. Your first companion.",
    maxHealth: 50,
    attackDamage: 1,
    attackSpeed: 1,
    critChance: 0,
    icon: "/player/BasicSlime.png",
    sprite: "/player/BasicSlime.png",
  },
  shield: 0,
  abilities: [], // No special abilities
};

/**
 * Healer Slime - Support slime that heals allies
 * Lower damage but can keep the team alive
 */
export const DRUID_SLIME: PlayerDefinition = {
  id: "druid_slime",
  baseStats: {
    name: "Druid Slime",
    description: "A nurturing slime that radiates healing energy.",
    maxHealth: 60,
    attackDamage: 1,
    attackSpeed: 0.8,
    critChance: 0,
    icon: "/player/DruidSlime.png", // TODO: Add healer sprite
    sprite: "/player/DruidSlime.png",
  },
  shield: 0,
  abilities: [
    {
      id: "healing_pulse",
      name: "Healing Pulse",
      description: "Heals all friendly slimes for 15% of their max health",
      icon: "/abilities/heal.png",
      trigger: AbilityTrigger.ON_ABILITY_READY,
      cooldownMs: 8000, // 8 seconds
      effects: [
        {
          type: AbilityEffectType.HEAL,
          target: AbilityTarget.FRIENDLY_ALL,
          healPercent: 15,
        },
      ],
    },
  ],
};

/**
 * Electric Slime - Offensive slime with AoE damage
 * Can damage all enemies at once
 */
export const ELECTRIC_SLIME: PlayerDefinition = {
  id: "electric_slime",
  baseStats: {
    name: "Electric Slime",
    description: "A crackling slime charged with lightning.",
    maxHealth: 40,
    attackDamage: 1,
    attackSpeed: 1.1,
    critChance: 5,
    icon: "/player/ElectricSlime.png", // TODO: Add electric sprite
    sprite: "/player/ElectricSlime.png",
  },
  shield: 0,
  abilities: [
    {
      id: "chain_lightning",
      name: "Chain Lightning",
      description: "Strikes all enemies for 50% of attack damage",
      icon: "/abilities/lightning.png",
      trigger: AbilityTrigger.ON_ABILITY_READY,
      cooldownMs: 10000, // 10 seconds
      effects: [
        {
          type: AbilityEffectType.DAMAGE,
          target: AbilityTarget.ENEMY_ALL,
          damageMultiplier: 0.5,
        },
      ],
    },
  ],
};

/**
 * Tank Slime - Defensive slime with high health and shield ability
 */
export const TANK_SLIME: PlayerDefinition = {
  id: "tank_slime",
  baseStats: {
    name: "Tank Slime",
    description: "A hardened slime with protective outer layer.",
    maxHealth: 80,
    attackDamage: 1,
    attackSpeed: 0.7,
    critChance: 0,
    icon: "/player/TankSlime.png", // TODO: Add tank sprite
    sprite: "/player/TankSlime.png",
  },
  shield: 10,
  abilities: [
    {
      id: "protective_barrier",
      name: "Protective Barrier",
      description: "Grants 25 shield to self",
      icon: "/abilities/shield.png",
      trigger: AbilityTrigger.ON_ABILITY_READY,
      cooldownMs: 12000, // 12 seconds
      effects: [
        {
          type: AbilityEffectType.SHIELD,
          target: AbilityTarget.SELF,
          shieldAmount: 25,
        },
      ],
    },
  ],
};

// ====================================================================================
// PLAYER DEFINITIONS REGISTRY
// ====================================================================================

/**
 * All available player slime definitions indexed by ID
 */
export const PLAYER_DEFINITIONS: Record<string, PlayerDefinition> = {
  basic_slime: BASIC_SLIME,
  druid_slime: DRUID_SLIME,
  electric_slime: ELECTRIC_SLIME,
  tank_slime: TANK_SLIME,
};

/**
 * Get a player definition by ID
 */
export function getPlayerDefinition(id: string): PlayerDefinition | undefined {
  return PLAYER_DEFINITIONS[id];
}

/**
 * Get the default starting player definition
 */
export function getDefaultPlayerDefinition(): PlayerDefinition {
  return BASIC_SLIME;
}
