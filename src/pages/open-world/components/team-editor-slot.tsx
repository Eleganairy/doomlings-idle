import { Box, Stack } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import type { PlayerDefinition } from "../../../features/entity/types/entity.types";
import { FONT_SIZE } from "../../../constants/text.constants";
import { Paragraph } from "../../../shared/ui/paragraph";

interface TeamEditorSlotProps {
  position: 0 | 1 | 2;
  slime: PlayerDefinition | null;
  isDragOver: boolean;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent) => void;
  onDragStart: (event: React.DragEvent) => void;
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
          width: "200px",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px dashed ${COLORS.CARD_BORDER}`,
          borderRadius: "8px",
          backgroundColor: isDragOver
            ? COLORS.CARD_BORDER_ACTIVE + "20"
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
            sx={{ width: "200px", height: "200px", objectFit: "contain" }}
          />
        ) : (
          <Paragraph color={COLORS.TEXT_DISABLED} size={FONT_SIZE.SMALL}>
            Drop here
          </Paragraph>
        )}
      </Box>

      {/* Info block - green border like combat */}
      <Stack
        spacing={1}
        sx={{
          width: "100%",
          mt: 1,
          padding: "8px",
          backgroundColor: COLORS.CARD_BACKGROUND,
          border: `2px solid ${COLORS.HEALTH_PLAYER}`,
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        <Paragraph color={COLORS.TEXT_SECONDARY} size={FONT_SIZE.SMALL}>
          {POSITION_LABELS[position]}
        </Paragraph>
        {slime && (
          <>
            <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM}>
              {slime.baseStats.name}
            </Paragraph>
            <Paragraph color={COLORS.TEXT_SECONDARY} size={FONT_SIZE.SMALL}>
              Level 1
            </Paragraph>
          </>
        )}
      </Stack>
    </Box>
  );
};
