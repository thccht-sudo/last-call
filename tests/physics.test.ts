import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Ragdoll, Props, makeProp } from '../src/physics';
import { CLIPS, J } from '../src/anim/pose';
import { INSIDE } from '../src/sim/level';

const root = new THREE.Object3D();
root.updateMatrixWorld(true);
const standing = (x: number, z: number) =>
  Array.from({ length: 18 }, (_, i) => new THREE.Vector3(CLIPS.guard.frames[0][i * 3] + x, CLIPS.guard.frames[0][i * 3 + 1], CLIPS.guard.frames[0][i * 3 + 2] + z));

describe('ragdolls', () => {
  it('a launched body flies, lands, stays above the floor and comes to rest', () => {
    const rag = new Ragdoll(standing(0, 0), new THREE.Vector3(3, 4, 0), 3);
    let peak = 0;
    for (let i = 0; i < 600 && !rag.asleep; i++) {
      rag.step([], { x: 0, y: 0 });
      peak = Math.max(peak, rag.toLocal(root)[J.Hips * 3 + 1]);
    }
    const pose = rag.toLocal(root);
    expect(peak).toBeGreaterThan(1.2); // went up into an arc
    expect(rag.asleep).toBe(true);
    for (let j = 0; j < 18; j++) expect(pose[j * 3 + 1]).toBeGreaterThanOrEqual(0.05);
    expect(pose[J.Head * 3 + 1]).toBeLessThan(0.5); // lying down, not standing
  });

  it('a body thrown into the bar crumples against it without passing through', () => {
    const bar = INSIDE.obstacles.find(o => o.kind === 'bar')!;
    const rag = new Ragdoll(standing(bar.x + 1.2, bar.y), new THREE.Vector3(-3.5, 2.5, 0), 3);
    for (let i = 0; i < 600 && !rag.asleep; i++) {
      rag.step(INSIDE.obstacles, { x: bar.x + 0.9, y: bar.y });
      const pose = rag.toLocal(root);
      for (let j = 0; j < 18; j++) {
        const inside = Math.abs(pose[j * 3] - bar.x) < bar.w / 2 - 0.05 && pose[j * 3 + 1] < 1.0;
        expect(inside).toBe(false);
      }
    }
    expect(rag.asleep).toBe(true);
  });
});

describe('props', () => {
  it('a slam sends a stool flying and it settles on the floor', () => {
    const stool = new THREE.Object3D(); stool.position.set(1, 0.37, 0);
    const props = new Props([makeProp(stool, 0.35, 2)]);
    props.blast({ x: 0.3, y: 0 }, 1.8, 5);
    let maxY = 0;
    for (let i = 0; i < 600; i++) { props.step([]); maxY = Math.max(maxY, stool.position.y); }
    expect(stool.position.x).toBeGreaterThan(1.5);
    expect(maxY).toBeGreaterThan(0.6);
    expect(props.list[0].awake).toBe(false);
    props.reset();
    expect(stool.position.x).toBe(1);
  });
});
