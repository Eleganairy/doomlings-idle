import { atom } from "jotai";
import type {
  CombatStats,
  SpawnedEnemy,
  SpawnedPlayer,
} from "../types/combat.types";
import { BASE_COMBAT_STATS } from "../config/combat-stats.config";

export const playerAttackProgressAtom = atom<number>(0);
export const enemyAttackProgressAtom = atom<number>(0);

export const maxNumberOfActiveEnemiesAtom = atom<number>(1);

export const enemiesSlainOnActiveStageAtom = atom<number>(0);

export const combatStatsAtom = atom<CombatStats>(BASE_COMBAT_STATS);

export const activePlayersAtom = atom<SpawnedPlayer[]>([]);
export const activeEnemiesAtom = atom<SpawnedEnemy[]>([]);

export const isCombatActiveAtom = atom<boolean>(false);
export const playerEnergyAtom = atom<number>(0);
