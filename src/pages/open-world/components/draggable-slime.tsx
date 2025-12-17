import { Box } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import type { PlayerDefinition } from "../../../features/entity/types/entity.types";
import { FONT_SIZE } from "../../../constants/text.constants";
import { Paragraph } from "../../../shared/ui/paragraph";

interface DraggableSlimeProps {
  definition: PlayerDefinition;
  isLocked?: boolean;
  onDragStart: (e: React.DragEvent, slimeId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export const DraggableSlime = ({
  definition,
  isLocked = false,
  onDragStart,
  onDragEnd,
}: DraggableSlimeProps) => {
  const handleDragStart = (event: React.DragEvent) => {
    if (isLocked) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData("slimeId", definition.id);
    event.dataTransfer.effectAllowed = "move";
    onDragStart(event, definition.id);
  };

  return (
    <Box
      draggable={!isLocked}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      sx={{
        width: "100px",
        height: "120px",
        backgroundColor: isLocked
          ? COLORS.CARD_BACKGROUND_DARK
          : COLORS.CARD_BACKGROUND,
        border: `2px solid ${
          isLocked ? COLORS.CARD_BORDER_DARK : COLORS.CARD_BORDER
        }`,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: isLocked ? "not-allowed" : "grab",
        opacity: isLocked ? 0.5 : 1,
        transition: "transform 0.1s, box-shadow 0.1s",
        "&:hover": !isLocked
          ? {
              transform: "scale(1.05)",
              boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
            }
          : {},
        "&:active": !isLocked
          ? {
              cursor: "grabbing",
            }
          : {},
      }}
    >
      <Box
        component="img"
        src={definition.baseStats.icon}
        alt={definition.baseStats.name}
        sx={{
          width: "60px",
          height: "60px",
          objectFit: "contain",
          filter: isLocked ? "grayscale(100%)" : "none",
        }}
      />
      <Paragraph color={COLORS.TEXT_DISABLED} size={FONT_SIZE.SMALL} isBold>
        {definition.baseStats.name}
      </Paragraph>
      {isLocked && (
        <Paragraph color={COLORS.TEXT_DISABLED} size={FONT_SIZE.SMALL}>
          🔒 Locked
        </Paragraph>
      )}
    </Box>
  );
};
