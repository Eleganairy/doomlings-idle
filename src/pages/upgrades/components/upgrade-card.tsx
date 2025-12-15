import { Button, Box, Stack } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import {
  UpgradeIncrementType,
  type Upgrade,
} from "../../../features/progression/types/progression.types";

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

const formatValue = (value: number, type: UpgradeIncrementType) => {
  switch (type) {
    case UpgradeIncrementType.PERCENTILE:
      return `+${value}%`;
    case UpgradeIncrementType.MULTIPLICATIVE:
      return `×${value}`;
    case UpgradeIncrementType.ADDITIVE:
      return `+${value}`;
  }
};

export const UpgradeCard = ({
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
    if (isMaxed) return COLORS.ACCENT_GREEN;
    if (!canAfford) return COLORS.BUTTON_DISABLED;
    return COLORS.BUTTON_INACTIVE;
  };

  const getButtonHoverColor = () => {
    if (isMaxed) return COLORS.ACCENT_GREEN;
    if (!canAfford) return COLORS.BUTTON_DISABLED;
    return COLORS.BUTTON_INACTIVE_HOVER;
  };

  const getButtonClickedColor = () => {
    if (isMaxed) return COLORS.ACCENT_GREEN;
    if (!canAfford) return COLORS.BUTTON_DISABLED;
    return COLORS.BUTTON_INACTIVE_CLICK;
  };

  const getButtonText = () => {
    if (isMaxed) return "Maxed";
    return `${currentCost}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: COLORS.CARD_BACKGROUND,
        border: `3px solid ${COLORS.CARD_BORDER}`,
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
          backgroundColor: COLORS.CARD_BACKGROUND_DARK,
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          borderRight: `2px solid ${COLORS.CARD_BORDER}`,
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
            color: COLORS.TEXT_PRIMARY,
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
            color: COLORS.TEXT_SECONDARY,
            fontSize: "13px",
            marginBottom: "10px",
          }}
        >
          {upgrade.description}
        </Box>

        <Box
          sx={{
            backgroundColor: COLORS.CARD_BACKGROUND_DARK,
            padding: "8px",
            borderRadius: "4px",
            border: `2px solid ${COLORS.CARD_BORDER_DARK}`,
          }}
        >
          <Box
            sx={{
              color: COLORS.TEXT_PRIMARY,
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
          backgroundColor: COLORS.CARD_BACKGROUND_DARK,
          padding: "15px 10px",
          borderLeft: `2px solid ${COLORS.CARD_BORDER}`,
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
            fontSize: isMaxed ? "22px" : "28px",
            fontFamily: "Minecraft",
            border: `2px solid ${COLORS.CARD_BORDER}`,
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: getButtonHoverColor(),
            },
            "&:active": {
              backgroundColor: getButtonClickedColor(),
            },
            "&:disabled": {
              cursor: "not-allowed",
              color: COLORS.TEXT_DISABLED,
            },
          }}
        >
          {getButtonText()}
        </Button>
      </Stack>
    </Box>
  );
};
