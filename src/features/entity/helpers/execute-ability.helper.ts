/**
 * Ability Execution Helper
 *
 * Provides functions for executing ability effects during combat.
 * This is the bridge between the Entity system and the combat loop.
 */

import { Entity } from "../entity.class";
import {
  AbilityEffectType,
  AbilityTarget,
  SpawnPosition,
  type Ability,
  type AbilityEffect,
} from "../types/entity.types";

// ====================================================================================
// ABILITY EXECUTION RESULT
// ====================================================================================

/**
 * Result of executing an ability
 */
export interface AbilityExecutionResult {
  /** Ability that was executed */
  ability: Ability;

  /** Entity that used the ability */
  source: Entity;

  /** Entities that were affected by the ability */
  affectedEntities: Entity[];

  /** Total damage dealt (for DAMAGE effects) */
  totalDamageDealt: number;

  /** Total healing done (for HEAL effects) */
  totalHealing: number;

  /** Helpers that should be spawned (for SPAWN_HELPER effects) */
  helpersToSpawn: Array<{
    definitionId: string;
    position: SpawnPosition;
  }>;

  /** Any entities that died from this ability */
  killedEntities: Entity[];
}

// ====================================================================================
// EXECUTE ABILITY
// ====================================================================================

/**
 * Execute an ability from a source entity
 *
 * @param source The entity using the ability
 * @param ability The ability to execute
 * @param friendlyEntities All friendly entities (same side as source)
 * @param enemyEntities All enemy entities (opposite side from source)
 *
 * @returns Result containing affected entities and effects
 *
 * @example
 * const readyAbilities = entity.tickAbilities(16);
 * for (const ability of readyAbilities) {
 *   const result = executeAbility(
 *     entity,
 *     ability,
 *     getAllFriendlyEntities(),
 *     getAllEnemyEntities()
 *   );
 *
 *   // Handle helper spawning
 *   for (const helper of result.helpersToSpawn) {
 *     spawnHelper(helper.definitionId, helper.position);
 *   }
 *
 *   // Handle deaths
 *   for (const killed of result.killedEntities) {
 *     handleEntityDeath(killed);
 *   }
 * }
 */
export function executeAbility(
  source: Entity,
  ability: Ability,
  friendlyEntities: Entity[],
  enemyEntities: Entity[]
): AbilityExecutionResult {
  const result: AbilityExecutionResult = {
    ability,
    source,
    affectedEntities: [],
    totalDamageDealt: 0,
    totalHealing: 0,
    helpersToSpawn: [],
    killedEntities: [],
  };

  for (const effect of ability.effects) {
    const targets = getTargetEntities(
      source,
      effect,
      friendlyEntities,
      enemyEntities
    );

    switch (effect.type) {
      case AbilityEffectType.DAMAGE:
        executeDamageEffect(source, effect, targets, result);
        break;

      case AbilityEffectType.STAT_MODIFY:
        executeStatModifyEffect(ability.id, effect, targets, result);
        break;

      case AbilityEffectType.HEAL:
        executeHealEffect(effect, targets, result);
        break;

      case AbilityEffectType.SHIELD:
        executeShieldEffect(effect, targets, result);
        break;

      case AbilityEffectType.SPAWN_HELPER:
        executeSpawnHelperEffect(effect, result);
        break;
    }
  }

  return result;
}

// ====================================================================================
// TARGET RESOLUTION
// ====================================================================================

/**
 * Get the entities targeted by an ability effect
 */
function getTargetEntities(
  source: Entity,
  effect: AbilityEffect,
  friendlyEntities: Entity[],
  enemyEntities: Entity[]
): Entity[] {
  const { target, targetPosition } = effect;

  switch (target) {
    case AbilityTarget.SELF:
      return [source];

    case AbilityTarget.FRIENDLY_ALL:
      return friendlyEntities.filter(
        (filteredEntity) => filteredEntity.isAlive
      );

    case AbilityTarget.FRIENDLY_SINGLE: {
      const livingFriendly = friendlyEntities.filter(
        (filteredEntity) => filteredEntity.isAlive
      );
      if (livingFriendly.length === 0) return [];

      // If targetPosition is specified, target that position
      if (targetPosition !== undefined) {
        const targetEntity = livingFriendly.find(
          (entity) => entity.position === targetPosition
        );
        return targetEntity ? [targetEntity] : [];
      }

      // Otherwise pick random
      return [
        livingFriendly[Math.floor(Math.random() * livingFriendly.length)],
      ];
    }

    case AbilityTarget.ENEMY_ALL:
      return enemyEntities.filter((filteredEntity) => filteredEntity.isAlive);

    case AbilityTarget.ENEMY_SINGLE: {
      // Front-most living enemy (lowest position number)
      const livingEnemies = enemyEntities.filter(
        (filteredEntity) => filteredEntity.isAlive
      );
      if (livingEnemies.length === 0) return [];
      livingEnemies.sort((a, b) => a.position - b.position);
      return [livingEnemies[0]];
    }

    default:
      return [];
  }
}

// ====================================================================================
// EFFECT EXECUTORS
// ====================================================================================

/**
 * Execute a DAMAGE effect
 */
function executeDamageEffect(
  source: Entity,
  effect: AbilityEffect,
  targets: Entity[],
  result: AbilityExecutionResult
): void {
  const baseDamage = source.attackDamage;
  const multiplier = effect.damageMultiplier ?? 1;
  const damage = Math.floor(baseDamage * multiplier);

  for (const target of targets) {
    const damageResult = target.takeDamage(damage);
    result.totalDamageDealt += damageResult.damageTaken;

    if (!result.affectedEntities.includes(target)) {
      result.affectedEntities.push(target);
    }

    if (damageResult.died) {
      result.killedEntities.push(target);
    }
  }
}

/**
 * Execute a STAT_MODIFY effect
 */
function executeStatModifyEffect(
  abilityId: string,
  effect: AbilityEffect,
  targets: Entity[],
  result: AbilityExecutionResult
): void {
  if (!effect.statModifications) return;

  for (const target of targets) {
    for (const modification of effect.statModifications) {
      target.applyBuff(abilityId, modification);
    }

    if (!result.affectedEntities.includes(target)) {
      result.affectedEntities.push(target);
    }
  }
}

/**
 * Execute a HEAL effect
 */
function executeHealEffect(
  effect: AbilityEffect,
  targets: Entity[],
  result: AbilityExecutionResult
): void {
  for (const target of targets) {
    let healed = 0;

    if (effect.healPercent !== undefined) {
      healed = target.healPercent(effect.healPercent);
    } else if (effect.healAmount !== undefined) {
      healed = target.heal(effect.healAmount);
    }

    result.totalHealing += healed;

    if (!result.affectedEntities.includes(target)) {
      result.affectedEntities.push(target);
    }
  }
}

/**
 * Execute a SHIELD effect
 */
function executeShieldEffect(
  effect: AbilityEffect,
  targets: Entity[],
  result: AbilityExecutionResult
): void {
  if (!effect.shieldAmount) return;

  for (const target of targets) {
    target.addShield(effect.shieldAmount);

    if (!result.affectedEntities.includes(target)) {
      result.affectedEntities.push(target);
    }
  }
}

/**
 * Execute a SPAWN_HELPER effect
 *
 * Note: This doesn't actually spawn the helper, it just records that
 * helpers should be spawned. The combat manager handles actual spawning.
 */
function executeSpawnHelperEffect(
  effect: AbilityEffect,
  result: AbilityExecutionResult
): void {
  if (!effect.spawnConfig) return;

  const { helperDefinitionId, position, count } = effect.spawnConfig;

  for (let i = 0; i < count; i++) {
    result.helpersToSpawn.push({
      definitionId: helperDefinitionId,
      position,
    });
  }
}

// ====================================================================================
// HELPER SPAWN UTILITY
// ====================================================================================

/**
 * Convert SpawnPosition to battlefield position
 */
export function spawnPositionToPosition(spawnPosition: SpawnPosition): 0 | 2 {
  return spawnPosition === SpawnPosition.FRONT ? 0 : 2;
}
