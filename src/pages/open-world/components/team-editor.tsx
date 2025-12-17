import { Box, Button, Stack } from "@mui/material";
import { useState, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { COLORS } from "../../../constants/colors.constants";
import {
  playerTeamAtom,
  unlockedSlimeIdsAtom,
} from "../../../features/team/store/team.atoms";
import { PLAYER_DEFINITIONS } from "../../../features/entity/config/player-definitions.config";
import type { PlayerDefinition } from "../../../features/entity/types/entity.types";
import { TeamEditorSlot } from "./team-editor-slot";
import { SlimeGrid } from "./slime-grid";

interface TeamEditorProps {
  onClose: () => void;
}

export const TeamEditor = ({ onClose }: TeamEditorProps) => {
  const [teamConfig, setTeamConfig] = useAtom(playerTeamAtom);
  const unlockedSlimeIds = useAtomValue(unlockedSlimeIdsAtom);
  const [selectedSlime, setSelectedSlime] = useState<PlayerDefinition | null>(
    null
  );
  const [dragOverPosition, setDragOverPosition] = useState<0 | 1 | 2 | null>(
    null
  );

  const allSlimes = Object.values(PLAYER_DEFINITIONS);
  const teamSlimeIds = [
    teamConfig.position0,
    teamConfig.position1,
    teamConfig.position2,
  ];

  const getSlimeInPosition = (pos: 0 | 1 | 2) => {
    const id =
      pos === 0
        ? teamConfig.position0
        : pos === 1
        ? teamConfig.position1
        : teamConfig.position2;
    return id ? PLAYER_DEFINITIONS[id] || null : null;
  };

  const handleDrop = useCallback(
    (event: React.DragEvent, targetPos: 0 | 1 | 2) => {
      event.preventDefault();
      const slimeId = event.dataTransfer.getData("slimeId");
      const srcPosStr = event.dataTransfer.getData("sourcePosition");
      if (!slimeId) return;

      setTeamConfig((prev) => {
        const teamConfiguration = { ...prev };
        let srcPos: 0 | 1 | 2 | null = srcPosStr
          ? (parseInt(srcPosStr) as 0 | 1 | 2)
          : null;
        if (srcPos === null) {
          if (prev.position0 === slimeId) srcPos = 0;
          else if (prev.position1 === slimeId) srcPos = 1;
          else if (prev.position2 === slimeId) srcPos = 2;
        }
        const positionMap = {
          0: prev.position0,
          1: prev.position1,
          2: prev.position2,
        } as const;
        const targetId = positionMap[targetPos];
        if (srcPos !== null) {
          if (srcPos === 0) teamConfiguration.position0 = targetId;
          else if (srcPos === 1) teamConfiguration.position1 = targetId;
          else teamConfiguration.position2 = targetId;
        }
        if (targetPos === 0) teamConfiguration.position0 = slimeId;
        else if (targetPos === 1) teamConfiguration.position1 = slimeId;
        else teamConfiguration.position2 = slimeId;
        return teamConfiguration;
      });
      setDragOverPosition(null);
    },
    [setTeamConfig]
  );

  const handleRemoveFromSlot = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const originalPosition = event.dataTransfer.getData("sourcePosition");
      if (originalPosition) {
        const removedTeamPosition = parseInt(originalPosition) as 0 | 1 | 2;
        setTeamConfig((prev) => {
          const teamConfiguration = { ...prev };

          if (removedTeamPosition === 0) {
            teamConfiguration.position0 = null;
          }
          if (removedTeamPosition === 1) {
            teamConfiguration.position1 = null;
          }
          if (removedTeamPosition === 2) {
            teamConfiguration.position2 = null;
          }
          return teamConfiguration;
        });
      }
    },
    [setTeamConfig]
  );

  const hasAtLeastOneSlime =
    teamConfig.position0 || teamConfig.position1 || teamConfig.position2;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        zIndex: 10,
      }}
    >
      {/* Left: Team Slots */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: "20px",
          paddingLeft: "40px",
        }}
      >
        <Stack direction="row" spacing={5}>
          {([2, 1, 0] as const).map((currentPosition) => (
            <TeamEditorSlot
              key={currentPosition}
              position={currentPosition}
              slime={getSlimeInPosition(currentPosition)}
              isDragOver={dragOverPosition === currentPosition}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverPosition(currentPosition);
              }}
              onDragLeave={() => setDragOverPosition(null)}
              onDrop={(event) => handleDrop(event, currentPosition)}
              onDragStart={(event) => {
                const currentSlime = getSlimeInPosition(currentPosition);
                if (currentSlime) {
                  event.dataTransfer.setData("slimeId", currentSlime.id);
                  event.dataTransfer.setData(
                    "sourcePosition",
                    currentPosition.toString()
                  );
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Center: Submit Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
        }}
      >
        <Button
          onClick={onClose}
          disabled={!hasAtLeastOneSlime}
          sx={{
            backgroundColor: hasAtLeastOneSlime
              ? COLORS.ACCENT_GREEN
              : COLORS.BUTTON_DISABLED,
            color: COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            fontFamily: "Minecraft, sans-serif",
            fontSize: "18px",
            padding: "16px 40px",
            borderRadius: "8px",
            border: `3px solid ${COLORS.CARD_BORDER}`,
            "&:hover": {
              backgroundColor: hasAtLeastOneSlime
                ? COLORS.ACCENT_LIGHT_GREEN
                : COLORS.BUTTON_DISABLED,
            },
          }}
        >
          Confirm team
        </Button>
      </Box>

      {/* Right: Slime Grid */}
      <SlimeGrid
        slimes={allSlimes}
        unlockedIds={unlockedSlimeIds}
        teamSlimeIds={teamSlimeIds}
        selectedSlime={selectedSlime}
        onSelect={setSelectedSlime}
        onDragStart={(event, id) => {
          event.dataTransfer.setData("slimeId", id);
          event.dataTransfer.effectAllowed = "move";
        }}
        onDropToRemove={handleRemoveFromSlot}
      />
    </Box>
  );
};
