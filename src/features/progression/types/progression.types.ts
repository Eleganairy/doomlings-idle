// ===== ENUMS =====

import type { BigNumber } from "../../../utils/big-number.utils";

/** Types of stats that can be tracked for trait progression */
export enum TrackedStatType {
  TOTAL_ENEMIES_KILLED = "TOTAL_ENEMIES_KILLED",
  SPECIFIC_ENEMY_KILLED = "SPECIFIC_ENEMY_KILLED",
  HIGHEST_SINGLE_HIT = "HIGHEST_SINGLE_HIT",
  TOTAL_DAMAGE_TAKEN = "TOTAL_DAMAGE_TAKEN",
  TOTAL_ENERGY_GAINED = "TOTAL_ENERGY_GAINED",
}

/** How an upgrade modifies a stat */
export enum UpgradeIncrementType {
  ADDITIVE = "ADDITIVE", // +5
  MULTIPLICATIVE = "MULTIPLICATIVE", // ×1.5
  PERCENTILE = "PERCENTILE", // +20%
}

/** Stats that can be upgraded */
export enum UpgradeStat {
  ATTACK_DAMAGE = "ATTACK_DAMAGE",
  MAX_HEALTH = "MAX_HEALTH",
  ATTACK_SPEED = "ATTACK_SPEED",
  CRIT_CHANCE = "CRIT_CHANCE",
  SHIELD = "SHIELD",
  ENERGY_BONUS = "ENERGY_BONUS",
}

// ===== ID ENUMS =====

export enum ProgressionId {
  // Base upgrades (always unlocked)
  ATTACK_DAMAGE = "ATTACK_DAMAGE",
  HEALTH = "HEALTH",
  // Tier 1
  SPIKY = "SPIKY",
  SLIMY = "SLIMY",
  TEETHY = "TEETHY",
  FLUFFY = "FLUFFY",
  THICKER_SKIN = "THICKER_SKIN",
  WARM_BLOODED = "WARM_BLOODED",
  // Tier 2
  CHEESY = "CHEESY",
  METAL_SHELLED = "METAL_SHELLED",
  MORE_TEETH = "MORE_TEETH",
  TAIL = "TAIL",
  MUDDY = "MUDDY",
  BETTER_VISION = "BETTER_VISION",
  // Tier 3 TODO
}

/**
 * Specifies which entity type an upgrade targets.
 * - PLAYER: Upgrade applies as a buff to player entities
 * - ENEMY: Upgrade applies as a debuff to enemy entities
 */
export enum UpgradeTarget {
  PLAYER = "PLAYER",
  ENEMY = "ENEMY",
}

// ===== INTERFACES =====

/** A trait that tracks player progress and unlocks upgrades */
export interface Trait {
  id: ProgressionId;
  name: string;
  description: string;
  icon: string;
  tier: number; // 1-10
  trackedStat: TrackedStatType;
  trackedEnemyName?: string; // Only for SPECIFIC_ENEMY_KILLED
  goalValue: BigNumber;
  linkedUpgrade?: ProgressionId;
}

/** An upgrade that modifies entity stats via the buff system */
export interface Upgrade {
  id: ProgressionId;
  name: string;
  description: string;
  icon: string;
  /** Which entity type this upgrade targets (PLAYER buff or ENEMY debuff) */
  upgradeTarget: UpgradeTarget;
  upgradedStat: UpgradeStat;
  incrementType: UpgradeIncrementType;
  baseCost: number;
  costMultiplier: number;
  baseValue: number;
  valueMultiplier: number; // 1.0 if no scaling
  maxLevel: number;
  unlockedByTrait?: ProgressionId; // undefined = always unlocked
}

/** Persistent stats tracked for trait progression */
export interface PlayerTrackedStats {
  totalEnemiesKilled: number;
  enemyKillsByName: Record<string, number>;
  highestSingleHitDamage: number;
  totalDamageTaken: number;
  totalEnergyGained: number;
}
