import { Box, Stack } from "@mui/material";
import { COLORS } from "../../../constants/colors.constants";
import type { PlayerDefinition } from "../../../features/entity/types/entity.types";
import { FONT_SIZE } from "../../../constants/text.constants";
import { Paragraph } from "../../../shared/ui/paragraph";

interface SlimeGridProps {
  slimes: PlayerDefinition[];
  unlockedIds: string[];
  teamSlimeIds: (string | null)[];
  selectedSlime: PlayerDefinition | null;
  onSelect: (slime: PlayerDefinition) => void;
  onDragStart: (e: React.DragEvent, slimeId: string) => void;
  onDropToRemove: (e: React.DragEvent) => void;
}

const StatBars = ({
  value,
  maxValue,
  color = COLORS.ACCENT_GREEN,
}: {
  value: number;
  maxValue: number;
  color?: string;
}) => {
  const filledBars = Math.round((value / maxValue) * 5);

  return (
    <Stack direction="row" spacing={0.5}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: "8px",
            height: "16px",
            backgroundColor: index < filledBars ? color : "#1a1a1a",
            borderRadius: "2px",
          }}
        />
      ))}
    </Stack>
  );
};

export const SlimeGrid = ({
  slimes,
  unlockedIds,
  teamSlimeIds,
  selectedSlime,
  onSelect,
  onDragStart,
  onDropToRemove,
}: SlimeGridProps) => {
  return (
    <Box
      sx={{
        width: "570px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLORS.CARD_BACKGROUND + "F0",
        borderLeft: `2px solid ${COLORS.CARD_BORDER}`,
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={onDropToRemove}
    >
      {/* Header */}
      <Box
        sx={{
          padding: "16px",
          borderBottom: `1px solid ${COLORS.CARD_BORDER}`,
        }}
      >
        <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.LARGE} isBold>
          Slime Collection
        </Paragraph>
      </Box>

      {/* Grid */}
      <Box
        sx={{
          flex: 1,
          padding: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignContent: "flex-start",
          overflowY: "auto",
        }}
      >
        {[...slimes, ...slimes, ...slimes].map((slime) => {
          const isUnlocked = unlockedIds.includes(slime.id);
          const isInTeam = teamSlimeIds.includes(slime.id);
          const isSelected = selectedSlime?.id === slime.id;

          return (
            <Box
              key={slime.id}
              draggable={isUnlocked && !isInTeam}
              onClick={() => onSelect(slime)}
              onDragStart={(event) => {
                if (isUnlocked && !isInTeam) {
                  onDragStart(event, slime.id);
                  return;
                }
                event.preventDefault();
              }}
              sx={{
                width: "120px",
                height: "120px",
                backgroundColor: isInTeam
                  ? COLORS.CARD_BACKGROUND_CLEAR
                  : COLORS.CARD_BACKGROUND_DARK,
                border: `2px solid ${
                  isSelected ? COLORS.ACCENT_GREEN : COLORS.CARD_BORDER
                }`,
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: isUnlocked
                  ? isInTeam
                    ? "pointer"
                    : "grab"
                  : "disabled",
                opacity: isUnlocked ? 1 : 0.5,
                transition: "all 0.15s",
                "&:hover": isUnlocked
                  ? { borderColor: COLORS.ACCENT_GREEN }
                  : {},
              }}
            >
              <Box
                component="img"
                src={slime.baseStats.icon}
                alt={slime.baseStats.name}
                sx={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                  filter: isUnlocked ? "none" : "grayscale(100%)",
                  mb: "10px",
                }}
              />
              <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.SMALL}>
                {isUnlocked && slime.baseStats.name}
              </Paragraph>
              {!isUnlocked && (
                <Paragraph color={COLORS.TEXT_DISABLED} size={FONT_SIZE.SMALL}>
                  🔒
                </Paragraph>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Details Panel */}
      <Box
        sx={{
          height: "210px",
          borderTop: `2px solid ${COLORS.CARD_BORDER}`,
          padding: "16px",
          backgroundColor: COLORS.CARD_BACKGROUND,
        }}
      >
        {selectedSlime ? (
          <Stack spacing={1}>
            <Paragraph
              color={COLORS.TEXT_PRIMARY}
              size={FONT_SIZE.MEDIUM}
              isBold
            >
              {selectedSlime.baseStats.name}
            </Paragraph>
            <Paragraph color={COLORS.TEXT_SECONDARY} size={FONT_SIZE.SMALL}>
              {selectedSlime.baseStats.description}
            </Paragraph>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: "100%",
              }}
            >
              {/* Left Column */}
              <Stack spacing={1} sx={{ width: "50%" }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Paragraph
                    color={COLORS.HEALTH_PLAYER}
                    size={FONT_SIZE.MEDIUM}
                  >
                    Health
                  </Paragraph>
                  <StatBars
                    value={selectedSlime.baseStats.maxHealth}
                    maxValue={100}
                  />
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Paragraph
                    color={COLORS.ACCENT_ORANGE}
                    size={FONT_SIZE.MEDIUM}
                  >
                    Attack Damage
                  </Paragraph>
                  <StatBars
                    value={selectedSlime.baseStats.attackDamage}
                    maxValue={2}
                  />
                </Stack>
              </Stack>

              {/* Right Column */}
              <Stack spacing={1} sx={{ width: "50%" }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Paragraph color={COLORS.ACCENT_BLUE} size={FONT_SIZE.MEDIUM}>
                    Attack Speed
                  </Paragraph>
                  <StatBars
                    value={selectedSlime.baseStats.attackSpeed}
                    maxValue={2}
                  />
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Paragraph color={COLORS.MANA} size={FONT_SIZE.MEDIUM}>
                    Ability Strength
                  </Paragraph>
                  <StatBars value={1} maxValue={2} />
                </Stack>
              </Stack>
            </Stack>
            {selectedSlime.abilities && selectedSlime.abilities.length > 0 && (
              <Stack spacing={1} pt={3}>
                <Paragraph color={COLORS.MANA} size={FONT_SIZE.MEDIUM} isBold>
                  {selectedSlime.abilities[0].name}
                </Paragraph>
                <Paragraph color={COLORS.TEXT_SECONDARY} size={FONT_SIZE.SMALL}>
                  {selectedSlime.abilities[0].description}
                </Paragraph>
              </Stack>
            )}
          </Stack>
        ) : (
          <Paragraph color={COLORS.TEXT_DISABLED} size={FONT_SIZE.MEDIUM}>
            Click a slime to see details
          </Paragraph>
        )}
      </Box>
    </Box>
  );
};
