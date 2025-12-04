import type { UpgradeId, UpgradeStat } from "../config/progression-list.config";

export interface Upgrade {
  id: UpgradeId;
  upgradedStat: UpgradeStat;
  name: string;
  description: string;
  icon: string;
  cost: number;
  costMultiplier: number;
  value: number; // The stat increase per level
  maxLevel: number;
  level: number; // Current level
  isLocked: boolean;
  unlockedBy?: string; // Trait ID that unlocks this
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocks: UpgradeId; // Upgrade ID this trait unlocks
  requirement: TraitRequirement;
  isCompleted: boolean;
}

export interface TraitRequirement {
  type: TraitRequirementType;
  target: number;
}

export enum TraitRequirementType {
  ENERGY_SPENT = "ENERGY_SPENT",
  ENEMIES_KILLED = "ENEMIES_KILLED",
  RARE_ENEMIES_KILLED = "RARE_ENEMIES_KILLED",
  DAMAGE_DEALT = "DAMAGE_DEALT",
}
