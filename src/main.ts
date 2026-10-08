import './style.css';
import { createWorld, step, World } from './sim/world';
import { TUNING as T } from './sim/tuning';
import { Controls } from './input';
import { Renderer } from './render';
import { sfx, unlockAudio } from './audio';

const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const overlay = document.querySelector<HTMLElement>('#overlay')!;
const banner = document.querySelector<HTMLElement>('#banner')!;
const hp = document.querySelector<HTMLElement>('#hp i')!;
const hint = document.querySelector<HTMLElement>('#hint')!;

const controls = new Controls();
const renderer = new Renderer(canvas, overlay);
let world: World = createWorld(Date.now());
let started = false;
let bannerUntil = 0;

addEventListener('pointerdown', unlockAudio);
addEventListener('keydown', unlockAudio);

function say(text: string, frames = 0) {
  banner.innerHTML = text;
  banner.style.opacity = text ? '1' : '0';
  bannerUntil = frames ? world.frame + frames : Infinity;
}
say('LAST CALL<small>click the game, then press Start / Enter</small>');

function tick() {
  const input = controls.sample();
  const anyPress = controls.start || input.attack || input.counter || input.dodge || input.grab;
  if (!started) {
    if (anyPress) { started = true; unlockAudio(); say(''); }
    return;
  }
  if (world.result !== 'playing' && controls.start) {
    world = createWorld(Date.now());
    renderer.clear();
    say('');
    return;
  }
  step(world, input);
  renderer.events(world.events);
  for (const ev of world.events) {
    if (ev.type === 'hit') { sfx.hit(ev.heavy); controls.rumble(ev.heavy ? 0.7 : 0.3, 0.5, ev.heavy ? 120 : 60); }
    if (ev.type === 'counter') { sfx.counter(); controls.rumble(1, 0.6, 140); }
    if (ev.type === 'playerHit') { sfx.hurt(); controls.rumble(1, 1, 200); }
    if (ev.type === 'whiff') sfx.whiff();
    if (ev.type === 'dodge') sfx.dodge();
    if (ev.type === 'shatter') sfx.shatter();
    if (ev.type === 'wave') say(ev.n === T.waves.length - 1 ? 'FINAL ROUND' : `ROUND ${ev.n + 1}`, 90);
  }
  if (world.result === 'win') say('LAST CALL<small>bar cleared · Start / Enter to go again</small>');
  if (world.result === 'lose') say('KNOCKED OUT<small>Start / Enter to try again</small>');
  if (world.frame >= bannerUntil) say('');
}

const DT = 1000 / T.fps;
let acc = 0, last = performance.now();
function frame(now: number) {
  acc += Math.min(100, now - last);
  last = now;
  while (acc >= DT) { tick(); acc -= DT; }
  hp.style.width = `${(world.player.hp / T.player.hp) * 100}%`;
  hint.textContent = controls.lastDevice === 'pad'
    ? 'X attack · Y counter · A dodge · B grab / throw'
    : 'WASD move · J attack · K counter · Space dodge · E grab / throw';
  renderer.draw(world);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// For automated checks and console tinkering.
(window as unknown as { game: object }).game = { get world() { return world; }, T };
