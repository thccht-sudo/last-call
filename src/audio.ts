// Synthesized impact sounds; no audio files.
let ctx: AudioContext | null = null;

export function unlockAudio() {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
}

function noise(dur: number, freq: number, gain: number) {
  if (!ctx || ctx.state !== 'running') return;
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq;
  const g = ctx.createGain(); g.gain.value = gain;
  src.connect(f).connect(g).connect(ctx.destination);
  src.start();
}

function thump(freq: number, dur: number, gain: number) {
  if (!ctx || ctx.state !== 'running') return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + dur);
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  o.connect(g).connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + dur);
}

export const sfx = {
  hit(heavy: boolean) { noise(heavy ? 0.18 : 0.1, heavy ? 1800 : 2600, 0.5); thump(heavy ? 90 : 140, heavy ? 0.25 : 0.12, 0.8); },
  counter() { noise(0.2, 4000, 0.4); thump(70, 0.3, 1); },
  hurt() { noise(0.15, 900, 0.6); thump(60, 0.2, 0.9); },
  whiff() { noise(0.12, 600, 0.25); },
  dodge() { noise(0.08, 1200, 0.15); },
  shatter() { noise(0.3, 7000, 0.35); },
};
