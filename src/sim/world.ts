// Deterministic fight simulation. No rendering, no clock: step() advances one 60 Hz frame.
import { TUNING as T, EnemyKind } from './tuning';
import { LEVEL, steer, collide, insideObstacle, clearLine } from './level';

export interface Vec { x: number; y: number }

export interface Input {
  mx: number; my: number; // stick, -1..1, y down-screen
  attack: boolean; counter: boolean; dodge: boolean; grab: boolean; // pressed this frame
}
export const NO_INPUT: Input = { mx: 0, my: 0, attack: false, counter: false, dodge: false, grab: false };

type Action = 'attack' | 'counter' | 'dodge' | 'grab';

export type PlayerState = 'free' | 'attack' | 'counter' | 'whiff' | 'dodge' | 'hitstun' | 'grabbed' | 'down';
export interface Player {
  index: number; revive: number; // frames a partner has spent reviving this player
  pos: Vec; facing: Vec; hp: number;
  state: PlayerState; t: number; dur: number;
  combo: number; target: number | null; hasHit: boolean; chain: boolean;
  dodgeDir: Vec; holding: number | null; smash: boolean;
  escape: number; // attack presses while grabbed
  buffer: { action: Action; frames: number } | null;
}

export type EnemyState = 'spawn' | 'circle' | 'approach' | 'windup' | 'active' | 'recover' | 'holding' | 'stun' | 'down' | 'getup' | 'dead';
export interface Enemy {
  id: number; kind: EnemyKind; pos: Vec; facing: Vec; vel: Vec; hp: number; maxHp: number;
  state: EnemyState; t: number; dur: number; cooldown: number; angle: number; orbit: number; entry: Vec;
  focus: number; lastHitBy: number; lastHitFrame: number;
  unblockable: boolean; // the current swing can't be countered
  string: number; // boss: position in the swing, swing, haymaker string
  enraged: boolean; slammed: boolean;
}

export interface Bottle { id: number; home: Vec; pos: Vec; vel: Vec; state: 'ground' | 'held' | 'flying' | 'broken'; t: number; holder: number }

// A thrown red cup. owner -1 is an enemy throw; a deflected cup belongs to the player who countered it.
export interface Cup { id: number; pos: Vec; vel: Vec; owner: number; from: number }

export type GameEvent =
  | { type: 'hit'; pos: Vec; heavy: boolean; by: number }
  | { type: 'tag'; pos: Vec }
  | { type: 'slam'; pos: Vec }
  | { type: 'counter'; pos: Vec; by: number }
  | { type: 'deflect'; pos: Vec; by: number }
  | { type: 'whiff'; by: number }
  | { type: 'playerHit'; pos: Vec; heavy: boolean; player: number }
  | { type: 'grabbed'; player: number }
  | { type: 'escaped'; player: number }
  | { type: 'playerDown'; player: number }
  | { type: 'revived'; player: number }
  | { type: 'joined'; player: number }
  | { type: 'enrage'; pos: Vec }
  | { type: 'throw'; pos: Vec }
  | { type: 'shatter'; pos: Vec }
  | { type: 'dodge'; by: number }
  | { type: 'wave'; n: number }
  | { type: 'ko'; pos: Vec; boss: boolean };

export interface World {
  frame: number; hitstop: number; shake: number;
  players: Player[]; enemies: Enemy[]; bottles: Bottle[]; cups: Cup[];
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

function newPlayer(index: number, pos: Vec): Player {
  return {
    index, revive: 0, pos: { ...pos }, facing: { x: 0, y: -1 }, hp: T.player.hp,
    state: 'free', t: 0, dur: 0, combo: 0, target: null, hasHit: false, chain: false,
    dodgeDir: { x: 0, y: 0 }, holding: null, smash: false, escape: 0, buffer: null,
  };
}

// Drop player 2 in beside player 1, mid-fight if need be.
export function addPlayer(w: World): Player {
  const p1 = w.players[0];
  const p = newPlayer(w.players.length, { x: p1.pos.x + 1.2, y: p1.pos.y });
  collide(p.pos, T.player.radius);
  w.players.push(p);
  w.events.push({ type: 'joined', player: p.index });
  return p;
}

export function createWorld(seed = 1, playerCount = 1): World {
  const w: World = {
    frame: 0, hitstop: 0, shake: 0,
    players: [newPlayer(0, LEVEL.playerStart)],
    enemies: [], bottles: [], cups: [], wave: -1, waveTimer: 30, result: 'playing',
    events: [], rng: seed >>> 0 || 1, nextId: 1,
  };
  for (const home of LEVEL.bottleSpots) {
    w.bottles.push({ id: w.nextId++, home, pos: { ...home }, vel: { x: 0, y: 0 }, state: 'ground', t: 0, holder: -1 });
  }
  while (w.players.length < playerCount) addPlayer(w);
  w.events = [];
  return w;
}

export function spawnEnemy(w: World, kind: EnemyKind, pos: Vec, state: EnemyState = 'spawn', entry: Vec = pos): Enemy {
  const k = T[kind];
  const e: Enemy = {
    id: w.nextId++, kind, pos: { ...pos }, facing: { x: 0, y: 1 }, vel: { x: 0, y: 0 },
    hp: k.hp, maxHp: k.hp, state, t: 0, dur: state === 'spawn' ? 20 : 0,
    cooldown: 30 + Math.floor(rand(w) * 60), angle: rand(w) * Math.PI * 2, orbit: rand(w) < 0.5 ? -1 : 1, entry: { ...entry },
    focus: 0, lastHitBy: -1, lastHitFrame: -999, unblockable: false, string: 0, enraged: false, slammed: false,
  };
  w.enemies.push(e);
  return e;
}

function startWave(w: World, n: number) {
  w.wave = n;
  w.events.push({ type: 'wave', n });
  const extra = Array.from({ length: (w.players.length - 1) * T.coop.extraPerWave }, () => 'thug' as const);
  [...T.waves[n].enemies, ...extra].forEach((kind, i) => {
    const s = LEVEL.spawns[i % LEVEL.spawns.length];
    const e = spawnEnemy(w, kind, s.from, 'spawn', s.to);
    e.dur = 20 + i * 25;
  });
}

const alive = (e: Enemy) => e.state !== 'dead';
const targetable = (e: Enemy) => alive(e) && e.state !== 'down' && e.state !== 'getup' && e.state !== 'spawn';

// Freeflow targeting: nearest enemy in the pushed direction, else in front.
export function pickTarget(w: World, p: Player, dir: Vec, range: number): Enemy | null {
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
  p.state === 'counter' || p.state === 'down' ||
  (p.state === 'dodge' && p.t >= T.dodge.invulnFrom && p.t <= T.dodge.invulnTo);

export const standing = (p: Player) => p.state !== 'down';

// Frames until this enemy's strike lands; null if it isn't winding up.
export function framesToStrike(e: Enemy): number | null {
  if (e.state === 'windup') return e.dur - e.t;
  if (e.state === 'active') return 0;
  return null;
}

// Any player in range can counter, including to save a partner. Throwers are countered by
// knocking their cup back, not in melee.
export function counterable(p: Player, e: Enemy): boolean {
  const f = framesToStrike(e);
  return f !== null && f <= T.counter.window && !e.unblockable && e.kind !== 'thrower' &&
    standing(p) && p.state !== 'grabbed' && dist(e.pos, p.pos) <= T.counter.range;
}

// An incoming enemy cup this player can knock back.
export function deflectable(p: Player, c: Cup): boolean {
  if (c.owner !== -1 || !standing(p) || p.state === 'grabbed') return false;
  const to = sub(p.pos, c.pos);
  return len(to) <= T.cup.deflectRange && dot(norm(to), norm(c.vel)) > 0.3;
}

// The boss shrugs off light hits; heavies and grapplers only while swinging.
function hasArmour(e: Enemy) {
  return e.kind === 'boss' || (e.unblockable && (e.state === 'windup' || e.state === 'active'));
}

function heldBy(w: World, e: Enemy): Player | undefined {
  return e.state === 'holding' ? w.players.find(p => p.index === e.focus && p.state === 'grabbed') : undefined;
}

function damageEnemy(w: World, e: Enemy, dmg: number, from: Vec, knock: number, stun: number, knockdown: boolean, by = -1, force = false) {
  // Tag team: hitting an enemy your partner just hit lands harder.
  if (by >= 0 && e.lastHitBy >= 0 && e.lastHitBy !== by && w.frame - e.lastHitFrame <= T.coop.tagWindow) {
    dmg = Math.round(dmg * T.coop.tagMultiplier);
    w.events.push({ type: 'tag', pos: { ...e.pos } });
  }
  if (by >= 0) { e.lastHitBy = by; e.lastHitFrame = w.frame; }
  e.hp -= dmg;
  const away = norm(sub(e.pos, from));
  const armour = hasArmour(e) && !force;
  const knockScale = armour ? 0.3 : 1;
  e.vel = { x: away.x * knock * 0.06 * knockScale, y: away.y * knock * 0.06 * knockScale };
  if (!armour) e.facing = { x: -away.x, y: -away.y };
  // Hitting a grappler makes him let go.
  const held = heldBy(w, e);
  if (held) { setPlayer(held, 'free', 0); held.escape = 0; w.events.push({ type: 'escaped', player: held.index }); }
  if (e.hp <= 0) {
    e.hp = 0;
    e.vel = { x: away.x * 0.3, y: away.y * 0.3 };
    setEnemy(e, 'dead', 0);
    w.events.push({ type: 'ko', pos: { ...e.pos }, boss: e.kind === 'boss' });
    return;
  }
  if (e.kind === 'boss' && !e.enraged && e.hp <= e.maxHp * T.bossEnrage) enrage(w, e);
  if (armour && !held) return;
  e.string = 0;
  if (knockdown) { e.slammed = false; setEnemy(e, 'down', e.kind === 'boss' ? T.knockdownFrames - 20 : T.knockdownFrames); }
  else setEnemy(e, 'stun', stun || T[e.kind].stun);
}

function enrage(w: World, e: Enemy) {
  e.enraged = true;
  w.events.push({ type: 'enrage', pos: { ...e.pos } });
  w.shake = 0.5;
  for (let i = 0; i < 2; i++) {
    const s = LEVEL.spawns[1 + i];
    const add = spawnEnemy(w, 'thug', s.from, 'spawn', s.to);
    add.dur = 20 + i * 30;
  }
}

function tryAction(w: World, p: Player, action: Action, input: Input): boolean {
  const dir = stickDir(input, p.facing);
  if (action === 'dodge') {
    p.dodgeDir = dir; p.facing = dir;
    setPlayer(p, 'dodge', T.dodge.frames);
    w.events.push({ type: 'dodge', by: p.index });
    return true;
  }
  if (action === 'counter') {
    // Knock an incoming cup back at whoever threw it.
    const cup = w.cups.filter(c => deflectable(p, c)).sort((a, b) => dist(a.pos, p.pos) - dist(b.pos, p.pos))[0];
    if (cup) {
      const thrower = w.enemies.find(e => e.id === cup.from && targetable(e));
      const n = thrower ? norm(sub(thrower.pos, cup.pos)) : norm({ x: -cup.vel.x, y: -cup.vel.y });
      cup.vel = { x: n.x * T.cup.deflectSpeed, y: n.y * T.cup.deflectSpeed };
      cup.owner = p.index;
      p.facing = n;
      setPlayer(p, 'counter', T.counter.frames - 8);
      w.hitstop = T.hitstop.light; w.shake = 0.15;
      w.events.push({ type: 'deflect', pos: { ...cup.pos }, by: p.index });
      return true;
    }
    let best: Enemy | null = null;
    for (const e of w.enemies) {
      if (counterable(p, e) && (!best || dist(e.pos, p.pos) < dist(best.pos, p.pos))) best = e;
    }
    if (!best) { setPlayer(p, 'whiff', T.counter.whiffFrames); w.events.push({ type: 'whiff', by: p.index }); return true; }
    const to = norm(sub(best.pos, p.pos));
    p.facing = to;
    p.pos = { x: best.pos.x - to.x * T.strikeDistance, y: best.pos.y - to.y * T.strikeDistance };
    setPlayer(p, 'counter', T.counter.frames);
    damageEnemy(w, best, T.counter.damage, p.pos, 4, 0, true, p.index, true);
    w.hitstop = T.hitstop.counter; w.shake = 0.35;
    w.events.push({ type: 'counter', pos: { ...best.pos }, by: p.index });
    return true;
  }
  if (action === 'grab') {
    if (p.holding !== null) {
      const b = w.bottles.find(b => b.id === p.holding)!;
      const t = pickTarget(w, p, dir, T.bottle.throwRange);
      const aim = t ? norm(sub(t.pos, p.pos)) : dir;
      b.state = 'flying'; b.pos = { x: p.pos.x + aim.x * 0.6, y: p.pos.y + aim.y * 0.6 };
      b.vel = { x: aim.x * T.bottle.speed, y: aim.y * T.bottle.speed }; b.holder = p.index;
      p.holding = null; p.facing = aim;
      setPlayer(p, 'attack', 14); p.combo = 0; p.target = null; p.hasHit = true; p.smash = false;
      return true;
    }
    const b = w.bottles.find(b => b.state === 'ground' && dist(b.pos, p.pos) <= T.bottle.pickup);
    if (b) { b.state = 'held'; b.holder = p.index; p.holding = b.id; return true; }
    return false;
  }
  // attack
  const t = pickTarget(w, p, dir, T.lungeRange);
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
  if (p.state === 'counter') return p.t >= p.dur - 8;
  return false;
}

function stepPlayer(w: World, p: Player, input: Input) {
  p.t++;
  const pressed: Action | null = input.counter ? 'counter' : input.dodge ? 'dodge' : input.attack ? 'attack' : input.grab ? 'grab' : null;

  if (p.state === 'down') {
    const helper = w.players.find(o => o !== p && standing(o) && o.state !== 'grabbed' && dist(o.pos, p.pos) <= T.coop.reviveRange);
    p.revive = helper ? p.revive + 1 : Math.max(0, p.revive - 2);
    if (p.revive >= T.coop.reviveFrames) {
      p.hp = T.coop.reviveHp; p.revive = 0; setPlayer(p, 'free', 0);
      w.events.push({ type: 'revived', player: p.index });
    }
    return;
  }

  if (p.state === 'grabbed') {
    // Mash anything to break free.
    p.buffer = null;
    if (!w.enemies.some(x => x.state === 'holding' && x.focus === p.index)) { setPlayer(p, 'free', 0); p.escape = 0; return; }
    if (pressed) p.escape++;
    if (p.escape >= T.grab.escapePresses) {
      const e = w.enemies.find(x => x.state === 'holding' && x.focus === p.index);
      if (e) { setEnemy(e, 'stun', 50); const a = norm(sub(e.pos, p.pos)); e.vel = { x: a.x * 0.25, y: a.y * 0.25 }; }
      setPlayer(p, 'free', 0); p.escape = 0;
      w.events.push({ type: 'escaped', player: p.index });
    }
    return;
  }

  if (pressed) p.buffer = { action: pressed, frames: T.inputBuffer };
  else if (p.buffer && --p.buffer.frames <= 0) p.buffer = null;

  if (p.buffer && canAct(p)) {
    const prev = p.state, prevCombo = p.combo, prevHit = p.hasHit;
    const action = p.buffer.action;
    if (action === 'attack' && prev === 'attack' && prevHit) p.combo = (prevCombo + 1) % T.combo.length;
    else if (action === 'attack') p.combo = 0;
    if (tryAction(w, p, action, input)) p.buffer = null;
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
        const want = d - T.strikeDistance - (T[target.kind].radius - 0.45);
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
          if (d > T.hitReach + T[e.kind].radius - 0.45 || (d > 0.4 && dot(norm(to), p.facing) < 0.3)) continue;
          if (p.smash) damageEnemy(w, e, T.bottle.meleeDamage, p.pos, 5, 0, true, p.index, true);
          else damageEnemy(w, e, s.damage, p.pos, s.knock, s.stun, s.knockdown, p.index);
          landed = true;
        }
        if (landed) {
          p.hasHit = true;
          const heavy = p.smash || s.knockdown;
          w.hitstop = heavy ? T.hitstop.heavy : T.hitstop.light;
          w.shake = heavy ? 0.3 : 0.12;
          w.events.push({ type: 'hit', pos: { x: p.pos.x + p.facing.x, y: p.pos.y + p.facing.y }, heavy, by: p.index });
          if (p.smash) breakHeldBottle(w, p);
        }
      }
      if (p.t >= p.dur) { if (p.smash) breakHeldBottle(w, p); setPlayer(p, 'free', 0); p.combo = 0; }
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

function breakHeldBottle(w: World, p: Player) {
  const b = w.bottles.find(b => b.id === p.holding);
  if (!b) return;
  b.state = 'broken'; b.t = 0; b.pos = { x: p.pos.x + p.facing.x, y: p.pos.y + p.facing.y };
  p.holding = null; p.smash = false;
  w.events.push({ type: 'shatter', pos: { ...b.pos } });
}

function dropBottle(w: World, p: Player, away: Vec) {
  if (p.holding === null) return;
  const b = w.bottles.find(b => b.id === p.holding)!;
  b.state = 'ground'; b.pos = { x: p.pos.x - away.x * 0.8, y: p.pos.y - away.y * 0.8 }; p.holding = null;
}

// Returns true if the hit put the player down.
function hurtPlayer(w: World, p: Player, dmg: number, from: Vec, heavy: boolean, knock: number): boolean {
  p.hp -= dmg;
  const away = norm(sub(p.pos, from));
  p.pos.x += away.x * knock; p.pos.y += away.y * knock;
  dropBottle(w, p, away);
  w.hitstop = heavy ? T.hitstop.heavy : T.hitstop.light;
  w.shake = heavy ? 0.35 : 0.2;
  w.events.push({ type: 'playerHit', pos: { ...p.pos }, heavy, player: p.index });
  if (p.hp > 0) return false;
  const holder = w.enemies.find(x => x.state === 'holding' && x.focus === p.index);
  if (holder) setEnemy(holder, 'recover', T[holder.kind].recovery);
  p.hp = 0; p.revive = 0; p.escape = 0; setPlayer(p, 'down', 0);
  w.events.push({ type: 'playerDown', player: p.index });
  if (!w.players.some(standing)) w.result = 'lose';
  return true;
}

function strike(w: World, p: Player, e: Enemy) {
  if (e.kind === 'grappler') {
    dropBottle(w, p, norm(sub(p.pos, e.pos)));
    setPlayer(p, 'grabbed', 0); p.escape = 0;
    setEnemy(e, 'holding', T.grab.holdFrames);
    p.pos = { x: e.pos.x + e.facing.x * 0.8, y: e.pos.y + e.facing.y * 0.8 };
    w.shake = 0.2;
    w.events.push({ type: 'grabbed', player: p.index });
    return;
  }
  const haymaker = e.kind === 'boss' && e.unblockable;
  const dmg = haymaker ? T.bossHaymaker.damage : T[e.kind].damage;
  if (!hurtPlayer(w, p, dmg, e.pos, e.unblockable, 0.5)) { setPlayer(p, 'hitstun', 20); p.combo = 0; }
}

// Choose the next swing, set its wind-up and whether it can be countered.
function startWindup(e: Enemy) {
  const k = T[e.kind];
  let windup: number = k.windup;
  e.unblockable = k.unblockable;
  if (e.kind === 'boss') {
    e.unblockable = e.string === 2;
    windup = e.unblockable ? T.bossHaymaker.windup : k.windup;
    if (e.enraged) windup = Math.round(windup * 0.8);
  }
  setEnemy(e, 'windup', windup);
}

function attackersBusy(w: World) {
  return w.enemies.filter(e => e.state === 'approach' || e.state === 'windup' || e.state === 'active' || e.state === 'holding').length;
}

function nearestStanding(w: World, from: Vec): Player | null {
  let best: Player | null = null;
  for (const p of w.players) if (standing(p) && (!best || dist(p.pos, from) < dist(best.pos, from))) best = p;
  return best;
}

function stepEnemies(w: World) {
  const maxAttackers = (w.wave >= 0 ? T.waves[w.wave].maxAttackers : 1) + (w.players.length - 1);
  // Attack tokens: only a few enemies commit at once, the rest circle.
  if (attackersBusy(w) < maxAttackers && w.players.some(standing)) {
    let pick: Enemy | null = null, pickD = Infinity;
    for (const e of w.enemies) {
      if (e.state !== 'circle' || e.cooldown > 0) continue;
      const near = nearestStanding(w, e.pos)!, d = dist(e.pos, near.pos);
      if (d < pickD) { pick = e; pickD = d; }
    }
    if (pick) setEnemy(pick, 'approach', 180);
  }

  for (const e of w.enemies) {
    const k = T[e.kind];
    // Pick who to fight; once a swing or a grab has started, it stays on that player.
    if (e.state !== 'windup' && e.state !== 'active' && e.state !== 'holding') {
      const near = nearestStanding(w, e.pos);
      if (near) e.focus = near.index;
    }
    const p = w.players[e.focus];
    e.t++;
    if (e.cooldown > 0) e.cooldown--;
    e.pos.x += e.vel.x; e.pos.y += e.vel.y;
    e.vel.x *= 0.82; e.vel.y *= 0.82;
    const to = sub(p.pos, e.pos), d = len(to), toN = norm(to);
    const move = (target: Vec, speed: number) => {
      const v = sub(target, e.pos), l = len(v);
      if (l < 0.05) return;
      if (e.state !== 'spawn' && (l > 0.6 || e.state === 'circle')) {
        const via = steer(e.pos, target);
        if (via !== target) { const vv = sub(via, e.pos), vl = len(vv); if (vl > 0.05) { const s = Math.min(vl, speed / T.fps); e.pos.x += vv.x / vl * s; e.pos.y += vv.y / vl * s; return; } }
      }
      const s = Math.min(l, speed / T.fps);
      e.pos.x += v.x / l * s; e.pos.y += v.y / l * s;
    };
    const speed = k.speed * (e.enraged ? 1.25 : 1);
    switch (e.state) {
      case 'spawn':
        move(e.entry, speed);
        if (e.t >= e.dur) setEnemy(e, 'circle', 0);
        break;
      case 'circle': {
        e.angle += e.orbit * 0.006;
        const want = { x: p.pos.x + Math.cos(e.angle) * k.circleRadius, y: p.pos.y + Math.sin(e.angle) * k.circleRadius };
        move(want, speed * 0.6);
        e.facing = toN;
        break;
      }
      case 'approach': {
        e.facing = toN;
        const inRange = d <= k.attackRange && (e.kind !== 'thrower' || clearLine(e.pos, p.pos, 0.15));
        if (inRange && standing(p) && p.state !== 'grabbed') { startWindup(e); break; }
        move(p.pos, speed);
        if (e.t >= e.dur) { setEnemy(e, 'circle', 0); e.cooldown = k.cooldown; e.string = 0; }
        break;
      }
      case 'windup':
        if (e.dur - e.t > k.trackUntil) {
          e.facing = toN;
          if (e.kind !== 'thrower' && d > k.attackRange * 0.9) move(p.pos, speed * 0.5);
        }
        if (e.t >= e.dur) setEnemy(e, 'active', k.active);
        break;
      case 'active':
        if (e.t === 1) {
          if (e.kind === 'thrower') {
            const start = { x: e.pos.x + e.facing.x * 0.6, y: e.pos.y + e.facing.y * 0.6 };
            w.cups.push({ id: w.nextId++, pos: start, vel: { x: e.facing.x * T.cup.speed, y: e.facing.y * T.cup.speed }, owner: -1, from: e.id });
            w.events.push({ type: 'throw', pos: start });
          } else if (!playerInvulnerable(p) && p.state !== 'grabbed' && d <= k.attackRange + 0.35 && dot(e.facing, toN) > 0.5) {
            strike(w, p, e);
          }
        }
        if (e.state === 'active' && e.t >= e.dur) {
          setEnemy(e, 'recover', e.kind === 'boss' && e.unblockable ? T.bossHaymaker.recovery : k.recovery);
        }
        break;
      case 'holding':
        e.facing = toN;
        if (p.state !== 'grabbed') { setEnemy(e, 'recover', k.recovery); break; }
        p.pos = { x: e.pos.x + e.facing.x * 0.8, y: e.pos.y + e.facing.y * 0.8 };
        if (e.t % T.grab.tick === 0 && hurtPlayer(w, p, k.damage, e.pos, false, 0)) break;
        if (e.t >= e.dur) {
          // Throw them.
          setPlayer(p, 'hitstun', 30);
          p.pos = { x: e.pos.x + e.facing.x * 2, y: e.pos.y + e.facing.y * 2 };
          hurtPlayer(w, p, T.grab.throwDamage, e.pos, true, 0);
          setEnemy(e, 'recover', k.recovery);
        }
        break;
      case 'recover':
        if (e.t >= e.dur) {
          if (e.kind === 'boss') {
            // The string continues: swing, swing, haymaker.
            e.string = (e.string + 1) % 3;
            if (e.string !== 0) { setEnemy(e, 'approach', 120); break; }
          }
          setEnemy(e, 'circle', 0);
          e.cooldown = Math.round((k.cooldown + Math.floor(rand(w) * 40)) * (e.enraged ? 0.6 : 1));
        }
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

function outOfBounds(p: Vec) {
  const { minX, maxX, minY, maxY } = LEVEL.bounds;
  return p.x < minX || p.x > maxX || p.y < minY || p.y > maxY || insideObstacle(p, -0.05);
}

function stepCups(w: World) {
  w.cups = w.cups.filter(c => {
    c.pos.x += c.vel.x; c.pos.y += c.vel.y;
    if (c.owner === -1) {
      const p = w.players.find(p => !playerInvulnerable(p) && dist(p.pos, c.pos) < T.cup.hitRadius);
      if (p) {
        if (!hurtPlayer(w, p, T.thrower.damage, c.pos, false, 0.3) && p.state !== 'grabbed') { setPlayer(p, 'hitstun', 16); p.combo = 0; }
        w.events.push({ type: 'shatter', pos: { ...c.pos } });
        return false;
      }
    } else {
      const e = w.enemies.find(e => targetable(e) && dist(e.pos, c.pos) < T.cup.hitRadius + 0.1);
      if (e) {
        damageEnemy(w, e, T.cup.deflectDamage, { x: c.pos.x - c.vel.x * 5, y: c.pos.y - c.vel.y * 5 }, 5, 0, true, c.owner, true);
        w.hitstop = T.hitstop.bottle; w.shake = 0.25;
        w.events.push({ type: 'hit', pos: { ...c.pos }, heavy: true, by: c.owner });
        return false;
      }
    }
    if (outOfBounds(c.pos)) { w.events.push({ type: 'shatter', pos: { ...c.pos } }); return false; }
    return true;
  });
}

function stepBottles(w: World) {
  for (const b of w.bottles) {
    if (b.state === 'flying') {
      b.pos.x += b.vel.x; b.pos.y += b.vel.y;
      const hit = w.enemies.find(e => alive(e) && e.state !== 'down' && dist(e.pos, b.pos) < 0.7);
      if (hit) {
        damageEnemy(w, hit, T.bottle.damage, { x: b.pos.x - b.vel.x * 5, y: b.pos.y - b.vel.y * 5 }, 5, 0, true, b.holder, true);
        w.hitstop = T.hitstop.bottle; w.shake = 0.25;
        w.events.push({ type: 'hit', pos: { ...b.pos }, heavy: true, by: b.holder });
      }
      if (hit || outOfBounds(b.pos)) {
        b.state = 'broken'; b.t = 0;
        w.events.push({ type: 'shatter', pos: { ...b.pos } });
      }
    } else if (b.state === 'broken') {
      if (++b.t >= T.bottle.respawn) { b.state = 'ground'; b.pos = { ...b.home }; }
    } else if (b.state === 'held') {
      const p = w.players[b.holder];
      b.pos = { x: p.pos.x, y: p.pos.y };
    }
  }
}

// Enemies knocked flying hurt themselves on tables, the fence and the walls, and bowl over
// anyone standing in their way.
function slams(w: World) {
  const { minX, maxX, minY, maxY } = LEVEL.bounds;
  for (const e of w.enemies) {
    if (e.state !== 'down' || e.slammed || len(e.vel) < T.slam.speed) continue;
    const r = T[e.kind].radius;
    const wall = insideObstacle(e.pos, r * 0.6) || e.pos.x - r < minX || e.pos.x + r > maxX || e.pos.y - r < minY || e.pos.y + r > maxY;
    if (wall) {
      e.slammed = true;
      e.vel = { x: 0, y: 0 };
      e.hp -= T.slam.damage;
      if (e.hp <= 0) { e.hp = 0; setEnemy(e, 'dead', 0); w.events.push({ type: 'ko', pos: { ...e.pos }, boss: e.kind === 'boss' }); }
      else e.dur += T.slam.extraDown;
      w.hitstop = T.hitstop.heavy; w.shake = 0.4;
      w.events.push({ type: 'slam', pos: { ...e.pos } });
      continue;
    }
    for (const o of w.enemies) {
      if (o === e || !targetable(o) || o.kind === 'boss' || dist(o.pos, e.pos) > T[o.kind].radius + r) continue;
      damageEnemy(w, o, T.slam.bowlDamage, e.pos, 4, 0, true, e.lastHitBy, true);
      w.events.push({ type: 'hit', pos: { ...o.pos }, heavy: true, by: e.lastHitBy });
    }
  }
}

function separate(w: World) {
  const bodies: { pos: Vec; r: number; fixed: boolean }[] = [
    ...w.players.filter(p => standing(p) && p.state !== 'grabbed').map(p => ({ pos: p.pos, r: T.player.radius, fixed: p.state === 'counter' })),
    ...w.enemies.filter(e => alive(e) && e.state !== 'down').map(e => ({ pos: e.pos, r: T[e.kind].radius, fixed: e.kind === 'boss' })),
  ];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i], b = bodies[j];
      const v = sub(b.pos, a.pos), d = len(v), min = a.r + b.r;
      if (d >= min || d < 1e-6) continue;
      const push = (min - d) / 2, n = { x: v.x / d, y: v.y / d };
      const fa = a.fixed && !b.fixed ? 0 : b.fixed && !a.fixed ? 2 : 1, fb = 2 - fa;
      a.pos.x -= n.x * push * fa; a.pos.y -= n.y * push * fa;
      b.pos.x += n.x * push * fb; b.pos.y += n.y * push * fb;
    }
  }
  const { minX, maxX, minY, maxY } = LEVEL.bounds;
  const live = [
    ...w.players.map(p => ({ pos: p.pos, r: T.player.radius })),
    ...w.enemies.filter(e => e.state !== 'spawn' && e.state !== 'dead').map(e => ({ pos: e.pos, r: T[e.kind].radius })),
  ];
  for (const { pos, r } of live) {
    collide(pos, r);
    pos.x = Math.max(minX + r, Math.min(maxX - r, pos.x));
    pos.y = Math.max(minY + r, Math.min(maxY - r, pos.y));
  }
}

// One input per player; a single Input drives player 1.
export function step(w: World, inputs: Input | Input[]): World {
  const ins = Array.isArray(inputs) ? inputs : [inputs];
  const inputFor = (p: Player) => ins[p.index] ?? NO_INPUT;
  w.events = [];
  w.frame++;
  w.shake *= 0.85;
  if (w.hitstop > 0) {
    w.hitstop--;
    // Keep presses made during hitstop so combos stay responsive.
    for (const p of w.players) {
      const input = inputFor(p);
      const pressed: Action | null = input.counter ? 'counter' : input.dodge ? 'dodge' : input.attack ? 'attack' : input.grab ? 'grab' : null;
      if (pressed && p.state === 'grabbed') p.escape++;
      else if (pressed) p.buffer = { action: pressed, frames: T.inputBuffer };
    }
    return w;
  }
  if (w.result !== 'playing') return w;
  for (const p of w.players) stepPlayer(w, p, inputFor(p));
  stepEnemies(w);
  stepCups(w);
  stepBottles(w);
  slams(w);
  separate(w);

  if (w.enemies.every(e => !alive(e))) {
    if (w.waveTimer > 0) w.waveTimer--;
    else if (w.wave + 1 < T.waves.length) { startWave(w, w.wave + 1); w.waveTimer = T.waveDelay; }
    else w.result = 'win';
  }
  return w;
}
