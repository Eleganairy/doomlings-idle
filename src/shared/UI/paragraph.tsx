import { Box } from "@mui/material";

type ParagraphProps = {
  children: React.ReactNode;
  color: string;
  size: string;
};

export const Paragraph = ({ children, color, size }: ParagraphProps) => {
  return (
    <Box
      style={{
        color: color,
        fontFamily: "Minecraft, sans-serif",
        fontSize: size,
      }}
    >
      {children}
    </Box>
  );
};
