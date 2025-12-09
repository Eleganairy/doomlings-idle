import { Box, Stack, Button } from "@mui/material";

import { useCombat } from "../../features/combat/hooks/use-combat.hook";
import { StageSelector } from "./components/StageSelector";
import { CombatEntity } from "./components/combat-entity";
import { EntityStatusBar } from "./components/entity-status-bar";

export const OpenWorldPage = () => {
  const { activePlayers, activeEnemies, isCombatActive, toggleCombat } =
    useCombat();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Main battle area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          position: "relative",
          paddingBottom: "120px", // Space for bottom panel
        }}
      >
        {/* Left section - players */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            paddingLeft: "60px",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ height: "100%" }}>
            {[2, 1, 0].map((slotPosition) => {
              const player = activePlayers.find(
                (p) => p.position === slotPosition
              );
              return (
                <Box
                  key={`player-slot-${slotPosition}`}
                  sx={{
                    width: "200px",
                    minWidth: "200px",
                    height: "100%",
                    visibility: player ? "visible" : "hidden",
                  }}
                >
                  {player && <CombatEntity key={player.id} entity={player} />}
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
            justifyContent: "flex-start",
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
              marginTop: "20px",
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
        </Box>

        {/* Right section - enemies */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            paddingRight: "60px",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ height: "100%" }}>
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
                    height: "100%",
                    visibility: enemy ? "visible" : "hidden",
                  }}
                >
                  {enemy && <CombatEntity key={enemy.id} entity={enemy} />}
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>

      {/* Bottom Status Panel - RPG Style */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Player Status Bars - matching left section layout */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            paddingLeft: "60px",
          }}
        >
          <Stack direction="row" spacing={2}>
            {[2, 1, 0].map((slotPosition) => {
              const player = activePlayers.find(
                (p) => p.position === slotPosition
              );
              return (
                <Box
                  key={`player-status-${slotPosition}`}
                  sx={{
                    width: "200px",
                    visibility: player ? "visible" : "hidden",
                  }}
                >
                  {player && (
                    <EntityStatusBar
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

        {/* Middle spacer - matching middle section */}
        <Box sx={{ flex: 1 }} />

        {/* Enemy Status Bars - matching right section layout */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            paddingRight: "60px",
          }}
        >
          <Stack direction="row" spacing={2}>
            {[0, 1, 2].map((slotPosition) => {
              const enemy = activeEnemies.find(
                (e) => e.position === slotPosition
              );
              return (
                <Box
                  key={`enemy-status-${slotPosition}`}
                  sx={{
                    width: "200px",
                    visibility: enemy ? "visible" : "hidden",
                  }}
                >
                  {enemy && (
                    <EntityStatusBar
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
    </Box>
  );
};
