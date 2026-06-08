import { pickRandomPowerupKind } from "@/lib/power-ups";
import type { PowerupPickup } from "@/lib/game-types";

let idCounter = 0;

function nextId(): string {
  idCounter += 1;
  return `pu-${idCounter}`;
}

export function createPowerupPickup(width: number, height: number): PowerupPickup {
  const margin = 60;
  return {
    id: nextId(),
    x: margin + Math.random() * (width - margin * 2),
    y: margin + Math.random() * (height - margin * 2),
    lifeMs: 14000,
    kind: pickRandomPowerupKind(),
  };
}

export const POWERUP_SPAWN_MS = 11000;
