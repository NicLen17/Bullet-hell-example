import type { Missile, Obstacle } from "@/lib/game-types";

let idCounter = 0;

function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

type SpawnParams = {
  width: number;
  height: number;
  difficulty: number;
};

export function createObstacle({ width, height, difficulty }: SpawnParams): Obstacle {
  const sizeBase = 36 + Math.random() * 48;
  const size = sizeBase * (0.85 + difficulty * 0.08);
  const speed = (2.2 + Math.random() * 2.5) * (1 + difficulty * 0.12);
  const edge = Math.floor(Math.random() * 4);

  let x = 0;
  let y = 0;
  let vx = 0;
  let vy = 0;

  switch (edge) {
    case 0:
      x = Math.random() * (width - size);
      y = -size - 10;
      vy = speed;
      break;
    case 1:
      x = width + 10;
      y = Math.random() * (height - size);
      vx = -speed;
      break;
    case 2:
      x = Math.random() * (width - size);
      y = height + 10;
      vy = -speed;
      break;
    default:
      x = -size - 10;
      y = Math.random() * (height - size);
      vx = speed;
      break;
  }

  return {
    id: nextId("obs"),
    x,
    y,
    width: size,
    height: size * (0.6 + Math.random() * 0.5),
    vx,
    vy,
    shootTimer: 800 + Math.random() * 2200,
  };
}

export function fireMissileFromObstacle(obs: Obstacle): Missile {
  const cx = obs.x + obs.width / 2;
  const cy = obs.y + obs.height / 2;
  const angle = Math.random() * Math.PI * 2;
  const speed = 3.5 + Math.random() * 3.5;
  return {
    id: nextId("mis"),
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

export function isObstacleOffScreen(
  obs: Obstacle,
  width: number,
  height: number,
  margin = 80,
): boolean {
  return (
    obs.x > width + margin ||
    obs.x + obs.width < -margin ||
    obs.y > height + margin ||
    obs.y + obs.height < -margin
  );
}

export function isMissileOffScreen(
  m: Missile,
  width: number,
  height: number,
  margin = 40,
): boolean {
  return m.x < -margin || m.x > width + margin || m.y < -margin || m.y > height + margin;
}

export function getSpawnIntervalMs(difficulty: number): number {
  return Math.max(400, 1300 - difficulty * 85);
}

export function getShootIntervalMs(difficulty: number): number {
  return Math.max(600, 2800 - difficulty * 120);
}
