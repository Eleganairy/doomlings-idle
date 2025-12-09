export interface BaseEnemy {
  areaNumber: number;
  name: string;
  description: string;
  rarity: EnemyRarity;
  type: EnemyType;
  sprite: string;
  icon: string;
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
