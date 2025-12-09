import { Box, Stack } from "@mui/material";

import type {
  SpawnedEnemy,
  SpawnedPlayer,
} from "../../../features/combat/types/combat.types";

interface EntityStatusBarProps {
  entity: SpawnedPlayer | SpawnedEnemy;
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

  const healthColor = type === "player" ? "#4caf50" : "#f44336";
  const attackColor = "#ff9800";
  const borderColor = type === "player" ? "#4caf50" : "#f44336";

  return (
    <Box
      sx={{
        backgroundColor: "#2c2c2c",
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
            backgroundColor: "#1d1d1d",
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
            backgroundColor: "#1d1d1d",
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
