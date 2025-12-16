/**
 * Team Editor
 * Simplified layout: team slots on left, centered submit button, slime grid on right.
 */

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
    (e: React.DragEvent, targetPos: 0 | 1 | 2) => {
      e.preventDefault();
      const slimeId = e.dataTransfer.getData("slimeId");
      const srcPosStr = e.dataTransfer.getData("sourcePosition");
      if (!slimeId) return;

      setTeamConfig((prev) => {
        const cfg = { ...prev };
        let srcPos: 0 | 1 | 2 | null = srcPosStr
          ? (parseInt(srcPosStr) as 0 | 1 | 2)
          : null;
        if (srcPos === null) {
          if (prev.position0 === slimeId) srcPos = 0;
          else if (prev.position1 === slimeId) srcPos = 1;
          else if (prev.position2 === slimeId) srcPos = 2;
        }
        const targetId =
          targetPos === 0
            ? prev.position0
            : targetPos === 1
            ? prev.position1
            : prev.position2;
        if (srcPos !== null) {
          if (srcPos === 0) cfg.position0 = targetId;
          else if (srcPos === 1) cfg.position1 = targetId;
          else cfg.position2 = targetId;
        }
        if (targetPos === 0) cfg.position0 = slimeId;
        else if (targetPos === 1) cfg.position1 = slimeId;
        else cfg.position2 = slimeId;
        return cfg;
      });
      setDragOverPosition(null);
    },
    [setTeamConfig]
  );

  const handleRemoveFromSlot = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const srcPosStr = e.dataTransfer.getData("sourcePosition");
      if (srcPosStr) {
        const pos = parseInt(srcPosStr) as 0 | 1 | 2;
        setTeamConfig((prev) => {
          const cfg = { ...prev };
          if (pos === 0) cfg.position0 = null;
          else if (pos === 1) cfg.position1 = null;
          else cfg.position2 = null;
          return cfg;
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
        <Stack direction="row" spacing={2}>
          {([2, 1, 0] as const).map((pos) => (
            <TeamEditorSlot
              key={pos}
              position={pos}
              slime={getSlimeInPosition(pos)}
              isDragOver={dragOverPosition === pos}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverPosition(pos);
              }}
              onDragLeave={() => setDragOverPosition(null)}
              onDrop={(e) => handleDrop(e, pos)}
              onDragStart={(e) => {
                const s = getSlimeInPosition(pos);
                if (s) {
                  e.dataTransfer.setData("slimeId", s.id);
                  e.dataTransfer.setData("sourcePosition", pos.toString());
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
            fontSize: "18px",
            padding: "16px 40px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: hasAtLeastOneSlime
                ? COLORS.ACCENT_LIGHT_GREEN
                : COLORS.BUTTON_DISABLED,
            },
          }}
        >
          ✓ Confirm
        </Button>
      </Box>

      {/* Right: Slime Grid */}
      <SlimeGrid
        slimes={allSlimes}
        unlockedIds={unlockedSlimeIds}
        teamSlimeIds={teamSlimeIds}
        selectedSlime={selectedSlime}
        onSelect={setSelectedSlime}
        onDragStart={(e, id) => {
          e.dataTransfer.setData("slimeId", id);
          e.dataTransfer.effectAllowed = "move";
        }}
        onDropToRemove={handleRemoveFromSlot}
      />
    </Box>
  );
};
