import { useEffect, useState } from "react";

interface CombatEntity {
  id: string;
  attackSpeed: number;
}

interface UseEntityCombatProps {
  entity: CombatEntity;
  isActive: boolean;
}

/**
 * Hook to display attack progress bar for an entity.
 * Does NOT trigger actual attacks - that's handled by usePersistentCombat.
 * This is purely for visual feedback.
 */
export const useEntityCombat = ({ entity, isActive }: UseEntityCombatProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const TICK_RATE = 50; // 50ms ticks for smooth animation
    const attackIntervalMs = 1000 / entity.attackSpeed;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += TICK_RATE;

      if (elapsed >= attackIntervalMs) {
        elapsed = 0;
        setProgress(0);
      } else {
        const currentProgress = (elapsed / attackIntervalMs) * 100;
        setProgress(Math.min(currentProgress, 100));
      }
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [isActive, entity.attackSpeed, entity.id]);

  return { progress };
};
