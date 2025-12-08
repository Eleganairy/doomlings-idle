import { Box, Stack, Button } from "@mui/material";

import { useCombat } from "../../features/combat/hooks/use-combat.hook";
import { StageSelector } from "./components/StageSelector";
import { CombatEntity } from "./components/combat-entity";

export const OpenWorldPage = () => {
  const { activePlayers, activeEnemies, isCombatActive, toggleCombat } =
    useCombat();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Left section - players */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "8%",
          paddingLeft: "60px",
        }}
      >
        <Stack direction="row" spacing={2}>
          {/* Positions for players: front (0), middle (1), back (2) */}
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
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
      {/* Middle section - controls */}
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
      {/* Right section - enemies */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "8%",
          paddingRight: "60px",
        }}
      >
        <Stack direction="row" spacing={2}>
          {/* Positions for enemies: front (0), middle (1), back (2) */}
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
