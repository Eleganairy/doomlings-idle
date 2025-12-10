import { Box, Stack } from "@mui/system";
import { getUpgradeById } from "../../../features/progression/config/progression.config";
import type { Trait } from "../../../features/progression/types/progression.types";
import { COLORS } from "../../../constants/colors.constants";

interface TraitCardProps {
  trait: Trait;
  currentValue: number;
  isCompleted: boolean;
}

export const TraitCard = ({
  trait,
  currentValue,
  isCompleted,
}: TraitCardProps) => {
  const progress = Math.min((currentValue / trait.goalValue) * 100, 100);
  const linkedUpgrade = trait.linkedUpgrade
    ? getUpgradeById(trait.linkedUpgrade)
    : null;

  return (
    <Box
      sx={{
        backgroundColor: COLORS.CARD_BACKGROUND,
        border: `3px solid ${
          isCompleted ? COLORS.ACCENT_GREEN : COLORS.CARD_BORDER
        }`,
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        gap: "16px",
      }}
    >
      {/* Icon Section */}
      <Box
        sx={{
          width: "82px",
          height: "82px",
          backgroundColor: COLORS.CARD_BACKGROUND_DARK,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "42px",
          flexShrink: 0,
        }}
      >
        {trait.icon}
      </Box>

      {/* Content Section */}
      <Stack sx={{ flex: 1, gap: "8px" }}>
        {/* Name */}
        <Box
          sx={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {trait.name}
        </Box>

        {/* Description */}
        <Box
          sx={{
            color: COLORS.TEXT_SECONDARY,
            fontSize: "14px",
          }}
        >
          {trait.description}
        </Box>

        {/* Progress Bar */}
        <Box
          sx={{
            width: "100%",
            height: "20px",
            backgroundColor: COLORS.CARD_BACKGROUND_DARK,
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: isCompleted
                ? COLORS.ACCENT_GREEN
                : COLORS.ACCENT_ORANGE,
              transition: "width 0.3s ease",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.TEXT_PRIMARY,
              textShadow: "1px 1px black",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {isCompleted
              ? ""
              : `${Math.floor(currentValue)} / ${trait.goalValue}`}
          </Box>
        </Box>

        {/* Linked Upgrade */}
        {linkedUpgrade && (
          <Box
            sx={{
              color: isCompleted ? COLORS.ACCENT_GREEN : COLORS.TEXT_DISABLED,
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isCompleted ? "✓ Unlocked:" : "🔒 Unlocks:"} {linkedUpgrade.name}
          </Box>
        )}
      </Stack>
    </Box>
  );
};
