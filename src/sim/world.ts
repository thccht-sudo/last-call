// Deterministic fight simulation. No rendering, no clock: step() advances one 60 Hz frame.
import { TUNING as T, EnemyKind, MoveName, AttackName } from './tuning';
import { LEVEL, LEVELS, steer, collide, insideObstacle, clearLine, useStage, activeLevel } from './level';

export interface Vec { x: number; y: number }

export interface Input {
  mx: number; my: number; // stick, -1..1, y down-screen
  attack: boolean; counter: boolean; dodge: boolean; bottle: boolean; // pressed this frame
}
export const NO_INPUT: Input = { mx: 0, my: 0, attack: false, counter: false, dodge: false, bottle: false };

type Action = 'attack' | 'counter' | 'dodge' | 'bottle';

export type DodgeKind = 'side' | 'back' | 'dash';
export type PlayerState = 'free' | 'attack' | 'counter' | 'whiff' | 'dodge' | 'hitstun' | 'down';
export interface Player {
  index: number; revive: number; // frames a partner has spent reviving this player
  pos: Vec; facing: Vec; hp: number;
  state: PlayerState; t: number; dur: number;
  move: MoveName; lead: number; // the attack being thrown, and travel frames before its startup
  target: number | null; hasHit: boolean;
  combo: number; comboAt: number; // string hits landed (jab, cross) and the frame of the last one
  counterAt: number; dodgeEnd: number; // for riposte and flying-knee follow-ups
  hits: number; lastHitAt: number; // running hit counter for the HUD
  stop: number; hitDir: Vec; // frames frozen in hitstop, and which way the hit came from
  style: number; styleAt: number; styleLog: string[]; // style meter, when it last grew, recent moves
  dodgeDir: Vec; dodgeKind: DodgeKind; perfectAt: number; holding: number | null;
  buffer: { action: Action; frames: number; mx: number; my: number } | null; // a press waiting to happen, with the stick as it was
}

export type EnemyState = 'spawn' | 'circle' | 'approach' | 'windup' | 'active' | 'recover' | 'stun' | 'air' | 'down' | 'getup' | 'dead';
export interface Enemy {
  id: number; kind: EnemyKind; pos: Vec; facing: Vec; vel: Vec; hp: number; maxHp: number;
  state: EnemyState; t: number; dur: number; cooldown: number; angle: number; orbit: number; entry: Vec;
  focus: number; lastHitBy: number; lastHitFrame: number;
  attack: AttackName; // the swing he is throwing or about to throw
  unblockable: boolean; // the current swing can't be countered (red)
  connected: boolean; // the current swing has already hit someone
  z: number; vz: number; juggle: number; // height off the floor while launched, and air hits taken
  string: number; // boss: position in his hook, elbow, haymaker string
  enraged: boolean; slammed: boolean; stomped: boolean;
  stop: number; hitDir: Vec; // hitstop frames left, and the direction of the hit (for the shake)
  ring: number; feint: number; // circling: drift on his ring, and a fake step in
}

export interface Bottle { id: number; home: Vec; pos: Vec; vel: Vec; state: 'ground' | 'held' | 'flying' | 'broken'; t: number; holder: number }

// A thrown red cup. owner -1 is an enemy throw; a deflected cup belongs to the player who countered it.
export interface Cup { id: number; pos: Vec; vel: Vec; owner: number; from: number }

export type GameEvent =
  | { type: 'hit'; pos: Vec; heavy: boolean; by: number; move?: MoveName }
  | { type: 'launch'; pos: Vec; by: number }
  | { type: 'spike'; pos: Vec; by: number }
  | { type: 'tag'; pos: Vec }
  | { type: 'slam'; pos: Vec }
  | { type: 'counter'; pos: Vec; by: number }
  | { type: 'deflect'; pos: Vec; by: number }
  | { type: 'whiff'; by: number }
  | { type: 'swing'; pos: Vec; attack: AttackName }
  | { type: 'playerHit'; pos: Vec; heavy: boolean; player: number }
  | { type: 'playerDown'; player: number }
  | { type: 'revived'; player: number }
  | { type: 'joined'; player: number }
  | { type: 'enrage'; pos: Vec }
  | { type: 'throw'; pos: Vec }
  | { type: 'shatter'; pos: Vec }
  | { type: 'dodge'; by: number }
  | { type: 'perfect'; pos: Vec; by: number }
  | { type: 'rank'; player: number; rank: number }
  | { type: 'wave'; n: number }
  | { type: 'stage'; stage: number }
  | { type: 'ko'; pos: Vec; boss: boolean };

// Per-player fight record, shown on the results screen.
export interface Stats {
  dealt: number; taken: number; takenBy: Record<string, number>;
  missedCounters: number; counters: number; deflects: number; whiffs: number; dodges: number;
  slams: number; kos: number; downs: number; launches: number; bestCombo: number; perfects: number;
  style: number; bestRank: number; // total style points, highest tier reached (-1 none)
}
const newStats = (): Stats => ({ dealt: 0, taken: 0, takenBy: {}, missedCounters: 0, counters: 0, deflects: 0, whiffs: 0, dodges: 0, slams: 0, kos: 0, downs: 0, launches: 0, bestCombo: 0, perfects: 0, style: 0, bestRank: -1 });

export interface World {
  frame: number; hitstop: number; shake: number;
  players: Player[]; enemies: Enemy[]; bottles: Bottle[]; cups: Cup[];
  difficulty: number; stats: Stats[];
  stage: number; wave: number; waveTimer: number; result: 'playing' | 'win' | 'lose';
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
    state: 'free', t: 0, dur: 0, move: 'jab', lead: 0, target: null, hasHit: false,
    combo: 0, comboAt: -999, counterAt: -999, dodgeEnd: -999, hits: 0, lastHitAt: -999, stop: 0, hitDir: { x: 0, y: 0 }, style: 0, styleAt: -999, styleLog: [],
    dodgeDir: { x: 0, y: 0 }, dodgeKind: 'dash', perfectAt: -999, holding: null, buffer: null,
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

export function createWorld(seed = 1, playerCount = 1, difficulty = 1): World {
  const w: World = {
    frame: 0, hitstop: 0, shake: 0,
    players: [newPlayer(0, LEVEL.playerStart)],
    difficulty, stats: [newStats(), newStats()],
    enemies: [], bottles: [], cups: [], stage: 0, wave: -1, waveTimer: 30, result: 'playing',
    events: [], rng: seed >>> 0 || 1, nextId: 1,
  };
  useStage(0);
  placeBottles(w);
  while (w.players.length < playerCount) addPlayer(w);
  w.events = [];
  return w;
}

export function spawnEnemy(w: World, kind: EnemyKind, pos: Vec, state: EnemyState = 'spawn', entry: Vec = pos): Enemy {
  const k = T[kind];
  const e: Enemy = {
    id: w.nextId++, kind, pos: { ...pos }, facing: { x: 0, y: 1 }, vel: { x: 0, y: 0 },
    hp: Math.round(k.hp * mods(w).enemyHp), maxHp: Math.round(k.hp * mods(w).enemyHp), state, t: 0, dur: state === 'spawn' ? 20 : 0,
    cooldown: 30 + Math.floor(rand(w) * 60), angle: rand(w) * Math.PI * 2, orbit: rand(w) < 0.5 ? -1 : 1, entry: { ...entry },
    focus: 0, lastHitBy: -1, lastHitFrame: -999, attack: k.moves[0], unblockable: false, connected: false,
    z: 0, vz: 0, juggle: 0, string: 0, enraged: false, slammed: false, stomped: false, stop: 0, hitDir: { x: 0, y: 0 }, ring: 0, feint: 0,
  };
  w.enemies.push(e);
  return e;
}

function placeBottles(w: World) {
  for (const p of w.players) p.holding = null;
  w.bottles = LEVELS[w.stage].bottleSpots.map(home => ({ id: w.nextId++, home, pos: { ...home }, vel: { x: 0, y: 0 }, state: 'ground' as const, t: 0, holder: -1 }));
}

// Move the fight to another stage: everyone comes in the front door together.
function enterStage(w: World, stage: number) {
  w.stage = stage;
  useStage(stage);
  const start = LEVELS[stage].playerStart;
  w.players.forEach((p, i) => {
    p.pos = { x: start.x + (i - (w.players.length - 1) / 2) * 1.2, y: start.y };
    p.facing = { x: 0, y: -1 };
    if (p.state !== 'down') setPlayer(p, 'free', 0);
  });
  w.cups = [];
  w.enemies = []; // everyone left outside is already down for good
  placeBottles(w);
  w.events.push({ type: 'stage', stage });
}

function startWave(w: World, n: number) {
  if (T.waves[n].stage !== w.stage) enterStage(w, T.waves[n].stage);
  w.wave = n;
  w.events.push({ type: 'wave', n });
  const extra = Array.from({ length: (w.players.length - 1) * T.coop.extraPerWave }, () => 'thug' as const);
  [...T.waves[n].enemies, ...extra].forEach((kind, i) => {
    const spawns = activeLevel().spawns;
    const s = spawns[i % spawns.length];
    const e = spawnEnemy(w, kind, s.from, 'spawn', s.to);
    e.dur = 20 + i * 25;
  });
}

const alive = (e: Enemy) => e.state !== 'dead';
const targetable = (e: Enemy) => alive(e) && e.state !== 'down' && e.state !== 'getup' && e.state !== 'spawn';
const grounded = (e: Enemy) => e.state === 'down' && alive(e);

// Freeflow targeting: nearest enemy in the pushed direction, else in front. With the stick
// left alone, stay on whoever you were already hitting.
export function pickTarget(w: World, p: Player, dir: Vec, range: number, sticky = false): Enemy | null {
  let best: Enemy | null = null, bestScore = Infinity;
  for (const e of w.enemies) {
    if (!targetable(e)) continue;
    const to = sub(e.pos, p.pos), d = len(to);
    if (d > range) continue;
    const facing = d > 1e-6 ? dot(dir, norm(to)) : 1;
    if (facing < -0.1 && d > 1.6) continue;
    let score = d - 3 * facing;
    if (sticky && e.id === p.target) score -= 2.5;
    // Someone behind a table or the fence is a poor pick: you'd lunge into the furniture.
    if (d > 1.6 && !clearLine(p.pos, e.pos, 0.2)) score += 4;
    if (score < bestScore) { bestScore = score; best = e; }
  }
  return best;
}

// Who a dodge is about: the closest enemy swinging at this player, else the closest standing one.
function dodgeThreat(w: World, p: Player): Enemy | null {
  let best: Enemy | null = null, bestScore = Infinity;
  for (const e of w.enemies) {
    if (!targetable(e)) continue;
    const d = dist(e.pos, p.pos);
    if (d > T.dodge.threatRange) continue;
    const swinging = (e.state === 'windup' || e.state === 'active') && e.focus === p.index;
    const score = d - (swinging ? 4 : 0);
    if (score < bestScore) { bestScore = score; best = e; }
  }
  return best;
}

const stickHeld = (input: Input) => Math.hypot(input.mx, input.my) > 0.3;
function stickDir(input: Input, fallback: Vec): Vec {
  return stickHeld(input) ? norm({ x: input.mx, y: input.my }) : fallback;
}

function setPlayer(p: Player, state: PlayerState, dur: number) { p.state = state; p.t = 0; p.dur = dur; }
function setEnemy(e: Enemy, state: EnemyState, dur: number) { e.state = state; e.t = 0; e.dur = dur; }

const playerInvulnerable = (p: Player) =>
  p.state === 'counter' || p.state === 'down' ||
  (p.state === 'dodge' && p.t >= T.dodge[p.dodgeKind].invulnFrom && p.t <= T.dodge[p.dodgeKind].invulnTo);

export const standing = (p: Player) => p.state !== 'down';

// Frames until this enemy's strike lands; null if it isn't winding up.
export function framesToStrike(e: Enemy): number | null {
  if (e.state === 'windup') return e.dur - e.t;
  if (e.state === 'active' && !e.connected) return 0;
  return null;
}

// Any player in range can counter, including to save a partner. Throwers are countered by
// knocking their cup back, not in melee.
export const mods = (w: World) => T.difficulty[w.difficulty] ?? T.difficulty[1];
export const counterWindow = (w: World) => Math.round(T.counter.window * mods(w).window);

export function counterable(p: Player, e: Enemy, window: number = T.counter.window): boolean {
  const f = framesToStrike(e);
  return f !== null && f <= window && !e.unblockable && e.attack !== 'throw' &&
    standing(p) && dist(e.pos, p.pos) <= T.counter.range;
}

// An incoming enemy cup this player can knock back.
export function deflectable(p: Player, c: Cup): boolean {
  if (c.owner !== -1 || !standing(p)) return false;
  const to = sub(p.pos, c.pos);
  return len(to) <= T.cup.deflectRange && dot(norm(to), norm(c.vel)) > 0.3;
}

// The boss shrugs off light hits; everyone else only while throwing a red attack.
function hasArmour(e: Enemy) {
  return e.kind === 'boss' || (e.unblockable && (e.state === 'windup' || e.state === 'active'));
}

// Environmental finishers: a knockdown that would send him close past a wall, table, fence or
// the bar is steered into it, so the slam lands.
function aimAtWall(from: Vec, dir: Vec): Vec {
  const { minX, maxX, minY, maxY } = activeLevel().bounds;
  let best = dir, bestScore = Infinity;
  for (const a of [0, 0.2, -0.2, 0.4, -0.4, 0.6, -0.6]) {
    const c = Math.cos(a), s = Math.sin(a);
    const d = { x: dir.x * c - dir.y * s, y: dir.x * s + dir.y * c };
    for (let r = 0.5; r <= T.slam.aim; r += 0.25) {
      const q = { x: from.x + d.x * r, y: from.y + d.y * r };
      if (q.x < minX || q.x > maxX || q.y < minY || q.y > maxY || insideObstacle(q)) {
        const score = r + Math.abs(a) * 2;
        if (score < bestScore) { bestScore = score; best = d; }
        break;
      }
    }
  }
  return best;
}

type Effect = 'stun' | 'down' | 'launch' | 'spike';

function knockDown(e: Enemy, frames: number = T.knockdownFrames) {
  e.slammed = false; e.stomped = false; e.z = 0; e.vz = 0; e.juggle = 0;
  setEnemy(e, 'down', e.kind === 'boss' ? frames - 20 : frames);
}

function damageEnemy(w: World, e: Enemy, dmg: number, from: Vec, knock: number, effect: Effect, stun: number, by = -1, force = false) {
  // Tag team: hitting an enemy your partner just hit lands harder.
  if (by >= 0 && e.lastHitBy >= 0 && e.lastHitBy !== by && w.frame - e.lastHitFrame <= T.coop.tagWindow) {
    dmg = Math.round(dmg * T.coop.tagMultiplier);
    w.events.push({ type: 'tag', pos: { ...e.pos } });
  }
  if (by >= 0) { e.lastHitBy = by; e.lastHitFrame = w.frame; w.stats[by].dealt += Math.min(dmg, Math.max(0, e.hp)); }
  e.hp -= dmg;
  let away = norm(sub(e.pos, from));
  if (away.x === 0 && away.y === 0) away = { x: -e.facing.x, y: -e.facing.y };
  const armour = hasArmour(e) && !force;
  if (effect === 'down' && knock >= 4 && !armour) away = aimAtWall(e.pos, away);
  const knockScale = armour ? 0.3 : 1;
  e.vel = { x: away.x * knock * 0.06 * knockScale, y: away.y * knock * 0.06 * knockScale };
  if (!armour) e.facing = { x: -away.x, y: -away.y };
  if (e.hp <= 0) {
    e.hp = 0;
    e.vel = { x: away.x * 0.3, y: away.y * 0.3 };
    setEnemy(e, 'dead', 0);
    if (e.lastHitBy >= 0) { w.stats[e.lastHitBy].kos++; addStyle(w, w.players[e.lastHitBy], 'ko'); }
    w.events.push({ type: 'ko', pos: { ...e.pos }, boss: e.kind === 'boss' });
    return;
  }
  if (e.kind === 'boss' && !e.enraged && e.hp <= e.maxHp * T.bossEnrage) enrage(w, e);
  // Already on the floor: a stomp keeps him there a little longer, once.
  if (e.state === 'down') {
    e.vel = { x: 0, y: 0 };
    if (!e.stomped) { e.stomped = true; e.dur += T.stompExtra; }
    return;
  }
  if (armour) return;
  e.string = 0;
  if (e.state === 'air') {
    // Juggled: every air hit pops him back up a little less; a spike or knockdown slams him down.
    if (effect === 'spike' || effect === 'down') { spike(w, e, by); return; }
    e.juggle++;
    e.vz = Math.max(e.vz, T.air.pop * Math.pow(T.air.popDecay, e.juggle - 1));
    e.dur = 0;
    return;
  }
  // The President is too big to launch: launchers floor him instead.
  if (effect === 'launch' && e.kind !== 'boss') {
    setEnemy(e, 'air', 0);
    e.z = 0.05; e.vz = T.air.launch; e.juggle = 0;
    if (by >= 0) w.stats[by].launches++;
    w.events.push({ type: 'launch', pos: { ...e.pos }, by });
    return;
  }
  if (effect === 'spike') { spike(w, e, by); return; }
  if (effect !== 'stun') knockDown(e);
  else setEnemy(e, 'stun', stun || T[e.kind].stun);
}

// Slammed into the floor: a shockwave floors anyone standing close.
function spike(w: World, e: Enemy, by: number) {
  knockDown(e, T.knockdownFrames + 10);
  e.vel = { x: 0, y: 0 };
  w.hitstop = Math.max(w.hitstop, T.hitstop.spike); w.shake = 0.45;
  w.events.push({ type: 'spike', pos: { ...e.pos }, by });
  for (const o of w.enemies) {
    if (o === e || !targetable(o) || o.kind === 'boss' || dist(o.pos, e.pos) > T.spikeWave.radius) continue;
    damageEnemy(w, o, T.spikeWave.damage, e.pos, 3, 'down', 0, by, true);
  }
}

function enrage(w: World, e: Enemy) {
  e.enraged = true;
  w.events.push({ type: 'enrage', pos: { ...e.pos } });
  w.shake = 0.5;
  for (let i = 0; i < 2; i++) {
    const s = activeLevel().spawns[1 + i];
    const add = spawnEnemy(w, 'thug', s.from, 'spawn', s.to);
    add.dur = 20 + i * 30;
  }
}

export const styleRank = (style: number) => { let r = -1; T.style.tiers.forEach((t, i) => { if (style >= t) r = i; }); return r; };

function addStyle(w: World, p: Player | undefined, what: string) {
  if (!p) return;
  const fresh = !p.styleLog.includes(what) || what === 'ko';
  const pts = Math.round((T.style.points[what] ?? 5) * (fresh ? 1 : T.style.repeat));
  const before = styleRank(p.style);
  p.style = Math.min(T.style.max, p.style + pts);
  p.styleAt = w.frame;
  if (what !== 'ko') { p.styleLog.push(what); if (p.styleLog.length > 4) p.styleLog.shift(); }
  const st = w.stats[p.index];
  st.style += pts;
  const after = styleRank(p.style);
  st.bestRank = Math.max(st.bestRank, after);
  if (after > before) w.events.push({ type: 'rank', player: p.index, rank: after });
}

// Which attack a press of X becomes, and at whom. See README for the move list.
function chooseAttack(w: World, p: Player, input: Input): { move: MoveName; target: Enemy | null } {
  const dir = stickDir(input, p.facing);
  if (p.holding !== null) return { move: 'smash', target: pickTarget(w, p, dir, T.lungeRange, !stickHeld(input)) };
  const kneeReady = (p.state === 'dodge' && p.t >= T.followUp.dodgeFrom) || w.frame - p.dodgeEnd <= T.followUp.dodge;
  const t = pickTarget(w, p, dir, kneeReady ? T.kneeRange : T.lungeRange, !stickHeld(input));
  if (t?.state === 'air') return { move: t.juggle >= T.air.maxHits - 1 ? 'spike' : 'juggle', target: t };
  if (t && w.frame >= p.counterAt - T.inputBuffer && w.frame - p.counterAt <= T.followUp.counter) return { move: 'riposte', target: t };
  if (t && kneeReady) return { move: 'knee', target: t };
  // A floored enemy close by, with nobody standing in the way: stomp him.
  const floored = w.enemies.filter(e => grounded(e) && !e.stomped && dist(e.pos, p.pos) < 2.2 && (!stickHeld(input) || dot(dir, norm(sub(e.pos, p.pos))) > 0.5))
    .sort((a, b) => dist(a.pos, p.pos) - dist(b.pos, p.pos))[0];
  if (floored && (!t || dist(t.pos, p.pos) > 2.4)) return { move: 'stomp', target: floored };
  const n = w.frame - p.comboAt <= T.string.window ? p.combo : 0;
  if (n === 0) return { move: 'jab', target: t };
  if (n === 1) return { move: 'cross', target: t };
  // Third hit. Same man as the last two, unless you clearly pushed toward someone else.
  const last = w.enemies.find(e => e.id === p.target && targetable(e) && dist(e.pos, p.pos) <= T.lungeRange);
  const prev = last ?? t;
  const toPrev = prev ? norm(sub(prev.pos, p.pos)) : p.facing;
  const pulledBack = stickHeld(input) && dot(norm({ x: input.mx, y: input.my }), toPrev) < -0.4;
  const target = pulledBack ? prev : t;
  if (pulledBack) return { move: 'sweep', target };
  if (w.frame - p.comboAt >= T.string.delay) return { move: 'uppercut', target };
  return { move: 'roundhouse', target };
}

function tryAction(w: World, p: Player, action: Action, input: Input): boolean {
  const dir = stickDir(input, p.facing);
  if (action === 'dodge') {
    // Keep facing the most pressing threat and step relative to him.
    const threat = dodgeThreat(w, p);
    p.dodgeDir = dir;
    if (threat) {
      const to = norm(sub(threat.pos, p.pos));
      p.facing = to;
      // Stick left alone: step back from him.
      if (!stickHeld(input)) p.dodgeDir = { x: -to.x, y: -to.y };
      const along = dot(p.dodgeDir, to);
      p.dodgeKind = along > 0.6 ? 'dash' : along < -0.6 ? 'back' : 'side';
    } else { p.facing = dir; p.dodgeKind = 'dash'; }
    setPlayer(p, 'dodge', T.dodge[p.dodgeKind].frames);
    // A perfect evade: dodging just before a swing aimed at you would land.
    const dodged = w.enemies.find(e => {
      const f = framesToStrike(e), at = T.attacks[e.attack];
      return f !== null && f <= T.dodge.perfectWindow && e.focus === p.index && e.attack !== 'throw' && dist(e.pos, p.pos) <= at.reach + at.lunge + 0.5;
    });
    if (dodged) {
      p.perfectAt = w.frame;
      w.stats[p.index].perfects++;
      addStyle(w, p, 'perfect');
      w.events.push({ type: 'perfect', pos: { ...p.pos }, by: p.index });
    }
    w.stats[p.index].dodges++;
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
      p.stop = T.hitstop.light; w.shake = 0.15;
      w.stats[p.index].deflects++;
      addStyle(w, p, 'deflect');
      w.events.push({ type: 'deflect', pos: { ...cup.pos }, by: p.index });
      return true;
    }
    // Every yellow swing in range is countered at once; you snap to the nearest.
    const all = w.enemies.filter(e => counterable(p, e, counterWindow(w))).sort((a, b) => dist(a.pos, p.pos) - dist(b.pos, p.pos));
    if (!all.length) { setPlayer(p, 'whiff', T.counter.whiffFrames); p.combo = 0; w.stats[p.index].whiffs++; w.events.push({ type: 'whiff', by: p.index }); return true; }
    const best = all[0];
    const to = norm(sub(best.pos, p.pos));
    p.facing = to;
    p.pos = { x: best.pos.x - to.x * T.strikeDistance, y: best.pos.y - to.y * T.strikeDistance };
    setPlayer(p, 'counter', T.counter.frames);
    p.target = best.id; p.combo = 0;
    for (const e of all) {
      damageEnemy(w, e, T.counter.damage, p.pos, 1.5, 'stun', T.counter.stagger, p.index, true);
      addStyle(w, p, 'counter');
      w.stats[p.index].counters++;
      w.events.push({ type: 'counter', pos: { ...e.pos }, by: p.index });
    }
    w.hitstop = T.hitstop.counter; w.shake = 0.35;
    p.counterAt = w.frame + w.hitstop + T.counter.cancel; // when the riposte window opens
    return true;
  }
  if (action === 'bottle') {
    if (p.holding !== null) {
      const b = w.bottles.find(b => b.id === p.holding)!;
      const t = pickTarget(w, p, dir, T.bottle.throwRange);
      const aim = t ? norm(sub(t.pos, p.pos)) : dir;
      b.state = 'flying'; b.pos = { x: p.pos.x + aim.x * 0.6, y: p.pos.y + aim.y * 0.6 };
      b.vel = { x: aim.x * T.bottle.speed, y: aim.y * T.bottle.speed }; b.holder = p.index;
      p.holding = null; p.facing = aim;
      startAttack(p, 'throw', null, 0);
      p.hasHit = true;
      return true;
    }
    const b = w.bottles.find(b => b.state === 'ground' && dist(b.pos, p.pos) <= T.bottle.pickup);
    if (b) { b.state = 'held'; b.holder = p.index; p.holding = b.id; return true; }
    return false;
  }
  // attack
  const { move, target } = chooseAttack(w, p, input);
  let lead = 0;
  if (target) {
    p.facing = norm(sub(target.pos, p.pos));
    const gap = dist(target.pos, p.pos) - stopDistance(move, target);
    lead = Math.max(0, Math.min(T.maxTravel, Math.ceil(gap / T.lungeSpeed) - T.moves[move].startup));
  } else p.facing = dir;
  startAttack(p, move, target, lead);
  return true;
}

function startAttack(p: Player, move: MoveName, target: Enemy | null, lead: number) {
  const m = T.moves[move];
  p.move = move; p.lead = lead; p.target = target ? target.id : null; p.hasHit = false;
  setPlayer(p, 'attack', lead + m.startup + m.active + m.recovery);
}

// Where a lunge stops: a stomp stands over him, everything else stops at arm's length.
const stopDistance = (move: MoveName, e: Enemy) => (move === 'stomp' ? 0.8 : T.strikeDistance) + (T[e.kind].radius - 0.45);

// Attack frame t relative to the start of the startup (travel frames come first).
const strikeT = (p: Player) => p.t - p.lead;

function canAct(p: Player, action: Action): boolean {
  switch (p.state) {
    case 'free': return true;
    // Counter and dodge cancel an attack at any point; another attack waits for the hit.
    case 'attack': {
      if (action === 'counter' || action === 'dodge') return p.move !== 'throw' || p.t > 4;
      const m = T.moves[p.move], t = strikeT(p);
      if (p.move === 'smash') return false;
      return t >= m.startup + m.active + (p.hasHit ? 0 : T.whiffRecovery);
    }
    case 'counter': return p.t >= (action === 'attack' ? T.counter.cancel : p.dur - 8);
    case 'dodge': return action === 'attack' ? p.t >= T.followUp.dodgeFrom : action === 'counter' && p.t > T.dodge[p.dodgeKind].invulnTo;
    case 'hitstun': return action === 'dodge' && p.t >= T.hurt.breakout;
    case 'whiff': return action === 'dodge' && p.t >= T.hurt.breakout - 2;
    default: return false;
  }
}

const pressedAction = (input: Input): Action | null =>
  input.counter ? 'counter' : input.dodge ? 'dodge' : input.attack ? 'attack' : input.bottle ? 'bottle' : null;

function stepPlayer(w: World, p: Player, input: Input) {
  const pressed = pressedAction(input);
  if (p.stop > 0) {
    // Frozen in hitstop: hold presses for when it ends so combos stay responsive.
    p.stop--;
    if (pressed && standing(p)) p.buffer = { action: pressed, frames: T.inputBuffer, mx: input.mx, my: input.my };
    return;
  }
  if (w.frame - p.styleAt > T.style.idle) p.style = Math.max(0, p.style - T.style.decay);
  p.t++;

  if (p.state === 'down') {
    p.buffer = null;
    const helper = w.players.find(o => o !== p && standing(o) && dist(o.pos, p.pos) <= T.coop.reviveRange);
    p.revive = helper ? p.revive + 1 : Math.max(0, p.revive - 2);
    if (p.revive >= T.coop.reviveFrames) {
      p.hp = T.coop.reviveHp; p.revive = 0; setPlayer(p, 'free', 0);
      w.events.push({ type: 'revived', player: p.index });
    }
    return;
  }

  if (pressed) p.buffer = { action: pressed, frames: T.inputBuffer, mx: input.mx, my: input.my };
  else if (p.buffer && --p.buffer.frames <= 0) p.buffer = null;

  if (p.buffer && canAct(p, p.buffer.action)) {
    // A buffered press keeps the direction it was made with, unless the stick is held now.
    const aim = stickHeld(input) ? input : { ...input, mx: p.buffer.mx, my: p.buffer.my };
    const wasAttack = p.state === 'attack';
    const prevMove = p.move, prevHit = p.hasHit;
    if (wasAttack && !prevHit && prevMove !== 'throw') p.combo = 0;
    if (tryAction(w, p, p.buffer.action, aim)) p.buffer = null;
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
      const m = T.moves[p.move], t = strikeT(p);
      const target = w.enemies.find(e => e.id === p.target && (targetable(e) || (p.move === 'stomp' && grounded(e))));
      // Lunge: close the gap over the travel and startup frames, homing on him as he moves.
      if (t <= m.startup && target) {
        const to = sub(target.pos, p.pos), d = len(to);
        const want = d - stopDistance(p.move, target);
        if (want > 0) {
          const left = Math.max(1, m.startup - t + 1);
          const stepLen = Math.min(want, Math.max(want / left, T.lungeSpeed * (p.t < p.lead ? 1 : 0)), T.lungeSpeed * 1.3);
          const n = norm(to);
          p.pos.x += n.x * stepLen; p.pos.y += n.y * stepLen;
        }
        if (d > 1e-6) p.facing = norm(to);
      }
      if (!p.hasHit && p.move !== 'throw' && t >= m.startup && t < m.startup + m.active) landHits(w, p, target);
      if (p.t >= p.dur) {
        if (p.move === 'smash') breakHeldBottle(w, p);
        if (!p.hasHit) p.combo = 0;
        setPlayer(p, 'free', 0);
      }
      break;
    }
    case 'dodge': {
      // Ease-out: distance(u) = D (1 - (1 - u)^2), so it leaves fast and lands without sliding.
      const d = T.dodge[p.dodgeKind], at = (u: number) => d.distance * (1 - (1 - Math.max(0, Math.min(1, u))) ** 2);
      const stepLen = at(p.t / d.frames) - at((p.t - 1) / d.frames);
      p.pos.x += p.dodgeDir.x * stepLen; p.pos.y += p.dodgeDir.y * stepLen;
      if (p.t >= p.dur) { p.dodgeEnd = w.frame; setPlayer(p, 'free', 0); }
      break;
    }
    case 'counter': case 'whiff': case 'hitstun':
      if (p.t >= p.dur) setPlayer(p, 'free', 0);
      break;
  }
}

// Active frames: the locked target is hit wherever he's drifted within lockReach; anyone else
// in a cone in front within the move's reach is hit too.
function landHits(w: World, p: Player, target: Enemy | undefined) {
  const m = T.moves[p.move];
  // A juggle or spike whose man has already landed hits nobody else.
  if (!target && (p.move === 'juggle' || p.move === 'spike')) return;
  const victims: Enemy[] = [];
  if (target && dist(target.pos, p.pos) <= T.lockReach + T[target.kind].radius - 0.45) victims.push(target);
  // Launchers and juggles are one-on-one: with a locked target, nobody else gets caught.
  const single = m.effect === 'launch' && victims.length > 0;
  for (const e of w.enemies) {
    if (single || e === target || !(targetable(e) || (p.move === 'stomp' && grounded(e)))) continue;
    if (p.move === 'stomp' && !grounded(e)) continue;
    const to = sub(e.pos, p.pos), d = len(to);
    if (d > m.reach + T[e.kind].radius - 0.45 || (d > 0.4 && dot(norm(to), p.facing) < 0.3)) continue;
    victims.push(e);
  }
  if (!victims.length) return;
  const smash = p.move === 'smash';
  // A knee straight out of a perfect evade hits much harder.
  const bonus = p.move === 'knee' && w.frame - p.perfectAt <= T.dodge.dash.frames + T.followUp.dodge ? T.dodge.perfectKnee : 1;
  for (const e of victims) {
    damageEnemy(w, e, Math.round((smash ? T.bottle.meleeDamage : m.damage) * bonus), p.pos, m.knock, m.effect as Effect, m.stun, p.index, smash || p.move === 'riposte');
  }
  p.hasHit = true;
  addStyle(w, p, p.move);
  p.hits = w.frame - p.lastHitAt <= 90 ? p.hits + victims.length : victims.length;
  p.lastHitAt = w.frame;
  const st = w.stats[p.index];
  st.bestCombo = Math.max(st.bestCombo, p.hits);
  const heavy = m.effect !== 'stun';
  // Hitstop on the people involved only: the victim holds a little longer than the attacker.
  const stop = m.effect === 'launch' ? T.hitstop.launch : heavy ? T.hitstop.heavy : T.hitstop.light;
  p.stop = Math.max(p.stop, stop);
  for (const e of victims) { e.stop = Math.max(e.stop, stop + T.hitstop.victimExtra); e.hitDir = { ...p.facing }; }
  w.shake = Math.max(w.shake, heavy ? 0.3 : 0.12);
  // String bookkeeping: jab and cross build it, anything else ends it. Timing counts from the
  // end of the hitstop.
  p.combo = p.move === 'jab' ? 1 : p.move === 'cross' ? 2 : 0;
  p.comboAt = w.frame + p.stop;
  w.events.push({ type: 'hit', pos: { x: p.pos.x + p.facing.x, y: p.pos.y + p.facing.y }, heavy, by: p.index, move: p.move });
  if (smash) breakHeldBottle(w, p);
}

function breakHeldBottle(w: World, p: Player) {
  const b = w.bottles.find(b => b.id === p.holding);
  if (!b) return;
  b.state = 'broken'; b.t = 0; b.pos = { x: p.pos.x + p.facing.x, y: p.pos.y + p.facing.y };
  p.holding = null;
  w.events.push({ type: 'shatter', pos: { ...b.pos } });
}

function dropBottle(w: World, p: Player, away: Vec) {
  if (p.holding === null) return;
  const b = w.bottles.find(b => b.id === p.holding)!;
  b.state = 'ground'; b.pos = { x: p.pos.x - away.x * 0.8, y: p.pos.y - away.y * 0.8 }; p.holding = null;
}

// Returns true if the hit put the player down.
function hurtPlayer(w: World, p: Player, base: number, from: Vec, heavy: boolean, knock: number, source: string): boolean {
  const dmg = Math.max(1, Math.round(base * mods(w).damage));
  const st = w.stats[p.index];
  st.taken += Math.min(dmg, p.hp); st.takenBy[source] = (st.takenBy[source] ?? 0) + Math.min(dmg, p.hp);
  p.hp -= dmg;
  p.hits = 0; p.combo = 0;
  // Getting hit drops the style meter a tier.
  const tier = styleRank(p.style);
  p.style = tier <= 0 ? 0 : T.style.tiers[tier - 1];
  const away = norm(sub(p.pos, from));
  p.pos.x += away.x * knock; p.pos.y += away.y * knock;
  dropBottle(w, p, away);
  p.stop = Math.max(p.stop, (heavy ? T.hitstop.heavy : T.hitstop.light) + T.hitstop.victimExtra);
  p.hitDir = { x: -away.x, y: -away.y };
  w.shake = Math.max(w.shake, heavy ? 0.35 : 0.2);
  w.events.push({ type: 'playerHit', pos: { ...p.pos }, heavy, player: p.index });
  if (p.hp > 0) return false;
  p.hp = 0; p.revive = 0; setPlayer(p, 'down', 0);
  st.downs++;
  w.events.push({ type: 'playerDown', player: p.index });
  if (!w.players.some(standing)) w.result = 'lose';
  return true;
}

const SOURCE: Record<AttackName, string> = {
  hook: 'punches', kick: 'kicks', shove: 'shoves', elbow: 'elbows', spinKick: 'kicks',
  haymaker: 'haymakers', charge: 'shoulder charges', flyingKnee: 'flying knees', throw: 'red cups',
};

function strike(w: World, p: Player, e: Enemy) {
  const a = T.attacks[e.attack];
  // A swing that could have been countered and wasn't.
  if (!e.unblockable) w.stats[p.index].missedCounters++;
  const source = e.kind === 'boss' ? (e.attack === 'haymaker' || e.attack === 'charge' ? 'the President\'s ' + SOURCE[e.attack] : 'the President') : SOURCE[e.attack];
  e.stop = e.unblockable ? T.hitstop.heavy : T.hitstop.light;
  if (!hurtPlayer(w, p, a.damage, e.pos, e.unblockable, a.knock, source)) setPlayer(p, 'hitstun', a.stun);
}

// Choose the next swing, set its wind-up and whether it can be countered.
function pickSwing(w: World, e: Enemy): AttackName {
  const moves = T[e.kind].moves;
  if (e.kind === 'boss') return e.string === 2 && e.enraged ? 'charge' : moves[e.string];
  return moves[Math.floor(rand(w) * moves.length)];
}

function startWindup(e: Enemy) {
  const a = T.attacks[e.attack];
  e.unblockable = a.red;
  e.connected = false;
  let windup: number = a.windup;
  if (e.kind === 'boss' && e.enraged) windup = Math.round(windup * 0.8);
  setEnemy(e, 'windup', windup);
}

function attackersBusy(w: World) {
  return w.enemies.filter(e => e.state === 'approach' || e.state === 'windup' || e.state === 'active').length;
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
    if (pick) { setEnemy(pick, 'approach', 180); pick.attack = pickSwing(w, pick); }
  }

  for (const e of w.enemies) {
    const k = T[e.kind], a = T.attacks[e.attack];
    // Pick who to fight; once a swing has started, it stays on that player.
    if (e.state !== 'windup' && e.state !== 'active') {
      const near = nearestStanding(w, e.pos);
      if (near) e.focus = near.index;
    }
    const p = w.players[e.focus];
    if (e.stop > 0) { e.stop--; continue; }
    e.t++;
    if (e.cooldown > 0) e.cooldown--;
    e.pos.x += e.vel.x; e.pos.y += e.vel.y;
    const drag = e.state === 'down' || e.state === 'air' ? 0.86 : 0.82;
    e.vel.x *= drag; e.vel.y *= drag;
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
        // Circling looks alive: every couple of seconds he may switch direction, drift in or out
        // on his ring, or fake a step in.
        if (e.t % 100 === 1) {
          if (rand(w) < 0.35) e.orbit = -e.orbit;
          e.ring = (rand(w) - 0.5) * 1.4;
          if (rand(w) < 0.22) e.feint = 36;
        }
        e.angle += e.orbit * 0.008;
        const fake = e.feint > 0 ? 1.8 * Math.sin(Math.PI * (36 - e.feint) / 36) : 0;
        if (e.feint > 0) e.feint--;
        const r = k.circleRadius + e.ring - fake;
        const want = { x: p.pos.x + Math.cos(e.angle) * r, y: p.pos.y + Math.sin(e.angle) * r };
        move(want, speed * (fake > 0 ? 1.1 : 0.6));
        e.facing = toN;
        break;
      }
      case 'approach': {
        e.facing = toN;
        const ranged = a.lunge > 0 || e.attack === 'throw';
        const inRange = d <= a.from && (!ranged || clearLine(e.pos, p.pos, 0.3));
        if (inRange && standing(p)) { startWindup(e); w.events.push({ type: 'swing', pos: { ...e.pos }, attack: e.attack }); break; }
        move(p.pos, speed);
        if (e.t >= e.dur) { setEnemy(e, 'circle', 0); e.cooldown = k.cooldown; e.string = 0; }
        break;
      }
      case 'windup':
        if (e.dur - e.t > k.trackUntil) {
          e.facing = toN;
          if (a.lunge === 0 && e.attack !== 'throw' && d > a.from * 0.9) move(p.pos, speed * 0.5);
        }
        if (e.t >= e.dur) setEnemy(e, 'active', a.active);
        break;
      case 'active':
        if (e.attack === 'throw') {
          if (e.t === 1) {
            const start = { x: e.pos.x + e.facing.x * 0.6, y: e.pos.y + e.facing.y * 0.6 };
            w.cups.push({ id: w.nextId++, pos: start, vel: { x: e.facing.x * T.cup.speed, y: e.facing.y * T.cup.speed }, owner: -1, from: e.id });
            w.events.push({ type: 'throw', pos: start });
          }
        } else {
          // Lunging attacks travel along the line he committed to; a dodge sideways beats them.
          if (a.lunge > 0 && !e.connected) { e.pos.x += e.facing.x * a.lunge / a.active; e.pos.y += e.facing.y * a.lunge / a.active; }
          const cone = a.lunge > 0 ? 0.3 : 0.5;
          if (!e.connected && standing(p) && d <= a.reach && dot(e.facing, toN) > cone) {
            e.connected = true;
            if (!playerInvulnerable(p)) strike(w, p, e);
          }
        }
        if (e.state === 'active' && e.t >= e.dur) setEnemy(e, 'recover', a.recovery);
        break;
      case 'recover':
        if (e.t >= e.dur) {
          if (e.kind === 'boss') {
            // The string continues: hook, elbow, haymaker.
            e.string = (e.string + 1) % 3;
            if (e.string !== 0) { setEnemy(e, 'approach', 120); e.attack = pickSwing(w, e); break; }
          }
          setEnemy(e, 'circle', 0);
          e.cooldown = Math.round((k.cooldown + Math.floor(rand(w) * 40)) * (e.enraged ? 0.6 : 1));
        }
        break;
      case 'stun':
        if (e.t >= e.dur) { setEnemy(e, 'circle', 0); e.cooldown = Math.max(e.cooldown, 20); }
        break;
      case 'air':
        e.z += e.vz;
        e.vz -= T.air.gravity * (Math.abs(e.vz) < T.air.hangBelow ? T.air.hang : e.vz > 0 ? T.air.rise : T.air.fall);
        if (e.z <= 0 && e.vz < 0) { knockDown(e, T.air.landDown); e.slammed = true; }
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
  const { minX, maxX, minY, maxY } = activeLevel().bounds;
  return p.x < minX || p.x > maxX || p.y < minY || p.y > maxY || insideObstacle(p, -0.05);
}

function stepCups(w: World) {
  w.cups = w.cups.filter(c => {
    c.pos.x += c.vel.x; c.pos.y += c.vel.y;
    if (c.owner === -1) {
      const p = w.players.find(p => !playerInvulnerable(p) && dist(p.pos, c.pos) < T.cup.hitRadius);
      if (p) {
        if (!hurtPlayer(w, p, T.attacks.throw.damage, c.pos, false, T.attacks.throw.knock, 'red cups')) setPlayer(p, 'hitstun', T.attacks.throw.stun);
        w.events.push({ type: 'shatter', pos: { ...c.pos } });
        return false;
      }
    } else {
      const e = w.enemies.find(e => targetable(e) && dist(e.pos, c.pos) < T.cup.hitRadius + 0.1);
      if (e) {
        damageEnemy(w, e, T.cup.deflectDamage, { x: c.pos.x - c.vel.x * 5, y: c.pos.y - c.vel.y * 5 }, 5, 'down', 0, c.owner, true);
        e.stop = T.hitstop.bottle; w.shake = 0.25;
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
        damageEnemy(w, hit, T.bottle.damage, { x: b.pos.x - b.vel.x * 5, y: b.pos.y - b.vel.y * 5 }, 5, 'down', 0, b.holder, true);
        hit.stop = T.hitstop.bottle; w.shake = 0.25;
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
  const { minX, maxX, minY, maxY } = activeLevel().bounds;
  for (const e of w.enemies) {
    if (e.state !== 'down' || e.slammed || len(e.vel) < T.slam.speed) continue;
    const r = T[e.kind].radius;
    const wall = insideObstacle(e.pos, r * 0.6) || e.pos.x - r < minX || e.pos.x + r > maxX || e.pos.y - r < minY || e.pos.y + r > maxY;
    if (wall) {
      e.slammed = true;
      e.vel = { x: 0, y: 0 };
      e.hp -= T.slam.damage;
      if (e.lastHitBy >= 0) { w.stats[e.lastHitBy].slams++; addStyle(w, w.players[e.lastHitBy], 'slam'); }
      if (e.hp <= 0) { e.hp = 0; setEnemy(e, 'dead', 0); if (e.lastHitBy >= 0) w.stats[e.lastHitBy].kos++; w.events.push({ type: 'ko', pos: { ...e.pos }, boss: e.kind === 'boss' }); }
      else e.dur += T.slam.extraDown;
      e.stop = T.hitstop.heavy; w.shake = 0.4;
      w.events.push({ type: 'slam', pos: { ...e.pos } });
      continue;
    }
    for (const o of w.enemies) {
      if (o === e || !targetable(o) || o.kind === 'boss' || dist(o.pos, e.pos) > T[o.kind].radius + r) continue;
      damageEnemy(w, o, T.slam.bowlDamage, e.pos, 4, 'down', 0, e.lastHitBy, true);
      w.events.push({ type: 'hit', pos: { ...o.pos }, heavy: true, by: e.lastHitBy });
    }
  }
}

function separate(w: World) {
  const bodies: { pos: Vec; r: number; fixed: boolean }[] = [
    // An attacking player holds their ground: the crowd gives way instead of shoving them off target.
    // A player mid-evade slips through the crowd.
    ...w.players.filter(p => standing(p) && !(p.state === 'dodge' && playerInvulnerable(p))).map(p => ({ pos: p.pos, r: T.player.radius, fixed: p.state === 'counter' || p.state === 'attack' })),
    ...w.enemies.filter(e => alive(e) && e.state !== 'down' && !(e.state === 'air' && e.z > 0.5)).map(e => ({ pos: e.pos, r: T[e.kind].radius, fixed: e.kind === 'boss' })),
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
  const { minX, maxX, minY, maxY } = activeLevel().bounds;
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
  useStage(w.stage);
  w.frame++;
  w.shake *= 0.85;
  if (w.hitstop > 0) {
    w.hitstop--;
    // Keep presses made during hitstop so combos stay responsive.
    for (const p of w.players) {
      const input = inputFor(p), pressed = pressedAction(input);
      if (pressed && standing(p)) p.buffer = { action: pressed, frames: T.inputBuffer, mx: input.mx, my: input.my };
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
