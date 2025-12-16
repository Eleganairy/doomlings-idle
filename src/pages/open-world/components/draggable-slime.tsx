/**
 * Draggable Slime Component
 *
 * A slime card that can be dragged to battle slots or the grid.
 */

import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import type { PlayerDefinition } from "../../../features/entity/types/entity.types";

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
  const handleDragStart = (e: React.DragEvent) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("slimeId", definition.id);
    e.dataTransfer.effectAllowed = "move";
    onDragStart(e, definition.id);
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
      <Typography
        sx={{
          color: isLocked ? COLORS.TEXT_DISABLED : COLORS.TEXT_PRIMARY,
          fontSize: "12px",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "4px",
        }}
      >
        {definition.baseStats.name}
      </Typography>
      {isLocked && (
        <Typography
          sx={{
            color: COLORS.TEXT_DISABLED,
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          🔒 Locked
        </Typography>
      )}
    </Box>
  );
};
