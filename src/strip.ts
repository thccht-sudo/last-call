// Dev page: strip.html?move=jab renders one move as a row of stills across its frame data, so
// animation can be reviewed without playing. Not part of the game build.
import * as THREE from 'three';
import { TUNING as T } from './sim/tuning';
import { createWorld, spawnEnemy, Player, Enemy, World } from './sim/world';
import { Figure } from './figure';
import { CLIPS, Pose } from './anim/pose';
import { playerPose, enemyPose } from './anim/moves';
import { CAST } from './render';

const move = new URLSearchParams(location.search).get('move') ?? 'jab';
const view = new URLSearchParams(location.search).get('view') ?? 'side';
const w: World = createWorld(1);
const p: Player = w.players[0];
const e: Enemy = spawnEnemy(w, 'thug', { x: 0, y: 0 }, 'circle');
const N = 8;

// Each entry: total frames, and a function that sets up state for frame t and returns a pose.
const still = { distance: 0, speed: 0 };
const atk = (combo: number) => {
  const s = T.combo[combo];
  return { total: s.startup + s.active + s.recovery, pose: (t: number) => { Object.assign(p, { state: 'attack', combo, t, smash: false, target: 1, hasHit: false }); return playerPose(p, w, still); } };
};
const enemyAtk = (kind: Enemy['kind'], unblockable: boolean) => {
  const k = T[kind];
  return {
    total: k.windup + k.active + k.recovery,
    pose: (t: number) => {
      Object.assign(e, { kind, unblockable });
      if (t < k.windup) Object.assign(e, { state: 'windup', t, dur: k.windup });
      else if (t < k.windup + k.active) Object.assign(e, { state: 'active', t: t - k.windup, dur: k.active });
      else Object.assign(e, { state: 'recover', t: t - k.windup - k.active, dur: k.recovery });
      return enemyPose(e, w, still);
    },
  };
};
const MOVES: Record<string, { total: number; pose: (t: number) => Pose }> = {
  jab: atk(0), cross: atk(1), kick: atk(2),
  smash: { total: 32, pose: t => { Object.assign(p, { state: 'attack', combo: 2, t, smash: true }); return playerPose(p, w, still); } },
  counter: { total: T.counter.frames, pose: t => { Object.assign(p, { state: 'counter', t, dur: T.counter.frames }); return playerPose(p, w, still); } },
  dodge: { total: T.dodge.frames, pose: t => { Object.assign(p, { state: 'dodge', t, dur: T.dodge.frames }); return playerPose(p, w, still); } },
  hitstun: { total: 20, pose: t => { Object.assign(p, { state: 'hitstun', t, dur: 20 }); return playerPose(p, w, still); } },
  grabbed: { total: 30, pose: t => { Object.assign(p, { state: 'grabbed', t }); w.frame = t; return playerPose(p, w, still); } },
  run: { total: 40, pose: t => { Object.assign(p, { state: 'free' }); return playerPose(p, w, { distance: t * T.player.speed / 60, speed: 1 }); } },
  swagger: { total: 60, pose: t => { Object.assign(e, { state: 'circle', kind: 'thug' }); return enemyPose(e, w, { distance: t * 2 / 60, speed: 0.6 }); } },
  enemyJab: enemyAtk('thug', false), haymaker: enemyAtk('heavy', true), grapple: enemyAtk('grappler', true), throw: enemyAtk('thrower', false),
  knockdown: { total: 40, pose: t => { Object.assign(e, { state: 'down', t, dur: 70 }); return enemyPose(e, w, still); } },
  getup: { total: 20, pose: t => { Object.assign(e, { state: 'getup', t, dur: 20 }); return enemyPose(e, w, still); } },
};

const m = MOVES[move];
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas')!, antialias: true });
renderer.setSize(N * 170, N * 34);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2a30);
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 1.5); sun.position.set(3, 5, 4); scene.add(sun);
const labels: string[] = [];
for (let i = 0; i < N; i++) {
  const t = Math.round((m.total - 1) * i / (N - 1));
  const fig = new Figure(CAST[0].look, CLIPS.guard.frames[0]);
  fig.root.scale.setScalar(1);
  fig.apply(m.pose(t));
  fig.root.position.x = i * 1.5;
  if (view === 'front') fig.root.rotation.y = 0; else fig.root.rotation.y = -Math.PI / 2 + 0.35;
  scene.add(fig.root);
  labels.push(`f${t}`);
}
const cam = new THREE.OrthographicCamera(-0.75, N * 1.5 - 0.75, 1.3, -1.1, 0.1, 50);
cam.position.set(0, 1, 10); cam.lookAt(0, 1, 0);
cam.left = -0.75; cam.right = N * 1.5 - 0.75; cam.updateProjectionMatrix();
renderer.render(scene, cam);
document.getElementById('l')!.textContent = `${move}: ${labels.join('  ')}  (startup/active/recovery = ${m.total} frames)`;
(window as unknown as { done: boolean }).done = true;
