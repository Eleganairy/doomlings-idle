import { Box, Stack, Button } from "@mui/material";

import { useAtomValue } from "jotai";
import { useCombat } from "../../features/combat/hooks/use-combat.hook";
import { CombatEntity } from "./combat-entity";
import { playerEnergyAtom } from "../../features/combat/store/combat.atoms";
import { activeAreaAtom } from "../../features/world/store/area.atoms";
import { useCallback } from "react";

export const OpenWorldPage = () => {
  const {
    activePlayers,
    activeEnemies,
    isCombatActive,
    toggleCombat,
    playerAttack,
    enemyAttack,
  } = useCombat();

  const playerEnergy = useAtomValue(playerEnergyAtom);
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
          paddingBottom: "10%",
        }}
      >
        <Stack direction="row" spacing={2}>
          {activePlayers.map((player) => (
            <CombatEntity
              key={player.id}
              entity={player}
              isActive={isCombatActive}
              type="player"
              onAttack={(damage) => createPlayerAttackHandler(damage)}
            />
          ))}
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
        <Box
          sx={{
            backgroundColor: "#2c2c2c",
            border: "3px solid #1d1d1d",
            borderRadius: "4px",
            padding: "15px 30px",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          ⚡ Energy: {playerEnergy}
        </Box>

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
          paddingBottom: "10%",
        }}
      >
        <Stack direction="row" spacing={2}>
          {activeEnemies.map((enemy) => (
            <CombatEntity
              key={enemy.id}
              entity={enemy}
              isActive={isCombatActive}
              type="enemy"
              onAttack={(damage) => createEnemyAttackHandler(damage)}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
