// Turns simulation state into a pose. Attacks are mocap clips time-warped onto the move's frame
// data: wind-up plays over the startup frames, the contact pose holds through the active frames,
// and the follow-through plays over recovery while easing back to guard. Retune the frame data
// and the animation follows without being re-authored.
import { TUNING as T } from '../sim/tuning';
import type { Player, Enemy, World } from '../sim/world';
import { CLIPS, Clip, Pose, J, sample, mix, rotate, translate, reach, placeFoot, fallBack, get, copy, UPPER, ALL } from './pose';

// Contact frames are found from the data, so a re-bake can't silently misalign them.
function argmax(c: Clip, f: (p: Pose) => number, from = 0, to = c.frames.length) {
  let best = from, v = -Infinity;
  for (let i = from; i < to; i++) { const x = f(c.frames[i]); if (x > v) { v = x; best = i; } }
  return best;
}
const z = (p: Pose, j: number) => p[j * 3 + 2], y = (p: Pose, j: number) => p[j * 3 + 1];
const KEYS = {
  jab: argmax(CLIPS.jab, p => z(p, J.HandL)),
  cross: argmax(CLIPS.cross, p => z(p, J.HandR)),
  kick: argmax(CLIPS.kick, p => z(p, J.FootR) + y(p, J.FootR)),
  // The slash raises both hands overhead, then chops down: contact is the low point after the peak.
  slash: (() => { const top = argmax(CLIPS.slash, p => y(p, J.HandR)); return argmax(CLIPS.slash, p => -y(p, J.HandR), top, Math.min(CLIPS.slash.frames.length, top + 25)); })(),
  // Two-handed swing: hands come down from overhead; contact is where they reach furthest forward.
  swing: (() => { const top = argmax(CLIPS.swing, p => y(p, J.HandR)); return argmax(CLIPS.swing, p => z(p, J.HandR), top); })(),
};
const clipEnd = (c: Clip) => c.frames.length - 1;

const easeIn = (u: number) => u * u;
const easeOut = (u: number) => 1 - (1 - u) * (1 - u);
const easeInOut = (u: number) => u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
const clamp01 = (u: number) => Math.max(0, Math.min(1, u));

export function guard(time: number): Pose {
  // Ping-pong the short guard clip so the stance breathes without a seam.
  const n = CLIPS.guard.frames.length - 1;
  const f = time * 0.5 % (2 * n);
  return sample(CLIPS.guard, f < n ? f : 2 * n - f);
}

// An attack clip warped onto startup / active / recovery frames.
function strike(name: keyof typeof KEYS, t: number, startup: number, active: number, recovery: number, time: number, startFrom = 0): Pose {
  const clip = CLIPS[name], contact = KEYS[name], end = clipEnd(clip);
  if (t < startup) return sample(clip, startFrom + (contact - startFrom) * easeIn(t / Math.max(1, startup)));
  if (t < startup + active) return sample(clip, contact);
  const u = clamp01((t - startup - active) / Math.max(1, recovery));
  const p = sample(clip, contact + (end - contact) * easeOut(u));
  return mix(p, guard(time), clamp01((u - 0.5) * 2));
}

// Walk or run cycle advanced by distance travelled, blended with guard by speed.
function locomotion(clip: Clip, distance: number, speed: number, time: number, cadence: number): Pose {
  const n = clip.frames.length;
  const cyc = sample(clip, (distance / (clip.stride * cadence)) * n, true);
  return mix(guard(time), cyc, clamp01(speed * 1.6));
}

function lean(p: Pose, angle: number, axis: 'x' | 'z' = 'x') { rotate(p, UPPER, get(p, J.Hips), axis, angle); }

export interface Motion { distance: number; speed: number }

// Bend the knees by lowering everything, then putting the feet back where they were.
function crouch(p: Pose, by: number) {
  const fl = get(p, J.FootL), fr = get(p, J.FootR);
  translate(p, ALL, { y: -by });
  placeFoot(p, true, fl); placeFoot(p, false, fr);
}

// Phase of a move at frame t: 0..1 through the startup, then 1 through active, with `rec`
// running 0..1 over recovery.
function phase(t: number, startup: number, active: number, recovery: number) {
  const wind = clamp01(t / Math.max(1, startup));
  const rec = clamp01((t - startup - active) / Math.max(1, recovery));
  return { wind, rec, hit: t >= startup && t < startup + active };
}

// Procedural strikes, shared by players and enemies. k runs 0..1 into contact; `out` blends
// back to guard.
function flyingKnee(time: number, k: number, air: number): Pose {
  const pose = guard(time);
  translate(pose, ALL, { y: 0.45 * air });
  placeFoot(pose, false, { x: -0.12, y: 0.45 * air + 0.55 * k, z: 0.1 + 0.05 * k });
  placeFoot(pose, true, { x: 0.13, y: 0.45 * air + 0.05, z: -0.3 * k });
  reach(pose, true, { x: 0.2, y: 1.4 + 0.45 * air, z: 0.45 * k + 0.1 });
  reach(pose, false, { x: -0.2, y: 1.4 + 0.45 * air, z: 0.45 * k + 0.1 });
  lean(pose, 0.25 * k);
  return pose;
}

function shove(time: number, k: number): Pose {
  const pose = guard(time);
  const back = k < 0 ? -k : 0, push = Math.max(0, k);
  reach(pose, true, { x: 0.22, y: 1.3, z: 0.12 + 0.55 * push - 0.12 * back });
  reach(pose, false, { x: -0.22, y: 1.3, z: 0.12 + 0.55 * push - 0.12 * back });
  lean(pose, 0.35 * push - 0.25 * back);
  return pose;
}

// Horizontal elbow: the right arm comes up level with the shoulder, coils back, then whips across.
function elbow(time: number, coil: number, k: number): Pose {
  const pose = guard(time);
  rotate(pose, UPPER, get(pose, J.Hips), 'y', 0.9 * coil - 0.9 * k);
  const up = Math.max(coil, k);
  reach(pose, false, { x: -0.3 + 0.35 * k, y: 1.3 + 0.18 * up, z: 0.05 + 0.1 * k }, { x: -0.6, y: 0.3, z: 1 });
  lean(pose, 0.2 * k - 0.1 * coil);
  return pose;
}

function sweep(time: number, k: number, low: number): Pose {
  const pose = guard(time);
  crouch(pose, 0.38 * low);
  const a = -0.6 + 2.8 * k; // right foot arcs from behind-right to in front-left
  placeFoot(pose, false, { x: -0.85 * Math.cos(a), y: 0.07, z: 0.85 * Math.sin(a) });
  reach(pose, true, { x: 0.35, y: 0.95 - 0.5 * low, z: 0.3 });
  rotate(pose, ALL, get(pose, J.FootL), 'y', -0.8 * k);
  lean(pose, 0.35 * low);
  return pose;
}

function stomp(time: number, lift: number, k: number): Pose {
  const pose = guard(time);
  placeFoot(pose, false, { x: -0.13, y: 0.5 * lift * (1 - k) + 0.03, z: 0.25 + 0.3 * k });
  reach(pose, true, { x: 0.45, y: 1.2, z: 0.05 }); reach(pose, false, { x: -0.4, y: 1.25, z: -0.05 });
  lean(pose, 0.15 + 0.25 * k);
  rotate(pose, [J.Head], get(pose, J.Neck), 'x', 0.5);
  return pose;
}

// Rising strike: crouch, then drive a fist up through his chin.
function rising(time: number, wind: number, k: number, left: boolean): Pose {
  const pose = sample(CLIPS.cross, KEYS.cross * 0.3);
  crouch(pose, 0.22 * wind * (1 - k));
  translate(pose, ALL, { y: 0.06 * k });
  const side = left ? 1 : -1;
  reach(pose, left, { x: 0.12 * side, y: 0.95 + 1.0 * k, z: 0.25 + 0.25 * k }, { x: 0.5 * side, y: -1, z: 0 });
  rotate(pose, UPPER, get(pose, J.Hips), 'y', side * (-0.4 * wind * (1 - k) + 0.3 * k));
  lean(pose, -0.18 * k + 0.15 * wind * (1 - k));
  return pose;
}

// An evade step in local direction (dx left, dz forward). u runs 0..1 over the dodge.
function evade(time: number, u: number, dx: number, dz: number): Pose {
  const pose = guard(time);
  const load = u < 0.12 ? u / 0.12 : Math.max(0, 1 - (u - 0.12) / 0.25); // knees bend, then drive
  const air = Math.sin(clamp01((u - 0.08) / 0.62) * Math.PI); // feet skim off the floor
  const land = clamp01((u - 0.7) / 0.3);
  crouch(pose, 0.1 * load + 0.07 * land * (1 - land) * 4);
  translate(pose, ALL, { y: 0.06 * air });
  // The lead foot reaches along the step, the trail foot pushes off and follows.
  const leadLeft = dx > 0.3 || (Math.abs(dx) <= 0.3 && dz >= 0);
  const reachOut = Math.sin(clamp01(u / 0.7) * Math.PI * 0.5);
  const base = (left: boolean) => ({ x: left ? 0.14 : -0.14, z: left ? 0.06 : -0.06 });
  for (const left of [true, false]) {
    const b = base(left), lead = left === leadLeft;
    const k = lead ? 0.34 * reachOut * (1 - land * 0.5) : -0.22 * (1 - reachOut);
    placeFoot(pose, left, { x: b.x + dx * k, y: 0.04 + (lead ? 0.16 : 0.1) * air, z: b.z + dz * k });
  }
  // Lean into the direction of travel, shoulders leading.
  const leanAmt = 0.45 * Math.sin(clamp01(u / 0.8) * Math.PI);
  lean(pose, leanAmt * dz);
  rotate(pose, UPPER, get(pose, J.Hips), 'z', -leanAmt * dx);
  rotate(pose, UPPER, get(pose, J.Hips), 'y', 0.25 * dx * leanAmt);
  reach(pose, true, { x: 0.22 + 0.1 * dx * air, y: 1.32, z: 0.22 }); reach(pose, false, { x: -0.22 + 0.1 * dx * air, y: 1.32, z: 0.22 });
  return pose;
}

// Sprinting into range at the start of a long lunge.
function dash(distance: number): Pose {
  // Stepped by distance covered, at a long lunging stride.
  const pose = sample(CLIPS.dash, distance / (CLIPS.dash.stride * 1.8) * CLIPS.dash.frames.length, true);
  lean(pose, 0.2);
  return pose;
}

const settle = (pose: Pose, rec: number, time: number) => mix(pose, guard(time), easeInOut(rec));

export function playerPose(p: Player, w: World, m: Motion): Pose {
  const time = w.frame;
  switch (p.state) {
    case 'free': {
      // A sprint cycle stretched a little (2.2 m per stride) so the feet roughly keep up with the
      // ground at 6.5 m/s.
      return locomotion(CLIPS.dash, m.distance, m.speed, time, 2.2 / CLIPS.dash.stride);
    }
    case 'attack': {
      const s = T.moves[p.move], t = p.t - p.lead;
      if (t < 0) return dash(m.distance);
      const { wind, rec, hit } = phase(t, s.startup, s.active, s.recovery);
      const k = hit || rec > 0 ? 1 : easeIn(wind);
      switch (p.move) {
        case 'jab': return strike('jab', t, s.startup, s.active, s.recovery, time);
        case 'cross': return strike('cross', t, s.startup, s.active, s.recovery, time);
        case 'roundhouse': return strike('kick', t, s.startup, s.active, s.recovery, time);
        case 'smash': return strike('slash', t, s.startup, s.active, s.recovery, time, Math.max(0, KEYS.slash - 14));
        case 'throw': return strike('cross', t, s.startup, s.active, s.recovery, time);
        case 'spike': return strike('swing', t, s.startup, s.active, s.recovery, time, Math.max(0, KEYS.swing - 16));
        case 'juggle': {
          // Alternate hands, punching up at a man in the air.
          const n = p.hasHit ? p.hits - 1 : p.hits; // the hand stays the same through the hit
          const pose = strike(n % 2 ? 'cross' : 'jab', t, s.startup, s.active, s.recovery, time);
          const left = n % 2 === 0;
          if (rec < 1) reach(pose, left, { x: left ? 0.15 : -0.15, y: 1.45 + 0.4 * k * (1 - rec), z: 0.3 + 0.3 * k * (1 - rec) });
          lean(pose, -0.15 * k * (1 - rec));
          return pose;
        }
        case 'uppercut': return settle(rising(time, wind, k, false), rec, time);
        case 'riposte': return settle(rising(time, wind, k, true), rec, time); // the other hand
        case 'sweep': return settle(sweep(time, hit || rec > 0 ? 0.6 + 0.4 * clamp01((t - s.startup) / s.active) : 0.6 * easeIn(wind), Math.min(1, wind * 2)), rec, time);
        case 'knee': return settle(flyingKnee(time, k, Math.sin(clamp01(t / (s.startup + s.active + 4)) * Math.PI)), rec, time);
        case 'stomp': return settle(stomp(time, wind, hit || rec > 0 ? 1 : 0), rec, time);
      }
      return guard(time);
    }
    case 'counter': {
      // A fast cross with extra twist through the hips.
      const pose = strike('cross', p.t, 3, 6, Math.max(4, p.dur - 9), time);
      rotate(pose, UPPER, get(pose, J.Hips), 'y', -0.35 * (1 - clamp01(p.t / p.dur)));
      return pose;
    }
    case 'whiff': {
      const pose = guard(time);
      const k = Math.sin(clamp01(p.t / p.dur) * Math.PI);
      reach(pose, true, { x: 0.45, y: 1.45, z: 0.25 }); reach(pose, false, { x: -0.45, y: 1.45, z: 0.25 });
      lean(pose, -0.35 * k);
      return pose;
    }
    case 'dodge': {
      // Evade relative to facing: load, drive off the far foot, lean into the step, land.
      const side = { x: p.facing.y, y: -p.facing.x }; // the character's left, in the sim plane
      return evade(time, clamp01(p.t / p.dur), p.dodgeDir.x * side.x + p.dodgeDir.y * side.y, p.dodgeDir.x * p.facing.x + p.dodgeDir.y * p.facing.y);
    }
    case 'hitstun': return reel(time, p.t, p.dur);
    case 'down': return downed(time, 1);
  }
}

// Knocked back: head snaps, chest goes back, arms fly loose, then recovers to guard.
function reel(time: number, t: number, dur: number): Pose {
  const pose = guard(time);
  const k = Math.sin(clamp01(t / Math.max(1, dur)) * Math.PI) * (t < 4 ? t / 4 : 1);
  lean(pose, -0.5 * k);
  rotate(pose, [J.Head], get(pose, J.Neck), 'x', -0.6 * k);
  reach(pose, true, { x: 0.45, y: 1.0, z: -0.15 * k + 0.1 }); reach(pose, false, { x: -0.45, y: 1.05, z: -0.15 * k + 0.1 });
  return mix(guard(time), pose, Math.min(1, k * 1.5));
}

function downed(time: number, k: number): Pose {
  const pose = guard(time);
  reach(pose, true, { x: 0.6, y: 1.1, z: 0 }); reach(pose, false, { x: -0.6, y: 1.15, z: 0.05 });
  placeFoot(pose, true, { x: 0.25, y: 0, z: 0.1 }); placeFoot(pose, false, { x: -0.2, y: 0, z: -0.05 });
  fallBack(pose, k);
  return pose;
}

// Knocked down: a short flight backwards with a spin of the shoulders, then flat.
function knockedDown(time: number, t: number): Pose {
  const k = easeOut(clamp01(t / 10));
  const pose = downed(time, k);
  rotate(pose, UPPER, get(pose, J.Hips), 'y', 0.6 * (1 - k));
  return pose;
}

// Launched: tipped back and flailing; the renderer lifts him to his height off the floor.
function airborne(time: number, t: number): Pose {
  const pose = guard(time);
  const f = Math.sin(t * 0.5);
  reach(pose, true, { x: 0.55, y: 1.5 + 0.15 * f, z: -0.1 }); reach(pose, false, { x: -0.55, y: 1.5 - 0.15 * f, z: -0.1 });
  placeFoot(pose, true, { x: 0.15, y: 0.25 + 0.1 * f, z: 0.2 }); placeFoot(pose, false, { x: -0.15, y: 0.2 - 0.1 * f, z: 0.3 });
  fallBack(pose, Math.min(0.55, t / 20));
  return pose;
}

// Enemy swing at frame t of wind-up + active + recovery.
function enemyStrike(e: Enemy, time: number): Pose {
  const a = T.attacks[e.attack];
  const t = e.state === 'windup' ? e.t : e.state === 'active' ? a.windup + e.t : a.windup + a.active + e.t;
  const windup = e.state === 'windup' ? e.dur : a.windup; // the boss winds up faster when enraged
  const { wind, rec, hit } = phase(e.state === 'windup' ? e.t * a.windup / Math.max(1, windup) : t, a.windup, a.active, a.recovery);
  const k = hit || rec > 0 ? 1 : 0;
  switch (e.attack) {
    case 'kick': {
      // Only the chamber plays over the long wind-up, leaning back so the knee rising reads.
      const pose = strike('kick', wind * a.windup + (k ? t - a.windup : 0), a.windup, a.active, a.recovery, time, KEYS.kick - 12);
      if (!k) lean(pose, -0.2 * wind);
      return pose;
    }
    case 'haymaker': {
      const contact = KEYS.slash, from = Math.max(0, contact - 18);
      if (!k) return sample(CLIPS.slash, from + (contact - from) * easeIn(wind));
      return mix(sample(CLIPS.slash, contact + (clipEnd(CLIPS.slash) - contact) * rec * 0.6), guard(time), easeOut(rec));
    }
    case 'shove': return settle(shove(time, k ? 1 : -Math.sin(wind * Math.PI * 0.5)), rec, time);
    case 'elbow': return settle(elbow(time, k ? 0 : Math.sin(wind * Math.PI * 0.5), k), rec, time);
    case 'spinKick': {
      // Turns his back on you through the wind-up (the tell), then the heel comes round.
      const pose = strike('kick', wind * a.windup * 0.8 + (k ? t - a.windup : 0), a.windup, a.active, a.recovery, time);
      if (!k) rotate(pose, ALL, { x: 0, y: 0, z: 0 }, 'y', -2.6 * easeIn(wind));
      return pose;
    }
    case 'charge': {
      // Head down, shoulder first.
      const pose = k && rec === 0 ? dash(e.t * T.attacks.charge.lunge / T.attacks.charge.active) : guard(time);
      if (!k) crouch(pose, 0.2 * wind);
      rotate(pose, UPPER, get(pose, J.Hips), 'y', 0.7 * (k ? 1 - rec : wind));
      lean(pose, 0.45 * (k ? 1 - rec : wind));
      reach(pose, true, { x: 0.15, y: 1.25, z: 0.3 }); reach(pose, false, { x: -0.25, y: 1.2, z: 0.05 });
      return pose;
    }
    case 'flyingKnee': {
      if (!k) { const pose = flyingKnee(time, 0, 0); crouch(pose, 0.25 * wind); reach(pose, true, { x: 0.3, y: 1.1, z: -0.3 * wind }); reach(pose, false, { x: -0.3, y: 1.1, z: -0.3 * wind }); return pose; }
      const air = rec > 0 ? 0 : Math.sin(clamp01(e.t / a.active) * Math.PI);
      return settle(flyingKnee(time, 1, air), rec, time);
    }
    default: {
      // Hook (and the cup throw): a cocked right hand, coiled shoulders, then the cross.
      const pose = sample(CLIPS.cross, KEYS.cross * (k ? 1 : easeIn(wind)));
      if (!k) {
        const back = Math.sin(wind * Math.PI * 0.85);
        reach(pose, false, { x: -0.32, y: 1.4, z: -0.3 * back + 0.1 });
        rotate(pose, UPPER, get(pose, J.Hips), 'y', 0.5 * back);
        lean(pose, -0.12 * back);
        return pose;
      }
      if (rec === 0) return pose;
      return mix(sample(CLIPS.cross, KEYS.cross + (clipEnd(CLIPS.cross) - KEYS.cross) * rec * 0.6), guard(time), easeOut(rec));
    }
  }
}

export function enemyPose(e: Enemy, w: World, m: Motion): Pose {
  const time = w.frame + e.id * 37; // desync idle breathing between enemies
  const walkClip = e.kind === 'heavy' || e.kind === 'boss' ? CLIPS.angry : CLIPS.swagger;
  switch (e.state) {
    case 'spawn': case 'circle': case 'approach': {
      const pose = locomotion(walkClip, m.distance, m.speed, time, 1);
      // Now and then a circling enemy throws an arm up: "come on!" (mocap, upper body only).
      const phase = (e.t + e.id * 97) % 520;
      if (e.state === 'circle' && e.t > 40 && phase < 150 && !(e.feint > 0)) {
        const k = Math.sin(Math.PI * phase / 150) ** 0.5;
        const g = sample(CLIPS.taunt, 15 + phase * 0.55);
        for (const j of UPPER) for (let c = 0; c < 3; c++) pose[j * 3 + c] += (g[j * 3 + c] - pose[j * 3 + c]) * k;
      }
      return pose;
    }
    case 'windup': case 'active': case 'recover': return enemyStrike(e, time);
    case 'stun': return reel(time, e.t, e.dur);
    case 'air': return airborne(time, e.t);
    case 'down': return knockedDown(time, e.t);
    case 'getup': {
      const u = clamp01(e.t / e.dur);
      return mix(downed(time, 1), guard(time), easeIn(u));
    }
    case 'dead': return knockedDown(time, e.t);
  }
}


// Short crossfades between states so nothing pops, except into a strike's contact frame.
export class Blender {
  private prev: Pose | null = null;
  get last() { return this.prev; }
  private from: Pose | null = null;
  private state = '';
  private t = 0;
  next(state: string, target: Pose, snap = false): Pose {
    if (state !== this.state) {
      this.from = this.prev ? copy(this.prev) : null;
      this.state = state; this.t = 0;
    }
    this.t++;
    const n = snap ? 2 : 6;
    const out = this.from && this.t < n ? mix(this.from, target, easeOut(this.t / n)) : target;
    this.prev = out;
    return out;
  }
}
