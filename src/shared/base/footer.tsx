import { Box, Stack } from "@mui/material";
import { COLORS } from "../../constants/colors.constants";
import { Pages, type PageTypes } from "../../constants/pages.constants";
import { FooterNavigationButton } from "../ui/footer-navigation-button";
import { Paragraph } from "../ui/paragraph";
import { FONT_SIZE } from "../../constants/text.constants";

interface FooterProps {
  activePage: PageTypes;
  handleNavigation: (pageId: PageTypes) => void;
}

export const Footer = ({ activePage, handleNavigation }: FooterProps) => (
  <Box
    component={"footer"}
    sx={{
      padding: "10px",
      backgroundColor: COLORS.CARD_BACKGROUND,
      borderTop: `3px solid ${COLORS.CARD_BORDER}`,
      height: "12%",
    }}
  >
    <Stack direction={"row"} justifyContent={"space-around"}>
      {Pages.map((page) => {
        const pageIsActive = page.id === activePage;
        const pageIsLocked = page.lockedByBossNumber > 0;
        return (
          <Stack key={`page-${page.id}`} alignItems={"center"}>
            <FooterNavigationButton
              page={page}
              pageIsLocked={pageIsLocked}
              pageIsActive={pageIsActive}
              handleNavigation={(pageId) => handleNavigation(pageId)}
            />
            <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM}>
              {pageIsLocked ? page.lockedByBossNumber : page.name}
            </Paragraph>
          </Stack>
        );
      })}
    </Stack>
  </Box>
);
