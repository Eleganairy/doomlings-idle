import { atom } from "jotai";
import { ALL_UPGRADES, TRAITS } from "../config/progression.config";
import {
  type Upgrade,
  type Trait,
  type PlayerTrackedStats,
  ProgressionId,
  TrackedStatType,
} from "../types/progression.types";
import { bn } from "../../../utils/big-number.utils";

// ===== UPGRADE LEVELS STATE =====

/** Current level for each upgrade (initialized to 0) */
const initialUpgradeLevels: Record<ProgressionId, number> = {
  [ProgressionId.ATTACK_DAMAGE]: 0,
  [ProgressionId.HEALTH]: 0,
  [ProgressionId.SPIKY]: 0,
  [ProgressionId.FLUFFY]: 0,
  [ProgressionId.TEETHY]: 0,
  [ProgressionId.THICKER_SKIN]: 0,
  [ProgressionId.WARM_BLOODED]: 0,
  [ProgressionId.SLIMY]: 0,
  [ProgressionId.CHEESY]: 0,
  [ProgressionId.METAL_SHELLED]: 0,
  [ProgressionId.MORE_TEETH]: 0,
  [ProgressionId.TAIL]: 0,
  [ProgressionId.MUDDY]: 0,
  [ProgressionId.BETTER_VISION]: 0,
};

export const upgradeLevelsAtom =
  atom<Record<ProgressionId, number>>(initialUpgradeLevels);

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
export const completedTraitIdsAtom = atom<ProgressionId[]>((get) => {
  const stats = get(playerTrackedStatsAtom);
  return TRAITS.filter((trait) =>
    bn(getTrackedValueForTrait(stats, trait)).greaterThanOrEqual(
      trait.goalValue
    )
  ).map((trackedTrait) => trackedTrait.id);
});

/** Get trait progress data (current value / goal) for each trait */
export const traitProgressAtom = atom((get) => {
  const stats = get(playerTrackedStatsAtom);
  return TRAITS.map((trait) => ({
    trait,
    currentValue: getTrackedValueForTrait(stats, trait),
    goalValue: trait.goalValue,
    isCompleted: bn(getTrackedValueForTrait(stats, trait)).greaterThanOrEqual(
      trait.goalValue
    ),
  }));
});

/** List of unlocked upgrades (base + those with completed traits) */
export const unlockedUpgradesAtom = atom<Upgrade[]>((get) => {
  const completedTraitIds = get(completedTraitIdsAtom);
  return ALL_UPGRADES.filter(
    (upgrade) =>
      !upgrade.unlockedByTrait ||
      completedTraitIds.includes(upgrade.unlockedByTrait)
  );
});

/** Helper to export for use in calculate-player-stats */
export { getTrackedValueForTrait };
