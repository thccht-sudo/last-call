// The outside of Kilroy's on Kirkwood at night, built from primitives and canvas textures.
// Reference: limestone side piers, red-brick upper centre with two rows of black-framed windows
// and the round green logo, a dark awning strung with bulbs, "502" over a black door on the left,
// open wood-framed folding doors onto a patio of picnic tables behind a black iron fence, a red
// brick sidewalk with a green lamppost and a double parking meter, then Kirkwood Avenue.
import * as THREE from 'three';
import { LEVEL } from '../sim/level';

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}

// Small deterministic noise so textures look the same every load.
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const brickTex = (repeat: [number, number]) => canvasTex(256, 256, g => {
  g.fillStyle = '#5a4a40'; g.fillRect(0, 0, 256, 256);
  const bw = 64, bh = 21;
  for (let row = 0; row * bh < 256; row++) {
    for (let col = -1; col * bw < 256; col++) {
      const x = col * bw + (row % 2 ? bw / 2 : 0), y = row * bh;
      const r = 120 + rnd() * 50, gg = 48 + rnd() * 22, b = 34 + rnd() * 16;
      g.fillStyle = `rgb(${r | 0},${gg | 0},${b | 0})`;
      g.fillRect(x + 2, y + 2, bw - 4, bh - 4);
    }
  }
}, repeat);

const limestoneTex = (repeat: [number, number]) => canvasTex(256, 256, g => {
  g.fillStyle = '#8f8270'; g.fillRect(0, 0, 256, 256);
  let y = 0;
  while (y < 256) {
    const h = 28 + rnd() * 26;
    let x = -rnd() * 60;
    while (x < 256) {
      const w = 50 + rnd() * 90, v = 175 + rnd() * 35;
      g.fillStyle = `rgb(${v | 0},${(v - 12) | 0},${(v - 34) | 0})`;
      g.fillRect(x + 2, y + 2, w - 3, h - 3);
      for (let i = 0; i < 40; i++) {
        g.fillStyle = `rgba(80,70,55,${rnd() * 0.25})`;
        g.fillRect(x + rnd() * w, y + rnd() * h, 2 + rnd() * 5, 2 + rnd() * 4);
      }
      x += w;
    }
    y += h;
  }
}, repeat);

const paverTex = (repeat: [number, number]) => canvasTex(256, 256, g => {
  g.fillStyle = '#4a3530'; g.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 16; row++) {
    for (let col = -1; col < 9; col++) {
      const x = col * 32 + (row % 2 ? 16 : 0), y = row * 16;
      const v = rnd();
      g.fillStyle = `rgb(${(110 + v * 40) | 0},${(52 + v * 18) | 0},${(44 + v * 12) | 0})`;
      g.fillRect(x + 1, y + 1, 30, 14);
    }
  }
}, repeat);

const asphaltTex = (repeat: [number, number]) => canvasTex(256, 256, g => {
  g.fillStyle = '#2a2a2e'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3000; i++) {
    const v = 30 + rnd() * 40;
    g.fillStyle = `rgb(${v | 0},${v | 0},${(v + 4) | 0})`;
    g.fillRect(rnd() * 256, rnd() * 256, 2, 2);
  }
}, repeat);

const logoTex = () => canvasTex(512, 512, g => {
  const c = 256;
  g.fillStyle = '#1d7a3a'; g.beginPath(); g.arc(c, c, 250, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#f2e6c4'; g.beginPath(); g.arc(c, c, 236, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1d7a3a'; g.beginPath(); g.arc(c, c, 228, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#f2d34a'; g.beginPath(); g.arc(c, c, 128, 0, Math.PI * 2); g.fill();
  const arcText = (text: string, radius: number, start: number, dir: 1 | -1) => {
    g.save(); g.translate(c, c);
    g.font = '900 64px Impact, "Arial Black", sans-serif';
    g.fillStyle = '#d4252a'; g.strokeStyle = '#f2e6c4'; g.lineWidth = 6;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const step = 0.26;
    let a = start - dir * (step * (text.length - 1)) / 2;
    for (const ch of text) {
      g.save(); g.rotate(a); g.translate(0, -dir * radius); if (dir < 0) g.rotate(Math.PI);
      g.strokeText(ch, 0, 0); g.fillText(ch, 0, 0); g.restore();
      a += dir * step;
    }
    g.restore();
  };
  arcText("KILROY'S", 176, 0, 1);
  arcText("BAR N GRILL", 180, Math.PI, -1);
  // The beer mug.
  g.fillStyle = '#1d7a3a';
  g.fillRect(c - 52, c - 62, 84, 120);
  g.lineWidth = 16; g.strokeStyle = '#1d7a3a';
  g.beginPath(); g.arc(c + 38, c, 34, -Math.PI / 2, Math.PI / 2); g.stroke();
  g.fillStyle = '#f2e6c4';
  g.beginPath(); g.arc(c - 34, c - 66, 22, 0, Math.PI * 2); g.arc(c - 4, c - 74, 26, 0, Math.PI * 2); g.arc(c + 24, c - 66, 22, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#f2d34a'; g.font = '900 54px Impact, sans-serif'; g.textAlign = 'center'; g.fillText('K', c - 10, c + 20);
});

const interiorTex = () => canvasTex(1024, 256, g => {
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#3a1d10'); grad.addColorStop(1, '#a5571f');
  g.fillStyle = grad; g.fillRect(0, 0, 1024, 256);
  // Back-bar shelves of bottles.
  for (let x = 20; x < 1004; x += 9) {
    const h = 18 + rnd() * 14;
    g.fillStyle = ['#f6c25b', '#7fd17f', '#e8e0c8', '#c96b3a', '#9fd4f0'][(rnd() * 5) | 0];
    g.fillRect(x, 96 - h, 6, h); g.fillRect(x, 140 - h, 6, h);
  }
  g.fillStyle = '#ffdca0'; g.fillRect(0, 96, 1024, 3); g.fillRect(0, 140, 1024, 3);
  // Crowd silhouettes.
  g.fillStyle = 'rgba(20,8,4,0.85)';
  for (let x = 0; x < 1024; x += 26 + rnd() * 30) {
    const h = 70 + rnd() * 30;
    g.beginPath(); g.arc(x, 256 - h, 11, 0, Math.PI * 2); g.fill();
    g.fillRect(x - 15, 256 - h + 10, 30, h);
  }
  // Neon.
  g.shadowColor = '#ff3b6b'; g.shadowBlur = 18; g.fillStyle = '#ff7b9b';
  g.font = '900 54px Impact, sans-serif'; g.fillText('KOK', 760, 72);
  g.shadowColor = '#5bf0ff'; g.fillStyle = '#c8fbff'; g.font = 'italic 700 34px Georgia, serif'; g.fillText('Thanks for playing!', 120, 66);
});

export function buildKilroys(scene: THREE.Scene) {
  const { minX, maxX } = LEVEL.bounds;
  const F = LEVEL.facadeY; // facade line in sim y == three z
  const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
  const box = (sx: number, sy: number, sz: number, mat: THREE.Material, x: number, y: number, z: number, shadow = true) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
    m.position.set(x, y, z); m.castShadow = shadow; m.receiveShadow = true; scene.add(m); return m;
  };

  scene.background = new THREE.Color(0x0b0e1a);
  scene.fog = new THREE.Fog(0x0b0e1a, 26, 48);

  // Light: moonlight for shadows, warm spill from the bar, the streetlamp, the awning bulbs.
  scene.add(new THREE.HemisphereLight(0x6a78b0, 0x2a1d18, 0.55));
  const moon = new THREE.DirectionalLight(0xaab8ff, 0.7);
  moon.position.set(-8, 16, 12);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  Object.assign(moon.shadow.camera, { left: -16, right: 16, top: 14, bottom: -14 });
  scene.add(moon);
  const warm = (x: number, y: number, z: number, i: number, d: number, c = 0xffb070) => {
    const l = new THREE.PointLight(c, i, d, 1.6); l.position.set(x, y, z); scene.add(l);
  };
  warm(-3, 2.6, F + 1.4, 22, 11);
  warm(5, 2.6, F + 1.4, 22, 11);
  warm(LEVEL.obstacles.find(o => o.kind === 'post')!.x, 4.2, 2.3, 30, 13, 0xffe2b0);

  // Ground: patio concrete, brick sidewalk, curb, Kirkwood Avenue.
  const W = maxX - minX + 12;
  const ground = (d: number, z: number, mat: THREE.Material, y = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(W, d), mat);
    m.rotation.x = -Math.PI / 2; m.position.set(0, y, z); m.receiveShadow = true; scene.add(m);
  };
  const sidewalkDepth = LEVEL.curbY - F;
  ground(sidewalkDepth, F + sidewalkDepth / 2, std({ map: paverTex([W / 4, sidewalkDepth / 4]), roughness: 0.95 }));
  ground(14, LEVEL.curbY + 7, std({ map: asphaltTex([W / 6, 14 / 6]), roughness: 1 }), -0.12);
  box(W, 0.12, 0.25, std({ color: 0x9a978f }), 0, -0.06, LEVEL.curbY, false);
  for (let x = minX - 6; x < maxX + 6; x += 3) box(1.6, 0.01, 0.12, std({ color: 0xd9b23a, emissive: 0x3a2a00 }), x, -0.115, LEVEL.curbY + 4.6, false);

  // The building.
  const lime = std({ map: limestoneTex([3, 3]) });
  const limeTall = std({ map: limestoneTex([1, 4]) });
  const brick = std({ map: brickTex([6, 3]) });
  const dark = std({ color: 0x1c1a1a, roughness: 0.6 });
  const fw = maxX - minX + 1.2, cx = 0;
  const z0 = F - 0.3;
  // Ground floor: limestone piers at both ends and between door and patio openings.
  box(1.0, 3.6, 0.6, limeTall, minX - 0.1, 1.8, z0);
  box(1.0, 3.6, 0.6, limeTall, maxX + 0.1, 1.8, z0);
  box(0.9, 3.6, 0.6, limeTall, -5.05, 1.8, z0);
  // Upper floor: limestone ends, brick centre, stepped parapet.
  box(3.6, 4.6, 0.6, lime, minX + 1.3, 6.1, z0);
  box(3.6, 4.6, 0.6, lime, maxX - 1.3, 6.1, z0);
  box(fw - 7.2, 4.6, 0.5, brick, cx, 6.1, z0 + 0.02);
  box(fw - 7.2, 0.9, 0.5, brick, cx, 8.85, z0 + 0.02);
  box(4, 0.5, 0.5, brick, cx, 9.55, z0 + 0.02);
  box(fw + 0.2, 0.25, 0.8, lime, cx, 3.75, z0 + 0.1);
  box(fw, 10, 6, std({ color: 0x241c1a }), cx, 5, z0 - 3.3, false);
  // Neighbours on either side, darker and plainer.
  for (const s of [-1, 1]) box(8, 7.5 + s * 0.8, 6, std({ map: brickTex([4, 3]), color: 0x6a5a55 }), s * (fw / 2 + 4), 3.75 + s * 0.4, z0 - 2.7);

  // Upper windows: two groups of three, black frames, some lit.
  const glassLit = std({ color: 0x302010, emissive: 0xffb45a, emissiveIntensity: 0.7 });
  const glassDark = std({ color: 0x0e1218, roughness: 0.2, metalness: 0.4 });
  for (const gx of [-4.4, 4.4]) {
    for (const k of [-1, 0, 1]) {
      const x = gx + k * 1.45;
      box(1.3, 1.7, 0.1, dark, x, 6.2, z0 + 0.3, false);
      box(1.12, 0.72, 0.05, (k + gx) % 3 === 0 ? glassLit : glassDark, x, 6.6, z0 + 0.36, false);
      box(1.12, 0.72, 0.05, glassDark, x, 5.8, z0 + 0.36, false);
    }
  }
  // The round logo, lit from below.
  const logo = new THREE.Mesh(new THREE.CircleGeometry(1.05, 48), new THREE.MeshStandardMaterial({ map: logoTex(), emissive: 0xffffff, emissiveMap: logoTex(), emissiveIntensity: 0.35 }));
  logo.position.set(0, 6.3, z0 + 0.32); scene.add(logo);
  box(2.3, 0.08, 0.1, dark, 0, 5.15, z0 + 0.32, false);

  // Ground floor: black "502" door on the left, open folding doors onto the patio, interior glow.
  const door = LEVEL.door;
  box(1.7, 2.7, 0.1, std({ color: 0x0c0c0e, roughness: 0.4 }), door.x, 1.35, z0 + 0.3);
  box(0.06, 2.5, 0.12, std({ color: 0x777777, metalness: 0.8 }), door.x, 1.3, z0 + 0.37, false);
  const num = canvasTex(256, 96, g => { g.fillStyle = '#f2efe6'; g.font = '700 72px Georgia, serif'; g.textAlign = 'center'; g.fillText('502', 128, 74); });
  const numMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.28), new THREE.MeshBasicMaterial({ map: num, transparent: true }));
  numMesh.position.set(door.x, 3.0, z0 + 0.36); scene.add(numMesh);
  const inside = new THREE.Mesh(new THREE.PlaneGeometry(13.8, 3.2), new THREE.MeshBasicMaterial({ map: interiorTex() }));
  inside.position.set(2.0, 1.6, z0 - 0.6); scene.add(inside);
  const wood = std({ color: 0xb4622a, roughness: 0.55 });
  for (let x = -4.4; x <= 8.4; x += 1.6) {
    box(0.12, 3.1, 0.14, wood, x, 1.55, z0 + 0.25);
    // Folded-back door leaves standing open.
    const leaf = box(0.55, 2.9, 0.06, std({ color: 0xb4622a, transparent: true, opacity: 0.9 }), x + 0.3, 1.45, z0 + 0.45, false);
    leaf.rotation.y = 1.1;
  }
  box(13.2, 0.14, 0.16, wood, 2.0, 3.1, z0 + 0.25);
  // Awning with a string of bulbs.
  box(fw - 0.6, 0.32, 1.5, std({ color: 0x2e2622 }), cx, 3.45, z0 + 0.95);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffd27a });
  for (let x = minX + 0.3; x < maxX; x += 0.55) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), bulbMat);
    b.position.set(x, 3.2 - Math.abs(Math.sin(x * 1.1)) * 0.12, z0 + 1.6); scene.add(b);
  }

  // Patio furniture and fence, straight from the collision boxes.
  const tableWood = std({ color: 0xc8a06a }), tableRed = std({ color: 0xb02a24 });
  const iron = std({ color: 0x111214, roughness: 0.5, metalness: 0.6 });
  const green = std({ color: 0x1f4a35, roughness: 0.5, metalness: 0.4 });
  LEVEL.obstacles.forEach((o, i) => {
    if (o.kind === 'table') {
      const m = i === 3 ? tableRed : tableWood;
      box(o.w, 0.07, 0.75, m, o.x, 0.76, o.y);
      for (const s of [-1, 1]) box(o.w, 0.06, 0.28, m, o.x, 0.45, o.y + s * (o.h / 2 - 0.14));
      for (const s of [-1, 1]) box(0.08, 0.76, o.h * 0.9, m, o.x + s * (o.w / 2 - 0.2), 0.38, o.y);
    } else if (o.kind === 'fence') {
      const along = o.w > o.h, len = along ? o.w : o.h;
      for (const h of [0.12, 1.05]) box(along ? len : 0.05, 0.05, along ? 0.05 : len, iron, o.x, h, o.y, false);
      for (let t = -len / 2; t <= len / 2 + 1e-6; t += 0.13) box(0.025, 1.0, 0.025, iron, o.x + (along ? t : 0), 0.56, o.y + (along ? 0 : t), false);
    } else if (o.kind === 'planter') {
      box(o.w, 0.6, o.h, lime, o.x, 0.3, o.y);
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), std({ color: 0x2f5a2a }));
      bush.scale.set(0.9, 0.7, 0.6); bush.position.set(o.x - 0.25, 0.75, o.y); bush.castShadow = true; scene.add(bush);
    }
  });
  // Lamppost and double meter.
  const posts = LEVEL.obstacles.filter(o => o.kind === 'post');
  const lamp = posts[0], meter = posts[1];
  box(0.4, 0.5, 0.4, green, lamp.x, 0.25, lamp.y);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 4, 10), green);
  pole.position.set(lamp.x, 2.4, lamp.y); pole.castShadow = true; scene.add(pole);
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff1d0 }));
  globe.position.set(lamp.x, 4.6, lamp.y); scene.add(globe);
  box(0.06, 1.1, 0.06, std({ color: 0x777a7d, metalness: 0.7 }), meter.x, 0.55, meter.y);
  for (const s of [-1, 1]) box(0.16, 0.36, 0.14, std({ color: 0x3a3d42, metalness: 0.6 }), meter.x + s * 0.11, 1.25, meter.y);
  // Street trees beyond the play area.
  for (const x of [minX - 1.6, maxX + 1.6]) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 3, 8), std({ color: 0x3a2a20 }));
    trunk.position.set(x, 1.5, 1.8); scene.add(trunk);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 10), std({ color: 0x1e3a22 }));
    crown.position.set(x, 4, 1.8); scene.add(crown);
  }
}
