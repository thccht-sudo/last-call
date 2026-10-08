// Draws a World. Reads sim state only; never changes it.
import * as THREE from 'three';
import { TUNING as T } from './sim/tuning';
import { World, Enemy, Player, GameEvent, Vec, counterable, framesToStrike } from './sim/world';

const COLORS = { player: 0x2bb3a3, thug: 0xc9773a, heavy: 0x8c2f2f, skin: 0xe0b48a };

class Figure {
  root = new THREE.Group();
  body = new THREE.Group();
  armL = new THREE.Group(); armR = new THREE.Group();
  legL = new THREE.Group(); legR = new THREE.Group();
  mats: THREE.MeshStandardMaterial[] = [];

  constructor(color: number, scale = 1) {
    const cloth = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
    const skin = new THREE.MeshStandardMaterial({ color: COLORS.skin, roughness: 0.8 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.9 });
    this.mats = [cloth, skin, dark];
    const mesh = (g: THREE.BufferGeometry, m: THREE.Material, y: number, parent: THREE.Object3D) => {
      const o = new THREE.Mesh(g, m); o.position.y = y; o.castShadow = true; parent.add(o); return o;
    };
    mesh(new THREE.CapsuleGeometry(0.26, 0.45, 4, 10), cloth, 1.15, this.body);
    mesh(new THREE.SphereGeometry(0.19, 14, 10), skin, 1.72, this.body);
    for (const [g, x] of [[this.armL, 0.36], [this.armR, -0.36]] as const) {
      g.position.set(x, 1.45, 0);
      mesh(new THREE.CapsuleGeometry(0.08, 0.5, 4, 8), cloth, -0.3, g);
      mesh(new THREE.SphereGeometry(0.1, 10, 8), skin, -0.62, g);
      this.body.add(g);
    }
    for (const [g, x] of [[this.legL, 0.14], [this.legR, -0.14]] as const) {
      g.position.set(x, 0.82, 0);
      mesh(new THREE.CapsuleGeometry(0.1, 0.6, 4, 8), dark, -0.4, g);
      this.body.add(g);
    }
    this.root.add(this.body);
    this.root.scale.setScalar(scale);
  }

  reset() {
    for (const g of [this.armL, this.armR, this.legL, this.legR]) g.rotation.set(0, 0, 0);
    this.body.rotation.set(0, 0, 0);
    this.body.position.set(0, 0, 0);
    this.armL.rotation.set(-1.1, 0, -0.25);
    this.armR.rotation.set(-1.1, 0, 0.25);
  }

  place(pos: Vec, facing: Vec) {
    this.root.position.set(pos.x, 0, pos.y);
    this.root.rotation.y = Math.atan2(facing.x, facing.y);
  }

  walk(phase: number, amount: number) {
    this.legL.rotation.x = Math.sin(phase) * 0.7 * amount;
    this.legR.rotation.x = -Math.sin(phase) * 0.7 * amount;
    this.body.position.y = Math.abs(Math.sin(phase)) * 0.05 * amount;
  }

  lieDown(k: number) {
    this.body.rotation.x = -Math.PI / 2 * k;
    this.body.position.y = 0.25 * k;
    this.body.position.z = -0.9 * k;
  }

  glow(color: number, intensity: number) {
    this.mats[0].emissive.setHex(color);
    this.mats[0].emissiveIntensity = intensity;
  }
}

interface Fx { mesh: THREE.Object3D; life: number; max: number; vel?: THREE.Vector3; grow?: number }

export class Renderer {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  private player = new Figure(COLORS.player);
  private enemies = new Map<number, { fig: Figure; prompt: HTMLDivElement; bar: HTMLDivElement }>();
  private bottles = new Map<number, THREE.Mesh>();
  private fx: Fx[] = [];
  private camTarget = new THREE.Vector3();
  private walkPhase = new Map<object, number>();
  private lastPos = new Map<object, Vec>();
  private overlay: HTMLElement;

  constructor(canvas: HTMLCanvasElement, overlay: HTMLElement) {
    this.overlay = overlay;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.scene.background = new THREE.Color(0x1b1b20);
    this.scene.fog = new THREE.Fog(0x1b1b20, 25, 45);

    this.scene.add(new THREE.HemisphereLight(0xdde4ff, 0x30302a, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(-6, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 12, bottom: -12 });
    this.scene.add(sun);

    const { w, h } = T.arena;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: 0x77777c, roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    this.scene.add(floor);
    const grid = new THREE.GridHelper(Math.max(w, h), Math.max(w, h), 0x5d5d63, 0x6a6a70);
    grid.position.y = 0.01; grid.scale.set(w / Math.max(w, h), 1, h / Math.max(w, h));
    this.scene.add(grid);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x55555b, roughness: 1 });
    const wall = (x: number, z: number, sx: number, sz: number, hgt: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(sx, hgt, sz), wallMat);
      m.position.set(x, hgt / 2, z); m.castShadow = m.receiveShadow = true; this.scene.add(m);
    };
    wall(0, -h / 2 - 0.25, w + 1, 0.5, 2.2);
    wall(-w / 2 - 0.25, 0, 0.5, h, 1.2);
    wall(w / 2 + 0.25, 0, 0.5, h, 1.2);
    wall(0, h / 2 + 0.25, w + 1, 0.5, 0.4);
    // Two "tables" where the bottles live.
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x4a3b30 });
    for (const [x, z] of [[-6.5, -3.5], [6.5, 3.5]]) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 20), tableMat);
      t.position.set(x, 0.03, z); t.receiveShadow = true; this.scene.add(t);
    }

    this.scene.add(this.player.root);
    addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize() {
    const { innerWidth: w, innerHeight: h } = window;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private stride(key: object, pos: Vec): number {
    const last = this.lastPos.get(key) ?? pos;
    const moved = Math.hypot(pos.x - last.x, pos.y - last.y);
    this.lastPos.set(key, { ...pos });
    const phase = (this.walkPhase.get(key) ?? 0) + moved * 3.2;
    this.walkPhase.set(key, phase);
    return moved;
  }

  private posePlayer(p: Player, w: World) {
    const f = this.player;
    f.reset();
    f.place(p.pos, p.facing);
    const moved = this.stride(p, p.pos);
    const k = (n: number) => Math.min(1, p.t / Math.max(1, n));
    switch (p.state) {
      case 'free':
        f.walk(this.walkPhase.get(p)!, Math.min(1, moved * 12));
        break;
      case 'attack': {
        const s = p.smash ? T.combo[2] : T.combo[p.combo];
        const wind = p.t < s.startup, strike = p.t < s.startup + s.active + 6;
        const hold = p.holding !== null || p.smash;
        if (p.smash || hold) {
          f.armR.rotation.set(wind ? -2.9 : strike ? -0.9 : -1.2, 0, 0);
        } else if (p.combo === 2) {
          f.legR.rotation.x = wind ? 0.4 : strike ? -1.5 : -0.4;
          f.body.rotation.x = wind ? 0 : -0.25;
        } else {
          const arm = p.combo === 0 ? f.armL : f.armR;
          arm.rotation.set(wind ? -0.6 : strike ? -1.6 : -1.2, 0, 0);
          f.body.rotation.y = (p.combo === 0 ? 1 : -1) * (wind ? -0.2 : 0.35);
        }
        f.body.rotation.x += wind ? 0.05 : -0.12;
        break;
      }
      case 'counter':
        f.armR.rotation.set(p.t < 8 ? -1.7 : -1.3, 0, 0.1);
        f.armL.rotation.set(-0.3, 0, -0.5);
        f.body.rotation.y = -0.5 * (1 - k(T.counter.frames));
        break;
      case 'whiff':
        f.armL.rotation.set(-2.2, 0, -0.6); f.armR.rotation.set(-2.2, 0, 0.6);
        f.body.rotation.x = 0.2;
        break;
      case 'dodge':
        f.body.position.y = -0.35; f.body.rotation.x = -0.5;
        f.legL.rotation.x = -0.9; f.legR.rotation.x = 0.6;
        break;
      case 'hitstun':
        f.body.rotation.x = 0.35 * (1 - k(20)); f.armL.rotation.x = -0.3; f.armR.rotation.x = -0.3;
        break;
      case 'dead':
        f.lieDown(1);
        break;
    }
    if (p.holding !== null && p.state !== 'attack') f.armR.rotation.set(-0.5, 0, 0.1);
    f.glow(0xffffff, p.state === 'counter' ? 0.25 : p.state === 'hitstun' && w.frame % 6 < 3 ? 0.4 : 0);
  }

  private poseEnemy(e: Enemy, f: Figure, w: World) {
    f.reset();
    f.place(e.pos, e.facing);
    const moved = this.stride(e, e.pos);
    const heavy = e.kind === 'heavy';
    switch (e.state) {
      case 'spawn': case 'circle': case 'approach': case 'recover':
        f.walk(this.walkPhase.get(e)!, Math.min(1, moved * 12));
        if (e.state === 'recover') { f.armR.rotation.set(-1.3, 0, 0.2); f.body.rotation.x = -0.15; }
        break;
      case 'windup': {
        const k = e.t / e.dur;
        if (heavy) { f.armL.rotation.set(-1.1 - 1.9 * k, 0, -0.2); f.armR.rotation.set(-1.1 - 1.9 * k, 0, 0.2); f.body.rotation.x = 0.25 * k; }
        else { f.armR.rotation.set(-1.1 + 1.6 * k, 0, 0.5 * k); f.body.rotation.y = -0.7 * k; }
        break;
      }
      case 'active':
        if (heavy) { f.armL.rotation.set(-1.3, 0, 0); f.armR.rotation.set(-1.3, 0, 0); f.body.rotation.x = -0.4; }
        else { f.armR.rotation.set(-1.65, 0, 0); f.body.rotation.y = 0.4; f.body.rotation.x = -0.15; }
        break;
      case 'stun':
        f.body.rotation.x = 0.4; f.armL.rotation.x = -0.2; f.armR.rotation.x = -0.2;
        break;
      case 'down':
        f.lieDown(Math.min(1, e.t / 8));
        break;
      case 'getup':
        f.lieDown(1 - e.t / e.dur);
        break;
      case 'dead':
        f.lieDown(Math.min(1, e.t / 8 + 0.3));
        break;
    }
    const strike = framesToStrike(e);
    let glow = 0, color = 0xffd23f;
    if (strike !== null && strike <= T.counter.window) { glow = 0.5 + 0.3 * Math.sin(w.frame * 0.8); color = heavy ? 0xff2020 : 0xffd23f; }
    if (e.state === 'stun' && e.t < 4) { glow = 0.8; color = 0xffffff; }
    f.glow(color, glow);
  }

  private burst(pos: Vec, color: number, size: number, life: number) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(size, 12, 8), new THREE.MeshBasicMaterial({ color, transparent: true }));
    m.position.set(pos.x, 1.2, pos.y);
    this.scene.add(m);
    this.fx.push({ mesh: m, life, max: life, grow: 2.5 });
  }

  private shards(pos: Vec) {
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), new THREE.MeshBasicMaterial({ color: 0x6fd36f, transparent: true }));
      m.position.set(pos.x, 1.1, pos.y);
      const a = Math.random() * Math.PI * 2;
      this.scene.add(m);
      this.fx.push({ mesh: m, life: 30, max: 30, vel: new THREE.Vector3(Math.cos(a) * 0.08, 0.06 + Math.random() * 0.06, Math.sin(a) * 0.08) });
    }
  }

  clear() {
    for (const v of this.enemies.values()) { this.scene.remove(v.fig.root); v.prompt.remove(); v.bar.remove(); }
    this.enemies.clear();
  }

  events(evts: GameEvent[]) {
    for (const ev of evts) {
      if (ev.type === 'hit') this.burst(ev.pos, 0xffffff, ev.heavy ? 0.35 : 0.22, ev.heavy ? 10 : 7);
      if (ev.type === 'counter') this.burst(ev.pos, 0xffd23f, 0.45, 12);
      if (ev.type === 'playerHit') this.burst(ev.pos, 0xff4040, 0.3, 9);
      if (ev.type === 'shatter') this.shards(ev.pos);
    }
  }

  draw(w: World) {
    this.posePlayer(w.player, w);

    const seen = new Set<number>();
    for (const e of w.enemies) {
      seen.add(e.id);
      let v = this.enemies.get(e.id);
      if (!v) {
        const fig = new Figure(COLORS[e.kind], e.kind === 'heavy' ? 1.18 : 1);
        this.scene.add(fig.root);
        const prompt = document.createElement('div'); prompt.className = 'prompt';
        const bar = document.createElement('div'); bar.className = 'ebar'; bar.appendChild(document.createElement('i'));
        this.overlay.append(prompt, bar);
        v = { fig, prompt, bar };
        this.enemies.set(e.id, v);
      }
      if (w.hitstop === 0 || e.state === 'dead') this.poseEnemy(e, v.fig, w);

      const head = new THREE.Vector3(e.pos.x, e.kind === 'heavy' ? 2.6 : 2.25, e.pos.y).project(this.camera);
      const sx = (head.x * 0.5 + 0.5) * innerWidth, sy = (-head.y * 0.5 + 0.5) * innerHeight;
      const strike = framesToStrike(e);
      const canCounter = counterable(w, e);
      const mustDodge = e.kind === 'heavy' && strike !== null && strike <= T.counter.window;
      v.prompt.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
      v.prompt.textContent = canCounter ? 'Y' : mustDodge ? 'A' : '';
      v.prompt.className = 'prompt' + (canCounter ? ' counter' : mustDodge ? ' dodge' : '');
      v.bar.style.transform = `translate(${sx}px, ${sy + 22}px) translate(-50%, 0)`;
      v.bar.style.opacity = e.state === 'dead' || e.hp === e.maxHp ? '0' : '1';
      (v.bar.firstChild as HTMLElement).style.width = `${(e.hp / e.maxHp) * 100}%`;
    }
    for (const [id, v] of this.enemies) {
      if (!seen.has(id)) { this.scene.remove(v.fig.root); v.prompt.remove(); v.bar.remove(); this.enemies.delete(id); }
    }

    for (const b of w.bottles) {
      let m = this.bottles.get(b.id);
      if (!m) {
        m = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.4, 10), new THREE.MeshStandardMaterial({ color: 0x3f9f4f, roughness: 0.2, metalness: 0.1 }));
        m.castShadow = true; this.scene.add(m); this.bottles.set(b.id, m);
      }
      m.visible = b.state !== 'broken';
      if (b.state === 'held') {
        const p = w.player;
        const side = { x: -p.facing.y, y: p.facing.x };
        m.position.set(p.pos.x + p.facing.x * 0.3 - side.x * 0.4, 1.0, p.pos.y + p.facing.y * 0.3 - side.y * 0.4);
        m.rotation.set(0, 0, 0);
      } else if (b.state === 'flying') {
        m.position.set(b.pos.x, 1.1, b.pos.y);
        m.rotation.x += 0.5;
      } else {
        m.position.set(b.pos.x, 0.26, b.pos.y);
        m.rotation.set(0, 0, 0);
        m.position.y = 0.26 + Math.sin(w.frame * 0.08) * 0.03;
      }
    }

    for (let i = this.fx.length - 1; i >= 0; i--) {
      const f = this.fx[i];
      f.life--;
      const k = f.life / f.max;
      if (f.grow) f.mesh.scale.setScalar(1 + (1 - k) * f.grow);
      if (f.vel) { f.mesh.position.add(f.vel); f.vel.y -= 0.006; }
      ((f.mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = k;
      if (f.life <= 0) { this.scene.remove(f.mesh); this.fx.splice(i, 1); }
    }

    const p = w.player.pos;
    this.camTarget.lerp(new THREE.Vector3(p.x * 0.6, 0, p.y * 0.5), 0.08);
    const s = w.shake;
    this.camera.position.set(this.camTarget.x + (Math.random() - 0.5) * s, 15 + (Math.random() - 0.5) * s, this.camTarget.z + 11);
    this.camera.lookAt(this.camTarget.x, 0.6, this.camTarget.z);
    this.renderer.render(this.scene, this.camera);
  }
}
