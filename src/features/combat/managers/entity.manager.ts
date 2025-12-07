import type {
  Enemy,
  Player,
  SpawnedEnemy,
  SpawnedPlayer,
} from "../types/combat.types";

export class EntityManager {
  // Spawn an entity at a specific position
  static spawnEnemy(position: 0 | 1 | 2, enemy: Enemy): SpawnedEnemy {
    return {
      ...enemy,
      id: `enemy-${position}-${Date.now()}`,
      position,
    };
  }

  static spawnPlayer(position: 0 | 1 | 2, player: Player): SpawnedPlayer {
    return {
      ...player,
      id: `player-${position}`,
      position,
    };
  }

  // Deal damage to a list of entities with overflow
  static dealDamage<T extends { currentHealth: number; position: number }>(
    entities: T[],
    damage: number,
    onEntityDeath: (entity: T) => void
  ): T[] {
    let remainingDamage = damage;
    const sortedEntities = [...entities].sort(
      (a, b) => a.position - b.position
    );
    const updatedEntities: T[] = [];

    for (const entity of sortedEntities) {
      if (remainingDamage <= 0) {
        updatedEntities.push(entity);
        continue;
      }

      const newHealth = entity.currentHealth - remainingDamage;

      if (newHealth <= 0) {
        remainingDamage = Math.abs(newHealth);
        onEntityDeath(entity);
      } else {
        updatedEntities.push({ ...entity, currentHealth: newHealth });
        remainingDamage = 0;
      }
    }

    // Return entities without repositioning - they keep their original slots
    return updatedEntities;
  }
}
