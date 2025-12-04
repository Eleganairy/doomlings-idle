import { Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Stack } from "@mui/system";
import background from "../../../public/doomlings-idle-background.png";
import { Pages, PageTypes } from "../../constants/pages.constants";
import { useState } from "react";
import { pageComponents } from "../../utils/pages.utils";

export const Layout = () => {
  const [activePage, setActivePage] = useState(PageTypes.OPEN_WORLD);
  const ActivePageComponent = pageComponents[activePage];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header */}
      <Stack
        component={"header"}
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#2c2c2c",
          borderBottom: "3px solid #1d1d1d",
          height: "5%",
          color: "white",
        }}
      >
        <Box sx={{ flex: 1, textAlign: "left" }}>Energy: 0</Box>
        <Box sx={{ flex: 1, textAlign: "center" }}>Player Icon</Box>
        <Stack
          direction={"row"}
          sx={{ flex: 1, textAlign: "right", justifyContent: "space-around" }}
        >
          <Box>Currency 1: 0</Box>
          <Box>Currency 1: 0</Box>
          <Box>Currency 1: 0</Box>
        </Stack>
      </Stack>

      {/* Main Content */}
      <Box
        component={"main"}
        sx={{
          flex: 1,
          backgroundImage: `url(${background})`, // Path to the image in the public folder
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // padding: "20px",
          // overflow: "hidden",
        }}
      >
        {ActivePageComponent ? (
          <ActivePageComponent />
        ) : (
          <div>Page not found</div>
        )}
      </Box>

      {/* Footer */}
      <Box
        component={"footer"}
        sx={{
          padding: "10px",
          backgroundColor: "#2c2c2c",
          borderTop: "3px solid #1d1d1d",
          height: "12%",
        }}
      >
        <Stack direction={"row"} justifyContent={"space-around"}>
          {Pages.map((page) => (
            <Stack
              key={`page-${page.id}`}
              direction={"column"}
              alignItems={"center"}
              color={"white"}
            >
              {page.lockedByBossNumber > 0 ? (
                <>
                  <Button
                    onClick={() => setActivePage(page.id)}
                    disableRipple
                    sx={{
                      height: "80px",
                      width: "80px",
                      backgroundColor: "#753b3b",
                      color: "#ffffff85",
                      border: "3px solid #1d1d1d",
                      marginBottom: "10px",
                      cursor: "default",
                      fontFamily: "Minecraft",
                    }}
                  >
                    <LockIcon sx={{ fontSize: "40px" }} />
                  </Button>
                  {page.lockedByBossNumber}
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setActivePage(page.id)}
                    disableRipple
                    sx={{
                      height: "80px",
                      width: "80px",
                      backgroundColor:
                        page.id === activePage ? "#4060b7" : "#b74040",
                      color: "white",
                      border: "3px solid #1d1d1d",
                      marginBottom: "10px",
                      fontFamily: "Minecraft",
                      "&:hover": {
                        backgroundColor:
                          page.id === activePage ? "#4a70da" : "#d74d4d",
                      },
                      "&:active": {
                        backgroundColor:
                          page.id === activePage ? "#5f86f2" : "#eb6161",
                      },
                    }}
                  >
                    {page.icon}
                  </Button>
                  {page.name}
                </>
              )}
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
