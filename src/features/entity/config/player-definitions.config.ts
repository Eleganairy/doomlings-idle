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
    description:
      "The basic slime that flew with the meteorite to earth. It does not look like it does not look like it can do anything special. Anyway let's feed it meteorite, that is a good idea.",
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
    description:
      "Using the energy of living beings and trees this slime is able to use the energy it gains for good. Instead of dealing damage this slime can heal it's allies and has strong abilities in return for weaker base stats",
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
    description:
      "Using the electricity from the planet and from the life around it this slime generates so much energy that it is completely made out of electricity. This slime can attack fast and generate strong attacks that damage all enemies.",
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
      cooldownMs: 1000, // 1 second
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
 * Fortified Slime - Defensive slime with high health and shield ability
 */
export const FORTIFIED_SLIME: PlayerDefinition = {
  id: "fortified_slime",
  baseStats: {
    name: "Fortified Slime",
    description:
      "Scraping the bark of the fortified trees brought to life a tanky slime that can take more damage and shield itself to protect himself from taking damage. Those trees came in handy after all.",
    maxHealth: 80,
    attackDamage: 1,
    attackSpeed: 0.7,
    critChance: 0,
    icon: "/player/FortifiedSlime.png", // TODO: Add tank sprite
    sprite: "/player/FortifiedSlime.png",
  },
  shield: 0,
  abilities: [
    {
      id: "Shield-Ability",
      name: "Pick up shield",
      description: "Grants 10% health shield on start",
      icon: "/abilities/shield.png",
      trigger: AbilityTrigger.ON_SPAWN,
      cooldownMs: 0,
      effects: [
        {
          type: AbilityEffectType.SHIELD,
          target: AbilityTarget.SELF,
          shieldPercent: 10,
        },
      ],
    },
    {
      id: "protective_barrier",
      name: "Protective Barrier",
      description: "Grants 20% health shield to self every 8 seconds",
      icon: "/abilities/shield.png",
      trigger: AbilityTrigger.ON_ABILITY_READY,
      cooldownMs: 8000, // 8 seconds
      effects: [
        {
          type: AbilityEffectType.SHIELD,
          target: AbilityTarget.SELF,
          shieldPercent: 20,
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
  fortified_slime: FORTIFIED_SLIME,
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
