import { Stack, Box } from "@mui/material";

import PlayerSprite from "/player/Blob1.png";
import type {
  SpawnedEnemy,
  SpawnedPlayer,
} from "../../../features/combat/types/combat.types";

interface CombatEntityProps {
  entity: SpawnedPlayer | SpawnedEnemy;
  isActive: boolean;
  type: "player" | "enemy";
}

export const CombatEntity = ({ entity, isActive, type }: CombatEntityProps) => {
  const maxHealth = entity.maxHealth;
  const currentHealth = entity.currentHealth;

  // Get sprite based on entity type
  const icon =
    type === "player" ? PlayerSprite : (entity as SpawnedEnemy).sprite;

  const healthColor = type === "player" ? "#4caf50" : "#f44336";
  const attackColor = "#ff9800";

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      sx={{ height: "300px" }}
    >
      <Stack alignItems="center" spacing={0.5} sx={{ width: "200px" }}>
        <Box sx={{ color: "white", fontSize: "28px" }}>
          HP: {Math.round(currentHealth)}/{maxHealth}
        </Box>

        {/* Health Bar */}
        <Box
          sx={{
            width: "100%",
            height: "18px",
            backgroundColor: "#2c2c2c",
            border: "2px solid #1d1d1d",
            borderRadius: "4px",
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
            height: "12px",
            backgroundColor: "#2c2c2c",
            border: "2px solid #1d1d1d",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "40px",
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
      {/* Entity Box */}
      <Box>
        <img height="120px" src={icon} alt="Entity Icon" />
      </Box>
    </Stack>
  );
};
