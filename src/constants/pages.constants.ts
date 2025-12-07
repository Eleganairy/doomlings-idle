export enum PageTypes {
  OPEN_WORLD = "Open World",
  UPGRADES = "Upgrades",
  TRAITS = "Traits",
  EVOLVE = "Evolve",
  POKEDEX = "Pokédex",
  METEORITE = "Meteorite",
  CRAFTING = "Crafting",
  RELICS = "Relics",
  PETS = "Pets",
  TRAINING = "Training",
  STATS = "Stats",
  SETTINGS = "Settings",
}

export type Page = {
  id: PageTypes;
  name: string;
  icon: string;
  lockedByBossNumber: number;
};

export const Pages: Page[] = [
  {
    id: PageTypes.OPEN_WORLD,
    name: "Open World",
    icon: "icon",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.UPGRADES,
    name: "Upgrades",
    icon: "icon",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.TRAITS,
    name: "Traits",
    icon: "icon",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.EVOLVE,
    name: "Evolve",
    icon: "icon",
    lockedByBossNumber: 3,
  },
  {
    id: PageTypes.POKEDEX,
    name: "Pokédex",
    icon: "icon",
    lockedByBossNumber: 5,
  },
  {
    id: PageTypes.METEORITE,
    name: "Meteorite",
    icon: "icon",
    lockedByBossNumber: 8,
  },
  {
    id: PageTypes.CRAFTING,
    name: "Crafting",
    icon: "icon",
    lockedByBossNumber: 12,
  },
  {
    id: PageTypes.RELICS,
    name: "Relics",
    icon: "icon",
    lockedByBossNumber: 20,
  },
  {
    id: PageTypes.PETS,
    name: "Pets",
    icon: "icon",
    lockedByBossNumber: 25,
  },
  {
    id: PageTypes.TRAINING,
    name: "Training",
    icon: "icon",
    lockedByBossNumber: 32,
  },
  {
    id: PageTypes.STATS,
    name: "Stats",
    icon: "icon",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.SETTINGS,
    name: "Settings",
    icon: "icon",
    lockedByBossNumber: 0,
  },
];
