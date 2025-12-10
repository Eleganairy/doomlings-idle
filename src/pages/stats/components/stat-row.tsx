import { Box } from "@mui/system";
import { COLORS } from "../../../constants/colors.constants";

interface StatRowProps {
  label: string;
  value: string | number;
  icon?: string;
}

export const StatRow = ({ label, value, icon }: StatRowProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      backgroundColor: COLORS.CARD_BACKGROUND,
      border: `2px solid ${COLORS.CARD_BORDER}`,
      borderRadius: "4px",
      marginBottom: "8px",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {icon && <Box sx={{ fontSize: "24px" }}>{icon}</Box>}
      <Box sx={{ color: COLORS.TEXT_SECONDARY, fontSize: "16px" }}>{label}</Box>
    </Box>
    <Box
      sx={{
        color: COLORS.TEXT_PRIMARY,
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      {value}
    </Box>
  </Box>
);
