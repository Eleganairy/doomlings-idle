import { Box, Button, IconButton, Stack } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import SettingsIcon from "@mui/icons-material/Settings";

import { COLORS } from "../../constants/colors.constants";
import { useCombat } from "../../features/combat/hooks/use-combat.hook";
import {
  activePlayersAtom,
  activeEnemiesAtom,
  isCombatActiveAtom,
} from "../../features/combat/store/combat.atoms";
import { isTeamEditorOpenAtom } from "../../features/team/store/team.atoms";
import { isAreaSelectorOpenAtom } from "../../features/world/store/area-selector.atoms";
import {
  getButtonBaseStateColors,
  getButtonClickedStateColors,
  getButtonHoverStateColors,
} from "../../utils/button-state-colors.utils";
import {
  AreaSelector,
  EntityStatusBar,
  StageSelector,
  TeamEditor,
} from "./components";
import { FONT_SIZE } from "../../constants/text.constants";
import { Paragraph } from "../../shared/ui/paragraph";

export const OpenWorldPage = () => {
  const { activePlayers, activeEnemies, isCombatActive, toggleCombat } =
    useCombat();
  const setActivePlayers = useSetAtom(activePlayersAtom);
  const setActiveEnemies = useSetAtom(activeEnemiesAtom);
  const setIsCombatActive = useSetAtom(isCombatActiveAtom);
  const [isTeamEditorOpen, setIsTeamEditorOpen] = useAtom(isTeamEditorOpenAtom);
  const [isAreaSelectorOpen, setIsAreaSelectorOpen] = useAtom(
    isAreaSelectorOpenAtom
  );

  // Open team editor - stops combat and clears entities
  const handleOpenTeamEditor = () => {
    setIsCombatActive(false);
    setActivePlayers([]);
    setActiveEnemies([]);
    setIsTeamEditorOpen(true);
  };

  // Close team editor - entities will respawn on next combat start
  const handleCloseTeamEditor = () => {
    setIsTeamEditorOpen(false);
  };

  // Close area selector
  const handleCloseAreaSelector = () => {
    setIsAreaSelectorOpen(false);
  };

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
      {/* Team Editor Overlay */}
      {isTeamEditorOpen && <TeamEditor onClose={handleCloseTeamEditor} />}

      {/* Area Selector Overlay */}
      {isAreaSelectorOpen && <AreaSelector onClose={handleCloseAreaSelector} />}

      {/* Main battle area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          position: "relative",
        }}
      >
        {/* Middle section - controls (hidden during team editing or area selection) */}
        {!isTeamEditorOpen && !isAreaSelectorOpen && (
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
                backgroundColor: getButtonBaseStateColors(
                  isCombatActive,
                  false
                ),
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
              <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM}>
                {isCombatActive ? "PAUSE" : "START"}
              </Paragraph>
            </Button>
          </Box>
        )}
      </Box>

      {/* Bottom Status Panel - hidden during area selection */}
      {!isAreaSelectorOpen && (
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
          {/* Edit Team Button - hidden during team editing */}
          {!isTeamEditorOpen && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
              }}
            >
              <IconButton
                onClick={handleOpenTeamEditor}
                sx={{
                  backgroundColor: COLORS.CARD_BACKGROUND,
                  border: `2px solid ${COLORS.CARD_BORDER}`,
                  borderRadius: "8px",
                  width: "48px",
                  height: "48px",
                  "&:hover": {
                    backgroundColor: COLORS.CARD_BACKGROUND_SECONDARY,
                  },
                }}
              >
                <SettingsIcon sx={{ color: COLORS.TEXT_PRIMARY }} />
              </IconButton>
            </Box>
          )}

          {/* Player Status Bars - matching left section layout */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              paddingLeft: "20px",
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
      )}
    </Box>
  );
};
