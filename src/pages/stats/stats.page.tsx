import { Box, Stack } from "@mui/material";
import { useAtomValue } from "jotai";
import { activePlayersAtom } from "../../features/combat/store/combat.atoms";
import { upgradeLevelsAtom } from "../../features/progression/store/progression.atoms";
import { calculatePlayerStats } from "../../features/player/helpers/calculate-player-stats.helper";
import PlayerSprite from "/player/Blob1.png";

interface StatRowProps {
  label: string;
  value: string | number;
  icon?: string;
}

const StatRow = ({ label, value, icon }: StatRowProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      backgroundColor: "#2c2c2c",
      border: "2px solid #1d1d1d",
      borderRadius: "4px",
      marginBottom: "8px",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {icon && <Box sx={{ fontSize: "24px" }}>{icon}</Box>}
      <Box sx={{ color: "#cccccc", fontSize: "16px" }}>{label}</Box>
    </Box>
    <Box
      sx={{
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      {value}
    </Box>
  </Box>
);

export const StatsPage = () => {
  const activePlayers = useAtomValue(activePlayersAtom);
  const upgradeLevels = useAtomValue(upgradeLevelsAtom);

  // Get current calculated stats (what player would spawn with)
  const calculatedStats = calculatePlayerStats(upgradeLevels);

  // Get active player stats if in combat (current health may differ)
  const activePlayer = activePlayers[0];
  const currentHealth =
    activePlayer?.currentHealth ?? calculatedStats.maxHealth;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        gap: "40px",
      }}
    >
      {/* Left Side - Player Sprite Showcase */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "8px",
          border: "3px solid #1d1d1d",
        }}
      >
        <Box
          sx={{
            width: "300px",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={PlayerSprite}
            alt="Player"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              imageRendering: "pixelated",
            }}
          />
        </Box>
        <Box
          sx={{
            color: "white",
            fontSize: "28px",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          {calculatedStats.name}
        </Box>
        <Box
          sx={{
            color: "#888888",
            fontSize: "16px",
            marginTop: "8px",
          }}
        >
          Level 1 Hero
        </Box>
      </Box>

      {/* Right Side - Stats List */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Player Stats
        </Box>

        <Stack spacing={1}>
          <StatRow
            icon="❤️"
            label="Current Health"
            value={`${Math.floor(currentHealth)} / ${
              calculatedStats.maxHealth
            }`}
          />
          <StatRow
            icon="💖"
            label="Max Health"
            value={calculatedStats.maxHealth}
          />
          <StatRow
            icon="⚔️"
            label="Attack Damage"
            value={calculatedStats.attackDamage}
          />
          <StatRow
            icon="⚡"
            label="Attack Speed"
            value={`${calculatedStats.attackSpeed} / sec`}
          />
          <StatRow
            icon="💥"
            label="Critical Chance"
            value={`${Math.floor(calculatedStats.critChance)}%`}
          />
        </Stack>

        <Box
          sx={{
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          Combat Info
        </Box>

        <Stack spacing={1}>
          <StatRow
            icon="📊"
            label="DPS (Damage Per Second)"
            value={Math.floor(
              calculatedStats.attackDamage * calculatedStats.attackSpeed
            )}
          />
          <StatRow
            icon="🎯"
            label="Effective DPS (with Crit)"
            value={Math.floor(
              calculatedStats.attackDamage *
                calculatedStats.attackSpeed *
                (1 + calculatedStats.critChance / 100)
            )}
          />
        </Stack>
      </Box>
    </Box>
  );
};
