import { Box } from "@mui/material";

type ParagraphProps = {
  children: React.ReactNode;
  color: string;
  size: string;
  isBold?: boolean;
};

export const Paragraph = ({
  children,
  color,
  size,
  isBold,
}: ParagraphProps) => {
  return (
    <Box
      style={{
        color: color,
        fontFamily: "Minecraft, sans-serif",
        fontSize: size,
        fontWeight: isBold ? "bold" : "normal",
      }}
    >
      {children}
    </Box>
  );
};
