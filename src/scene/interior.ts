// Inside Kilroy's for the final round. From sources: a long narrow room, a long straight wooden
// bar under a wood soffit running front to back, high-tops across the walkway, elevated booths,
// TVs, a dance floor, stairs up, plank floors, red brick, black ceiling joists, red pendant
// lights, and the wall of 21st-birthday Polaroids. The arrangement is a best guess. The front
// wall (toward the camera) is cut away so the room reads like a dollhouse.
import * as THREE from 'three';
import { INSIDE } from '../sim/level';
import { canvasTex, brickTex, rnd } from './kilroys';

const plankTex = () => canvasTex(256, 256, g => {
  for (let row = 0; row < 8; row++) {
    let x = -rnd() * 120;
    while (x < 256) {
      const w = 90 + rnd() * 120, v = rnd();
      g.fillStyle = `rgb(${(92 + v * 40) | 0},${(56 + v * 24) | 0},${(32 + v * 14) | 0})`;
      g.fillRect(x, row * 32, w - 2, 30);
      for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(40,22,10,${0.15 + rnd() * 0.2})`; g.fillRect(x + rnd() * w, row * 32 + rnd() * 30, 20 + rnd() * 40, 1); }
      x += w;
    }
  }
}, [6, 4]);

const polaroidTex = () => canvasTex(1024, 256, g => {
  g.fillStyle = '#4a1f18'; g.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 70; i++) {
    const x = rnd() * 980, y = rnd() * 210, r = (rnd() - 0.5) * 0.3;
    g.save(); g.translate(x + 20, y + 24); g.rotate(r);
    g.fillStyle = '#f4f1ea'; g.fillRect(-18, -22, 36, 44);
    const hue = (rnd() * 360) | 0;
    g.fillStyle = `hsl(${hue},45%,${35 + rnd() * 25}%)`; g.fillRect(-15, -19, 30, 30);
    // two blurry faces in each photo
    g.fillStyle = 'rgba(240,200,170,0.85)';
    g.beginPath(); g.arc(-6, -6, 5, 0, Math.PI * 2); g.arc(7, -5, 5, 0, Math.PI * 2); g.fill();
    g.restore();
  }
});

const tvTex = (n: number) => canvasTex(256, 144, g => {
  const grad = g.createLinearGradient(0, 0, 0, 144);
  grad.addColorStop(0, '#2d6a2e'); grad.addColorStop(1, '#1d4a1f');
  g.fillStyle = grad; g.fillRect(0, 0, 256, 144);
  g.strokeStyle = '#e8f0e0'; g.lineWidth = 2;
  for (let x = 20; x < 256; x += 30) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 144); g.stroke(); }
  g.fillStyle = '#990000'; g.fillRect(0, 112, 256, 32);
  g.fillStyle = '#ffffff'; g.font = '900 22px Arial, sans-serif'; g.fillText(n % 2 ? 'IU 31   PUR 10' : 'IU 24   OSU 21', 12, 135);
});

const neonTex = () => canvasTex(512, 160, g => {
  g.shadowColor = '#ff2a5a'; g.shadowBlur = 24; g.fillStyle = '#ff9db4';
  g.font = '900 120px Impact, "Arial Black", sans-serif'; g.textAlign = 'center'; g.fillText('KOK', 256, 128);
});

export function buildInterior(root: THREE.Group) {
  const { minX, maxX, minY, maxY } = INSIDE.bounds;
  const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.8, ...o });
  const add = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number, shadow = true): T => {
    o.position.set(x, y, z);
    o.traverse(c => { if (c instanceof THREE.Mesh) { c.castShadow = shadow; c.receiveShadow = true; } });
    root.add(o); return o;
  };
  const box = (sx: number, sy: number, sz: number, m: THREE.Material, x: number, y: number, z: number, shadow = true) =>
    add(new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m), x, y, z, shadow);
  const W = maxX - minX + 1, D = maxY - minY + 3;

  // Light: dim warm room, red pendants over the bar, a coloured wash on the dance floor.
  root.add(new THREE.HemisphereLight(0xffe2c4, 0x2a1a12, 0.8));
  const key = new THREE.DirectionalLight(0xffe0c0, 0.9);
  key.position.set(4, 14, 8); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -14, right: 14, top: 12, bottom: -12 });
  root.add(key);
  const point = (c: number, i: number, d: number, x: number, y: number, z: number) => {
    const l = new THREE.PointLight(c, i, d, 1.6); l.position.set(x, y, z); root.add(l);
  };
  point(0xff7a50, 9, 8, -6.2, 3.2, -2.5);
  point(0xff7a50, 9, 8, -6.2, 3.2, 2.0);
  point(0xff3ad0, 14, 8, 2.5, 3.5, -3.8);
  point(0x3ad7ff, 16, 9, 5.5, 3.2, -2.5);
  point(0xffb070, 14, 10, 1, 3.4, 2.2);

  // Floor, walls, ceiling joists.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), std({ map: plankTex(), roughness: 0.65 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
  add(floor, 0, 0, (minY + maxY) / 2 + 1, false);
  const brick = std({ map: brickTex([8, 2]), color: 0xc89080 });
  box(W, 4.2, 0.3, brick, 0, 2.1, minY - 0.15);
  box(0.3, 4.2, D, std({ map: brickTex([6, 2]), color: 0xd9a090 }), minX - 0.65, 2.1, (minY + maxY) / 2 + 1);
  box(0.3, 4.2, D, std({ map: brickTex([6, 2]), color: 0xd9a090 }), maxX + 0.65, 2.1, (minY + maxY) / 2 + 1);
  // No ceiling: the camera looks down into the room.
  const black = std({ color: 0x141414, roughness: 0.9 });

  // The main bar: dark wood top, panelled front, a soffit above, back bar of glowing bottles.
  const bar = INSIDE.obstacles.find(o => o.kind === 'bar')!;
  const wood = std({ color: 0x4a2a17, roughness: 0.5 }), top = std({ color: 0x2a160c, roughness: 0.3, metalness: 0.1 });
  box(bar.w, 1.0, bar.h, wood, bar.x, 0.5, bar.y);
  box(bar.w + 0.2, 0.08, bar.h + 0.1, top, bar.x, 1.04, bar.y);
  box(bar.w + 0.2, 0.1, bar.h, std({ color: 0x8a6a40, metalness: 0.6, roughness: 0.3 }), bar.x + 0.35, 0.12, bar.y); // foot rail
  box(1.6, 0.35, bar.h + 0.4, wood, minX + 0.3, 3.25, bar.y); // soffit
  box(0.35, 2.0, bar.h, std({ color: 0x24140b }), minX - 0.3, 1.6, bar.y); // back bar
  const bottleColors = [0xf6c25b, 0x7fd17f, 0xe8e0c8, 0xc96b3a, 0x9fd4f0, 0xd04040];
  for (let z = bar.y - bar.h / 2 + 0.2; z < bar.y + bar.h / 2; z += 0.16) {
    for (const yy of [1.35, 1.9]) {
      const c = bottleColors[(rnd() * bottleColors.length) | 0];
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.26, 6), std({ color: c, emissive: c, emissiveIntensity: 0.35, roughness: 0.2 }));
      add(b, minX - 0.12, yy, z, false);
    }
  }
  // Stools along the bar.
  for (let z = bar.y - bar.h / 2 + 0.5; z < bar.y + bar.h / 2; z += 1.1) {
    const stool = new THREE.Group();
    stool.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 12), std({ color: 0x7a1010 })));
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.7, 6), black); leg.position.y = -0.36; stool.add(leg);
    add(stool, bar.x + 0.75, 0.74, z);
  }
  // Red pendant lights over the bar.
  for (let z = bar.y - bar.h / 2 + 0.6; z < bar.y + bar.h / 2; z += 1.4) {
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.22, 12, 1, true), std({ color: 0xb01818, emissive: 0x801010, emissiveIntensity: 0.6, side: THREE.DoubleSide }));
    add(shade, bar.x + 0.3, 2.8, z, false);
    add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd0a0 })), bar.x + 0.3, 2.72, z, false);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.0, 4), black), bar.x + 0.3, 3.4, z, false);
  }

  // High-tops with two stools each.
  for (const o of INSIDE.obstacles.filter(o => o.kind === 'post')) {
    const t = new THREE.Group();
    const topDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.05, 16), top); topDisc.position.y = 1.05;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.05, 8), black); post.position.y = 0.52;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 12), black); base.position.y = 0.02;
    t.add(topDisc, post, base);
    for (const s of [-1, 1]) {
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 10), std({ color: 0x7a1010 }));
      seat.position.set(s * 0.6, 0.74, 0.1); t.add(seat);
    }
    add(t, o.x, 0, o.y);
    // A drink on every table.
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.14, 8), std({ color: 0xc8191e })), o.x + 0.1, 1.15, o.y - 0.05, false);
  }

  // Elevated booths along the east wall: a riser, a U-shaped bench, a table.
  for (const o of INSIDE.obstacles.filter(o => o.kind === 'booth' && o.x > 6)) {
    box(o.w, 0.3, o.h, std({ color: 0x3a2214 }), o.x, 0.15, o.y);
    const seat = std({ color: 0x5a0e0e, roughness: 0.6 });
    box(0.45, 0.9, o.h, seat, o.x + o.w / 2 - 0.25, 0.75, o.y);
    box(o.w - 0.5, 0.5, 0.35, seat, o.x - 0.15, 0.55, o.y - o.h / 2 + 0.2);
    box(o.w - 0.5, 0.5, 0.35, seat, o.x - 0.15, 0.55, o.y + o.h / 2 - 0.2);
    box(0.8, 0.06, o.h - 0.8, top, o.x - 0.1, 1.0, o.y);
  }
  // TVs along the east wall above the booths.
  for (const [i, z] of [-3.6, -1.2, 1.2].entries()) {
    const tv = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), new THREE.MeshBasicMaterial({ map: tvTex(i) }));
    tv.rotation.y = -Math.PI / 2;
    add(tv, maxX + 0.44, 2.6, z, false);
    box(0.05, 0.9, 1.5, black, maxX + 0.5, 2.6, z, false);
  }

  // Dance floor with light-up tiles, and the DJ booth behind it.
  const tiles = new THREE.Group();
  const tileColors = [0xff2a8a, 0x2ad7ff, 0xffd23f, 0x8a5bff];
  for (let ix = 0; ix < 6; ix++) for (let iz = 0; iz < 3; iz++) {
    const c = tileColors[(ix + iz * 2) % tileColors.length];
    const tile = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95), std({ color: 0x111111, emissive: c, emissiveIntensity: 0.25 + ((ix * 7 + iz * 3) % 4) * 0.1, roughness: 0.3 }));
    tile.rotation.x = -Math.PI / 2; tile.position.set(ix, 0.012, iz);
    tiles.add(tile);
  }
  add(tiles, 0.6, 0, -4.6, false);
  const dj = INSIDE.obstacles.find(o => o.kind === 'booth' && o.x > 2 && o.x < 5)!;
  box(dj.w, 1.1, dj.h, std({ color: 0x1a1a1f, roughness: 0.4 }), dj.x, 0.55, dj.y);
  box(dj.w - 0.4, 0.04, 0.5, std({ color: 0x222, emissive: 0x3ad7ff, emissiveIntensity: 0.6 }), dj.x, 1.12, dj.y);
  const neon = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.75), new THREE.MeshBasicMaterial({ map: neonTex(), transparent: true }));
  add(neon, dj.x, 2.9, minY + 0.02, false);

  // The Polaroid wall: every 21st birthday gets a photo pinned up.
  const pol = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.3), std({ map: polaroidTex(), roughness: 0.9 }));
  add(pol, -2.0, 2.0, minY + 0.02, false);

  // Stairs up to the second floor in the back corner.
  const stairs = INSIDE.obstacles.find(o => o.kind === 'booth' && o.x < -5)!;
  for (let i = 0; i < 9; i++) box(1.6, 0.2, 0.32, wood, stairs.x, 0.1 + i * 0.22, stairs.y + 0.5 - i * 0.18);
  box(0.06, 1.0, 2.0, black, stairs.x + 0.85, 1.4, stairs.y - 0.2);
}
