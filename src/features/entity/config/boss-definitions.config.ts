/**
 * Boss Entity Definitions
 *
 * Defines boss entities with phases and special abilities.
 * Bosses are powerful enemies that can transition between phases
 * at different health thresholds.
 */

import {
  AbilityTrigger,
  AbilityEffectType,
  AbilityTarget,
  SpawnPosition,
  type BossDefinition,
} from "../types/entity.types";

// ====================================================================================
// BOSS DEFINITIONS
// ====================================================================================

/**
 * Forest Guardian - Area 1 Boss
 *
 * Phases:
 * - Normal: Standard attacks, can spawn vine helpers
 * - Enraged (50%): Increased damage and attack speed
 */
export const FOREST_GUARDIAN: BossDefinition = {
  id: "forest_guardian",
  areaNumber: 1,
  baseStats: {
    name: "Forest Guardian",
    description:
      "An ancient protector of the grasslands, corrupted by meteor energy.",
    maxHealth: 500,
    attackDamage: 15,
    attackSpeed: 0.6,
    critChance: 5,
    icon: "/enemy/boss/forest-guardian.png",
    sprite: "/enemy/boss/forest-guardian.png",
  },
  lootTable: {
    drops: [
      { type: "energy", dropChance: 100, minAmount: 50, maxAmount: 75 },
      { type: "meteorite", dropChance: 50, minAmount: 3, maxAmount: 5 },
      {
        type: "areaLoot",
        areaLootId: "guardian_essence",
        dropChance: 100,
        minAmount: 1,
        maxAmount: 1,
      },
    ],
  },
  abilities: [
    {
      id: "guardian_roar",
      name: "Guardian's Roar",
      description: "A mighty roar that increases attack power on spawn",
      icon: "/abilities/roar.png",
      trigger: AbilityTrigger.ON_SPAWN,
      cooldownMs: 0,
      effects: [
        {
          type: AbilityEffectType.STAT_MODIFY,
          target: AbilityTarget.SELF,
          statModifications: [
            {
              stat: "attackDamage",
              type: "percent",
              value: 10,
              durationMs: 30000, // 30 seconds
            },
          ],
        },
      ],
    },
    {
      id: "summon_vines",
      name: "Summon Vines",
      description: "Summons vine tentacles to aid in battle",
      icon: "/abilities/summon.png",
      trigger: AbilityTrigger.ON_ABILITY_READY,
      cooldownMs: 20000, // 20 seconds
      effects: [
        {
          type: AbilityEffectType.SPAWN_HELPER,
          target: AbilityTarget.SELF,
          spawnConfig: {
            helperDefinitionId: "vine_tentacle",
            position: SpawnPosition.FRONT,
            count: 1,
          },
        },
      ],
    },
  ],
  phases: [
    {
      id: "enraged",
      name: "Enraged",
      triggersAtHealthPercent: 50,
      abilities: [
        {
          id: "fury_slam",
          name: "Fury Slam",
          description: "A powerful slam that damages all enemies",
          icon: "/abilities/slam.png",
          trigger: AbilityTrigger.ON_ABILITY_READY,
          cooldownMs: 15000, // 15 seconds
          effects: [
            {
              type: AbilityEffectType.DAMAGE,
              target: AbilityTarget.ENEMY_ALL,
              damageMultiplier: 1.5,
            },
          ],
        },
      ],
      statModifiers: [
        {
          stat: "attackDamage",
          type: "multiply",
          value: 1.5,
          durationMs: 0, // Permanent for the rest of the fight
        },
        {
          stat: "attackSpeed",
          type: "percent",
          value: 25,
          durationMs: 0,
        },
      ],
    },
  ],
};

/**
 * Mushroom King - Area 3 Boss (Mushroom Caverns)
 *
 * Phases:
 * - Normal: Spawns spore helpers, occasional poison
 * - Toxic Surge (50%): Increased poison effects, faster spawning
 * - Final Stand (25%): Massive stat boost, desperate attacks
 */
export const MUSHROOM_KING: BossDefinition = {
  id: "mushroom_king",
  areaNumber: 3,
  baseStats: {
    name: "Mushroom King",
    description: "The ruler of the fungal depths, spreading corruption.",
    maxHealth: 800,
    attackDamage: 20,
    attackSpeed: 0.5,
    critChance: 10,
    icon: "/enemy/boss/mushroom-king.png",
    sprite: "/enemy/boss/mushroom-king.png",
  },
  lootTable: {
    drops: [
      { type: "energy", dropChance: 100, minAmount: 100, maxAmount: 150 },
      { type: "meteorite", dropChance: 75, minAmount: 5, maxAmount: 8 },
      {
        type: "areaLoot",
        areaLootId: "mycelium_crown",
        dropChance: 100,
        minAmount: 1,
        maxAmount: 1,
      },
    ],
  },
  abilities: [
    {
      id: "spore_cloud",
      name: "Spore Cloud",
      description: "Releases toxic spores that reduce enemy attack",
      icon: "/abilities/poison.png",
      trigger: AbilityTrigger.ON_ABILITY_READY,
      cooldownMs: 12000,
      effects: [
        {
          type: AbilityEffectType.STAT_MODIFY,
          target: AbilityTarget.ENEMY_ALL,
          statModifications: [
            {
              stat: "attackDamage",
              type: "percent",
              value: -15, // -15% attack damage
              durationMs: 8000,
            },
          ],
        },
      ],
    },
  ],
  phases: [
    {
      id: "toxic_surge",
      name: "Toxic Surge",
      triggersAtHealthPercent: 50,
      abilities: [
        {
          id: "spawn_shrooms",
          name: "Spawn Shrooms",
          description: "Summons mushroom minions",
          icon: "/abilities/summon.png",
          trigger: AbilityTrigger.ON_ABILITY_READY,
          cooldownMs: 10000,
          effects: [
            {
              type: AbilityEffectType.SPAWN_HELPER,
              target: AbilityTarget.SELF,
              spawnConfig: {
                helperDefinitionId: "basic_minion",
                position: SpawnPosition.BEHIND,
                count: 2,
              },
            },
          ],
        },
      ],
      statModifiers: [
        {
          stat: "attackSpeed",
          type: "percent",
          value: 20,
          durationMs: 0,
        },
      ],
    },
    {
      id: "final_stand",
      name: "Final Stand",
      triggersAtHealthPercent: 25,
      abilities: [],
      statModifiers: [
        {
          stat: "attackDamage",
          type: "multiply",
          value: 2.0,
          durationMs: 0,
        },
        {
          stat: "critChance",
          type: "add",
          value: 25,
          durationMs: 0,
        },
      ],
    },
  ],
};

// ====================================================================================
// BOSS DEFINITIONS REGISTRY
// ====================================================================================

/**
 * All available boss definitions indexed by ID
 */
export const BOSS_DEFINITIONS: Record<string, BossDefinition> = {
  forest_guardian: FOREST_GUARDIAN,
  mushroom_king: MUSHROOM_KING,
};

/**
 * Get boss definitions for a specific area
 */
export function getBossesForArea(areaNumber: number): BossDefinition[] {
  return Object.values(BOSS_DEFINITIONS).filter(
    (boss) => boss.areaNumber === areaNumber
  );
}

/**
 * Get a boss definition by ID
 */
export function getBossDefinition(id: string): BossDefinition | undefined {
  return BOSS_DEFINITIONS[id];
}
