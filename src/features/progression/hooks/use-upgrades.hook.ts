import { useAtom, useAtomValue } from "jotai";
import { playerEnergyAtom } from "../../combat/store/combat.atoms";
import { ALL_UPGRADES } from "../config/progression.config";
import {
  upgradeLevelsAtom,
  unlockedUpgradesAtom,
} from "../store/progression.atoms";
import { type Upgrade, UpgradeId } from "../types/progression.types";

// ===== FORMULA HELPERS =====

/**
 * Calculate the cost of an upgrade at a given level.
 * Formula: baseCost × costMultiplier^level
 */
export function getUpgradeCost(upgrade: Upgrade, level: number): number {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
}

/**
 * Calculate the value of an upgrade at a given level.
 * Formula: baseValue × valueMultiplier^level
 */
export function getUpgradeValue(upgrade: Upgrade, level: number): number {
  if (upgrade.valueMultiplier === 1.0) {
    return upgrade.baseValue; // No scaling
  }
  return Math.floor(
    upgrade.baseValue * Math.pow(upgrade.valueMultiplier, level)
  );
}

/**
 * Calculate the total accumulated value for an upgrade at a given level.
 * For additive upgrades: sum of values from level 0 to level-1
 */
export function getTotalUpgradeValue(upgrade: Upgrade, level: number): number {
  if (level === 0) return 0;

  // For multipliers, we need different logic
  if (upgrade.valueMultiplier === 1.0) {
    return upgrade.baseValue * level;
  }

  // Sum up values for each level
  let total = 0;
  for (let i = 0; i < level; i++) {
    total += getUpgradeValue(upgrade, i);
  }
  return total;
}

// ===== HOOK =====

export const useUpgrades = () => {
  const [upgradeLevels, setUpgradeLevels] = useAtom(upgradeLevelsAtom);
  const [playerEnergy, setPlayerEnergy] = useAtom(playerEnergyAtom);
  const unlockedUpgrades = useAtomValue(unlockedUpgradesAtom);

  /**
   * Get an upgrade's current level
   */
  const getLevel = (upgradeId: UpgradeId): number => {
    return upgradeLevels[upgradeId] ?? 0;
  };

  /**
   * Get an upgrade's current cost (at current level)
   */
  const getCurrentCost = (upgrade: Upgrade): number => {
    const level = getLevel(upgrade.id);
    return getUpgradeCost(upgrade, level);
  };

  /**
   * Get an upgrade's current value (at current level)
   */
  const getCurrentValue = (upgrade: Upgrade): number => {
    const level = getLevel(upgrade.id);
    return getUpgradeValue(upgrade, level);
  };

  /**
   * Get the next level's value after upgrading
   */
  const getNextValue = (upgrade: Upgrade): number => {
    const level = getLevel(upgrade.id);
    return getUpgradeValue(upgrade, level + 1);
  };

  /**
   * Check if player can afford an upgrade
   */
  const canAfford = (upgrade: Upgrade): boolean => {
    const cost = getCurrentCost(upgrade);
    return playerEnergy >= cost;
  };

  /**
   * Check if upgrade is at max level
   */
  const isMaxLevel = (upgrade: Upgrade): boolean => {
    const level = getLevel(upgrade.id);
    return level >= upgrade.maxLevel;
  };

  /**
   * Check if upgrade is unlocked
   */
  const isUnlocked = (upgradeId: UpgradeId): boolean => {
    return unlockedUpgrades.some((u) => u.id === upgradeId);
  };

  /**
   * Purchase an upgrade
   */
  const purchaseUpgrade = (upgradeId: UpgradeId): boolean => {
    const upgrade = ALL_UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) return false;

    if (!isUnlocked(upgradeId)) return false;
    if (isMaxLevel(upgrade)) return false;
    if (!canAfford(upgrade)) return false;

    const cost = getCurrentCost(upgrade);

    // Deduct energy
    setPlayerEnergy((prev) => prev - cost);

    // Increment level
    setUpgradeLevels((prev) => ({
      ...prev,
      [upgradeId]: (prev[upgradeId] ?? 0) + 1,
    }));

    return true;
  };

  /**
   * Get the total accumulated value for an upgrade at current level
   */
  const getTotalValue = (upgrade: Upgrade): number => {
    const level = getLevel(upgrade.id);
    return getTotalUpgradeValue(upgrade, level);
  };

  /**
   * Get the total accumulated value after purchasing the next upgrade
   */
  const getTotalValueAfterUpgrade = (upgrade: Upgrade): number => {
    const level = getLevel(upgrade.id);
    return getTotalUpgradeValue(upgrade, level + 1);
  };

  return {
    upgradeLevels,
    unlockedUpgrades,
    playerEnergy,
    getLevel,
    getCurrentCost,
    getCurrentValue,
    getNextValue,
    getTotalValue,
    getTotalValueAfterUpgrade,
    canAfford,
    isMaxLevel,
    isUnlocked,
    purchaseUpgrade,
  };
};
