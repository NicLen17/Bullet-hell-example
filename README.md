# Avión de Papel (Paper Plane)

A browser arcade game built with **Next.js**, **React**, and **TypeScript**. Pilot a paper plane that follows your cursor, dodge incoming missiles, shoot down obstacles, collect power-ups, and chase high scores — all with intense visual feedback and random Phonk music.

## About this project

**Avión de Papel** was built as a **3-prompt coding challenge**: the entire app — game loop, mechanics, UI, audio, persistence, and customization — was scaffolded and iterated in just three AI-assisted prompts. The goal was to see how far a playable, polished arcade experience could go with minimal hand-written boilerplate.

## Tech stack

- **Next.js 15** (App Router, Turbopack)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- Client-side game loop with `requestAnimationFrame`
- All progress stored in **`localStorage`** (no backend)

## Gameplay

- **Movement:** the plane smoothly follows your cursor.
- **Shooting:** hold click to fire toward the cursor; destroy obstacles (+2,500 pts each).
- **Lives & multiplier:** start with 1–3 lives; fewer lives = higher score multiplier (×1 / ×2 / ×3).
- **Scoring:** +1,000 × multiplier per second survived.
- **Wallet:** earned points are saved to `localStorage` (`avion-papel-wallet`) for a future shop.
- **Revive:** spend 22,000 wallet points to continue after game over.
- **Customization:** choose background (grid / city / space) and plane colors via color picker.
- **Music:** random Phonk track on each run.

### Power-ups

Each power-up has a unique icon and color, and grants points on pickup:

| Power-up | Effect | Points |
|----------|--------|--------|
| Shield (green) | Blocks one hit | +3,500 |
| Invulnerability (gold) | Temporary invuln | +7,500 |
| Frenzy (purple) | Slow-motion enemies | +5,000 |
| Bomb (orange) | Clears obstacles + bonus | +10,000 + per obstacle |
| Multishot (cyan) | Up to 3 projectiles | +6,000 |
| Giant (pink) | Larger hitbox | −8,000 |
| Mini (indigo) | Smaller hitbox | −4,000 |

## Visual identity

Primary **red** · secondary **black** · accent **green**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Local music (optional)

See `public/audio/README.md` to add your own MP3 tracks from sources like Pixabay or Mixkit.

## Persistence

| Key | Contents |
|-----|----------|
| `avion-papel-stats` | High score, games played, total points, best time |
| `avion-papel-wallet` | Saved points for revive / future shop |
| `avion-papel-customization` | Background and plane color preferences |
