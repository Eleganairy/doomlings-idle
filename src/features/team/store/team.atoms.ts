/**
 * Team Configuration Atoms
 *
 * Manages player team composition and unlocked slimes.
 * Persisted to localStorage via atomWithStorage.
 */

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// ====================================================================================
// TEAM CONFIGURATION
// ====================================================================================

/**
 * Player team configuration - which slime IDs are in which positions.
 * Position 0 = front, 1 = middle, 2 = back.
 * A null/undefined value means the slot is empty.
 */
export interface TeamConfig {
  position0: string | null;
  position1: string | null;
  position2: string | null;
}

/**
 * Default team: just Basic Slime in front position
 */
const DEFAULT_TEAM: TeamConfig = {
  position0: "basic_slime",
  position1: null,
  position2: null,
};

/**
 * Persisted atom for player team configuration.
 */
export const playerTeamAtom = atomWithStorage<TeamConfig>(
  "playerTeam",
  DEFAULT_TEAM
);

// ====================================================================================
// UNLOCKED SLIMES
// ====================================================================================

/**
 * Persisted atom for unlocked slime IDs.
 * Players start with only the Basic Slime unlocked.
 */
export const unlockedSlimeIdsAtom = atomWithStorage<string[]>(
  "unlockedSlimes",
  ["basic_slime"]
);

// ====================================================================================
// UI STATE
// ====================================================================================

/**
 * Is the team editor currently open?
 */
export const isTeamEditorOpenAtom = atom<boolean>(false);

// ====================================================================================
// DERIVED ATOMS
// ====================================================================================

/**
 * Get the active slime IDs from the team config (non-null positions only)
 */
export const activeSlimeIdsAtom = atom((get) => {
  const team = get(playerTeamAtom);
  return [team.position0, team.position1, team.position2].filter(
    (id): id is string => id !== null
  );
});

/**
 * Get the team as an array of { slimeId, position } for combat initialization
 */
export const teamForCombatAtom = atom((get) => {
  const team = get(playerTeamAtom);
  const result: Array<{ slimeId: string; position: 0 | 1 | 2 }> = [];

  if (team.position0) result.push({ slimeId: team.position0, position: 0 });
  if (team.position1) result.push({ slimeId: team.position1, position: 1 });
  if (team.position2) result.push({ slimeId: team.position2, position: 2 });

  return result;
});
