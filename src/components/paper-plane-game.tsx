"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  bulletHitsObstacle,
  checkMissileCollision,
  checkObstacleCollision,
  checkPowerupPickup,
} from "@/lib/collision";
import {
  BASE_PLANE_DISPLAY_SIZE,
  BASE_POINTS_PER_SECOND,
  INVINCIBILITY_MS,
  PLANE_RADIUS_BASE,
  PLANE_SCALE_GROW,
  PLANE_SCALE_SHRINK,
  calcHitPenalty,
  getMultiplier,
  type LifeOption,
} from "@/lib/game-config";
import {
  playHitSound,
  playShieldSound,
  resumePhonkMusic,
  startRandomPhonkMusic,
  stopPhonkMusic,
} from "@/lib/game-audio";
import type {
  ActiveBuff,
  FloatingText,
  GamePhase,
  GameStats,
  Missile,
  Obstacle,
  PlaneState,
  PlayerBullet,
  PowerupPickup,
} from "@/lib/game-types";
import {
  createPowerupPickup,
  POWERUP_SPAWN_MS,
} from "@/lib/pickup-spawn";
import {
  createObstacle,
  fireMissileFromObstacle,
  getShootIntervalMs,
  getSpawnIntervalMs,
  isMissileOffScreen,
  isObstacleOffScreen,
} from "@/lib/obstacle-spawn";
import { aimAngleDeg } from "@/lib/aim";
import type { GameCustomization } from "@/lib/customization";
import { loadCustomization } from "@/lib/customization";
import {
  BOMB_PER_OBSTACLE_SCORE,
  FRENZY_DURATION_MS,
  FRENZY_TIME_SCALE,
  INVULN_POWERUP_MS,
  MAX_MULTISHOT,
  MAX_ROF_STACK,
  OBSTACLE_DESTROY_SCORE,
  SIZE_POWERUP_DURATION_MS,
  getPowerupDef,
  type PowerupKind,
} from "@/lib/power-ups";
import {
  createPlayerBullets,
  getShootCooldownMs,
  isBulletOffScreen,
} from "@/lib/player-shoot";
import { formatScore } from "@/lib/score-format";
import { loadStats, recordGameEnd } from "@/lib/storage";
import {
  REVIVE_COST,
  addToWallet,
  loadWallet,
  spendFromWallet,
} from "@/lib/wallet";
import { FloatingTexts } from "@/components/floating-texts";
import { GameBackground } from "@/components/game-background";
import { GameEntities } from "@/components/game-entities";
import { GameHud } from "@/components/game-hud";
import { GameOverOverlay, MenuOverlay } from "@/components/game-overlay";
import { ImpactFlash } from "@/components/impact-flash";
import { PaperPlaneSvg } from "@/components/paper-plane-svg";
const LERP = 0.14;
const FLOATING_LIFETIME_MS = 900;

export function PaperPlaneGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<GamePhase>("menu");
  const mouseRef = useRef({ x: 0, y: 0 });
  const planeRef = useRef<PlaneState>({ x: 0, y: 0, angle: -45 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const missilesRef = useRef<Missile[]>([]);
  const bulletsRef = useRef<PlayerBullet[]>([]);
  const powerupsRef = useRef<PowerupPickup[]>([]);
  const scoreRef = useRef(0);
  const timeRef = useRef(0);
  const livesRef = useRef(3);
  const maxLivesRef = useRef(3);
  const multiplierRef = useRef(1);
  const hasShieldRef = useRef(false);
  const invincibleUntilRef = useRef(0);
  const frenzyUntilRef = useRef(0);
  const sizeUntilRef = useRef(0);
  const planeScaleRef = useRef(1);
  const shotCountRef = useRef(1);
  const rofStacksRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const runFinalizedRef = useRef(false);
  const customizationRef = useRef<GameCustomization>(loadCustomization());
  const lastScoreTickRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const powerupSpawnTimerRef = useRef(0);
  const lastShootRef = useRef(0);
  const difficultyRef = useRef(0);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ width: 0, height: 0 });
  const floatingIdRef = useRef(0);
  const lastLivesChoiceRef = useRef<LifeOption>(3);
  const handleHitRef = useRef<(plane: PlaneState) => void>(() => {});
  const applyPowerupRef = useRef<(kind: PowerupKind, x: number, y: number) => void>(() => {});

  const [phase, setPhase] = useState<GamePhase>("menu");
  const [score, setScore] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [lives, setLives] = useState(3);
  const [maxLives, setMaxLives] = useState(3);
  const [multiplier, setMultiplier] = useState(1);
  const [hasShield, setHasShield] = useState(false);
  const [shotCount, setShotCount] = useState(1);
  const [fireRateStacks, setFireRateStacks] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [customization, setCustomization] = useState<GameCustomization>(() =>
    loadCustomization(),
  );
  const [planeScale, setPlaneScale] = useState(1);
  const [frenzyActive, setFrenzyActive] = useState(false);
  const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
  const [stats, setStats] = useState<GameStats>(() => loadStats());
  const [planeDisplay, setPlaneDisplay] = useState<PlaneState>({ x: 0, y: 0, angle: -45 });
  const [obstaclesDisplay, setObstaclesDisplay] = useState<Obstacle[]>([]);
  const [missilesDisplay, setMissilesDisplay] = useState<Missile[]>([]);
  const [bulletsDisplay, setBulletsDisplay] = useState<PlayerBullet[]>([]);
  const [powerupsDisplay, setPowerupsDisplay] = useState<PowerupPickup[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [impactFlash, setImpactFlash] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [scorePulse, setScorePulse] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const [isInvincible, setIsInvincible] = useState(false);
  const getPlaneRadius = useCallback(
    () => PLANE_RADIUS_BASE * planeScaleRef.current,
    [],
  );

  const addFloating = useCallback(
    (
      x: number,
      y: number,
      text: string,
      kind: FloatingText["kind"],
      color?: string,
    ) => {
      floatingIdRef.current += 1;
      const id = `ft-${floatingIdRef.current}`;
      setFloatingTexts((prev) => [
        ...prev,
        { id, x, y, text, kind, color, createdAt: performance.now() },
      ]);
      window.setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((f) => f.id !== id));
      }, FLOATING_LIFETIME_MS);
    },
    [],
  );

  const syncBuffs = useCallback(() => {
    const now = performance.now();
    const buffs: ActiveBuff[] = [];
    if (hasShieldRef.current) {
      buffs.push({
        kind: "shield",
        label: "Escudo",
        color: getPowerupDef("shield").color,
      });
    }
    if (now < frenzyUntilRef.current) {
      buffs.push({
        kind: "frenzy-active",
        label: "Frenesí",
        color: getPowerupDef("frenzy").color,
        expiresAt: frenzyUntilRef.current,
      });
    }
    if (now < invincibleUntilRef.current && !hasShieldRef.current) {
      buffs.push({
        kind: "invuln",
        label: "Invuln",
        color: getPowerupDef("invuln").color,
        expiresAt: invincibleUntilRef.current,
      });
    }
    if (planeScaleRef.current > 1.05) {
      buffs.push({
        kind: "grow",
        label: "Gigante",
        color: getPowerupDef("grow").color,
        expiresAt: sizeUntilRef.current,
      });
    }
    if (planeScaleRef.current < 0.95) {
      buffs.push({
        kind: "shrink",
        label: "Mini",
        color: getPowerupDef("shrink").color,
        expiresAt: sizeUntilRef.current,
      });
    }
    if (rofStacksRef.current > 0) {
      buffs.push({
        kind: "rof",
        label: `Cadencia ×${rofStacksRef.current}`,
        color: getPowerupDef("rof").color,
      });
    }
    setActiveBuffs(buffs);
    setFrenzyActive(now < frenzyUntilRef.current);
    setIsInvincible(now < invincibleUntilRef.current);
  }, []);

  const adjustScore = useCallback(
    (delta: number, x: number, y: number, label: string, color: string) => {
      scoreRef.current = Math.max(0, scoreRef.current + delta);
      setScore(scoreRef.current);
      if (delta > 0) {
        const wallet = addToWallet(delta);
        setWalletBalance(wallet.balance);
        setScorePulse(true);
        window.setTimeout(() => setScorePulse(false), 200);
      }
      const sign = delta >= 0 ? "+" : "";
      addFloating(x, y, `${sign}${formatScore(Math.abs(delta))} ${label}`, "powerup", color);
    },
    [addFloating],
  );

  const triggerImpactFx = useCallback(() => {
    setImpactFlash(true);
    setScreenShake(true);
    window.setTimeout(() => setImpactFlash(false), 220);
    window.setTimeout(() => setScreenShake(false), 420);
  }, []);

  const syncPhase = useCallback((next: GamePhase) => {
    phaseRef.current = next;
    setPhase(next);
    document.body.classList.toggle("game-menu", next === "menu");
    if (next === "menu") {
      stopPhonkMusic();
      setNowPlaying(null);
    }
  }, []);

  const resetRound = useCallback(
    (lifeChoice: LifeOption) => {
      const { width, height } = sizeRef.current;
      const cx = width / 2;
      const cy = height / 2;
      const mult = getMultiplier(lifeChoice);

      mouseRef.current = { x: cx, y: cy };
      planeRef.current = { x: cx, y: cy, angle: -45 };
      obstaclesRef.current = [];
      missilesRef.current = [];
      bulletsRef.current = [];
      powerupsRef.current = [];
      scoreRef.current = 0;
      timeRef.current = 0;
      livesRef.current = lifeChoice;
      maxLivesRef.current = lifeChoice;
      multiplierRef.current = mult;
      hasShieldRef.current = false;
    shotCountRef.current = 1;
    rofStacksRef.current = 0;
    isPointerDownRef.current = false;
    runFinalizedRef.current = false;
    planeScaleRef.current = 1;
      frenzyUntilRef.current = 0;
      sizeUntilRef.current = 0;
      invincibleUntilRef.current = performance.now() + 1200;
      lastScoreTickRef.current = performance.now();
      spawnTimerRef.current = 0;
      powerupSpawnTimerRef.current = 0;
      lastShootRef.current = 0;
      difficultyRef.current = 0;
      lastLivesChoiceRef.current = lifeChoice;

      setScore(0);
      setTimeSeconds(0);
      setLives(lifeChoice);
      setMaxLives(lifeChoice);
      setMultiplier(mult);
      setHasShield(false);
    setShotCount(1);
    setFireRateStacks(0);
    setPlaneScale(1);
      setObstaclesDisplay([]);
      setMissilesDisplay([]);
      setBulletsDisplay([]);
      setPowerupsDisplay([]);
      setFloatingTexts([]);
      setPlaneDisplay({ ...planeRef.current });
      addFloating(cx, cy - 40, `×${mult} ACTIVO`, "multiplier");
      syncBuffs();
    },
    [addFloating, syncBuffs],
  );

  const finalizeRun = useCallback(() => {
    if (runFinalizedRef.current) return;
    runFinalizedRef.current = true;
    const finalScore = scoreRef.current;
    const prevHigh = loadStats().highScore;
    const updated = recordGameEnd(finalScore, timeRef.current);
    setIsNewRecord(finalScore > prevHigh && finalScore > 0);
    setStats(updated);
  }, []);

  const endGame = useCallback(() => {
    syncPhase("over");
  }, [syncPhase]);

  const revive = useCallback(async () => {
    const wallet = spendFromWallet(REVIVE_COST);
    if (!wallet) return;
    setWalletBalance(wallet.balance);
    livesRef.current = 1;
    setLives(1);
    const now = performance.now();
    invincibleUntilRef.current = now + 2000;
    setIsInvincible(true);
    window.setTimeout(() => setIsInvincible(false), 2000);
    syncPhase("playing");
    const track = await resumePhonkMusic();
    setNowPlaying(track?.title ?? null);
    syncBuffs();
  }, [syncBuffs, syncPhase]);

  const applyPowerup = useCallback(
    (kind: PowerupKind, x: number, y: number) => {
      const def = getPowerupDef(kind);
      const now = performance.now();

      adjustScore(def.scoreOnPickup, x, y - 28, def.label.toUpperCase(), def.color);

      switch (kind) {
        case "shield":
          hasShieldRef.current = true;
          setHasShield(true);
          playShieldSound();
          break;
        case "invuln":
          invincibleUntilRef.current = Math.max(
            invincibleUntilRef.current,
            now + INVULN_POWERUP_MS,
          );
          setIsInvincible(true);
          playShieldSound();
          break;
        case "frenzy":
          frenzyUntilRef.current = now + FRENZY_DURATION_MS;
          setFrenzyActive(true);
          break;
        case "bomb": {
          const count = obstaclesRef.current.length;
          obstaclesRef.current = [];
          missilesRef.current = [];
          const bonus = count * BOMB_PER_OBSTACLE_SCORE;
          if (bonus > 0) {
            adjustScore(bonus, x, y, "BOOM", def.color);
          }
          triggerImpactFx();
          break;
        }
        case "multishot":
          shotCountRef.current = Math.min(MAX_MULTISHOT, shotCountRef.current + 1);
          setShotCount(shotCountRef.current);
          break;
        case "rof":
          rofStacksRef.current = Math.min(MAX_ROF_STACK, rofStacksRef.current + 1);
          setFireRateStacks(rofStacksRef.current);
          break;
        case "grow":
          planeScaleRef.current = PLANE_SCALE_GROW;
          sizeUntilRef.current = now + SIZE_POWERUP_DURATION_MS;
          setPlaneScale(PLANE_SCALE_GROW);
          break;
        case "shrink":
          planeScaleRef.current = PLANE_SCALE_SHRINK;
          sizeUntilRef.current = now + SIZE_POWERUP_DURATION_MS;
          setPlaneScale(PLANE_SCALE_SHRINK);
          break;
      }
      syncBuffs();
    },
    [adjustScore, syncBuffs, triggerImpactFx],
  );

  applyPowerupRef.current = applyPowerup;

  const handleHit = useCallback(
    (plane: PlaneState) => {
      const now = performance.now();
      if (now < invincibleUntilRef.current) return;

      if (hasShieldRef.current) {
        hasShieldRef.current = false;
        setHasShield(false);
        invincibleUntilRef.current = now + INVINCIBILITY_MS;
        triggerImpactFx();
        playHitSound();
        addFloating(plane.x, plane.y - 30, "ESCUDO ROTO", "loss");
        syncBuffs();
        return;
      }

      const penalty = calcHitPenalty(scoreRef.current, multiplierRef.current);
      scoreRef.current = Math.max(0, scoreRef.current - penalty);
      setScore(scoreRef.current);
      setScorePulse(true);
      window.setTimeout(() => setScorePulse(false), 300);

      livesRef.current -= 1;
      setLives(livesRef.current);
      invincibleUntilRef.current = now + INVINCIBILITY_MS;
      triggerImpactFx();
      playHitSound();
      addFloating(plane.x, plane.y, `-${formatScore(penalty)}`, "loss");

      if (livesRef.current <= 0) {
        endGame();
      }
      syncBuffs();
    },
    [addFloating, endGame, syncBuffs, triggerImpactFx],
  );

  handleHitRef.current = handleHit;

  const tryFire = useCallback((now: number) => {
    const cooldown = getShootCooldownMs(rofStacksRef.current);
    if (now - lastShootRef.current < cooldown) return;
    lastShootRef.current = now;
    bulletsRef.current.push(
      ...createPlayerBullets(planeRef.current, shotCountRef.current),
    );
  }, []);

  const startGame = useCallback(
    async (lifeChoice: LifeOption, custom: GameCustomization) => {
      customizationRef.current = custom;
      setCustomization(custom);
      setWalletBalance(loadWallet().balance);
      resetRound(lifeChoice);
      syncPhase("playing");
      const track = await startRandomPhonkMusic();
      setNowPlaying(track?.title ?? null);
    },
    [resetRound, syncPhase],
  );

  const goMenu = useCallback(() => {
    finalizeRun();
    syncPhase("menu");
    setStats(loadStats());
    setWalletBalance(loadWallet().balance);
  }, [finalizeRun, syncPhase]);

  useEffect(() => {
    setStats(loadStats());
    setWalletBalance(loadWallet().balance);
    document.body.classList.add("game-menu");

    const updateSize = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      sizeRef.current = { width: rect.width, height: rect.height };
      if (phaseRef.current === "menu") {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        mouseRef.current = { x: cx, y: cy };
        planeRef.current = { x: cx, y: cy, angle: -45 };
        setPlaneDisplay({ ...planeRef.current });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const onPointerMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const updateMouseFromEvent = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      if (phaseRef.current !== "playing") return;
      isPointerDownRef.current = true;
      updateMouseFromEvent(e);
      tryFire(performance.now());
    };

    const onPointerUp = () => {
      isPointerDownRef.current = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    const loop = (now: number) => {
      if (phaseRef.current === "playing") {
        const { width, height } = sizeRef.current;
        const plane = planeRef.current;
        const planeRadius = getPlaneRadius();
        const frenzy = now < frenzyUntilRef.current;
        const enemyDt = 16 * (frenzy ? FRENZY_TIME_SCALE : 1);

        if (now >= sizeUntilRef.current && sizeUntilRef.current > 0) {
          planeScaleRef.current = 1;
          sizeUntilRef.current = 0;
          setPlaneScale(1);
        }

        const target = mouseRef.current;
        plane.x += (target.x - plane.x) * LERP;
        plane.y += (target.y - plane.y) * LERP;
        plane.angle = aimAngleDeg(plane.x, plane.y, target.x, target.y);

        if (isPointerDownRef.current) {
          tryFire(now);
        }
        const half = (BASE_PLANE_DISPLAY_SIZE * planeScaleRef.current) / 2;
        plane.x = Math.max(half, Math.min(width - half, plane.x));
        plane.y = Math.max(half, Math.min(height - half, plane.y));

        const elapsed = now - lastScoreTickRef.current;
        if (elapsed >= 1000) {
          const ticks = Math.floor(elapsed / 1000);
          const gain = ticks * BASE_POINTS_PER_SECOND * multiplierRef.current;
          scoreRef.current += gain;
          timeRef.current += ticks;
          difficultyRef.current = Math.floor(timeRef.current / 4);
          lastScoreTickRef.current += ticks * 1000;
          setScore(scoreRef.current);
          setTimeSeconds(timeRef.current);
          if (gain > 0) {
            const wallet = addToWallet(gain);
            setWalletBalance(wallet.balance);
            addFloating(plane.x + 30, plane.y - 20, `+${formatScore(gain)}`, "gain");
          }
        }

        spawnTimerRef.current += enemyDt;
        if (spawnTimerRef.current >= getSpawnIntervalMs(difficultyRef.current)) {
          spawnTimerRef.current = 0;
          obstaclesRef.current.push(
            createObstacle({ width, height, difficulty: difficultyRef.current }),
          );
        }

        powerupSpawnTimerRef.current += 16;
        if (powerupSpawnTimerRef.current >= POWERUP_SPAWN_MS) {
          powerupSpawnTimerRef.current = 0;
          if (powerupsRef.current.length < 3 && Math.random() < 0.82) {
            powerupsRef.current.push(createPowerupPickup(width, height));
          }
        }

        const shootInterval = getShootIntervalMs(difficultyRef.current);
        obstaclesRef.current = obstaclesRef.current.map((obs) => {
          let shootTimer = obs.shootTimer - enemyDt;
          const updated = {
            ...obs,
            x: obs.x + obs.vx * (enemyDt / 16),
            y: obs.y + obs.vy * (enemyDt / 16),
            shootTimer,
          };
          if (shootTimer <= 0) {
            missilesRef.current.push(fireMissileFromObstacle(updated));
            shootTimer = shootInterval * (0.7 + Math.random() * 0.6);
          }
          return { ...updated, shootTimer };
        });
        obstaclesRef.current = obstaclesRef.current.filter(
          (o) => !isObstacleOffScreen(o, width, height),
        );

        missilesRef.current = missilesRef.current
          .map((m) => ({
            ...m,
            x: m.x + m.vx * (enemyDt / 16),
            y: m.y + m.vy * (enemyDt / 16),
          }))
          .filter((m) => !isMissileOffScreen(m, width, height));

        bulletsRef.current = bulletsRef.current
          .map((b) => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
          .filter((b) => !isBulletOffScreen(b, width, height));

        const destroyed = new Set<string>();
        const remainingBullets: PlayerBullet[] = [];
        for (const b of bulletsRef.current) {
          let consumed = false;
          for (const o of obstaclesRef.current) {
            if (!destroyed.has(o.id) && bulletHitsObstacle(b, o)) {
              destroyed.add(o.id);
              consumed = true;
              adjustScore(
                OBSTACLE_DESTROY_SCORE,
                o.x + o.width / 2,
                o.y + o.height / 2,
                "DESTRUIDO",
                "#06b6d4",
              );
              break;
            }
          }
          if (!consumed) remainingBullets.push(b);
        }
        bulletsRef.current = remainingBullets;
        if (destroyed.size > 0) {
          obstaclesRef.current = obstaclesRef.current.filter((o) => !destroyed.has(o.id));
        }

        powerupsRef.current = powerupsRef.current
          .map((s) => ({ ...s, lifeMs: s.lifeMs - 16 }))
          .filter((s) => s.lifeMs > 0);

        const picked = checkPowerupPickup(plane, powerupsRef.current, planeRadius);
        if (picked) {
          powerupsRef.current = powerupsRef.current.filter((s) => s.id !== picked.id);
          applyPowerupRef.current(picked.kind, plane.x, plane.y);
        }

        const hitObstacle = checkObstacleCollision(
          plane,
          obstaclesRef.current,
          planeRadius,
        );
        const hitMissile = checkMissileCollision(
          plane,
          missilesRef.current,
          planeRadius,
        );
        if (hitObstacle || hitMissile) {
          handleHitRef.current(plane);
        }

        syncBuffs();
        setPlaneDisplay({ x: plane.x, y: plane.y, angle: plane.angle });
        setObstaclesDisplay([...obstaclesRef.current]);
        setMissilesDisplay([...missilesRef.current]);
        setBulletsDisplay([...bulletsRef.current]);
        setPowerupsDisplay([...powerupsRef.current]);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.body.classList.remove("game-menu");
      stopPhonkMusic();
    };
  }, [addFloating, adjustScore, getPlaneRadius, syncBuffs, tryFire]);

  const displaySize = BASE_PLANE_DISPLAY_SIZE * planeScale;
  const planeGlow = hasShield
    ? "drop-shadow-[0_0_20px_#22c55e] ring-2 ring-accent/60 rounded-full"
    : isInvincible
      ? "animate-plane-blink drop-shadow-[0_0_16px_#fbbf24]"
      : frenzyActive
        ? "drop-shadow-[0_0_20px_#a855f7]"
        : "drop-shadow-[0_0_12px_#dc2626]";

  return (
    <div
      ref={containerRef}
      className={`relative h-dvh w-full overflow-hidden bg-secondary ${
        screenShake ? "animate-screen-shake" : ""
      } ${frenzyActive ? "saturate-125" : ""}`}
      role="application"
      aria-label="Avión de papel — juego de esquiva"
    >
      <GameBackground backgroundId={customization.backgroundId} />

      <GameEntities
        obstacles={obstaclesDisplay}
        missiles={missilesDisplay}
        bullets={bulletsDisplay}
        powerups={powerupsDisplay}
        hasShield={hasShield}
        frenzyActive={frenzyActive}
      />

      <FloatingTexts items={floatingTexts} />
      <ImpactFlash active={impactFlash} />

      <div
        className={`pointer-events-none absolute z-10 will-change-transform ${planeGlow}`}
        style={{
          left: planeDisplay.x,
          top: planeDisplay.y,
          width: displaySize,
          height: displaySize,
          transform: `translate(-50%, -50%) rotate(${planeDisplay.angle}deg)`,
        }}
      >
        <PaperPlaneSvg className="h-full w-full" colors={customization.planeColors} />
      </div>

      {phase === "playing" && (
        <>
          <GameHud
            score={score}
            timeSeconds={timeSeconds}
            highScore={stats.highScore}
            lives={lives}
            maxLives={maxLives}
            multiplier={multiplier}
            hasShield={hasShield}
            scorePulse={scorePulse}
            shotCount={shotCount}
            activeBuffs={activeBuffs}
            walletBalance={walletBalance}
            fireRateStacks={fireRateStacks}
          />
          {nowPlaying && (
            <p className="pointer-events-none absolute bottom-3 left-3 z-20 max-w-[50%] truncate text-[10px] text-white/30">
              ♪ {nowPlaying}
            </p>
          )}
        </>
      )}

      {phase === "menu" && (
        <MenuOverlay
          stats={stats}
          walletBalance={walletBalance}
          onStart={(l, c) => void startGame(l, c)}
        />
      )}

      {phase === "over" && (
        <GameOverOverlay
          score={score}
          timeSeconds={timeSeconds}
          isNewRecord={isNewRecord}
          stats={stats}
          walletBalance={walletBalance}
          canRevive={walletBalance >= REVIVE_COST}
          onRevive={revive}
          onRestart={() => {
            finalizeRun();
            void startGame(lastLivesChoiceRef.current, customizationRef.current);
          }}
          onMenu={goMenu}
        />
      )}
    </div>
  );
}
