import { aimAngleRad } from "@/lib/aim";
import type { PlayerBullet, PlaneState } from "@/lib/game-types";

let bulletId = 0;

function nextBulletId(): string {
  bulletId += 1;
  return `pb-${bulletId}`;
}

const BULLET_SPEED = 15;
export const BASE_SHOOT_COOLDOWN_MS = 160;

export function getShootCooldownMs(rofStacks: number): number {
  const multiplier = 1 + rofStacks * 0.28;
  return Math.max(55, BASE_SHOOT_COOLDOWN_MS / multiplier);
}

export function createPlayerBullets(
  plane: PlaneState,
  shotCount: number,
): PlayerBullet[] {
  const baseAngle = aimAngleRad(plane.angle);
  const spreads =
    shotCount === 1
      ? [0]
      : shotCount === 2
        ? [-0.12, 0.12]
        : [-0.18, 0, 0.18];

  const noseOffset = 26;

  return spreads.map((offset) => {
    const angle = baseAngle + offset;
    return {
      id: nextBulletId(),
      x: plane.x + Math.cos(angle) * noseOffset,
      y: plane.y + Math.sin(angle) * noseOffset,
      vx: Math.cos(angle) * BULLET_SPEED,
      vy: Math.sin(angle) * BULLET_SPEED,
    };
  });
}

export function isBulletOffScreen(
  b: PlayerBullet,
  width: number,
  height: number,
  margin = 30,
): boolean {
  return (
    b.x < -margin ||
    b.x > width + margin ||
    b.y < -margin ||
    b.y > height + margin
  );
}
