import { getPowerupDef } from "@/lib/power-ups";
import type { Missile, Obstacle, PlayerBullet, PowerupPickup } from "@/lib/game-types";
import { PowerupIcon } from "@/components/powerup-icon";

type GameEntitiesProps = {
  obstacles: Obstacle[];
  missiles: Missile[];
  bullets: PlayerBullet[];
  powerups: PowerupPickup[];
  hasShield: boolean;
  frenzyActive: boolean;
};

export function GameEntities({
  obstacles,
  missiles,
  bullets,
  powerups,
  hasShield,
  frenzyActive,
}: GameEntitiesProps) {
  return (
    <>
      {frenzyActive && (
        <div
          className="pointer-events-none absolute inset-0 z-[6] bg-purple-900/20 animate-frenzy-vignette"
          aria-hidden
        />
      )}

      {obstacles.map((obs) => (
        <div
          key={obs.id}
          className="pointer-events-none absolute"
          style={{ left: obs.x, top: obs.y, width: obs.width, height: obs.height }}
          aria-hidden
        >
          <div
            className="relative h-full w-full animate-pulse-danger rounded-lg border-2 border-primary bg-gradient-to-br from-primary via-primary-dark to-secondary shadow-[0_0_24px_rgba(220,38,38,0.7)]"
            style={{ transform: `rotate(${((obs.x + obs.y) % 40) - 20}deg)` }}
          >
            <div className="absolute inset-1 rounded-md border border-white/20" />
            <div className="absolute -right-1 -top-1 h-3 w-3 animate-muzzle-flash rounded-full bg-accent shadow-[0_0_8px_#22c55e]" />
          </div>
        </div>
      ))}

      {missiles.map((m) => (
        <div
          key={m.id}
          className="pointer-events-none absolute z-[15]"
          style={{ left: m.x, top: m.y, transform: "translate(-50%, -50%)" }}
          aria-hidden
        >
          <div className="relative h-4 w-8">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-accent via-primary to-primary-dark shadow-[0_0_14px_#dc2626]"
              style={{
                transform: `rotate(${Math.atan2(m.vy, m.vx) * (180 / Math.PI)}deg)`,
              }}
            />
          </div>
        </div>
      ))}

      {bullets.map((b) => (
        <div
          key={b.id}
          className="pointer-events-none absolute z-[18]"
          style={{ left: b.x, top: b.y, transform: "translate(-50%, -50%)" }}
          aria-hidden
        >
          <div
            className="h-2 w-6 rounded-full bg-gradient-to-r from-cyan-300 to-cyan-500 shadow-[0_0_12px_#06b6d4]"
            style={{
              transform: `rotate(${Math.atan2(b.vy, b.vx) * (180 / Math.PI)}deg)`,
            }}
          />
        </div>
      ))}

      {powerups.map((p) => {
        const def = getPowerupDef(p.kind);
        return (
          <div
            key={p.id}
            className="pointer-events-none absolute z-[12] animate-shield-float"
            style={{ left: p.x, top: p.y, transform: "translate(-50%, -50%)" }}
            aria-hidden
          >
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-full border-2"
              style={{
                borderColor: def.color,
                boxShadow: `0 0 20px ${def.glow}`,
                background: `${def.color}22`,
              }}
            >
              <div
                className="absolute inset-0 animate-ping rounded-full opacity-40"
                style={{ border: `2px solid ${def.color}` }}
              />
              <PowerupIcon kind={p.kind} size={32} />
            </div>
          </div>
        );
      })}

      {hasShield && (
        <div
          className="pointer-events-none absolute inset-0 z-[8] border-4 border-accent/30 animate-shield-aura"
          aria-hidden
        />
      )}
    </>
  );
}
