/**
 * Persistent Combat Hook
 *
 * Runs the combat loop continuously, even when on other pages.
 * Uses the Entity class system for all combat operations.
 */

import { useEffect, useRef } from "react";
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
import { calculateEnergyBonusMultiplier } from "../../player/helpers/calculate-player-stats.helper";
import { useStageProgression } from "../../world/hooks/use-stage-progression.hook";

// Entity system
import { Entity } from "../../entity/entity.class";
import {
  DRUID_SLIME,
  ELECTRIC_SLIME,
  TANK_SLIME,
} from "../../entity/config/player-definitions.config";
import { spawnEnemyFromPool } from "../helpers/spawn-enemy.helper";
import {
  applyUpgradeBuffsToPlayer,
  applyUpgradeDebuffsToEnemy,
} from "../../entity/helpers/apply-upgrade-buffs.helper";

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
   * Create player entities for respawn.
   * Applies all purchased upgrade buffs to each player.
   */
  const createPlayerEntitiesWithUpgrades = (): Entity[] => {
    const players = [
      Entity.createPlayer(DRUID_SLIME, 0),
      Entity.createPlayer(ELECTRIC_SLIME, 1),
      Entity.createPlayer(TANK_SLIME, 2),
    ];

    // Apply upgrade buffs to each player
    for (const player of players) {
      applyUpgradeBuffsToPlayer(player, upgradeLevelsRef.current);
    }

    return players;
  };

  /**
   * Create an enemy entity with upgrade debuffs applied.
   */
  const createEnemyWithDebuffs = (position: 0 | 1 | 2): Entity => {
    const enemy = spawnEnemyFromPool(
      activeArea.enemyPool,
      currentAreaId,
      currentStageNumber,
      position
    );
    applyUpgradeDebuffsToEnemy(enemy, upgradeLevelsRef.current);
    return enemy;
  };

  /**
   * Process loot from a killed enemy
   */
  const processEnemyLoot = (enemy: Entity) => {
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
  };

  // Main combat loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isCombatActiveRef.current) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - lastUpdateTime.current;
      lastUpdateTime.current = currentTime;

      const players = activePlayersRef.current;
      const enemies = activeEnemiesRef.current;

      if (players.length === 0 || enemies.length === 0) return;

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

            for (const enemy of sortedEnemies) {
              if (remainingDamage <= 0) {
                updatedEnemies.push(enemy);
                continue;
              }

              const damageResult = enemy.takeDamage(remainingDamage);

              if (damageResult.died) {
                remainingDamage = damageResult.overkill;
                processEnemyLoot(enemy);
                delete enemyAttackTimers.current[enemy.id];
              } else {
                updatedEnemies.push(enemy);
                remainingDamage = 0;
              }
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
    currentAreaId,
    currentStageNumber,
    recordEnemyKill,
    resetStageProgress,
    setActiveEnemies,
    setActivePlayers,
    setPlayerEnergy,
    setPlayerTrackedStats,
  ]);
};
