/**
 * Create Enemy Definition Helper
 *
 * Creates EnemyDefinition objects from base enemy configuration.
 * Applies rarity and type multipliers to calculate base stats.
 *
 * Note: Area and stage difficulty scaling is applied separately
 * when spawning enemies via spawnEnemyFromPool().
 */

import type { EnemyDefinition } from "../../entity/types/entity.types";
import { ENEMY_CONFIG } from "../config/enemy-stats.config";
import type { EnemyRarity, EnemyType } from "../types/enemy.types";

interface CreateEnemyDefinitionParams {
  name: string;
  description: string;
  areaNumber: number;
  rarity: EnemyRarity;
  type: EnemyType;
  icon: string;
  sprite: string;
}

/**
 * Create an EnemyDefinition from configuration parameters.
 * Applies rarity and type multipliers to calculate base stats.
 */
export function createEnemyDefinition({
  name,
  description,
  areaNumber,
  rarity,
  type,
  icon,
  sprite,
}: CreateEnemyDefinitionParams): EnemyDefinition {
  const { BASE, RARITY, TYPE } = ENEMY_CONFIG;

  // Apply rarity multipliers to base stats
  const rarityMod = RARITY[rarity];
  const health = Math.floor(BASE.maxHealth * rarityMod.maxHealth);
  const attackDamage = Math.floor(BASE.attackDamage * rarityMod.attackDamage);
  const energyReward = Math.floor(BASE.energyReward * rarityMod.energyReward);

  // Apply type multipliers
  const typeMod = TYPE[type];
  const totalHealth = Math.floor(health * typeMod.maxHealth);
  const totalAttackDamage = Math.floor(attackDamage * typeMod.attackDamage);
  const totalAttackSpeed = BASE.attackSpeed * typeMod.attackSpeed;
  const totalMeteoriteDropChance = BASE.meteoriteDropChance;

  // Generate stable ID from name
  const id = name.toLowerCase().replace(/\s+/g, "_");

  return {
    id,
    areaNumber,
    rarity,
    type,
    baseStats: {
      name,
      description,
      maxHealth: totalHealth,
      attackDamage: totalAttackDamage,
      attackSpeed: totalAttackSpeed,
      critChance: 0,
      icon,
      sprite,
    },
    lootTable: {
      drops: [
        {
          type: "energy",
          dropChance: 100,
          minAmount: energyReward,
          maxAmount: energyReward,
        },
        {
          type: "meteorite",
          dropChance: totalMeteoriteDropChance,
          minAmount: 1,
          maxAmount: 1,
        },
      ],
    },
    abilities: [], // Can be added per-enemy later
  };
}
