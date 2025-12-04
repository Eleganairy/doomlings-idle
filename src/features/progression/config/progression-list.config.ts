import {
  TraitRequirementType,
  type Trait,
  type Upgrade,
} from "../types/progression.types";

export enum UpgradeId {
  HEALTH = "HEALTH",
  ATTACK_DAMAGE = "ATTACK_DAMAGE",
  ATTACK_SPEED = "ATTACK_SPEED",
  ENERGY_EFFICIENCY = "ENERGY_EFFICIENCY",
  SLAYER_INSTINCT = "SLAYER_INSTINCT",
  CRITICAL_STRIKE = "CRITICAL_STRIKE",
}

export enum UpgradeStat {
  HEALTH = "HEALTH",
  ATTACK_DAMAGE = "ATTACK_DAMAGE",
  ATTACK_SPEED = "ATTACK_SPEED",
  CRITICAL_STRIKE_CHANCE = "CRITICAL_STRIKE",
}

export enum TraitId {
  ENERGY_NOVICE = "ENERGY_NOVICE",
  MONSTER_SLAYER = "MONSTER_SLAYER",
  HEAVY_HITTER = "HEAVY_HITTER",
}

export const UPGRADES: Upgrade[] = [
  // Base upgrades (always unlocked)
  {
    id: UpgradeId.HEALTH,
    upgradedStat: UpgradeStat.HEALTH,
    name: "Health Boost",
    description: "Increase your maximum health by 20",
    icon: "../../../health.png",
    cost: 10,
    costMultiplier: 1.15,
    value: 20,
    maxLevel: 100,
    level: 0,
    isLocked: false,
  },
  {
    id: UpgradeId.ATTACK_DAMAGE,
    upgradedStat: UpgradeStat.ATTACK_DAMAGE,
    name: "Sharper Strikes",
    description: "Increase your attack damage by 3",
    icon: "../../../sword.png",
    cost: 5,
    costMultiplier: 2.5,
    value: 3,
    maxLevel: 100,
    level: 0,
    isLocked: false,
  },
  {
    id: UpgradeId.ATTACK_SPEED,
    upgradedStat: UpgradeStat.ATTACK_SPEED,
    name: "Swift Reflexes",
    description: "Increase attack speed by 20%",
    icon: "../../../speed.png",
    cost: 10,
    costMultiplier: 2,
    value: 20, // 20% per level
    maxLevel: 10,
    level: 0,
    isLocked: false,
  },

  // Trait-locked upgrades
  {
    id: UpgradeId.ENERGY_EFFICIENCY,
    upgradedStat: UpgradeStat.ATTACK_DAMAGE,
    name: "Energy Conservation",
    description: "Reduce all upgrade costs by 10%",
    icon: "../../../icons/energy_efficiency.png",
    cost: 50,
    costMultiplier: 1.2,
    value: 0.1,
    maxLevel: 10,
    level: 0,
    isLocked: true,
    unlockedBy: TraitId.ENERGY_NOVICE,
  },
  {
    id: UpgradeId.SLAYER_INSTINCT,
    upgradedStat: UpgradeStat.HEALTH,
    name: "Slayer's Fury",
    description: "Increase all damage by 10%",
    icon: "../../../icons/slayer_instinct.png",
    cost: 100,
    costMultiplier: 1.25,
    value: 0.1,
    maxLevel: 10,
    level: 0,
    isLocked: true,
    unlockedBy: TraitId.MONSTER_SLAYER,
  },
  {
    id: UpgradeId.CRITICAL_STRIKE,
    upgradedStat: UpgradeStat.ATTACK_SPEED,
    name: "Critical Edge",
    description: "Add 5% critical strike chance",
    icon: "../../../icons/critical_strike.png",
    cost: 75,
    costMultiplier: 1.2,
    value: 0.05,
    maxLevel: 20,
    level: 0,
    isLocked: true,
    unlockedBy: TraitId.HEAVY_HITTER,
  },
];

export const TRAITS: Trait[] = [
  {
    id: TraitId.ENERGY_NOVICE,
    name: "Energy Novice",
    description: "Spend 100 total energy on upgrades",
    icon: "../../../icons/energy_novice.png",
    unlocks: UpgradeId.ENERGY_EFFICIENCY,
    requirement: {
      type: TraitRequirementType.ENERGY_SPENT,
      target: 100,
    },
    isCompleted: false,
  },
  {
    id: TraitId.MONSTER_SLAYER,
    name: "Monster Slayer",
    description: "Kill 100 total enemies",
    icon: "../../../icons/slayer.png",
    unlocks: UpgradeId.SLAYER_INSTINCT,
    requirement: {
      type: TraitRequirementType.ENEMIES_KILLED,
      target: 100,
    },
    isCompleted: false,
  },
  {
    id: TraitId.HEAVY_HITTER,
    name: "Heavy Hitter",
    description: "Deal 10 or more damage in a single hit",
    icon: "../../../icons/heavy_hitter.png",
    unlocks: UpgradeId.CRITICAL_STRIKE,
    requirement: {
      type: TraitRequirementType.DAMAGE_DEALT,
      target: 10,
    },
    isCompleted: false,
  },
];
