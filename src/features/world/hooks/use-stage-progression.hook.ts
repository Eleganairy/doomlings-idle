import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import { useCombatReset } from "../../combat/hooks/use-combat-reset.hook";
import {
  createInitialAreaProgress,
  STAGES_PER_AREA,
} from "../config/world-progression.config";
import {
  currentAreaProgressAtom,
  currentStageProgressAtom,
  worldProgressAtom,
} from "../store/world-progression.atoms";

/**
 * Custom hook for managing stage progression
 *
 * @method navigateToStage - Navigate to a specific stage if unlocked
 * @method recordEnemyKill - Record an enemy kill and check for stage completion
 * @method canNavigateToNextArea - Check if the player can navigate to the next area
 * @method navigateToNextArea - Navigate to the next area if current area is completed
 * @method resetStageProgress - Reset the current stage progress (called when player dies)
 */
export const useStageProgression = () => {
  const [worldProgress, setWorldProgress] = useAtom(worldProgressAtom);
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
        (stage) => stage.stageNumber === stageNumber
      );

      if (!targetStage?.isUnlocked) {
        console.warn(`Stage ${stageNumber} is locked`);
        return;
      }

      // Reset combat state when switching stages
      resetCombat();

      setWorldProgress((prev) => ({
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
    [currentAreaProgress.stages, setWorldProgress, resetCombat]
  );

  /**
   * Record an enemy kill and check for stage completion
   */
  const recordEnemyKill = useCallback(() => {
    setWorldProgress((prev) => {
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
  }, [setWorldProgress]);

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

      setWorldProgress((prev) => {
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
    [canNavigateToNextArea, setWorldProgress, resetCombat]
  );

  /**
   * Reset the current stage progress (called when player dies)
   */
  const resetStageProgress = useCallback(() => {
    setWorldProgress((prev) => {
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
  }, [setWorldProgress]);

  return {
    // Current state
    currentStage: currentStageProgress,
    availableStages,
    currentAreaId: worldProgress.currentAreaId,
    currentStageNumber: worldProgress.currentStageNumber,

    // Actions
    navigateToStage,
    recordEnemyKill,
    resetStageProgress,
    canNavigateToNextArea,
    navigateToNextArea,
  };
};
