# 🗺️ Doomlings Idle - System Overview

> **Big Picture View**: This document provides a single comprehensive visualization of the entire application - how all systems connect and interact.

---

## Complete System Map

```mermaid
flowchart TB
    subgraph User["🧑‍💻 User Interface"]
        Header[Header - Energy Display]
        Footer[Footer - Navigation]

        subgraph Pages["📄 Pages"]
            OpenWorld[Open World\n- Combat View\n- Team Editor\n- Stage Selector]
            Upgrades[Upgrades\n- Purchase Upgrades\n- View Costs]
            Traits[Traits\n- Achievement Progress\n- Unlock Tracking]
            Stats[Stats\n- Player Stats View]
            Lab[Lab\n- Future Features]
        end
    end

    subgraph Core["⚙️ Core Systems"]
        subgraph EntitySystem["Entity System"]
            EntityClass[Entity Class]
            PlayerDefs[Player Definitions\n- Basic Slime\n- Druid Slime\n- Electric Slime\n- Fortified Slime]
            EnemyDefs[Enemy Definitions\n- By Area\n- By Rarity\n- By Type]
            BossDefs[Boss Definitions]
        end

        subgraph CombatSystem["Combat System"]
            CombatHook[usePersistentCombat]
            AttackLogic[Attack/Damage Logic]
            AbilityExecution[Ability Execution]
        end

        subgraph ProgressionSystem["Progression System"]
            UpgradeCalc[Stat Modifier Service]
            TraitTracking[Trait Progress Tracking]
            BuffApplication[Buff Application]
        end

        subgraph WorldSystem["World System"]
            AreaConfig[Area Configuration\n- Grasslands\n- Living Forest\n- Mushroom Caverns]
            StageProgress[Stage Progression]
            LootSystem[Loot Drops]
        end

        subgraph TeamSystem["Team System"]
            TeamConfig[Team Configuration]
            SlimeUnlocks[Slime Unlocks]
        end
    end

    subgraph State["💾 State Management (Jotai)"]
        CombatState["Combat Atoms\n- activePlayers\n- activeEnemies\n- isCombatActive\n- playerEnergy"]
        ProgressState["Progression Atoms\n- upgradeLevels\n- trackedStats\n- completedTraits"]
        WorldState["World Atoms\n- worldProgress\n- currentArea\n- currentStage"]
        TeamState["Team Atoms\n- playerTeam\n- unlockedSlimes"]
    end

    subgraph Persistence["💿 Persistence"]
        LocalStorage[(localStorage)]
    end

    %% Connections
    Header --> CombatState
    Footer --> Pages
    OpenWorld --> CombatSystem
    OpenWorld --> TeamSystem
    Upgrades --> ProgressionSystem
    Traits --> ProgressionSystem
    Stats --> ProgressionSystem

    CombatSystem --> EntitySystem
    CombatSystem --> CombatState
    CombatSystem --> ProgressionSystem
    CombatSystem --> WorldSystem

    ProgressionSystem --> ProgressState
    WorldSystem --> WorldState
    TeamSystem --> TeamState

    TeamState --> LocalStorage
    ProgressState -.-> LocalStorage
```

---

## Data Flow Overview

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Layer
    participant H as Combat Hook
    participant E as Entity System
    participant S as State (Atoms)
    participant P as Progression

    U->>UI: Start Combat
    UI->>S: isCombatActive = true
    S->>H: Triggers combat loop

    loop Every 50ms
        H->>E: Update attack progress
        E->>E: Check if attack ready

        alt Attack Ready
            E->>E: Deal damage to target

            alt Enemy Dies
                E->>P: Record kill
                P->>S: Update tracked stats
                E->>S: Add energy
                H->>E: Spawn new enemy
            end
        end

        H->>E: Update ability cooldowns
        H->>E: Execute ready abilities
    end

    U->>UI: Buy Upgrade
    UI->>S: Deduct energy
    UI->>P: Increase upgrade level
    P->>E: Apply new buff on spawn
```

---

## Feature Dependencies

```mermaid
flowchart LR
    subgraph Independent["Independent Features"]
        Colors[colors.constants]
        Text[text.constants]
        BigNum[big-number.utils]
    end

    subgraph Foundation["Foundation Layer"]
        EntityTypes[entity.types]
        ProgressTypes[progression.types]
    end

    subgraph Config["Configuration Layer"]
        PlayerDefs[player-definitions]
        EnemyDefs[enemy-definitions]
        BossDefs[boss-definitions]
        AreaList[area-list]
        ProgressConfig[progression.config]
    end

    subgraph Core["Core Services"]
        EntityClass[Entity.class]
        StatMod[stat-modifiers.service]
        EnemyCalc[enemy-calculated-stats]
    end

    subgraph Hooks["React Hooks"]
        UseCombat[use-combat.hook]
        UsePersistent[use-persistent-combat.hook]
        UseUpgrades[use-upgrades.hook]
    end

    subgraph UI["UI Components"]
        Layout[Layout]
        Pages[Page Components]
        Components[Shared Components]
    end

    EntityTypes --> EntityClass
    EntityTypes --> PlayerDefs
    EntityTypes --> EnemyDefs
    EntityTypes --> BossDefs

    ProgressTypes --> ProgressConfig
    ProgressTypes --> StatMod

    EntityClass --> UsePersistent
    StatMod --> UsePersistent
    AreaList --> UsePersistent

    UsePersistent --> Layout
    UseCombat --> Pages
    UseUpgrades --> Pages

    Layout --> Pages
    Pages --> Components
```

---

## State Atom Relationships

```mermaid
flowchart TD
    subgraph Combat["Combat State"]
        activePlayers[activePlayersAtom\nEntity[]]
        activeEnemies[activeEnemiesAtom\nEntity[]]
        isCombatActive[isCombatActiveAtom\nboolean]
        playerEnergy[playerEnergyAtom\nnumber]
        playerAttackProgress[playerAttackProgressAtom\nnumber]
        enemyAttackProgress[enemyAttackProgressAtom\nnumber]
    end

    subgraph Progression["Progression State"]
        upgradeLevels[upgradeLevelsAtom\nRecord]
        trackedStats[playerTrackedStatsAtom\nStats]
        completedTraits[completedTraitIdsAtom\nDerived]
        unlockedUpgrades[unlockedUpgradesAtom\nDerived]
    end

    subgraph World["World State"]
        worldProgress[worldProgressAtom\nProgress]
        currentArea[currentAreaProgressAtom\nDerived]
        currentStage[currentStageProgressAtom\nDerived]
    end

    subgraph Team["Team State"]
        playerTeam[playerTeamAtom\nPersisted]
        unlockedSlimes[unlockedSlimeIdsAtom\nPersisted]
        activeSlimes[activeSlimeIdsAtom\nDerived]
        teamForCombat[teamForCombatAtom\nDerived]
    end

    trackedStats --> completedTraits
    completedTraits --> unlockedUpgrades
    worldProgress --> currentArea
    currentArea --> currentStage
    playerTeam --> activeSlimes
    playerTeam --> teamForCombat
    teamForCombat --> activePlayers
```

---

## Key File Quick Reference

| System          | Key File                                                  | Purpose                          |
| --------------- | --------------------------------------------------------- | -------------------------------- |
| **Entry**       | `main.tsx`                                                | App bootstrap                    |
| **Layout**      | `shared/layout/layout.tsx`                                | Main app shell, runs combat hook |
| **Entity**      | `features/entity/entity.class.ts`                         | Core Entity class (954 lines)    |
| **Combat**      | `features/combat/hooks/use-persistent-combat.hook.ts`     | Combat loop (443 lines)          |
| **Progression** | `features/progression/services/stat-modifiers.service.ts` | Upgrade calculations             |
| **World**       | `features/world/config/area-list.config.ts`               | Area definitions                 |
| **Team**        | `features/team/store/team.atoms.ts`                       | Team state management            |
| **Pages**       | `constants/pages.constants.ts`                            | Page routing definitions         |
| **Colors**      | `constants/colors.constants.ts`                           | Color palette                    |

---

## Current Implementation Status

```mermaid
pie title Feature Completion
    "Implemented" : 70
    "Partial" : 20
    "Planned" : 10
```

### ✅ Fully Implemented

- Entity System (Player, Enemy, Boss, Helper)
- Combat Loop with Auto-Attack
- Basic Upgrades (Attack Damage, Health)
- Trait System with Tracking
- Team Management (3 slots)
- Area/Stage Progression
- 3 Areas with Enemies
- 4 Playable Slimes with Abilities

### 🔄 Partially Implemented

- Boss Encounters (definitions exist, full mechanics pending)
- Loot System (drops exist, inventory not implemented)
- Area 2 & 3 enemies (using placeholder sprites)

### 📋 Planned (Page stubs exist)

- Lab Features
- Pokédex (enemy collection)
- Meteorite System
- Crafting System
- Relics
- Pets
- Territory Control

---

## Technology Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Framework        | React 18+                          |
| Language         | TypeScript                         |
| Build Tool       | Vite                               |
| UI Library       | Material-UI (MUI)                  |
| State Management | Jotai                              |
| Styling          | CSS + MUI sx prop                  |
| Persistence      | localStorage (via atomWithStorage) |

---

_This overview should be updated as major systems are added or changed._
