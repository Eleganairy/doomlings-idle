import type { Entity } from "../../combat/types/combat.types";
import { ALL_UPGRADES } from "../../progression/config/progression.config";
import { getTotalUpgradeValue } from "../../progression/hooks/use-upgrades.hook";
import {
  type Upgrade,
  UpgradeId,
  UpgradeStat,
  UpgradeIncrementType,
} from "../../progression/types/progression.types";
import { PLAYER_CONFIG } from "../config/player-stats.config";

interface StatModifiers {
  additive: number;
  multiplicative: number;
  percentile: number;
}

/**
 * Group upgrades by their increment type and calculate their total values
 */
function getStatModifiers(
  stat: UpgradeStat,
  upgradeLevels: Record<UpgradeId, number>
): StatModifiers {
  const modifiers: StatModifiers = {
    additive: 0,
    multiplicative: 1, // Start at 1 for multiplication
    percentile: 0,
  };

  for (const upgrade of ALL_UPGRADES) {
    if (upgrade.upgradedStat !== stat) continue;

    const level = upgradeLevels[upgrade.id] ?? 0;
    if (level === 0) continue;

    const totalValue = getTotalUpgradeValue(upgrade, level);

    switch (upgrade.incrementType) {
      case UpgradeIncrementType.ADDITIVE:
        modifiers.additive += totalValue;
        break;

      case UpgradeIncrementType.MULTIPLICATIVE:
        // For multiplicative, each level multiplies by the value
        // e.g., ×1.2 for 3 levels = 1.2 * 1.2 * 1.2 = 1.728
        modifiers.multiplicative *= Math.pow(upgrade.baseValue, level);
        break;

      case UpgradeIncrementType.PERCENTILE:
        // Sum up all percentage bonuses
        modifiers.percentile += totalValue;
        break;
    }
  }

  return modifiers;
}

/**
 * Apply modifiers to a base value in order: Additive → Multiplicative → Percentile
 */
function applyModifiers(baseValue: number, modifiers: StatModifiers): number {
  // 1. Add additive bonuses
  let result = baseValue + modifiers.additive;

  // 2. Apply multiplicative bonuses
  result = result * modifiers.multiplicative;

  // 3. Apply percentile bonuses
  result = result * (1 + modifiers.percentile / 100);

  return result;
}

/**
 * Calculate all player stats based on upgrade levels.
 * Applies upgrades in order: Additive → Multiplicative → Percentile
 */
export function calculatePlayerStats(
  upgradeLevels: Record<UpgradeId, number>
): Entity {
  // Get modifiers for each stat
  const attackDamageModifiers = getStatModifiers(
    UpgradeStat.ATTACK_DAMAGE,
    upgradeLevels
  );
  const maxHealthModifiers = getStatModifiers(
    UpgradeStat.MAX_HEALTH,
    upgradeLevels
  );
  const attackSpeedModifiers = getStatModifiers(
    UpgradeStat.ATTACK_SPEED,
    upgradeLevels
  );
  const critChanceModifiers = getStatModifiers(
    UpgradeStat.CRIT_CHANCE,
    upgradeLevels
  );

  // Apply modifiers to base stats
  const attackDamage = applyModifiers(
    PLAYER_CONFIG.BASE_ATTACK_DAMAGE,
    attackDamageModifiers
  );
  const maxHealth = applyModifiers(
    PLAYER_CONFIG.BASE_HEALTH,
    maxHealthModifiers
  );
  const attackSpeed = applyModifiers(
    PLAYER_CONFIG.BASE_ATTACK_SPEED,
    attackSpeedModifiers
  );
  const critChance = applyModifiers(
    PLAYER_CONFIG.BASE_CRITICAL_CHANCE,
    critChanceModifiers
  );

  return {
    name: "Hero",
    maxHealth: Math.floor(maxHealth),
    currentHealth: Math.floor(maxHealth),
    attackDamage: Math.floor(attackDamage),
    attackSpeed: Number(attackSpeed.toFixed(2)),
    critChance: Math.min(critChance, 100), // Cap at 100%
  };
}

/**
 * Calculate energy bonus multiplier based on upgrades.
 * Returns a multiplier (e.g., 1.2 for +20% bonus)
 */
export function calculateEnergyBonusMultiplier(
  upgradeLevels: Record<UpgradeId, number>
): number {
  const modifiers = getStatModifiers(UpgradeStat.ENERGY_BONUS, upgradeLevels);

  // Energy bonus only uses percentile
  return 1 + modifiers.percentile / 100;
}
