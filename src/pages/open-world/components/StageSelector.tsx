import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, Stack, Typography } from "@mui/material";
import { AREA_LIST } from "../../../features/world/config/area-list.config";
import { useStageProgression } from "../../../features/world/hooks/use-stage-progression.hook";

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

  // Determine the highest unlocked stage (for consistent blue highlighting)
  const highestUnlockedStage = availableStages
    .filter((s) => s.isUnlocked && !s.isCompleted)
    .reduce((max, stage) => Math.max(max, stage.stageNumber), 0);

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

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      {/* Enemy Kill Counter - Displayed outside buttons */}
      {currentStage && (
        <Box
          sx={{
            backgroundColor: "#2c2c2c",
            border: "2px solid #1d1d1d",
            borderRadius: "4px",
            padding: "4px 12px",
            minWidth: "100px",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Minecraft",
              fontSize: "14px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Enemies: {currentStage.enemiesKilled}/{currentStage.enemiesRequired}
          </Typography>
        </Box>
      )}

      {/* Stage Selection Row */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          backgroundColor: "#2c2c2c",
          border: "3px solid #1d1d1d",
          borderRadius: "4px",
          padding: "8px",
          alignItems: "center",
        }}
      >
        {/* Previous Area Arrow */}
        <Button
          onClick={handlePreviousArea}
          disabled={!canGoPreviousArea}
          disableRipple
          sx={{
            minWidth: "40px",
            height: "50px",
            backgroundColor: canGoPreviousArea ? "#4caf50" : "#3a3a3a",
            color: "white",
            border: "3px solid #1d1d1d",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: canGoPreviousArea ? "#5cbf60" : "#3a3a3a",
            },
            "&:disabled": {
              color: "#666",
            },
          }}
        >
          <ChevronLeftIcon />
        </Button>

        {/* Stage Buttons */}
        {availableStages.map((stage) => {
          const isCurrent = stage.stageNumber === currentStageNumber;
          const isCompleted = stage.isCompleted;
          const isLocked = !stage.isUnlocked;
          const isHighestUnlocked = stage.stageNumber === highestUnlockedStage;

          // Determine background color - CONSISTENT colors
          let backgroundColor = "#753b3b"; // Locked (dark red)
          if (isCompleted) {
            backgroundColor = "#4caf50"; // Completed (green) - stays green
          } else if (isHighestUnlocked) {
            backgroundColor = "#4060b7"; // Highest unlocked (blue) - stays blue
          } else if (stage.isUnlocked) {
            backgroundColor = "#b74040"; // Other unlocked (red)
          }

          return (
            <Button
              key={stage.stageNumber}
              onClick={() => navigateToStage(stage.stageNumber)}
              disabled={isLocked}
              disableRipple
              sx={{
                minWidth: "50px",
                height: "50px",
                backgroundColor,
                color: isLocked ? "#ffffff85" : "white",
                border: isCurrent ? "3px solid #ffffff" : "3px solid #1d1d1d",
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
                  backgroundColor: isLocked
                    ? backgroundColor
                    : isCompleted
                    ? "#5cbf60"
                    : isHighestUnlocked
                    ? "#4a70da"
                    : "#d74d4d",
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
                  <Box sx={{ fontSize: "10px" }}>{stage.stageNumber}</Box>
                </>
              ) : (
                <Box>{stage.stageNumber}</Box>
              )}
            </Button>
          );
        })}

        {/* Next Area Arrow */}
        <Button
          onClick={handleNextArea}
          disabled={!canGoNextArea}
          disableRipple
          sx={{
            minWidth: "40px",
            height: "50px",
            backgroundColor: canGoNextArea ? "#4caf50" : "#3a3a3a",
            color: "white",
            border: "3px solid #1d1d1d",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: canGoNextArea ? "#5cbf60" : "#3a3a3a",
            },
            "&:disabled": {
              color: "#666",
            },
          }}
        >
          <ChevronRightIcon />
        </Button>
      </Stack>
    </Stack>
  );
};
