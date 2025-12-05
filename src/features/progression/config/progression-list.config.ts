import {
  TraitRequirementType,
  type Trait,
  type Upgrade,
} from "../types/progression.types";

export enum UpgradeId {
  HEALTH = "HEALTH",
  ATTACK_DAMAGE = "ATTACK_DAMAGE",
  THICKER_MEMBRANE = "THICKER_MEMBRANE",
  BIGGER_BLOB = "BIGGER_BLOB",
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
    cost: 5,
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

  // Trait-locked upgrades
  {
    id: UpgradeId.THICKER_MEMBRANE,
    upgradedStat: UpgradeStat.HEALTH,
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
    id: UpgradeId.BIGGER_BLOB,
    upgradedStat: UpgradeStat.ATTACK_DAMAGE,
    name: "Bigger Blob",
    description: "Increase hp by 5",
    icon: "../../../icons/slayer_instinct.png",
    cost: 100,
    costMultiplier: 1.25,
    value: 0.1,
    maxLevel: 10,
    level: 0,
    isLocked: true,
    unlockedBy: TraitId.MONSTER_SLAYER,
  },
];

export const TRAITS: Trait[] = [
  {
    id: TraitId.ENERGY_NOVICE,
    name: "Energy Novice",
    description: "Spend 100 total energy on upgrades",
    icon: "../../../icons/energy_novice.png",
    unlocks: UpgradeId.BIGGER_BLOB,
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
    unlocks: UpgradeId.THICKER_MEMBRANE,
    requirement: {
      type: TraitRequirementType.ENEMIES_KILLED,
      target: 100,
    },
    isCompleted: false,
  },
];
