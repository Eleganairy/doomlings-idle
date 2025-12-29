import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { useSetAtom } from "jotai";
import { COLORS } from "../../../constants/colors.constants";
import { isAreaSelectorOpenAtom } from "../../../features/world/store/area-selector.atoms";
import { AREA_LIST } from "../../../features/world/config/area-list.config";
import { useStageProgression } from "../../../features/world/hooks/use-stage-progression.hook";
import type { StageProgress } from "../../../features/world/types/progression.types";
import { StageSelectorAreaButton } from "./stage-selector-area-button";
import { FONT_SIZE } from "../../../constants/text.constants";
import { Paragraph } from "../../../shared/ui/paragraph";

/**
 * StageSelector Component
 *
 * Displays the 5 stages for the current area with:
 * - Visual indicators for current, unlocked, locked, and completed stages
 * - Enemy kill progress displayed separately
 * - Navigation arrows to switch between areas
 */
export const StageSelector = () => {
  const {
    currentStage,
    availableStages,
    currentStageNumber,
    navigateToStage,
    currentAreaId,
    navigateToArea,
    canNavigateToNextArea,
  } = useStageProgression();

  const handlePreviousArea = () => {
    if (currentAreaId > 1) {
      navigateToArea(currentAreaId - 1);
    }
  };

  const handleNextArea = () => {
    if (currentAreaId < AREA_LIST.length && canNavigateToNextArea()) {
      navigateToArea(currentAreaId + 1);
    }
  };

  const canGoPreviousArea = currentAreaId > 1;
  const canGoNextArea =
    currentAreaId < AREA_LIST.length && canNavigateToNextArea();

  const getStageButtonBackgroundColor = (stage: StageProgress) => {
    if (stage.isCompleted) return COLORS.ACCENT_GREEN;
    if (!stage.isUnlocked) return COLORS.BUTTON_DISABLED;
    return COLORS.BUTTON_ACTIVE;
  };

  const getStageButtonBackgroundColorOnHover = (stage: StageProgress) => {
    if (stage.isCompleted) return COLORS.ACCENT_LIGHT_GREEN;
    if (!stage.isUnlocked) return COLORS.BUTTON_DISABLED;
    return COLORS.BUTTON_ACTIVE_HOVER;
  };

  const setIsAreaSelectorOpen = useSetAtom(isAreaSelectorOpenAtom);

  const handleOpenAreaSelector = () => {
    setIsAreaSelectorOpen(true);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Stack direction="column" spacing={1} alignItems="center">
        {/* Enemy Kill Counter - Displayed outside buttons */}
        {currentStage && (
          <Box
            sx={{
              backgroundColor: COLORS.CARD_BACKGROUND,
              border: `2px solid ${COLORS.CARD_BORDER}`,
              borderRadius: "4px",
              padding: "8px 16px",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM}>
              Enemies: {currentStage.enemiesKilled}/
              {currentStage.enemiesRequired}
            </Paragraph>
          </Box>
        )}

        {/* Stage Selection Row */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            backgroundColor: COLORS.CARD_BACKGROUND,
            border: `2px solid ${COLORS.CARD_BORDER}`,
            borderRadius: "4px",
            padding: "8px",
            alignItems: "center",
          }}
        >
          {/* Previous Area Arrow */}
          <StageSelectorAreaButton
            handleNavigation={handlePreviousArea}
            isActive={canGoPreviousArea}
            isFirstWorldActive={currentAreaId === 1}
            goNext={false}
          />

          {/* Stage Buttons */}
          {availableStages.map((stage) => {
            const isCurrent = stage.stageNumber === currentStageNumber;
            const isCompleted = stage.isCompleted;
            const isLocked = !stage.isUnlocked;

            return (
              <Button
                key={stage.stageNumber}
                onClick={() => navigateToStage(stage.stageNumber)}
                disabled={isLocked}
                disableRipple
                sx={{
                  minWidth: "50px",
                  height: "50px",
                  backgroundColor: getStageButtonBackgroundColor(stage),
                  color: isLocked ? COLORS.TEXT_DISABLED : COLORS.TEXT_PRIMARY,
                  border: isCurrent
                    ? `3px solid ${COLORS.CARD_BORDER_ACTIVE}`
                    : `3px solid ${COLORS.CARD_BORDER}`,
                  borderRadius: "4px",
                  fontFamily: "Minecraft",
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "4px",
                  "&:hover": {
                    backgroundColor:
                      getStageButtonBackgroundColorOnHover(stage),
                  },
                  "&:disabled": {
                    cursor: "not-allowed",
                  },
                }}
              >
                {isLocked ? (
                  <LockIcon sx={{ fontSize: "20px" }} />
                ) : isCompleted ? (
                  <>
                    <Paragraph
                      color={COLORS.TEXT_PRIMARY}
                      size={FONT_SIZE.MEDIUM}
                    >
                      {stage.stageNumber}
                    </Paragraph>
                  </>
                ) : (
                  <Paragraph
                    color={COLORS.TEXT_PRIMARY}
                    size={FONT_SIZE.MEDIUM}
                  >
                    {stage.stageNumber}
                  </Paragraph>
                )}
              </Button>
            );
          })}

          {/* Next Area Arrow */}
          <StageSelectorAreaButton
            handleNavigation={handleNextArea}
            isActive={canGoNextArea}
            isFirstWorldActive={currentAreaId === 1}
            goNext={true}
          />
        </Stack>
      </Stack>

      {/* Floating Area Selector Button */}
      <IconButton
        onClick={handleOpenAreaSelector}
        sx={{
          position: "absolute",
          right: "-60px",
          top: "70%",
          transform: "translateY(-50%)",
          backgroundColor: COLORS.BUTTON_INACTIVE,
          border: `3px solid ${COLORS.CARD_BORDER}`,
          borderRadius: "4px",
          width: "48px",
          height: "48px",
          "&:hover": {
            backgroundColor: COLORS.BUTTON_INACTIVE_HOVER,
          },
        }}
      >
        <img height={"38px"} src="/icons/ArrowsUpDown.png" />
      </IconButton>
    </Box>
  );
};
