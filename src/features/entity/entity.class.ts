/**
 * Entity Class
 *
 * A unified class for managing all combat entities in the game.
 * Provides a clean API for creating, managing, and interacting with
 * Players, Enemies, Bosses, and Helpers during combat.
 *
 * Similar to BigNumber, this class encapsulates all entity logic in one place
 * with clear methods and documentation.
 *
 * @example
 * // Create a player
 * const player = Entity.createPlayer(playerDef, 1);
 *
 * // Deal damage
 * const result = enemy.takeDamage(50);
 * if (result.died) handleDeath(enemy);
 *
 * // Update abilities in game loop
 * const readyAbilities = entity.tickAbilities(deltaMs);
 */

import {
  EntityCategory,
  AbilityTrigger,
  type EntityBaseStats,
  type EntityRuntimeState,
  type Ability,
  type LootTable,
  type LootDrop,
  type ActiveBuff,
  type StatModification,
  type ModifiableStat,
  type BossPhase,
  type PlayerDefinition,
  type EnemyDefinition,
  type BossDefinition,
  type HelperDefinition,
} from "./types/entity.types";

// ====================================================================================
// ENTITY CLASS
// ====================================================================================

export class Entity {
  // ==================================================================================
  // ENTITY CONFIGURATION (immutable after creation)
  // ==================================================================================

  /** Unique identifier for this entity definition */
  readonly definitionId: string;

  /** What category of entity this is */
  readonly category: EntityCategory;

  /** Base stats before any modifiers */
  readonly baseStats: EntityBaseStats;

  /** Abilities this entity can use */
  readonly abilities: Ability[];

  /** Loot table (mainly for enemies/bosses) */
  readonly lootTable: LootTable | null;

  /** Boss phases (only for bosses) */
  readonly phases: BossPhase[];

  /** Shield amount (mainly for players) */
  readonly baseShield: number;

  /** Area number (for enemies/bosses) */
  readonly areaNumber: number;

  /** Rarity (for enemies) */
  readonly rarity: string;

  /** Entity type (for enemies) */
  readonly entityType: string;

  // ==================================================================================
  // RUNTIME STATE (changes during combat)
  // ==================================================================================

  /** Runtime state that changes during combat */
  private state: EntityRuntimeState;

  // ==================================================================================
  // CONSTRUCTOR
  // ==================================================================================

  /**
   * Private constructor - use factory methods instead
   * @see Entity.createPlayer
   * @see Entity.createEnemy
   * @see Entity.createBoss
   * @see Entity.createHelper
   */
  private constructor(config: {
    definitionId: string;
    category: EntityCategory;
    baseStats: EntityBaseStats;
    abilities: Ability[];
    lootTable: LootTable | null;
    phases: BossPhase[];
    baseShield: number;
    areaNumber: number;
    rarity: string;
    entityType: string;
    position: 0 | 1 | 2;
  }) {
    this.definitionId = config.definitionId;
    this.category = config.category;
    this.baseStats = { ...config.baseStats };
    this.abilities = [...config.abilities];
    this.lootTable = config.lootTable;
    this.phases = [...config.phases];
    this.baseShield = config.baseShield;
    this.areaNumber = config.areaNumber;
    this.rarity = config.rarity;
    this.entityType = config.entityType;

    // Initialize runtime state
    this.state = {
      id: this.generateId(config.position),
      position: config.position,
      currentHealth: config.baseStats.maxHealth,
      currentShield: config.baseShield,
      activeBuffs: [],
      abilityCooldowns: this.initializeCooldowns(),
      activatedPhaseIds: [],
    };
  }

  // ==================================================================================
  // FACTORY METHODS - Create specific entity types
  // ==================================================================================

  /**
   * Create a Player entity from a player definition
   *
   * @param definition The player definition from config
   * @param position Battlefield position (0=front, 1=middle, 2=back)
   *
   * @example
   * const player = Entity.createPlayer(BASIC_SLIME_DEF, 1);
   */
  static createPlayer(
    definition: PlayerDefinition,
    position: 0 | 1 | 2
  ): Entity {
    return new Entity({
      definitionId: definition.id,
      category: EntityCategory.PLAYER,
      baseStats: definition.baseStats,
      abilities: definition.abilities || [],
      lootTable: null,
      phases: [],
      baseShield: definition.shield,
      areaNumber: 0,
      rarity: "",
      entityType: "",
      position,
    });
  }

  /**
   * Create an Enemy entity from an enemy definition
   *
   * @param definition The enemy definition from config
   * @param position Battlefield position (0=front, 1=middle, 2=back)
   *
   * @example
   * const enemy = Entity.createEnemy(GRASSHOPPER_DEF, 1);
   */
  static createEnemy(definition: EnemyDefinition, position: 0 | 1 | 2): Entity {
    return new Entity({
      definitionId: definition.id,
      category: EntityCategory.ENEMY,
      baseStats: definition.baseStats,
      abilities: definition.abilities || [],
      lootTable: definition.lootTable,
      phases: [],
      baseShield: 0,
      areaNumber: definition.areaNumber,
      rarity: definition.rarity,
      entityType: definition.type,
      position,
    });
  }

  /**
   * Create a Boss entity from a boss definition
   *
   * @param definition The boss definition from config
   * @param position Battlefield position (0=front, 1=middle, 2=back)
   *
   * @example
   * const boss = Entity.createBoss(FOREST_GUARDIAN_DEF, 1);
   */
  static createBoss(definition: BossDefinition, position: 0 | 1 | 2): Entity {
    return new Entity({
      definitionId: definition.id,
      category: EntityCategory.BOSS,
      baseStats: definition.baseStats,
      abilities: definition.abilities || [],
      lootTable: definition.lootTable,
      phases: definition.phases,
      baseShield: 0,
      areaNumber: definition.areaNumber,
      rarity: "BOSS",
      entityType: "BOSS",
      position,
    });
  }

  /**
   * Create a Helper entity spawned by an enemy or boss
   *
   * @param definition The helper definition from config
   * @param position Battlefield position (0=front, 1=middle, 2=back)
   *
   * @example
   * const helper = Entity.createHelper(GOBLIN_MINION_DEF, 0);
   */
  static createHelper(
    definition: HelperDefinition,
    position: 0 | 1 | 2
  ): Entity {
    return new Entity({
      definitionId: definition.id,
      category: EntityCategory.HELPER,
      baseStats: definition.baseStats,
      abilities: definition.abilities || [],
      lootTable: null, // Helpers don't drop loot
      phases: [],
      baseShield: 0,
      areaNumber: 0,
      rarity: "",
      entityType: "",
      position,
    });
  }

  /**
   * Clone this entity (useful for respawning or creating copies)
   *
   * @param newPosition Optional new position, defaults to current position
   */
  clone(newPosition?: 0 | 1 | 2): Entity {
    // Recreate using the appropriate factory based on category
    const position = newPosition ?? this.state.position;

    const entity = new Entity({
      definitionId: this.definitionId,
      category: this.category,
      baseStats: this.baseStats,
      abilities: this.abilities,
      lootTable: this.lootTable,
      phases: this.phases,
      baseShield: this.baseShield,
      areaNumber: this.areaNumber,
      rarity: this.rarity,
      entityType: this.entityType,
      position,
    });

    return entity;
  }

  // ==================================================================================
  // GETTERS - Access current stats with modifiers applied
  // ==================================================================================

  /** Get the entity's unique runtime ID */
  get id(): string {
    return this.state.id;
  }

  /** Get current position on the battlefield */
  get position(): 0 | 1 | 2 {
    return this.state.position;
  }

  /** Get entity display name */
  get name(): string {
    return this.baseStats.name;
  }

  /** Get entity description */
  get description(): string {
    return this.baseStats.description || "";
  }

  /** Get current health */
  get currentHealth(): number {
    return this.state.currentHealth;
  }

  /** Get current shield */
  get currentShield(): number {
    return this.state.currentShield;
  }

  /** Get max health (with buffs applied) */
  get maxHealth(): number {
    return Math.floor(
      this.getModifiedStat("maxHealth", this.baseStats.maxHealth)
    );
  }

  /** Get attack damage (with buffs applied) */
  get attackDamage(): number {
    return Math.floor(
      this.getModifiedStat("attackDamage", this.baseStats.attackDamage)
    );
  }

  /** Get attack speed in attacks per second (with buffs applied) */
  get attackSpeed(): number {
    return Number(
      this.getModifiedStat("attackSpeed", this.baseStats.attackSpeed).toFixed(2)
    );
  }

  /** Get critical hit chance percentage (with buffs applied, capped at 100) */
  get critChance(): number {
    return Math.min(
      100,
      this.getModifiedStat("critChance", this.baseStats.critChance)
    );
  }

  /** Get shield (with buffs applied) */
  get shield(): number {
    return Math.floor(this.getModifiedStat("shield", this.baseShield));
  }

  /** Get sprite path */
  get sprite(): string {
    return this.baseStats.sprite;
  }

  /** Get icon path */
  get icon(): string {
    return this.baseStats.icon;
  }

  /** Check if entity is alive */
  get isAlive(): boolean {
    return this.state.currentHealth > 0;
  }

  /** Check if entity is hostile (enemy, boss, or helper) */
  get isHostile(): boolean {
    return [
      EntityCategory.ENEMY,
      EntityCategory.BOSS,
      EntityCategory.HELPER,
    ].includes(this.category);
  }

  /** Check if entity is friendly (player) */
  get isFriendly(): boolean {
    return this.category === EntityCategory.PLAYER;
  }

  /** Check if entity is a boss */
  get isBoss(): boolean {
    return this.category === EntityCategory.BOSS;
  }

  /** Get list of active buffs */
  get activeBuffs(): ActiveBuff[] {
    return [...this.state.activeBuffs];
  }

  /** Get current boss phase index (-1 if no phase activated yet) */
  get currentPhaseIndex(): number {
    if (this.state.activatedPhaseIds.length === 0) return -1;
    const lastPhaseId =
      this.state.activatedPhaseIds[this.state.activatedPhaseIds.length - 1];
    return this.phases.findIndex((p) => p.id === lastPhaseId);
  }

  // ==================================================================================
  // COMBAT METHODS
  // ==================================================================================

  /**
   * Deal damage to this entity
   *
   * Damage is first applied to shield, then to health.
   * Returns information about the damage dealt and if the entity died.
   *
   * @param amount The amount of damage to deal
   *
   * @example
   * const result = enemy.takeDamage(50);
   * console.log(`Dealt ${result.damageTaken} damage`);
   * if (result.died) {
   *   const deathAbilities = enemy.getAbilitiesForTrigger(AbilityTrigger.ON_DEATH);
   *   // Execute death abilities...
   * }
   */
  takeDamage(amount: number): {
    damageTaken: number;
    shieldDamage: number;
    healthDamage: number;
    died: boolean;
    overkill: number;
  } {
    let remainingDamage = amount;
    let shieldDamage = 0;
    let healthDamage = 0;

    // Apply damage to shield first
    if (this.state.currentShield > 0) {
      shieldDamage = Math.min(this.state.currentShield, remainingDamage);
      this.state.currentShield -= shieldDamage;
      remainingDamage -= shieldDamage;
    }

    // Apply remaining damage to health
    const previousHealth = this.state.currentHealth;
    this.state.currentHealth = Math.max(
      0,
      this.state.currentHealth - remainingDamage
    );
    healthDamage = previousHealth - this.state.currentHealth;

    const died = this.state.currentHealth <= 0;
    const overkill = died
      ? Math.abs(this.state.currentHealth - remainingDamage)
      : 0;

    return {
      damageTaken: shieldDamage + healthDamage,
      shieldDamage,
      healthDamage,
      died,
      overkill,
    };
  }

  /**
   * Heal this entity by a flat amount
   *
   * @param amount The amount to heal
   * @returns The actual amount healed (may be less if near max health)
   *
   * @example
   * const healed = player.heal(50);
   * console.log(`Healed for ${healed} HP`);
   */
  heal(amount: number): number {
    const previousHealth = this.state.currentHealth;
    this.state.currentHealth = Math.min(
      this.maxHealth,
      this.state.currentHealth + amount
    );
    return this.state.currentHealth - previousHealth;
  }

  /**
   * Heal this entity by a percentage of max health
   *
   * @param percent Percentage of max health to heal (0-100)
   * @returns The actual amount healed
   *
   * @example
   * const healed = player.healPercent(25); // Heal 25% of max HP
   */
  healPercent(percent: number): number {
    const amount = Math.floor(this.maxHealth * (percent / 100));
    return this.heal(amount);
  }

  /**
   * Grant shield to this entity
   *
   * @param amount The amount of shield to add
   *
   * @example
   * player.addShield(100);
   */
  addShield(amount: number): void {
    this.state.currentShield += amount;
  }

  /**
   * Set position on the battlefield
   *
   * @param position New position (0=front, 1=middle, 2=back)
   */
  setPosition(position: 0 | 1 | 2): void {
    this.state.position = position;
  }

  /**
   * Set current health to match max health.
   * Call this after applying buffs on spawn to ensure entity starts at full HP.
   *
   * @example
   * const player = Entity.createPlayer(def, 0);
   * applyUpgradeBuffsToPlayer(player, levels);
   * player.syncHealthToMax(); // Now at full buffed HP
   */
  syncHealthToMax(): void {
    this.state.currentHealth = this.maxHealth;
  }

  /**
   * Sync current health when max health changes from buffs.
   * Adds the difference between new and old max health to current health.
   * Useful when upgrading health during combat - players gain the extra HP immediately.
   *
   * @param previousMaxHealth The max health before the buff change
   *
   * @example
   * const oldMax = player.maxHealth;
   * applyNewBuffs(player);
   * player.syncHealthWithMaxChange(oldMax);
   */
  syncHealthWithMaxChange(previousMaxHealth: number): void {
    const newMaxHealth = this.maxHealth;
    const difference = newMaxHealth - previousMaxHealth;

    if (difference > 0) {
      // Max health increased - add the extra HP
      this.state.currentHealth = Math.min(
        newMaxHealth,
        this.state.currentHealth + difference
      );
    } else if (difference < 0) {
      // Max health decreased - cap current health at new max
      this.state.currentHealth = Math.min(
        newMaxHealth,
        this.state.currentHealth
      );
    }
  }

  // ==================================================================================
  // BUFF/DEBUFF METHODS
  // ==================================================================================

  /**
   * Apply a buff or debuff to this entity
   *
   * If a buff from the same ability already exists, it is REPLACED (not stacked).
   *
   * @param abilityId ID of the ability creating this buff
   * @param modification The stat modification to apply
   *
   * @example
   * // Apply +50% attack speed for 10 seconds
   * entity.applyBuff("battle_cry", {
   *   stat: "attackSpeed",
   *   type: "percent",
   *   value: 50,
   *   durationMs: 10000,
   * });
   */
  applyBuff(abilityId: string, modification: StatModification): void {
    const now = Date.now();

    // Remove existing buff from same ability (replacement, not stacking)
    this.state.activeBuffs = this.state.activeBuffs.filter(
      (buff) =>
        buff.sourceAbilityId !== abilityId ||
        buff.modification.stat !== modification.stat
    );

    // Add new buff
    const buff: ActiveBuff = {
      id: `${abilityId}-${modification.stat}-${now}`,
      sourceAbilityId: abilityId,
      modification,
      appliedAt: now,
      expiresAt:
        modification.durationMs > 0 ? now + modification.durationMs : 0,
    };

    this.state.activeBuffs.push(buff);
  }

  /**
   * Remove expired buffs
   *
   * Call this in the game tick to clean up expired effects.
   *
   * @example
   * // In game loop
   * entity.updateBuffs();
   */
  updateBuffs(): void {
    const now = Date.now();
    this.state.activeBuffs = this.state.activeBuffs.filter(
      (buff) => buff.expiresAt === 0 || buff.expiresAt > now
    );
  }

  /**
   * Remove all buffs from a specific ability
   *
   * @param abilityId ID of the ability whose buffs to remove
   */
  removeBuffsFromAbility(abilityId: string): void {
    this.state.activeBuffs = this.state.activeBuffs.filter(
      (buff) => buff.sourceAbilityId !== abilityId
    );
  }

  /**
   * Remove all buffs/debuffs
   */
  clearAllBuffs(): void {
    this.state.activeBuffs = [];
  }

  // ==================================================================================
  // ABILITY METHODS
  // ==================================================================================

  /**
   * Get all abilities that trigger on a specific event
   *
   * @param trigger The trigger type to filter by
   *
   * @example
   * const spawnAbilities = entity.getAbilitiesForTrigger(AbilityTrigger.ON_SPAWN);
   * for (const ability of spawnAbilities) {
   *   executeAbility(entity, ability);
   * }
   */
  getAbilitiesForTrigger(trigger: AbilityTrigger): Ability[] {
    // Base abilities
    let allAbilities = this.abilities.filter((a) => a.trigger === trigger);

    // Add phase abilities if boss
    if (this.isBoss) {
      for (const phaseId of this.state.activatedPhaseIds) {
        const phase = this.phases.find((p) => p.id === phaseId);
        if (phase) {
          allAbilities = allAbilities.concat(
            phase.abilities.filter((a) => a.trigger === trigger)
          );
        }
      }
    }

    return allAbilities;
  }

  /**
   * Update ability cooldowns and return abilities that are now ready
   *
   * Call this in the game tick to progress ability timers.
   *
   * @param deltaMs Milliseconds since last tick
   * @returns Array of abilities that just became ready to fire
   *
   * @example
   * // In game loop
   * const readyAbilities = entity.tickAbilities(16); // 60 FPS
   * for (const ability of readyAbilities) {
   *   executeAbility(entity, ability);
   * }
   */
  tickAbilities(deltaMs: number): Ability[] {
    const readyAbilities: Ability[] = [];
    const allAbilities = this.getAllAbilities();

    for (const ability of allAbilities) {
      if (ability.trigger !== AbilityTrigger.ON_ABILITY_READY) continue;
      if (ability.cooldownMs <= 0) continue;

      const currentProgress = this.state.abilityCooldowns[ability.id] || 0;
      const newProgress = currentProgress + deltaMs;

      if (newProgress >= ability.cooldownMs) {
        readyAbilities.push(ability);
        this.state.abilityCooldowns[ability.id] = 0; // Reset cooldown
      } else {
        this.state.abilityCooldowns[ability.id] = newProgress;
      }
    }

    return readyAbilities;
  }

  /**
   * Get the progress of an ability's cooldown (0 to 1)
   *
   * @param abilityId ID of the ability to check
   * @returns Progress from 0 (just started) to 1 (ready)
   *
   * @example
   * const progress = entity.getAbilityProgress("healing_pulse");
   * // Render ability bar at progress% filled
   */
  getAbilityProgress(abilityId: string): number {
    const ability = this.getAllAbilities().find((a) => a.id === abilityId);
    if (!ability || ability.cooldownMs <= 0) return 0;

    const progress = this.state.abilityCooldowns[abilityId] || 0;
    return Math.min(1, progress / ability.cooldownMs);
  }

  /**
   * Reset an ability's cooldown to 0
   *
   * @param abilityId ID of the ability to reset
   */
  resetAbilityCooldown(abilityId: string): void {
    this.state.abilityCooldowns[abilityId] = 0;
  }

  /**
   * Get all abilities including phase abilities
   */
  getAllAbilities(): Ability[] {
    let allAbilities = [...this.abilities];

    if (this.isBoss) {
      for (const phaseId of this.state.activatedPhaseIds) {
        const phase = this.phases.find((p) => p.id === phaseId);
        if (phase) {
          allAbilities = allAbilities.concat(phase.abilities);
        }
      }
    }

    return allAbilities;
  }

  // ==================================================================================
  // BOSS PHASE METHODS
  // ==================================================================================

  /**
   * Check if any boss phases should trigger based on current health
   *
   * @returns Array of phases that should now activate (in order)
   *
   * @example
   * const result = boss.takeDamage(100);
   * const newPhases = boss.checkPhaseTransitions();
   * for (const phase of newPhases) {
   *   console.log(`Boss entered ${phase.name} phase!`);
   *   // Apply phase stat modifiers, trigger phase abilities, etc.
   * }
   */
  checkPhaseTransitions(): BossPhase[] {
    if (!this.isBoss || this.phases.length === 0) return [];

    const healthPercent = (this.state.currentHealth / this.maxHealth) * 100;
    const activatedPhases: BossPhase[] = [];

    // Check phases in order (highest health threshold first)
    const sortedPhases = [...this.phases].sort(
      (a, b) => b.triggersAtHealthPercent - a.triggersAtHealthPercent
    );

    for (const phase of sortedPhases) {
      // Skip already activated phases
      if (this.state.activatedPhaseIds.includes(phase.id)) continue;

      // Check if we've crossed the threshold
      if (healthPercent <= phase.triggersAtHealthPercent) {
        this.state.activatedPhaseIds.push(phase.id);
        activatedPhases.push(phase);

        // Initialize cooldowns for new phase abilities
        for (const ability of phase.abilities) {
          if (this.state.abilityCooldowns[ability.id] === undefined) {
            this.state.abilityCooldowns[ability.id] = 0;
          }
        }
      }
    }

    return activatedPhases;
  }

  /**
   * Get the currently active boss phase (if any)
   *
   * @returns The most recently activated phase, or null if no phases activated
   */
  getCurrentPhase(): BossPhase | null {
    if (this.state.activatedPhaseIds.length === 0) return null;
    const lastPhaseId =
      this.state.activatedPhaseIds[this.state.activatedPhaseIds.length - 1];
    return this.phases.find((p) => p.id === lastPhaseId) || null;
  }

  // ==================================================================================
  // LOOT METHODS
  // ==================================================================================

  /**
   * Roll for loot drops when entity dies
   *
   * @returns Array of loot drops that succeeded their chance roll
   *
   * @example
   * if (result.died) {
   *   const drops = enemy.rollLoot();
   *   for (const drop of drops) {
   *     givePlayerLoot(drop.type, drop.amount);
   *   }
   * }
   */
  rollLoot(): Array<LootDrop & { amount: number }> {
    if (!this.lootTable) return [];

    const drops: Array<LootDrop & { amount: number }> = [];

    for (const drop of this.lootTable.drops) {
      const roll = Math.random() * 100;
      if (roll <= drop.dropChance) {
        // Calculate actual amount within range
        const amount =
          drop.minAmount +
          Math.floor(Math.random() * (drop.maxAmount - drop.minAmount + 1));

        drops.push({
          ...drop,
          amount,
        });
      }
    }

    return drops;
  }

  // ==================================================================================
  // SERIALIZATION
  // ==================================================================================

  /**
   * Convert entity to a plain object for saving/debugging
   */
  toJSON(): object {
    return {
      definitionId: this.definitionId,
      category: this.category,
      baseStats: this.baseStats,
      state: { ...this.state },
      areaNumber: this.areaNumber,
      rarity: this.rarity,
      entityType: this.entityType,
    };
  }

  // ==================================================================================
  // PRIVATE HELPERS
  // ==================================================================================

  /**
   * Generate a unique runtime ID for this entity
   */
  private generateId(position: 0 | 1 | 2): string {
    const categoryPrefix = this.category.toLowerCase();
    return `${categoryPrefix}-${position}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)}`;
  }

  /**
   * Initialize cooldown tracking for all abilities
   */
  private initializeCooldowns(): Record<string, number> {
    const cooldowns: Record<string, number> = {};
    for (const ability of this.abilities) {
      cooldowns[ability.id] = 0;
    }
    return cooldowns;
  }

  /**
   * Calculate a stat value with all active buffs applied
   *
   * Modifiers are applied in order:
   * 1. Additive (+50)
   * 2. Percent (+25% of base)
   * 3. Multiplicative (x1.5)
   */
  private getModifiedStat(statName: ModifiableStat, baseValue: number): number {
    let additive = 0;
    let percentAdditive = 0;
    let multiplicative = 1;

    for (const buff of this.state.activeBuffs) {
      if (buff.modification.stat !== statName) continue;

      switch (buff.modification.type) {
        case "add":
          additive += buff.modification.value;
          break;
        case "percent":
          percentAdditive += buff.modification.value;
          break;
        case "multiply":
          multiplicative *= buff.modification.value;
          break;
      }
    }

    // Apply in order: base + additive + percent, then multiply
    const withAdditive = baseValue + additive;
    const withPercent = withAdditive + baseValue * (percentAdditive / 100);
    const final = withPercent * multiplicative;

    return Math.max(0, final);
  }
}

// ====================================================================================
// CONVENIENCE FUNCTION
// ====================================================================================

/**
 * Type guard to check if an entity is of a specific category
 *
 * @example
 * if (isEntityCategory(entity, EntityCategory.BOSS)) {
 *   // TypeScript knows entity is a boss
 *   const phases = entity.phases;
 * }
 */
export function isEntityCategory(
  entity: Entity,
  category: EntityCategory
): boolean {
  return entity.category === category;
}
