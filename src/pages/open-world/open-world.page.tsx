import { Box, Stack, Button } from "@mui/material";

import { useAtomValue } from "jotai";
import { useCombat } from "../../features/combat/hooks/use-combat.hook";
import { CombatEntity } from "./combat-entity";
import { activeAreaAtom } from "../../features/world/store/area.atoms";
import { useCallback } from "react";
import { StageSelector } from "./components/StageSelector";

export const OpenWorldPage = () => {
  const {
    activePlayers,
    activeEnemies,
    isCombatActive,
    toggleCombat,
    playerAttack,
    enemyAttack,
  } = useCombat();

  const activeArea = useAtomValue(activeAreaAtom);

  // Memoize attack handlers per entity ID
  const createPlayerAttackHandler = useCallback(
    (damage: number) => {
      playerAttack(damage, activeArea.enemyPool);
    },
    [activeArea.enemyPool, playerAttack]
  );

  const createEnemyAttackHandler = useCallback(
    (damage: number) => {
      enemyAttack(damage);
    },
    [enemyAttack]
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Left Section - Players */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "8%",
          paddingLeft: "60px", // Space from the middle section
        }}
      >
        <Stack direction="row" spacing={2}>
          {/* Create fixed slots for players: front (0), middle (1), back (2) */}
          {[0, 1, 2].map((slotPosition) => {
            const player = activePlayers.find(
              (p) => p.position === slotPosition
            );
            return (
              <Box
                key={`player-slot-${slotPosition}`}
                sx={{
                  width: "200px",
                  minWidth: "200px",
                  visibility: player ? "visible" : "hidden",
                }}
              >
                {player && (
                  <CombatEntity
                    key={player.id}
                    entity={player}
                    isActive={isCombatActive}
                    type="player"
                    onAttack={(damage) => createPlayerAttackHandler(damage)}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Middle Section - Controls */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Stack direction="column" spacing={2}>
          <StageSelector />
        </Stack>

        <Button
          onClick={toggleCombat}
          disableRipple
          disableElevation
          sx={{
            width: "200px",
            height: "60px",
            backgroundColor: isCombatActive ? "#b74040" : "#4caf50",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            border: "3px solid #1d1d1d",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: isCombatActive ? "#d45050" : "#5cbf60",
            },
          }}
        >
          {isCombatActive ? "PAUSE" : "START"}
        </Button>

        <Box />
      </Box>

      {/* Right Section - Enemies */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "8%",
          paddingRight: "60px", // Space from the middle section
        }}
      >
        <Stack direction="row" spacing={2}>
          {/* Create fixed slots for enemies: front (0), middle (1), back (2) */}
          {[0, 1, 2].map((slotPosition) => {
            const enemy = activeEnemies.find(
              (e) => e.position === slotPosition
            );
            return (
              <Box
                key={`enemy-slot-${slotPosition}`}
                sx={{
                  width: "200px",
                  minWidth: "200px",
                  visibility: enemy ? "visible" : "hidden",
                }}
              >
                {enemy && (
                  <CombatEntity
                    key={enemy.id}
                    entity={enemy}
                    isActive={isCombatActive}
                    type="enemy"
                    onAttack={(damage) => createEnemyAttackHandler(damage)}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};
