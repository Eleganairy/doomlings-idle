import { atom } from "jotai";
import { UPGRADES, TRAITS } from "../config/progression-list.config";
import type { Upgrade, Trait } from "../types/progression.types";

// Upgrades state
export const upgradesAtom = atom<Upgrade[]>(UPGRADES);

// Traits state
export const traitsAtom = atom<Trait[]>(TRAITS);
