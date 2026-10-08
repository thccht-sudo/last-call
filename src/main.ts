import './style.css';
import { createWorld, step, addPlayer, World } from './sim/world';
import { TUNING as T } from './sim/tuning';
import { Controls } from './input';
import { Renderer, CAST } from './render';
import { sfx, unlockAudio } from './audio';
import { playMusic, toggleMute } from './music';

const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const overlay = document.querySelector<HTMLElement>('#overlay')!;
const banner = document.querySelector<HTMLElement>('#banner')!;
const hud = document.querySelector<HTMLElement>('#hud')!;
const hint = document.querySelector<HTMLElement>('#hint')!;

const controls = new Controls();
const renderer = new Renderer(canvas, overlay);
let world: World = createWorld(Date.now());
let started = false;
let bannerUntil = 0;

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
  bannerUntil = frames ? world.frame + frames : Infinity;
}
say('LAST CALL<small>click the game, then press Start / Enter · M mutes music</small>');

function tick() {
  const samples = controls.poll();
  if (!started) {
    const dev = controls.joiner(samples);
    if (dev) { controls.slots = [dev]; started = true; unlockAudio(); say(''); playMusic('fight'); }
    return;
  }
  // A second device pressing anything joins as player 2.
  if (world.players.length < CAST.length && world.result === 'playing') {
    const dev = controls.joiner(samples);
    if (dev) { controls.slots.push(dev); addPlayer(world); say(`${CAST[1].name} JOINS`, 75); }
  }
  if (world.result !== 'playing' && controls.startPressed(samples)) {
    world = createWorld(Date.now(), controls.slots.length);
    renderer.clear();
    playMusic('fight');
    say('');
    return;
  }
  step(world, world.players.map((_, i) => controls.inputFor(i, samples)));
  renderer.events(world.events);
  for (const ev of world.events) {
    if (ev.type === 'hit') { sfx.hit(ev.heavy); if (ev.by >= 0) controls.rumble(ev.by, ev.heavy ? 0.7 : 0.3, 0.5, ev.heavy ? 120 : 60); }
    if (ev.type === 'counter') { sfx.counter(); controls.rumble(ev.by, 1, 0.6, 140); }
    if (ev.type === 'tag') sfx.counter();
    if (ev.type === 'playerHit') { sfx.hurt(); controls.rumble(ev.player, 1, 1, 200); }
    if (ev.type === 'playerDown' && world.players.length > 1 && world.result === 'playing') say(`${CAST[ev.player].name} IS DOWN<small>stand next to them to help them up</small>`, 120);
    if (ev.type === 'revived') say(`${CAST[ev.player].name} IS BACK UP`, 60);
    if (ev.type === 'whiff') sfx.whiff();
    if (ev.type === 'dodge') sfx.dodge();
    if (ev.type === 'shatter') sfx.shatter();
    if (ev.type === 'wave') {
      const last = ev.n === T.waves.length - 1;
      say(last ? 'FINAL ROUND' : `ROUND ${ev.n + 1}`, 90);
      playMusic(last ? 'boss' : 'fight');
    }
  }
  if (world.result !== 'playing') playMusic('title');
  if (world.result === 'win') say("LAST CALL<small>Kilroy's is yours · Start / Enter to go again</small>");
  if (world.result === 'lose') say('KNOCKED OUT<small>Start / Enter to try again</small>');
  if (world.frame >= bannerUntil) say('');
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
    bar.querySelector('small')!.textContent = !started ? '' : !p ? 'press any button to join' : p.state === 'down' ? 'DOWN' : '';
  });
  hint.textContent = controls.isPad(0)
    ? 'X attack · Y counter · A dodge · B grab / throw'
    : 'P1: WASD · J attack · K counter · Space dodge · E bottle  |  P2: arrows · numpad 1 attack · 2 counter · 0 dodge · 3 bottle';
  renderer.draw(world);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// For automated checks and console tinkering.
(window as unknown as { game: object }).game = { get world() { return world; }, T, controls };
