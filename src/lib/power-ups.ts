export type PowerupKind =
  | "shield"
  | "invuln"
  | "frenzy"
  | "bomb"
  | "multishot"
  | "rof"
  | "grow"
  | "shrink";

export type PowerupDef = {
  kind: PowerupKind;
  label: string;
  color: string;
  glow: string;
  scoreOnPickup: number;
  isNegative: boolean;
  spawnWeight: number;
};

export const POWERUP_DEFS: Record<PowerupKind, PowerupDef> = {
  shield: {
    kind: "shield",
    label: "Escudo",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.6)",
    scoreOnPickup: 3500,
    isNegative: false,
    spawnWeight: 14,
  },
  invuln: {
    kind: "invuln",
    label: "Invulnerable",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.65)",
    scoreOnPickup: 7500,
    isNegative: false,
    spawnWeight: 10,
  },
  frenzy: {
    kind: "frenzy",
    label: "Frenesí",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.65)",
    scoreOnPickup: 5000,
    isNegative: false,
    spawnWeight: 9,
  },
  bomb: {
    kind: "bomb",
    label: "Bomba",
    color: "#f97316",
    glow: "rgba(249,115,22,0.7)",
    scoreOnPickup: 10000,
    isNegative: false,
    spawnWeight: 7,
  },
  multishot: {
    kind: "multishot",
    label: "Multidisparo",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.65)",
    scoreOnPickup: 6000,
    isNegative: false,
    spawnWeight: 11,
  },
  rof: {
    kind: "rof",
    label: "Cadencia",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.7)",
    scoreOnPickup: 5500,
    isNegative: false,
    spawnWeight: 10,
  },
  grow: {
    kind: "grow",
    label: "Gigante",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.65)",
    scoreOnPickup: -8000,
    isNegative: true,
    spawnWeight: 8,
  },
  shrink: {
    kind: "shrink",
    label: "Mini",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.65)",
    scoreOnPickup: -4000,
    isNegative: true,
    spawnWeight: 8,
  },
};

export const FRENZY_DURATION_MS = 5500;
export const INVULN_POWERUP_MS = 4500;
export const SIZE_POWERUP_DURATION_MS = 10000;
export const FRENZY_TIME_SCALE = 0.32;
export const MAX_MULTISHOT = 3;
export const MAX_ROF_STACK = 4;
export const OBSTACLE_DESTROY_SCORE = 2500;
export const BOMB_PER_OBSTACLE_SCORE = 1500;
const POSITIVE_KINDS: PowerupKind[] = [
  "shield",
  "invuln",
  "frenzy",
  "bomb",
  "multishot",
  "rof",
];

const ALL_SPAWN_KINDS: PowerupKind[] = [
  ...POSITIVE_KINDS,
  "grow",
  "shrink",
];

export function pickRandomPowerupKind(): PowerupKind {
  let total = 0;
  for (const k of ALL_SPAWN_KINDS) {
    total += POWERUP_DEFS[k].spawnWeight;
  }
  let roll = Math.random() * total;
  for (const k of ALL_SPAWN_KINDS) {
    roll -= POWERUP_DEFS[k].spawnWeight;
    if (roll <= 0) return k;
  }
  return "shield";
}

export function getPowerupDef(kind: PowerupKind): PowerupDef {
  return POWERUP_DEFS[kind];
}
