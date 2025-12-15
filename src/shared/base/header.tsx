import { Box, Stack } from "@mui/material";
import { COLORS } from "../../constants/colors.constants";

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
    <Box sx={{ flex: 1, textAlign: "left" }}>Energy: {energy}</Box>
    <Box sx={{ flex: 1, textAlign: "center", paddingBottom: "30px" }}>
      <img src={sprite} alt="Player Icon" height={"100px"} width={"100px"} />
    </Box>
    <Stack
      direction={"row"}
      sx={{ flex: 1, textAlign: "right", justifyContent: "space-around" }}
    >
      <Box>Currency 1: 0</Box>
      <Box>Currency 1: 0</Box>
      <Box>Currency 1: 0</Box>
    </Stack>
  </Stack>
);
