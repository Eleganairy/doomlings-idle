/**
 * Persistent Combat Hook
 *
 * Runs the combat loop continuously, even when on other pages.
 * Uses the Entity class system for all combat operations.
 */

import { useCallback, useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  activePlayersAtom,
  activeEnemiesAtom,
  isCombatActiveAtom,
  playerEnergyAtom,
} from "../store/combat.atoms";
import { activeAreaAtom } from "../../world/store/area.atoms";
import {
  playerTrackedStatsAtom,
  upgradeLevelsAtom,
} from "../../progression/store/progression.atoms";
import { calculateEnergyBonusMultiplier } from "../../progression/services/stat-modifiers.service";
import { useStageProgression } from "../../world/hooks/use-stage-progression.hook";

// Entity system
import { Entity } from "../../entity/entity.class";
import { PLAYER_DEFINITIONS } from "../../entity/config/player-definitions.config";
import { spawnEnemyFromPool } from "../helpers/spawn-enemy.helper";
import {
  applyUpgradeBuffsToPlayer,
  applyUpgradeDebuffsToEnemy,
} from "../../entity/helpers/apply-upgrade-buffs.helper";
import { executeAbility } from "../../entity/helpers/execute-ability.helper";
import { AbilityTrigger } from "../../entity/types/entity.types";
import { teamForCombatAtom } from "../../team/store/team.atoms";

const TICK_RATE = 50; // 50ms ticks for combat loop

/**
 * Persistent combat manager that runs combat even when on other pages.
 * This hook should be placed at the layout level so it's always mounted.
 */
export const usePersistentCombat = () => {
  const [activePlayers, setActivePlayers] = useAtom(activePlayersAtom);
  const [activeEnemies, setActiveEnemies] = useAtom(activeEnemiesAtom);
  const isCombatActive = useAtomValue(isCombatActiveAtom);
  const setPlayerEnergy = useSetAtom(playerEnergyAtom);
  const setPlayerTrackedStats = useSetAtom(playerTrackedStatsAtom);
  const upgradeLevels = useAtomValue(upgradeLevelsAtom);
  const activeArea = useAtomValue(activeAreaAtom);
  const teamForCombat = useAtomValue(teamForCombatAtom);
  const {
    recordEnemyKill,
    resetStageProgress,
    currentAreaId,
    currentStageNumber,
  } = useStageProgression();

  // Use refs to avoid stale closures in the interval
  const activePlayersRef = useRef(activePlayers);
  const activeEnemiesRef = useRef(activeEnemies);
  const upgradeLevelsRef = useRef(upgradeLevels);
  const isCombatActiveRef = useRef(isCombatActive);

  // Keep refs updated
  useEffect(() => {
    activePlayersRef.current = activePlayers;
  }, [activePlayers]);

  useEffect(() => {
    activeEnemiesRef.current = activeEnemies;
  }, [activeEnemies]);

  useEffect(() => {
    upgradeLevelsRef.current = upgradeLevels;
  }, [upgradeLevels]);

  // Re-apply upgrade buffs to existing players when upgrade levels change
  useEffect(() => {
    if (activePlayers.length === 0) return;

    // Clear old upgrade buffs and re-apply with new levels
    for (const player of activePlayers) {
      // Store old max health before removing buffs
      const oldMaxHealth = player.maxHealth;

      // Clear existing upgrade buffs (they start with "upgrade_buff_")
      const upgradeBuffIds = player.activeBuffs
        .filter((buff) => buff.sourceAbilityId.startsWith("upgrade_buff_"))
        .map((buff) => buff.sourceAbilityId);

      for (const buffId of upgradeBuffIds) {
        player.removeBuffsFromAbility(buffId);
      }

      // Apply fresh upgrade buffs
      applyUpgradeBuffsToPlayer(player, upgradeLevels);

      // Sync health if max health changed (e.g., health upgrade purchased)
      player.syncHealthWithMaxChange(oldMaxHealth);
    }
  }, [upgradeLevels, activePlayers]);

  useEffect(() => {
    isCombatActiveRef.current = isCombatActive;
  }, [isCombatActive]);

  // Track attack timers per entity
  const playerAttackTimers = useRef<Record<string, number>>({});
  const enemyAttackTimers = useRef<Record<string, number>>({});
  const lastUpdateTime = useRef<number>(0);

  useEffect(() => {
    lastUpdateTime.current = performance.now();
  }, []);

  /**
   * Execute all abilities with a specific trigger for an entity
   */
  const executeTriggeredAbilities = (
    entity: Entity,
    trigger: AbilityTrigger,
    friendlyEntities: Entity[],
    enemyEntities: Entity[]
  ) => {
    const abilities = entity.getAbilitiesForTrigger(trigger);
    for (const ability of abilities) {
      executeAbility(entity, ability, friendlyEntities, enemyEntities);
    }
  };

  /**
   * Create player entities for respawn.
   * Uses the player's configured team from teamForCombatAtom.
   * Applies all purchased upgrade buffs to each player.
   */
  const createPlayerEntitiesWithUpgrades = useCallback((): Entity[] => {
    // Create players based on team configuration
    const players: Entity[] = [];
    console.log(teamForCombat);
    for (const { slimeId, position } of teamForCombat) {
      const definition = PLAYER_DEFINITIONS[slimeId];
      if (definition) {
        players.push(Entity.createPlayer(definition, position));
      }
    }

    // Apply upgrade buffs to each player
    for (const player of players) {
      applyUpgradeBuffsToPlayer(player, upgradeLevelsRef.current);
      // Sync health to max after buffs so players spawn at full buffed HP
      player.syncHealthToMax();
    }

    // Trigger ON_SPAWN abilities for all players
    const currentEnemies = activeEnemiesRef.current;
    for (const player of players) {
      executeTriggeredAbilities(
        player,
        AbilityTrigger.ON_SPAWN,
        players,
        currentEnemies
      );
    }

    return players;
  }, [teamForCombat]);

  /**
   * Create an enemy entity with upgrade debuffs applied.
   */
  const createEnemyWithDebuffs = useCallback(
    (position: 0 | 1 | 2): Entity => {
      const enemy = spawnEnemyFromPool(
        activeArea.enemyPool,
        currentAreaId,
        currentStageNumber,
        position
      );
      applyUpgradeDebuffsToEnemy(enemy, upgradeLevelsRef.current);

      // Trigger ON_SPAWN abilities for the enemy
      const currentPlayers = activePlayersRef.current;
      const currentEnemies = activeEnemiesRef.current;
      executeTriggeredAbilities(
        enemy,
        AbilityTrigger.ON_SPAWN,
        [...currentEnemies, enemy],
        currentPlayers
      );

      return enemy;
    },
    [activeArea.enemyPool, currentAreaId, currentStageNumber]
  );

  /**
   * Process loot from a killed enemy
   */
  const processEnemyLoot = useCallback(
    (enemy: Entity) => {
      const lootDrops = enemy.rollLoot();
      const energyMultiplier = calculateEnergyBonusMultiplier(
        upgradeLevelsRef.current
      );

      for (const drop of lootDrops) {
        if (drop.type === "energy") {
          const energyGained = Math.floor(drop.amount * energyMultiplier);
          setPlayerEnergy((prev) => prev + energyGained);
          setPlayerTrackedStats((prev) => ({
            ...prev,
            totalEnergyGained: prev.totalEnergyGained + energyGained,
          }));
        }
      }

      recordEnemyKill();
      setPlayerTrackedStats((prev) => ({
        ...prev,
        totalEnemiesKilled: prev.totalEnemiesKilled + 1,
        enemyKillsByName: {
          ...prev.enemyKillsByName,
          [enemy.name]: (prev.enemyKillsByName[enemy.name] || 0) + 1,
        },
      }));
    },
    [setPlayerEnergy, setPlayerTrackedStats, recordEnemyKill]
  );

  // Main combat loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isCombatActiveRef.current) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - lastUpdateTime.current;
      lastUpdateTime.current = currentTime;

      const players = activePlayersRef.current;
      const enemies = activeEnemiesRef.current;

      // Initialize entities if combat just started and lists are empty
      if (players.length === 0) {
        setActivePlayers(createPlayerEntitiesWithUpgrades());
        return; // Wait for next tick to use new entities
      }

      if (enemies.length === 0) {
        setActiveEnemies([
          createEnemyWithDebuffs(1),
          createEnemyWithDebuffs(0),
          createEnemyWithDebuffs(2),
        ]);
        return; // Wait for next tick to use new entities
      }

      // =====================================================
      // ABILITY SYSTEM: Tick cooldowns and execute abilities
      // =====================================================

      // Update buff durations for all entities
      for (const player of players) {
        player.updateBuffs();
      }
      for (const enemy of enemies) {
        enemy.updateBuffs();
      }

      // Tick player abilities and execute ready ones
      for (const player of players) {
        const readyAbilities = player.tickAbilities(deltaTime);
        for (const ability of readyAbilities) {
          executeAbility(player, ability, players, enemies);
        }
      }

      // Tick enemy abilities and execute ready ones
      for (const enemy of enemies) {
        const readyAbilities = enemy.tickAbilities(deltaTime);
        for (const ability of readyAbilities) {
          executeAbility(enemy, ability, enemies, players);
        }
      }

      // =====================================================
      // ATTACK SYSTEM: Process attacks
      // =====================================================

      // Process player attacks
      for (const player of players) {
        const timerId = player.id;
        const currentTimer = playerAttackTimers.current[timerId] ?? 0;
        const attackIntervalMs = 1000 / player.attackSpeed;

        const newTime = currentTimer + deltaTime;

        if (newTime >= attackIntervalMs) {
          const damage = player.attackDamage;

          // Track highest single hit
          setPlayerTrackedStats((prev) => ({
            ...prev,
            highestSingleHitDamage: Math.max(
              prev.highestSingleHitDamage,
              damage
            ),
          }));

          // Deal damage to enemies
          setActiveEnemies((current) => {
            if (current.length === 0) return current;

            let remainingDamage = damage;
            const sortedEnemies = [...current].sort(
              (a, b) => a.position - b.position
            );
            const updatedEnemies: Entity[] = [];
            const diedEnemies: Entity[] = [];

            for (const enemy of sortedEnemies) {
              if (remainingDamage <= 0) {
                updatedEnemies.push(enemy);
                continue;
              }

              const damageResult = enemy.takeDamage(remainingDamage);

              if (damageResult.died) {
                remainingDamage = damageResult.overkill;
                diedEnemies.push(enemy);
                processEnemyLoot(enemy);
                delete enemyAttackTimers.current[enemy.id];
              } else {
                updatedEnemies.push(enemy);
                remainingDamage = 0;
              }
            }

            // Execute ON_DEATH abilities for dead enemies
            for (const deadEnemy of diedEnemies) {
              executeTriggeredAbilities(
                deadEnemy,
                AbilityTrigger.ON_DEATH,
                sortedEnemies, // friendlies = other enemies
                players
              );
            }

            // Spawn new enemy if all enemies died
            if (updatedEnemies.length === 0) {
              return [
                createEnemyWithDebuffs(1),
                createEnemyWithDebuffs(0),
                createEnemyWithDebuffs(2),
              ];
            }

            return updatedEnemies;
          });

          playerAttackTimers.current[timerId] = 0;
        } else {
          playerAttackTimers.current[timerId] = newTime;
        }
      }

      // Process enemy attacks
      for (const enemy of enemies) {
        const timerId = enemy.id;
        const currentTimer = enemyAttackTimers.current[timerId] ?? 0;
        const attackIntervalMs = 1000 / enemy.attackSpeed;

        const newTime = currentTimer + deltaTime;

        if (newTime >= attackIntervalMs) {
          const damage = enemy.attackDamage;

          // Track damage taken
          setPlayerTrackedStats((prev) => ({
            ...prev,
            totalDamageTaken: prev.totalDamageTaken + damage,
          }));

          // Deal damage to players
          setActivePlayers((current) => {
            if (current.length === 0) return current;

            let remainingDamage = damage;
            const sortedPlayers = [...current].sort(
              (a, b) => a.position - b.position
            );
            const updatedPlayers: Entity[] = [];

            for (const player of sortedPlayers) {
              if (remainingDamage <= 0) {
                updatedPlayers.push(player);
                continue;
              }

              const damageResult = player.takeDamage(remainingDamage);

              if (damageResult.died) {
                remainingDamage = damageResult.overkill;
                delete playerAttackTimers.current[player.id];
              } else {
                updatedPlayers.push(player);
                remainingDamage = 0;
              }
            }

            // Respawn all players if all died
            if (updatedPlayers.length === 0) {
              resetStageProgress();
              return createPlayerEntitiesWithUpgrades();
            }

            return updatedPlayers;
          });

          enemyAttackTimers.current[timerId] = 0;
        } else {
          enemyAttackTimers.current[timerId] = newTime;
        }
      }
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [
    activeArea.enemyPool,
    createEnemyWithDebuffs,
    createPlayerEntitiesWithUpgrades,
    currentAreaId,
    currentStageNumber,
    processEnemyLoot,
    recordEnemyKill,
    resetStageProgress,
    setActiveEnemies,
    setActivePlayers,
    setPlayerEnergy,
    setPlayerTrackedStats,
  ]);
};
