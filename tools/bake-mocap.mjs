// Bakes BVH motion capture into joint positions the game poses its figures from.
// Source: Bandai Namco Research Motion Dataset 1 (CC BY-NC 4.0),
// https://github.com/BandaiNamcoResearchInc/Bandai-Namco-Research-Motiondataset
// Usage: node tools/bake-mocap.mjs <dataset-1/data dir> <out.json> name=file[@start-end][~] ...
// A trailing ~ trims the clip to its best loop, for walk and run cycles.
// Positions are metres in character space: hips over the origin at frame 0, facing +z, y up.
import { readFileSync, writeFileSync } from 'node:fs';
import * as THREE from 'three';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader.js';

export const JOINTS = ['Hips', 'Chest', 'Neck', 'Head', 'UpperArm_L', 'LowerArm_L', 'Hand_L', 'UpperArm_R', 'LowerArm_R', 'Hand_R',
  'UpperLeg_L', 'LowerLeg_L', 'Foot_L', 'UpperLeg_R', 'LowerLeg_R', 'Foot_R', 'Toes_L', 'Toes_R'];

const [dir, out, ...specs] = process.argv.slice(2);
const clips = {};
for (const spec of specs) {
  const [name, rest] = spec.split('=');
  const loop = rest.endsWith('~');
  const [file, range] = rest.replace(/~$/, '').split('@');
  const bvh = new BVHLoader().parse(readFileSync(`${dir}/${file}.bvh`, 'utf8'));
  const root = bvh.skeleton.bones[0];
  const byName = Object.fromEntries(bvh.skeleton.bones.map(b => [b.name, b]));
  const mixer = new THREE.AnimationMixer(root);
  mixer.clipAction(bvh.clip).play();
  const fps = 30, total = Math.round(bvh.clip.duration * fps);
  const [a, b] = range ? range.split('-').map(Number) : [0, total];
  const v = new THREE.Vector3();
  const raw = [];
  for (let f = a; f < Math.min(b, total); f++) {
    mixer.setTime(f / fps);
    root.updateMatrixWorld(true);
    raw.push(JOINTS.map(j => byName[j].getWorldPosition(v).toArray()));
  }
  // Normalise: facing +z, hips over the origin on every frame (the simulation owns movement),
  // feet on the ground, scaled so a standing hip is 0.95 m high.
  const V = (p) => new THREE.Vector3(...p);
  const f0 = raw[0];
  const right = V(f0[13]).sub(V(f0[10])).setY(0).normalize();
  const fwd = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), right).normalize();
  const rot = new THREE.Matrix4().makeRotationY(-Math.atan2(fwd.x, fwd.z));
  const floor = Math.min(...raw.map(fr => Math.min(fr[12][1], fr[15][1], fr[16][1], fr[17][1])));
  const scale = 0.95 / (f0[0][1] - floor);
  const frames = raw.map(fr => fr.map(([x, y, z]) => {
    const p = new THREE.Vector3(x - fr[0][0], y - floor, z - fr[0][2]).applyMatrix4(rot).multiplyScalar(scale);
    return [Math.round(p.x * 1000), Math.round(p.y * 1000), Math.round(p.z * 1000)];
  }).flat());
  let stride = 0;
  if (loop) {
    // Clips start and end standing still, so find one full gait cycle in the middle: the frame
    // 20-60 frames after a mid-clip reference that best matches it.
    const ref = frames.length > 60 ? Math.floor(frames.length * 0.4) : 0;
    let best = frames.length, bestD = Infinity;
    for (let k = ref + 14; k < Math.min(frames.length, ref + 60); k++) {
      let d = 0;
      for (let i = 0; i < frames[ref].length; i++) d += (frames[k][i] - frames[ref][i]) ** 2;
      if (d < bestD) { bestD = d; best = k; }
    }
    frames.splice(0, frames.length, ...frames.slice(ref, best));
    const h0 = raw[ref][0], h1 = raw[best][0];
    stride = Math.round(Math.hypot(h1[0] - h0[0], h1[2] - h0[2]) * scale * 1000);
  }
  clips[name] = stride ? { fps, stride, frames } : { fps, frames };
  console.log(name, file, `${frames.length} frames`, stride ? `stride ${stride} mm` : '');
}
writeFileSync(out, JSON.stringify({ joints: JOINTS, units: 'mm', source: 'Bandai Namco Research Motion Dataset 1, CC BY-NC 4.0', clips }));
