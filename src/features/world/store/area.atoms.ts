import { atom } from "jotai";
import { AREA_LIST, type Area } from "../config/area-list.config";
import { worldProgressAtom } from "./world-progression.atoms";

/**
 * Derived atom that automatically syncs with player's current area
 */
export const activeAreaAtom = atom<Area>((get) => {
  const worldProgress = get(worldProgressAtom);
  const currentArea = AREA_LIST.find(
    (area) => area.id === worldProgress.currentAreaId
  );
  return currentArea || AREA_LIST[0];
});
