/**
 * Stat Modifiers Service
 *
 * SINGLE SOURCE OF TRUTH for all upgrade-based stat calculations.
 * Used by both the UI (Stats page) and combat system (Entity buffs).
 *
 * This eliminates duplicate calculation logic and ensures consistency
 * between what the player sees in UI and what happens in combat.
 */

import { ALL_UPGRADES } from "../config/progression.config";
import { getTotalUpgradeValue } from "../hooks/use-upgrades.hook";
import {
  ProgressionId,
  UpgradeStat,
  UpgradeIncrementType,
  UpgradeTarget,
} from "../types/progression.types";
import { Entity } from "../../entity/entity.class";
import type { ModifiableStat } from "../../entity/types/entity.types";

// ====================================================================================
// TYPES
// ====================================================================================

/**
 * Modifiers for a single stat, organized by type
 */
export interface StatModifiers {
  additive: number;
  multiplicative: number; // Accumulated as product (starts at 1)
  percentile: number; // Accumulated as sum
}

/**
 * All stat modifiers from upgrades
 */
export interface AllStatModifiers {
  attackDamage: StatModifiers;
  maxHealth: StatModifiers;
  attackSpeed: StatModifiers;
  critChance: StatModifiers;
  shield: StatModifiers;
  energyBonus: StatModifiers; // Special: not an entity stat
}

/**
 * Calculated player stats for display
 */
export interface CalculatedPlayerStats {
  name: string;
  attackDamage: number;
  attackSpeed: number;
  critChance: number;
  maxHealth: number;
  shield: number;
  icon: string;
  sprite: string;
}

// ====================================================================================
// DEFAULTS
// ====================================================================================

const DEFAULT_MODIFIERS: StatModifiers = {
  additive: 0,
  multiplicative: 1,
  percentile: 0,
};

function createDefaultModifiers(): AllStatModifiers {
  return {
    attackDamage: { ...DEFAULT_MODIFIERS },
    maxHealth: { ...DEFAULT_MODIFIERS },
    attackSpeed: { ...DEFAULT_MODIFIERS },
    critChance: { ...DEFAULT_MODIFIERS },
    shield: { ...DEFAULT_MODIFIERS },
    energyBonus: { ...DEFAULT_MODIFIERS },
  };
}

// ====================================================================================
// MAPPINGS
// ====================================================================================

const UPGRADE_STAT_TO_KEY: Record<UpgradeStat, keyof AllStatModifiers> = {
  [UpgradeStat.ATTACK_DAMAGE]: "attackDamage",
  [UpgradeStat.MAX_HEALTH]: "maxHealth",
  [UpgradeStat.ATTACK_SPEED]: "attackSpeed",
  [UpgradeStat.CRIT_CHANCE]: "critChance",
  [UpgradeStat.SHIELD]: "shield",
  [UpgradeStat.ENERGY_BONUS]: "energyBonus",
};

const STAT_KEY_TO_ENTITY_STAT: Record<
  keyof AllStatModifiers,
  ModifiableStat | null
> = {
  attackDamage: "attackDamage",
  maxHealth: "maxHealth",
  attackSpeed: "attackSpeed",
  critChance: "critChance",
  shield: "shield",
  energyBonus: null, // Not an entity stat
};

// ====================================================================================
// CORE CALCULATION - SINGLE SOURCE OF TRUTH
// ====================================================================================

/**
 * Calculate all stat modifiers from upgrade levels.
 * This is the SINGLE SOURCE OF TRUTH for upgrade calculations.
 *
 * @param upgradeLevels Current upgrade levels from progression store
 * @param target Filter by upgrade target (PLAYER or ENEMY)
 */
export function calculateStatModifiers(
  upgradeLevels: Partial<Record<ProgressionId, number>>,
  target: UpgradeTarget = UpgradeTarget.PLAYER
): AllStatModifiers {
  const modifiers = createDefaultModifiers();

  for (const upgrade of ALL_UPGRADES) {
    // Filter by target
    if (upgrade.upgradeTarget !== target) continue;

    const level = upgradeLevels[upgrade.id] ?? 0;
    if (level === 0) continue;

    const statKey = UPGRADE_STAT_TO_KEY[upgrade.upgradedStat];
    const statModifiers = modifiers[statKey];

    switch (upgrade.incrementType) {
      case UpgradeIncrementType.ADDITIVE:
        statModifiers.additive += getTotalUpgradeValue(upgrade, level);
        break;

      case UpgradeIncrementType.MULTIPLICATIVE:
        // Multiplicative stacks as product: 1.2^level
        statModifiers.multiplicative *= upgrade.baseValue ** level;
        break;

      case UpgradeIncrementType.PERCENTILE:
        // Percentile stacks as sum: +20% + +20% = +40%
        statModifiers.percentile += getTotalUpgradeValue(upgrade, level);
        break;
    }
  }

  return modifiers;
}

/**
 * Apply modifiers to a base value.
 * Order: Additive → Multiplicative → Percentile
 *
 * @param baseValue The base stat value before modifiers
 * @param modifiers The stat modifiers to apply
 */
export function applyModifiersToBase(
  baseValue: number,
  modifiers: StatModifiers
): number {
  // 1. Add additive bonuses
  let result = baseValue + modifiers.additive;

  // 2. Apply multiplicative bonuses
  result = result * modifiers.multiplicative;

  // 3. Apply percentile bonuses (percentage of current result, not base)
  result = result * (1 + modifiers.percentile / 100);

  return result;
}

// ====================================================================================
// ENTITY BUFF APPLICATION
// ====================================================================================

/**
 * Apply all upgrade buffs to a player entity.
 * Uses the unified stat modifier calculation.
 *
 * @param entity The player entity to apply buffs to
 * @param upgradeLevels Current upgrade levels from progression store
 */
export function applyUpgradeBuffsToEntity(
  entity: Entity,
  upgradeLevels: Partial<Record<ProgressionId, number>>,
  target: UpgradeTarget = UpgradeTarget.PLAYER
): void {
  // Calculate modifiers once using the single source of truth
  const allModifiers = calculateStatModifiers(upgradeLevels, target);
  const buffPrefix =
    target === UpgradeTarget.PLAYER ? "upgrade_buff" : "upgrade_debuff";

  // Apply each stat's modifiers as buffs
  for (const [statKey, modifiers] of Object.entries(allModifiers) as [
    keyof AllStatModifiers,
    StatModifiers
  ][]) {
    const entityStat = STAT_KEY_TO_ENTITY_STAT[statKey];
    if (!entityStat) continue; // Skip non-entity stats like energyBonus

    // Apply additive buff
    if (modifiers.additive !== 0) {
      entity.applyBuff(`${buffPrefix}_${statKey}_add`, {
        stat: entityStat,
        type: "add",
        value: modifiers.additive,
        durationMs: 0, // Permanent
      });
    }

    // Apply multiplicative buff
    if (modifiers.multiplicative !== 1) {
      entity.applyBuff(`${buffPrefix}_${statKey}_multiply`, {
        stat: entityStat,
        type: "multiply",
        value: modifiers.multiplicative,
        durationMs: 0, // Permanent
      });
    }

    // Apply percentile buff
    if (modifiers.percentile !== 0) {
      entity.applyBuff(`${buffPrefix}_${statKey}_percent`, {
        stat: entityStat,
        type: "percent",
        value: modifiers.percentile,
        durationMs: 0, // Permanent
      });
    }
  }
}

// ====================================================================================
// UI CALCULATION HELPERS
// ====================================================================================

/**
 * Base player stats (should match player definition or config)
 */
const BASE_PLAYER_STATS = {
  name: "Slime",
  maxHealth: 50,
  attackDamage: 1,
  attackSpeed: 1,
  critChance: 0,
  shield: 0,
  icon: "/player/BasicSlime.png",
  sprite: "/player/BasicSlime.png",
};

/**
 * Calculate player stats for UI display.
 * Uses the same modifier calculation as combat.
 *
 * @param upgradeLevels Current upgrade levels from progression store
 */
export function calculatePlayerStats(
  upgradeLevels: Partial<Record<ProgressionId, number>>
): CalculatedPlayerStats {
  const modifiers = calculateStatModifiers(upgradeLevels, UpgradeTarget.PLAYER);

  return {
    name: BASE_PLAYER_STATS.name,
    maxHealth: Math.floor(
      applyModifiersToBase(BASE_PLAYER_STATS.maxHealth, modifiers.maxHealth)
    ),
    attackDamage: Math.floor(
      applyModifiersToBase(
        BASE_PLAYER_STATS.attackDamage,
        modifiers.attackDamage
      )
    ),
    attackSpeed: Number(
      applyModifiersToBase(
        BASE_PLAYER_STATS.attackSpeed,
        modifiers.attackSpeed
      ).toFixed(2)
    ),
    critChance: Math.min(
      100,
      applyModifiersToBase(BASE_PLAYER_STATS.critChance, modifiers.critChance)
    ),
    shield: Math.floor(
      applyModifiersToBase(BASE_PLAYER_STATS.shield, modifiers.shield)
    ),
    icon: BASE_PLAYER_STATS.icon,
    sprite: BASE_PLAYER_STATS.sprite,
  };
}

/**
 * Calculate energy bonus multiplier from upgrades.
 * Returns a multiplier (e.g., 1.2 for +20% bonus)
 *
 * @param upgradeLevels Current upgrade levels from progression store
 */
export function calculateEnergyBonusMultiplier(
  upgradeLevels: Partial<Record<ProgressionId, number>>
): number {
  const modifiers = calculateStatModifiers(upgradeLevels, UpgradeTarget.PLAYER);
  return 1 + modifiers.energyBonus.percentile / 100;
}
