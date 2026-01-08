import { Box, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { useTraits } from "../../features/progression/hooks/use-traits.hook";
import { TraitCard, TraitTierButton } from "./components";
import { bn } from "../../utils/big-number.utils";

export const TraitsPage = () => {
  const [selectedTier, setSelectedTier] = useState(1);
  const { getTraitsWithProgressByTier, getAvailableTiers } = useTraits();

  const availableTiers = getAvailableTiers();
  const traitsWithProgress = getTraitsWithProgressByTier(selectedTier);

  // Generate 10 tier buttons
  // TODO: Make actual tiers for the traits
  const tierButtons = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "hidden",
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
            <Box key={`tier-${tier}`}>
              <TraitTierButton
                tier={tier}
                isAvailable={isAvailable}
                isSelected={isSelected}
                handleSelectTier={(tierId: number) => setSelectedTier(tierId)}
              />
            </Box>
          );
        })}
      </Stack>

      {/* Traits Grid */}
      <Grid container spacing={2}>
        {traitsWithProgress.map(({ trait, currentValue, isCompleted }) => (
          <Grid size={6} key={trait.id}>
            <TraitCard
              trait={trait}
              currentValue={bn(currentValue)}
              isCompleted={isCompleted}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
