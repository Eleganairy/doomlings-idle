import { atom } from "jotai";
import type { Player } from "../types/player.types";
import { PLAYER_CONFIG } from "../config/player-stats.config";
import { upgradesAtom } from "../../progression/store/progression.atoms";
import { calculatePlayerStats } from "../helpers/calculate-player-stats.helper";

// Base player state
export const playerCurrentHealthAtom = atom<number>(PLAYER_CONFIG.BASE_HEALTH);
export const playerEnergyAtom = atom<number>(0);
export const totalEnergyEarnedAtom = atom<number>(0);

// Derived player stats (calculated from upgrades)
export const playerCombatStatsAtom = atom<Player>((get) => {
  const upgrades = get(upgradesAtom);
  return calculatePlayerStats(upgrades);
});
