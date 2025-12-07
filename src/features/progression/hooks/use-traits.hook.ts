import { useAtomValue } from "jotai";
import { TRAITS, getTraitsByTier } from "../config/progression.config";
import {
  completedTraitIdsAtom,
  traitProgressAtom,
} from "../store/progression.atoms";
import type { Trait, TraitId } from "../types/progression.types";

export const useTraits = () => {
  const completedTraitIds = useAtomValue(completedTraitIdsAtom);
  const traitProgress = useAtomValue(traitProgressAtom);

  /**
   * Check if a specific trait is completed
   */
  const isCompleted = (traitId: TraitId): boolean => {
    return completedTraitIds.includes(traitId);
  };

  /**
   * Get progress for a specific trait
   */
  const getProgress = (traitId: TraitId) => {
    return traitProgress.find((p) => p.trait.id === traitId);
  };

  /**
   * Get all traits for a tier with their progress
   */
  const getTraitsWithProgressByTier = (tier: number) => {
    const tierTraits = getTraitsByTier(tier);
    return tierTraits.map((trait) => {
      const progress = getProgress(trait.id);
      return {
        trait,
        currentValue: progress?.currentValue ?? 0,
        goalValue: trait.goalValue,
        isCompleted: progress?.isCompleted ?? false,
      };
    });
  };

  /**
   * Get list of available tiers (that have traits defined)
   */
  const getAvailableTiers = (): number[] => {
    const tiers = new Set(TRAITS.map((t) => t.tier));
    return Array.from(tiers).sort((a, b) => a - b);
  };

  return {
    completedTraitIds,
    traitProgress,
    isCompleted,
    getProgress,
    getTraitsWithProgressByTier,
    getAvailableTiers,
  };
};
