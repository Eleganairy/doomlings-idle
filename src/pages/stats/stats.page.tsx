import { Box, Stack } from "@mui/material";
import { useAtomValue } from "jotai";
import { calculatePlayerStats } from "../../features/player/helpers/calculate-player-stats.helper";
import { upgradeLevelsAtom } from "../../features/progression/store/progression.atoms";
import PlayerSprite from "/player/Blob1.png";
import { StatRow } from "./components";
import { BigNumber } from "../../utils/big-number.utils";
import { COLORS } from "../../constants/colors.constants";

export const StatsPage = () => {
  const upgradeLevels = useAtomValue(upgradeLevelsAtom);

  // Get current calculated stats (what player would spawn with)
  const calculatedStats = calculatePlayerStats(upgradeLevels);

  const fullHealth = new BigNumber(calculatedStats.maxHealth).format();
  const fullAttackDamage = new BigNumber(calculatedStats.attackDamage).format();

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
          backgroundColor: COLORS.CARD_BACKGROUND_CLEAR,
          borderRadius: "8px",
          border: `3px solid ${COLORS.CARD_BORDER}`,
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
            }}
          />
        </Box>
        <Box
          sx={{
            color: COLORS.TEXT_PRIMARY,
            fontSize: "28px",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          {calculatedStats.name}
        </Box>
        <Box
          sx={{
            color: COLORS.TEXT_SECONDARY,
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
          <StatRow icon="❤️" label="Max Health" value={fullHealth} />
          <StatRow icon="⚔️" label="Attack Damage" value={fullAttackDamage} />
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
          <StatRow
            icon="🛡️"
            label="Shield"
            value={Math.floor(calculatedStats.shield)}
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
