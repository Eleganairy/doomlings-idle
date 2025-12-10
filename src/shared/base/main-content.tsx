import { Box } from "@mui/system";

interface MainContentProps {
  background: string;
  children?: React.ReactNode;
}

export const MainContent = ({ children, background }: MainContentProps) => (
  <Box
    component={"main"}
    sx={{
      flex: 1,
      backgroundImage: `url(${background})`, // Path to the image in the public folder
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "20px",
    }}
  >
    {children}
  </Box>
);
