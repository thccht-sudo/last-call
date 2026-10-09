// The Salt Shed, Chicago, for the endless mode: the old Morton Salt warehouse turned concert
// hall. From sources: a cavernous shed under a timber A-frame whose beams and trusses are
// up-lit, concrete walls at the base, a general-admission floor in front of the stage, bars,
// and a grandstand facing the stage (behind the camera here). On stage, The Hold Ready: a
// frontman in glasses who talks between songs and flails his free arm, two guitarists, a
// keyboard player with a moustache and a drummer, under a lighting truss and an LED wall that
// counts the songs. The east side and the barricade corner are packed with fans. The front
// (toward the camera) is cut away like a dollhouse.
import * as THREE from 'three';
import { CONCERT } from '../sim/level';
import type { World } from '../sim/world';
import { canvasTex, rnd } from './kilroys';
import { makeProp, Prop } from '../physics';
import { Figure, Look } from '../figure';
import { CLIPS, Pose, J, copy, translate, rotate, reach, get, UPPER } from '../anim/pose';
import { songLabel } from '../setlist';

const KNEE = 2.8, APEX = 15.5, HALF = 12.2; // concrete base wall, ridge height, half-width at the floor
const STAGE_H = 1.3, STAGE_FRONT = -5.0, BACK = -10.2;
const BPM = 140;

const concreteTex = (repeat: [number, number]) => canvasTex(256, 256, g => {
  g.fillStyle = '#56565a'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    const v = 70 + rnd() * 40;
    g.fillStyle = `rgba(${v | 0},${v | 0},${(v + 6) | 0},0.5)`;
    g.fillRect(rnd() * 256, rnd() * 256, 1 + rnd() * 3, 1 + rnd() * 3);
  }
  // Sawn joints and a few beer stains.
  g.fillStyle = 'rgba(20,20,22,0.6)'; g.fillRect(0, 127, 256, 2); g.fillRect(127, 0, 2, 256);
  for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(60,44,20,${0.15 + rnd() * 0.15})`; g.beginPath(); g.arc(rnd() * 256, rnd() * 256, 6 + rnd() * 14, 0, Math.PI * 2); g.fill(); }
}, repeat);

// Old timber boards, the inside of the A-frame.
const boardTex = (repeat: [number, number]) => canvasTex(256, 256, g => {
  for (let x = 0; x < 256; x += 16) {
    const v = rnd();
    g.fillStyle = `rgb(${(96 + v * 40) | 0},${(62 + v * 26) | 0},${(38 + v * 16) | 0})`;
    g.fillRect(x, 0, 15, 256);
    g.fillStyle = 'rgba(20,10,4,0.55)'; g.fillRect(x + 15, 0, 1, 256);
    for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(40,22,10,${0.2 + rnd() * 0.2})`; g.fillRect(x + rnd() * 14, rnd() * 256, 1, 20 + rnd() * 60); }
  }
}, repeat);

const grilleTex = () => canvasTex(128, 128, g => {
  g.fillStyle = '#141414'; g.fillRect(0, 0, 128, 128);
  g.strokeStyle = '#2a2a2a'; g.lineWidth = 1;
  for (let i = 0; i < 128; i += 4) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(128, i); g.stroke(); }
  g.fillStyle = '#e8e2d0'; g.font = 'italic 900 18px Georgia, serif'; g.fillText('Hold', 46, 20);
});

const keysTex = () => canvasTex(512, 64, g => {
  g.fillStyle = '#f4f1ea'; g.fillRect(0, 0, 512, 64);
  g.fillStyle = '#222';
  for (let i = 0; i < 512; i += 12) g.fillRect(i, 0, 1, 64);
  for (let i = 0; i < 43; i++) if ([1, 2, 4, 5, 6].includes(i % 7)) g.fillRect(i * 12 - 4, 0, 8, 38);
});

const kickTex = () => canvasTex(256, 256, g => {
  g.fillStyle = '#f2ece0'; g.beginPath(); g.arc(128, 128, 126, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1a1a1a'; g.textAlign = 'center';
  g.font = 'italic 900 40px Georgia, serif'; g.fillText('The Hold', 128, 112);
  g.font = 'italic 900 52px Georgia, serif'; g.fillText('Ready', 128, 166);
});

const letteringTex = (text: string, w: number, h: number, font: string, color = '#f4f1ea') => canvasTex(w, h, g => {
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = font; g.fillText(text, w / 2, h / 2, w - 8);
});

// The LED wall: band name, the song count, and the tour that never ends.
function drawLed(g: CanvasRenderingContext2D, wave: number, flash: number) {
  const W = 1024, H = 320;
  const grad = g.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a0630'); grad.addColorStop(0.5, '#4a0a3a'); grad.addColorStop(1, '#0a1640');
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  // A starburst behind the logo.
  g.save(); g.translate(W / 2, H * 0.42);
  for (let i = 0; i < 24; i++) { g.rotate(Math.PI / 12); g.fillStyle = i % 2 ? 'rgba(255,120,60,0.12)' : 'rgba(255,210,90,0.08)'; g.fillRect(0, -18, 700, 36); }
  g.restore();
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = '#ff5a2a'; g.shadowBlur = 30 + flash * 30;
  g.fillStyle = '#fff1d8'; g.font = 'italic 900 104px Georgia, "Times New Roman", serif';
  g.fillText('The Hold Ready', W / 2, H * 0.3, W - 60);
  g.shadowBlur = 12; g.shadowColor = '#3ad7ff';
  g.font = '900 50px Impact, "Arial Black", sans-serif'; g.fillStyle = '#ffd23f';
  g.fillText(wave >= 0 ? `${songLabel(wave)} OF ∞` : 'STAY READY', W / 2, H * 0.6);
  g.shadowBlur = 0;
  g.font = '700 24px "Arial Black", Arial, sans-serif'; g.fillStyle = '#c8fbff';
  g.fillText('THE NO CURFEW TOUR · LIVE AT THE SALT SHED', W / 2, H * 0.84);
  // LED pixel grid.
  g.fillStyle = 'rgba(0,0,0,0.35)';
  for (let x = 0; x < W; x += 6) g.fillRect(x, 0, 1, H);
  for (let y = 0; y < H; y += 6) g.fillRect(0, y, W, 1);
}

// The band. Looks are parodies, not portraits.
const BAND: { role: 'singer' | 'guitar' | 'bass' | 'keys' | 'drums'; at: [number, number]; look: Look }[] = [
  { role: 'singer', at: [0, -5.9], look: { shirt: 0x34405a, collar: 0x28324a, longSleeves: true, pants: 0x22262e, skin: 0xe6b996, hair: 0x5a4636, glasses: true, scale: 1.0 } },
  { role: 'guitar', at: [-3.3, -6.3], look: { shirt: 0x161616, pants: 0x2b3448, skin: 0xe0b48a, hair: 0x2a1d16, beard: 0x3a2518, hat: 'dad', hatColor: 0x161616, scale: 1.02 } },
  { role: 'bass', at: [3.1, -6.4], look: { shirt: 0x3a2a2a, pants: 0x1e2028, skin: 0xf0c8a4, hair: 0x6b4a2a, beard: 0x6b4a2a, build: 'heavy', scale: 1.08 } },
  { role: 'keys', at: [5.5, -7.3], look: { jacket: 0x121212, shirt: 0xf2f2ee, pants: 0x121212, skin: 0xe4bc98, hair: 0x1a1a1a, goatee: 0x1a1a1a, scale: 0.98 } },
  { role: 'drums', at: [0, -8.3], look: { shirt: 0x6a1a1a, pants: 0x1e2028, skin: 0xd9a882, hair: 0x2a1d16, beard: 0x2a1d16, scale: 1.0 } },
];

const STAND = CLIPS.guard.frames[0];

// A player's pose for this beat: bob on the beat, nod the head, and work the instrument.
function bandPose(role: (typeof BAND)[number]['role'], beat: number, i: number): Pose {
  const p = copy(STAND);
  const ph = beat * Math.PI * 2, bounce = Math.abs(Math.sin(ph / 2 + i));
  const hips = get(p, J.Hips);
  if (role === 'drums') {
    // Sitting behind the kit: the riser and the kick drum hide his legs.
    translate(p, Array.from({ length: 18 }, (_, j) => j), { y: -0.42 });
    const sticks = Math.sin(ph * 2);
    reach(p, true, { x: 0.24, y: 0.62 + Math.max(0, sticks) * 0.22, z: 0.36 });
    reach(p, false, { x: -0.26, y: 0.62 + Math.max(0, -sticks) * 0.22 + (Math.floor(beat) % 4 === 3 ? 0.25 : 0), z: 0.34 });
    rotate(p, [J.Head], get(p, J.Neck), 'x', 0.25 * bounce);
    return p;
  }
  translate(p, UPPER, { y: -0.025 * bounce });
  rotate(p, [J.Head], get(p, J.Neck), 'x', 0.18 * bounce);
  if (role === 'keys') {
    reach(p, true, { x: 0.22 + Math.sin(ph * 0.5) * 0.08, y: 0.98 + Math.max(0, Math.sin(ph * 2)) * 0.04, z: 0.38 });
    reach(p, false, { x: -0.2 + Math.cos(ph * 0.5) * 0.06, y: 0.98 + Math.max(0, Math.cos(ph * 2)) * 0.04, z: 0.38 });
    rotate(p, UPPER, hips, 'x', 0.12);
    return p;
  }
  const strum = Math.sin(ph * (role === 'bass' ? 1 : 2)) * 0.06;
  reach(p, true, role === 'bass' ? { x: 0.42, y: 1.08, z: 0.24 } : { x: 0.36, y: 1.12, z: 0.24 });
  reach(p, false, { x: -0.04, y: 0.95 + strum, z: 0.22 });
  // The frontman: every other bar his strumming hand leaves the guitar to point and flail.
  if (role === 'singer') {
    const bar = Math.floor(beat / 4) % 2, k = Math.sin(ph / 4);
    if (bar === 1) reach(p, false, { x: -0.3 + k * 0.15, y: 1.45 + Math.abs(k) * 0.3, z: 0.35 });
    rotate(p, UPPER, hips, 'x', 0.08);
  }
  if (role === 'guitar') rotate(p, UPPER, hips, 'x', 0.1 + 0.12 * bounce); // leaning into the riff
  return p;
}

function guitar(bass: boolean) {
  const g = new THREE.Group();
  const finish = new THREE.MeshStandardMaterial({ color: bass ? 0x1a1a1a : 0xb5541c, roughness: 0.3, metalness: 0.2 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6a4020, roughness: 0.6 });
  for (const [x, r] of [[0, 0.16], [0.13, 0.12]] as const) {
    const lobe = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.05, 20), finish);
    lobe.rotation.x = Math.PI / 2; lobe.position.x = x;
    g.add(lobe);
  }
  const len = bass ? 0.7 : 0.5;
  const neck = new THREE.Mesh(new THREE.BoxGeometry(len, 0.045, 0.025), wood);
  neck.position.set(0.2 + len / 2, 0, 0.01);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.025), finish);
  head.position.set(0.2 + len + 0.05, 0, 0.01);
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.012, 4, 20, Math.PI), new THREE.MeshStandardMaterial({ color: 0x111111 }));
  strap.position.set(0.2, 0.12, -0.08); strap.rotation.set(0, 0, 0.3);
  g.add(neck, head, strap);
  // Slung across the body, neck up to his left.
  g.position.set(-0.04, 0.98, 0.17); g.rotation.z = 0.42;
  return g;
}

export function buildSaltShed(root: THREE.Group) {
  const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.8, ...o });
  const add = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number, shadow = true): T => {
    o.position.set(x, y, z);
    o.traverse(c => { if (c instanceof THREE.Mesh) { c.castShadow = shadow; c.receiveShadow = true; } });
    root.add(o); return o;
  };
  const box = (sx: number, sy: number, sz: number, m: THREE.Material, x: number, y: number, z: number, shadow = true) =>
    add(new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m), x, y, z, shadow);
  const black = std({ color: 0x111113, roughness: 0.7 });
  const steel = std({ color: 0x8a8d92, metalness: 0.7, roughness: 0.35 });
  const timber = std({ color: 0x9a6638, roughness: 0.75 });
  const props: Prop[] = [];
  root.userData.props = props;
  const loose = (mesh: THREE.Object3D, x: number, y: number, z: number, r: number, mass: number) => props.push(makeProp(add(mesh, x, y, z), r, mass));

  // Light: a dark hall, warm up-lights on the timber, coloured washes on the stage, and moving
  // heads sweeping the floor from the truss.
  root.add(new THREE.HemisphereLight(0x6a5aa0, 0x1a1218, 0.7));
  const key = new THREE.DirectionalLight(0xd8c8ff, 0.75);
  key.position.set(3, 16, 9); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -14, right: 14, top: 12, bottom: -12 });
  root.add(key);
  const point = (c: number, i: number, d: number, x: number, y: number, z: number) => {
    const l = new THREE.PointLight(c, i, d, 1.6); l.position.set(x, y, z); root.add(l); return l;
  };
  point(0xffa040, 30, 12, -9, 3.5, -2); // amber up-lights on the A-frame
  point(0xffa040, 30, 12, 9, 3.5, 1);
  const washL = point(0xff3a8a, 26, 10, -3.5, 4.5, -6.5);
  const washR = point(0x3ab0ff, 26, 10, 3.5, 4.5, -6.5);
  point(0xffc890, 12, 7, -8.4, 2.6, 0.6); // over the bar

  // Floor and the concrete base walls.
  const W = HALF * 2 + 1, D = 18;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), std({ map: concreteTex([W / 3, D / 3]), roughness: 0.55, metalness: 0.05 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
  add(floor, 0, 0, -1, false);
  const concrete = std({ map: concreteTex([6, 1]), color: 0xb0aaa0 });
  for (const s of [-1, 1]) box(0.4, KNEE, D, concrete, s * (HALF + 0.2), KNEE / 2, -1);
  // The A-frame: board-lined slopes from the base walls to the ridge, crossed by trusses.
  const slope = Math.hypot(HALF, APEX - KNEE), tilt = Math.atan2(APEX - KNEE, HALF);
  for (const s of [-1, 1]) {
    const roof = new THREE.Mesh(new THREE.PlaneGeometry(slope, D), std({ map: boardTex([slope / 2, D / 2]), color: 0xc89a70, side: THREE.DoubleSide }));
    roof.rotation.set(-Math.PI / 2, 0, -s * tilt, 'ZYX');
    add(roof, s * HALF / 2, KNEE + (APEX - KNEE) / 2, -1, false);
  }
  for (let z = BACK + 0.4; z < 2; z += 3.6) {
    for (const s of [-1, 1]) {
      const rafter = new THREE.Mesh(new THREE.BoxGeometry(0.45, slope, 0.55), timber);
      rafter.rotation.z = s * (Math.PI / 2 - tilt);
      add(rafter, s * (HALF / 2 - 0.25), KNEE + (APEX - KNEE) / 2 - 0.2, z, false);
    }
    const tieY = 10.5, tieHalf = HALF * (1 - (tieY - KNEE) / (APEX - KNEE));
    box(tieHalf * 2, 0.45, 0.4, timber, 0, tieY, z, false);
    box(0.35, APEX - tieY - 0.4, 0.35, timber, 0, (tieY + APEX) / 2 - 0.2, z, false);
  }
  // The gable wall behind the stage, black.
  const gable = new THREE.Shape([new THREE.Vector2(-HALF - 0.4, 0), new THREE.Vector2(HALF + 0.4, 0), new THREE.Vector2(HALF + 0.4, KNEE), new THREE.Vector2(0, APEX), new THREE.Vector2(-HALF - 0.4, KNEE)]);
  add(new THREE.Mesh(new THREE.ShapeGeometry(gable), std({ color: 0x0c0a10, roughness: 0.95 })), 0, 0, BACK, false);
  // Painted on the west base wall above the bar, white block letters like the old salt sign.
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.0), new THREE.MeshBasicMaterial({ map: letteringTex('THE SALT SHED', 1024, 146, '900 120px Impact, "Arial Black", sans-serif'), transparent: true }));
  sign.rotation.y = Math.PI / 2;
  add(sign, -HALF + 0.02, 2.1, -0.4, false);

  // The stage: deck, black skirt, monitor wedges, the crowd barricade in front.
  box(15, STAGE_H, STAGE_FRONT - BACK, std({ color: 0x1a1a1e, roughness: 0.6 }), 0, STAGE_H / 2, (STAGE_FRONT + BACK) / 2);
  box(15.05, STAGE_H - 0.05, 0.05, std({ color: 0x050505, roughness: 1 }), 0, STAGE_H / 2, STAGE_FRONT + 0.03, false);
  for (const x of [-3.3, -0.7, 0.7, 3.1]) {
    const wedge = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.7, 3), black);
    wedge.rotation.set(0, Math.PI / 6, Math.PI / 2); wedge.scale.set(0.7, 1, 1);
    add(wedge, x, STAGE_H + 0.18, STAGE_FRONT - 0.4);
  }
  for (let x = -7; x <= 7.01; x += 1.4) {
    box(0.05, 1.1, 0.05, steel, x, 0.55, -4.62, false);
    if (x < 7) { box(1.4, 0.05, 0.05, steel, x + 0.7, 1.1, -4.62, false); box(1.4, 0.05, 0.05, steel, x + 0.7, 0.12, -4.62, false); box(1.4, 0.7, 0.02, std({ color: 0x2a2c30, metalness: 0.4 }), x + 0.7, 0.6, -4.63, false); }
    box(0.05, 0.05, 0.7, steel, x, 0.03, -4.35, false);
  }
  // Delay towers at the stage corners, and the main PA hung either side.
  for (const o of CONCERT.obstacles.filter(o => o.kind === 'post' && o.y < -4)) {
    box(0.4, 4.6, 0.4, black, o.x, 2.3, o.y);
    box(0.8, 0.9, 0.7, black, o.x, 5.0, o.y);
  }
  for (const s of [-1, 1]) {
    for (let i = 0; i < 6; i++) {
      const cab = box(1.1, 0.42, 0.7, black, s * 8.4, 7.4 - i * 0.44, STAGE_FRONT - 0.5, false);
      cab.rotation.x = -0.05 * i;
    }
    box(1.2, 1.0, 1.0, black, s * 6.8, 0.5, STAGE_FRONT - 0.2); // subs on the floor by the stage lip
  }

  // Backline: amp stacks, the drum riser and kit, the keyboard rig, mic stand.
  const grille = std({ map: grilleTex() });
  for (const [x, z] of [[-3.3, -7.5], [3.1, -7.6]] as const) {
    box(0.8, 0.8, 0.4, [black, black, black, black, grille, black] as unknown as THREE.Material, x, STAGE_H + 0.4, z);
    box(0.8, 0.8, 0.4, [black, black, black, black, grille, black] as unknown as THREE.Material, x, STAGE_H + 1.2, z);
    box(0.8, 0.3, 0.35, std({ color: 0x1a1612, roughness: 0.5 }), x, STAGE_H + 1.75, z);
  }
  const RISER = 0.45;
  box(3.2, RISER, 2.2, std({ color: 0x22222a }), 0, STAGE_H + RISER / 2, -8.3);
  const deck = STAGE_H + RISER;
  const shell = std({ color: 0x8a1a1a, roughness: 0.35, metalness: 0.3 });
  const kick = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.4, 24), [shell, std({ map: kickTex() }), shell] as unknown as THREE.Material);
  kick.rotation.x = Math.PI / 2; add(kick, 0, deck + 0.32, -7.65);
  const drum = (r: number, h: number, x: number, y: number, z: number) => add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 18), shell), x, deck + y, z);
  drum(0.16, 0.16, 0.25, 0.68, -7.7); drum(0.17, 0.18, -0.25, 0.68, -7.7); drum(0.22, 0.4, 0.55, 0.35, -8.0); drum(0.18, 0.12, -0.45, 0.55, -7.95);
  const brass = std({ color: 0xd9a830, metalness: 0.9, roughness: 0.25 });
  for (const [x, y, z] of [[-0.75, 1.15, -7.9], [0.75, 1.25, -8.1], [-0.55, 0.85, -7.8]] as const) {
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.01, 20), brass), x, deck + y, z);
    box(0.02, y, 0.02, steel, x, deck + y / 2, z, false);
  }
  // Keys: a keyboard on an X stand, angled toward the middle of the stage.
  const keys = new THREE.Group();
  const kb = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.07, 0.3), [black, black, std({ map: keysTex() }), black, black, black] as unknown as THREE.Material);
  kb.position.y = 0.95;
  keys.add(kb);
  for (const s of [-1, 1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.1, 0.03), steel); leg.position.set(0, 0.47, 0); leg.rotation.z = s * 0.6; keys.add(leg); }
  keys.rotation.y = -0.5;
  add(keys, 5.5 - Math.sin(0.5) * 0.4, STAGE_H, -7.3 + Math.cos(0.5) * 0.4);
  // The frontman's mic.
  box(0.025, 1.45, 0.025, steel, 0, STAGE_H + 0.72, -5.5, false);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), std({ color: 0x333333, metalness: 0.6 })), 0, STAGE_H + 1.47, -5.55, false);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 12), steel), 0, STAGE_H + 0.01, -5.5, false);

  // The LED wall, redrawn when the song changes.
  const ledCanvas = document.createElement('canvas'); ledCanvas.width = 1024; ledCanvas.height = 320;
  const ledTex = new THREE.CanvasTexture(ledCanvas); ledTex.colorSpace = THREE.SRGBColorSpace;
  drawLed(ledCanvas.getContext('2d')!, -1, 0);
  const ledMat = new THREE.MeshBasicMaterial({ map: ledTex });
  add(new THREE.Mesh(new THREE.PlaneGeometry(10.5, 3.2), ledMat), 0, STAGE_H + 1.95, BACK + 0.5, false);
  box(10.8, 3.5, 0.2, black, 0, STAGE_H + 1.95, BACK + 0.38, false);

  // Lighting truss over the stage with moving heads, each throwing a visible beam into the haze.
  const TRUSS_Y = 5.9, TRUSS_Z = -6.4;
  for (const dy of [0, 0.4]) for (const dz of [-0.2, 0.2]) box(15.2, 0.05, 0.05, steel, 0, TRUSS_Y + dy, TRUSS_Z + dz, false);
  for (let x = -7.4; x <= 7.4; x += 0.4) box(0.03, 0.4, 0.03, steel, x, TRUSS_Y + 0.2, TRUSS_Z + (Math.round(x / 0.4) % 2 ? 0.2 : -0.2), false);
  for (const s of [-1, 1]) box(0.3, TRUSS_Y, 0.3, black, s * 7.6, TRUSS_Y / 2, TRUSS_Z, false);
  const heads: { pivot: THREE.Group; beam: THREE.Mesh; light?: THREE.SpotLight; phase: number; color: THREE.Color }[] = [];
  const beamColors = [0xff3a8a, 0x3ad7ff, 0xffd23f, 0x8a5bff, 0x3affa0, 0xff7a3a];
  [-6, -3.6, -1.2, 1.2, 3.6, 6].forEach((x, i) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, TRUSS_Y - 0.15, TRUSS_Z + 0.3);
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.3, 10), black);
    can.position.y = -0.15; pivot.add(can);
    const color = new THREE.Color(beamColors[i]);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 1.1, 9, 16, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    beam.position.y = -4.6;
    pivot.add(beam);
    root.add(pivot);
    const head: (typeof heads)[number] = { pivot, beam, phase: i * 1.3, color };
    // Only every other head lights the floor for real: lights are expensive, beams are cheap.
    if (i % 2 === 0) {
      const l = new THREE.SpotLight(color, 60, 18, 0.32, 0.6, 1.4);
      l.position.set(0, -0.3, 0); l.target.position.set(0, -10, 0);
      pivot.add(l, l.target);
      head.light = l;
    }
    heads.push(head);
  });

  // The band.
  const band = BAND.map((m, i) => {
    const fig = new Figure(m.look, STAND);
    const y = m.role === 'drums' ? STAGE_H + RISER : STAGE_H;
    fig.root.position.set(m.at[0], y, m.at[1]);
    fig.root.rotation.y = m.role === 'keys' ? -0.5 : m.role === 'singer' ? 0 : m.at[0] < 0 ? 0.25 : -0.25;
    if (m.role === 'singer' || m.role === 'guitar' || m.role === 'bass') fig.root.add(guitar(m.role === 'bass'));
    fig.root.traverse(c => { c.castShadow = true; });
    root.add(fig.root);
    return { fig, role: m.role, i };
  });

  // The bar down the west wall: the same long wooden bar as Kilroy's, beer taps, a lit fridge.
  const bar = CONCERT.obstacles.find(o => o.kind === 'bar')!;
  const wood = std({ color: 0x3a2416, roughness: 0.5 }), top = std({ color: 0x1a120c, roughness: 0.3, metalness: 0.1 });
  box(bar.w, 1.0, bar.h, wood, bar.x, 0.5, bar.y);
  box(bar.w + 0.2, 0.08, bar.h + 0.1, top, bar.x, 1.04, bar.y);
  for (let z = bar.y - bar.h / 2 + 0.4; z < bar.y + bar.h / 2; z += 0.5) box(0.04, 0.3, 0.04, steel, bar.x - 0.25, 1.23, z, false);
  box(0.6, 2.0, bar.h, std({ color: 0x101820, emissive: 0x6ab0ff, emissiveIntensity: 0.35 }), -HALF + 0.35, 1.0, bar.y);
  const bartender = new Figure({ shirt: 0x111111, pants: 0x111111, skin: 0xc89470, hair: 0x1a1a1a, hat: 'cap', hatColor: 0x111111, scale: 1.0 }, STAND);
  bartender.root.position.set(-10.2, 0, 1.2); bartender.root.rotation.y = Math.PI / 2;
  root.add(bartender.root);

  // Front of house: the sound desk on a riser behind a rail, screens glowing.
  const foh = CONCERT.obstacles.find(o => o.kind === 'booth')!;
  box(foh.w, 0.25, foh.h, std({ color: 0x1a1a1e }), foh.x, 0.125, foh.y);
  box(foh.w, 0.9, 0.08, black, foh.x, 0.7, foh.y - foh.h / 2 + 0.04);
  for (const s of [-1, 1]) box(0.08, 0.9, foh.h, black, foh.x + s * (foh.w / 2 - 0.04), 0.7, foh.y);
  const deskTex = canvasTex(256, 64, g => {
    g.fillStyle = '#18181c'; g.fillRect(0, 0, 256, 64);
    for (let x = 6; x < 256; x += 9) for (let y = 6; y < 60; y += 9) { g.fillStyle = ['#3ad7ff', '#7cf08a', '#ff3a3a', '#ffd23f', '#444'][(x * 7 + y * 3) % 5]; g.fillRect(x, y, 3, 3); }
  });
  const desk = box(1.8, 0.1, 0.7, std({ map: deskTex, emissive: 0xffffff, emissiveMap: deskTex, emissiveIntensity: 0.5 }), foh.x, 1.1, foh.y + 0.1, false);
  desk.rotation.x = -0.3;
  for (const s of [-1, 1]) box(0.5, 0.32, 0.03, std({ color: 0x111111, emissive: 0x6ab8ff, emissiveIntensity: 0.6 }), foh.x + s * 0.6, 1.45, foh.y + 0.45, false);
  const engineer = new Figure({ shirt: 0x1a1a1a, pants: 0x2b3448, skin: 0xf0c8a4, hair: 0x6b4a2a, hat: 'dad', hatColor: 0x2a2a2a, beard: 0x6b4a2a, scale: 1.0 }, STAND);
  engineer.root.position.set(foh.x, 0.25, foh.y + 0.55); engineer.root.rotation.y = Math.PI;
  root.add(engineer.root);

  // High-tops with tallboys on them.
  for (const o of CONCERT.obstacles.filter(o => o.kind === 'post' && o.y > -4)) {
    const t = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.05, 16), top); disc.position.y = 1.05;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.05, 8), black); post.position.y = 0.52;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 12), black); base.position.y = 0.02;
    t.add(disc, post, base);
    add(t, o.x, 0, o.y);
    loose(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.17, 10), std({ color: [0x2a5ad0, 0xc0c4c8, 0xd02a2a][Math.abs(Math.round(o.x + o.y)) % 3], metalness: 0.7, roughness: 0.3 })), o.x + 0.1, 1.17, o.y - 0.05, 0.07, 0.3);
  }
  // Cups on the floor, a bin by the bar.
  for (const [x, z] of [[-2.2, -3.0], [1.6, -2.4], [-3.4, 1.8], [2.6, 3.6], [0.4, -0.6], [-6.6, 3.6]] as const) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.037, 0.13, 10), std({ color: rnd() < 0.5 ? 0xc8191e : 0xe8f0f4, transparent: true, opacity: 0.9 }));
    cup.rotation.z = Math.PI / 2;
    loose(cup, x, 0.05, z, 0.07, 0.15);
  }
  const bin = new THREE.Group();
  bin.add(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.85, 14), std({ color: 0x2a2a30 })));
  loose(bin, -7.6, 0.43, 4.0, 0.3, 3);

  // Merch, at the front corner of the east side: tees on a grid wall, the prices.
  const merchX = 11.0, merchZ = 4.6;
  box(1.0, 0.85, 2.4, std({ color: 0x0a0a0a, roughness: 1 }), merchX, 0.43, merchZ);
  const tees = canvasTex(512, 256, g => {
    g.fillStyle = '#1a1a1a'; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 4; i++) {
      const x = 16 + i * 124;
      g.fillStyle = ['#2a2a2a', '#7a1a1a', '#e8e2d0', '#2a4a7a'][i]; g.fillRect(x, 20, 100, 120);
      g.fillStyle = i === 2 ? '#1a1a1a' : '#ffd23f'; g.font = 'italic 900 22px Georgia, serif'; g.textAlign = 'center';
      g.fillText('Hold', x + 50, 70); g.fillText('Ready', x + 50, 96);
    }
    g.fillStyle = '#fff'; g.font = '900 30px Impact, sans-serif'; g.textAlign = 'center';
    g.fillText('TEES $45 · VINYL $40 · CURFEW: NONE', 256, 200);
  });
  const merchWall = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ map: tees }));
  merchWall.rotation.y = -Math.PI / 2;
  add(merchWall, HALF - 0.02, 1.7, merchZ, false);

  // The crowd: packed down the east side and into the corner by the barricade. Cheap instanced
  // bodies that bounce on the beat, fists and phones in the air.
  const spots: { x: number; z: number; ph: number; arm: number; phone: boolean; h: number }[] = [];
  for (let z = -4.4; z < 6.5; z += 0.62) for (let x = 9.6; x < HALF - 0.2; x += 0.6) {
    if (Math.abs(z - merchZ) < 1.5 && x > 10.2) continue; // the merch line
    spots.push({ x: x + (rnd() - 0.5) * 0.25, z: z + (rnd() - 0.5) * 0.25, ph: rnd() * 6, arm: rnd() < 0.45 ? 1 : 0, phone: rnd() < 0.25, h: 0.9 + rnd() * 0.2 });
  }
  for (let z = -4.4; z < -2.4; z += 0.62) for (let x = -9.7; x > -HALF + 0.2; x -= 0.6) {
    spots.push({ x: x + (rnd() - 0.5) * 0.25, z: z + (rnd() - 0.5) * 0.25, ph: rnd() * 6, arm: rnd() < 0.45 ? 1 : 0, phone: rnd() < 0.25, h: 0.9 + rnd() * 0.2 });
  }
  const n = spots.length;
  const bodies = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.2, 0.75, 4, 8), std({ roughness: 0.9 }), n);
  const headsMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 10, 8), std({ roughness: 0.8 }), n);
  const arms = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.05, 0.5, 3, 6), std({ roughness: 0.8 }), n);
  const phones = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 0.13, 0.02), new THREE.MeshBasicMaterial({ color: 0xe8f4ff }), n);
  const clothes = [0x1a1a1a, 0x2a2a3a, 0x3a2a2a, 0x5a5a5a, 0x2a3a5a, 0x6a1a1a, 0x1a3a2a, 0xc8c0a8];
  const skins = [0xe0b48a, 0xc89470, 0xf0c8a4, 0x8d5f43, 0xd9a882];
  const c = new THREE.Color();
  spots.forEach((s, i) => {
    bodies.setColorAt(i, c.setHex(clothes[(rnd() * clothes.length) | 0]));
    headsMesh.setColorAt(i, c.setHex(skins[(rnd() * skins.length) | 0]));
    arms.setColorAt(i, c.setHex(skins[(rnd() * skins.length) | 0]));
  });
  for (const m of [bodies, headsMesh, arms, phones]) { m.castShadow = false; m.receiveShadow = false; m.frustumCulled = false; root.add(m); }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1), hidden = new THREE.Vector3(0, 0, 0);
  const wide = new THREE.Vector3(1.3, 1, 0.9); // shoulders, not bowling pins
  const placeCrowd = (beat: number) => {
    const ph = beat * Math.PI * 2;
    spots.forEach((s, i) => {
      const hop = Math.max(0, Math.sin(ph + s.ph)) * 0.08;
      const y = s.h * 0.55 + 0.2 + hop;
      m4.compose(new THREE.Vector3(s.x, y, s.z), q.identity(), wide); bodies.setMatrixAt(i, m4);
      m4.compose(new THREE.Vector3(s.x, y + s.h * 0.55 + 0.1, s.z), q.identity(), one); headsMesh.setMatrixAt(i, m4);
      // An arm in the air, pumping on the beat (toward the stage); some are filming instead.
      const pump = s.phone ? 0.1 : 0.15 + Math.max(0, Math.sin(ph + s.ph)) * 0.45;
      e.set(-pump, 0, (s.x > 0 ? 0.25 : -0.25));
      q.setFromEuler(e);
      const shoulder = new THREE.Vector3(s.x + (s.x > 0 ? -0.12 : 0.12), y + s.h * 0.4, s.z);
      const along = new THREE.Vector3(0, 0.3, 0).applyQuaternion(q);
      m4.compose(shoulder.clone().add(along), q, s.arm ? one : hidden); arms.setMatrixAt(i, m4);
      m4.compose(shoulder.clone().add(along.multiplyScalar(2.1)), q, s.arm && s.phone ? one : hidden); phones.setMatrixAt(i, m4);
    });
    for (const m of [bodies, headsMesh, arms, phones]) m.instanceMatrix.needsUpdate = true;
  };
  placeCrowd(0);

  // Once per sim tick: everything that moves to the music.
  let shownWave = -2;
  const ledCtx = ledCanvas.getContext('2d')!;
  root.userData.animate = (w: World) => {
    const beat = w.frame / 60 * BPM / 60;
    const ph = beat * Math.PI * 2;
    band.forEach(b => b.fig.apply(bandPose(b.role, beat, b.i)));
    bartender.apply(bandPose('keys', beat * 0.25, 2));
    engineer.apply(bandPose('keys', beat * 0.5, 4));
    placeCrowd(beat);
    heads.forEach((h, i) => {
      const sweep = ph / 8 + h.phase;
      h.pivot.rotation.set(Math.sin(sweep) * 0.5 + 0.35, 0, Math.cos(sweep * 0.7 + i) * 0.6);
      (h.beam.material as THREE.MeshBasicMaterial).opacity = 0.06 + 0.05 * Math.max(0, Math.sin(ph + i));
    });
    washL.intensity = 18 + 14 * Math.max(0, Math.sin(ph));
    washR.intensity = 18 + 14 * Math.max(0, Math.sin(ph + Math.PI));
    ledMat.color.setScalar(0.82 + 0.18 * Math.max(0, Math.sin(ph)));
    if (w.wave !== shownWave) { shownWave = w.wave; drawLed(ledCtx, w.wave, 1); ledTex.needsUpdate = true; }
  };
}
