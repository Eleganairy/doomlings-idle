import CheckIcon from "@mui/icons-material/Check";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, Stack } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
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
    navigateToNextArea,
    canNavigateToNextArea,
  } = useStageProgression();

  const handlePreviousArea = () => {
    if (currentAreaId > 1) {
      navigateToNextArea(currentAreaId - 1);
    }
  };

  const handleNextArea = () => {
    if (currentAreaId < AREA_LIST.length && canNavigateToNextArea()) {
      navigateToNextArea(currentAreaId + 1);
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

  return (
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
          <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM} isBold>
            Enemies: {currentStage.enemiesKilled}/{currentStage.enemiesRequired}
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
                fontWeight: "bold",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "4px",
                "&:hover": {
                  backgroundColor: getStageButtonBackgroundColorOnHover(stage),
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
                  <CheckIcon sx={{ fontSize: "16px" }} />
                  <Paragraph
                    color={COLORS.TEXT_PRIMARY}
                    size={FONT_SIZE.MEDIUM}
                  >
                    {stage.stageNumber}
                  </Paragraph>
                </>
              ) : (
                <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM}>
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
          goNext={true}
        />
      </Stack>
    </Stack>
  );
};
