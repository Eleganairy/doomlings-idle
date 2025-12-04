import { Box, Stack, Button } from "@mui/material";
import { useCombat } from "../../features/combat/hooks/useCombat.hook";

export const OpenWorldPage = () => {
  const {
    player,
    enemy,
    isCombatActive,
    playerAttackProgress,
    enemyAttackProgress,
    toggleCombat,
  } = useCombat();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Left Section - Players */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "7%",
          marginLeft: "1%",
        }}
      >
        <Stack direction="row" spacing={3}>
          {/* {[1].map((player) => ( */}
          <Stack
            // key={`player-${player}`}
            alignItems="center"
            spacing={0.5}
            sx={{ width: "200px" }}
          >
            {/* Health Points */}
            <Box sx={{ color: "white", fontSize: "14px" }}>
              HP: {Math.round(player.currentHealth)}/{player.totalHealth}
            </Box>

            {/* Health Bar */}
            <Box
              sx={{
                width: "100%",
                height: "10px",
                backgroundColor: "#2c2c2c",
                border: "2px solid #1d1d1d",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${
                    (player.currentHealth / player.totalHealth) * 100
                  }%`,
                  height: "100%",
                  backgroundColor: "#4caf50",
                }}
              />
            </Box>

            {/* Attack Progress Bar */}
            <Box
              sx={{
                width: "100%",
                height: "8px",
                backgroundColor: "#2c2c2c",
                border: "2px solid #1d1d1d",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${playerAttackProgress}%`,
                  height: "100%",
                  backgroundColor: "#ff9800",
                  transition: "width 0.1s",
                }}
              />
            </Box>

            {/* Player Box */}
            <Box
              sx={{
                width: "200px",
                height: "300px",
                backgroundColor: "#4060b7",
                border: "3px solid #1d1d1d",
                borderRadius: "4px",
              }}
            />
          </Stack>
          {/* ))} */}
        </Stack>
      </Box>

      {/* Middle Section - Information */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        {/* Top - Level Selection */}
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              backgroundColor: "#2c2c2c",
              border: "3px solid #1d1d1d",
              borderRadius: "4px",
              padding: "10px",
            }}
          >
            <Stack direction="row" spacing={1}>
              {["<-", 1, 2, 3, 4, 5, "->"].map((level) => (
                <Button
                  key={`level-${level}`}
                  disableRipple
                  disableElevation
                  sx={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    backgroundColor: level === 1 ? "#4060b7" : "#753b3b",
                    color: "white",
                    border: "2px solid #1d1d1d",
                    borderRadius: "4px",
                    fontFamily: "Minecraft",
                    "&:hover": {
                      backgroundColor: level === 1 ? "#4060b7" : "#753b3b",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  {level}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* Defeated Enemies Counter */}
          <Box
            sx={{
              color: "white",
              fontSize: "18px",
              backgroundColor: "#2c2c2c",
              border: "2px solid #1d1d1d",
              borderRadius: "4px",
              padding: "10px 20px",
            }}
          >
            Defeated: 0/50
          </Box>
        </Stack>

        {/* Start or Pause combat button */}
        <Button
          onClick={toggleCombat}
          disableRipple
          disableElevation
          sx={{
            width: "200px",
            height: "60px",
            backgroundColor: isCombatActive ? "#b74040" : "#4caf50",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            border: "3px solid #1d1d1d",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: isCombatActive ? "#d45050" : "#5cbf60",
            },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          {isCombatActive ? "PAUSE" : "START"}
        </Button>

        {/* Bottom - Challenge Boss Button */}
        <Button
          disableRipple
          disableElevation
          sx={{
            width: "200px",
            height: "60px",
            backgroundColor: "#b74040",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            border: "3px solid #1d1d1d",
            borderRadius: "4px",
            fontFamily: "Minecraft",
            "&:hover": {
              backgroundColor: "#d45050",
            },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          Challenge Boss
        </Button>
      </Box>

      {/* Right Section - Enemies */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "7%",
          marginRight: "1%",
        }}
      >
        <Stack direction="row" spacing={3}>
          {/* {[1].map((enemy) => ( */}
          <Stack
            //   key={`enemy-${enemy}`}
            alignItems="center"
            spacing={0.5}
            sx={{ width: "200px" }}
          >
            {/* Health Points */}
            <Box sx={{ color: "white", fontSize: "14px" }}>
              HP: {Math.round(enemy.currentHealth)}/{enemy.health}
            </Box>

            {/* Health Bar */}
            <Box
              sx={{
                width: "100%",
                height: "10px",
                backgroundColor: "#2c2c2c",
                border: "2px solid #1d1d1d",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${(enemy.currentHealth / enemy.health) * 100}%`,
                  height: "100%",
                  backgroundColor: "#f44336",
                }}
              />
            </Box>

            {/* Attack Progress Bar */}
            <Box
              sx={{
                width: "100%",
                height: "8px",
                backgroundColor: "#2c2c2c",
                border: "2px solid #1d1d1d",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${enemyAttackProgress}%`,
                  height: "100%",
                  backgroundColor: "#ff9800",
                  transition: "width 0.1s",
                }}
              />
            </Box>

            {/* Enemy Box */}
            <Box
              sx={{
                width: "200px",
                height: "300px",
                backgroundColor: "#b74040",
                border: "3px solid #1d1d1d",
                borderRadius: "4px",
              }}
            />
          </Stack>
          {/* ))} */}
        </Stack>
      </Box>
    </Box>
  );
};
