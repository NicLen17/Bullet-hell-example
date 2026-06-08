/**
 * Música Phonk / trap agresiva — licencia gratuita (Mixkit License / archivos locales).
 * Coloca MP3 propios en public/audio/phonk-1.mp3 … phonk-3.mp3 (Pixabay, etc.).
 */
export type PhonkTrack = {
  id: string;
  title: string;
  src: string;
};

export const PHONK_TRACKS: PhonkTrack[] = [
  {
    id: "local-1",
    title: "Phonk local 1",
    src: "/audio/phonk-1.mp3",
  },
  {
    id: "local-2",
    title: "Phonk local 2",
    src: "/audio/phonk-2.mp3",
  },
  {
    id: "mixkit-trap",
    title: "Trap drive",
    src: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-974.mp3",
  },
  {
    id: "mixkit-game",
    title: "Game energy",
    src: "https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3",
  },
  {
    id: "mixkit-hurry",
    title: "Hurry beat",
    src: "https://assets.mixkit.co/music/preview/mixkit-hurry-297.mp3",
  },
  {
    id: "mixkit-driving",
    title: "Driving ambition",
    src: "https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3",
  },
];

export function pickRandomPhonkTrack(): PhonkTrack {
  const index = Math.floor(Math.random() * PHONK_TRACKS.length);
  return PHONK_TRACKS[index] ?? PHONK_TRACKS[0];
}
