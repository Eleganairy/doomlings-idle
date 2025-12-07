import { atom } from "jotai";
import { ALL_UPGRADES, TRAITS } from "../config/progression.config";
import {
  type Upgrade,
  type Trait,
  type PlayerTrackedStats,
  UpgradeId,
  TraitId,
  TrackedStatType,
} from "../types/progression.types";

// ===== UPGRADE LEVELS STATE =====

/** Current level for each upgrade (initialized to 0) */
const initialUpgradeLevels: Record<UpgradeId, number> = {
  [UpgradeId.ATTACK_DAMAGE]: 0,
  [UpgradeId.HEALTH]: 0,
  [UpgradeId.SPIKY]: 0,
  [UpgradeId.FUR]: 0,
  [UpgradeId.MUSCLES]: 0,
  [UpgradeId.THICKER_SKIN]: 0,
  [UpgradeId.WARM_BLOODED]: 0,
};

export const upgradeLevelsAtom =
  atom<Record<UpgradeId, number>>(initialUpgradeLevels);

// ===== PLAYER TRACKED STATS =====

const initialPlayerTrackedStats: PlayerTrackedStats = {
  totalEnemiesKilled: 0,
  enemyKillsByName: {},
  highestSingleHitDamage: 0,
  totalDamageTaken: 0,
  totalEnergyGained: 0,
};

export const playerTrackedStatsAtom = atom<PlayerTrackedStats>(
  initialPlayerTrackedStats
);

// ===== DERIVED ATOMS =====

/** Get the current tracked value for a specific trait */
function getTrackedValueForTrait(
  stats: PlayerTrackedStats,
  trait: Trait
): number {
  switch (trait.trackedStat) {
    case TrackedStatType.TOTAL_ENEMIES_KILLED:
      return stats.totalEnemiesKilled;
    case TrackedStatType.SPECIFIC_ENEMY_KILLED:
      return stats.enemyKillsByName[trait.trackedEnemyName ?? ""] ?? 0;
    case TrackedStatType.HIGHEST_SINGLE_HIT:
      return stats.highestSingleHitDamage;
    case TrackedStatType.TOTAL_DAMAGE_TAKEN:
      return stats.totalDamageTaken;
    case TrackedStatType.TOTAL_ENERGY_GAINED:
      return stats.totalEnergyGained;
    default:
      return 0;
  }
}

/** List of completed trait IDs */
export const completedTraitIdsAtom = atom<TraitId[]>((get) => {
  const stats = get(playerTrackedStatsAtom);
  return TRAITS.filter(
    (t) => getTrackedValueForTrait(stats, t) >= t.goalValue
  ).map((t) => t.id);
});

/** Get trait progress data (current value / goal) for each trait */
export const traitProgressAtom = atom((get) => {
  const stats = get(playerTrackedStatsAtom);
  return TRAITS.map((trait) => ({
    trait,
    currentValue: getTrackedValueForTrait(stats, trait),
    goalValue: trait.goalValue,
    isCompleted: getTrackedValueForTrait(stats, trait) >= trait.goalValue,
  }));
});

/** List of unlocked upgrades (base + those with completed traits) */
export const unlockedUpgradesAtom = atom<Upgrade[]>((get) => {
  const completedTraitIds = get(completedTraitIdsAtom);
  return ALL_UPGRADES.filter(
    (u) => !u.unlockedByTrait || completedTraitIds.includes(u.unlockedByTrait)
  );
});

/** Helper to export for use in calculate-player-stats */
export { getTrackedValueForTrait };
