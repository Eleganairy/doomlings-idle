import { ENEMY_CONFIG } from "../config/enemy-stats.config";
import type { BaseEnemy, Enemy } from "../types/enemy.types";

export function calculateEnemyStats({
  name,
  description,
  areaNumber,
  rarity,
  type,
}: BaseEnemy): Enemy {
  const { BASE, AREA_SCALING, RARITY, TYPE } = ENEMY_CONFIG;

  // Calculate area-scaled base stats
  const areaHealth = BASE.health * AREA_SCALING.health ** (areaNumber - 1);
  const areaDamage =
    BASE.attackDamage * AREA_SCALING.attackDamage ** (areaNumber - 1);
  const areaSpeed =
    BASE.attackSpeed * AREA_SCALING.attackSpeed ** (areaNumber - 1);
  const areaReward =
    BASE.currencyReward * AREA_SCALING.currencyReward ** (areaNumber - 1);

  // Add the rarity multipliers
  const rarityMod = RARITY[rarity];
  const health = Math.floor(areaHealth * rarityMod.health);
  const attackDamage = Math.floor(areaDamage * rarityMod.attackDamage);
  const loot = { energy: Math.floor(areaReward * rarityMod.currencyReward) };

  // Add the type multipliers
  const typeMod = TYPE[type];
  const finalHealth = Math.floor(health * typeMod.health);
  const finalDamage = Math.floor(attackDamage * typeMod.attackDamage);
  const finalSpeed = Math.floor(areaSpeed * typeMod.attackSpeed);

  const modifiedName = name.toLowerCase().replace(/\s+/g, "_");

  return {
    name,
    description,
    areaNumber,
    health: finalHealth,
    currentHealth: finalHealth,
    attackDamage: finalDamage,
    attackSpeed: finalSpeed,
    lootTable: loot,
    icon: `../../../enemies/icons/${modifiedName}_icon.png`,
    sprite: `../../../enemies/sprites/${modifiedName}_sprite.png`,
    rarity,
    type,
  };
}
