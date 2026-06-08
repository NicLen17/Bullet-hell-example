"use client";

import { useEffect, useState } from "react";
import { getMultiplier, type LifeOption } from "@/lib/game-config";
import {
  BACKGROUND_OPTIONS,
  type BackgroundId,
  type GameCustomization,
  loadCustomization,
  saveCustomization,
} from "@/lib/customization";
import type { GameStats } from "@/lib/game-types";
import { formatScore } from "@/lib/score-format";
import { REVIVE_COST } from "@/lib/wallet";
import { PlanePreview } from "@/components/plane-preview";

type MenuOverlayProps = {
  stats: GameStats;
  walletBalance: number;
  onStart: (lives: LifeOption, customization: GameCustomization) => void;
};

const LIFE_OPTIONS: LifeOption[] = [1, 2, 3];

export function MenuOverlay({ stats, walletBalance, onStart }: MenuOverlayProps) {
  const [selectedLives, setSelectedLives] = useState<LifeOption>(3);
  const [custom, setCustom] = useState<GameCustomization>(() => loadCustomization());

  useEffect(() => {
    saveCustomization(custom);
  }, [custom]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto bg-secondary/85 backdrop-blur-md py-6">
      <div className="mx-4 w-full max-w-xl rounded-2xl border-2 border-primary/60 bg-secondary p-5 text-center shadow-[0_0_40px_rgba(220,38,38,0.35)] sm:p-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.35em] text-accent">
          Phonk drift
        </p>
        <h1 className="mb-2 text-3xl font-black text-primary sm:text-4xl">Avión de Papel</h1>
        <p className="mb-4 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          Monedero: <span className="font-black">{formatScore(walletBalance)}</span> pts
        </p>

        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">Fondo</p>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {BACKGROUND_OPTIONS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => setCustom((c) => ({ ...c, backgroundId: bg.id }))}
              className={`rounded-xl border-2 px-2 py-3 text-left transition ${
                custom.backgroundId === bg.id
                  ? "border-accent bg-accent/10"
                  : "border-white/15 bg-white/5 hover:border-primary/40"
              }`}
            >
              <BackgroundThumb id={bg.id} />
              <span className="mt-2 block text-xs font-bold text-white">{bg.label}</span>
              <span className="block text-[10px] text-white/45">{bg.description}</span>
            </button>
          ))}
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
          Colores de la nave
        </p>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PlanePreview colors={custom.planeColors} />
          <div className="flex flex-1 flex-col gap-3 text-left">
            <ColorPickerRow
              label="Cuerpo"
              value={custom.planeColors.body}
              onChange={(body) =>
                setCustom((c) => ({ ...c, planeColors: { ...c.planeColors, body } }))
              }
            />
            <ColorPickerRow
              label="Detalle"
              value={custom.planeColors.accent}
              onChange={(accent) =>
                setCustom((c) => ({ ...c, planeColors: { ...c.planeColors, accent } }))
              }
            />
          </div>
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">Vidas</p>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {LIFE_OPTIONS.map((lives) => {
            const mult = getMultiplier(lives);
            const selected = selectedLives === lives;
            return (
              <button
                key={lives}
                type="button"
                onClick={() => setSelectedLives(lives)}
                className={`rounded-xl border-2 px-2 py-3 transition ${
                  selected
                    ? "border-accent bg-accent/15"
                    : "border-white/15 bg-white/5 hover:border-primary/50"
                }`}
              >
                <span className="block text-2xl font-black text-primary">{lives}</span>
                <span className="block text-[10px] text-white/50">×{mult}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onStart(selectedLives, custom)}
          className="w-full rounded-xl bg-primary px-6 py-4 text-lg font-black uppercase text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] transition hover:bg-primary-dark"
        >
          Volar — ×{getMultiplier(selectedLives)}
        </button>
        <p className="mt-2 text-[11px] text-white/40">Mantén clic para disparar</p>

        <dl className="mt-6 grid grid-cols-2 gap-2 text-left text-sm">
          <StatCell label="Récord" value={formatScore(stats.highScore)} accent />
          <StatCell label="Partidas" value={String(stats.gamesPlayed)} />
        </dl>
      </div>
    </div>
  );
}

function BackgroundThumb({ id }: { id: BackgroundId }) {
  if (id === "city") {
    return (
      <div className="h-10 w-full rounded-md bg-gradient-to-b from-indigo-950 to-black">
        <div className="flex h-full items-end gap-0.5 px-1">
          <div className="h-[60%] w-2 bg-slate-600" />
          <div className="h-[80%] w-2 bg-slate-500" />
          <div className="h-[50%] w-2 bg-slate-600" />
        </div>
      </div>
    );
  }
  if (id === "space") {
    return (
      <div className="h-10 w-full rounded-md bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
        <div className="relative h-full w-full">
          <span className="absolute left-2 top-2 h-1 w-1 rounded-full bg-white" />
          <span className="absolute right-3 top-4 h-0.5 w-0.5 rounded-full bg-white/70" />
        </div>
      </div>
    );
  }
  return (
    <div
      className="h-10 w-full rounded-md border border-primary/30"
      style={{
        backgroundImage:
          "linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)",
        backgroundSize: "8px 8px",
        backgroundColor: "#0a0a0a",
      }}
    />
  );
}

function ColorPickerRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-14 text-xs font-semibold text-white/70">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
      />
      <span className="font-mono text-xs text-white/50">{value}</span>
    </label>
  );
}

function StatCell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2">
      <dt className="text-[10px] text-white/50">{label}</dt>
      <dd className={`text-lg font-bold ${accent ? "text-accent" : "text-primary"}`}>
        {value}
      </dd>
    </div>
  );
}

type GameOverOverlayProps = {
  score: number;
  timeSeconds: number;
  isNewRecord: boolean;
  stats: GameStats;
  walletBalance: number;
  canRevive: boolean;
  onRevive: () => void;
  onRestart: () => void;
  onMenu: () => void;
};

export function GameOverOverlay({
  score,
  timeSeconds,
  isNewRecord,
  stats,
  walletBalance,
  canRevive,
  onRevive,
  onRestart,
  onMenu,
}: GameOverOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-secondary/90 backdrop-blur-md">
      <div className="mx-4 max-w-md animate-score-punch rounded-2xl border-2 border-primary bg-secondary p-8 text-center shadow-[0_0_50px_rgba(220,38,38,0.5)]">
        <h2 className="text-4xl font-black text-primary">¡DESTRUIDO!</h2>
        {isNewRecord && (
          <p className="mt-2 text-sm font-black uppercase text-accent">★ Nuevo récord ★</p>
        )}
        <p className="mt-4 text-5xl font-black tabular-nums text-white">{formatScore(score)}</p>
        <p className="mt-1 text-white/60">puntos de la partida · {timeSeconds}s</p>
        <p className="mt-3 text-sm text-accent">
          Monedero: <span className="font-bold">{formatScore(walletBalance)}</span>
        </p>

        {canRevive && (
          <button
            type="button"
            onClick={onRevive}
            className="mt-6 w-full rounded-xl border-2 border-accent bg-accent/15 px-6 py-3 font-black uppercase text-accent shadow-[0_0_24px_rgba(34,197,94,0.4)] transition hover:bg-accent/25"
          >
            Revivir — {formatScore(REVIVE_COST)} pts
          </button>
        )}
        {!canRevive && (
          <p className="mt-4 text-xs text-white/40">
            Necesitas {formatScore(REVIVE_COST)} en el monedero para revivir
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 rounded-xl bg-primary px-6 py-3 font-bold text-white"
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={onMenu}
            className="flex-1 rounded-xl border border-white/20 px-6 py-3 font-semibold hover:border-accent hover:text-accent"
          >
            Menú
          </button>
        </div>
        <p className="mt-4 text-xs text-white/40">
          Récord: {formatScore(stats.highScore)}
        </p>
      </div>
    </div>
  );
}
