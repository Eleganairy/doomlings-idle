import { useAtom, useAtomValue } from "jotai";
import {
  playerProgressAtom,
  currentAreaProgressAtom,
  currentStageProgressAtom,
} from "../store/progression.atoms";
import { useCallback } from "react";
import {
  createInitialAreaProgress,
  STAGES_PER_AREA,
} from "../config/progression.config";
import { useCombatReset } from "../../combat/hooks/use-combat-reset.hook";

/**
 * Custom hook for managing stage progression
 *
 * Provides methods to:
 * - Navigate between stages
 * - Track enemy kills
 * - Check stage completion
 * - Unlock new stages
 */
export const useStageProgression = () => {
  const [playerProgress, setPlayerProgress] = useAtom(playerProgressAtom);
  const currentAreaProgress = useAtomValue(currentAreaProgressAtom);
  const currentStageProgress = useAtomValue(currentStageProgressAtom);
  const { resetCombat } = useCombatReset();

  /**
   * Get all stages for the current area with their status
   */
  const availableStages = currentAreaProgress.stages;

  /**
   * Navigate to a specific stage (if unlocked)
   */
  const navigateToStage = useCallback(
    (stageNumber: number) => {
      const targetStage = currentAreaProgress.stages.find(
        (s) => s.stageNumber === stageNumber
      );

      if (!targetStage?.isUnlocked) {
        console.warn(`Stage ${stageNumber} is locked`);
        return;
      }

      // Reset combat state when switching stages
      resetCombat();

      setPlayerProgress((prev) => ({
        ...prev,
        currentStageNumber: stageNumber,
        areaProgress: {
          ...prev.areaProgress,
          [prev.currentAreaId]: {
            ...prev.areaProgress[prev.currentAreaId],
            currentStage: stageNumber,
          },
        },
      }));
    },
    [currentAreaProgress.stages, setPlayerProgress, resetCombat]
  );

  /**
   * Record an enemy kill and check for stage completion
   */
  const recordEnemyKill = useCallback(() => {
    setPlayerProgress((prev) => {
      const areaId = prev.currentAreaId;
      const stageNumber = prev.currentStageNumber;
      const areaProgress = prev.areaProgress[areaId];

      const updatedStages = areaProgress.stages.map((stage) => {
        if (stage.stageNumber !== stageNumber) return stage;

        // Don't count kills after stage is completed
        if (stage.isCompleted) return stage;

        const newKillCount = stage.enemiesKilled + 1;
        const isNowCompleted = newKillCount >= stage.enemiesRequired;

        return {
          ...stage,
          enemiesKilled: newKillCount,
          isCompleted: isNowCompleted,
        };
      });

      // Check if current stage is now completed and unlock next stage
      const currentStage = updatedStages.find(
        (s) => s.stageNumber === stageNumber
      );
      if (currentStage?.isCompleted && stageNumber < STAGES_PER_AREA) {
        const nextStageIndex = updatedStages.findIndex(
          (s) => s.stageNumber === stageNumber + 1
        );
        if (nextStageIndex !== -1) {
          updatedStages[nextStageIndex] = {
            ...updatedStages[nextStageIndex],
            isUnlocked: true,
          };
        }
      }

      return {
        ...prev,
        areaProgress: {
          ...prev.areaProgress,
          [areaId]: {
            ...areaProgress,
            stages: updatedStages,
          },
        },
      };
    });
  }, [setPlayerProgress]);

  /**
   * Check if the player can navigate to the next area
   */
  const canNavigateToNextArea = useCallback(() => {
    return currentAreaProgress.stages.every((stage) => stage.isCompleted);
  }, [currentAreaProgress.stages]);

  /**
   * Navigate to the next area (if current area is completed)
   */
  const navigateToNextArea = useCallback(
    (nextAreaId: number) => {
      if (!canNavigateToNextArea()) {
        console.warn("Current area not completed yet");
        return;
      }

      // Reset combat state when switching areas
      resetCombat();

      setPlayerProgress((prev) => {
        // Initialize the next area if it doesn't exist
        const nextAreaProgress =
          prev.areaProgress[nextAreaId] ||
          createInitialAreaProgress(nextAreaId);

        return {
          ...prev,
          currentAreaId: nextAreaId,
          currentStageNumber: 1,
          areaProgress: {
            ...prev.areaProgress,
            [nextAreaId]: nextAreaProgress,
          },
        };
      });
    },
    [canNavigateToNextArea, setPlayerProgress, resetCombat]
  );

  /**
   * Reset the current stage progress (called when player dies)
   */
  const resetStageProgress = useCallback(() => {
    setPlayerProgress((prev) => {
      const areaId = prev.currentAreaId;
      const stageNumber = prev.currentStageNumber;
      const areaProgress = prev.areaProgress[areaId];

      const updatedStages = areaProgress.stages.map((stage) => {
        if (stage.stageNumber !== stageNumber) return stage;

        return {
          ...stage,
          enemiesKilled: 0,
        };
      });

      return {
        ...prev,
        areaProgress: {
          ...prev.areaProgress,
          [areaId]: {
            ...areaProgress,
            stages: updatedStages,
          },
        },
      };
    });
  }, [setPlayerProgress]);

  return {
    // Current state
    currentStage: currentStageProgress,
    availableStages,
    currentAreaId: playerProgress.currentAreaId,
    currentStageNumber: playerProgress.currentStageNumber,

    // Actions
    navigateToStage,
    recordEnemyKill,
    resetStageProgress,
    canNavigateToNextArea,
    navigateToNextArea,
  };
};
