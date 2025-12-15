/**
 * Entity System - Public Exports
 *
 * Re-exports all public types and classes from the entity system.
 */

// Main Entity class
export { Entity, isEntityCategory } from "./entity.class";

// All type definitions
export {
  // Enums
  EntityCategory,
  AbilityTrigger,
  AbilityEffectType,
  AbilityTarget,
  SpawnPosition,

  // Types
  type ModifiableStat,
  type ModificationType,
  type LootType,

  // Interfaces
  type SpawnHelperConfig,
  type StatModification,
  type AbilityEffect,
  type Ability,
  type ActiveBuff,
  type BossPhase,
  type LootDrop,
  type LootTable,
  type AreaLootItem,
  type EntityBaseStats,
  type EntityRuntimeState,
  type PlayerDefinition,
  type EnemyDefinition,
  type BossDefinition,
  type HelperDefinition,
} from "./types/entity.types";
