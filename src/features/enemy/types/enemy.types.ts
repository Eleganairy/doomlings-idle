export interface LootTable {
  energy: number;
  // Expandable for future loot types
}

// export type EnemyRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
// export type EnemyType = "normal" | "strong" | "elite" | "boss";

export interface BaseEnemy {
  areaNumber: number;
  name: string;
  description: string;
  rarity: EnemyRarity;
  type: EnemyType;
}

export interface Enemy extends BaseEnemy {
  health: number;
  currentHealth: number;
  lootTable: LootTable;
  attackDamage: number;
  attackSpeed: number;
  icon: string;
  sprite: string;
}

export enum EnemyRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  LEGENDARY = "LEGENDARY",
}

export enum EnemyType {
  FAST = "FAST",
  STANDARD = "STANDARD",
  STRONG = "STRONG",
  TANK = "TANK",
}
