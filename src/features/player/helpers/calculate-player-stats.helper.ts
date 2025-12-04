import { UpgradeId } from "../../progression/config/progression-list.config";
import type { Upgrade } from "../../progression/types/progression.types";
import { PLAYER_CONFIG } from "../config/player-stats.config";
import type { Player } from "../types/player.types";

export function calculatePlayerStats(upgrades: Upgrade[]): Player {
  let health = PLAYER_CONFIG.BASE_HEALTH;
  let attackDamage = PLAYER_CONFIG.BASE_ATTACK_DAMAGE;
  let attackSpeed = PLAYER_CONFIG.BASE_ATTACK_SPEED;
  let criticalChance = PLAYER_CONFIG.BASE_CRITICAL_CHANCE;

  for (const upgrade of upgrades) {
    if (upgrade.level === 0) continue;

    const totalValue = upgrade.value * upgrade.level;

    switch (upgrade.id) {
      case UpgradeId.HEALTH:
        health += totalValue;
        break;

      case UpgradeId.ATTACK_DAMAGE:
        attackDamage += totalValue;
        break;

      case UpgradeId.ATTACK_SPEED:
        // Percentage increase
        attackSpeed += (attackSpeed * totalValue) / 100;
        break;

      case UpgradeId.SLAYER_INSTINCT:
        // Multiplicative damage bonus
        attackDamage *= 1 + totalValue;
        break;

      case UpgradeId.CRITICAL_STRIKE:
        criticalChance += totalValue;
        break;
    }
  }

  return {
    totalHealth: Math.floor(health),
    currentHealth: Math.floor(health),
    totalAttackDamage: Math.floor(attackDamage),
    totalAttackSpeed: Number(attackSpeed.toFixed(2)),
    totalCritChange: Math.min(criticalChance, 1), // Cap at 100%
  };
}
