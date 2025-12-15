/**
 * Combat Types
 *
 * Types for combat statistics and loot tables.
 * Note: Entity types are now in features/entity/types/entity.types.ts
 */

export interface CombatStats {
  totalAmountOfEnemiesSlain: number;
  totalAmountOfRareEnemiesSlain: number;
  highestSingleHitDamageDealt: number;
  totalAmountOfPlayerDeaths: number;
}

export interface LootTableItem {
  dropChance: number;
  dropAmount: number;
}
