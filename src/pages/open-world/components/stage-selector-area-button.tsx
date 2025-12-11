import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";

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
      minWidth: "40px",
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
          : COLORS.CARD_BACKGROUND_SECONDARY,
      },
    }}
  >
    {goNext ? <ChevronRightIcon /> : <ChevronLeftIcon />}
  </Button>
);
