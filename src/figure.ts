// A fighter: one skinned, toon-shaded body (modelled in Blender by tools/build-characters.py)
// whose 13 bones are aimed every frame along the 18 joint positions of a Pose, an ink outline,
// a torso frame that carries shirt prints and collars, and a head with hair, beard and glasses.
import * as THREE from 'three';
import { J, Pose, get } from './anim/pose';
import bodies from './anim/bodies.json';

export interface Look {
  shirt: number; pants: number; skin: number; scale: number;
  jacket?: number; hair?: number; messy?: boolean; beard?: number; glasses?: boolean; collar?: number;
  longSleeves?: boolean;
  print?: { letters: string; ink: string }; // Greek letters across the chest and back
  build?: Build;
  hat?: 'cap' | 'band' | 'dad'; hatColor?: number; shades?: boolean; chain?: boolean;
  // Chopped-unc wear: cargo shorts with white socks pulled up, dad sneakers, a tucked-in shirt
  // with a braided belt, a fanny pack, frosted tips or a horseshoe of hair, a goatee, wraparound
  // shades pushed up on the head, a Bluetooth earpiece, a tour shirt from 2004, flames.
  shorts?: boolean; shoes?: number; belt?: number; fannyPack?: number;
  hairStyle?: 'frosted' | 'horseshoe' | 'mullet'; goatee?: number; wraps?: boolean; earpiece?: boolean;
  tee?: { text: string; sub?: string; ink: string }; flames?: boolean;
}
export type Build = 'regular' | 'heavy' | 'lean';

const printTex = new Map<string, THREE.CanvasTexture>();
function letterTexture(letters: string, ink: string) {
  const key = letters + ink;
  if (!printTex.has(key)) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 160;
    const g = c.getContext('2d')!;
    g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `900 ${letters.length > 2 ? 104 : 124}px Georgia, "Times New Roman", serif`;
    g.fillText(letters, 128, 84);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    printTex.set(key, t);
  }
  return printTex.get(key)!;
}

// A band or slogan tee: a big line and an optional small one under it.
function teeTexture(tee: { text: string; sub?: string; ink: string }) {
  const key = `tee:${tee.text}:${tee.sub}:${tee.ink}`;
  if (!printTex.has(key)) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 180;
    const g = c.getContext('2d')!;
    g.fillStyle = tee.ink; g.textAlign = 'center'; g.textBaseline = 'middle';
    const lines = tee.text.split('\n');
    const size = lines.length > 1 ? 50 : 62;
    g.font = `900 ${size}px Impact, "Arial Black", sans-serif`;
    lines.forEach((l, i) => g.fillText(l, 128, 60 + (i - (lines.length - 1) / 2) * size * 0.95, 244));
    if (tee.sub) { g.font = '700 30px "Arial Black", Arial, sans-serif'; g.fillText(tee.sub, 128, 150, 244); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    printTex.set(key, t);
  }
  return printTex.get(key)!;
}

// Flames licking up from the hem: the 2003 classic.
function flameTexture() {
  if (!printTex.has('flames')) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 170;
    const g = c.getContext('2d')!;
    for (const [color, h] of [['#d41f10', 1], ['#ff8a12', 0.72], ['#ffd23a', 0.42]] as const) {
      g.fillStyle = color; g.beginPath(); g.moveTo(0, 170);
      for (let x = 0; x <= 256; x += 32) {
        const peak = 170 - (90 + ((x * 37) % 60)) * h;
        g.quadraticCurveTo(x + 4, 170 - 40 * h, x + 14, peak);
        g.quadraticCurveTo(x + 18, 170 - 50 * h, x + 32, 170 - 20 * h);
      }
      g.lineTo(256, 170); g.closePath(); g.fill();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    printTex.set('flames', t);
  }
  return printTex.get('flames')!;
}

const v = (p: { x: number; y: number; z: number }) => new THREE.Vector3(p.x, p.y, p.z);

// Mocap actors stand about 1.65 m; this brings a scale-1 character to about 1.78 m (5'10").
const BASE_SCALE = 1.08;
const HEAD_SCALE = 1.28; // stylised: a slightly big head reads better from the overhead camera

type Part = { position: number[]; normal: number[]; index: number[]; skinIndex: number[]; skinWeight: number[] };
type Bodies = { joints: number[][]; bones: { name: string; from: number; to: number; side: number[] | null }[]; builds: Record<Build, Record<string, Part>> };
const BODIES = bodies as unknown as Bodies;
const BONES = BODIES.bones;
// Bones with no fixed sideways reference twist with the bend of their limb: joints a, b, c.
const LIMB: Record<string, [number, number, number, number, number]> = {
  upperArmL: [J.ShL, J.ElL, J.HandL, J.ShL, J.ShR], foreArmL: [J.ShL, J.ElL, J.HandL, J.ShL, J.ShR],
  upperArmR: [J.ShR, J.ElR, J.HandR, J.ShL, J.ShR], foreArmR: [J.ShR, J.ElR, J.HandR, J.ShL, J.ShR],
  thighL: [J.HipL, J.KneeL, J.FootL, J.HipL, J.HipR], shinL: [J.HipL, J.KneeL, J.FootL, J.HipL, J.HipR],
  thighR: [J.HipR, J.KneeR, J.FootR, J.HipL, J.HipR], shinR: [J.HipR, J.KneeR, J.FootR, J.HipL, J.HipR],
};
// Material slot for each modelled part.
const SLOT: Record<string, number> = { shirt: 0, sleeveL: 1, sleeveR: 1, handL: 2, handR: 2, neck: 2, pants: 3, legL: 3, legR: 3, shoeL: 4, shoeR: 4 };
const SOCKS = 5;
// Shorts: leg below this rest height is bare (skin), and below the next it's sock.
const HEM_Y = 0.46, SOCK_Y = 0.2;

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3();
const _x = new THREE.Vector3(), _y = new THREE.Vector3(), _z = new THREE.Vector3(), _s = new THREE.Vector3(), _n = new THREE.Vector3();
const jp = (p: ArrayLike<number>, j: number, out: THREE.Vector3) => out.set(p[j * 3], p[j * 3 + 1], p[j * 3 + 2]);

// A bone's frame from joint positions: y along the bone, x sideways (from a body line, or for
// limbs from the bend of the elbow or knee, blended toward the body line as the limb straightens
// so it never flips), z = x × y. y is scaled by `stretch` so the mesh always meets the joints.
function boneMatrix(p: ArrayLike<number>, i: number, out: THREE.Matrix4, restLen?: number[]) {
  const b = BONES[i];
  jp(p, b.from, _a); jp(p, b.to, _b);
  _y.subVectors(_b, _a);
  const length = _y.length();
  _y.divideScalar(length || 1);
  const limb = LIMB[b.name];
  if (b.side) { jp(p, b.side[0], _s); jp(p, b.side[1], _c); _s.sub(_c); }
  else {
    jp(p, limb[3], _s); jp(p, limb[4], _c); _s.sub(_c).normalize();
    jp(p, limb[0], _a); jp(p, limb[1], _b); jp(p, limb[2], _c);
    _n.crossVectors(_b.clone().sub(_a), _c.clone().sub(_b));
    const bend = Math.min(1, _n.length() / (_a.distanceTo(_b) * _b.distanceTo(_c) + 1e-6) / 0.35);
    _n.normalize(); if (_n.dot(_s) < 0) _n.negate();
    _s.lerp(_n, bend);
    jp(p, b.from, _a);
  }
  _x.copy(_s).addScaledVector(_y, -_s.dot(_y)).normalize();
  _z.crossVectors(_x, _y);
  const k = restLen ? length / restLen[i] : 1;
  out.makeBasis(_x, _y.multiplyScalar(k), _z).setPosition(_a);
  return length;
}

const REST = Float32Array.from(BODIES.joints.flat());
const REST_LEN: number[] = [];
const REST_INV = BONES.map((_, i) => { const m = new THREE.Matrix4(); REST_LEN[i] = boneMatrix(REST, i, m); return m.invert(); });

const geometries = new Map<string, THREE.BufferGeometry>();
function bodyGeometry(build: Build, shorts = false) {
  const key = `${build}:${shorts}`;
  let g = geometries.get(key);
  if (g) return g;
  const pos: number[] = [], nrm: number[] = [], si: number[] = [], sw: number[] = [];
  const bySlot: number[][] = [[], [], [], [], [], []];
  for (const [name, part] of Object.entries(BODIES.builds[build])) {
    const base = pos.length / 3;
    pos.push(...part.position); nrm.push(...part.normal); si.push(...part.skinIndex); sw.push(...part.skinWeight);
    const bare = shorts && (name === 'legL' || name === 'legR');
    for (let t = 0; t < part.index.length; t += 3) {
      let slot = SLOT[name];
      if (bare) {
        // Cargo shorts: the leg below the hem is skin, then a white sock up from the shoe.
        const y = (part.position[part.index[t] * 3 + 1] + part.position[part.index[t + 1] * 3 + 1] + part.position[part.index[t + 2] * 3 + 1]) / 3;
        slot = y < SOCK_Y ? SOCKS : y < HEM_Y ? 2 : slot;
      }
      bySlot[slot].push(base + part.index[t], base + part.index[t + 1], base + part.index[t + 2]);
    }
  }
  g = new THREE.BufferGeometry();
  const idx: number[] = [];
  bySlot.forEach((tris, slot) => { if (tris.length) { g!.addGroup(idx.length, tris.length, slot); idx.push(...tris); } });
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
  g.setIndex(idx);
  g.normalizeNormals();
  geometries.set(key, g);
  return g;
}

// Three-band toon ramp.
const RAMP = (() => {
  const t = new THREE.DataTexture(new Uint8Array([125, 125, 125, 255, 195, 195, 195, 255, 255, 255, 255, 255]), 3, 1);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
})();
// Toon shading plus a soft rim light, so fighters stand out from a dark street.
const RIM = { value: new THREE.Color(0x8fa8ff) };
export function setRim(color: number) { RIM.value.setHex(color); }
const toon = (color: number) => {
  const m = new THREE.MeshToonMaterial({ color, gradientMap: RAMP });
  m.onBeforeCompile = sh => {
    sh.uniforms.rimColor = RIM;
    sh.fragmentShader = 'uniform vec3 rimColor;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', `
      float rim = 1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0);
      outgoingLight += rimColor * smoothstep(0.55, 0.95, rim) * 0.4;
      #include <opaque_fragment>`);
  };
  m.customProgramCacheKey = () => 'toon-rim';
  return m;
};

// Ink outline: the body again, back faces only, pushed out along its normals after skinning.
function outlineMaterial(width: number) {
  const m = new THREE.MeshBasicMaterial({ color: 0x0a0a0c, side: THREE.BackSide });
  m.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <skinning_vertex>', `#include <skinning_vertex>
      transformed += normalize(objectNormal) * ${width.toFixed(4)};`);
  };
  return m;
}

export class Figure {
  root = new THREE.Group();
  private torso = new THREE.Group();
  private head = new THREE.Group();
  private bones: THREE.Bone[] = [];
  private mats: THREE.MeshToonMaterial[] = [];
  private ink: THREE.MeshBasicMaterial;
  private inkHead = new THREE.MeshBasicMaterial({ color: 0x0a0a0c, side: THREE.BackSide });
  private m = new THREE.Matrix4();
  private chestDepth: number;
  private body!: THREE.SkinnedMesh;

  constructor(look: Look, bind: Pose) {
    const mat = (color: number, _rough = 0.75) => toon(color);
    const build = look.build ?? 'regular';
    const cloth = look.jacket ?? look.shirt;
    const sleeve = look.jacket !== undefined || look.longSleeves ? cloth : look.skin;
    this.mats = [toon(cloth), toon(sleeve), toon(look.skin), toon(look.pants), toon(look.shoes ?? 0x1a1a1c), toon(0xf2f0ea)];

    // Skeleton: one bone per body segment, posed directly in character space.
    const inverses: THREE.Matrix4[] = [];
    BONES.forEach((b, i) => {
      const bone = new THREE.Bone();
      bone.name = b.name; bone.matrixAutoUpdate = false;
      bone.matrix.copy(REST_INV[i]).invert();
      this.root.add(bone); this.bones.push(bone);
      inverses.push(REST_INV[i].clone());
    });
    const skeleton = new THREE.Skeleton(this.bones, inverses);
    const geo = bodyGeometry(build, look.shorts);
    const body = new THREE.SkinnedMesh(geo, this.mats);
    body.castShadow = true; body.frustumCulled = false;
    body.bind(skeleton, new THREE.Matrix4());
    this.ink = outlineMaterial(build === 'heavy' ? 0.032 : 0.028);
    const outline = new THREE.SkinnedMesh(geo, this.ink);
    outline.frustumCulled = false;
    outline.bind(skeleton, new THREE.Matrix4());
    this.root.add(body, outline);
    this.body = body;
    this.chestDepth = build === 'heavy' ? 0.17 : build === 'lean' ? 0.125 : 0.14;

    // Torso frame for what's printed or sewn on the shirt.
    this.torsoLen = v(get(bind, J.Neck)).distanceTo(v(get(bind, J.Hips)));
    if (look.jacket !== undefined) {
      // The open jacket: a shirt-coloured V down the chest.
      const shirt = new THREE.Mesh(new THREE.CircleGeometry(0.1, 3), toon(look.shirt));
      shirt.rotation.z = -Math.PI / 2; shirt.scale.set(1.6, 0.8, 1);
      shirt.position.set(0, this.torsoLen - 0.12, this.chestDepth + 0.006);
      this.torso.add(shirt);
    }
    if (look.collar !== undefined) {
      for (const sx of [-1, 1]) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.08), toon(look.collar));
        c.position.set(sx * 0.055, this.torsoLen - 0.0, this.chestDepth - 0.03); c.rotation.set(0.5, sx * 0.5, sx * 0.35);
        this.torso.add(c);
      }
    }
    if (look.print) {
      const m = new THREE.MeshBasicMaterial({ map: letterTexture(look.print.letters, look.print.ink), transparent: true, depthWrite: false });
      for (const side of [1, -1]) {
        const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.26), m);
        decal.position.set(0, this.torsoLen * 0.6, side * (this.chestDepth + 0.012));
        if (side < 0) decal.rotation.y = Math.PI;
        this.torso.add(decal);
      }
    }
    // Torso frame: origin at the hips joint, y up the spine, z out of the chest.
    const waist = build === 'heavy' ? { x: 0.175, z: 0.145, front: 0.165 } : build === 'lean' ? { x: 0.122, z: 0.088, front: 0.088 } : { x: 0.137, z: 0.097, front: 0.097 };
    if (look.belt !== undefined) {
      const belt = new THREE.Mesh(new THREE.TorusGeometry(1, 0.018, 4, 28), toon(look.belt));
      belt.rotation.x = Math.PI / 2; belt.scale.set(waist.x + 0.006, waist.z + 0.006, 1.1); belt.position.y = 0.035;
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.012), new THREE.MeshStandardMaterial({ color: 0xc9c2b0, metalness: 0.9, roughness: 0.3 }));
      buckle.position.set(0, 0.035, waist.front + 0.012);
      this.torso.add(belt, buckle);
    }
    if (look.fannyPack !== undefined) {
      const packMat = toon(look.fannyPack);
      const pack = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.12, 4, 8), packMat);
      pack.rotation.z = Math.PI / 2; pack.position.set(0.02, 0.02, waist.front + 0.04); pack.scale.set(1, 1, 0.75);
      const strap = new THREE.Mesh(new THREE.TorusGeometry(1, 0.008, 4, 28), toon(0x151515));
      strap.rotation.x = Math.PI / 2; strap.scale.set(waist.x + 0.012, waist.z + 0.012, 1); strap.position.y = 0.04;
      this.torso.add(pack, strap);
    }
    if (look.tee) {
      const m = new THREE.MeshBasicMaterial({ map: teeTexture(look.tee), transparent: true, depthWrite: false });
      for (const side of [1, -1]) {
        const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.24), m);
        decal.position.set(0, this.torsoLen * 0.62, side * (this.chestDepth + (build === 'heavy' ? 0.02 : 0.012)));
        if (side < 0) decal.rotation.y = Math.PI;
        this.torso.add(decal);
      }
    }
    if (look.flames) {
      const m = new THREE.MeshBasicMaterial({ map: flameTexture(), transparent: true, depthWrite: false });
      for (const side of [1, -1]) {
        const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), m);
        decal.position.set(0, this.torsoLen * 0.3, side * (this.chestDepth + (build === 'heavy' ? 0.03 : 0.008)));
        if (side < 0) decal.rotation.y = Math.PI;
        this.torso.add(decal);
      }
    }
    this.root.add(this.torso);

    // Head, with its centre a little above the head joint.
    const skin = this.mats[2];
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 12), skin);
    skull.scale.set(1, 1.08, 1.04);
    const skullInk = new THREE.Mesh(skull.geometry, this.inkHead);
    skullInk.scale.copy(skull.scale).multiplyScalar(1.1); skullInk.position.y = 0.09;
    this.head.add(skullInk);
    skull.position.y = 0.09; skull.castShadow = true;
    this.head.add(skull);
    if (look.hair !== undefined && look.hairStyle === 'horseshoe') {
      // Bald on top: a ring of hair round the back and sides at ear height.
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.108, 0.026, 6, 20, Math.PI * 1.25), mat(look.hair, 0.95));
      ring.rotation.set(Math.PI / 2, 0, Math.PI * 0.125 + Math.PI / 2); ring.position.set(0, 0.105, -0.008); ring.scale.set(1, 1.05, 0.7);
      this.head.add(ring);
    } else if (look.hair !== undefined && look.hat !== 'cap' && look.hat !== 'dad') {
      const hair = mat(look.hair, 0.95);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.122, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.1), hair);
      cap.position.set(0, 0.112, -0.022); cap.rotation.x = -0.32;
      this.head.add(cap);
      const tufts: [number, number, number][] = look.messy
        ? [[-0.05, 0.035, 0.4], [0.045, 0.055, -0.3], [0, -0.04, 0.1], [0.075, -0.012, -0.6], [-0.08, 0, 0.7]]
        : look.hairStyle === 'frosted' ? [] : [[0, 0.05, 0]];
      if (look.hairStyle === 'frosted') {
        // Gelled spikes, frosted at the tips.
        const frost = mat(0xf2dc9a, 0.6);
        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * Math.PI * 2, rr = i === 0 ? 0 : 0.055;
          const x = Math.cos(a) * rr, z = Math.sin(a) * rr + 0.01;
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.07, 5), hair);
          spike.position.set(x, 0.215, z); spike.rotation.set(z * 4, 0, -x * 4);
          const tip = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.032, 5), frost);
          tip.position.set(0, 0.035, 0);
          spike.add(tip);
          this.head.add(spike);
        }
      }
      if (look.hairStyle === 'mullet') {
        // Business in front, party in back.
        const back = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.1, 4, 8), hair);
        back.position.set(0, 0.02, -0.085); back.scale.set(1.5, 1, 0.6);
        this.head.add(back);
      }
      for (const [x, z, r] of tufts) {
        const t = new THREE.Mesh(new THREE.SphereGeometry(look.messy ? 0.048 : 0.07, 8, 6), hair);
        t.position.set(x, 0.205, z - 0.01); t.scale.set(1.25, 0.55, 1); t.rotation.z = r;
        this.head.add(t);
      }
    }
    // Face: eyes, brows and a nose, so the head reads as a person at gameplay distance.
    const dark = mat(0x161210, 0.5);
    for (const x of [-0.038, 0.038]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), dark);
      eye.position.set(x, 0.1, 0.104);
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.009, 0.012), mat(look.hair ?? 0x2a1d16, 0.9));
      brow.position.set(x, 0.127, 0.104); brow.rotation.z = x > 0 ? -0.15 : 0.15;
      this.head.add(eye, brow);
    }
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.019, 8, 6), skin);
    nose.position.set(0, 0.078, 0.116); nose.scale.set(0.9, 1.2, 1);
    this.head.add(nose);
    if (look.beard !== undefined) {
      // A rounded mass over the jaw and chin, under the cheeks, plus a moustache; fuller for a
      // full beard.
      const beardMat = toon(look.beard);
      const full = !look.messy;
      const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), beardMat);
      jaw.position.set(0, full ? 0.035 : 0.045, full ? 0.03 : 0.025);
      jaw.scale.set(full ? 1.12 : 1.05, full ? 0.82 : 0.66, full ? 1.0 : 0.95);
      const stache = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.05, 4, 8), beardMat);
      stache.rotation.z = Math.PI / 2; stache.position.set(0, 0.062, 0.113);
      const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.008, 0.01), toon(0x3a1f18));
      mouth.position.set(0, 0.045, 0.118);
      this.head.add(jaw, stache, mouth);
    }
    if (look.glasses) {
      const frame = mat(0x151515, 0.4);
      for (const x of [-0.04, 0.04]) {
        const lens = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.0045, 6, 16), frame);
        lens.position.set(x, 0.1, 0.118);
        this.head.add(lens);
      }
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.005, 0.005), frame);
      bridge.position.set(0, 0.104, 0.121);
      this.head.add(bridge);
    }
    if (look.goatee !== undefined) {
      // A goatee: chin tuft joined to a moustache.
      const g = toon(look.goatee);
      const chin = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), g);
      chin.position.set(0, 0.012, 0.1); chin.scale.set(1.1, 1.4, 0.8);
      const stache = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.04, 4, 8), g);
      stache.rotation.z = Math.PI / 2; stache.position.set(0, 0.062, 0.113);
      for (const sx of [-1, 1]) {
        const side = new THREE.Mesh(new THREE.CapsuleGeometry(0.008, 0.035, 4, 6), g);
        side.position.set(sx * 0.03, 0.04, 0.108); side.rotation.z = sx * 0.25;
        this.head.add(side);
      }
      this.head.add(chin, stache);
    }
    if (look.earpiece) {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.022, 0.05), new THREE.MeshStandardMaterial({ color: 0xb8bcc4, metalness: 0.8, roughness: 0.3 }));
      ear.position.set(-0.118, 0.085, 0.02); ear.rotation.x = -0.4;
      this.head.add(ear);
    }
    if (look.hat === 'dad') {
      // A trucker cap worn the right way round: two-tone crown, a curved brim out front.
      const capMat = toon(look.hatColor ?? 0x2a3a5a);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.126, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
      crown.position.set(0, 0.11, 0); crown.scale.set(1.02, 0.95, 1.05);
      const front = new THREE.Mesh(new THREE.SphereGeometry(0.128, 12, 6, Math.PI * 0.18, Math.PI * 0.64, Math.PI * 0.08, Math.PI * 0.4), toon(0xf2f0ea));
      front.position.copy(crown.position); front.scale.copy(crown.scale);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.012, 16, 1, false, 0, Math.PI), capMat);
      brim.position.set(0, 0.12, 0.1); brim.rotation.set(-0.12, -Math.PI / 2, 0); brim.scale.set(1, 1, 0.9);
      this.head.add(crown, front, brim);
    }
    if (look.wraps) {
      // Wraparound shades, mirrored orange, pushed up on the head (or the cap).
      const lens = new THREE.Mesh(new THREE.TorusGeometry(0.118, 0.016, 4, 20, Math.PI * 0.75), new THREE.MeshStandardMaterial({ color: 0xff8a1a, metalness: 0.9, roughness: 0.15, emissive: 0x3a1400 }));
      lens.rotation.set(-Math.PI / 2 + 0.25, 0, Math.PI * 0.125);
      lens.position.set(0, look.hat ? 0.2 : 0.19, 0.012);
      lens.scale.set(1.02, 1.08, 1.6);
      this.head.add(lens);
    }
    if (look.hat === 'cap') {
      // A backwards baseball cap: crown, a button on top, the brim over the back of the neck.
      const capMat = toon(look.hatColor ?? 0x222222);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.124, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
      crown.position.set(0, 0.11, 0); crown.scale.set(1.02, 0.85, 1.05);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.012, 16, 1, false, 0, Math.PI), capMat);
      brim.position.set(0, 0.115, -0.1); brim.rotation.set(0.15, Math.PI / 2, 0); brim.scale.set(1, 1, 0.9);
      const button = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 4), capMat);
      button.position.set(0, 0.215, 0);
      this.head.add(crown, brim, button);
    }
    if (look.hat === 'band') {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.118, 0.016, 6, 24), toon(look.hatColor ?? 0xd8261c));
      band.position.y = 0.135; band.rotation.x = Math.PI / 2 - 0.12;
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 0.008), band.material);
      tail.position.set(0.03, 0.09, -0.125); tail.rotation.z = 0.4;
      this.head.add(band, tail);
    }
    if (look.shades) {
      const black = toon(0x080808);
      const lenses = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.03, 0.02), black);
      lenses.position.set(0, 0.1, 0.112);
      this.head.add(lenses);
    }
    if (look.chain) {
      const chain = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.012, 6, 24), new THREE.MeshStandardMaterial({ color: 0xe8b830, metalness: 0.9, roughness: 0.25 }));
      chain.position.set(0, this.torsoLen - 0.05, 0.05); chain.rotation.x = Math.PI / 2 + 0.5; chain.scale.set(1.1, 1, 1);
      this.torso.add(chain);
    }
    this.head.scale.setScalar(HEAD_SCALE);
    this.root.add(this.head);
    this.root.scale.setScalar(look.scale * BASE_SCALE);
    this.apply(bind);
  }
  private torsoLen: number;

  place(pos: { x: number; y: number }, facing: { x: number; y: number }) {
    this.root.position.set(pos.x, 0, pos.y);
    this.root.rotation.y = Math.atan2(facing.x, facing.y);
  }

  apply(p: Pose) {
    for (let i = 0; i < this.bones.length; i++) {
      boneMatrix(p, i, this.m, REST_LEN);
      this.bones[i].matrix.copy(this.m);
      this.bones[i].matrixWorldNeedsUpdate = true;
    }
    // Torso and head frames: up along the spine / neck, across along the shoulders.
    const hips = v(get(p, J.Hips)), neck = v(get(p, J.Neck)), head = v(get(p, J.Head));
    const across = v(get(p, J.ShL)).sub(v(get(p, J.ShR)));
    const frame = (up: THREE.Vector3) => {
      up.normalize();
      const x = across.clone().sub(up.clone().multiplyScalar(across.dot(up))).normalize();
      const z = new THREE.Vector3().crossVectors(x, up);
      return new THREE.Matrix4().makeBasis(x, up, z);
    };
    this.torso.position.copy(hips);
    this.torso.quaternion.setFromRotationMatrix(frame(neck.clone().sub(hips)));
    this.torso.scale.y = neck.distanceTo(hips) / this.torsoLen;
    this.head.position.copy(head);
    this.head.quaternion.setFromRotationMatrix(frame(head.clone().sub(neck)));
  }

  // A silhouette in `color` drawn only where something stands in front of this figure, so a
  // player is never lost behind an enemy or a bin.
  xray(color: number) {
    const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.45, depthWrite: false, depthFunc: THREE.GreaterDepth });
    // Pulled toward the camera by about a body's depth, so his own arms never count as cover.
    m.onBeforeCompile = sh => {
      sh.vertexShader = sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
        mvPosition.z += 0.4; gl_Position = projectionMatrix * mvPosition;`);
    };
    const ghost = new THREE.SkinnedMesh(this.body.geometry, m);
    ghost.frustumCulled = false; ghost.renderOrder = 5;
    ghost.bind(this.body.skeleton, new THREE.Matrix4());
    this.root.add(ghost);
  }

  // Telegraphs and hit flashes: the body lights up and the ink outline takes the colour.
  glow(color: number, intensity: number) {
    for (const m of this.mats) { m.emissive.setHex(color); m.emissiveIntensity = intensity * 0.8; }
    this.ink.color.setHex(intensity > 0.05 ? color : 0x0a0a0c);
    this.inkHead.color.copy(this.ink.color);
  }
}
