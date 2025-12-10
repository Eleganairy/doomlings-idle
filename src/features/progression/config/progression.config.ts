import {
  TrackedStatType,
  type Trait,
  TraitId,
  type Upgrade,
  UpgradeId,
  UpgradeIncrementType,
  UpgradeStat,
} from "../types/progression.types";

// ===== BASE UPGRADES (Always Unlocked) =====

export const BASE_UPGRADES: Upgrade[] = [
  {
    id: UpgradeId.ATTACK_DAMAGE,
    name: "Attack Damage",
    description: "Increase your attack damage",
    icon: "⚔️",
    upgradedStat: UpgradeStat.ATTACK_DAMAGE,
    incrementType: UpgradeIncrementType.ADDITIVE,
    baseCost: 3,
    costMultiplier: 1.4,
    baseValue: 1,
    valueMultiplier: 1.3,
    maxLevel: 100,
  },
  {
    id: UpgradeId.HEALTH,
    name: "Health",
    description: "Increase your maximum health",
    icon: "❤️",
    upgradedStat: UpgradeStat.MAX_HEALTH,
    incrementType: UpgradeIncrementType.ADDITIVE,
    baseCost: 5,
    costMultiplier: 1.4,
    baseValue: 3,
    valueMultiplier: 1.3,
    maxLevel: 100,
  },
];

// ===== TRAIT-LOCKED UPGRADES =====

export const TRAIT_UPGRADES: Upgrade[] = [
  {
    id: UpgradeId.SPIKY,
    name: "Spiky",
    description: "Increase attack damage by percentage",
    icon: "🦔",
    upgradedStat: UpgradeStat.ATTACK_DAMAGE,
    incrementType: UpgradeIncrementType.PERCENTILE,
    baseCost: 20,
    costMultiplier: 1.6,
    baseValue: 20, // +20%
    valueMultiplier: 1.0, // No value scaling
    maxLevel: 10,
    unlockedByTrait: TraitId.SPIKY,
  },
  {
    id: UpgradeId.FUR,
    name: "Fur",
    description: "Increase attack speed by percentage",
    icon: "🦊",
    upgradedStat: UpgradeStat.ATTACK_SPEED,
    incrementType: UpgradeIncrementType.PERCENTILE,
    baseCost: 50,
    costMultiplier: 1.8,
    baseValue: 10, // +10%
    valueMultiplier: 1.0,
    maxLevel: 5,
    unlockedByTrait: TraitId.FUR,
  },
  {
    id: UpgradeId.MUSCLES,
    name: "Muscles",
    description: "Increase critical hit chance",
    icon: "💪",
    upgradedStat: UpgradeStat.CRIT_CHANCE,
    incrementType: UpgradeIncrementType.PERCENTILE,
    baseCost: 50,
    costMultiplier: 1.3,
    baseValue: 2, // +2%
    valueMultiplier: 1.0,
    maxLevel: 10,
    unlockedByTrait: TraitId.MUSCLES,
  },
  {
    id: UpgradeId.THICKER_SKIN,
    name: "Thicker Skin",
    description: "Multiply your maximum health",
    icon: "🛡️",
    upgradedStat: UpgradeStat.MAX_HEALTH,
    incrementType: UpgradeIncrementType.MULTIPLICATIVE,
    baseCost: 100,
    costMultiplier: 1.8,
    baseValue: 1.2, // ×1.2
    valueMultiplier: 1.0,
    maxLevel: 5,
    unlockedByTrait: TraitId.THICKER_SKIN,
  },
  {
    id: UpgradeId.WARM_BLOODED,
    name: "Warm Blooded",
    description: "Increase energy gained from enemies",
    icon: "🔥",
    upgradedStat: UpgradeStat.ENERGY_BONUS,
    incrementType: UpgradeIncrementType.PERCENTILE,
    baseCost: 150,
    costMultiplier: 1.7,
    baseValue: 10, // +10%
    valueMultiplier: 1.0,
    maxLevel: 10,
    unlockedByTrait: TraitId.WARM_BLOODED,
  },
];

// ===== ALL UPGRADES =====

export const ALL_UPGRADES: Upgrade[] = [...BASE_UPGRADES, ...TRAIT_UPGRADES];

// ===== TRAITS =====

export const TRAITS: Trait[] = [
  // Tier 1
  {
    id: TraitId.SPIKY,
    name: "Spiky",
    description: "Slay a total of 50 enemies",
    icon: "🦔",
    tier: 1,
    trackedStat: TrackedStatType.TOTAL_ENEMIES_KILLED,
    goalValue: 50,
    linkedUpgrade: UpgradeId.SPIKY,
  },
  {
    id: TraitId.FUR,
    name: "Fur",
    description: "Slay 30 Red Fox enemies",
    icon: "🦊",
    tier: 1,
    trackedStat: TrackedStatType.SPECIFIC_ENEMY_KILLED,
    trackedEnemyName: "Red fox",
    goalValue: 30,
    linkedUpgrade: UpgradeId.FUR,
  },
  {
    id: TraitId.MUSCLES,
    name: "Generate Muscles",
    description: "Deal 20 damage in a single hit",
    icon: "💪",
    tier: 1,
    trackedStat: TrackedStatType.HIGHEST_SINGLE_HIT,
    goalValue: 20,
    linkedUpgrade: UpgradeId.MUSCLES,
  },
  {
    id: TraitId.THICKER_SKIN,
    name: "Thicker Skin",
    description: "Take a total of 500 damage",
    icon: "🛡️",
    tier: 1,
    trackedStat: TrackedStatType.TOTAL_DAMAGE_TAKEN,
    goalValue: 500,
    linkedUpgrade: UpgradeId.THICKER_SKIN,
  },
  {
    id: TraitId.WARM_BLOODED,
    name: "Warm Blooded",
    description: "Gain a total of 200 energy",
    icon: "🔥",
    tier: 1,
    trackedStat: TrackedStatType.TOTAL_ENERGY_GAINED,
    goalValue: 200,
    linkedUpgrade: UpgradeId.WARM_BLOODED,
  },
];

// ===== HELPERS =====

/** Get all traits for a specific tier */
export function getTraitsByTier(tier: number): Trait[] {
  return TRAITS.filter((t) => t.tier === tier);
}

/** Get an upgrade by ID */
export function getUpgradeById(id: UpgradeId): Upgrade | undefined {
  return ALL_UPGRADES.find((u) => u.id === id);
}

/** Get a trait by ID */
export function getTraitById(id: TraitId): Trait | undefined {
  return TRAITS.find((t) => t.id === id);
}
