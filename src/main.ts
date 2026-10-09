import './style.css';
import { createWorld, step, addPlayer, World, GameEvent, NO_INPUT } from './sim/world';
import { TUNING as T } from './sim/tuning';
import { Controls } from './input';
import { Renderer, CAST } from './render';
import { sfx, unlockAudio } from './audio';
import { playMusic, toggleMute } from './music';
import { Host, Guest, roomFromUrl, joinLink, interpolated } from './net';

const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const overlay = document.querySelector<HTMLElement>('#overlay')!;
const banner = document.querySelector<HTMLElement>('#banner')!;
const hud = document.querySelector<HTMLElement>('#hud')!;
const hint = document.querySelector<HTMLElement>('#hint')!;
const netPanel = document.querySelector<HTMLElement>('#net')!;

const controls = new Controls();
const renderer = new Renderer(canvas, overlay);
let world: World = createWorld(Date.now());
let started = false;
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
});

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
say(guest
  ? `JOINING ${guest.code}<small>connecting to ${CAST[0].name}'s game…</small>`
  : 'LAST CALL<small>click the game, then press Start / Enter · O (or Select) plays online · M mutes music</small>');

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
  for (const ev of events) {
    if (ev.type === 'hit') { sfx.hit(ev.heavy); if (ev.by >= 0) rumble(ev.by, ev.heavy ? 0.7 : 0.3, 0.5, ev.heavy ? 120 : 60); }
    if (ev.type === 'counter') { sfx.counter(); rumble(ev.by, 1, 0.6, 140); }
    if (ev.type === 'tag') sfx.counter();
    if (ev.type === 'slam') { sfx.hit(true); rumble(0, 0.8, 0.8, 150); rumble(1, 0.8, 0.8, 150); }
    if (ev.type === 'deflect') { sfx.counter(); rumble(ev.by, 0.6, 0.6, 100); }
    if (ev.type === 'throw') sfx.whiff();
    if (ev.type === 'grabbed') { sfx.hurt(); rumble(ev.player, 0.5, 1, 300); }
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
  if (w.result !== 'playing') playMusic('title');
  if (w.result === 'win') say("LAST CALL<small>Kilroy's is yours · Start / Enter to go again</small>");
  if (w.result === 'lose') say('KNOCKED OUT<small>Start / Enter to try again</small>');
}

function guestTick() {
  const g = guest!;
  const samples = controls.poll();
  if (!controls.slots.length) { const dev = controls.joiner(samples); if (dev) controls.slots = [dev]; }
  g.sendInput(controls.inputFor(0, samples), controls.startPressed(samples));
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
    react(g.takeEvents(), w);
    showResult(w);
  }
}

function hostTick() {
  const samples = controls.poll();
  if (!started) {
    const dev = controls.joiner(samples);
    if (controls.onlinePressed(samples)) { startHosting(); started = true; controls.slots = [dev ?? 'kb1']; say(''); playMusic('fight'); return; }
    if (dev) { controls.slots = [dev]; started = true; unlockAudio(); say(''); playMusic('fight'); }
    return;
  }
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
  if (world.result !== 'playing' && (controls.startPressed(samples) || remote.start)) {
    world = createWorld(Date.now(), online ? 2 : controls.slots.length);
    renderer.clear();
    playMusic('fight');
    lastResult = '';
    say('');
    host?.snapshot(world);
    return;
  }
  const inputs = world.players.map((_, i) => i === 1 && online ? remote.input : controls.inputFor(i, samples));
  step(world, inputs);
  renderer.events(world.events);
  react(world.events, world);
  host?.queue(world.events);
  if (world.frame % 2 === 0) host?.snapshot(world);
  showResult(world);
}

function tick() {
  clock++;
  if (guest) guestTick(); else hostTick();
  if (clock >= bannerUntil) say('');
}

const DT = 1000 / T.fps;
let acc = 0, last = performance.now();
function frame(now: number) {
  acc += Math.min(100, now - last);
  last = now;
  while (acc >= DT) { tick(); acc -= DT; }
  bars.forEach((bar, i) => {
    const p = world.players[i];
    bar.classList.toggle('waiting', !p);
    bar.querySelector<HTMLElement>('i')!.style.width = p ? `${(p.hp / T.player.hp) * 100}%` : '0%';
    const waiting = host ? (host.status === 'connected' ? '' : 'waiting for the online link') : 'press any button to join · O to play online';
    bar.querySelector('small')!.textContent = !started ? '' : !p ? waiting : p.state === 'down' ? 'DOWN' : '';
  });
  hint.textContent = controls.isPad(0)
    ? 'X attack · Y counter · A dodge · B grab / throw'
    : guest
      ? 'WASD or arrows to move · J attack · K counter · Space dodge · E bottle'
      : 'P1: WASD · J attack · K counter · Space dodge · E bottle  |  P2: arrows · numpad 1 attack · 2 counter · 0 dodge · 3 bottle';
  renderer.draw(world);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// For automated checks and console tinkering.
(window as unknown as { game: object }).game = {
  get world() { return world; }, T, controls,
  get net() { return host ? { role: 'host', code: host.code, status: host.status } : guest ? { role: 'guest', status: guest.status, snaps: guest.snaps.length } : null; },
};
