// Dev page: strip.html?move=jab renders one move as a row of stills across its frame data, so
// animation can be reviewed without playing. Not part of the game build.
import * as THREE from 'three';
import { TUNING as T } from './sim/tuning';
import { createWorld, spawnEnemy, Player, Enemy, World } from './sim/world';
import { Figure } from './figure';
import { CLIPS, Pose } from './anim/pose';
import { playerPose, enemyPose } from './anim/moves';
import { CAST, thugLook } from './render';

const move = new URLSearchParams(location.search).get('move') ?? 'jab';
const view = new URLSearchParams(location.search).get('view') ?? 'side';
const w: World = createWorld(1);
const p: Player = w.players[0];
const e: Enemy = spawnEnemy(w, 'thug', { x: 0, y: 0 }, 'circle');
const face = new URLSearchParams(location.search).has('face');
const N = face ? 2 : 8;

// Each entry: total frames, and a function that sets up state for frame t and returns a pose.
// Player moves go by their tuning name (jab, uppercut, knee...), enemy attacks by theirs with
// an e- prefix (e-hook, e-flyingKnee...). ?lead=8 adds lunge travel frames to a player move.
const still = { distance: 0, speed: 0 };
const lead = Number(new URLSearchParams(location.search).get('lead') ?? 0);
const MOVES: Record<string, { total: number; pose: (t: number) => Pose }> = {};
for (const [name, s] of Object.entries(T.moves)) {
  MOVES[name] = {
    total: lead + s.startup + s.active + s.recovery,
    pose: t => { Object.assign(p, { state: 'attack', move: name, lead, t, target: 1, hasHit: false, hits: 0 }); return playerPose(p, w, still); },
  };
}
for (const [name, a] of Object.entries(T.attacks)) {
  MOVES[`e-${name}`] = {
    total: a.windup + a.active + a.recovery,
    pose: t => {
      Object.assign(e, { kind: 'thug', attack: name, unblockable: a.red });
      if (t < a.windup) Object.assign(e, { state: 'windup', t, dur: a.windup });
      else if (t < a.windup + a.active) Object.assign(e, { state: 'active', t: t - a.windup, dur: a.active });
      else Object.assign(e, { state: 'recover', t: t - a.windup - a.active, dur: a.recovery });
      return enemyPose(e, w, still);
    },
  };
}
function dodgeMove(kind: 'side' | 'back' | 'dash', dir: { x: number; y: number }) {
  const d = T.dodge[kind];
  return { total: d.frames, pose: (t: number) => { Object.assign(p, { state: 'dodge', t, dur: d.frames, dodgeKind: kind, dodgeDir: dir, facing: { x: 0, y: 1 } }); return playerPose(p, w, still); } };
}
Object.assign(MOVES, {
  counter: { total: T.counter.frames, pose: (t: number) => { Object.assign(p, { state: 'counter', t, dur: T.counter.frames }); return playerPose(p, w, still); } },
  'dodge-side': dodgeMove('side', { x: 1, y: 0 }),
  'dodge-back': dodgeMove('back', { x: 0, y: -1 }),
  'dodge-dash': dodgeMove('dash', { x: 0, y: 1 }),
  hitstun: { total: 20, pose: (t: number) => { Object.assign(p, { state: 'hitstun', t, dur: 20 }); return playerPose(p, w, still); } },
  run: { total: 40, pose: (t: number) => { Object.assign(p, { state: 'free' }); return playerPose(p, w, { distance: t * T.player.speed / 60, speed: 1 }); } },
  swagger: { total: 60, pose: (t: number) => { Object.assign(e, { state: 'circle', kind: 'thug' }); return enemyPose(e, w, { distance: t * 2 / 60, speed: 0.6 }); } },
  air: { total: 36, pose: (t: number) => { Object.assign(e, { state: 'air', t }); return enemyPose(e, w, still); } },
  knockdown: { total: 40, pose: (t: number) => { Object.assign(e, { state: 'down', t, dur: 70 }); return enemyPose(e, w, still); } },
  getup: { total: 20, pose: (t: number) => { Object.assign(e, { state: 'getup', t, dur: 20 }); return enemyPose(e, w, still); } },
});

// ?clip=name&from=a&to=b shows raw baked mocap frames, for choosing clip ranges.
const raw = new URLSearchParams(location.search).get('clip');
const rawFrom = Number(new URLSearchParams(location.search).get('from') ?? 0);
const rawTo = Number(new URLSearchParams(location.search).get('to') ?? (raw ? CLIPS[raw].frames.length - 1 : 0));
const m = raw ? { total: rawTo - rawFrom + 1, pose: (t: number) => CLIPS[raw].frames[rawFrom + t] } : MOVES[move];
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas')!, antialias: true });
renderer.setSize(face ? 680 : N * 170, face ? 340 : N * 34);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2a30);
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 1.5); sun.position.set(3, 5, 4); scene.add(sun);
const labels: string[] = [];
for (let i = 0; i < N; i++) {
  const t = Math.round((m.total - 1) * i / (N - 1));
  // ?who=thug|heavy|kicker|thrower|boss draws that enemy (id from the frame index) instead.
  const who = new URLSearchParams(location.search).get('who') as Enemy['kind'] | null;
  const fig = new Figure(who ? thugLook(who, i + 2) : CAST[face ? i : 0].look, CLIPS.guard.frames[0]);
  fig.root.scale.setScalar(1);
  fig.apply(face ? CLIPS.walk.frames[0] : m.pose(t));
  fig.root.position.x = i * 1.5;
  if (view === 'front') fig.root.rotation.y = 0; else fig.root.rotation.y = -Math.PI / 2 + 0.35;
  scene.add(fig.root);
  labels.push(`f${t}`);
}
const cam = new THREE.OrthographicCamera(-0.75, N * 1.5 - 0.75, 1.3, -1.1, 0.1, 50);
cam.position.set(0, 1, 10); cam.lookAt(0, 1, 0);
if (face) {
  // Head-and-shoulders portraits of the two players, front and three-quarter.
  scene.children.filter(o => o instanceof THREE.Group).forEach((g, i) => { g.rotation.y = i === 0 ? 0.35 : -0.35; g.position.x = i * 0.6; });
  Object.assign(cam, { left: -0.35, right: 0.95, top: 0.45, bottom: -0.2 });
  cam.position.set(0, 1.55, 10); cam.lookAt(0, 1.55, 0);
}
cam.updateProjectionMatrix();
renderer.render(scene, cam);
document.getElementById('l')!.textContent = `${move}: ${labels.join('  ')}  (startup/active/recovery = ${m.total} frames)`;
(window as unknown as { done: boolean }).done = true;
