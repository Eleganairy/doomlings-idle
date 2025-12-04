import { atom } from "jotai";
import type { Enemy } from "../../enemy/types/enemy.types";
import type { CombatStats } from "../types/combat.types";
import { BASE_COMBAT_STATS } from "../config/combat-stats.config";

export const playerAttackProgressAtom = atom<number>(0);
export const enemyAttackProgressAtom = atom<number>(0);

export const activeEnemiesAtom = atom<Array<Enemy>>([]);
export const maxNumberOfActiveEnemiesAtom = atom<number>(1);

export const enemiesSlainOnActiveStageAtom = atom<number>(0);

export const combatStatsAtom = atom<CombatStats>(BASE_COMBAT_STATS);
