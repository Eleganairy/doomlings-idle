import { Box, Stack } from "@mui/material";
import type { Entity } from "../../../features/entity/entity.class";
import { COLORS } from "../../../constants/colors.constants";

interface EntityStatusBarProps {
  entity: Entity;
  isActive: boolean;
  type: "player" | "enemy";
}

// Shows attack and health progress
export const EntityStatusBar = ({
  entity,
  isActive,
  type,
}: EntityStatusBarProps) => {
  const maxHealth = entity.maxHealth;
  const currentHealth = entity.currentHealth;

  const healthColor =
    type === "player" ? COLORS.HEALTH_PLAYER : COLORS.HEALTH_ENEMY;
  const attackColor = COLORS.ATTACK;
  const borderColor =
    type === "player" ? COLORS.HEALTH_PLAYER : COLORS.HEALTH_ENEMY;

  return (
    <Box
      sx={{
        backgroundColor: COLORS.CARD_BACKGROUND,
        border: `2px solid ${borderColor}`,
        borderRadius: "6px",
        padding: "8px 12px",
      }}
    >
      <Stack spacing={0.5}>
        {/* Entity name / HP text */}
        <Box
          sx={{
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          HP: {Math.round(currentHealth)}/{maxHealth}
        </Box>

        {/* Health Bar */}
        <Box
          sx={{
            width: "100%",
            height: "12px",
            backgroundColor: COLORS.CARD_BACKGROUND_DARK,
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${(currentHealth / maxHealth) * 100}%`,
              height: "100%",
              backgroundColor: healthColor,
              transition: "width 0.1s",
            }}
          />
        </Box>

        {/* Attack Progress Bar */}
        <Box
          sx={{
            width: "100%",
            height: "8px",
            backgroundColor: COLORS.CARD_BACKGROUND_DARK,
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: attackColor,
              transformOrigin: "left",
              transform: "scaleX(0)",
              animation: isActive
                ? `attackProgress ${
                    1000 / entity.attackSpeed
                  }ms linear infinite`
                : "none",
              "@keyframes attackProgress": {
                "0%": {
                  transform: "scaleX(0)",
                },
                "100%": {
                  transform: "scaleX(1)",
                },
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};
