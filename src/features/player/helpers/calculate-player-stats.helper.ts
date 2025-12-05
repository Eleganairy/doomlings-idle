import type { Entity } from "../../combat/types/combat.types";
import { UpgradeStat } from "../../progression/config/progression-list.config";
import type { Upgrade } from "../../progression/types/progression.types";
import { PLAYER_CONFIG } from "../config/player-stats.config";

export function calculatePlayerStats(upgrades: Upgrade[]): Entity {
  let health = PLAYER_CONFIG.BASE_HEALTH;
  let attackDamage = PLAYER_CONFIG.BASE_ATTACK_DAMAGE;
  let attackSpeed = PLAYER_CONFIG.BASE_ATTACK_SPEED;
  let criticalChance = PLAYER_CONFIG.BASE_CRITICAL_CHANCE;

  for (const upgrade of upgrades) {
    if (upgrade.level === 0) continue;

    const totalValue = upgrade.value * upgrade.level;

    switch (upgrade.upgradedStat) {
      case UpgradeStat.HEALTH:
        health += totalValue;
        break;

      case UpgradeStat.ATTACK_DAMAGE:
        attackDamage += totalValue;
        break;

      case UpgradeStat.ATTACK_SPEED:
        // Percentage increase
        attackSpeed += (attackSpeed * totalValue) / 100;
        break;

      case UpgradeStat.CRITICAL_STRIKE_CHANCE:
        // Multiplicative damage bonus
        criticalChance *= 1 + totalValue;
        break;
    }
  }

  return {
    name: "Hero",
    maxHealth: Math.floor(health),
    currentHealth: Math.floor(health),
    attackDamage: Math.floor(attackDamage),
    attackSpeed: Number(attackSpeed.toFixed(2)),
    critChance: Math.min(criticalChance, 1), // Cap at 100%
  };
}
