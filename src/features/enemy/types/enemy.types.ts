export interface LootTable {
  energy: number;
  // Expandable for future loot types
}

export interface BaseEnemy {
  areaNumber: number;
  name: string;
  description: string;
  rarity: EnemyRarity;
  type: EnemyType;
  sprite: string;
}

export enum EnemyRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
}

export enum EnemyType {
  FAST = "FAST",
  STANDARD = "STANDARD",
  STRONG = "STRONG",
  TANK = "TANK",
}
