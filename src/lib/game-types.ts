import type { LifeOption } from "@/lib/game-config";
import type { PowerupKind } from "@/lib/power-ups";

export type GamePhase = "menu" | "playing" | "over";

export type Obstacle = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  shootTimer: number;
};

export type Missile = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type PlayerBullet = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type PowerupPickup = {
  id: string;
  x: number;
  y: number;
  lifeMs: number;
  kind: PowerupKind;
};

export type PlaneState = {
  x: number;
  y: number;
  angle: number;
};

export type FloatingText = {
  id: string;
  x: number;
  y: number;
  text: string;
  kind: "gain" | "loss" | "shield" | "multiplier" | "powerup";
  color?: string;
  createdAt: number;
};

export type ActiveBuff = {
  kind: PowerupKind | "frenzy-active";
  label: string;
  color: string;
  expiresAt?: number;
};

export type GameStats = {
  highScore: number;
  gamesPlayed: number;
  totalScore: number;
  bestTimeSeconds: number;
};

export type RunConfig = {
  lives: LifeOption;
  multiplier: number;
};

export const STORAGE_KEY = "avion-papel-stats";

export const DEFAULT_STATS: GameStats = {
  highScore: 0,
  gamesPlayed: 0,
  totalScore: 0,
  bestTimeSeconds: 0,
};
