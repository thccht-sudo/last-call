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

export function playerPose(p: Player, w: World, m: Motion): Pose {
  const time = w.frame;
  switch (p.state) {
    case 'free': {
      // Conrad runs proud, George runs active; both cover about 2.8 m per stride cycle.
      const clip = p.index === 0 ? CLIPS.runProud : CLIPS.runActive;
      return locomotion(clip, m.distance, m.speed, time, 2.8 / clip.stride);
    }
    case 'attack': {
      if (p.smash) { const s = T.combo[2]; return strike('slash', p.t, s.startup, s.active, s.recovery, time, Math.max(0, KEYS.slash - 14)); }
      // A bottle throw is a short attack that starts already marked as landed.
      if (p.target === null && p.hasHit && p.dur === 14) return strike('cross', p.t, 4, 2, 8, time);
      const s = T.combo[p.combo];
      const pose = strike(p.combo === 0 ? 'jab' : p.combo === 1 ? 'cross' : 'kick', p.t, s.startup, s.active, s.recovery, time);
      return pose;
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
      // Tuck into a ball and roll one full turn forward, coming up in guard.
      const u = clamp01(p.t / p.dur);
      const tuck = Math.sin(u * Math.PI);
      const pose = guard(time);
      placeFoot(pose, true, { x: 0.14, y: 0.35 * tuck, z: 0.3 * tuck });
      placeFoot(pose, false, { x: -0.14, y: 0.3 * tuck, z: 0.2 * tuck });
      reach(pose, true, { x: 0.16, y: 0.9 - 0.3 * tuck, z: 0.35 }); reach(pose, false, { x: -0.16, y: 0.9 - 0.3 * tuck, z: 0.35 });
      lean(pose, 1.1 * tuck);
      translate(pose, ALL, { y: -0.45 * tuck });
      rotate(pose, ALL, { x: 0, y: 0.45, z: 0 }, 'x', easeInOut(u) * Math.PI * 2);
      return pose;
    }
    case 'hitstun': return reel(time, p.t, p.dur);
    case 'grabbed': {
      const pose = guard(time);
      const f = Math.sin(time * 0.6);
      reach(pose, true, { x: 0.3, y: 1.75 + 0.15 * f, z: 0.2 }); reach(pose, false, { x: -0.3, y: 1.75 - 0.15 * f, z: 0.2 });
      placeFoot(pose, true, { x: 0.12, y: 0.12 + 0.1 * f, z: 0.1 }); placeFoot(pose, false, { x: -0.12, y: 0.12 - 0.1 * f, z: -0.05 });
      translate(pose, ALL, { y: 0.2 });
      return pose;
    }
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

const telegraph = { thug: 'cross', heavy: 'slash', boss: 'cross', grappler: 'cross', thrower: 'cross' } as const;

export function enemyPose(e: Enemy, w: World, m: Motion): Pose {
  const time = w.frame + e.id * 37; // desync idle breathing between enemies
  const walkClip = e.kind === 'heavy' || e.kind === 'boss' ? CLIPS.angry : CLIPS.swagger;
  switch (e.state) {
    case 'spawn': case 'circle': case 'approach':
      return locomotion(walkClip, m.distance, m.speed, time, e.state === 'approach' ? 1.6 : 1.2);
    case 'windup': case 'active': {
      // The wind-up spans the whole telegraph so the tell is readable; active holds contact.
      const u = e.state === 'windup' ? easeIn(clamp01(e.t / Math.max(1, e.dur))) : 1;
      if (e.kind === 'grappler') {
        // Arms spread wide, then a two-handed lunge.
        const pose = guard(time);
        const lunge = e.state === 'active' ? 1 : 0;
        reach(pose, true, { x: 0.75 - 0.55 * lunge, y: 1.3, z: 0.2 + 0.45 * lunge });
        reach(pose, false, { x: -0.75 + 0.55 * lunge, y: 1.3, z: 0.2 + 0.45 * lunge });
        lean(pose, 0.15 * u + 0.3 * lunge);
        return pose;
      }
      const clip = e.unblockable ? 'slash' : telegraph[e.kind];
      const contact = KEYS[clip];
      const startFrom = clip === 'slash' ? Math.max(0, contact - 18) : 0;
      const pose = sample(CLIPS[clip], startFrom + (contact - startFrom) * u);
      if (clip === 'cross' && e.state === 'windup') {
        // Exaggerate the tell: cock the right hand back and coil the shoulders away.
        const back = Math.sin(clamp01(e.t / Math.max(1, e.dur)) * Math.PI * 0.85);
        reach(pose, false, { x: -0.32, y: 1.4, z: -0.3 * back + 0.1 });
        rotate(pose, UPPER, get(pose, J.Hips), 'y', 0.5 * back);
        lean(pose, -0.12 * back);
      }
      return pose;
    }
    case 'recover': {
      const clip = e.unblockable ? 'slash' : telegraph[e.kind];
      const contact = KEYS[clip], end = clipEnd(CLIPS[clip]);
      const u = clamp01(e.t / Math.max(1, e.dur));
      return mix(sample(CLIPS[clip], contact + (end - contact) * u * 0.6), guard(time), easeOut(u));
    }
    case 'holding': {
      const pose = guard(time);
      reach(pose, true, { x: 0.18, y: 1.2, z: 0.55 }); reach(pose, false, { x: -0.18, y: 1.2, z: 0.55 });
      lean(pose, 0.1);
      return pose;
    }
    case 'stun': return reel(time, e.t, e.dur);
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
