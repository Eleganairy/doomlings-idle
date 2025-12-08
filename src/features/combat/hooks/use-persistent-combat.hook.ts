import { useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  activePlayersAtom,
  activeEnemiesAtom,
  isCombatActiveAtom,
  playerEnergyAtom,
} from "../store/combat.atoms";
import { activeAreaAtom } from "../../world/store/area.atoms";
import { getRandomEnemy } from "../helpers/get-random-enemy.helper";
import { EntityManager } from "../managers/entity.manager";
import type { SpawnedEnemy, SpawnedPlayer } from "../types/combat.types";
import {
  playerTrackedStatsAtom,
  upgradeLevelsAtom,
} from "../../progression/store/progression.atoms";
import {
  calculatePlayerStats,
  calculateEnergyBonusMultiplier,
} from "../../player/helpers/calculate-player-stats.helper";
import { useStageProgression } from "../../world/hooks/use-stage-progression.hook";

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

  // Main combat loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isCombatActiveRef.current) return;

      const players = activePlayersRef.current;
      const enemies = activeEnemiesRef.current;

      if (players.length === 0 || enemies.length === 0) return;

      // Process player attacks
      for (const player of players) {
        const timerId = player.id;
        const currentTime = playerAttackTimers.current[timerId] ?? 0;
        const attackIntervalMs = 1000 / player.attackSpeed;

        const newTime = currentTime + TICK_RATE;

        if (newTime >= attackIntervalMs) {
          // Player attacks!
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
            const updatedEnemies: SpawnedEnemy[] = [];

            for (const enemy of sortedEnemies) {
              if (remainingDamage <= 0) {
                updatedEnemies.push(enemy);
                continue;
              }

              const newHealth = enemy.currentHealth - remainingDamage;

              if (newHealth <= 0) {
                // Enemy died
                remainingDamage = Math.abs(newHealth);

                // Calculate energy with bonus
                const energyMultiplier = calculateEnergyBonusMultiplier(
                  upgradeLevelsRef.current
                );
                const energyGained = Math.floor(
                  enemy.lootTable.energy * energyMultiplier
                );

                setPlayerEnergy((prev) => prev + energyGained);
                recordEnemyKill();

                setPlayerTrackedStats((prev) => ({
                  ...prev,
                  totalEnemiesKilled: prev.totalEnemiesKilled + 1,
                  enemyKillsByName: {
                    ...prev.enemyKillsByName,
                    [enemy.name]: (prev.enemyKillsByName[enemy.name] || 0) + 1,
                  },
                  totalEnergyGained: prev.totalEnergyGained + energyGained,
                }));

                // Clean up enemy timer
                delete enemyAttackTimers.current[enemy.id];
              } else {
                updatedEnemies.push({ ...enemy, currentHealth: newHealth });
                remainingDamage = 0;
              }
            }

            // If no enemies left, spawn a new one
            if (updatedEnemies.length === 0) {
              return [
                EntityManager.spawnEnemy(
                  1,
                  getRandomEnemy(
                    activeArea.enemyPool,
                    currentAreaId,
                    currentStageNumber
                  )
                ),
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
        const currentTime = enemyAttackTimers.current[timerId] ?? 0;
        const attackIntervalMs = 1000 / enemy.attackSpeed;

        const newTime = currentTime + TICK_RATE;

        if (newTime >= attackIntervalMs) {
          const damage = enemy.attackDamage;

          // Track damage taken
          setPlayerTrackedStats((prev) => ({
            ...prev,
            totalDamageTaken: prev.totalDamageTaken + damage,
          }));

          // Deal damage to players
          setActivePlayers((players) => {
            if (players.length === 0) return players;

            let remainingDamage = damage;
            const sortedPlayers = [...players].sort(
              (a, b) => a.position - b.position
            );
            const updatedPlayers: SpawnedPlayer[] = [];

            for (const player of sortedPlayers) {
              if (remainingDamage <= 0) {
                updatedPlayers.push(player);
                continue;
              }

              const newHealth = player.currentHealth - remainingDamage;

              if (newHealth <= 0) {
                remainingDamage = Math.abs(newHealth);
                // Clean up player timer
                delete playerAttackTimers.current[player.id];
              } else {
                updatedPlayers.push({ ...player, currentHealth: newHealth });
                remainingDamage = 0;
              }
            }

            // If no players left, spawn a new one with upgraded stats
            if (updatedPlayers.length === 0) {
              // Reset stage progress when player dies
              resetStageProgress();

              const calculatedStats = calculatePlayerStats(
                upgradeLevelsRef.current
              );
              return [
                EntityManager.spawnPlayer(1, {
                  ...calculatedStats,
                  shield: 0,
                }),
              ];
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
    setActiveEnemies,
    setActivePlayers,
    setPlayerEnergy,
    setPlayerTrackedStats,
  ]);

  // Update player stats when upgrades change (when alive)
  useEffect(() => {
    if (activePlayers.length > 0) {
      const calculatedStats = calculatePlayerStats(upgradeLevels);

      setActivePlayers((players) =>
        players.map((player) => ({
          ...player,
          maxHealth: calculatedStats.maxHealth,
          // Only update current health if it exceeds new max, otherwise keep it
          currentHealth: Math.min(
            player.currentHealth,
            calculatedStats.maxHealth
          ),
          attackDamage: calculatedStats.attackDamage,
          attackSpeed: calculatedStats.attackSpeed,
          critChance: calculatedStats.critChance,
        }))
      );
    }
  }, [upgradeLevels, setActivePlayers]);
};
