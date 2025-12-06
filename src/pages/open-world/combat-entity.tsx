import { Stack, Box } from "@mui/material";
import { useEntityCombat } from "../../features/combat/hooks/use-entity-combat.hook";
import type {
  SpawnedEnemy,
  SpawnedPlayer,
} from "../../features/combat/types/combat.types";

import PlayerSprite from "../../../public/player/Blob1.png";

interface CombatEntityProps {
  entity: SpawnedPlayer | SpawnedEnemy;
  isActive: boolean;
  type: "player" | "enemy";
  onAttack: (damage: number) => void;
}

export const CombatEntity = ({
  entity,
  isActive,
  type,
  onAttack,
}: CombatEntityProps) => {
  const { progress } = useEntityCombat({
    entity: {
      id: entity.id,
      attackDamage: entity.attackDamage,
      attackSpeed: entity.attackSpeed,
      critChance: 0,
    },
    isActive,
    onAttack,
  });

  const maxHealth = entity.maxHealth;
  const currentHealth = entity.currentHealth;
  const name = entity.name;

  // Get sprite based on entity type
  const icon =
    type === "player" ? PlayerSprite : (entity as SpawnedEnemy).sprite;

  const healthColor = type === "player" ? "#4caf50" : "#f44336";
  const attackColor = "#ff9800";

  return (
    <Stack alignItems="center" spacing={0.5} sx={{ width: "150px" }}>
      <Box sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>
        {name}
      </Box>
      <Box sx={{ color: "white", fontSize: "12px" }}>
        HP: {Math.round(currentHealth)}/{maxHealth}
      </Box>

      {/* Health Bar */}
      <Box
        sx={{
          width: "100%",
          height: "10px",
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
          height: "8px",
          backgroundColor: "#2c2c2c",
          border: "2px solid #1d1d1d",
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "40px",
        }}
      >
        <Box
          sx={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: attackColor,
            // transition: "width 0.05s linear",
          }}
        />
      </Box>

      {/* Entity Box */}
      <Box
        sx={{
          width: "120px",
          height: "120px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
        }}
      >
        <img src={icon} alt="Entity Icon" />
      </Box>
    </Stack>
  );
};
