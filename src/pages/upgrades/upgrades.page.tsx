import { Box, Grid } from "@mui/material";
import { ALL_UPGRADES } from "../../features/progression/config/progression.config";
import { useUpgrades } from "../../features/progression/hooks/use-upgrades.hook";
import { UpgradeCard } from "./components/upgrade-card";

export const UpgradesPage = () => {
  const {
    getLevel,
    getCurrentCost,
    getTotalValue,
    getTotalValueAfterUpgrade,
    canAfford,
    isUnlocked,
    purchaseUpgrade,
  } = useUpgrades();

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <Grid container spacing={3}>
        {ALL_UPGRADES.map((upgrade) => {
          const level = getLevel(upgrade.id);
          const isLocked = !isUnlocked(upgrade.id);

          return (
            <Grid size={4} key={upgrade.id}>
              <UpgradeCard
                upgrade={upgrade}
                level={level}
                currentCost={getCurrentCost(upgrade)}
                totalValue={getTotalValue(upgrade)}
                totalValueAfterUpgrade={getTotalValueAfterUpgrade(upgrade)}
                canAfford={canAfford(upgrade)}
                isLocked={isLocked}
                onPurchase={() => purchaseUpgrade(upgrade.id)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
