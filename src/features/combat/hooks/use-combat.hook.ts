/**
 * Combat Hook
 *
 * Manages combat state and actions using the Entity class system.
 */

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  activePlayersAtom,
  activeEnemiesAtom,
  isCombatActiveAtom,
  playerEnergyAtom,
} from "../store/combat.atoms";
import { activeAreaAtom } from "../../world/store/area.atoms";
import { useStageProgression } from "../../world/hooks/use-stage-progression.hook";
import {
  playerTrackedStatsAtom,
  upgradeLevelsAtom,
} from "../../progression/store/progression.atoms";
import { calculateEnergyBonusMultiplier } from "../../player/helpers/calculate-player-stats.helper";

// Entity system imports
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

  /**
   * Create player entities from definitions with upgrade buffs applied.
   */
  const createPlayerEntitiesWithUpgrades = (): Entity[] => {
    // Position 0 (front) = Healer, Position 1 (middle) = Electric, Position 2 (back) = Tank
    const players = [
      Entity.createPlayer(DRUID_SLIME, 0),
      Entity.createPlayer(ELECTRIC_SLIME, 1),
      Entity.createPlayer(TANK_SLIME, 2),
    ];

    // Apply upgrade buffs to each player
    for (const player of players) {
      applyUpgradeBuffsToPlayer(player, upgradeLevels);
    }

    return players;
  };

  /**
   * Create an enemy with upgrade debuffs applied.
   */
  const createEnemyWithDebuffs = (position: 0 | 1 | 2): Entity => {
    const enemy = spawnEnemyFromPool(
      activeArea.enemyPool,
      currentAreaId,
      currentStageNumber,
      position
    );
    applyUpgradeDebuffsToEnemy(enemy, upgradeLevels);
    return enemy;
  };

  /**
   * Initialize combat with 3 player slimes and 1 enemy
   */
  const startCombat = () => {
    if (activePlayers.length === 0) {
      setActivePlayers(createPlayerEntitiesWithUpgrades());
    }

    if (activeEnemies.length === 0) {
      setActiveEnemies([createEnemyWithDebuffs(1)]);
    }

    setIsCombatActive(true);
  };

  /**
   * Toggle combat on/off
   */
  const toggleCombat = () => {
    if (isCombatActive) {
      setIsCombatActive(false);
    } else {
      startCombat();
    }
  };

  /**
   * Handle loot and tracking when an enemy dies
   */
  const processEnemyDeath = (enemy: Entity) => {
    // Roll loot from enemy
    const lootDrops = enemy.rollLoot();

    // Calculate energy with bonus multiplier
    const energyMultiplier = calculateEnergyBonusMultiplier(upgradeLevels);

    // Process each drop
    for (const drop of lootDrops) {
      if (drop.type === "energy") {
        const energyGained = Math.floor(drop.amount * energyMultiplier);
        setPlayerEnergy((prev) => prev + energyGained);

        setPlayerTrackedStats((prev) => ({
          ...prev,
          totalEnergyGained: prev.totalEnergyGained + energyGained,
        }));
      }
      // TODO: Handle meteorite and areaLoot drops
    }

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
    }));
  };

  return {
    activePlayers,
    activeEnemies,
    isCombatActive,
    toggleCombat,
    createPlayerEntitiesWithUpgrades,
    processEnemyDeath,
  };
};
