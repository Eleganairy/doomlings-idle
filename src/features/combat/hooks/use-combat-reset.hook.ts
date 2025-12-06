import { useSetAtom } from "jotai";
import {
  activePlayersAtom,
  activeEnemiesAtom,
  isCombatActiveAtom,
} from "../store/combat.atoms";

/**
 * Hook for resetting combat state
 *
 * Provides a function to clear all active entities and pause combat.
 * Useful when switching stages or areas to start fresh.
 */
export const useCombatReset = () => {
  const setActivePlayers = useSetAtom(activePlayersAtom);
  const setActiveEnemies = useSetAtom(activeEnemiesAtom);
  const setIsCombatActive = useSetAtom(isCombatActiveAtom);

  /**
   * Reset combat state to initial conditions
   * - Clears all active players
   * - Clears all active enemies
   * - Pauses combat
   */
  const resetCombat = () => {
    setActivePlayers([]);
    setActiveEnemies([]);
    setIsCombatActive(false);
  };

  return { resetCombat };
};
