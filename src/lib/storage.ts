import {
  DEFAULT_STATS,
  STORAGE_KEY,
  type GameStats,
} from "@/lib/game-types";

export function loadStats(): GameStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      highScore: parsed.highScore ?? 0,
      gamesPlayed: parsed.gamesPlayed ?? 0,
      totalScore: parsed.totalScore ?? 0,
      bestTimeSeconds: parsed.bestTimeSeconds ?? 0,
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: GameStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    /* quota or private mode */
  }
}

export function recordGameEnd(score: number, timeSeconds: number): GameStats {
  const current = loadStats();
  const next: GameStats = {
    highScore: Math.max(current.highScore, score),
    gamesPlayed: current.gamesPlayed + 1,
    totalScore: current.totalScore + score,
    bestTimeSeconds: Math.max(current.bestTimeSeconds, timeSeconds),
  };
  saveStats(next);
  return next;
}
