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

export interface Entity {
  name: string;
  attackDamage: number;
  attackSpeed: number;
  critChance: number;
  maxHealth: number;
  currentHealth: number;
  icon: string;
  sprite: string;
}

export interface Player extends Entity {
  shield: number;
}

export interface SpawnedPlayer extends Player {
  id: string;
  position: 0 | 1 | 2;
}

export interface Enemy extends Entity {
  description: string;
  areaNumber: number;
  rarity: string;
  type: string;
  lootTable: {
    energy: LootTableItem;
    meteorite: LootTableItem;
  };
}

export interface SpawnedEnemy extends Enemy {
  id: string;
  position: 0 | 1 | 2;
}
