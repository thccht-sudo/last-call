// Sound effects, voices and ambience. Impacts layer a synthesized crack over a sampled punch or
// glass smash; voices and ambience were generated through OpenRouter (tools/generate-voice.mjs,
// tools/generate-music.mjs, tools/slice-sfx.py).
let ctx: AudioContext | null = null;
let sfxBus: GainNode | null = null;
let voiceBus: GainNode | null = null;
const buffers = new Map<string, AudioBuffer | 'loading'>();
let level = { sfx: 1, voice: 1 };

// Sounds and voices volume, 0..1, from the pause menu. Ambience rides with sounds.
export function setVolumes(v: { sfx: number; voice: number }) {
  level = v;
  if (sfxBus) sfxBus.gain.value = 0.8 * v.sfx;
  if (voiceBus) voiceBus.gain.value = v.voice;
  if (ambience) ambience.gain.gain.value = (ambience.name === 'club' ? 0.22 : 0.16) * v.sfx;
}

const SAMPLES = [
  ...[0, 1, 2, 3, 4, 5].map(i => `punch${i}`), ...[0, 1, 2, 3].map(i => `glass${i}`), 'street', 'club',
];
export const VOICE = {
  taunt: ['bro1', 'bro2', 'bro3', 'bro4', 'bro5', 'bro6'],
  hurt: ['oof1', 'oof2'], floored: ['oof3'], bottled: ['oof4'],
  bossIntro: ['boss1'], bossBackup: ['boss2'], bossSwing: ['boss3'], bossDown: ['boss4'],
  conradStart: ['conrad1'], conradSwing: ['conrad2'], georgeJoin: ['george1'], georgeSwing: ['george2'],
  conradDown: ['down1'], georgeDown: ['down2'], win: ['win'],
} as const;

export function unlockAudio() {
  if (!ctx) {
    ctx = new AudioContext();
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.8 * level.sfx; sfxBus.connect(ctx.destination);
    voiceBus = ctx.createGain(); voiceBus.gain.value = level.voice; voiceBus.connect(ctx.destination);
    for (const name of [...SAMPLES, ...Object.values(VOICE).flat().map(v => `vo/${v}`)]) load(name);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

function load(name: string) {
  if (!ctx || buffers.has(name)) return;
  buffers.set(name, 'loading');
  fetch(`./sfx/${name}.mp3`).then(r => r.arrayBuffer()).then(b => ctx!.decodeAudioData(b))
    .then(buf => buffers.set(name, buf)).catch(() => buffers.delete(name));
}

const running = () => ctx && ctx.state === 'running';

function sample(name: string, gain: number, rate = 1, bus = sfxBus) {
  const buf = buffers.get(name);
  if (!running() || !buf || buf === 'loading' || !bus) return null;
  const src = ctx!.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate;
  const g = ctx!.createGain(); g.gain.value = gain;
  src.connect(g).connect(bus);
  src.start();
  return src;
}

const pick = <T>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];
const vary = (spread: number) => 1 + (Math.random() * 2 - 1) * spread;

function noise(dur: number, freq: number, gain: number) {
  if (!running() || !sfxBus) return;
  const n = Math.floor(ctx!.sampleRate * dur);
  const buf = ctx!.createBuffer(1, n, ctx!.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2;
  const src = ctx!.createBufferSource(); src.buffer = buf;
  const f = ctx!.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq;
  const g = ctx!.createGain(); g.gain.value = gain;
  src.connect(f).connect(g).connect(sfxBus);
  src.start();
}

function thump(freq: number, dur: number, gain: number) {
  if (!running() || !sfxBus) return;
  const o = ctx!.createOscillator(), g = ctx!.createGain();
  const t = ctx!.currentTime;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(freq * 0.4, t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(sfxBus);
  o.start(); o.stop(t + dur);
}

const punch = (heavy: boolean) => sample(`punch${Math.floor(Math.random() * 6)}`, heavy ? 0.9 : 0.6, vary(0.12) * (heavy ? 0.85 : 1.05));

export const sfx = {
  hit(heavy: boolean) { punch(heavy); noise(heavy ? 0.12 : 0.07, heavy ? 2200 : 3200, 0.3); thump(heavy ? 90 : 140, heavy ? 0.2 : 0.1, 0.5); },
  counter() { punch(true); noise(0.18, 4500, 0.35); thump(70, 0.28, 0.8); },
  hurt() { punch(false); noise(0.12, 900, 0.4); thump(60, 0.18, 0.7); },
  whiff() { noise(0.12, 600, 0.25); },
  dodge() { noise(0.08, 1200, 0.15); },
  shatter() { sample(`glass${Math.floor(Math.random() * 4)}`, 0.7, vary(0.1)) ?? noise(0.3, 7000, 0.35); },
};

// Voices: one at a time, and no line repeats back to back.
let speaking: AudioBufferSourceNode | null = null;
let speakingUntil = 0;
let lastLine = '';
export function voice(lines: readonly string[], opts: { chance?: number; interrupt?: boolean } = {}) {
  if (!running() || Math.random() > (opts.chance ?? 1)) return;
  if (!opts.interrupt && ctx!.currentTime < speakingUntil) return;
  const choices = lines.length > 1 ? lines.filter(l => l !== lastLine) : lines;
  const line = pick(choices);
  const buf = buffers.get(`vo/${line}`);
  if (!buf || buf === 'loading') return;
  speaking?.stop();
  speaking = sample(`vo/${line}`, 1, 1, voiceBus);
  speakingUntil = ctx!.currentTime + buf.duration + 0.4;
  lastLine = line;
}

// Background ambience: street noise out front, a packed bar inside, crossfaded by stage.
let ambience: { name: string; src: AudioBufferSourceNode; gain: GainNode } | null = null;
export function ambient(name: 'street' | 'club') {
  if (!running() || ambience?.name === name) return;
  const buf = buffers.get(name);
  if (!buf || buf === 'loading') return;
  const t = ctx!.currentTime;
  if (ambience) { const old = ambience; old.gain.gain.setTargetAtTime(0, t, 0.5); old.src.stop(t + 3); }
  const src = ctx!.createBufferSource(); src.buffer = buf; src.loop = true;
  const gain = ctx!.createGain(); gain.gain.value = 0;
  gain.gain.setTargetAtTime((name === 'club' ? 0.22 : 0.16) * level.sfx, t, 0.8);
  src.connect(gain).connect(ctx!.destination);
  src.start();
  ambience = { name, src, gain };
}
