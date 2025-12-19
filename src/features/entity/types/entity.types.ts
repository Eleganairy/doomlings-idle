/**
 * Entity Type Definitions
 *
 * This file contains all type definitions for the Entity system.
 * The Entity system provides a unified way to manage Players, Enemies, Bosses, and Helpers
 * with support for abilities, buffs/debuffs, and loot drops.
 */

// ====================================================================================
// ENTITY CATEGORIES
// ====================================================================================

/**
 * Categories of entities in the game
 * - PLAYER: Slimes controlled by the player
 * - ENEMY: Standard hostile creatures
 * - BOSS: Powerful enemies with special abilities and phases
 * - HELPER: Entities spawned by enemies/bosses to aid them
 */
export enum EntityCategory {
  PLAYER = "PLAYER",
  ENEMY = "ENEMY",
  BOSS = "BOSS",
  HELPER = "HELPER",
}

// ====================================================================================
// ABILITY SYSTEM - TRIGGERS
// ====================================================================================

/**
 * Defines when an ability triggers during combat
 *
 * @example
 * // Ability that activates when entity spawns
 * { trigger: AbilityTrigger.ON_SPAWN, ... }
 *
 * // Ability that activates after cooldown
 * { trigger: AbilityTrigger.ON_ABILITY_READY, cooldownMs: 10000, ... }
 *
 * // Ability that activates when entity dies
 * { trigger: AbilityTrigger.ON_DEATH, ... }
 */
export enum AbilityTrigger {
  /** Activates immediately when entity spawns into combat */
  ON_SPAWN = "ON_SPAWN",

  /** Activates when ability cooldown timer completes */
  ON_ABILITY_READY = "ON_ABILITY_READY",

  /** Activates when entity is slain */
  ON_DEATH = "ON_DEATH",
}

// ====================================================================================
// ABILITY SYSTEM - EFFECT TYPES
// ====================================================================================

/**
 * Types of effects an ability can have
 */
export enum AbilityEffectType {
  /** Deal damage to target(s) - uses damageMultiplier */
  DAMAGE = "DAMAGE",

  /** Modify stats of target(s) - uses statModifications */
  STAT_MODIFY = "STAT_MODIFY",

  /** Spawn helper entities - uses spawnConfig */
  SPAWN_HELPER = "SPAWN_HELPER",

  /** Restore health to target(s) - uses healAmount or healPercent */
  HEAL = "HEAL",

  /** Grant shield to target(s) - uses shieldAmount */
  SHIELD = "SHIELD",
}

// ====================================================================================
// ABILITY SYSTEM - TARGETING
// ====================================================================================

/**
 * Who the ability targets
 */
export enum AbilityTarget {
  /** The entity using the ability */
  SELF = "SELF",

  /** All friendly entities (same side) */
  FRIENDLY_ALL = "FRIENDLY_ALL",

  /** Single random friendly entity */
  FRIENDLY_SINGLE = "FRIENDLY_SINGLE",

  /** All enemy entities (opposite side) */
  ENEMY_ALL = "ENEMY_ALL",

  /** Single enemy entity (front-most by default) */
  ENEMY_SINGLE = "ENEMY_SINGLE",
}

// ====================================================================================
// HELPER SPAWNING
// ====================================================================================

/**
 * Where to spawn helper entities relative to the parent
 */
export enum SpawnPosition {
  /** Position 0 - front of the battlefield */
  FRONT = "FRONT",

  /** Position 2 - back of the battlefield */
  BEHIND = "BEHIND",
}

/**
 * Configuration for spawning helper entities
 */
export interface SpawnHelperConfig {
  /** ID of the helper definition to spawn */
  helperDefinitionId: string;

  /** Where to spawn the helper */
  position: SpawnPosition;

  /** Number of helpers to spawn (1 or 2) */
  count: 1 | 2;
}

// ====================================================================================
// STAT MODIFICATIONS (BUFFS/DEBUFFS)
// ====================================================================================

/**
 * Stats that can be modified by abilities
 */
export type ModifiableStat =
  | "attackDamage"
  | "attackSpeed"
  | "maxHealth"
  | "critChance"
  | "shield";

/**
 * How the stat modification is applied
 * - add: Add a flat value (e.g., +50 damage)
 * - multiply: Multiply the current value (e.g., x1.5)
 * - percent: Add a percentage of the base value (e.g., +25%)
 */
export type ModificationType = "add" | "multiply" | "percent";

/**
 * Configuration for a stat modification effect
 *
 * @example
 * // +50% attack speed for 10 seconds
 * { stat: "attackSpeed", type: "percent", value: 50, durationMs: 10000 }
 *
 * // Permanent +100 attack damage
 * { stat: "attackDamage", type: "add", value: 100, durationMs: 0 }
 */
export interface StatModification {
  /** Which stat to modify */
  stat: ModifiableStat;

  /** How to apply the modification */
  type: ModificationType;

  /** The value of the modification */
  value: number;

  /** Duration in milliseconds (0 = permanent until removed) */
  durationMs: number;
}

// ====================================================================================
// ABILITY EFFECTS
// ====================================================================================

/**
 * An ability effect - defines what happens when an ability triggers
 *
 * Different effect types use different properties:
 * - DAMAGE: uses damageMultiplier
 * - STAT_MODIFY: uses statModifications
 * - SPAWN_HELPER: uses spawnConfig
 * - HEAL: uses healAmount or healPercent
 * - SHIELD: uses shieldAmount
 */
export interface AbilityEffect {
  /** Type of effect */
  type: AbilityEffectType;

  /** Who the effect targets */
  target: AbilityTarget;

  /**
   * Target position for FRIENDLY_SINGLE (0=front, 1=middle, 2=back).
   * If undefined, a random living friendly entity is chosen.
   */
  targetPosition?: 0 | 1 | 2;

  // --- DAMAGE effect properties ---
  /** Multiplier for damage (1.0 = 100% of attack damage) */
  damageMultiplier?: number;

  // --- STAT_MODIFY effect properties ---
  /** List of stat modifications to apply */
  statModifications?: StatModification[];

  // --- SPAWN_HELPER effect properties ---
  /** Configuration for spawning helpers */
  spawnConfig?: SpawnHelperConfig;

  // --- HEAL effect properties ---
  /** Flat amount to heal */
  healAmount?: number;

  /** Percentage of max health to heal (0-100) */
  healPercent?: number;

  // --- SHIELD effect properties ---
  /** Amount of shield to grant */
  shieldPercent?: number;
}

// ====================================================================================
// ABILITY DEFINITION
// ====================================================================================

/**
 * Complete ability definition
 *
 * @example
 * // Healer slime's healing pulse ability
 * const healingPulse: Ability = {
 *   id: "healing_pulse",
 *   name: "Healing Pulse",
 *   description: "Heals all friendly entities for 15% of their max health",
 *   icon: "/abilities/heal.png",
 *   trigger: AbilityTrigger.ON_ABILITY_READY,
 *   cooldownMs: 8000,
 *   effects: [{
 *     type: AbilityEffectType.HEAL,
 *     target: AbilityTarget.FRIENDLY_ALL,
 *     healPercent: 15,
 *   }],
 * };
 */
export interface Ability {
  /** Unique identifier for this ability */
  id: string;

  /** Display name */
  name: string;

  /** Description shown to player */
  description: string;

  /** Icon path for UI display */
  icon: string;

  /** When this ability triggers */
  trigger: AbilityTrigger;

  /** Time in ms until ability is ready (for ON_ABILITY_READY trigger) */
  cooldownMs: number;

  /** List of effects this ability produces */
  effects: AbilityEffect[];
}

// ====================================================================================
// ACTIVE BUFF TRACKING
// ====================================================================================

/**
 * An active buff or debuff currently affecting an entity
 * Used to track duration and expiration of stat modifications
 */
export interface ActiveBuff {
  /** Unique ID for this buff instance */
  id: string;

  /** ID of the ability that created this buff */
  sourceAbilityId: string;

  /** The stat modification being applied */
  modification: StatModification;

  /** Timestamp when buff was applied */
  appliedAt: number;

  /** Timestamp when buff expires (0 = permanent) */
  expiresAt: number;
}

// ====================================================================================
// BOSS PHASES
// ====================================================================================

/**
 * Configuration for a boss phase transition
 * Bosses can have multiple phases that trigger at different health thresholds
 *
 * @example
 * // Phase triggers at 50% health with stat boost and new abilities
 * const enragedPhase: BossPhase = {
 *   id: "enraged",
 *   name: "Enraged",
 *   triggersAtHealthPercent: 50,
 *   abilities: [powerfulSlamAbility],
 *   statModifiers: [
 *     { stat: "attackDamage", type: "multiply", value: 1.5, durationMs: 0 },
 *     { stat: "attackSpeed", type: "percent", value: 25, durationMs: 0 },
 *   ],
 * };
 */
export interface BossPhase {
  /** Unique identifier for this phase */
  id: string;

  /** Display name (e.g., "Enraged", "Final Form") */
  name: string;

  /** Health percentage that triggers this phase (0-100) */
  triggersAtHealthPercent: number;

  /** New abilities gained in this phase */
  abilities: Ability[];

  /** Stat modifiers applied when entering this phase */
  statModifiers: StatModification[];
}

// ====================================================================================
// LOOT SYSTEM
// ====================================================================================

/**
 * Types of loot that can drop
 */
export type LootType = "energy" | "meteorite" | "areaLoot";

/**
 * A single loot drop configuration
 *
 * @example
 * // 100% chance to drop 5-10 energy
 * { type: "energy", dropChance: 100, minAmount: 5, maxAmount: 10 }
 *
 * // 10% chance to drop 1 meteorite
 * { type: "meteorite", dropChance: 10, minAmount: 1, maxAmount: 1 }
 *
 * // 25% chance to drop 1-3 Grass Fiber (area-specific)
 * { type: "areaLoot", areaLootId: "grass_fiber", dropChance: 25, minAmount: 1, maxAmount: 3 }
 */
export interface LootDrop {
  /** Type of loot */
  type: LootType;

  /** ID of area-specific loot (required when type is "areaLoot") */
  areaLootId?: string;

  /** Chance to drop (0-100) */
  dropChance: number;

  /** Minimum amount to drop */
  minAmount: number;

  /** Maximum amount to drop */
  maxAmount: number;
}

/**
 * Complete loot table for an entity
 */
export interface LootTable {
  /** List of possible drops */
  drops: LootDrop[];
}

// ====================================================================================
// AREA-SPECIFIC LOOT
// ====================================================================================

/**
 * Definition for an area-specific loot item
 */
export interface AreaLootItem {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Icon path */
  icon: string;

  /** Description */
  description: string;

  /** Base drop chance (modified by enemy rarity) */
  baseDropChance: number;
}

// ====================================================================================
// ENTITY BASE STATS
// ====================================================================================

/**
 * Base stats shared by all entity types
 * These are the immutable stats defined in entity configurations
 */
export interface EntityBaseStats {
  /** Display name */
  name: string;

  /** Optional description */
  description?: string;

  /** Maximum health points */
  maxHealth: number;

  /** Damage dealt per attack */
  attackDamage: number;

  /** Attacks per second */
  attackSpeed: number;

  /** Critical hit chance (0-100) */
  critChance: number;

  /** Path to icon image */
  icon: string;

  /** Path to sprite image */
  sprite: string;
}

// ====================================================================================
// ENTITY RUNTIME STATE
// ====================================================================================

/**
 * Runtime state that changes during combat
 * Tracked separately from base stats to allow easy reset
 */
export interface EntityRuntimeState {
  /** Unique runtime ID for this entity instance */
  id: string;

  /** Current position on battlefield (0=front, 1=middle, 2=back) */
  position: 0 | 1 | 2;

  /** Current health points */
  currentHealth: number;

  /** Current shield points */
  currentShield: number;

  /** Active buffs/debuffs */
  activeBuffs: ActiveBuff[];

  /** Ability cooldown progress (abilityId -> ms elapsed) */
  abilityCooldowns: Record<string, number>;

  /** For bosses: which phases have been activated */
  activatedPhaseIds: string[];
}

// ====================================================================================
// ENTITY DEFINITION TYPES
// ====================================================================================

/**
 * Player entity definition (used in config files)
 */
export interface PlayerDefinition {
  /** Unique identifier */
  id: string;

  /** Base stats */
  baseStats: EntityBaseStats;

  /** Shield amount (player-specific) */
  shield: number;

  /** Optional abilities */
  abilities?: Ability[];
}

/**
 * Enemy entity definition (used in config files)
 */
export interface EnemyDefinition {
  /** Unique identifier */
  id: string;

  /** Area this enemy belongs to */
  areaNumber: number;

  /** Rarity tier */
  rarity: string;

  /** Enemy type (affects stats) */
  type: string;

  /** Base stats */
  baseStats: EntityBaseStats;

  /** Loot table */
  lootTable: LootTable;

  /** Optional abilities */
  abilities?: Ability[];
}

/**
 * Boss entity definition (used in config files)
 */
export interface BossDefinition {
  /** Unique identifier */
  id: string;

  /** Area this boss belongs to */
  areaNumber: number;

  /** Base stats */
  baseStats: EntityBaseStats;

  /** Loot table (usually better than regular enemies) */
  lootTable: LootTable;

  /** Base abilities (before any phase transitions) */
  abilities?: Ability[];

  /** Phase configurations */
  phases: BossPhase[];
}

/**
 * Helper entity definition (spawned by enemies/bosses)
 */
export interface HelperDefinition {
  /** Unique identifier */
  id: string;

  /** Base stats */
  baseStats: EntityBaseStats;

  /** Optional abilities */
  abilities?: Ability[];
}
