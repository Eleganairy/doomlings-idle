import { Box, Stack, Button, Grid } from "@mui/material";
import { useUpgrades } from "../../features/progression/hooks/use-upgrades.hook";
import { ALL_UPGRADES } from "../../features/progression/config/progression.config";
import {
  type Upgrade,
  UpgradeIncrementType,
} from "../../features/progression/types/progression.types";

const formatValue = (value: number, type: UpgradeIncrementType) => {
  switch (type) {
    case UpgradeIncrementType.PERCENTILE:
      return `+${value}%`;
    case UpgradeIncrementType.MULTIPLICATIVE:
      return `×${value}`;
    case UpgradeIncrementType.ADDITIVE:
    default:
      return `+${value}`;
  }
};

interface UpgradeCardProps {
  upgrade: Upgrade;
  level: number;
  currentCost: number;
  totalValue: number;
  totalValueAfterUpgrade: number;
  canAfford: boolean;
  isLocked: boolean;
  onPurchase: () => void;
}

const UpgradeCard = ({
  upgrade,
  level,
  currentCost,
  totalValue,
  totalValueAfterUpgrade,
  canAfford,
  isLocked,
  onPurchase,
}: UpgradeCardProps) => {
  const isMaxed = level >= upgrade.maxLevel;
  const isDisabled = isLocked || isMaxed || !canAfford;

  const getButtonColor = () => {
    if (isMaxed) return "#753b3b";
    if (isLocked) return "#555555";
    if (!canAfford) return "#7a6a3b";
    return "#4060b7";
  };

  const getButtonHoverColor = () => {
    if (isMaxed) return "#753b3b";
    if (isLocked) return "#555555";
    if (!canAfford) return "#7a6a3b";
    return "#5070c7";
  };

  const getButtonText = () => {
    if (isMaxed) return "MAX";
    if (isLocked) return "🔒";
    return `${currentCost}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: isLocked ? "#1c1c1c" : "#2c2c2c",
        border: "3px solid #1d1d1d",
        borderRadius: "4px",
        display: "flex",
        height: "130px",
        overflow: "hidden",
        opacity: isLocked ? 0.6 : 1,
      }}
    >
      {/* Left Section - Icon and Name */}
      <Stack
        sx={{
          width: "120px",
          backgroundColor: "#1d1d1d",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          borderRight: "2px solid #1d1d1d",
        }}
      >
        <Box
          sx={{
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          {upgrade.icon}
        </Box>
        <Box
          sx={{
            color: "white",
            fontSize: "14px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {upgrade.name}
        </Box>
      </Stack>

      {/* Middle Section - Description and Value */}
      <Stack
        sx={{
          flex: 1,
          padding: "15px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            color: "#cccccc",
            fontSize: "13px",
            marginBottom: "10px",
          }}
        >
          {upgrade.description}
        </Box>

        <Box
          sx={{
            backgroundColor: "#1d1d1d",
            padding: "8px",
            borderRadius: "4px",
            border: "2px solid #0d0d0d",
          }}
        >
          <Box
            sx={{
              color: "white",
              fontSize: "16px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {formatValue(totalValue, upgrade.incrementType)} →{" "}
            {formatValue(totalValueAfterUpgrade, upgrade.incrementType)}
          </Box>
        </Box>
      </Stack>

      {/* Right Section - Progress and Upgrade Button */}
      <Stack
        sx={{
          width: "100px",
          backgroundColor: "#1d1d1d",
          padding: "15px 10px",
          borderLeft: "2px solid #1d1d1d",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {level}/{upgrade.maxLevel}
        </Box>

        <Button
          disableRipple
          disableElevation
          disabled={isDisabled}
          onClick={onPurchase}
          sx={{
            width: "100%",
            height: "70px",
            backgroundColor: getButtonColor(),
            color: "white",
            fontSize: "28px",
            fontFamily: "Minecraft",
            border: "2px solid #1d1d1d",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: getButtonHoverColor(),
            },
            "&:focus": {
              outline: "none",
            },
            "&:disabled": {
              color: "#ffffff85",
            },
          }}
        >
          {getButtonText()}
        </Button>
      </Stack>
    </Box>
  );
};

export const UpgradesPage = () => {
  const {
    getLevel,
    getCurrentCost,
    getTotalValue,
    getTotalValueAfterUpgrade,
    canAfford,
    isUnlocked,
    purchaseUpgrade,
  } = useUpgrades();

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <Grid container spacing={3}>
        {ALL_UPGRADES.map((upgrade) => {
          const level = getLevel(upgrade.id);
          const isLocked = !isUnlocked(upgrade.id);

          return (
            <Grid size={4} key={upgrade.id}>
              <UpgradeCard
                upgrade={upgrade}
                level={level}
                currentCost={getCurrentCost(upgrade)}
                totalValue={getTotalValue(upgrade)}
                totalValueAfterUpgrade={getTotalValueAfterUpgrade(upgrade)}
                canAfford={canAfford(upgrade)}
                isLocked={isLocked}
                onPurchase={() => purchaseUpgrade(upgrade.id)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
