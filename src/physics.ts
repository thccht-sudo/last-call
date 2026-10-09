// Visual physics: ragdolls for knocked-down fighters and loose props that scatter. None of this
// feeds back into the fight simulation, so the game stays deterministic and online play stays in
// sync; each browser runs its own copy for looks.
import * as THREE from 'three';
import type { Box } from './sim/level';
import { J, JOINT_COUNT, Pose, newPose } from './anim/pose';

const GRAVITY = -9.8;

// How tall each kind of obstacle is, for things landing on top of it.
const HEIGHT: Record<Box['kind'], number> = { table: 0.8, fence: 1.1, post: 1.05, planter: 0.6, bar: 1.08, booth: 0.6 };

// Push a point out of any obstacle volume it has entered: onto the top if it came from above,
// otherwise out of the nearest side. Returns true if it is resting on top of something.
function solidify(p: THREE.Vector3, prev: THREE.Vector3, boxes: Box[], r: number): boolean {
  let onTop = false;
  for (const o of boxes) {
    const top = HEIGHT[o.kind];
    const hx = o.w / 2 + r, hz = o.h / 2 + r;
    if (Math.abs(p.x - o.x) >= hx || Math.abs(p.z - o.y) >= hz || p.y >= top + r) continue;
    if (prev.y >= top + r - 0.02) { p.y = top + r; onTop = true; continue; }
    const dx = hx - Math.abs(p.x - o.x), dz = hz - Math.abs(p.z - o.y);
    if (dx < dz) p.x = o.x + Math.sign(p.x - o.x || 1) * hx;
    else p.z = o.y + Math.sign(p.z - o.y || 1) * hz;
  }
  return onTop;
}

// Pairs of joints held at a fixed distance. Limbs, plus braces that keep the torso and pelvis
// from folding flat.
const LINKS: [number, number][] = [
  [J.Hips, J.Chest], [J.Chest, J.Neck], [J.Neck, J.Head],
  [J.Chest, J.ShL], [J.Chest, J.ShR], [J.ShL, J.ShR], [J.Neck, J.ShL], [J.Neck, J.ShR],
  [J.ShL, J.ElL], [J.ElL, J.HandL], [J.ShR, J.ElR], [J.ElR, J.HandR],
  [J.Hips, J.HipL], [J.Hips, J.HipR], [J.HipL, J.HipR], [J.Chest, J.HipL], [J.Chest, J.HipR], [J.Hips, J.ShL], [J.Hips, J.ShR],
  [J.HipL, J.KneeL], [J.KneeL, J.FootL], [J.HipR, J.KneeR], [J.KneeR, J.FootR], [J.FootL, J.ToeL], [J.FootR, J.ToeR],
  [J.Head, J.Chest],
];

export class Ragdoll {
  private p: THREE.Vector3[] = [];
  private prev: THREE.Vector3[] = [];
  private rest: number[] = [];
  private still = 0;

  // world: joint positions in world space; vel: launch velocity in m/s.
  constructor(world: THREE.Vector3[], vel: THREE.Vector3, spin: number) {
    const dt = 1 / 60;
    const hips = world[J.Hips];
    const flat = new THREE.Vector3(vel.x, 0, vel.z).normalize();
    world.forEach((w, i) => {
      this.p.push(w.clone());
      // Higher joints get a little extra speed along the launch so the body tips over as it
      // flies; knees kick the other way so the legs buckle instead of staying stiff.
      const lift = Math.max(0, w.y - hips.y);
      const v = vel.clone().addScaledVector(flat, lift * spin);
      if (i === J.KneeL || i === J.KneeR) v.addScaledVector(flat, -1.8).y -= 1;
      this.prev.push(w.clone().addScaledVector(v, -dt));
    });
    this.rest = LINKS.map(([a, b]) => world[a].distanceTo(world[b]));
  }

  get asleep() { return this.still > 90; }

  // anchor: where the simulation says the body is; the ragdoll is pulled gently toward it.
  step(boxes: Box[], anchor: { x: number; y: number }, dt = 1 / 60) {
    if (this.asleep) return;
    let motion = 0;
    for (let i = 0; i < JOINT_COUNT; i++) {
      const p = this.p[i], q = this.prev[i];
      const vx = (p.x - q.x) * 0.99, vy = (p.y - q.y) * 0.99, vz = (p.z - q.z) * 0.99;
      q.copy(p);
      // The trunk is heavier than the limbs: a body propped against something sags down it.
      const g = i === J.Hips || i === J.Chest ? 2.5 : 1;
      p.x += vx; p.y += vy + GRAVITY * g * dt * dt; p.z += vz;
      motion += Math.abs(vx) + Math.abs(vy) + Math.abs(vz);
    }
    for (let it = 0; it < 8; it++) {
      LINKS.forEach(([a, b], k) => {
        const pa = this.p[a], pb = this.p[b];
        const d = pb.clone().sub(pa), l = d.length() || 1e-6;
        const corr = d.multiplyScalar((l - this.rest[k]) / l * 0.5);
        pa.add(corr); pb.sub(corr);
      });
      for (let i = 0; i < JOINT_COUNT; i++) {
        const p = this.p[i], q = this.prev[i];
        const r = i === J.Head ? 0.11 : i === J.Hips || i === J.Chest ? 0.13 : 0.06;
        const onTop = solidify(p, q, boxes, r);
        if (p.y < r || onTop) {
          if (p.y < r) p.y = r;
          // Friction: lose most sideways speed on contact.
          q.x = p.x - (p.x - q.x) * 0.6; q.z = p.z - (p.z - q.z) * 0.6;
          if (q.y < p.y) q.y = p.y;
        }
      }
    }
    // Drift with the simulation's position so a body ends up where the fight thinks it is.
    const hips = this.p[J.Hips];
    const ax = (anchor.x - hips.x) * 0.06, az = (anchor.y - hips.z) * 0.06;
    for (const p of this.p) { p.x += ax; p.z += az; }
    this.still = motion < 0.004 * JOINT_COUNT ? this.still + 1 : 0;
  }

  // Joint positions converted into a figure's local space.
  toLocal(root: THREE.Object3D): Pose {
    const pose = newPose();
    const inv = root.matrixWorld.clone().invert();
    this.p.forEach((w, i) => {
      const l = w.clone().applyMatrix4(inv);
      pose[i * 3] = l.x; pose[i * 3 + 1] = l.y; pose[i * 3 + 2] = l.z;
    });
    return pose;
  }
}

// Loose things: stools, cans, cups, a trash can. They sleep where they were placed until a
// body, a slam or a knockout nearby knocks them flying.
export interface Prop {
  mesh: THREE.Object3D; radius: number; mass: number;
  home: { pos: THREE.Vector3; quat: THREE.Quaternion };
  vel: THREE.Vector3; spin: THREE.Vector3; awake: boolean; rest: number;
}

export function makeProp(mesh: THREE.Object3D, radius: number, mass = 1): Prop {
  return {
    mesh, radius, mass,
    home: { pos: mesh.position.clone(), quat: mesh.quaternion.clone() },
    vel: new THREE.Vector3(), spin: new THREE.Vector3(), awake: false, rest: mesh.position.y,
  };
}

export class Props {
  constructor(public list: Prop[]) {}

  reset() {
    for (const p of this.list) {
      p.mesh.position.copy(p.home.pos); p.mesh.quaternion.copy(p.home.quat);
      p.vel.set(0, 0, 0); p.spin.set(0, 0, 0); p.awake = false; p.rest = p.home.pos.y;
    }
  }

  // An outward shove from a point on the floor, strongest at the centre.
  blast(at: { x: number; y: number }, radius: number, strength: number) {
    for (const p of this.list) {
      const dx = p.mesh.position.x - at.x, dz = p.mesh.position.z - at.y;
      const d = Math.hypot(dx, dz);
      if (d > radius) continue;
      const k = strength * (1 - d / radius) / p.mass * 1.8;
      const nx = d > 1e-3 ? dx / d : Math.random() - 0.5, nz = d > 1e-3 ? dz / d : Math.random() - 0.5;
      p.vel.x += nx * k; p.vel.z += nz * k; p.vel.y += k * 1.1;
      p.spin.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 14).multiplyScalar(k / 3);
      p.awake = true;
    }
  }

  // Bodies walking into props nudge them along.
  nudge(at: { x: number; y: number }, move: { x: number; y: number }) {
    for (const p of this.list) {
      const dx = p.mesh.position.x - at.x, dz = p.mesh.position.z - at.y;
      if (Math.hypot(dx, dz) > 0.45 + p.radius || p.mesh.position.y > 0.6) continue;
      p.vel.x += move.x * 40 / p.mass; p.vel.z += move.y * 40 / p.mass; p.vel.y += 0.4 / p.mass;
      p.spin.y += (Math.random() - 0.5) * 4;
      p.awake = true;
    }
  }

  step(boxes: Box[], dt = 1 / 60) {
    const q = new THREE.Quaternion(), e = new THREE.Euler();
    for (const p of this.list) {
      if (!p.awake) continue;
      const pos = p.mesh.position, prev = pos.clone();
      p.vel.y += GRAVITY * dt;
      pos.addScaledVector(p.vel, dt);
      e.set(p.spin.x * dt, p.spin.y * dt, p.spin.z * dt);
      p.mesh.quaternion.premultiply(q.setFromEuler(e));
      const onTop = solidify(pos, prev, boxes, p.radius * 0.5);
      if (pos.y <= p.radius * 0.5 || onTop) {
        if (pos.y < p.radius * 0.5) pos.y = p.radius * 0.5;
        if (p.vel.y < 0) p.vel.y *= -0.3;
        p.vel.x *= 0.82; p.vel.z *= 0.82; p.spin.multiplyScalar(0.8);
        if (p.vel.length() < 0.15 && p.spin.length() < 0.5) { p.awake = false; p.vel.set(0, 0, 0); }
      }
    }
  }
}
