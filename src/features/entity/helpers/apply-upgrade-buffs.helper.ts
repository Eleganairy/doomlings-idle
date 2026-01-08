/**
 * Apply Upgrade Buffs Helper
 *
 * Thin wrapper around the stat-modifiers service for applying
 * upgrade buffs to combat entities.
 *
 * This file now uses the unified stat-modifiers.service.ts
 * to ensure consistency between UI and combat.
 */

import { Entity } from "../entity.class";
import {
  ProgressionId,
  UpgradeTarget,
} from "../../progression/types/progression.types";
import { applyUpgradeBuffsToEntity } from "../../progression/services/stat-modifiers.service";

// ====================================================================================
// PUBLIC API - Re-exports for backwards compatibility
// ====================================================================================

/**
 * Apply all upgrade buffs to a player entity.
 *
 * Uses the unified stat modifier calculation from stat-modifiers.service.ts.
 *
 * @param entity The player entity to apply buffs to
 * @param upgradeLevels Current upgrade levels from progression store
 *
 * @example
 * const player = Entity.createPlayer(BASIC_SLIME, 0);
 * applyUpgradeBuffsToPlayer(player, upgradeLevels);
 */
export function applyUpgradeBuffsToPlayer(
  entity: Entity,
  upgradeLevels: Partial<Record<ProgressionId, number>>
): void {
  applyUpgradeBuffsToEntity(entity, upgradeLevels, UpgradeTarget.PLAYER);
}

/**
 * Apply all upgrade debuffs to an enemy entity.
 *
 * Uses the unified stat modifier calculation from stat-modifiers.service.ts.
 *
 * @param entity The enemy entity to apply debuffs to
 * @param upgradeLevels Current upgrade levels from progression store
 *
 * @example
 * const enemy = Entity.createEnemy(definition, 0);
 * applyUpgradeDebuffsToEnemy(enemy, upgradeLevels);
 */
export function applyUpgradeDebuffsToEnemy(
  entity: Entity,
  upgradeLevels: Partial<Record<ProgressionId, number>>
): void {
  applyUpgradeBuffsToEntity(entity, upgradeLevels, UpgradeTarget.ENEMY);
}
