import { PHONK_TRACKS, type PhonkTrack } from "@/lib/phonk-tracks";

let musicAudio: HTMLAudioElement | null = null;
let currentTrack: PhonkTrack | null = null;

export async function startRandomPhonkMusic(volume = 0.42): Promise<PhonkTrack | null> {
  stopPhonkMusic();

  const order = [...PHONK_TRACKS].sort(() => Math.random() - 0.5);

  for (const track of order) {
    const audio = new Audio(track.src);
    audio.loop = true;
    audio.volume = volume;
    try {
      await audio.play();
      musicAudio = audio;
      currentTrack = track;
      return track;
    } catch {
      audio.pause();
    }
  }

  return null;
}

export async function resumePhonkMusic(volume = 0.42): Promise<PhonkTrack | null> {
  if (musicAudio) {
    musicAudio.volume = volume;
    try {
      if (musicAudio.paused) {
        await musicAudio.play();
      }
      return currentTrack;
    } catch {
      /* fall through to restart */
    }
  }
  return startRandomPhonkMusic(volume);
}

export function stopPhonkMusic(): void {
  if (musicAudio) {
    musicAudio.pause();
    musicAudio.src = "";
    musicAudio = null;
  }
  currentTrack = null;
}

export function getCurrentTrack(): PhonkTrack | null {
  return currentTrack;
}

export function playHitSound(): void {
  if (typeof window === "undefined") return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
    osc.onended = () => void ctx.close();
  } catch {
    /* autoplay */
  }
}

export function playShieldSound(): void {
  if (typeof window === "undefined") return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
    osc.onended = () => void ctx.close();
  } catch {
    /* noop */
  }
}
