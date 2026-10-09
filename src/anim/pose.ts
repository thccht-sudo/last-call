// Poses are 18 joint positions in character space: metres, y up, facing +z, the character's
// left on +x, hips over the origin. Mocap clips and procedural poses both produce them; the
// renderer hangs limbs between the points.
import mocap from './mocap.json';

export const J = {
  Hips: 0, Chest: 1, Neck: 2, Head: 3,
  ShL: 4, ElL: 5, HandL: 6, ShR: 7, ElR: 8, HandR: 9,
  HipL: 10, KneeL: 11, FootL: 12, HipR: 13, KneeR: 14, FootR: 15, ToeL: 16, ToeR: 17,
} as const;
export const JOINT_COUNT = 18;
export type Pose = Float32Array;

export interface Clip { frames: Pose[]; stride: number }

type Baked = { clips: Record<string, { frames: number[][]; stride?: number }> };
export const CLIPS: Record<string, Clip> = Object.fromEntries(
  Object.entries((mocap as unknown as Baked).clips).map(([name, c]) => [name, {
    stride: (c.stride ?? 0) / 1000,
    frames: c.frames.map(f => Float32Array.from(f, v => v / 1000)),
  }]),
);

export const newPose = (): Pose => new Float32Array(JOINT_COUNT * 3);
export const copy = (p: Pose): Pose => Float32Array.from(p);
export const get = (p: Pose, j: number) => ({ x: p[j * 3], y: p[j * 3 + 1], z: p[j * 3 + 2] });
export function set(p: Pose, j: number, v: { x: number; y: number; z: number }) { p[j * 3] = v.x; p[j * 3 + 1] = v.y; p[j * 3 + 2] = v.z; }

export function mix(a: Pose, b: Pose, k: number, out: Pose = newPose()): Pose {
  for (let i = 0; i < out.length; i++) out[i] = a[i] + (b[i] - a[i]) * k;
  return out;
}

// Frame f (fractional) of a clip, looping or clamped.
export function sample(clip: Clip, f: number, loop = false): Pose {
  const n = clip.frames.length;
  let x = loop ? ((f % n) + n) % n : Math.max(0, Math.min(n - 1, f));
  const i = Math.floor(x), k = x - i;
  const j = loop ? (i + 1) % n : Math.min(n - 1, i + 1);
  return mix(clip.frames[i], clip.frames[j], k);
}

// Rotate some joints about a pivot. axis is 'x' (pitch: positive leans forward), 'y' (yaw)
// or 'z' (roll).
export function rotate(p: Pose, joints: readonly number[], pivot: { x: number; y: number; z: number }, axis: 'x' | 'y' | 'z', angle: number) {
  const c = Math.cos(angle), s = Math.sin(angle);
  for (const j of joints) {
    const x = p[j * 3] - pivot.x, y = p[j * 3 + 1] - pivot.y, z = p[j * 3 + 2] - pivot.z;
    let nx = x, ny = y, nz = z;
    if (axis === 'x') { ny = y * c - z * s; nz = y * s + z * c; }
    else if (axis === 'y') { nx = x * c + z * s; nz = -x * s + z * c; }
    else { nx = x * c - y * s; ny = x * s + y * c; }
    p[j * 3] = nx + pivot.x; p[j * 3 + 1] = ny + pivot.y; p[j * 3 + 2] = nz + pivot.z;
  }
}

export function translate(p: Pose, joints: readonly number[], d: { x?: number; y?: number; z?: number }) {
  for (const j of joints) { p[j * 3] += d.x ?? 0; p[j * 3 + 1] += d.y ?? 0; p[j * 3 + 2] += d.z ?? 0; }
}

export const ALL = Array.from({ length: JOINT_COUNT }, (_, i) => i);
export const UPPER = [J.Chest, J.Neck, J.Head, J.ShL, J.ElL, J.HandL, J.ShR, J.ElR, J.HandR];
export const ARM_L = [J.ElL, J.HandL], ARM_R = [J.ElR, J.HandR];

const dist = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

// Two-bone IK: put `end` at target, bending `mid` toward the pole direction, keeping the bone
// lengths the pose already has.
export function ik(p: Pose, root: number, mid: number, end: number, target: { x: number; y: number; z: number }, pole: { x: number; y: number; z: number }) {
  const A = get(p, root), B = get(p, mid), C = get(p, end);
  const l1 = dist(A, B), l2 = dist(B, C);
  let dx = target.x - A.x, dy = target.y - A.y, dz = target.z - A.z;
  let d = Math.hypot(dx, dy, dz) || 1e-6;
  dx /= d; dy /= d; dz /= d;
  d = Math.max(Math.abs(l1 - l2) + 1e-3, Math.min(l1 + l2 - 1e-3, d));
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  // Pole direction made perpendicular to the reach direction.
  const pd = pole.x * dx + pole.y * dy + pole.z * dz;
  let px = pole.x - dx * pd, py = pole.y - dy * pd, pz = pole.z - dz * pd;
  const pl = Math.hypot(px, py, pz) || 1;
  px /= pl; py /= pl; pz /= pl;
  set(p, mid, { x: A.x + dx * a + px * h, y: A.y + dy * a + py * h, z: A.z + dz * a + pz * h });
  set(p, end, { x: A.x + dx * d, y: A.y + dy * d, z: A.z + dz * d });
}

// Move a foot and keep its toe with it.
export function placeFoot(p: Pose, left: boolean, target: { x: number; y: number; z: number }) {
  const [hip, knee, foot, toe] = left ? [J.HipL, J.KneeL, J.FootL, J.ToeL] : [J.HipR, J.KneeR, J.FootR, J.ToeR];
  const f0 = get(p, foot), t0 = get(p, toe);
  ik(p, hip, knee, foot, target, { x: 0, y: 0, z: 1 });
  const f1 = get(p, foot);
  set(p, toe, { x: t0.x + f1.x - f0.x, y: t0.y + f1.y - f0.y, z: t0.z + f1.z - f0.z });
}

export function reach(p: Pose, left: boolean, target: { x: number; y: number; z: number }, pole = { x: left ? 1 : -1, y: -0.6, z: -0.3 }) {
  ik(p, left ? J.ShL : J.ShR, left ? J.ElL : J.ElR, left ? J.HandL : J.HandR, target, pole);
}

// Lay a pose flat on its back (k = 1) around the feet.
export function fallBack(p: Pose, k: number) {
  if (k <= 0) return;
  rotate(p, ALL, { x: 0, y: 0, z: -0.15 }, 'x', -Math.PI / 2 * k);
  translate(p, ALL, { y: 0.12 * k });
}
