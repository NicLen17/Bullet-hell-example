export type LifeOption = 1 | 2 | 3;

export const LIFE_MULTIPLIER: Record<LifeOption, number> = {
  3: 1,
  2: 2,
  1: 3,
};

export const BASE_POINTS_PER_SECOND = 1000;
export const HIT_PENALTY_BASE = 8000;
export const HIT_PENALTY_SCORE_PERCENT = 0.12;
export const INVINCIBILITY_MS = 900;
export const SHIELD_PICKUP_SPAWN_MS = 14000;
export const MISSILE_RADIUS = 7;
export const PLANE_RADIUS_BASE = 14;
export const PLANE_RADIUS = PLANE_RADIUS_BASE;
export const SHIELD_PICKUP_RADIUS = 28;
export const PLANE_SCALE_GROW = 1.45;
export const PLANE_SCALE_SHRINK = 0.72;
export const BASE_PLANE_DISPLAY_SIZE = 52;

export function getMultiplier(lives: LifeOption): number {
  return LIFE_MULTIPLIER[lives];
}

export function calcHitPenalty(score: number, multiplier: number): number {
  const fromPercent = Math.floor(score * HIT_PENALTY_SCORE_PERCENT);
  const base = Math.floor(HIT_PENALTY_BASE * multiplier);
  return Math.max(base, fromPercent);
}
