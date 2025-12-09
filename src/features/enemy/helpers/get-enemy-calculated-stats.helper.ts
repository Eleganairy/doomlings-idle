import type { Enemy } from "../../combat/types/combat.types";
import { ENEMY_CONFIG } from "../config/enemy-stats.config";

export interface worldMultipliers {
  health: number;
  attackDamage: number;
  attackSpeed: number;
  energyReward: number;
  meteoriteReward: number;
  specificAreaReward: number;
}

export const getEnemyCalculationMultipliers = (
  areaNumber: number,
  stageNumber: number
): worldMultipliers => {
  const { AREA_SCALING } = ENEMY_CONFIG;

  // Each area is 5 stages, so if you are at area 3 and stage 2 = (3-1)*5 + 2 = 12 total stages completed
  // Total -1 for calculating the power
  const currentStageNumber = (areaNumber - 1) * 5 + stageNumber - 1;

  return {
    health: AREA_SCALING.health ** currentStageNumber,
    attackDamage: AREA_SCALING.attackDamage ** currentStageNumber,
    attackSpeed: AREA_SCALING.attackSpeed * currentStageNumber, // Attack speed increases linear
    energyReward: AREA_SCALING.energyReward ** currentStageNumber,
    meteoriteReward: AREA_SCALING.meteoriteReward ** currentStageNumber,
    specificAreaReward: AREA_SCALING.specificAreaReward ** currentStageNumber,
  };
};

export const getEnemyCalculatedStats = (
  enemy: Enemy,
  multipliers: worldMultipliers
): Enemy => {
  return {
    ...enemy,
    maxHealth: Math.floor(enemy.maxHealth * multipliers.health),
    currentHealth: Math.floor(enemy.maxHealth * multipliers.health),
    attackDamage: Math.floor(enemy.attackDamage * multipliers.attackDamage),
    attackSpeed: enemy.attackSpeed + multipliers.attackSpeed,
    lootTable: {
      energy: {
        dropChance: enemy.lootTable.energy.dropChance,
        dropAmount: Math.floor(
          enemy.lootTable.energy.dropAmount * multipliers.energyReward
        ),
      },
      meteorite: {
        dropChance: enemy.lootTable.meteorite.dropChance,
        dropAmount:
          enemy.lootTable.meteorite.dropAmount * multipliers.meteoriteReward,
      },
    },
  };
};
