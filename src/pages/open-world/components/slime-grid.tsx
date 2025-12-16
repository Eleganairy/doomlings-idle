/**
 * Team Editor Slime Grid
 * Shows available slimes with selection and details.
 */

import { Box, Stack, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import type { PlayerDefinition } from "../../../features/entity/types/entity.types";

interface SlimeGridProps {
  slimes: PlayerDefinition[];
  unlockedIds: string[];
  teamSlimeIds: (string | null)[];
  selectedSlime: PlayerDefinition | null;
  onSelect: (slime: PlayerDefinition) => void;
  onDragStart: (e: React.DragEvent, slimeId: string) => void;
  onDropToRemove: (e: React.DragEvent) => void;
}

export const SlimeGrid = ({
  slimes,
  unlockedIds,
  teamSlimeIds,
  selectedSlime,
  onSelect,
  onDragStart,
  onDropToRemove,
}: SlimeGridProps) => {
  return (
    <Box
      sx={{
        width: "380px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLORS.CARD_BACKGROUND + "F0",
        borderLeft: `2px solid ${COLORS.CARD_BORDER}`,
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={onDropToRemove}
    >
      {/* Header */}
      <Box
        sx={{
          padding: "16px",
          borderBottom: `1px solid ${COLORS.CARD_BORDER}`,
        }}
      >
        <Typography
          sx={{
            color: COLORS.TEXT_PRIMARY,
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Available Slimes
        </Typography>
      </Box>

      {/* Grid */}
      <Box
        sx={{
          flex: 1,
          padding: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignContent: "flex-start",
          overflowY: "auto",
        }}
      >
        {slimes.map((slime) => {
          const isUnlocked = unlockedIds.includes(slime.id);
          const isInTeam = teamSlimeIds.includes(slime.id);
          const isSelected = selectedSlime?.id === slime.id;

          return (
            <Box
              key={slime.id}
              draggable={isUnlocked && !isInTeam}
              onClick={() => onSelect(slime)}
              onDragStart={(e) => {
                if (isUnlocked && !isInTeam) onDragStart(e, slime.id);
                else e.preventDefault();
              }}
              sx={{
                width: "80px",
                height: "95px",
                backgroundColor: isInTeam
                  ? COLORS.ACCENT_BLUE + "30"
                  : COLORS.CARD_BACKGROUND_DARK,
                border: `2px solid ${
                  isSelected ? COLORS.ACCENT_BLUE : COLORS.CARD_BORDER
                }`,
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: isUnlocked
                  ? isInTeam
                    ? "pointer"
                    : "grab"
                  : "not-allowed",
                opacity: isUnlocked ? 1 : 0.5,
                transition: "all 0.15s",
                "&:hover": isUnlocked
                  ? { borderColor: COLORS.ACCENT_BLUE }
                  : {},
              }}
            >
              <Box
                component="img"
                src={slime.baseStats.icon}
                alt={slime.baseStats.name}
                sx={{
                  width: "45px",
                  height: "45px",
                  objectFit: "contain",
                  filter: isUnlocked ? "none" : "grayscale(100%)",
                }}
              />
              <Typography
                sx={{
                  color: COLORS.TEXT_PRIMARY,
                  fontSize: "10px",
                  fontWeight: "bold",
                  textAlign: "center",
                  mt: 0.5,
                }}
              >
                {slime.baseStats.name}
              </Typography>
              {!isUnlocked && (
                <Typography
                  sx={{ color: COLORS.TEXT_DISABLED, fontSize: "9px" }}
                >
                  🔒
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Details Panel */}
      <Box
        sx={{
          height: "180px",
          borderTop: `2px solid ${COLORS.CARD_BORDER}`,
          padding: "16px",
          backgroundColor: COLORS.CARD_BACKGROUND,
        }}
      >
        {selectedSlime ? (
          <Stack spacing={1}>
            <Typography
              sx={{
                color: COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {selectedSlime.baseStats.name}
            </Typography>
            <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: "13px" }}>
              {selectedSlime.baseStats.description}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography
                sx={{ color: COLORS.HEALTH_PLAYER, fontSize: "13px" }}
              >
                ❤️ {selectedSlime.baseStats.maxHealth} HP
              </Typography>
              <Typography sx={{ color: COLORS.ATTACK, fontSize: "13px" }}>
                ⚔️ {selectedSlime.baseStats.attackDamage} DMG
              </Typography>
              <Typography
                sx={{ color: COLORS.TEXT_SECONDARY, fontSize: "13px" }}
              >
                ⚡ {selectedSlime.baseStats.attackSpeed} SPD
              </Typography>
            </Stack>
            {selectedSlime.abilities && selectedSlime.abilities.length > 0 && (
              <Box>
                <Typography
                  sx={{
                    color: COLORS.ABILITY,
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  ✨ {selectedSlime.abilities[0].name}
                </Typography>
                <Typography
                  sx={{ color: COLORS.TEXT_SECONDARY, fontSize: "12px" }}
                >
                  {selectedSlime.abilities[0].description}
                </Typography>
              </Box>
            )}
          </Stack>
        ) : (
          <Typography sx={{ color: COLORS.TEXT_DISABLED, fontSize: "14px" }}>
            Click a slime to see details
          </Typography>
        )}
      </Box>
    </Box>
  );
};
