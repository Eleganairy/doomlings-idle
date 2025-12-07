import type { Enemy } from "../../combat/types/combat.types";
import { ENEMY_CONFIG } from "../config/enemy-stats.config";
import type { BaseEnemy } from "../types/enemy.types";

/**
 * Calculate base enemy stats with rarity and type multipliers
 *
 * Note: Area and stage difficulty scaling is applied separately by
 * the difficulty multiplier system in getRandomEnemy()
 */
export function calculateEnemyStats({
  name,
  description,
  areaNumber,
  rarity,
  type,
  sprite,
}: BaseEnemy): Enemy {
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
  const totalEnergyReward = energyReward; // Type doesn't affect rewards

  const modifiedName = name.toLowerCase().replace(/\s+/g, "_");

  return {
    name,
    description,
    areaNumber,
    maxHealth: totalHealth,
    currentHealth: totalHealth,
    attackDamage: totalAttackDamage,
    attackSpeed: totalAttackSpeed,
    critChance: 0,
    lootTable: { energy: totalEnergyReward },
    icon: `../../../enemies/icons/${modifiedName}_icon.png`,
    sprite,
    rarity,
    type,
  };
}
