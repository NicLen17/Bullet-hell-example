import { formatScore } from "@/lib/score-format";
import type { ActiveBuff } from "@/lib/game-types";
import { PowerupIcon } from "@/components/powerup-icon";
import type { PowerupKind } from "@/lib/power-ups";

type GameHudProps = {
  score: number;
  timeSeconds: number;
  highScore: number;
  lives: number;
  maxLives: number;
  multiplier: number;
  hasShield: boolean;
  scorePulse: boolean;
  shotCount: number;
  activeBuffs: ActiveBuff[];
  walletBalance: number;
  fireRateStacks: number;
};

export function GameHud({
  score,
  timeSeconds,
  highScore,
  lives,
  maxLives,
  multiplier,
  hasShield,
  scorePulse,
  shotCount,
  activeBuffs,
  walletBalance,
  fireRateStacks,
}: GameHudProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-5">
      <div className="flex flex-col gap-2">
        <div
          className={`rounded-xl border-2 border-primary/60 bg-secondary/90 px-4 py-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] backdrop-blur-md ${
            scorePulse ? "animate-score-punch" : ""
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
            Puntos
          </p>
          <p className="text-2xl font-black tabular-nums text-primary sm:text-4xl">
            {formatScore(score)}
          </p>
          <p className="text-[10px] text-white/50">+{formatScore(1000 * multiplier)}/seg</p>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: maxLives }, (_, i) => (
            <span
              key={i}
              className={`h-4 w-4 rotate-45 border-2 sm:h-5 sm:w-5 ${
                i < lives
                  ? "border-primary bg-primary shadow-[0_0_10px_#dc2626]"
                  : "border-white/20 bg-white/5"
              }`}
              aria-hidden
            />
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2 py-1">
          <span className="text-[10px] font-bold uppercase text-cyan-400">Disparos</span>
          <span className="text-sm font-black text-cyan-300">{shotCount}×</span>
          <span className="text-[10px] text-white/40">mantén clic</span>
          {fireRateStacks > 0 && (
            <span className="text-[10px] font-bold text-amber-400">ROF ×{fireRateStacks}</span>
          )}
        </div>
        <p className="text-[10px] text-white/45">
          Monedero: <span className="font-bold text-accent">{formatScore(walletBalance)}</span>
        </p>
        {activeBuffs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {activeBuffs.map((b) => (
              <BuffChip key={b.kind + b.label} buff={b} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="animate-multiplier-glow rounded-xl border-2 border-accent bg-accent/10 px-3 py-2 text-center shadow-[0_0_16px_rgba(34,197,94,0.5)]">
          <p className="text-[10px] uppercase tracking-widest text-accent">Multiplicador</p>
          <p className="text-2xl font-black text-accent">×{multiplier}</p>
        </div>
        {hasShield && (
          <div className="rounded-lg border border-accent bg-accent/20 px-3 py-1 text-xs font-bold uppercase text-accent animate-pulse">
            Escudo
          </div>
        )}
        <div className="rounded-lg border border-white/15 bg-secondary/80 px-3 py-1.5 text-right backdrop-blur-sm">
          <p className="text-[10px] text-white/50">Tiempo</p>
          <p className="text-lg font-bold tabular-nums">{timeSeconds}s</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-secondary/60 px-3 py-1 text-xs">
          Récord <span className="font-bold text-accent">{formatScore(highScore)}</span>
        </div>
      </div>
    </div>
  );
}

function BuffChip({ buff }: { buff: ActiveBuff }) {
  const kind = buff.kind === "frenzy-active" ? "frenzy" : (buff.kind as PowerupKind);
  return (
    <div
      className="flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase"
      style={{ borderColor: buff.color, color: buff.color, background: `${buff.color}18` }}
    >
      <PowerupIcon kind={kind} size={14} />
      {buff.label}
    </div>
  );
}
