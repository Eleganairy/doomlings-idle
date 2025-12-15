import { atom } from "jotai";
import type { CombatStats } from "../types/combat.types";
import { BASE_COMBAT_STATS } from "../config/combat-stats.config";
import type { Entity } from "../../entity/entity.class";

export const playerAttackProgressAtom = atom<number>(0);
export const enemyAttackProgressAtom = atom<number>(0);

export const maxNumberOfActiveEnemiesAtom = atom<number>(1);

export const combatStatsAtom = atom<CombatStats>(BASE_COMBAT_STATS);

/** Active player entities in combat */
export const activePlayersAtom = atom<Entity[]>([]);

/** Active enemy entities in combat */
export const activeEnemiesAtom = atom<Entity[]>([]);

export const isCombatActiveAtom = atom<boolean>(false);
export const playerEnergyAtom = atom<number>(0);
