// Deterministic fight simulation. No rendering, no clock: step() advances one 60 Hz frame.
import { TUNING as T, EnemyKind } from './tuning';

export interface Vec { x: number; y: number }

export interface Input {
  mx: number; my: number; // stick, -1..1, y down-screen
  attack: boolean; counter: boolean; dodge: boolean; grab: boolean; // pressed this frame
}
export const NO_INPUT: Input = { mx: 0, my: 0, attack: false, counter: false, dodge: false, grab: false };

type Action = 'attack' | 'counter' | 'dodge' | 'grab';

export type PlayerState = 'free' | 'attack' | 'counter' | 'whiff' | 'dodge' | 'hitstun' | 'dead';
export interface Player {
  pos: Vec; facing: Vec; hp: number;
  state: PlayerState; t: number; dur: number;
  combo: number; target: number | null; hasHit: boolean; chain: boolean;
  dodgeDir: Vec; holding: number | null; smash: boolean;
  buffer: { action: Action; frames: number } | null;
}

export type EnemyState = 'spawn' | 'circle' | 'approach' | 'windup' | 'active' | 'recover' | 'stun' | 'down' | 'getup' | 'dead';
export interface Enemy {
  id: number; kind: EnemyKind; pos: Vec; facing: Vec; vel: Vec; hp: number; maxHp: number;
  state: EnemyState; t: number; dur: number; cooldown: number; angle: number; orbit: number;
}

export interface Bottle { id: number; home: Vec; pos: Vec; vel: Vec; state: 'ground' | 'held' | 'flying' | 'broken'; t: number }

export type GameEvent =
  | { type: 'hit'; pos: Vec; heavy: boolean }
  | { type: 'counter'; pos: Vec }
  | { type: 'whiff' }
  | { type: 'playerHit'; pos: Vec; heavy: boolean }
  | { type: 'shatter'; pos: Vec }
  | { type: 'dodge' }
  | { type: 'wave'; n: number }
  | { type: 'ko'; pos: Vec };

export interface World {
  frame: number; hitstop: number; shake: number;
  player: Player; enemies: Enemy[]; bottles: Bottle[];
  wave: number; waveTimer: number; result: 'playing' | 'win' | 'lose';
  events: GameEvent[]; rng: number; nextId: number;
}

const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const len = (a: Vec) => Math.hypot(a.x, a.y);
const dist = (a: Vec, b: Vec) => len(sub(a, b));
const norm = (a: Vec): Vec => { const l = len(a); return l > 1e-6 ? { x: a.x / l, y: a.y / l } : { x: 0, y: 0 }; };
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;

function rand(w: World): number {
  w.rng = (w.rng * 1664525 + 1013904223) >>> 0;
  return w.rng / 4294967296;
}

export function createWorld(seed = 1): World {
  const w: World = {
    frame: 0, hitstop: 0, shake: 0,
    player: {
      pos: { x: 0, y: 2 }, facing: { x: 0, y: -1 }, hp: T.player.hp,
      state: 'free', t: 0, dur: 0, combo: 0, target: null, hasHit: false, chain: false,
      dodgeDir: { x: 0, y: 0 }, holding: null, smash: false, buffer: null,
    },
    enemies: [], bottles: [], wave: -1, waveTimer: 30, result: 'playing',
    events: [], rng: seed >>> 0 || 1, nextId: 1,
  };
  for (const home of [{ x: -6.5, y: -3.5 }, { x: 6.5, y: 3.5 }]) {
    w.bottles.push({ id: w.nextId++, home, pos: { ...home }, vel: { x: 0, y: 0 }, state: 'ground', t: 0 });
  }
  return w;
}

export function spawnEnemy(w: World, kind: EnemyKind, pos: Vec, state: EnemyState = 'spawn'): Enemy {
  const k = T[kind];
  const e: Enemy = {
    id: w.nextId++, kind, pos: { ...pos }, facing: { x: 0, y: 1 }, vel: { x: 0, y: 0 },
    hp: k.hp, maxHp: k.hp, state, t: 0, dur: state === 'spawn' ? 20 : 0,
    cooldown: 30 + Math.floor(rand(w) * 60), angle: rand(w) * Math.PI * 2, orbit: rand(w) < 0.5 ? -1 : 1,
  };
  w.enemies.push(e);
  return e;
}

const DOORS: Vec[] = [{ x: -9, y: -4 }, { x: 9, y: -4 }, { x: 0, y: -6 }, { x: -9, y: 4 }, { x: 9, y: 4 }];

function startWave(w: World, n: number) {
  w.wave = n;
  w.events.push({ type: 'wave', n });
  T.waves[n].enemies.forEach((kind, i) => {
    const e = spawnEnemy(w, kind, DOORS[i % DOORS.length]);
    e.dur = 20 + i * 25;
  });
}

const alive = (e: Enemy) => e.state !== 'dead';
const targetable = (e: Enemy) => alive(e) && e.state !== 'down' && e.state !== 'getup' && e.state !== 'spawn';

// Freeflow targeting: nearest enemy in the pushed direction, else in front.
export function pickTarget(w: World, dir: Vec, range: number): Enemy | null {
  const p = w.player;
  let best: Enemy | null = null, bestScore = Infinity;
  for (const e of w.enemies) {
    if (!targetable(e)) continue;
    const to = sub(e.pos, p.pos), d = len(to);
    if (d > range) continue;
    const facing = dot(dir, norm(to));
    if (facing < -0.1 && d > 1.6) continue;
    const score = d - 3 * facing;
    if (score < bestScore) { bestScore = score; best = e; }
  }
  return best;
}

function stickDir(input: Input, fallback: Vec): Vec {
  return Math.hypot(input.mx, input.my) > 0.3 ? norm({ x: input.mx, y: input.my }) : fallback;
}

function setPlayer(p: Player, state: PlayerState, dur: number) { p.state = state; p.t = 0; p.dur = dur; }
function setEnemy(e: Enemy, state: EnemyState, dur: number) { e.state = state; e.t = 0; e.dur = dur; }

const playerInvulnerable = (p: Player) =>
  p.state === 'counter' || p.state === 'dead' ||
  (p.state === 'dodge' && p.t >= T.dodge.invulnFrom && p.t <= T.dodge.invulnTo);

// Frames until this enemy's strike lands; null if it isn't winding up.
export function framesToStrike(e: Enemy): number | null {
  if (e.state === 'windup') return e.dur - e.t;
  if (e.state === 'active') return 0;
  return null;
}

export function counterable(w: World, e: Enemy): boolean {
  const f = framesToStrike(e);
  return f !== null && f <= T.counter.window && !T[e.kind].armored && dist(e.pos, w.player.pos) <= T.counter.range;
}

function damageEnemy(w: World, e: Enemy, dmg: number, from: Vec, knock: number, stun: number, knockdown: boolean) {
  e.hp -= dmg;
  const away = norm(sub(e.pos, from));
  e.vel = { x: away.x * knock * 0.06, y: away.y * knock * 0.06 };
  e.facing = { x: -away.x, y: -away.y };
  if (e.hp <= 0) {
    e.hp = 0;
    e.vel = { x: away.x * 0.3, y: away.y * 0.3 };
    setEnemy(e, 'dead', 0);
    w.events.push({ type: 'ko', pos: { ...e.pos } });
    return;
  }
  const armoredWindup = T[e.kind].armored && (e.state === 'windup' || e.state === 'active') && !knockdown;
  if (armoredWindup) return;
  if (knockdown) setEnemy(e, 'down', T.knockdownFrames);
  else setEnemy(e, 'stun', stun);
}

function tryAction(w: World, action: Action, input: Input): boolean {
  const p = w.player;
  const dir = stickDir(input, p.facing);
  if (action === 'dodge') {
    p.dodgeDir = dir; p.facing = dir;
    setPlayer(p, 'dodge', T.dodge.frames);
    w.events.push({ type: 'dodge' });
    return true;
  }
  if (action === 'counter') {
    let best: Enemy | null = null;
    for (const e of w.enemies) {
      if (counterable(w, e) && (!best || dist(e.pos, p.pos) < dist(best.pos, p.pos))) best = e;
    }
    if (!best) { setPlayer(p, 'whiff', T.counter.whiffFrames); w.events.push({ type: 'whiff' }); return true; }
    const to = norm(sub(best.pos, p.pos));
    p.facing = to;
    p.pos = { x: best.pos.x - to.x * T.strikeDistance, y: best.pos.y - to.y * T.strikeDistance };
    setPlayer(p, 'counter', T.counter.frames);
    damageEnemy(w, best, T.counter.damage, p.pos, 4, 0, true);
    w.hitstop = T.hitstop.counter; w.shake = 0.35;
    w.events.push({ type: 'counter', pos: { ...best.pos } });
    return true;
  }
  if (action === 'grab') {
    if (p.holding !== null) {
      const b = w.bottles.find(b => b.id === p.holding)!;
      const t = pickTarget(w, dir, T.bottle.throwRange);
      const aim = t ? norm(sub(t.pos, p.pos)) : dir;
      b.state = 'flying'; b.pos = { x: p.pos.x + aim.x * 0.6, y: p.pos.y + aim.y * 0.6 };
      b.vel = { x: aim.x * T.bottle.speed, y: aim.y * T.bottle.speed };
      p.holding = null; p.facing = aim;
      setPlayer(p, 'attack', 14); p.combo = 0; p.target = null; p.hasHit = true; p.smash = false;
      return true;
    }
    const b = w.bottles.find(b => b.state === 'ground' && dist(b.pos, p.pos) <= T.bottle.pickup);
    if (b) { b.state = 'held'; p.holding = b.id; return true; }
    return false;
  }
  // attack
  const t = pickTarget(w, dir, T.lungeRange);
  p.target = t ? t.id : null;
  if (t) p.facing = norm(sub(t.pos, p.pos)); else p.facing = dir;
  p.smash = p.holding !== null;
  const step = p.smash ? T.combo[2] : T.combo[p.combo];
  setPlayer(p, 'attack', step.startup + step.active + step.recovery);
  p.hasHit = false; p.chain = false;
  return true;
}

function canAct(p: Player): boolean {
  if (p.state === 'free') return true;
  if (p.state === 'attack' && p.hasHit && !p.smash) {
    const s = T.combo[p.combo];
    return p.t >= s.startup + s.active; // cancel recovery into anything
  }
  if (p.state === 'counter') return p.t >= T.counter.frames - 8;
  return false;
}

function stepPlayer(w: World, input: Input) {
  const p = w.player;
  p.t++;
  const pressed: Action | null = input.counter ? 'counter' : input.dodge ? 'dodge' : input.attack ? 'attack' : input.grab ? 'grab' : null;
  if (pressed) p.buffer = { action: pressed, frames: T.inputBuffer };
  else if (p.buffer && --p.buffer.frames <= 0) p.buffer = null;

  if (p.state === 'dead') return;

  if (p.buffer && canAct(p)) {
    const prev = p.state, prevCombo = p.combo, prevHit = p.hasHit;
    const action = p.buffer.action;
    if (action === 'attack' && prev === 'attack' && prevHit) p.combo = (prevCombo + 1) % T.combo.length;
    else if (action === 'attack') p.combo = 0;
    if (tryAction(w, action, input)) p.buffer = null;
  }

  switch (p.state) {
    case 'free': {
      const m = { x: input.mx, y: input.my };
      const mag = Math.min(1, len(m));
      if (mag > 0.15) {
        const d = norm(m);
        p.pos.x += d.x * mag * T.player.speed / T.fps;
        p.pos.y += d.y * mag * T.player.speed / T.fps;
        p.facing = d;
      }
      break;
    }
    case 'attack': {
      const s = p.smash ? T.combo[2] : T.combo[p.combo];
      const target = w.enemies.find(e => e.id === p.target && targetable(e));
      if (p.t <= s.startup && target) {
        const to = sub(target.pos, p.pos), d = len(to);
        const want = d - T.strikeDistance;
        if (want > 0) {
          const stepLen = Math.min(want, Math.max(want / Math.max(1, s.startup - p.t + 1), 0), T.maxLungeSpeed);
          const n = norm(to);
          p.pos.x += n.x * stepLen; p.pos.y += n.y * stepLen;
        }
        p.facing = norm(to);
      }
      if (!p.hasHit && p.t >= s.startup && p.t < s.startup + s.active) {
        let landed = false;
        for (const e of w.enemies) {
          if (!targetable(e)) continue;
          const to = sub(e.pos, p.pos), d = len(to);
          if (d > T.hitReach || (d > 0.4 && dot(norm(to), p.facing) < 0.3)) continue;
          if (p.smash) {
            damageEnemy(w, e, T.bottle.meleeDamage, p.pos, 5, 0, true);
          } else {
            damageEnemy(w, e, s.damage, p.pos, s.knock, s.stun, s.knockdown);
          }
          landed = true;
        }
        if (landed) {
          p.hasHit = true;
          const heavy = p.smash || s.knockdown;
          w.hitstop = heavy ? T.hitstop.heavy : T.hitstop.light;
          w.shake = heavy ? 0.3 : 0.12;
          w.events.push({ type: 'hit', pos: { x: p.pos.x + p.facing.x, y: p.pos.y + p.facing.y }, heavy });
          if (p.smash) breakHeldBottle(w);
        }
      }
      if (p.t >= p.dur) { if (p.smash) breakHeldBottle(w); setPlayer(p, 'free', 0); p.combo = 0; }
      break;
    }
    case 'dodge': {
      const per = T.dodge.distance / T.dodge.frames;
      const ease = 1.6 - (p.t / T.dodge.frames) * 1.2;
      p.pos.x += p.dodgeDir.x * per * ease; p.pos.y += p.dodgeDir.y * per * ease;
      if (p.t >= p.dur) setPlayer(p, 'free', 0);
      break;
    }
    case 'counter': case 'whiff': case 'hitstun':
      if (p.t >= p.dur) { setPlayer(p, 'free', 0); p.combo = 0; }
      break;
  }
}

function breakHeldBottle(w: World) {
  const p = w.player;
  const b = w.bottles.find(b => b.id === p.holding);
  if (!b) return;
  b.state = 'broken'; b.t = 0; b.pos = { x: p.pos.x + p.facing.x, y: p.pos.y + p.facing.y };
  p.holding = null; p.smash = false;
  w.events.push({ type: 'shatter', pos: { ...b.pos } });
}

function hitPlayer(w: World, e: Enemy) {
  const p = w.player;
  const k = T[e.kind];
  p.hp -= k.damage;
  const away = norm(sub(p.pos, e.pos));
  p.pos.x += away.x * 0.5; p.pos.y += away.y * 0.5;
  if (p.holding !== null) {
    const b = w.bottles.find(b => b.id === p.holding)!;
    b.state = 'ground'; b.pos = { x: p.pos.x - away.x * 0.8, y: p.pos.y - away.y * 0.8 }; p.holding = null;
  }
  w.hitstop = T[e.kind].armored ? T.hitstop.heavy : T.hitstop.light;
  w.shake = 0.3;
  w.events.push({ type: 'playerHit', pos: { ...p.pos }, heavy: k.armored });
  if (p.hp <= 0) { p.hp = 0; setPlayer(p, 'dead', 0); w.result = 'lose'; }
  else { setPlayer(p, 'hitstun', 20); p.combo = 0; }
}

function attackersBusy(w: World) {
  return w.enemies.filter(e => e.state === 'approach' || e.state === 'windup' || e.state === 'active').length;
}

function stepEnemies(w: World) {
  const p = w.player;
  const maxAttackers = w.wave >= 0 ? T.waves[w.wave].maxAttackers : 1;
  // Attack tokens: only a few enemies commit at once, the rest circle.
  if (attackersBusy(w) < maxAttackers && p.state !== 'dead') {
    let pick: Enemy | null = null;
    for (const e of w.enemies) {
      if (e.state === 'circle' && e.cooldown <= 0 && (!pick || dist(e.pos, p.pos) < dist(pick.pos, p.pos))) pick = e;
    }
    if (pick) setEnemy(pick, 'approach', 180);
  }

  for (const e of w.enemies) {
    const k = T[e.kind];
    e.t++;
    if (e.cooldown > 0) e.cooldown--;
    e.pos.x += e.vel.x; e.pos.y += e.vel.y;
    e.vel.x *= 0.82; e.vel.y *= 0.82;
    const to = sub(p.pos, e.pos), d = len(to), toN = norm(to);
    const move = (target: Vec, speed: number) => {
      const v = sub(target, e.pos), l = len(v);
      if (l < 0.05) return;
      const s = Math.min(l, speed / T.fps);
      e.pos.x += v.x / l * s; e.pos.y += v.y / l * s;
    };
    switch (e.state) {
      case 'spawn':
        move({ x: e.pos.x * 0.6, y: e.pos.y * 0.6 }, k.speed);
        if (e.t >= e.dur) setEnemy(e, 'circle', 0);
        break;
      case 'circle': {
        e.angle += e.orbit * 0.006;
        const want = { x: p.pos.x + Math.cos(e.angle) * k.circleRadius, y: p.pos.y + Math.sin(e.angle) * k.circleRadius };
        move(want, k.speed * 0.6);
        e.facing = toN;
        break;
      }
      case 'approach':
        e.facing = toN;
        if (d <= k.attackRange) { setEnemy(e, 'windup', k.windup); break; }
        move(p.pos, k.speed);
        if (e.t >= e.dur) { setEnemy(e, 'circle', 0); e.cooldown = k.cooldown; }
        break;
      case 'windup':
        if (e.dur - e.t > k.trackUntil) {
          e.facing = toN;
          if (d > k.attackRange * 0.9) move(p.pos, k.speed * 0.5);
        }
        if (e.t >= e.dur) setEnemy(e, 'active', k.active);
        break;
      case 'active':
        if (e.t === 1 && !playerInvulnerable(p) && d <= k.attackRange + 0.35 && dot(e.facing, toN) > 0.5) hitPlayer(w, e);
        if (e.t >= e.dur) setEnemy(e, 'recover', k.recovery);
        break;
      case 'recover':
        if (e.t >= e.dur) { setEnemy(e, 'circle', 0); e.cooldown = k.cooldown + Math.floor(rand(w) * 40); }
        break;
      case 'stun':
        if (e.t >= e.dur) { setEnemy(e, 'circle', 0); e.cooldown = Math.max(e.cooldown, 20); }
        break;
      case 'down':
        if (e.t >= e.dur) setEnemy(e, 'getup', T.getupFrames);
        break;
      case 'getup':
        if (e.t >= e.dur) { setEnemy(e, 'circle', 0); e.cooldown = k.cooldown; }
        break;
    }
  }
}

function stepBottles(w: World) {
  for (const b of w.bottles) {
    if (b.state === 'flying') {
      b.pos.x += b.vel.x; b.pos.y += b.vel.y;
      const hit = w.enemies.find(e => alive(e) && e.state !== 'down' && dist(e.pos, b.pos) < 0.7);
      if (hit) {
        damageEnemy(w, hit, T.bottle.damage, { x: b.pos.x - b.vel.x * 5, y: b.pos.y - b.vel.y * 5 }, 5, 0, true);
        w.hitstop = T.hitstop.bottle; w.shake = 0.25;
        w.events.push({ type: 'hit', pos: { ...b.pos }, heavy: true });
      }
      if (hit || Math.abs(b.pos.x) > T.arena.w / 2 || Math.abs(b.pos.y) > T.arena.h / 2) {
        b.state = 'broken'; b.t = 0;
        w.events.push({ type: 'shatter', pos: { ...b.pos } });
      }
    } else if (b.state === 'broken') {
      if (++b.t >= T.bottle.respawn) { b.state = 'ground'; b.pos = { ...b.home }; }
    } else if (b.state === 'held') {
      const p = w.player;
      b.pos = { x: p.pos.x, y: p.pos.y };
    }
  }
}

function separate(w: World) {
  const bodies: { pos: Vec; r: number; fixed: boolean }[] = [
    { pos: w.player.pos, r: T.player.radius, fixed: w.player.state === 'counter' },
    ...w.enemies.filter(e => alive(e) && e.state !== 'down').map(e => ({ pos: e.pos, r: T[e.kind].radius, fixed: false })),
  ];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i], b = bodies[j];
      const v = sub(b.pos, a.pos), d = len(v), min = a.r + b.r;
      if (d >= min || d < 1e-6) continue;
      const push = (min - d) / 2, n = { x: v.x / d, y: v.y / d };
      const fa = a.fixed ? 0 : b.fixed ? 2 : 1, fb = b.fixed ? 0 : a.fixed ? 2 : 1;
      a.pos.x -= n.x * push * fa; a.pos.y -= n.y * push * fa;
      b.pos.x += n.x * push * fb; b.pos.y += n.y * push * fb;
    }
  }
  const hw = T.arena.w / 2 - 0.5, hh = T.arena.h / 2 - 0.5;
  for (const b of [w.player.pos, ...w.enemies.filter(e => e.state !== 'spawn').map(e => e.pos)]) {
    b.x = Math.max(-hw, Math.min(hw, b.x));
    b.y = Math.max(-hh, Math.min(hh, b.y));
  }
}

export function step(w: World, input: Input): World {
  w.events = [];
  w.frame++;
  w.shake *= 0.85;
  if (w.hitstop > 0) {
    w.hitstop--;
    // Keep presses made during hitstop so combos stay responsive.
    const p = w.player;
    const pressed: Action | null = input.counter ? 'counter' : input.dodge ? 'dodge' : input.attack ? 'attack' : input.grab ? 'grab' : null;
    if (pressed) p.buffer = { action: pressed, frames: T.inputBuffer };
    return w;
  }
  if (w.result !== 'playing') return w;
  stepPlayer(w, input);
  stepEnemies(w);
  stepBottles(w);
  separate(w);

  if (w.enemies.every(e => !alive(e))) {
    if (w.waveTimer > 0) w.waveTimer--;
    else if (w.wave + 1 < T.waves.length) { startWave(w, w.wave + 1); w.waveTimer = T.waveDelay; }
    else w.result = 'win';
  }
  return w;
}
