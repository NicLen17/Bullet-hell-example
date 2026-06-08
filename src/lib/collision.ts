import { MISSILE_RADIUS, SHIELD_PICKUP_RADIUS } from "@/lib/game-config";
import type {
  Missile,
  Obstacle,
  PlaneState,
  PlayerBullet,
  PowerupPickup,
} from "@/lib/game-types";

const BULLET_RADIUS = 5;

function circleRectHit(
  cx: number,
  cy: number,
  radius: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < radius * radius;
}

function circleCircleHit(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
): boolean {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const dist = r1 + r2;
  return dx * dx + dy * dy < dist * dist;
}

export function checkObstacleCollision(
  plane: PlaneState,
  obstacles: Obstacle[],
  planeRadius: number,
): boolean {
  for (const obs of obstacles) {
    if (circleRectHit(plane.x, plane.y, planeRadius, obs.x, obs.y, obs.width, obs.height)) {
      return true;
    }
  }
  return false;
}

export function checkMissileCollision(
  plane: PlaneState,
  missiles: Missile[],
  planeRadius: number,
): boolean {
  for (const m of missiles) {
    if (circleCircleHit(plane.x, plane.y, planeRadius, m.x, m.y, MISSILE_RADIUS)) {
      return true;
    }
  }
  return false;
}

export function checkPowerupPickup(
  plane: PlaneState,
  pickups: PowerupPickup[],
  planeRadius: number,
): PowerupPickup | null {
  for (const s of pickups) {
    if (circleCircleHit(plane.x, plane.y, planeRadius, s.x, s.y, SHIELD_PICKUP_RADIUS)) {
      return s;
    }
  }
  return null;
}

export function bulletHitsObstacle(bullet: PlayerBullet, obs: Obstacle): boolean {
  return circleRectHit(bullet.x, bullet.y, BULLET_RADIUS, obs.x, obs.y, obs.width, obs.height);
}

export function getBulletRadius(): number {
  return BULLET_RADIUS;
}
