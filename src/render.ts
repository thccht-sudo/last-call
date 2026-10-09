// Draws a World. Reads sim state only; never changes it.
import * as THREE from 'three';
import { TUNING as T, EnemyKind } from './sim/tuning';
import { World, Enemy, Player, GameEvent, Vec, counterable, deflectable, framesToStrike } from './sim/world';
import { buildKilroys } from './scene/kilroys';
import { LEVEL } from './sim/level';
import { Figure, Look } from './figure';
import { CLIPS } from './anim/pose';
import { playerPose, enemyPose, Blender, Motion } from './anim/moves';


// From their photos. Player 1 is Conrad (6'5"): black collared work shirt, tousled brown hair,
// short brown beard. Player 2 is George (5'10"): navy suit, open light-blue collar, full dark
// beard, dark glasses, dark swept-up hair.
export const CAST: { name: string; css: string; look: Look }[] = [
  { name: 'CONRAD', css: '#2bb3a3', look: { shirt: 0x1e1f22, collar: 0x2c2d31, pants: 0x2b3448, skin: 0xe6b996, hair: 0x4e3524, messy: true, beard: 0x5a3b26, longSleeves: true, scale: 1.1 } },
  {
    name: 'GEORGE', css: '#6f8fe0',
    look: { jacket: 0x1f2d5a, shirt: 0xc8daf0, pants: 0x1b2340, skin: 0xe4bc98, hair: 0x2a1d16, beard: 0x3a2518, glasses: true, scale: 1.0 },
  },
];

// The opposition: IU fraternity shirts. Heavies are always FIJI.
const FRATS = [
  { letters: 'ΦΓΔ', shirt: 0x5b2a86, ink: '#f4f1ea' }, // FIJI
  { letters: 'ΑΤΩ', shirt: 0x2f6db5, ink: '#f2c443' }, // ATO
  { letters: 'ΒΘΠ', shirt: 0xe58fb0, ink: '#23408f' }, // Beta
  { letters: 'ΣΧ', shirt: 0x1f3f8f, ink: '#f2c443' }, // Sigma Chi
  { letters: 'ΦΔΘ', shirt: 0xe4e4e4, ink: '#1f4fa6' }, // Phi Delt
  { letters: 'ΚΣ', shirt: 0xb32030, ink: '#f4f1ea' }, // Kappa Sig
];
const PANTS = [0x2b3448, 0x6b5a45, 0x3a3f46, 0x2a2a30];
const SKINS = [0xe0b48a, 0xc89470, 0xf0c8a4, 0x8d5f43, 0xd9a882];
const SCALE: Record<EnemyKind, number> = { thug: 1, heavy: 1.18, thrower: 0.95, grappler: 1.12, boss: 1.35 };
const thugLook = (kind: EnemyKind, id: number): Look => {
  const f = kind === 'heavy' || kind === 'boss' ? FRATS[0] : FRATS[(id * 7) % FRATS.length];
  return {
    shirt: f.shirt, pants: PANTS[id % PANTS.length], skin: SKINS[(id * 3) % SKINS.length],
    hair: [0x2a1d16, 0x6b4a2a, 0xb08a50, 0x1a1a1a][(id * 5) % 4],
    print: { letters: f.letters, ink: f.ink }, scale: SCALE[kind],
  };
};

interface Fx { mesh: THREE.Object3D; life: number; max: number; vel?: THREE.Vector3; grow?: number }

export class Renderer {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  private players: { fig: Figure; tag: HTMLDivElement }[] = [];
  private enemies = new Map<number, { fig: Figure; prompt: HTMLDivElement; bar: HTMLDivElement }>();
  private bottles = new Map<number, THREE.Mesh>();
  private cups = new Map<number, { mesh: THREE.Group; prompt: HTMLDivElement }>();
  private bossBar: HTMLDivElement | null = null;
  private fx: Fx[] = [];
  private camTarget = new THREE.Vector3();
  private moves = new Map<object, { last: Vec; distance: number; speed: number }>();
  private blenders = new Map<object, Blender>();
  private overlay: HTMLElement;

  constructor(canvas: HTMLCanvasElement, overlay: HTMLElement) {
    this.overlay = overlay;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    buildKilroys(this.scene);

    addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize() {
    const { innerWidth: w, innerHeight: h } = window;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // Distance walked and current speed per character, for stepping the gait cycles.
  private motion(key: object, pos: Vec, topSpeed: number): Motion {
    let m = this.moves.get(key);
    if (!m) { m = { last: { ...pos }, distance: 0, speed: 0 }; this.moves.set(key, m); }
    const d = Math.hypot(pos.x - m.last.x, pos.y - m.last.y);
    m.last = { ...pos };
    m.distance += d;
    m.speed += (Math.min(1, d / (topSpeed / 60)) - m.speed) * 0.25;
    return m;
  }

  private blender(key: object) {
    let b = this.blenders.get(key);
    if (!b) { b = new Blender(); this.blenders.set(key, b); }
    return b;
  }

  private posePlayer(p: Player, f: Figure, w: World) {
    f.place(p.pos, p.facing);
    const target = playerPose(p, w, this.motion(p, p.pos, T.player.speed));
    const contact = p.state === 'attack' || p.state === 'counter';
    f.apply(this.blender(p).next(`${p.state}:${p.combo}:${p.smash}`, target, contact));
    f.glow(0xffffff, p.state === 'counter' ? 0.25 : p.state === 'hitstun' && w.frame % 6 < 3 ? 0.4 : 0);
  }

  private poseEnemy(e: Enemy, f: Figure, w: World) {
    f.place(e.pos, e.facing);
    const target = enemyPose(e, w, this.motion(e, e.pos, T[e.kind].speed));
    f.apply(this.blender(e).next(e.state, target, e.state === 'active' || e.state === 'down'));
    const strike = framesToStrike(e);
    let glow = 0, color = 0xffd23f;
    if (strike !== null && strike <= T.counter.window) { glow = 0.5 + 0.3 * Math.sin(w.frame * 0.8); color = e.unblockable ? 0xff2020 : 0xffd23f; }
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
    for (const v of this.cups.values()) { this.scene.remove(v.mesh); v.prompt.remove(); }
    this.cups.clear();
    this.bossBar?.remove(); this.bossBar = null;
  }

  private screen(x: number, y: number, z: number) {
    const v = new THREE.Vector3(x, y, z).project(this.camera);
    return { sx: (v.x * 0.5 + 0.5) * innerWidth, sy: (-v.y * 0.5 + 0.5) * innerHeight };
  }

  private popup(pos: Vec, text: string) {
    const el = document.createElement('div');
    el.className = 'popup'; el.textContent = text;
    const { sx, sy } = this.screen(pos.x, 2.6, pos.y);
    el.style.left = `${sx}px`; el.style.top = `${sy}px`;
    this.overlay.append(el);
    setTimeout(() => el.remove(), 900);
  }

  events(evts: GameEvent[]) {
    for (const ev of evts) {
      if (ev.type === 'hit') this.burst(ev.pos, 0xffffff, ev.heavy ? 0.35 : 0.22, ev.heavy ? 10 : 7);
      if (ev.type === 'counter') this.burst(ev.pos, 0xffd23f, 0.45, 12);
      if (ev.type === 'playerHit') this.burst(ev.pos, 0xff4040, 0.3, 9);
      if (ev.type === 'shatter') this.shards(ev.pos);
      if (ev.type === 'tag') this.popup(ev.pos, 'TAG TEAM!');
      if (ev.type === 'slam') { this.burst(ev.pos, 0xffffff, 0.5, 12); this.popup(ev.pos, 'SLAM!'); }
      if (ev.type === 'deflect') { this.burst(ev.pos, 0xffd23f, 0.3, 8); this.popup(ev.pos, 'RETURN TO SENDER'); }
    }
  }

  draw(w: World) {
    w.players.forEach((p, i) => {
      let v = this.players[i];
      if (!v) {
        const fig = new Figure(CAST[i].look, CLIPS.guard.frames[0]);
        this.scene.add(fig.root);
        const tag = document.createElement('div'); tag.className = 'nametag';
        tag.style.setProperty('--c', CAST[i].css);
        this.overlay.append(tag);
        v = this.players[i] = { fig, tag };
      }
      if (w.hitstop === 0) this.posePlayer(p, v.fig, w);
      const { sx, sy } = this.screen(p.pos.x, p.state === 'down' ? 0.9 : 2.25 * CAST[i].look.scale, p.pos.y);
      v.tag.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%)`;
      const reviving = p.state === 'down' && p.revive > 0;
      v.tag.textContent = p.state === 'grabbed' ? `${CAST[i].name} · MASH!` : p.state === 'down' ? (reviving ? `${CAST[i].name} ${Math.round(p.revive / T.coop.reviveFrames * 100)}%` : `${CAST[i].name} · HELP`) : CAST[i].name;
      v.tag.classList.toggle('down', p.state === 'down' || p.state === 'grabbed');
    });
    for (let i = w.players.length; i < this.players.length; i++) { this.scene.remove(this.players[i].fig.root); this.players[i].tag.remove(); }
    this.players.length = Math.min(this.players.length, w.players.length);

    const seen = new Set<number>();
    for (const e of w.enemies) {
      seen.add(e.id);
      let v = this.enemies.get(e.id);
      if (!v) {
        const fig = new Figure(thugLook(e.kind, e.id), CLIPS.guard.frames[0]);
        this.scene.add(fig.root);
        const prompt = document.createElement('div'); prompt.className = 'prompt';
        const bar = document.createElement('div'); bar.className = 'ebar'; bar.appendChild(document.createElement('i'));
        this.overlay.append(prompt, bar);
        v = { fig, prompt, bar };
        this.enemies.set(e.id, v);
      }
      if (w.hitstop === 0 || e.state === 'dead') this.poseEnemy(e, v.fig, w);

      const head = new THREE.Vector3(e.pos.x, 2.2 * SCALE[e.kind] + 0.1, e.pos.y).project(this.camera);
      const sx = (head.x * 0.5 + 0.5) * innerWidth, sy = (-head.y * 0.5 + 0.5) * innerHeight;
      const strike = framesToStrike(e);
      const canCounter = w.players.some(p => counterable(p, e));
      const mustDodge = e.unblockable && strike !== null && strike <= T.counter.window;
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

    // Red cups in flight, with a counter prompt when someone can knock one back.
    const liveCups = new Set<number>();
    for (const c of w.cups) {
      liveCups.add(c.id);
      let v = this.cups.get(c.id);
      if (!v) {
        const mesh = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.22, 12), new THREE.MeshStandardMaterial({ color: 0xc8191e, roughness: 0.5 }));
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 6, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        rim.rotation.x = Math.PI / 2; rim.position.y = 0.11;
        mesh.add(body, rim); this.scene.add(mesh);
        const prompt = document.createElement('div'); prompt.className = 'prompt';
        this.overlay.append(prompt);
        v = { mesh, prompt };
        this.cups.set(c.id, v);
      }
      v.mesh.position.set(c.pos.x, 1.3, c.pos.y);
      v.mesh.rotation.x += 0.35; v.mesh.rotation.z += 0.2;
      const can = w.players.some(p => deflectable(p, c));
      const { sx, sy } = this.screen(c.pos.x, 1.9, c.pos.y);
      v.prompt.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
      v.prompt.textContent = can ? 'Y' : '';
      v.prompt.className = 'prompt' + (can ? ' counter' : '');
    }
    for (const [id, v] of this.cups) if (!liveCups.has(id)) { this.scene.remove(v.mesh); v.prompt.remove(); this.cups.delete(id); }

    // The boss gets a health bar across the bottom of the screen.
    const boss = w.enemies.find(e => e.kind === 'boss' && e.state !== 'dead');
    if (boss && !this.bossBar) {
      this.bossBar = document.createElement('div'); this.bossBar.className = 'bossbar';
      this.bossBar.innerHTML = '<b>THE FIJI PRESIDENT</b><div><i></i></div>';
      this.overlay.append(this.bossBar);
    }
    if (this.bossBar) {
      if (!boss) { this.bossBar.remove(); this.bossBar = null; }
      else {
        (this.bossBar.querySelector('i') as HTMLElement).style.width = `${(boss.hp / boss.maxHp) * 100}%`;
        this.bossBar.classList.toggle('enraged', boss.enraged);
      }
    }

    for (const b of w.bottles) {
      let m = this.bottles.get(b.id);
      if (!m) {
        m = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.4, 10), new THREE.MeshStandardMaterial({ color: 0x3f9f4f, roughness: 0.2, metalness: 0.1 }));
        m.castShadow = true; this.scene.add(m); this.bottles.set(b.id, m);
      }
      m.visible = b.state !== 'broken';
      if (b.state === 'held') {
        const p = w.players[b.holder];
        const side = { x: -p.facing.y, y: p.facing.x };
        m.position.set(p.pos.x + p.facing.x * 0.3 - side.x * 0.4, 1.0, p.pos.y + p.facing.y * 0.3 - side.y * 0.4);
        m.rotation.set(0, 0, 0);
      } else if (b.state === 'flying') {
        m.position.set(b.pos.x, 1.1, b.pos.y);
        m.rotation.x += 0.5;
      } else {
        const onTable = b.pos.x === b.home.x && b.pos.y === b.home.y;
        m.position.set(b.pos.x, onTable ? (LEVEL.obstacles.some(o => o.kind === 'planter' && Math.abs(o.x - b.pos.x) < o.w / 2 && Math.abs(o.y - b.pos.y) < o.h / 2) ? 0.8 : 0.99) : 0.1, b.pos.y);
        m.rotation.set(0, 0, onTable ? 0 : Math.PI / 2);
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

    const up = w.players.filter(p => p.state !== 'down');
    const focus = (up.length ? up : w.players).reduce((a, p, _, all) => ({ x: a.x + p.pos.x / all.length, y: a.y + p.pos.y / all.length }), { x: 0, y: 0 });
    this.camTarget.lerp(new THREE.Vector3(focus.x * 0.55, 0, focus.y * 0.35), 0.08);
    const s = w.shake;
    this.camera.position.set(this.camTarget.x + (Math.random() - 0.5) * s, 10.5 + (Math.random() - 0.5) * s, this.camTarget.z + 12.5);
    this.camera.lookAt(this.camTarget.x, 1.6, this.camTarget.z - 2.2);
    this.renderer.render(this.scene, this.camera);
  }
}
