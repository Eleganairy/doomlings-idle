import LockIcon from "@mui/icons-material/Lock";
import { Button } from "@mui/material";
import { COLORS } from "../../constants/colors.constants";
import type { Page, PageTypes } from "../../constants/pages.constants";
import {
  getButtonBaseStateColors,
  getButtonClickedStateColors,
  getButtonHoverStateColors,
} from "../../utils/button-state-colors.utils";

export interface FooterNavigationButtonProps {
  page: Page;
  pageIsLocked: boolean;
  pageIsActive: boolean;
  handleNavigation: (pageId: PageTypes) => void;
}

export const FooterNavigationButton = ({
  page,
  pageIsLocked,
  pageIsActive,
  handleNavigation,
}: FooterNavigationButtonProps) => {
  return (
    <Button
      onClick={() => !pageIsLocked && handleNavigation(page.id)}
      disableRipple
      sx={{
        height: "80px",
        width: "80px",
        backgroundColor: getButtonBaseStateColors(pageIsActive, pageIsLocked),
        color: pageIsLocked ? COLORS.TEXT_DISABLED : COLORS.TEXT_PRIMARY,
        border: `3px solid ${
          pageIsActive ? COLORS.CARD_BORDER_ACTIVE : COLORS.CARD_BORDER
        }`,
        marginBottom: "10px",
        fontFamily: "Minecraft",
        "&:hover": {
          backgroundColor: getButtonHoverStateColors(
            pageIsActive,
            pageIsLocked
          ),
        },
        "&:active": {
          backgroundColor: getButtonClickedStateColors(
            pageIsActive,
            pageIsLocked
          ),
        },
      }}
    >
      {pageIsLocked ? (
        <LockIcon sx={{ fontSize: "40px" }} />
      ) : (
        <img height={"60px"} src={page.icon} alt={"ICON"} />
      )}
    </Button>
  );
};
