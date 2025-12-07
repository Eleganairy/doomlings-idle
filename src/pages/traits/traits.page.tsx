import { useState } from "react";
import { Box, Stack, Button, Grid } from "@mui/material";
import { useTraits } from "../../features/progression/hooks/use-traits.hook";
import { getUpgradeById } from "../../features/progression/config/progression.config";
import type { Trait } from "../../features/progression/types/progression.types";

interface TraitCardProps {
  trait: Trait;
  currentValue: number;
  isCompleted: boolean;
}

const TraitCard = ({ trait, currentValue, isCompleted }: TraitCardProps) => {
  const progress = Math.min((currentValue / trait.goalValue) * 100, 100);
  const linkedUpgrade = trait.linkedUpgrade
    ? getUpgradeById(trait.linkedUpgrade)
    : null;

  return (
    <Box
      sx={{
        backgroundColor: isCompleted ? "#2c3c2c" : "#2c2c2c",
        border: `3px solid ${isCompleted ? "#4a6a4a" : "#1d1d1d"}`,
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        gap: "16px",
      }}
    >
      {/* Icon Section */}
      <Box
        sx={{
          width: "64px",
          height: "64px",
          backgroundColor: "#1d1d1d",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          flexShrink: 0,
        }}
      >
        {isCompleted ? "✓" : trait.icon}
      </Box>

      {/* Content Section */}
      <Stack sx={{ flex: 1, gap: "8px" }}>
        {/* Name */}
        <Box
          sx={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {trait.name}
        </Box>

        {/* Description */}
        <Box
          sx={{
            color: "#aaaaaa",
            fontSize: "14px",
          }}
        >
          {trait.description}
        </Box>

        {/* Progress Bar */}
        <Box
          sx={{
            width: "100%",
            height: "20px",
            backgroundColor: "#1d1d1d",
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: isCompleted ? "#4caf50" : "#ff9800",
              transition: "width 0.3s ease",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              textShadow: "1px 1px 2px black",
            }}
          >
            {Math.floor(currentValue)} / {trait.goalValue}
          </Box>
        </Box>

        {/* Linked Upgrade */}
        {linkedUpgrade && (
          <Box
            sx={{
              color: isCompleted ? "#8cff8c" : "#888888",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isCompleted ? "✓ Unlocked:" : "🔒 Unlocks:"} {linkedUpgrade.name}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export const TraitsPage = () => {
  const [selectedTier, setSelectedTier] = useState(1);
  const { getTraitsWithProgressByTier, getAvailableTiers } = useTraits();

  const availableTiers = getAvailableTiers();
  const traitsWithProgress = getTraitsWithProgressByTier(selectedTier);

  // Generate 10 tier buttons
  const tierButtons = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >
      {/* Tier Tabs */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {tierButtons.map((tier) => {
          const isAvailable = availableTiers.includes(tier);
          const isSelected = selectedTier === tier;

          return (
            <Button
              key={tier}
              disableRipple
              disableElevation
              disabled={!isAvailable}
              onClick={() => setSelectedTier(tier)}
              sx={{
                minWidth: "60px",
                height: "40px",
                backgroundColor: isSelected
                  ? "#4060b7"
                  : isAvailable
                  ? "#2c2c2c"
                  : "#1a1a1a",
                color: isAvailable ? "white" : "#555555",
                border: isSelected ? "2px solid #6080d7" : "2px solid #1d1d1d",
                borderRadius: "4px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: isAvailable
                    ? isSelected
                      ? "#4060b7"
                      : "#3c3c3c"
                    : "#1a1a1a",
                },
                "&:disabled": {
                  color: "#555555",
                },
              }}
            >
              Tier {tier}
            </Button>
          );
        })}
      </Stack>

      {/* Traits Grid */}
      {traitsWithProgress.length > 0 ? (
        <Grid container spacing={2}>
          {traitsWithProgress.map(({ trait, currentValue, isCompleted }) => (
            <Grid size={6} key={trait.id}>
              <TraitCard
                trait={trait}
                currentValue={currentValue}
                isCompleted={isCompleted}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            color: "#666666",
            textAlign: "center",
            padding: "40px",
            fontSize: "18px",
          }}
        >
          No traits available for Tier {selectedTier}
        </Box>
      )}
    </Box>
  );
};
