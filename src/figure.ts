// A jointed mannequin hung between the 18 points of a Pose: capsules for limbs with real elbows
// and knees, an oriented torso that carries shirt prints, and a head that carries hair, beard
// and glasses.
import * as THREE from 'three';
import { J, Pose, get } from './anim/pose';

export interface Look {
  shirt: number; pants: number; skin: number; scale: number;
  jacket?: number; hair?: number; messy?: boolean; beard?: number; glasses?: boolean; collar?: number;
  longSleeves?: boolean;
  print?: { letters: string; ink: string }; // Greek letters across the chest and back
}

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

const UP = new THREE.Vector3(0, 1, 0);
const v = (p: { x: number; y: number; z: number }) => new THREE.Vector3(p.x, p.y, p.z);

// Mocap actors stand about 1.65 m; this brings a scale-1 character to about 1.78 m (5'10").
const BASE_SCALE = 1.08;

export class Figure {
  root = new THREE.Group();
  private torso = new THREE.Group();
  private head = new THREE.Group();
  private segs: { mesh: THREE.Mesh; a: number; b: number }[] = [];
  private joints: { mesh: THREE.Mesh; j: number }[] = [];
  private cloth: THREE.MeshStandardMaterial;
  private torsoLen: number;

  constructor(look: Look, bind: Pose) {
    const mat = (color: number, rough = 0.75) => new THREE.MeshStandardMaterial({ color, roughness: rough });
    this.cloth = mat(look.jacket ?? look.shirt, 0.7);
    const skin = mat(look.skin, 0.8), pants = mat(look.pants, 0.9), shoes = mat(0x1a1a1c, 0.6);
    const sleeve = look.jacket !== undefined || look.longSleeves ? this.cloth : skin;
    const len = (a: number, b: number) => get(bind, a) && v(get(bind, a)).distanceTo(v(get(bind, b)));
    const seg = (a: number, b: number, r: number, m: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.01, len(a, b) - r * 0.5), 4, 10), m);
      mesh.castShadow = true;
      this.root.add(mesh);
      this.segs.push({ mesh, a, b });
    };
    const ball = (j: number, r: number, m: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), m);
      mesh.castShadow = true;
      this.root.add(mesh);
      this.joints.push({ mesh, j });
    };

    // Limbs.
    seg(J.ShL, J.ElL, 0.062, this.cloth); seg(J.ElL, J.HandL, 0.05, sleeve);
    seg(J.ShR, J.ElR, 0.062, this.cloth); seg(J.ElR, J.HandR, 0.05, sleeve);
    ball(J.HandL, 0.058, skin); ball(J.HandR, 0.058, skin);
    seg(J.HipL, J.KneeL, 0.085, pants); seg(J.KneeL, J.FootL, 0.068, pants);
    seg(J.HipR, J.KneeR, 0.085, pants); seg(J.KneeR, J.FootR, 0.068, pants);
    seg(J.FootL, J.ToeL, 0.055, shoes); seg(J.FootR, J.ToeR, 0.055, shoes);
    seg(J.HipL, J.HipR, 0.11, pants);
    seg(J.Neck, J.Head, 0.05, skin);

    // Torso: a flattened capsule from hips to neck that turns with the shoulder line.
    this.torsoLen = len(J.Hips, J.Neck);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, this.torsoLen - 0.12, 4, 12), this.cloth);
    body.position.y = this.torsoLen / 2; body.scale.set(1.35, 1, 0.85); body.castShadow = true;
    const shoulders = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, len(J.ShL, J.ShR) - 0.05, 4, 8), this.cloth);
    shoulders.rotation.z = Math.PI / 2; shoulders.position.y = this.torsoLen - 0.06; shoulders.castShadow = true;
    this.torso.add(body, shoulders);
    if (look.jacket !== undefined) {
      const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.3, 0.02), mat(look.shirt, 0.6));
      shirt.position.set(0, this.torsoLen - 0.17, 0.128); shirt.rotation.x = -0.08;
      this.torso.add(shirt);
    }
    if (look.collar !== undefined) {
      for (const sx of [-1, 1]) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.08), mat(look.collar, 0.8));
        c.position.set(sx * 0.055, this.torsoLen - 0.01, 0.09); c.rotation.set(0.5, sx * 0.5, sx * 0.35);
        this.torso.add(c);
      }
    }
    if (look.print) {
      const m = new THREE.MeshStandardMaterial({ map: letterTexture(look.print.letters, look.print.ink), transparent: true, roughness: 0.8 });
      for (const side of [1, -1]) {
        const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.2), m);
        decal.position.set(0, this.torsoLen * 0.62, side * 0.13);
        if (side < 0) decal.rotation.y = Math.PI;
        this.torso.add(decal);
      }
    }
    this.root.add(this.torso);

    // Head, with its centre a little above the head joint.
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 12), skin);
    skull.position.y = 0.09; skull.castShadow = true;
    this.head.add(skull);
    if (look.hair !== undefined) {
      const hair = mat(look.hair, 0.95);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.122, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.1), hair);
      cap.position.set(0, 0.105, -0.012);
      this.head.add(cap);
      const tufts: [number, number, number][] = look.messy
        ? [[-0.05, 0.035, 0.4], [0.045, 0.055, -0.3], [0, -0.04, 0.1], [0.075, -0.012, -0.6], [-0.08, 0, 0.7]]
        : [[0, 0.05, 0]];
      for (const [x, z, r] of tufts) {
        const t = new THREE.Mesh(new THREE.SphereGeometry(look.messy ? 0.048 : 0.07, 8, 6), hair);
        t.position.set(x, 0.2, z); t.scale.set(1.25, 0.55, 1); t.rotation.z = r;
        this.head.add(t);
      }
    }
    if (look.beard !== undefined) {
      const beard = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), mat(look.beard, 1));
      beard.position.set(0, look.messy ? 0.035 : 0.025, 0.05);
      beard.scale.set(1.02, look.messy ? 0.8 : 1.05, 0.85);
      this.head.add(beard);
    }
    if (look.glasses) {
      const frame = mat(0x151515, 0.4);
      for (const x of [-0.045, 0.045]) {
        const lens = new THREE.Mesh(new THREE.TorusGeometry(0.031, 0.008, 6, 14), frame);
        lens.position.set(x, 0.105, 0.11);
        this.head.add(lens);
      }
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.008, 0.008), frame);
      bridge.position.set(0, 0.11, 0.113);
      this.head.add(bridge);
    }
    this.root.add(this.head);
    this.root.scale.setScalar(look.scale * BASE_SCALE);
    this.apply(bind);
  }

  place(pos: { x: number; y: number }, facing: { x: number; y: number }) {
    this.root.position.set(pos.x, 0, pos.y);
    this.root.rotation.y = Math.atan2(facing.x, facing.y);
  }

  apply(p: Pose) {
    const a = new THREE.Vector3(), b = new THREE.Vector3(), d = new THREE.Vector3();
    for (const s of this.segs) {
      a.copy(v(get(p, s.a))); b.copy(v(get(p, s.b)));
      d.subVectors(b, a);
      const l = d.length();
      s.mesh.position.addVectors(a, b).multiplyScalar(0.5);
      if (l > 1e-5) s.mesh.quaternion.setFromUnitVectors(UP, d.divideScalar(l));
    }
    for (const j of this.joints) j.mesh.position.copy(v(get(p, j.j)));

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

  glow(color: number, intensity: number) {
    this.cloth.emissive.setHex(color);
    this.cloth.emissiveIntensity = intensity;
  }
}
