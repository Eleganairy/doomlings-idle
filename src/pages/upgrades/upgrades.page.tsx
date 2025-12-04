import { Box, Stack, Button, Grid } from "@mui/material";

// Mock data for demonstration
const mockUpgrades = [
  {
    id: 1,
    name: "Attack Power Boost III",
    description: "Increases the base attack damage of your character",
    icon: "⚔️",
    cost: 100,
    value: 10,
    nextValue: 15,
    valueType: "add",
    amountOfUpgrades: 4,
    cap: 10,
  },
  {
    id: 2,
    name: "Health Boost",
    description: "Increases maximum health points",
    icon: "❤️",
    cost: 150,
    value: 50,
    nextValue: 75,
    valueType: "add",
    amountOfUpgrades: 2,
    cap: 20,
  },
  {
    id: 3,
    name: "Critical Chance",
    description: "Increases the chance to deal critical damage",
    icon: "💥",
    cost: 200,
    value: 10,
    nextValue: 15,
    valueType: "perc",
    amountOfUpgrades: 0,
    cap: 10,
  },
  {
    id: 4,
    name: "Attack Speed",
    description: "Reduces the time between attacks",
    icon: "⚡",
    cost: 120,
    value: 1.5,
    nextValue: 1.8,
    valueType: "mult",
    amountOfUpgrades: 5,
    cap: 15,
  },
  {
    id: 5,
    name: "Defense",
    description: "Reduces incoming damage from enemies",
    icon: "🛡️",
    cost: 180,
    value: 5,
    nextValue: 8,
    valueType: "perc",
    amountOfUpgrades: 3,
    cap: 12,
  },
];

const formatValue = (value: number, type: string) => {
  if (type === "perc") return `${value}%`;
  if (type === "mult") return `x${value}`;
  return `+${value}`;
};

export const UpgradesPage = () => {
  return (
    <Box
      sx={{
        padding: "20px",
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <Grid container spacing={3}>
        {mockUpgrades.map((upgrade) => (
          <Grid size={4} key={upgrade.id}>
            <Box
              sx={{
                backgroundColor: "#2c2c2c",
                border: "3px solid #1d1d1d",
                borderRadius: "4px",
                display: "flex",
                height: "130px",
                overflow: "hidden",
              }}
            >
              {/* Left Section - Icon and Name */}
              <Stack
                sx={{
                  width: "120px",
                  backgroundColor: "#1d1d1d",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                  borderRight: "2px solid #1d1d1d",
                }}
              >
                <Box
                  sx={{
                    fontSize: "48px",
                    marginBottom: "10px",
                  }}
                >
                  {upgrade.icon}
                </Box>
                <Box
                  sx={{
                    color: "white",
                    fontSize: "14px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {upgrade.name}
                </Box>
              </Stack>

              {/* Middle Section - Description and Value */}
              <Stack
                sx={{
                  flex: 1,
                  padding: "15px",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    color: "#cccccc",
                    fontSize: "13px",
                    marginBottom: "10px",
                  }}
                >
                  {upgrade.description}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "#1d1d1d",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "2px solid #0d0d0d",
                  }}
                >
                  <Box
                    sx={{
                      color: "white",
                      fontSize: "16px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {formatValue(upgrade.value, upgrade.valueType)} →{" "}
                    {formatValue(upgrade.nextValue, upgrade.valueType)}
                  </Box>
                </Box>
              </Stack>

              {/* Right Section - Progress and Upgrade Button */}
              <Stack
                sx={{
                  width: "100px",
                  backgroundColor: "#1d1d1d",
                  padding: "15px 10px",
                  borderLeft: "2px solid #1d1d1d",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {upgrade.amountOfUpgrades}/{upgrade.cap}
                </Box>

                <Button
                  disableRipple
                  disableElevation
                  disabled={upgrade.amountOfUpgrades >= upgrade.cap}
                  sx={{
                    width: "100%",
                    height: "70px",
                    backgroundColor:
                      upgrade.amountOfUpgrades >= upgrade.cap
                        ? "#753b3b"
                        : "#4060b7",
                    color: "white",
                    fontSize: "28px",
                    fontFamily: "Minecraft",
                    border: "2px solid #1d1d1d",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor:
                        upgrade.amountOfUpgrades >= upgrade.cap
                          ? "#753b3b"
                          : "#5070c7",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                    "&:disabled": {
                      color: "#ffffff85",
                    },
                  }}
                >
                  {upgrade.amountOfUpgrades >= upgrade.cap
                    ? "MAX"
                    : `${upgrade.cost}`}
                </Button>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
