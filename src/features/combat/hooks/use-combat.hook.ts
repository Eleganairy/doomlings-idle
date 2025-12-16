/**
 * Combat Hook
 *
 * Provides UI-level combat controls for the Open World page.
 * The actual combat loop runs in usePersistentCombat at the layout level.
 *
 * This hook is simplified to only expose:
 * - Combat state (players, enemies, isActive)
 * - Toggle function to start/pause combat
 */

import { useAtom, useAtomValue } from "jotai";
import {
  activePlayersAtom,
  activeEnemiesAtom,
  isCombatActiveAtom,
} from "../store/combat.atoms";

export const useCombat = () => {
  const activePlayers = useAtomValue(activePlayersAtom);
  const activeEnemies = useAtomValue(activeEnemiesAtom);
  const [isCombatActive, setIsCombatActive] = useAtom(isCombatActiveAtom);

  /**
   * Toggle combat on/off.
   * Entity creation is handled by usePersistentCombat when combat becomes active.
   */
  const toggleCombat = () => {
    setIsCombatActive(!isCombatActive);
  };

  return {
    activePlayers,
    activeEnemies,
    isCombatActive,
    toggleCombat,
  };
};
