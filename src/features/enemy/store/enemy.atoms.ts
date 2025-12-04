import { atom } from "jotai";
import { ENEMY_LIST_AREA_1 } from "../config/enemy-list.config";
import type { Enemy } from "../types/enemy.types";

// Initial enemy state
export const enemyAtom = atom<Enemy>(ENEMY_LIST_AREA_1[0]);
