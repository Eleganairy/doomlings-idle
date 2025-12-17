import { Box, Stack } from "@mui/material";
import { COLORS } from "../../constants/colors.constants";
import { Paragraph } from "../ui/paragraph";
import { FONT_SIZE } from "../../constants/text.constants";

interface HeaderProps {
  energy: number;
  sprite: string;
}

export const Header = ({ energy, sprite }: HeaderProps) => (
  <Stack
    component={"header"}
    direction={"row"}
    sx={{
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      backgroundColor: COLORS.CARD_BACKGROUND,
      borderBottom: `3px solid ${COLORS.CARD_BORDER}`,
      height: "5%",
      color: "white",
    }}
  >
    <Stack direction={"row"} spacing={5} sx={{ flex: 1, textAlign: "left" }}>
      <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.LARGE}>
        Energy: {energy}
      </Paragraph>
      <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.LARGE}>
        Meteorite shards: {energy}
      </Paragraph>
    </Stack>
    <Box sx={{ flex: 1, textAlign: "center", paddingBottom: "30px" }}>
      <img src={sprite} alt="Player Icon" height={"100px"} width={"100px"} />
    </Box>
    <Stack
      direction={"row"}
      sx={{ flex: 1, textAlign: "right", justifyContent: "space-around" }}
    >
      <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM}>
        Currency 1: 0
      </Paragraph>
      <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM}>
        Currency 2: 0
      </Paragraph>
      <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.MEDIUM}>
        Currency 3: 0
      </Paragraph>
    </Stack>
  </Stack>
);
