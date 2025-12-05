import type { Enemy } from "../../combat/types/combat.types";
import { ENEMY_CONFIG } from "../config/enemy-stats.config";
import type { BaseEnemy } from "../types/enemy.types";

export function calculateEnemyStats({
  name,
  description,
  areaNumber,
  rarity,
  type,
}: BaseEnemy): Enemy {
  const { BASE, AREA_SCALING, RARITY, TYPE } = ENEMY_CONFIG;

  // Calculate area-scaled base stats
  const areaHealth =
    BASE.maxHealth * AREA_SCALING.maxHealth ** (areaNumber - 1);
  const areaDamage =
    BASE.attackDamage * AREA_SCALING.attackDamage ** (areaNumber - 1);
  const areaSpeed =
    BASE.attackSpeed * AREA_SCALING.attackSpeed ** (areaNumber - 1);
  const areaReward =
    BASE.currencyReward * AREA_SCALING.currencyReward ** (areaNumber - 1);

  // Add the rarity multipliers
  const rarityMod = RARITY[rarity];
  const health = Math.floor(areaHealth * rarityMod.maxHealth);
  const attackDamage = Math.floor(areaDamage * rarityMod.attackDamage);
  const loot = { energy: Math.floor(areaReward * rarityMod.currencyReward) };

  // Add the type multipliers
  const typeMod = TYPE[type];
  const totalHealth = Math.floor(health * typeMod.maxHealth);
  const totalAttackDamage = Math.floor(attackDamage * typeMod.attackDamage);
  const totalAttackSpeed = Math.floor(areaSpeed * typeMod.attackSpeed);

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
    lootTable: loot,
    icon: `../../../enemies/icons/${modifiedName}_icon.png`,
    sprite: `../../../enemies/sprites/${modifiedName}_sprite.png`,
    rarity,
    type,
  };
}
