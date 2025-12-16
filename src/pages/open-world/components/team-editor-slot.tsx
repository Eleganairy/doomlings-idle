/**
 * Team Editor Slot
 * Matches combat entity styling with green border on info block.
 */

import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import type { PlayerDefinition } from "../../../features/entity/types/entity.types";

interface TeamEditorSlotProps {
  position: 0 | 1 | 2;
  slime: PlayerDefinition | null;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
}

const POSITION_LABELS = ["Front", "Middle", "Back"];

export const TeamEditorSlot = ({
  position,
  slime,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
}: TeamEditorSlotProps) => {
  return (
    <Box
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      sx={{
        width: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Sprite area - same size as combat */}
      <Box
        draggable={!!slime}
        onDragStart={onDragStart}
        sx={{
          width: "100px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: isDragOver
            ? `2px dashed ${COLORS.ACCENT_BLUE}`
            : "2px dashed transparent",
          borderRadius: "8px",
          backgroundColor: isDragOver
            ? COLORS.ACCENT_BLUE + "20"
            : "transparent",
          cursor: slime ? "grab" : "default",
          transition: "all 0.15s",
        }}
      >
        {slime ? (
          <Box
            component="img"
            src={slime.baseStats.sprite}
            alt={slime.baseStats.name}
            sx={{ width: "80px", height: "80px", objectFit: "contain" }}
          />
        ) : (
          <Typography sx={{ color: COLORS.TEXT_DISABLED, fontSize: "12px" }}>
            Drop here
          </Typography>
        )}
      </Box>

      {/* Info block - green border like combat */}
      <Box
        sx={{
          width: "100%",
          mt: 1,
          padding: "8px",
          backgroundColor: COLORS.CARD_BACKGROUND,
          border: `2px solid ${COLORS.HEALTH_PLAYER}`,
          borderRadius: "4px",
        }}
      >
        <Typography
          sx={{
            color: COLORS.TEXT_SECONDARY,
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          {POSITION_LABELS[position]}
        </Typography>
        {slime && (
          <>
            <Typography
              sx={{
                color: COLORS.TEXT_PRIMARY,
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {slime.baseStats.name}
            </Typography>
            <Typography
              sx={{
                color: COLORS.TEXT_SECONDARY,
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              Level 1
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};
