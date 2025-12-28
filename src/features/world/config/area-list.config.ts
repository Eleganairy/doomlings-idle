import type {
  EnemyDefinition,
  AreaLootItem,
} from "../../entity/types/entity.types";
import {
  ENEMY_LIST_AREA_1,
  ENEMY_LIST_AREA_2,
} from "../../enemy/config/enemy-list.config";

// ====================================================================================
// AREA INTERFACE
// ====================================================================================

export interface Area {
  id: number;
  name: string;
  description: string;
  background: string;
  enemyPool: Record<string, EnemyDefinition>;
  /** Area-specific loot that enemies can drop */
  areaLoot: AreaLootItem[];
  /** Boss ID for this area (optional) */
  bossId?: string;
}

// ====================================================================================
// AREA LIST
// ====================================================================================

export const AREA_LIST: Area[] = [
  {
    id: 1,
    name: "Grasslands",
    description: "First contact with earth's surface",
    background: "/area/Grasslands.png",
    enemyPool: ENEMY_LIST_AREA_1,
    areaLoot: [
      {
        id: "grass_fiber",
        name: "Grass Fiber",
        icon: "/loot/grass-fiber.png",
        description: "Fibrous plant material useful for crafting",
        baseDropChance: 25,
      },
      {
        id: "wildflower",
        name: "Wildflower",
        icon: "/loot/wildflower.png",
        description: "A colorful meadow flower",
        baseDropChance: 15,
      },
      {
        id: "insect_wing",
        name: "Insect Wing",
        icon: "/loot/insect-wing.png",
        description: "Iridescent wing from a grassland insect",
        baseDropChance: 10,
      },
    ],
    bossId: "forest_guardian",
  },
  {
    id: 2,
    name: "Abandoned Subway",
    description: "Abandoned subway system",
    background: "/area/Subway.png",
    enemyPool: ENEMY_LIST_AREA_2,
    areaLoot: [
      {
        id: "living_bark",
        name: "Living Bark",
        icon: "/loot/living-bark.png",
        description: "Bark that still pulses with life energy",
        baseDropChance: 25,
      },
      {
        id: "sap_crystal",
        name: "Sap Crystal",
        icon: "/loot/sap-crystal.png",
        description: "Crystallized tree sap glowing with power",
        baseDropChance: 15,
      },
      {
        id: "enchanted_leaf",
        name: "Enchanted Leaf",
        icon: "/loot/enchanted-leaf.png",
        description: "A leaf that shimmers with magical energy",
        baseDropChance: 10,
      },
    ],
  },
  {
    id: 3,
    name: "Mushroom Grove",
    description: "Underground fungal network mutated by the meteor debris",
    background: "/area/Mushroom.png",
    enemyPool: ENEMY_LIST_AREA_2,
    areaLoot: [
      {
        id: "glowing_spore",
        name: "Glowing Spore",
        icon: "/loot/glowing-spore.png",
        description: "Bioluminescent fungal spore",
        baseDropChance: 25,
      },
      {
        id: "mycelium_thread",
        name: "Mycelium Thread",
        icon: "/loot/mycelium-thread.png",
        description: "Strong fibrous thread from the fungal network",
        baseDropChance: 15,
      },
      {
        id: "cave_crystal",
        name: "Cave Crystal",
        icon: "/loot/cave-crystal.png",
        description: "A rare crystal formed in the depths",
        baseDropChance: 10,
      },
    ],
    bossId: "mushroom_king",
  },
];

// ====================================================================================
// HELPER FUNCTIONS
// ====================================================================================

/**
 * Get area by ID
 */
export function getAreaById(areaId: number): Area | undefined {
  return AREA_LIST.find((area) => area.id === areaId);
}

/**
 * Get area loot for a specific area
 */
export function getAreaLoot(areaId: number): AreaLootItem[] {
  const area = getAreaById(areaId);
  return area?.areaLoot || [];
}
