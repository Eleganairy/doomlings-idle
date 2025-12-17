import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { PageTypes } from "../../constants/pages.constants";
import { usePersistentCombat } from "../../features/combat/hooks/use-persistent-combat.hook";
import { playerEnergyAtom } from "../../features/combat/store/combat.atoms";
import { pageComponents } from "../../utils/pages.utils";
import { Footer, Header, MainContent } from "../base";
import background from "/area/GrasslandsBackground.png";
import PlayerSprite from "/player/BasicSlime.png";

export const Layout = () => {
  const playerEnergy = useAtomValue(playerEnergyAtom);

  // Run persistent combat in background
  usePersistentCombat();

  const [activePage, setActivePage] = useState(PageTypes.OPEN_WORLD);
  const ActivePageComponent = pageComponents[activePage];

  const handlePageNavigation = (pageId: PageTypes) => {
    setActivePage(pageId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header energy={playerEnergy} sprite={PlayerSprite} />

      <MainContent activeBackground={background}>
        {ActivePageComponent ? (
          <ActivePageComponent />
        ) : (
          <div>Page not found</div>
        )}
      </MainContent>

      <Footer
        activePage={activePage}
        handleNavigation={(pageId: PageTypes) => handlePageNavigation(pageId)}
      />
    </Box>
  );
};
