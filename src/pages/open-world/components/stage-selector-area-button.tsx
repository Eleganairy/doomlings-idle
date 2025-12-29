import { Button } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import ArrowRight from "/icons/ArrowRight.png";
import ArrowLeft from "/icons/ArrowLeft.png";

export interface StageSelectorAreaButtonProps {
  handleNavigation: () => void;
  isActive: boolean;
  isFirstWorldActive: boolean;
  goNext: boolean;
}

export const StageSelectorAreaButton = ({
  handleNavigation,
  isActive,
  isFirstWorldActive,
  goNext,
}: StageSelectorAreaButtonProps) => {
  const getButtonBackGroundColor = () => {
    if (!goNext) {
      return isFirstWorldActive
        ? COLORS.CARD_BACKGROUND_SECONDARY
        : COLORS.BUTTON_INACTIVE;
    }
    return isActive ? COLORS.BUTTON_INACTIVE : COLORS.BUTTON_DISABLED;
  };

  return (
    <Button
      onClick={handleNavigation}
      disableRipple
      sx={{
        height: "50px",
        backgroundColor: getButtonBackGroundColor(),
        color: "white",
        border: `3px solid ${COLORS.CARD_BORDER}`,
        borderRadius: "4px",
        "&:hover": {
          backgroundColor: isActive ? COLORS.BUTTON_INACTIVE_HOVER : "",
        },
        cursor: isActive ? "pointer" : "default",
      }}
    >
      {goNext ? (
        <img height="38px" src={ArrowLeft} />
      ) : (
        <img height="38px" src={ArrowRight} />
      )}
    </Button>
  );
};
