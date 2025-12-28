import { Box, Stack } from "@mui/material";
import type { Entity } from "../../../features/entity/entity.class";
import { COLORS } from "../../../constants/colors.constants";
import { CombatEntity } from "./combat-entity";
import { AbilityTrigger } from "../../../features/entity/types/entity.types";
import { FONT_SIZE } from "../../../constants/text.constants";
import { Paragraph } from "../../../shared/ui/paragraph";

interface EntityStatusBarProps {
  entity: Entity;
  isActive: boolean;
  type: "player" | "enemy";
}

// Shows attack, ability progress, health, and shield
export const EntityStatusBar = ({
  entity,
  isActive,
  type,
}: EntityStatusBarProps) => {
  const maxHealth = entity.maxHealth;
  const currentHealth = entity.currentHealth;
  const currentShield = entity.currentShield;

  // Check if entity has any timed abilities
  const timedAbilities = entity
    .getAllAbilities()
    .filter(
      (filteredAbility) =>
        filteredAbility.trigger === AbilityTrigger.ON_ABILITY_READY
    );
  const hasTimedAbilities = timedAbilities.length > 0;

  // Get first ability's cooldown for progress bar (if exists)
  const firstAbility = timedAbilities[0];

  const abilityCooldownMs = firstAbility?.cooldownMs ?? 1000;

  const healthColor =
    type === "player" ? COLORS.HEALTH_PLAYER : COLORS.HEALTH_ENEMY;
  const attackColor = COLORS.ATTACK;

  // Border changes to gray and thicker when entity has shield
  const borderColor =
    currentShield > 0
      ? COLORS.SHIELD
      : type === "player"
      ? COLORS.HEALTH_PLAYER
      : COLORS.HEALTH_ENEMY;
  const borderWidth = currentShield > 0 ? 3 : 2;

  return (
    <Stack>
      <CombatEntity entity={entity} />

      {/* Shield value display (above the info block) */}
      <Box
        sx={{
          height: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "6px",
        }}
      >
        {currentShield > 0 && (
          <Paragraph color={COLORS.SHIELD} size={FONT_SIZE.MEDIUM}>
            🛡️ {Math.round(currentShield)}
          </Paragraph>
        )}
      </Box>

      <Box
        sx={{
          backgroundColor: COLORS.CARD_BACKGROUND,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: "6px",
          padding: "8px 12px",
        }}
      >
        <Stack spacing={0.5}>
          {/* Entity name / HP text */}
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Paragraph color={COLORS.TEXT_PRIMARY} size={FONT_SIZE.SMALL}>
              HP: {Math.round(currentHealth)}/{maxHealth}
            </Paragraph>
          </Box>

          {/* Health Bar */}
          <Box
            sx={{
              width: "100%",
              height: "12px",
              backgroundColor: COLORS.CARD_BACKGROUND_DARK,
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${(currentHealth / maxHealth) * 100}%`,
                height: "100%",
                backgroundColor: healthColor,
                transition: "width 0.1s",
              }}
            />
          </Box>

          {/* Attack Progress Bar */}
          <Box
            sx={{
              width: "100%",
              height: "8px",
              backgroundColor: COLORS.CARD_BACKGROUND_DARK,
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: attackColor,
                transformOrigin: "left",
                transform: "scaleX(0)",
                animation: isActive
                  ? `attackProgress ${
                      1000 / entity.attackSpeed
                    }ms linear infinite`
                  : "none",
                "@keyframes attackProgress": {
                  "0%": {
                    transform: "scaleX(0)",
                  },
                  "100%": {
                    transform: "scaleX(1)",
                  },
                },
              }}
            />
          </Box>

          {/* Ability Progress Bar - always allocate space */}
          <Box
            sx={{
              width: "100%",
              height: "6px",
              backgroundColor: hasTimedAbilities
                ? COLORS.CARD_BACKGROUND_DARK
                : "transparent",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            {hasTimedAbilities && (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: COLORS.ABILITY,
                  transformOrigin: "left",
                  transform: "scaleX(0)",
                  animation: isActive
                    ? `abilityProgress ${abilityCooldownMs}ms linear infinite`
                    : "none",
                  "@keyframes abilityProgress": {
                    "0%": {
                      transform: "scaleX(0)",
                    },
                    "100%": {
                      transform: "scaleX(1)",
                    },
                  },
                }}
              />
            )}
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};
