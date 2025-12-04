import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import {
  playerCombatStatsAtom,
  playerCurrentHealthAtom,
  playerEnergyAtom,
} from "../../player/store/player.atoms";
import {
  activeEnemiesAtom,
  combatStatsAtom,
  enemiesSlainOnActiveStageAtom,
  maxNumberOfActiveEnemiesAtom,
} from "../store/combat.atoms";
import { currentAreaAtom } from "../../world/store/area.atoms";
import { getRandomEnemy } from "../helpers/get-random-enemy.helper";

export function GameLoopProvider({ children }: { children: React.ReactNode }) {
  const [currentEnemies, setCurrentEnemies] = useAtom(activeEnemiesAtom);
  const [playerCurrentHealth, setPlayerCurrentHealth] = useAtom(
    playerCurrentHealthAtom
  );

  const playerCombatStats = useAtomValue(playerCombatStatsAtom);
  const currentArea = useAtomValue(currentAreaAtom);
  const maxNumberOfActiveEnemies = useAtomValue(maxNumberOfActiveEnemiesAtom);

  const setPlayerEnergy = useSetAtom(playerEnergyAtom);
  const setCombatStats = useSetAtom(combatStatsAtom);
  const setCurrentlySlainEnemies = useSetAtom(enemiesSlainOnActiveStageAtom);

  //Initialize first enemy
  useEffect(() => {
    if (currentEnemies.length === 0) {
      for (let i = 0; i < maxNumberOfActiveEnemies; i++) {
        setCurrentEnemies([
          ...currentEnemies,
          getRandomEnemy(currentArea.enemyPool),
        ]);
      }
    }
  }, [
    currentArea.enemyPool,
    currentEnemies,
    maxNumberOfActiveEnemies,
    setCurrentEnemies,
  ]);

  // Player attack loop
  useEffect(() => {
    if (currentEnemies.length === 0) return;

    const interval = setInterval(() => {
      //Check if the damage is critical
      let damage = playerCombatStats.totalAttackDamage;
      const isDamageCritical =
        Math.random() < playerCombatStats.totalCritChange;
      if (isDamageCritical) {
        damage *= 2;
      }

      // Check for the highest single hit damage dealt
      setCombatStats((stats) => ({
        ...stats,
        highestSingleHitDamageDealt: Math.max(
          stats.highestSingleHitDamageDealt,
          damage
        ),
      }));

      // Deal damage to the enemy
      setCurrentEnemies((enemies) => {
        let newEnemies = enemies;

        if (enemies.length > 0) {
          //Track the damage the player has left
          let damageLeft = damage;
          enemies.forEach((enemy) => {
            const newHealth = enemy.currentHealth - damageLeft;

            // Enemy slain functionality
            if (newHealth <= 0) {
              setPlayerEnergy((energy) => energy + enemy.lootTable.energy);
              setCurrentlySlainEnemies((slainAmount) => slainAmount + 1);

              // Reduce damageLeft by the amount of damage dealt
              // newHealth is a negative value
              damageLeft += newHealth;

              // Removes the enemy in front from the array
              if (enemies.length > 1) {
                newEnemies.slice(1);
              } else {
                newEnemies = [];
                for (let i = 0; i < maxNumberOfActiveEnemies; i++) {
                  newEnemies.push(getRandomEnemy(currentArea.enemyPool));
                }
              }
            }
          });
        }
        return newEnemies;
      });
    }, 1000 / playerCombatStats.totalAttackSpeed);

    return () => clearInterval(interval);
  });
}
