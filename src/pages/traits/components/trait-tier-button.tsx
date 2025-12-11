import { Button } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import {
  getButtonBaseStateColors,
  getButtonClickedStateColors,
  getButtonHoverStateColors,
} from "../../../utils/button-state-colors.utils";

interface TraitTierButtonProps {
  tier: number;
  isAvailable: boolean;
  isSelected: boolean;
  handleSelectTier: (tier: number) => void;
}

export const TraitTierButton = ({
  tier,
  isAvailable,
  isSelected,
  handleSelectTier,
}: TraitTierButtonProps) => {
  return (
    <Button
      key={tier}
      disableRipple
      disableElevation
      disabled={!isAvailable}
      onClick={() => handleSelectTier(tier)}
      sx={{
        minWidth: "100px",
        height: "40px",
        backgroundColor: getButtonBaseStateColors(isSelected, !isAvailable),
        color: isAvailable ? COLORS.TEXT_PRIMARY : COLORS.TEXT_DISABLED,
        border: `2px solid ${
          isSelected ? COLORS.CARD_BORDER_ACTIVE : COLORS.CARD_BORDER
        }`,
        borderRadius: "4px",
        fontWeight: "bold",
        fontFamily: "Minecraft",
        "&:hover": {
          backgroundColor: getButtonHoverStateColors(isSelected, !isAvailable),
        },
        "&:disabled": {
          cursor: "not-allowed",
          backgroundColor: getButtonClickedStateColors(
            isSelected,
            !isAvailable
          ),
        },
      }}
    >
      Tier {tier}
    </Button>
  );
};
