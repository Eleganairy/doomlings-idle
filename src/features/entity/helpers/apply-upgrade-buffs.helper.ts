/**
 * Apply Upgrade Buffs Helper
 *
 * Converts purchased upgrades into Entity buffs.
 * Uses the Entity's existing buff system to apply stat modifications.
 *
 * Buff ID format: "upgrade_buff_{upgradeId}" for clear identification.
 */

import { Entity } from "../entity.class";
import { ALL_UPGRADES } from "../../progression/config/progression.config";
import { getTotalUpgradeValue } from "../../progression/hooks/use-upgrades.hook";
import {
  UpgradeId,
  UpgradeStat,
  UpgradeIncrementType,
  UpgradeTarget,
} from "../../progression/types/progression.types";
import type { ModifiableStat, ModificationType } from "../types/entity.types";

// ====================================================================================
// STAT MAPPING
// ====================================================================================

/**
 * Maps UpgradeStat to Entity's ModifiableStat.
 * Some upgrade stats (like ENERGY_BONUS) don't map to entity stats.
 */
const UPGRADE_STAT_TO_ENTITY_STAT: Record<UpgradeStat, ModifiableStat | null> =
  {
    [UpgradeStat.ATTACK_DAMAGE]: "attackDamage",
    [UpgradeStat.MAX_HEALTH]: "maxHealth",
    [UpgradeStat.ATTACK_SPEED]: "attackSpeed",
    [UpgradeStat.CRIT_CHANCE]: "critChance",
    [UpgradeStat.SHIELD]: "shield",
    [UpgradeStat.ENERGY_BONUS]: null, // Not an entity stat - handled separately
  };

/**
 * Maps UpgradeIncrementType to Entity's ModificationType.
 */
const UPGRADE_TYPE_TO_BUFF_TYPE: Record<
  UpgradeIncrementType,
  ModificationType
> = {
  [UpgradeIncrementType.ADDITIVE]: "add",
  [UpgradeIncrementType.MULTIPLICATIVE]: "multiply",
  [UpgradeIncrementType.PERCENTILE]: "percent",
};

// ====================================================================================
// BUFF APPLICATION
// ====================================================================================

/**
 * Apply all upgrade buffs to a player entity.
 *
 * Upgrades with upgradeTarget: PLAYER are converted to permanent buffs
 * using the Entity's buff system.
 *
 * @param entity The player entity to apply buffs to
 * @param upgradeLevels Current upgrade levels from progression store
 *
 * @example
 * const player = Entity.createPlayer(BASIC_SLIME, 0);
 * applyUpgradeBuffsToPlayer(player, upgradeLevels);
 */
export function applyUpgradeBuffsToPlayer(
  entity: Entity,
  upgradeLevels: Partial<Record<UpgradeId, number>>
): void {
  for (const upgrade of ALL_UPGRADES) {
    // Only apply PLAYER-targeted upgrades
    if (upgrade.upgradeTarget !== UpgradeTarget.PLAYER) continue;

    const level = upgradeLevels[upgrade.id] ?? 0;
    if (level === 0) continue;

    // Skip non-entity stats (like ENERGY_BONUS)
    const entityStat = UPGRADE_STAT_TO_ENTITY_STAT[upgrade.upgradedStat];
    if (!entityStat) continue;

    // Calculate the buff value
    let buffValue: number;
    if (upgrade.incrementType === UpgradeIncrementType.MULTIPLICATIVE) {
      // For multiplicative, calculate the final multiplier (e.g., 1.2^3 = 1.728)
      buffValue = Math.pow(upgrade.baseValue, level);
    } else {
      // For additive/percentile, sum up total value
      buffValue = getTotalUpgradeValue(upgrade, level);
    }

    const buffType = UPGRADE_TYPE_TO_BUFF_TYPE[upgrade.incrementType];

    // Apply as permanent buff (durationMs: 0 = permanent)
    entity.applyBuff(`upgrade_buff_${upgrade.id}`, {
      stat: entityStat,
      type: buffType,
      value: buffValue,
      durationMs: 0, // Permanent until entity dies
    });
  }
}

/**
 * Apply all upgrade debuffs to an enemy entity.
 *
 * Upgrades with upgradeTarget: ENEMY are converted to permanent debuffs.
 * Values are typically negative (e.g., -10% attack speed).
 *
 * @param entity The enemy entity to apply debuffs to
 * @param upgradeLevels Current upgrade levels from progression store
 *
 * @example
 * const enemy = Entity.createEnemy(definition, 0);
 * applyUpgradeDebuffsToEnemy(enemy, upgradeLevels);
 */
export function applyUpgradeDebuffsToEnemy(
  entity: Entity,
  upgradeLevels: Partial<Record<UpgradeId, number>>
): void {
  for (const upgrade of ALL_UPGRADES) {
    // Only apply ENEMY-targeted upgrades
    if (upgrade.upgradeTarget !== UpgradeTarget.ENEMY) continue;

    const level = upgradeLevels[upgrade.id] ?? 0;
    if (level === 0) continue;

    // Skip non-entity stats
    const entityStat = UPGRADE_STAT_TO_ENTITY_STAT[upgrade.upgradedStat];
    if (!entityStat) continue;

    // Calculate the debuff value (upgrade baseValue should be negative for debuffs)
    let debuffValue: number;
    if (upgrade.incrementType === UpgradeIncrementType.MULTIPLICATIVE) {
      debuffValue = Math.pow(upgrade.baseValue, level);
    } else {
      debuffValue = getTotalUpgradeValue(upgrade, level);
    }

    const buffType = UPGRADE_TYPE_TO_BUFF_TYPE[upgrade.incrementType];

    // Apply as permanent debuff
    entity.applyBuff(`upgrade_debuff_${upgrade.id}`, {
      stat: entityStat,
      type: buffType,
      value: debuffValue,
      durationMs: 0, // Permanent until entity dies
    });
  }
}
