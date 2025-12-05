import { atom } from "jotai";
import { AREA_LIST, type Area } from "../config/area-list.config";

export const activeAreaAtom = atom<Area>(AREA_LIST[0]);
