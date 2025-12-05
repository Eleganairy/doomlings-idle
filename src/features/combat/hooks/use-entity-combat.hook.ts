import { useEffect, useRef, useState } from "react";

interface CombatEntity {
  id: string;
  attackDamage: number;
  attackSpeed: number;
  critChance?: number;
}

interface UseEntityCombatProps {
  entity: CombatEntity;
  isActive: boolean;
  onAttack: (damage: number) => void;
}

export const useEntityCombat = ({
  entity,
  isActive,
  onAttack,
}: UseEntityCombatProps) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const lastAttackTimeRef = useRef<number>(0);
  const onAttackRef = useRef(onAttack);
  const entityRef = useRef(entity);

  // Keep onAttack ref updated without triggering effect restart
  useEffect(() => {
    onAttackRef.current = onAttack;
    entityRef.current = entity;
  });

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastAttackTimeRef.current = Date.now();
      return;
    }

    // Initialize start time when combat starts
    lastAttackTimeRef.current = Date.now();

    const TICK_RATE = 5; // 5ms ticks

    intervalRef.current = setInterval(() => {
      const currentEntity = entityRef.current;
      const now = Date.now();
      const timeSinceLastAttack = now - lastAttackTimeRef.current;

      // Check if enough time has passed for an attack
      if (timeSinceLastAttack >= currentEntity.attackSpeed) {
        // Calculate how many attacks should have happened
        const attackCount = Math.floor(
          timeSinceLastAttack / currentEntity.attackSpeed
        );

        // Execute all missed attacks (important for when tab was inactive)
        for (let i = 0; i < attackCount; i++) {
          const isCrit =
            currentEntity.critChance !== undefined &&
            Math.random() * 100 < currentEntity.critChance;

          const damage = currentEntity.attackDamage * (isCrit ? 2 : 1);

          // Use ref to avoid dependency issues
          onAttackRef.current(damage);
        }

        // Update last attack time (accounting for all attacks)
        lastAttackTimeRef.current =
          now - (timeSinceLastAttack % currentEntity.attackSpeed);
        setProgress(0);
      } else {
        // Update progress based on actual elapsed time
        const currentProgress =
          (timeSinceLastAttack / currentEntity.attackSpeed) * 100;
        setProgress(Math.min(currentProgress, 100));
      }
    }, TICK_RATE) as unknown as number;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  return { progress };
};
