import { Entity } from "../../entity/entity.class";
import type {
  PlayerDefinition,
  EnemyDefinition,
  BossDefinition,
  SpawnPosition,
} from "../../entity/types/entity.types";
import { getHelperDefinition } from "../../entity/config/helper-definitions.config";
import { spawnPositionToPosition } from "../../entity/helpers/execute-ability.helper";

// ====================================================================================
// ENTITY MANAGER CLASS
// ====================================================================================

export class EntityManager {
  // ==================================================================================
  // ENTITY SPAWNING METHODS
  // ==================================================================================

  /**
   * Spawn a player entity
   */
  static spawnPlayerEntity(
    definition: PlayerDefinition,
    position: 0 | 1 | 2
  ): Entity {
    return Entity.createPlayer(definition, position);
  }

  /**
   * Spawn an enemy entity
   */
  static spawnEnemyEntity(
    definition: EnemyDefinition,
    position: 0 | 1 | 2
  ): Entity {
    return Entity.createEnemy(definition, position);
  }

  /**
   * Spawn a boss entity
   */
  static spawnBossEntity(
    definition: BossDefinition,
    position: 0 | 1 | 2
  ): Entity {
    return Entity.createBoss(definition, position);
  }

  /**
   * Spawn a helper entity
   */
  static spawnHelperEntity(
    definitionId: string,
    spawnPosition: SpawnPosition
  ): Entity | null {
    const definition = getHelperDefinition(definitionId);
    if (!definition) {
      console.warn(`Helper definition not found: ${definitionId}`);
      return null;
    }
    const position = spawnPositionToPosition(spawnPosition);
    return Entity.createHelper(definition, position);
  }

  // ==================================================================================
  // DAMAGE METHODS
  // ==================================================================================

  /**
   * Deal damage to a list of Entity instances with overflow
   * Returns living entities AND slain entities separately
   */
  static dealDamageToEntities(
    entities: Entity[],
    damage: number
  ): { living: Entity[]; slain: Entity[]; totalDamageDealt: number } {
    let remainingDamage = damage;
    let totalDamageDealt = 0;

    // Sort by position (front to back)
    const sortedEntities = [...entities].sort(
      (a, b) => a.position - b.position
    );

    const living: Entity[] = [];
    const slain: Entity[] = [];

    for (const entity of sortedEntities) {
      if (remainingDamage <= 0) {
        living.push(entity);
        continue;
      }

      const result = entity.takeDamage(remainingDamage);
      totalDamageDealt += result.damageTaken;

      if (result.died) {
        remainingDamage = result.overkill;
        slain.push(entity);
      } else {
        living.push(entity);
        remainingDamage = 0;
      }
    }

    return { living, slain, totalDamageDealt };
  }

  // ==================================================================================
  // UTILITY METHODS
  // ==================================================================================

  /**
   * Find an available position for spawning
   * Returns null if no positions are available
   */
  static findAvailablePosition(
    entities: Array<{ position: 0 | 1 | 2 }>,
    preferredOrder: Array<0 | 1 | 2> = [1, 0, 2]
  ): 0 | 1 | 2 | null {
    const occupiedPositions = new Set(entities.map((e) => e.position));

    for (const position of preferredOrder) {
      if (!occupiedPositions.has(position)) {
        return position;
      }
    }

    return null; // All positions occupied
  }
}
