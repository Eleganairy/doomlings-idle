import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { EntityManager } from "../managers/entity.manager";
import {
  activePlayersAtom,
  activeEnemiesAtom,
  isCombatActiveAtom,
  playerEnergyAtom,
} from "../store/combat.atoms";
import { BASE_PLAYER_STATS } from "../../player/config/player-stats.config";
import { activeAreaAtom } from "../../world/store/area.atoms";
import { getRandomEnemy } from "../helpers/get-random-enemy.helper";
import { useCallback } from "react";
import type { Enemy, SpawnedEnemy, SpawnedPlayer } from "../types/combat.types";

export const useCombat = () => {
  const [activePlayers, setActivePlayers] = useAtom(activePlayersAtom);
  const [activeEnemies, setActiveEnemies] = useAtom(activeEnemiesAtom);
  const [isCombatActive, setIsCombatActive] = useAtom(isCombatActiveAtom);
  const setPlayerEnergy = useSetAtom(playerEnergyAtom);

  const activeArea = useAtomValue(activeAreaAtom);

  // Initialize combat (spawn initial entities)
  const startCombat = () => {
    if (activePlayers.length === 0) {
      setActivePlayers([EntityManager.spawnPlayer(1, BASE_PLAYER_STATS)]);
    }

    if (activeEnemies.length === 0) {
      setActiveEnemies([
        EntityManager.spawnEnemy(0, getRandomEnemy(activeArea.enemyPool)),
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
      // Give loot
      setPlayerEnergy((prev) => prev + enemy.lootTable.energy);
      // Remove the enemy from the enemies array
      setActiveEnemies((current) => current.filter((e) => e.id !== enemy.id));
    },
    [setActiveEnemies, setPlayerEnergy]
  );

  // Player attacks enemies
  const playerAttack = useCallback(
    (damage: number, enemyPool: Record<string, Enemy>) => {
      setActiveEnemies((current) => {
        const updated = EntityManager.dealDamage(
          current,
          damage,
          handleEnemyDeath
        );

        // If no enemies left, spawn new wave
        if (updated.length === 0) {
          return [EntityManager.spawnEnemy(0, getRandomEnemy(enemyPool))];
        }

        return updated;
      });
    },
    [handleEnemyDeath, setActiveEnemies]
  );

  // Enemy attacks players
  const enemyAttack = useCallback(
    (damage: number) => {
      setActivePlayers((current) => {
        const updated = EntityManager.dealDamage(
          current,
          damage,
          handlePlayerDeath
        );

        // If no players left, spawn new player
        if (updated.length === 0) {
          return [EntityManager.spawnPlayer(0, BASE_PLAYER_STATS)];
        }

        return updated;
      });
    },
    [handlePlayerDeath, setActivePlayers]
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
