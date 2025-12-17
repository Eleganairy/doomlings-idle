import { Box } from "@mui/material";

interface MainContentProps {
  activeBackground: string;
  children?: React.ReactNode;
}

export const MainContent = ({
  children,
  activeBackground,
}: MainContentProps) => (
  <Box
    component={"main"}
    sx={{
      flex: 1,
      backgroundImage: `url(${activeBackground})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "20px",
    }}
  >
    {children}
  </Box>
);
