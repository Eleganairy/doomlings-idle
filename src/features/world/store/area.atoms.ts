import { atom } from "jotai";
import { AREA_LIST, type Area } from "../config/area-list.config";
import { playerProgressAtom } from "./world-progression.atoms";

/**
 * Derived atom that automatically syncs with player's current area
 */
export const activeAreaAtom = atom<Area>((get) => {
  const playerProgress = get(playerProgressAtom);
  const currentArea = AREA_LIST.find(
    (area) => area.id === playerProgress.currentAreaId
  );
  return currentArea || AREA_LIST[0];
});
