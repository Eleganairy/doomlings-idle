import { useSetAtom } from "jotai";
import {
  activePlayersAtom,
  activeEnemiesAtom,
  isCombatActiveAtom,
} from "../store/combat.atoms";

export const useCombatReset = () => {
  const setActivePlayers = useSetAtom(activePlayersAtom);
  const setActiveEnemies = useSetAtom(activeEnemiesAtom);
  const setIsCombatActive = useSetAtom(isCombatActiveAtom);

  const resetCombat = () => {
    setActivePlayers([]);
    setActiveEnemies([]);
    setIsCombatActive(false);
  };

  return { resetCombat };
};
