import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { EntityManager } from "../managers/entity.manager";
import {
  activePlayersAtom,
  activeEnemiesAtom,
  isCombatActiveAtom,
  playerEnergyAtom,
} from "../store/combat.atoms";
import { activeAreaAtom } from "../../world/store/area.atoms";
import { getRandomEnemy } from "../helpers/get-random-enemy.helper";
import { useCallback } from "react";
import type { Enemy, SpawnedEnemy, SpawnedPlayer } from "../types/combat.types";
import { useStageProgression } from "../../world/hooks/use-stage-progression.hook";
import {
  playerTrackedStatsAtom,
  upgradeLevelsAtom,
} from "../../progression/store/progression.atoms";
import {
  calculateEnergyBonusMultiplier,
  calculatePlayerStats,
} from "../../player/helpers/calculate-player-stats.helper";

export const useCombat = () => {
  const [activePlayers, setActivePlayers] = useAtom(activePlayersAtom);
  const [activeEnemies, setActiveEnemies] = useAtom(activeEnemiesAtom);
  const [isCombatActive, setIsCombatActive] = useAtom(isCombatActiveAtom);
  const setPlayerEnergy = useSetAtom(playerEnergyAtom);
  const setPlayerTrackedStats = useSetAtom(playerTrackedStatsAtom);
  const upgradeLevels = useAtomValue(upgradeLevelsAtom);

  const activeArea = useAtomValue(activeAreaAtom);
  const { recordEnemyKill, currentAreaId, currentStageNumber } =
    useStageProgression();

  // Initialize combat (spawn initial entities)
  const startCombat = () => {
    if (activePlayers.length === 0) {
      const calculatedStats = calculatePlayerStats(upgradeLevels);
      setActivePlayers([
        EntityManager.spawnPlayer(1, { ...calculatedStats, shield: 0 }),
      ]);
    }

    if (activeEnemies.length === 0) {
      // Spawn first enemy in middle slot (position 1)
      setActiveEnemies([
        EntityManager.spawnEnemy(
          1,
          getRandomEnemy(
            activeArea.enemyPool,
            currentAreaId,
            currentStageNumber
          )
        ),
      ]);
    }

    setIsCombatActive(true);
  };

  // Pause combat
  const pauseCombat = () => {
    setIsCombatActive(false);
  };

  // Toggle combat
  const toggleCombat = () => {
    if (isCombatActive) {
      pauseCombat();
    } else {
      startCombat();
    }
  };

  // Handle player death
  const handlePlayerDeath = useCallback(
    (player: SpawnedPlayer) => {
      // Remove the player from the players array
      setActivePlayers((current) => current.filter((p) => p.id !== player.id));
    },
    [setActivePlayers]
  );

  // Handle enemy death
  const handleEnemyDeath = useCallback(
    (enemy: SpawnedEnemy) => {
      // Calculate energy with bonus
      const energyMultiplier = calculateEnergyBonusMultiplier(upgradeLevels);
      const energyGained = Math.floor(
        enemy.lootTable.energy * energyMultiplier
      );

      // Give loot
      setPlayerEnergy((prev) => prev + energyGained);

      // Track kill for stage progression
      recordEnemyKill();

      // Track stats for traits
      setPlayerTrackedStats((prev) => ({
        ...prev,
        totalEnemiesKilled: prev.totalEnemiesKilled + 1,
        enemyKillsByName: {
          ...prev.enemyKillsByName,
          [enemy.name]: (prev.enemyKillsByName[enemy.name] || 0) + 1,
        },
        totalEnergyGained: prev.totalEnergyGained + energyGained,
      }));

      // Remove the enemy from the enemies array
      setActiveEnemies((current) => current.filter((e) => e.id !== enemy.id));
    },
    [
      setActiveEnemies,
      setPlayerEnergy,
      recordEnemyKill,
      setPlayerTrackedStats,
      upgradeLevels,
    ]
  );

  // Player attacks enemies
  const playerAttack = useCallback(
    (damage: number, enemyPool: Record<string, Enemy>) => {
      // Track highest single hit damage
      setPlayerTrackedStats((prev) => ({
        ...prev,
        highestSingleHitDamage: Math.max(prev.highestSingleHitDamage, damage),
      }));

      setActiveEnemies((current) => {
        const updated = EntityManager.dealDamage(
          current,
          damage,
          handleEnemyDeath
        );

        // If no enemies left, spawn new wave with difficulty scaling
        // Order: 1st → middle (1), 2nd → front (0), 3rd → back (2)
        if (updated.length === 0) {
          return [
            EntityManager.spawnEnemy(
              1,
              getRandomEnemy(enemyPool, currentAreaId, currentStageNumber)
            ),
          ];
        }

        return updated;
      });
    },
    [
      handleEnemyDeath,
      setActiveEnemies,
      setPlayerTrackedStats,
      currentAreaId,
      currentStageNumber,
    ]
  );

  // Enemy attacks players
  const enemyAttack = useCallback(
    (damage: number) => {
      // Track total damage taken
      setPlayerTrackedStats((prev) => ({
        ...prev,
        totalDamageTaken: prev.totalDamageTaken + damage,
      }));

      setActivePlayers((current) => {
        const updated = EntityManager.dealDamage(
          current,
          damage,
          handlePlayerDeath
        );

        // If no players left, spawn new player in middle slot (position 1)
        if (updated.length === 0) {
          const calculatedStats = calculatePlayerStats(upgradeLevels);
          return [
            EntityManager.spawnPlayer(1, { ...calculatedStats, shield: 0 }),
          ];
        }

        return updated;
      });
    },
    [handlePlayerDeath, setActivePlayers, setPlayerTrackedStats]
  );

  return {
    activePlayers,
    activeEnemies,
    isCombatActive,
    toggleCombat,
    playerAttack,
    enemyAttack,
  };
};
