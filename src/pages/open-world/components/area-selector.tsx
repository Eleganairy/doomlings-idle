import { Box, Button, Stack } from "@mui/material";
import { useAtom } from "jotai";
import { COLORS } from "../../../constants/colors.constants";
import { FONT_SIZE } from "../../../constants/text.constants";
import {
  AREA_LIST,
  type Area,
} from "../../../features/world/config/area-list.config";
import { worldProgressAtom } from "../../../features/world/store/world-progression.atoms";
import { Paragraph } from "../../../shared/ui/paragraph";
import { AreaButton } from "./area-selector-button";

interface AreaSelectorProps {
  onClose: () => void;
}

export const AreaSelector = ({ onClose }: AreaSelectorProps) => {
  const [worldProgress, setWorldProgress] = useAtom(worldProgressAtom);

  // Determine which areas are unlocked
  // An area is unlocked if:
  // 1. It's the first area (id === 1)
  // 2. The previous area has been initialized (progress exists)
  const isAreaUnlocked = (areaId: number): boolean => {
    if (areaId === 1) return true;
    // Check if there's progress for this area or if previous area's last stage is completed
    return worldProgress.areaProgress[areaId] !== undefined;
  };

  const handleSelectArea = (areaId: number) => {
    if (!isAreaUnlocked(areaId)) return;

    setWorldProgress((prev) => ({
      ...prev,
      currentAreaId: areaId,
      currentStageNumber: 1,
    }));

    onClose();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.70)",
        borderRadius: "8px",
        border: `3px solid ${COLORS.CARD_BORDER}`,
        overflowY: "auto",
        padding: "20px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          width="100%"
        >
          {[1, 2, 3].map((world) => {
            return (
              <Button
                key={world}
                disableRipple
                sx={{
                  height: "50px",
                  width: "100%",
                  backgroundColor:
                    world === 1 ? COLORS.BUTTON_ACTIVE : COLORS.CARD_BACKGROUND,
                  border: `3px solid ${COLORS.CARD_BORDER}`,
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor:
                      world === 1
                        ? COLORS.BUTTON_ACTIVE_HOVER
                        : COLORS.CARD_BACKGROUND,
                    cursor: world === 1 ? "pointer" : "default",
                  },
                }}
              >
                <Paragraph
                  color={
                    world === 1 ? COLORS.TEXT_PRIMARY : COLORS.TEXT_DISABLED
                  }
                  size={FONT_SIZE.MEDIUM}
                >
                  World {world}
                </Paragraph>
              </Button>
            );
          })}
        </Stack>
      </Box>

      {/* Area List */}
      <Stack
        direction="column"
        spacing={2}
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {AREA_LIST.map((area) => (
          <AreaButton
            key={area.id}
            area={area}
            isActive={worldProgress.currentAreaId === area.id}
            isUnlocked={isAreaUnlocked(area.id)}
            onSelect={() => handleSelectArea(area.id)}
          />
        ))}
      </Stack>

      {/* Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Box
          onClick={onClose}
          sx={{
            backgroundColor: COLORS.CARD_BACKGROUND,
            border: `3px solid ${COLORS.CARD_BORDER}`,
            borderRadius: "8px",
            padding: "12px 40px",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: COLORS.CARD_BACKGROUND_SECONDARY,
            },
          }}
        >
          <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM} isBold>
            Close
          </Paragraph>
        </Box>
      </Box>
    </Box>
  );
};
