// Soundtrack generated with Google Lyria 3 via OpenRouter (tools/generate-music.mjs).
// One looping track at a time, crossfaded. M toggles mute.
export type Track = 'title' | 'fight' | 'boss';

const VOLUME = 0.45, FADE_MS = 1200;
const players = new Map<Track, HTMLAudioElement>();
let current: Track | null = null;
let muted = false;
try { muted = localStorage.getItem('lastcall-muted') === '1'; } catch { /* storage blocked */ }

function el(t: Track) {
  let a = players.get(t);
  if (!a) {
    a = new Audio(`./music/${t}.mp3`);
    a.loop = true; a.volume = 0; a.preload = 'auto';
    players.set(t, a);
  }
  return a;
}

function fade(a: HTMLAudioElement, to: number, then?: () => void) {
  const from = a.volume, start = performance.now();
  const stepFade = () => {
    const k = Math.min(1, (performance.now() - start) / FADE_MS);
    a.volume = from + (to - from) * k;
    if (k < 1) requestAnimationFrame(stepFade); else then?.();
  };
  requestAnimationFrame(stepFade);
}

export function playMusic(t: Track) {
  if (t === current) return;
  const prev = current ? players.get(current) : undefined;
  current = t;
  if (prev) fade(prev, 0, () => prev.pause());
  const next = el(t);
  next.currentTime = 0;
  next.play().then(() => fade(next, muted ? 0 : VOLUME)).catch(() => { /* not unlocked yet; retried on next call */ current = null; });
}

export function toggleMute() {
  muted = !muted;
  try { localStorage.setItem('lastcall-muted', muted ? '1' : '0'); } catch { /* storage blocked */ }
  const a = current ? players.get(current) : undefined;
  if (a) a.volume = muted ? 0 : VOLUME;
  return muted;
}
