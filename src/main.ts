import './style.css';
import { createWorld, step, addPlayer, World, GameEvent, NO_INPUT } from './sim/world';
import { TUNING as T } from './sim/tuning';
import { Controls } from './input';
import { Renderer, CAST } from './render';
import { sfx, unlockAudio, voice, VOICE, ambient, setVolumes } from './audio';
import { playMusic, toggleMute, setMusicVolume } from './music';
import { loadSettings, saveSettings, Settings, showTitle, hideTitle, setTitleDifficulty, tips, openMenu, closeMenu, showResults, hideResults, Fps } from './ui';
import { Host, Guest, roomFromUrl, joinLink, interpolated } from './net';

const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const overlay = document.querySelector<HTMLElement>('#overlay')!;
const banner = document.querySelector<HTMLElement>('#banner')!;
const hud = document.querySelector<HTMLElement>('#hud')!;
const hint = document.querySelector<HTMLElement>('#hint')!;
const netPanel = document.querySelector<HTMLElement>('#net')!;

const controls = new Controls();
const renderer = new Renderer(canvas, overlay);
let settings: Settings = loadSettings();
let world: World = createWorld(Date.now(), 1, settings.difficulty);
let started = false;
let paused = false;
let slowUntil = 0; // real time until which the fight runs in slow motion
let slowScale = 0.25;
const fps = new Fps();

function applySettings(s: Settings) {
  settings = s;
  saveSettings(s);
  setMusicVolume(s.music);
  setVolumes({ sfx: s.sfx, voice: s.voice });
  if (s.quality === 'high') renderer.setQuality(0);
  if (s.quality === 'low') renderer.setQuality(2);
  document.getElementById('fps')!.hidden = !s.fps;
}
applySettings(settings);
let bannerUntil = 0;
let clock = 0; // local frame count, drives banner timing in every mode

// Online: the host runs the fight; a guest (opened from ?join=CODE) plays George remotely.
const room = roomFromUrl();
let host: Host | null = null;
const guest: Guest | null = room ? new Guest(room) : null;
let lastLinkStatus = '';
const localIndex = guest ? 1 : 0;

addEventListener('pointerdown', () => { unlockAudio(); playMusic(started ? 'fight' : 'title'); });
addEventListener('keydown', e => {
  unlockAudio();
  if (e.code === 'KeyM') say(toggleMute() ? 'MUSIC OFF' : 'MUSIC ON', 45);
  if (e.code === 'KeyF') applySettings({ ...settings, fps: !settings.fps });
  if (e.code === 'Escape' && started && world.result === 'playing') togglePause();
  if (!started && !guest) {
    const d = e.code === 'Digit1' ? 0 : e.code === 'Digit2' ? 1 : e.code === 'Digit3' ? 2
      : e.code === 'ArrowLeft' ? settings.difficulty - 1 : e.code === 'ArrowRight' ? settings.difficulty + 1 : -9;
    if (d >= 0 && d <= 2) chooseDifficulty(d);
  }
});
document.getElementById('title')!.addEventListener('click', e => {
  const d = (e.target as HTMLElement).dataset?.d;
  if (d !== undefined) chooseDifficulty(Number(d));
});

function chooseDifficulty(d: number) {
  applySettings({ ...settings, difficulty: d });
  setTitleDifficulty(d);
  world = createWorld(Date.now(), 1, d);
}

function togglePause() {
  if (paused) { paused = false; closeMenu(); return; }
  paused = !guest; // a guest can open the menu but can't stop the host's fight
  openMenu(settings, host?.status === 'connected' ? 'host' : guest ? 'guest' : null, {
    resume: () => { paused = false; closeMenu(); },
    restart: () => { paused = false; closeMenu(); restart(); },
    change: applySettings,
  });
}

hud.innerHTML = CAST.map((c, i) => `
  <div class="pbar p${i + 1}" style="--c:${c.css}">
    <b>${c.name}</b><div class="hp"><i></i></div><small></small>
  </div>`).join('');
const bars = [...hud.querySelectorAll<HTMLElement>('.pbar')];

function say(text: string, frames = 0) {
  banner.innerHTML = text;
  banner.style.opacity = text ? '1' : '0';
  bannerUntil = frames ? clock + frames : Infinity;
}
if (guest) say(`JOINING ${guest.code}<small>connecting to ${CAST[0].name}'s game…</small>`);
else showTitle(settings, false);

function showNet(html: string) { netPanel.innerHTML = html; netPanel.hidden = !html; }

function startHosting() {
  host = new Host();
  showNet(`Hosting online game <b>${host.code}</b> · connecting…`);
}

// Sound, rumble and banners for a batch of events. Rumble only for players on this machine.
function react(events: GameEvent[], w: World) {
  const rumble = (player: number, s: number, wk: number, ms: number) => {
    if (guest) { if (player === localIndex) controls.rumble(0, s, wk, ms); }
    else controls.rumble(player, s, wk, ms);
  };
  const bottled = events.some(e => e.type === 'shatter') && events.some(e => e.type === 'hit');
  if (bottled) voice(VOICE.bottled, { chance: 0.6 });
  for (const ev of events) {
    if (ev.type === 'hit' && ev.heavy) {
      voice(VOICE.hurt, { chance: 0.35 });
      if (ev.by >= 0) voice(ev.by === 0 ? VOICE.conradSwing : VOICE.georgeSwing, { chance: 0.15 });
    }
    if (ev.type === 'counter') voice(VOICE.hurt, { chance: 0.4 });
    if (ev.type === 'slam') voice(VOICE.floored, { chance: 0.5 });
    if (ev.type === 'ko') voice(ev.boss ? VOICE.bossDown : VOICE.floored, ev.boss ? { interrupt: true } : { chance: 0.35 });
    if (ev.type === 'enrage') voice(VOICE.bossBackup, { interrupt: true });
    if (ev.type === 'joined' && ev.player === 1) voice(VOICE.georgeJoin, { interrupt: true });
    if (ev.type === 'playerDown' && w.players.length > 1) voice(ev.player === 0 ? VOICE.conradDown : VOICE.georgeDown, { interrupt: true });
    if (ev.type === 'wave' && ev.n === 0) voice(VOICE.conradStart, { interrupt: true });
    if (ev.type === 'wave' && ev.n === T.waves.length - 1) voice(VOICE.bossIntro, { interrupt: true });
    if (ev.type === 'hit') { sfx.hit(ev.heavy); if (ev.by >= 0) rumble(ev.by, ev.heavy ? 0.7 : 0.3, 0.5, ev.heavy ? 120 : 60); }
    if (ev.type === 'counter') { sfx.counter(); rumble(ev.by, 1, 0.6, 140); }
    if (ev.type === 'tag') sfx.counter();
    if (ev.type === 'slam') { sfx.hit(true); rumble(0, 0.8, 0.8, 150); rumble(1, 0.8, 0.8, 150); }
    if (ev.type === 'deflect') { sfx.counter(); rumble(ev.by, 0.6, 0.6, 100); }
    if (ev.type === 'throw') sfx.whiff();
    if (ev.type === 'perfect') {
      // Perfect evade: a beat of slow motion, unless a finisher's already slowing things down.
      if (performance.now() > slowUntil) { slowUntil = performance.now() + 420; slowScale = 0.3; }
      sfx.perfect(); rumble(ev.by, 0.3, 0.8, 90);
    }
    if (ev.type === 'launch') { sfx.launch(); if (ev.by >= 0) rumble(ev.by, 0.6, 0.8, 120); }
    if (ev.type === 'spike') { sfx.spike(); rumble(0, 0.9, 0.9, 180); rumble(1, 0.9, 0.9, 180); voice(VOICE.floored, { chance: 0.5 }); }
    if (ev.type === 'swing' && T.attacks[ev.attack].red) sfx.warn();
    if (ev.type === 'enrage') say('HE CALLED FOR BACKUP', 90);
    if (ev.type === 'ko' && ev.boss) say('THE PRESIDENT IS DOWN', 90);
    if (ev.type === 'playerHit') { sfx.hurt(); rumble(ev.player, 1, 1, 200); }
    if (ev.type === 'playerDown' && w.players.length > 1 && w.result === 'playing') say(`${CAST[ev.player].name} IS DOWN<small>stand next to them to help them up</small>`, 120);
    if (ev.type === 'revived') say(`${CAST[ev.player].name} IS BACK UP`, 60);
    if (ev.type === 'joined') say(`${CAST[ev.player].name} JOINS`, 75);
    if (ev.type === 'whiff') sfx.whiff();
    if (ev.type === 'dodge') sfx.dodge();
    if (ev.type === 'shatter') sfx.shatter();
    if (ev.type === 'stage' && ev.stage === 1) say("INSIDE KILROY'S", 90);
    if (ev.type === 'wave') {
      const last = ev.n === T.waves.length - 1;
      if (T.waves[ev.n].stage === 0 || !last) say(last ? 'FINAL ROUND' : `ROUND ${ev.n + 1}`, 90);
      else say("FINAL ROUND<small>inside Kilroy's</small>", 120);
      playMusic(last ? 'boss' : 'fight');
    }
  }
}

let lastResult = '';
function showResult(w: World) {
  if (w.result === lastResult) return;
  lastResult = w.result;
  if (w.result === 'playing') { hideResults(); return; }
  playMusic('title');
  if (w.result === 'win') voice(VOICE.win, { interrupt: true });
  say('');
  showResults(w);
}

// The last knockout of a round (and the President's) plays in slow motion with the camera in close.
function finisher(events: GameEvent[], w: World) {
  const ko = events.find(e => e.type === 'ko');
  if (!ko || ko.type !== 'ko') return;
  if (!ko.boss && w.enemies.some(e => e.state !== 'dead')) return;
  slowUntil = performance.now() + 1400; slowScale = 0.25;
  renderer.punch(ko.pos, 1400);
}

// Voice cues that come from state changes rather than events: frats taunt as they step in,
// and the President roars on his haymaker. Ambience follows the stage.
const seen = new Map<number, string>();
function watch(w: World) {
  if (started) ambient(w.stage === 0 ? 'street' : 'club');
  for (const e of w.enemies) {
    const was = seen.get(e.id);
    if (was !== e.state) {
      if (e.state === 'approach' && was === 'circle') voice(VOICE.taunt, { chance: 0.3 });
      if (e.state === 'windup' && e.kind === 'boss' && e.unblockable) voice(VOICE.bossSwing, { interrupt: true });
      seen.set(e.id, e.state);
    }
  }
}

function guestTick() {
  const g = guest!;
  const samples = controls.poll();
  if (!controls.slots.length) { const dev = controls.joiner(samples); if (dev) controls.slots = [dev]; }
  const start = controls.startPressed(samples);
  g.sendInput(controls.inputFor(0, samples), start);
  if (start && started && world.result === 'playing') togglePause();
  if (g.status !== lastLinkStatus) {
    lastLinkStatus = g.status;
    if (g.status === 'connected') { started = true; say('CONNECTED<small>you are George · press any button</small>', 120); playMusic('fight'); }
    if (g.status === 'closed') say(`DISCONNECTED<small>${CAST[0].name} closed the game · reload to rejoin</small>`);
    if (g.status === 'error') say(`COULDN'T JOIN ${g.code}<small>${g.error}: check the link, or ask ${CAST[0].name} to host again</small>`);
  }
  const w = interpolated(g.snaps);
  if (w) {
    if (w.frame < world.frame - 30) renderer.clear(); // host restarted the fight
    world = w;
    renderer.events(g.events);
    const evs = g.takeEvents();
    react(evs, w);
    finisher(evs, w);
    watch(w);
    showResult(w);
  }
}

function hostTick() {
  const samples = controls.poll();
  if (!started) {
    // On the title card: left/right on a pad picks difficulty; anything else starts.
    for (const smp of samples.values()) {
      if (Math.abs(smp.input.mx) > 0.6 && !stickHeld) { stickHeld = true; chooseDifficulty(Math.max(0, Math.min(2, settings.difficulty + Math.sign(smp.input.mx)))); }
    }
    if (![...samples.values()].some(smp => Math.abs(smp.input.mx) > 0.3)) stickHeld = false;
    const dev = controls.joiner(samples);
    if (controls.onlinePressed(samples)) { startHosting(); begin(dev ?? 'kb1'); return; }
    if (dev) begin(dev);
    return;
  }
  if (world.result === 'playing' && controls.startPressed(samples)) togglePause();
  if (paused) { host?.snapshot(world); return; }
  if (!host && controls.onlinePressed(samples) && world.players.length < 2) startHosting();
  const remote = host?.input() ?? { input: NO_INPUT, start: false };

  if (host && host.status !== lastLinkStatus) {
    lastLinkStatus = host.status;
    const link = joinLink(host.code);
    if (host.status === 'waiting') showNet(`Online game <b>${host.code}</b> · send ${CAST[1].name} this link: <input id="netlink" readonly value="${link}"> <button id="netcopy">Copy</button>`);
    if (host.status === 'connected') {
      showNet(`${CAST[1].name} is connected online · game <b>${host.code}</b>`);
      if (world.players.length < 2) addPlayer(world);
    }
    if (host.status === 'closed') { showNet(`${CAST[1].name} disconnected`); say(`${CAST[1].name} LEFT`, 90); }
    if (host.status === 'error') showNet(`Online play failed: ${host.error}. Reload and press O to try again.`);
    document.getElementById('netcopy')?.addEventListener('click', () => {
      const field = document.getElementById('netlink') as HTMLInputElement;
      navigator.clipboard?.writeText(field.value).catch(() => field.select());
    });
  }
  const online = host?.status === 'connected';

  // A second local device joins as player 2, unless George is playing online.
  if (!host && world.players.length < CAST.length && world.result === 'playing') {
    const dev = controls.joiner(samples);
    if (dev) { controls.slots.push(dev); addPlayer(world); }
  }
  if (world.result !== 'playing' && (controls.startPressed(samples) || remote.start)) { restart(); return; }
  const inputs = world.players.map((_, i) => i === 1 && online ? remote.input : controls.inputFor(i, samples));
  step(world, inputs);
  renderer.events(world.events);
  react(world.events, world);
  finisher(world.events, world);
  watch(world);
  host?.queue(world.events);
  if (world.frame % 2 === 0) host?.snapshot(world);
  showResult(world);
}

let stickHeld = false;

function begin(dev: Parameters<typeof controls.slots.push>[0]) {
  controls.slots = [dev];
  started = true;
  unlockAudio();
  hideTitle();
  say('');
  playMusic('fight');
}

function restart() {
  const online = host?.status === 'connected';
  world = createWorld(Date.now(), online ? 2 : Math.max(1, controls.slots.length), settings.difficulty);
  renderer.clear();
  playMusic('fight');
  lastResult = '';
  hideResults();
  say('');
  host?.snapshot(world);
}

function tick() {
  clock++;
  if (guest) guestTick(); else hostTick();
  if (!paused) renderer.update(world);
  if (clock >= bannerUntil) say('');
}

const DT = 1000 / T.fps;
let acc = 0, last = performance.now();
let qualityCheckedAt = 0;
function frame(now: number) {
  // Slow motion: the simulation runs at a quarter speed for the finisher.
  acc += Math.min(100, now - last) * (now < slowUntil ? slowScale : 1);
  last = now;
  // Automatic quality: if the frame rate sags during a fight, drop shadows, then resolution.
  if (fps.tick(settings.fps) && started && settings.quality === 'auto' && fps.value < 48 && now - qualityCheckedAt > 3000 && renderer.quality < 2) {
    qualityCheckedAt = now;
    renderer.setQuality(renderer.quality + 1);
  }
  if (started && world.result === 'playing' && !paused) tips(world, controls.isPad(0));
  // A little slack stops vsync jitter from alternating zero- and two-tick frames at 60 Hz.
  while (acc >= DT - 1) { tick(); acc -= DT; }
  acc = Math.max(0, acc);
  bars.forEach((bar, i) => {
    const p = world.players[i];
    bar.classList.toggle('waiting', !p);
    bar.querySelector<HTMLElement>('i')!.style.width = p ? `${(p.hp / T.player.hp) * 100}%` : '0%';
    const waiting = host ? (host.status === 'connected' ? '' : 'waiting for the online link') : 'press any button to join · O to play online';
    const combo = p && p.hits >= 3 && world.frame - p.lastHitAt < 90 ? `${p.hits} HITS` : '';
    bar.querySelector('small')!.textContent = !started ? '' : !p ? waiting : p.state === 'down' ? 'DOWN' : combo;
  });
  hint.textContent = controls.isPad(0)
    ? 'X attack · Y counter · A dodge · B bottle'
    : guest
      ? 'WASD or arrows to move · J attack · K counter · Space dodge · E bottle'
      : 'P1: WASD · J attack · K counter · Space dodge · E bottle  |  P2: arrows · numpad 1 attack · 2 counter · 0 dodge · 3 bottle';
  renderer.draw(world, Math.min(1, acc / DT));
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// For automated checks and console tinkering.
(window as unknown as { game: object }).game = {
  get world() { return world; }, T, controls, renderer, get paused() { return paused; },
  get net() { return host ? { role: 'host', code: host.code, status: host.status } : guest ? { role: 'guest', status: guest.status, snaps: guest.snaps.length } : null; },
};
