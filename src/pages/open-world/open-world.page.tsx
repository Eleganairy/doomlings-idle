import { Box, Button, Stack } from "@mui/material";

import { COLORS } from "../../constants/colors.constants";
import { useCombat } from "../../features/combat/hooks/use-combat.hook";
import {
  getButtonBaseStateColors,
  getButtonClickedStateColors,
  getButtonHoverStateColors,
} from "../../utils/button-state-colors.utils";
import { EntityStatusBar, StageSelector } from "./components";

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
        }}
      >
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
              backgroundColor: getButtonBaseStateColors(isCombatActive, false),
              color: COLORS.TEXT_PRIMARY,
              fontSize: "18px",
              fontWeight: "bold",
              border: `3px solid ${COLORS.CARD_BORDER}`,
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: getButtonHoverStateColors(
                  isCombatActive,
                  false
                ),
              },
              "&:active": {
                backgroundColor: getButtonClickedStateColors(
                  isCombatActive,
                  false
                ),
              },
            }}
          >
            {isCombatActive ? "PAUSE" : "START"}
          </Button>
        </Box>
      </Box>

      {/* Bottom Status Panel */}
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
                (foundPlayer) => foundPlayer.position === slotPosition
              );
              return (
                <Box
                  key={`player-status-${slotPosition}`}
                  sx={{
                    width: "200px",
                    visibility: player ? "block" : "hidden",
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
                (foundEnemy) => foundEnemy.position === slotPosition
              );
              return (
                <Box
                  key={`enemy-status-${slotPosition}`}
                  sx={{
                    width: "200px",
                    visibility: enemy ? "block" : "hidden",
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
