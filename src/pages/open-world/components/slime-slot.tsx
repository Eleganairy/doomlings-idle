/**
 * Slime Slot Component
 *
 * A drop target for battle positions in the team editor.
 * Shows visual feedback when dragging over.
 */

import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import type { PlayerDefinition } from "../../../features/entity/types/entity.types";

interface SlimeSlotProps {
  position: 0 | 1 | 2;
  slimeDefinition: PlayerDefinition | null;
  onDrop: (slimeId: string, position: 0 | 1 | 2) => void;
  onDragStart: (e: React.DragEvent, slimeId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDraggedOver: boolean;
  onDragEnter: (position: 0 | 1 | 2) => void;
  onDragLeave: () => void;
}

const POSITION_LABELS = ["Front", "Middle", "Back"];

export const SlimeSlot = ({
  position,
  slimeDefinition,
  onDrop,
  onDragStart,
  onDragEnd,
  isDraggedOver,
  onDragEnter,
  onDragLeave,
}: SlimeSlotProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const slimeId = e.dataTransfer.getData("slimeId");
    if (slimeId) {
      onDrop(slimeId, position);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (slimeDefinition) {
      e.dataTransfer.setData("slimeId", slimeDefinition.id);
      e.dataTransfer.setData("sourcePosition", position.toString());
      e.dataTransfer.effectAllowed = "move";
      onDragStart(e, slimeDefinition.id);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnter(position);
  };

  const handleDragLeaveEvent = (e: React.DragEvent) => {
    e.preventDefault();
    onDragLeave();
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeaveEvent}
      sx={{
        width: "120px",
        height: "150px",
        backgroundColor: isDraggedOver
          ? COLORS.ACCENT_BLUE + "40"
          : COLORS.CARD_BACKGROUND_DARK,
        border: `3px dashed ${
          isDraggedOver ? COLORS.ACCENT_BLUE : COLORS.CARD_BORDER
        }`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
      }}
    >
      {slimeDefinition ? (
        <Box
          draggable
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          <Box
            component="img"
            src={slimeDefinition.baseStats.icon}
            alt={slimeDefinition.baseStats.name}
            sx={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
            }}
          />
          <Typography
            sx={{
              color: COLORS.TEXT_PRIMARY,
              fontSize: "11px",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "4px",
            }}
          >
            {slimeDefinition.baseStats.name}
          </Typography>
        </Box>
      ) : (
        <Typography
          sx={{
            color: COLORS.TEXT_DISABLED,
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          Empty
        </Typography>
      )}
      <Typography
        sx={{
          color: COLORS.TEXT_SECONDARY,
          fontSize: "10px",
          position: "absolute",
          bottom: "4px",
        }}
      >
        {POSITION_LABELS[position]}
      </Typography>
    </Box>
  );
};
