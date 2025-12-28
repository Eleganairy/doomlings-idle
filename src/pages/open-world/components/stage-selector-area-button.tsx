import { Button } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import ArrowRight from "/icons/ArrowRight.png";
import ArrowLeft from "/icons/ArrowLeft.png";

export interface StageSelectorAreaButtonProps {
  handleNavigation: () => void;
  isActive: boolean;
  goNext: boolean;
}

export const StageSelectorAreaButton = ({
  handleNavigation,
  isActive,
  goNext,
}: StageSelectorAreaButtonProps) => (
  <Button
    onClick={handleNavigation}
    disableRipple
    sx={{
      height: "50px",
      backgroundColor: isActive
        ? COLORS.ACCENT_GREEN
        : COLORS.CARD_BACKGROUND_SECONDARY,
      color: "white",
      border: `3px solid ${COLORS.CARD_BORDER}`,
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: isActive
          ? COLORS.ACCENT_LIGHT_GREEN
          : COLORS.CARD_BACKGROUND_SECONDARY_HOVER,
      },
    }}
  >
    {goNext ? (
      <img height="38px" src={ArrowLeft} />
    ) : (
      <img height="38px" src={ArrowRight} />
    )}
  </Button>
);
