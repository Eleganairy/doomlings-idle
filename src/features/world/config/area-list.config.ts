import type { Enemy } from "../../combat/types/combat.types";
import {
  ENEMY_LIST_AREA_1,
  ENEMY_LIST_AREA_2,
} from "../../enemy/config/enemy-list.config";

export interface Area {
  id: number;
  name: string;
  description: string;
  enemyPool: Record<string, Enemy>;
}

export const AREA_LIST: Area[] = [
  {
    id: 1,
    name: "Grasslands",
    description: "First contact with earth's surface",
    enemyPool: ENEMY_LIST_AREA_1,
  },
  {
    id: 2,
    name: "Living forest",
    description:
      "The plants have become sentient and hostile from the meteor's energy",
    enemyPool: ENEMY_LIST_AREA_2,
  },
  {
    id: 3,
    name: "Mushroom caverns",
    description: "Underground fungal network mutated by the meteor debris",
    enemyPool: ENEMY_LIST_AREA_2,
  },
];
