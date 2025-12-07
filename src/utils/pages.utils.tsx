import { PageTypes } from "../constants/pages.constants";
import { OpenWorldPage, UpgradesPage, TraitsPage, StatsPage } from "../pages";

export const pageComponents: Record<
  PageTypes,
  React.ComponentType | undefined
> = {
  [PageTypes.OPEN_WORLD]: OpenWorldPage,
  [PageTypes.UPGRADES]: UpgradesPage,
  [PageTypes.TRAITS]: TraitsPage,
  [PageTypes.EVOLVE]: undefined,
  [PageTypes.POKEDEX]: undefined,
  [PageTypes.METEORITE]: undefined,
  [PageTypes.CRAFTING]: undefined,
  [PageTypes.RELICS]: undefined,
  [PageTypes.PETS]: undefined,
  [PageTypes.TRAINING]: undefined,
  [PageTypes.STATS]: StatsPage,
  [PageTypes.SETTINGS]: undefined,
};
