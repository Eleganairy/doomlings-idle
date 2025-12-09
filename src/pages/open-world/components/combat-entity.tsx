import { Box } from "@mui/material";

import type {
  SpawnedEnemy,
  SpawnedPlayer,
} from "../../../features/combat/types/combat.types";

interface CombatEntityProps {
  entity: SpawnedPlayer | SpawnedEnemy;
}

export const CombatEntity = ({ entity }: CombatEntityProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "200px",
      }}
    >
      {/* Entity Icon - anchored from bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <img height="320px" src={entity.sprite} alt="Entity Icon" />
      </Box>
    </Box>
  );
};
