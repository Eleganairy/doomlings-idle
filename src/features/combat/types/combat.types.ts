export interface CombatStats {
  totalAmountOfEnemiesSlain: number;
  totalAmountOfRareEnemiesSlain: number;
  highestSingleHitDamageDealt: number;
  totalAmountOfPlayerDeaths: number;
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
  // Additional player-specific properties can be added here
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
    energy: number;
    // Expandable for future loot types
  };
}

export interface SpawnedEnemy extends Enemy {
  id: string;
  position: 0 | 1 | 2;
}
