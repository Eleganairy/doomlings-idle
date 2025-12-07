// ===== ENUMS =====

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
  ENERGY_BONUS = "ENERGY_BONUS",
}

// ===== ID ENUMS =====

export enum TraitId {
  // Tier 1
  SPIKY = "SPIKY",
  FUR = "FUR",
  MUSCLES = "MUSCLES",
  THICKER_SKIN = "THICKER_SKIN",
  WARM_BLOODED = "WARM_BLOODED",
}

export enum UpgradeId {
  // Base upgrades (always unlocked)
  ATTACK_DAMAGE = "ATTACK_DAMAGE",
  HEALTH = "HEALTH",
  // Trait-locked upgrades
  SPIKY = "SPIKY",
  FUR = "FUR",
  MUSCLES = "MUSCLES",
  THICKER_SKIN = "THICKER_SKIN",
  WARM_BLOODED = "WARM_BLOODED",
}

// ===== INTERFACES =====

/** A trait that tracks player progress and unlocks upgrades */
export interface Trait {
  id: TraitId;
  name: string;
  description: string;
  icon: string;
  tier: number; // 1-10
  trackedStat: TrackedStatType;
  trackedEnemyName?: string; // Only for SPECIFIC_ENEMY_KILLED
  goalValue: number;
  linkedUpgrade?: UpgradeId;
}

/** An upgrade that modifies player stats */
export interface Upgrade {
  id: UpgradeId;
  name: string;
  description: string;
  icon: string;
  upgradedStat: UpgradeStat;
  incrementType: UpgradeIncrementType;
  baseCost: number;
  costMultiplier: number;
  baseValue: number;
  valueMultiplier: number; // 1.0 if no scaling
  maxLevel: number;
  unlockedByTrait?: TraitId; // undefined = always unlocked
}

/** Persistent stats tracked for trait progression */
export interface PlayerTrackedStats {
  totalEnemiesKilled: number;
  enemyKillsByName: Record<string, number>;
  highestSingleHitDamage: number;
  totalDamageTaken: number;
  totalEnergyGained: number;
}
