export enum PageTypes {
  OPEN_WORLD = "Open World",
  UPGRADES = "Upgrades",
  TRAITS = "Traits",
  LAB = "Lab",
  POKEDEX = "Pokédex",
  METEORITE = "Meteorite",
  CRAFTING = "Crafting",
  RELICS = "Relics",
  PETS = "Pets",
  TERRITORY_CONTROL = "Territory Control",
  STATS = "Stats",
  SETTINGS = "Settings",
}

export type Page = {
  id: PageTypes;
  name: string;
  icon: string;
  background: string;
  lockedByBossNumber: number;
};

export const Pages: Page[] = [
  {
    id: PageTypes.OPEN_WORLD,
    name: "Open World",
    icon: "/icons/OpenWorldIcon.png",
    background: "/area/GrasslandsBackground.png",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.UPGRADES,
    name: "Upgrades",
    icon: "/icons/UpgradesIcon.png",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.TRAITS,
    name: "Traits",
    icon: "/icons/TraitsIcon.png",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.LAB,
    name: "Lab",
    icon: "/icons/LabIcon.png",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.POKEDEX,
    name: "Pokédex",
    icon: "/icons/PokedexIcon.png",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.METEORITE,
    name: "Meteorite",
    icon: "icon",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.CRAFTING,
    name: "Crafting",
    icon: "icon",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.RELICS,
    name: "Relics",
    icon: "icon",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.PETS,
    name: "Pets",
    icon: "icon",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.TERRITORY_CONTROL,
    name: "Territory",
    icon: "icon",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.STATS,
    name: "Stats",
    icon: "/icons/StatsIcon.png",
    background: "background",
    lockedByBossNumber: 0,
  },
  {
    id: PageTypes.SETTINGS,
    name: "Settings",
    icon: "/icons/EditIcon.png",
    background: "background",
    lockedByBossNumber: 0,
  },
];
