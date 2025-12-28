import { Box, Stack } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import { FONT_SIZE } from "../../../constants/text.constants";
import type { Area } from "../../../features/world/config/area-list.config";
import { Paragraph } from "../../../shared/ui/paragraph";

interface AreaButtonProps {
  area: Area;
  isActive: boolean;
  isUnlocked: boolean;
  onSelect: () => void;
}

export const AreaButton = ({
  area,
  isActive,
  isUnlocked,
  onSelect,
}: AreaButtonProps) => {
  // Get icons from enemy baseStats
  const enemyIcons = Object.values(area.enemyPool).map(
    (enemy) => enemy.baseStats.icon
  );

  return (
    <Box
      onClick={isUnlocked ? onSelect : undefined}
      sx={{
        width: "100%",
        height: "150px",
        position: "relative",
        cursor: isUnlocked ? "pointer" : "default",
        border: isActive ? `4px solid white` : `4px solid black`,
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${area.background})`,
          height: "150px",
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          filter: isUnlocked ? "none" : "grayscale(100%)",
          opacity: isUnlocked ? 1 : 0.9,
        }}
      />

      {/* Dark Overlay for better text readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {/* Area Name */}
        <Box
          sx={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            marginBottom: "8px",
          }}
        >
          <Paragraph
            color={isUnlocked ? COLORS.TEXT_PRIMARY : COLORS.TEXT_DISABLED}
            size={FONT_SIZE.LARGE}
            isBold
          >
            {area.name}
          </Paragraph>
        </Box>

        {/* Enemy Icons Row */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {enemyIcons.map((icon, index) => (
            <Box
              key={index}
              component="img"
              src={icon}
              alt="enemy"
              sx={{
                width: "32px",
                height: "32px",
                filter: isUnlocked ? "none" : "grayscale(100%)",
                opacity: isUnlocked ? 1 : 0.6,
                objectFit: "contain",
              }}
            />
          ))}
        </Stack>

        {/* Locked indicator */}
        {!isUnlocked && (
          <Box
            sx={{
              marginTop: "8px",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
            }}
          >
            <Paragraph color={COLORS.TEXT_DISABLED} size={FONT_SIZE.SMALL}>
              🔒 Locked
            </Paragraph>
          </Box>
        )}
      </Box>
    </Box>
  );
};
