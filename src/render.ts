// Draws a World. Reads sim state only; never changes it.
import * as THREE from 'three';
import { TUNING as T, EnemyKind } from './sim/tuning';
import { World, Enemy, Player, GameEvent, Vec, counterable, counterWindow, deflectable, framesToStrike } from './sim/world';
import { buildKilroys } from './scene/kilroys';
import { buildInterior } from './scene/interior';
import { LEVELS } from './sim/level';
import { Figure, Look } from './figure';
import { CLIPS, Pose, mix } from './anim/pose';
import { playerPose, enemyPose, Blender, Motion } from './anim/moves';
import { Ragdoll, Props } from './physics';


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
  { letters: 'ΚΣ', shirt: 0x1f8a4c, ink: '#f4f1ea' }, // Kappa Sig, in its emerald (scarlet vanished into the brick)
];
const PANTS = [0x2b3448, 0x6b5a45, 0x3a3f46, 0x2a2a30];
const SKINS = [0xe0b48a, 0xc89470, 0xf0c8a4, 0x8d5f43, 0xd9a882];
const SCALE: Record<EnemyKind, number> = { thug: 1, heavy: 1.18, thrower: 0.95, kicker: 1.02, boss: 1.35 };
export const thugLook = (kind: EnemyKind, id: number): Look => {
  const f = kind === 'heavy' || kind === 'boss' ? FRATS[0] : FRATS[(id * 7) % FRATS.length];
  return {
    shirt: f.shirt, pants: PANTS[id % PANTS.length], skin: SKINS[(id * 3) % SKINS.length],
    hair: [0x2a1d16, 0x6b4a2a, 0xb08a50, 0x1a1a1a][(id * 5) % 4],
    print: { letters: f.letters, ink: f.ink }, scale: SCALE[kind],
    build: kind === 'heavy' || kind === 'boss' ? 'heavy' : kind === 'kicker' || kind === 'thrower' ? 'lean' : 'regular',
    // Identity cues that read from the camera: half the thugs wear backwards caps, the kicker a
    // red headband, the President shades and a gold chain.
    hat: kind === 'kicker' ? 'band' : kind === 'thug' && id % 2 === 0 ? 'cap' : undefined,
    hatColor: kind === 'kicker' ? 0xd8261c : [0xf2f2f2, 0x990000, 0xc9b27c, 0x2a5cc4][(id * 3) % 4], // white, IU crimson, khaki, royal
    shades: kind === 'boss', chain: kind === 'boss',
  };
};

const MOVE_WORDS: Partial<Record<string, string>> = { sweep: 'SWEEP', uppercut: 'LAUNCH', riposte: 'RIPOSTE', knee: 'KNEE!', stomp: 'STOMP', roundhouse: 'KICK', smash: 'BOTTLED' };

// Chevrons pointing along a lunge's path, white-edged so they read on red brick.
let laneTex: THREE.CanvasTexture | null = null;
function laneTexture() {
  if (laneTex) return laneTex;
  const c = document.createElement('canvas'); c.width = 64; c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = 'rgba(255,40,40,0.35)'; g.fillRect(8, 0, 48, 256);
  g.lineJoin = 'round';
  for (let y = 20; y < 256; y += 64) {
    g.beginPath(); g.moveTo(12, y + 28); g.lineTo(32, y); g.lineTo(52, y + 28);
    g.strokeStyle = '#fff'; g.lineWidth = 12; g.stroke();
    g.strokeStyle = '#ff2a2a'; g.lineWidth = 6; g.stroke();
  }
  laneTex = new THREE.CanvasTexture(c); laneTex.colorSpace = THREE.SRGBColorSpace;
  return laneTex;
}

interface Fx { mesh: THREE.Object3D; life: number; max: number; vel?: THREE.Vector3; grow?: number }

// What a figure looked like at the last two sim ticks, so drawing can interpolate between them
// at any frame rate (and through slow motion). `offset` hides teleports (a counter's snap, a
// knockback) by easing the body across instead; `vib` is the hitstop shake.
interface Track {
  prev: { x: number; y: number; z: number; yaw: number; pose: Pose | null };
  cur: { x: number; y: number; z: number; yaw: number; pose: Pose | null };
  offset: THREE.Vector2; vib: { x: number; y: number };
}
const angleTo = (from: number, to: number) => Math.atan2(Math.sin(to - from), Math.cos(to - from));
// Smoothed 1D noise for camera shake: reproducible, and it follows slow motion.
const noise = (t: number, seed: number) => Math.sin(t * 1.7 + seed) * 0.5 + Math.sin(t * 2.9 + seed * 2.3) * 0.3 + Math.sin(t * 5.3 + seed * 0.7) * 0.2;

export class Renderer {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  private players: { fig: Figure; tag: HTMLDivElement }[] = [];
  private enemies = new Map<number, { fig: Figure; prompt: HTMLDivElement; bar: HTMLDivElement; edge: HTMLDivElement; lane: THREE.Mesh }>();
  private bottles = new Map<number, THREE.Mesh>();
  private cups = new Map<number, { mesh: THREE.Group; prompt: HTMLDivElement }>();
  private bossBar: HTMLDivElement | null = null;
  private stages: THREE.Group[] = [];
  private shown = -1;
  private punchUntil = 0;
  private punchMs = 1;
  private punchAt: Vec = { x: 0, y: 0 };

  // Camera push-in on a knockout, for the slow-motion finisher.
  punch(at: Vec, ms: number) { this.punchAt = { ...at }; this.punchMs = ms; this.punchUntil = performance.now() + ms; }

  // 0 = full quality, 1 = no shadows at native resolution, 2 = no shadows at reduced resolution.
  quality = 0;
  setQuality(q: number) {
    if (q === this.quality) return;
    this.quality = q;
    this.renderer.setPixelRatio(q === 0 ? Math.min(devicePixelRatio, 2) : q === 1 ? 1 : 0.7);
    this.renderer.shadowMap.enabled = q === 0;
    this.scene.traverse(o => {
      if (o instanceof THREE.Mesh) {
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.needsUpdate = true;
      }
    });
    this.resize();
  }
  private fx: Fx[] = [];
  private camTarget = new THREE.Vector3();
  private camPrev = new THREE.Vector3();
  private tracks = new Map<string, Track>();
  private camZoom = 1; private zoomPrev = 1;
  private trauma = 0; private kick = new THREE.Vector2(); private fovPunch = 0; private ticks = 0;
  private ragdolls = new Map<string, Ragdoll>();
  private restPose = new Map<string, Pose>();
  private risingT = new Map<string, number>();
  private props: Props[] = [];
  private moves = new Map<string, { last: Vec; distance: number; speed: number }>();
  private blenders = new Map<string, Blender>();
  private overlay: HTMLElement;

  constructor(canvas: HTMLCanvasElement, overlay: HTMLElement) {
    this.overlay = overlay;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // One group per stage: out front, then inside. Only the current one is drawn.
    for (const build of [buildKilroys, buildInterior]) {
      const g = new THREE.Group();
      build(g);
      this.stages.push(g);
      this.props.push(new Props(g.userData.props ?? []));
      this.scene.add(g);
    }

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
  private motion(key: string, pos: Vec, topSpeed: number): Motion {
    let m = this.moves.get(key);
    if (!m) { m = { last: { ...pos }, distance: 0, speed: 0 }; this.moves.set(key, m); }
    const d = Math.hypot(pos.x - m.last.x, pos.y - m.last.y);
    // Walking bodies shove loose props along.
    if (d > 1e-3 && d < 0.5) this.props[this.shown]?.nudge(pos, { x: pos.x - m.last.x, y: pos.y - m.last.y });
    m.last = { ...pos };
    m.distance += d;
    m.speed += (Math.min(1, d / (topSpeed / 60)) - m.speed) * 0.25;
    return m;
  }

  private blender(key: string) {
    let b = this.blenders.get(key);
    if (!b) { b = new Blender(); this.blenders.set(key, b); }
    return b;
  }

  // A fighter on the floor is a ragdoll, launched from whatever pose they were in when they
  // went down. Getting up eases from where the ragdoll came to rest back to the guard.
  private ragdollPose(key: string, f: Figure, w: World, anchor: Vec, launch: THREE.Vector3): Pose {
    let rag = this.ragdolls.get(key);
    f.root.updateMatrixWorld(true);
    if (!rag) {
      const from = this.blender(key).last ?? CLIPS.guard.frames[0];
      const world = Array.from({ length: from.length / 3 }, (_, i) => new THREE.Vector3(from[i * 3], from[i * 3 + 1], from[i * 3 + 2]).applyMatrix4(f.root.matrixWorld));
      rag = new Ragdoll(world, launch, 3);
      this.ragdolls.set(key, rag);
    }
    rag.step(LEVELS[w.stage].obstacles, anchor);
    const pose = rag.toLocal(f.root);
    this.restPose.set(key, pose);
    return pose;
  }

  private rising(key: string, target: Pose, u: number): Pose {
    this.ragdolls.delete(key);
    const rest = this.restPose.get(key);
    return rest ? mix(rest, target, Math.min(1, u * u * 1.4)) : target;
  }

  // Record this tick's placement for a figure, turning toward the sim's facing at a capped rate
  // (snapping when `snap`), and place the figure there for anything that needs its matrix.
  private track(key: string, f: Figure, pos: Vec, facing: Vec, z: number, snap: boolean, stop: number, hitDir: Vec, victim: boolean) {
    const want = Math.atan2(facing.x, facing.y);
    let t = this.tracks.get(key);
    if (!t) {
      const c = { x: pos.x, y: pos.y, z, yaw: want, pose: null };
      t = { prev: { ...c }, cur: { ...c }, offset: new THREE.Vector2(), vib: { x: 0, y: 0 } };
      this.tracks.set(key, t);
    }
    t.prev = { ...t.cur };
    // A jump too big to be running: ease across it instead of popping (but not a stage change).
    const jump = Math.hypot(pos.x - t.cur.x, pos.y - t.cur.y);
    if (jump > 0.6 && jump < 5) t.offset.x += t.cur.x - pos.x, t.offset.y += t.cur.y - pos.y;
    t.offset.multiplyScalar(0.72);
    const d = angleTo(t.cur.yaw, want);
    const turn = snap ? d : Math.sign(d) * Math.min(Math.abs(d), Math.max(0.15, Math.abs(d) * 0.35));
    t.cur = { x: pos.x, y: pos.y, z, yaw: t.cur.yaw + turn, pose: t.cur.pose };
    // Hitstop shake: the victim rattles along the line of the hit, the attacker barely.
    const amp = stop > 0 ? (victim ? 0.07 : 0.015) * Math.min(1, stop / 6) * (this.ticks % 2 ? 1 : -1) : 0;
    t.vib = { x: hitDir.x * amp, y: hitDir.y * amp };
    f.root.position.set(pos.x + t.offset.x, z, pos.y + t.offset.y);
    f.root.rotation.y = t.cur.yaw;
    return t;
  }

  // Draw a tracked figure between its last two ticks.
  private show(key: string, f: Figure, alpha: number) {
    const t = this.tracks.get(key);
    if (!t || !t.cur.pose) return;
    const a = t.prev, b = t.cur;
    f.root.position.set(a.x + (b.x - a.x) * alpha + t.offset.x + t.vib.x, a.z + (b.z - a.z) * alpha, a.y + (b.y - a.y) * alpha + t.offset.y + t.vib.y);
    f.root.rotation.y = a.yaw + angleTo(a.yaw, b.yaw) * alpha;
    const bp = b.pose!;
    f.apply(a.pose && alpha < 1 ? mix(a.pose, bp, alpha) : bp);
  }

  private posePlayer(p: Player, f: Figure, w: World) {
    const key = `p${p.index}`;
    const tr = this.track(key, f, p.pos, p.facing, 0, p.state === 'counter' || (p.state === 'attack' && p.t >= p.lead) || p.state === 'dodge', p.stop, p.hitDir, p.state === 'hitstun');
    if (p.stop > 0 || w.hitstop > 0) { tr.prev.pose = tr.cur.pose; return; }
    let target = playerPose(p, w, this.motion(key, p.pos, T.player.speed));
    if (p.state === 'down') {
      target = this.ragdollPose(key, f, w, p.pos, new THREE.Vector3(-p.facing.x * 2, 2, -p.facing.y * 2));
    } else if (this.ragdolls.has(key) || this.restPose.has(key)) {
      // Just revived: stand up out of the ragdoll over a third of a second.
      const k = (this.risingT.get(key) ?? 0) + 1;
      this.risingT.set(key, k);
      target = this.rising(key, target, k / 20);
      if (k >= 20) { this.restPose.delete(key); this.risingT.delete(key); }
    }
    const contact = p.state === 'attack' || p.state === 'counter';
    const travel = p.state === 'attack' && p.t < p.lead;
    if (p.state === 'down') tr.offset.set(0, 0);
    tr.cur.pose = this.blender(key).next(`${p.state}:${p.move}:${travel}`, target, (contact && !travel) || p.state === 'down' || p.state === 'dodge');
    if (!tr.prev.pose) tr.prev.pose = tr.cur.pose;
    f.glow(0xffffff, p.state === 'counter' ? 0.25 : p.state === 'hitstun' && w.frame % 6 < 3 ? 0.4 : 0);
  }

  private poseEnemy(e: Enemy, f: Figure, w: World) {
    const key = `e${e.id}`;
    // Launched enemies fly at their height; a knockout in the air starts the ragdoll up there.
    const z = e.state === 'air' || (e.state === 'dead' && !this.ragdolls.has(key)) ? e.z : 0;
    const tr = this.track(key, f, e.pos, e.facing, z, e.state === 'active' || e.state === 'stun' && e.t < 2, e.stop, e.hitDir, true);
    if ((e.stop > 0 || w.hitstop > 0) && e.state !== 'dead') {
      // Impact flash for the first frames of the freeze.
      if (e.stop >= 5) f.glow(0xffffff, 0.9);
      tr.prev.pose = tr.cur.pose; return;
    }
    let target = enemyPose(e, w, this.motion(key, e.pos, T[e.kind].speed));
    if (e.state === 'down' || e.state === 'dead') {
      // Launch speed from the knockback the simulation gave them: harder hits fly higher.
      const v = Math.hypot(e.vel.x, e.vel.y) * 60;
      const dir = v > 0.1 ? { x: e.vel.x * 60 / v, y: e.vel.y * 60 / v } : { x: -e.facing.x, y: -e.facing.y };
      const heavy = e.kind === 'heavy' || e.kind === 'boss' ? 0.6 : 1;
      // Knocked out of the air (a spike): the ragdoll starts up where he was and is driven down.
      const fromAir = !this.ragdolls.has(key) && tr.prev.z > 0.25;
      if (fromAir) f.root.position.y = tr.prev.z;
      const launch = new THREE.Vector3(dir.x * Math.min(7, 1.5 + v * 0.35) * heavy, fromAir ? -7 : Math.min(5.5, 1.6 + v * 0.22) * heavy, dir.y * Math.min(7, 1.5 + v * 0.35) * heavy);
      target = this.ragdollPose(key, f, w, e.pos, launch);
    } else if (e.state === 'getup') {
      target = this.rising(key, target, e.t / Math.max(1, e.dur));
    } else this.restPose.delete(key);
    tr.cur.pose = this.blender(key).next(`${e.state}:${e.attack}`, target, e.state === 'active' || e.state === 'down' || e.state === 'dead');
    if (!tr.prev.pose) tr.prev.pose = tr.cur.pose;
    // A ragdoll lives in world space: no smoothing offset under it.
    if (e.state === 'down' || e.state === 'dead') tr.offset.set(0, 0);
    const strike = framesToStrike(e);
    let glow = 0, color = 0xffd23f;
    // Red attacks glow from the start of the wind-up so the dodge can be planned; both colours
    // pulse once the counter window opens.
    if (e.unblockable && e.state === 'windup') { glow = 0.3; color = 0xff2020; }
    if (strike !== null && strike <= counterWindow(w)) { glow = 0.5 + 0.3 * Math.sin(w.frame * 0.8); color = e.unblockable ? 0xff2020 : 0xffd23f; }
    if (e.state === 'stun' && e.t < 4) { glow = 0.8; color = 0xffffff; }
    f.glow(color, glow);
  }

  private burst(pos: Vec, color: number, size: number, life: number) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(size * 0.6, 12, 8), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 }));
    m.position.set(pos.x, 1.2, pos.y);
    this.scene.add(m);
    this.fx.push({ mesh: m, life: Math.round(life * 0.7), max: Math.round(life * 0.7), grow: 1.4 });
  }

  // A puff of dust where an evade pushed off, so the step reads even when it's up the screen.
  private dust(pos: Vec) {
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2, r = 0.05 + Math.random() * 0.05;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.09 + Math.random() * 0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xb8aa98, transparent: true, opacity: 0.6, depthWrite: false }));
      m.position.set(pos.x, 0.12, pos.y);
      this.scene.add(m);
      this.fx.push({ mesh: m, life: 16, max: 16, vel: new THREE.Vector3(Math.cos(a) * r, 0.012, Math.sin(a) * r), grow: 1.5 });
    }
  }

  // Streaks thrown out along the blow: a few for a jab, a spray for a heavy hit.
  private sparks(pos: Vec, dir: Vec | undefined, heavy: boolean) {
    const d = dir ?? { x: 0, y: 1 };
    const base = Math.atan2(d.y, d.x);
    for (let i = 0; i < (heavy ? 12 : 5); i++) {
      const a = base + (Math.random() - 0.5) * (heavy ? 1.6 : 1.0);
      const speed = (heavy ? 0.16 : 0.11) * (0.6 + Math.random() * 0.8);
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, heavy ? 0.42 : 0.3), new THREE.MeshBasicMaterial({ color: Math.random() < 0.5 ? 0xffffff : 0xffd98a, transparent: true }));
      m.position.set(pos.x, 1.15 + (Math.random() - 0.5) * 0.3, pos.y);
      const vel = new THREE.Vector3(Math.cos(a) * speed, 0.02 + Math.random() * 0.04, Math.sin(a) * speed);
      m.lookAt(m.position.clone().add(vel));
      this.scene.add(m);
      this.fx.push({ mesh: m, life: heavy ? 9 : 7, max: heavy ? 9 : 7, vel });
    }
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
    for (const v of this.enemies.values()) { this.scene.remove(v.fig.root, v.lane); v.prompt.remove(); v.bar.remove(); v.edge.remove(); }
    this.enemies.clear();
    this.moves.clear(); this.blenders.clear(); this.tracks.clear();
    this.ragdolls.clear(); this.restPose.clear(); this.risingT.clear();
    for (const p of this.props) p.reset();
    for (const v of this.cups.values()) { this.scene.remove(v.mesh); v.prompt.remove(); }
    this.cups.clear();
    this.bossBar?.remove(); this.bossBar = null;
  }

  private screen(x: number, y: number, z: number) {
    const v = new THREE.Vector3(x, y, z).project(this.camera);
    return { sx: (v.x * 0.5 + 0.5) * innerWidth, sy: (-v.y * 0.5 + 0.5) * innerHeight };
  }

  private popup(pos: Vec, text: string, kind = '') {
    const el = document.createElement('div');
    el.className = `popup ${kind}`; el.textContent = text;
    const { sx, sy } = this.screen(pos.x, 2.6, pos.y);
    el.style.left = `${sx}px`; el.style.top = `${sy}px`;
    this.overlay.append(el);
    setTimeout(() => el.remove(), 900);
  }

  events(evts: GameEvent[]) {
    const props = this.props[this.shown];
    for (const ev of evts) {
      // Camera: trauma by weight, a kick along the blow, a little FOV punch on the big ones.
      const shake = (amount: number, at?: Vec, fov = 0) => {
        this.trauma = Math.min(1, this.trauma + amount);
        this.fovPunch += fov;
        if (at) { const d = new THREE.Vector2(at.x - this.camTarget.x, at.y - this.camTarget.z).normalize().multiplyScalar(amount * 0.35); this.kick.add(d); }
      };
      if (ev.type === 'hit') shake(ev.heavy ? 0.32 : 0.14, ev.pos, ev.heavy ? 1.2 : 0);
      if (ev.type === 'counter') shake(0.38, ev.pos, 1.5);
      if (ev.type === 'launch') shake(0.25, ev.pos, 0.8);
      if (ev.type === 'spike') shake(0.6, ev.pos, 3.5);
      if (ev.type === 'slam') shake(0.5, ev.pos, 2.5);
      if (ev.type === 'ko') shake(0.3, ev.pos, ev.boss ? 4 : 1.5);
      if (ev.type === 'playerHit') shake(ev.heavy ? 0.45 : 0.25, ev.pos);
      if (ev.type === 'enrage') shake(0.5);
      // Impacts scatter nearby props.
      if (ev.type === 'slam') props?.blast(ev.pos, 1.8, 5);
      if (ev.type === 'ko') props?.blast(ev.pos, 1.4, 3.5);
      if (ev.type === 'hit' && ev.heavy) props?.blast(ev.pos, 1.0, 2);
      if (ev.type === 'shatter') props?.blast(ev.pos, 0.8, 1.5);
      // Named moves get a word, so you know what you just did.
      if (ev.type === 'hit' && ev.move && MOVE_WORDS[ev.move]) this.popup(ev.pos, MOVE_WORDS[ev.move]!, 'small');
      if (ev.type === 'whiff') { const p = this.world?.players[ev.by]; if (p) this.popup(p.pos, 'MISS', 'miss'); }
      if (ev.type === 'dodge') { const p = this.world?.players[ev.by]; if (p) this.dust(p.pos); }
      if (ev.type === 'hit') { this.burst(ev.pos, 0xffffff, ev.heavy ? 0.28 : 0.18, ev.heavy ? 8 : 6); this.sparks(ev.pos, ev.by >= 0 ? this.world?.players[ev.by]?.facing : undefined, ev.heavy); }
      if (ev.type === 'counter') this.burst(ev.pos, 0xffd23f, 0.45, 12);
      if (ev.type === 'playerHit') this.burst(ev.pos, 0xffe2c4, 0.22, 6); // not red: red means "dodge this"
      if (ev.type === 'shatter') this.shards(ev.pos);
      if (ev.type === 'tag') this.popup(ev.pos, 'TAG TEAM!');
      if (ev.type === 'slam') { this.burst(ev.pos, 0xffffff, 0.5, 12); this.popup(ev.pos, 'SLAM!'); }
      if (ev.type === 'launch') this.burst(ev.pos, 0xffd23f, 0.3, 10);
      if (ev.type === 'perfect') { this.burst(ev.pos, 0x7fd8ff, 0.5, 14); this.popup(ev.pos, 'PERFECT'); }
      if (ev.type === 'rank') { const p = this.world?.players[ev.player]; if (p) this.popup(p.pos, `${T.style.names[ev.rank]}!`); }
      if (ev.type === 'spike') { props?.blast(ev.pos, 2.0, 4); this.burst({ ...ev.pos }, 0xffffff, 0.6, 14); this.popup(ev.pos, 'SPIKE!'); }
      if (ev.type === 'deflect') { this.burst(ev.pos, 0xffd23f, 0.3, 8); this.popup(ev.pos, 'RETURN TO SENDER'); }
    }
  }

  private playerView(i: number) {
    let v = this.players[i];
    if (!v) {
      const fig = new Figure(CAST[i].look, CLIPS.guard.frames[0]);
      this.scene.add(fig.root);
      // A ring on the floor in the player's colour, so you can find yourself in a crowd.
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.52, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(CAST[i].css), transparent: true, opacity: 0.85, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.02; ring.renderOrder = 1;
      ring.scale.setScalar(1 / (CAST[i].look.scale * 1.08));
      fig.root.add(ring);
      const tag = document.createElement('div'); tag.className = 'nametag';
      tag.style.setProperty('--c', CAST[i].css);
      this.overlay.append(tag);
      v = this.players[i] = { fig, tag };
    }
    return v;
  }

  private enemyView(e: Enemy) {
    let v = this.enemies.get(e.id);
    if (!v) {
      const fig = new Figure(thugLook(e.kind, e.id), CLIPS.guard.frames[0]);
      this.scene.add(fig.root);
      const prompt = document.createElement('div'); prompt.className = 'prompt';
      const bar = document.createElement('div'); bar.className = 'ebar'; bar.appendChild(document.createElement('i'));
      const edge = document.createElement('div'); edge.className = 'edge'; edge.hidden = true;
      this.overlay.append(prompt, bar, edge);
      // The path a red lunge will take, painted on the floor while he winds up.
      const lane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: laneTexture(), transparent: true, opacity: 0, depthWrite: false }));
      lane.rotation.x = -Math.PI / 2; lane.position.y = 0.025; lane.renderOrder = 1; lane.visible = false;
      this.scene.add(lane);
      v = { fig, prompt, bar, edge, lane };
      this.enemies.set(e.id, v);
    }
    return v;
  }

  // Once per simulation tick (so it keeps time with the fight at any frame rate, and slows with
  // it): poses, ragdolls, props, effects, camera target and shake.
  private world: World | null = null;
  update(w: World) {
    this.world = w;
    this.ticks++;
    this.props[w.stage]?.step(LEVELS[w.stage].obstacles);
    w.players.forEach((p, i) => this.posePlayer(p, this.playerView(i).fig, w));
    for (const e of w.enemies) this.poseEnemy(e, this.enemyView(e).fig, w);
    for (let i = this.fx.length - 1; i >= 0; i--) {
      const f = this.fx[i];
      f.life--;
      const k = f.life / f.max;
      if (f.grow) f.mesh.scale.setScalar(1 + (1 - k) * f.grow);
      if (f.vel) { f.mesh.position.add(f.vel); f.vel.y -= 0.006; }
      ((f.mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = k;
      if (f.life <= 0) { this.scene.remove(f.mesh); this.fx.splice(i, 1); }
    }
    // Camera follows the standing players (and leans toward the man they're fighting).
    const up = w.players.filter(p => p.state !== 'down');
    const focus = (up.length ? up : w.players).reduce((a, p, _, all) => ({ x: a.x + p.pos.x / all.length, y: a.y + p.pos.y / all.length }), { x: 0, y: 0 });
    this.camPrev.copy(this.camTarget);
    this.camTarget.lerp(new THREE.Vector3(focus.x * 0.62, 0, focus.y * 0.45), 0.09);
    // Co-op: pull back when the two of you are far apart, so nobody leaves the screen.
    const spread = up.length > 1 ? Math.hypot(up[0].pos.x - up[1].pos.x, (up[0].pos.y - up[1].pos.y) * 1.6) : 0;
    this.zoomPrev = this.camZoom;
    this.camZoom += (Math.max(1, Math.min(1.3, 1 + (spread - 6) / 16)) - this.camZoom) * 0.05;
    this.trauma = Math.max(0, this.trauma - 0.025);
    this.kick.multiplyScalar(0.78);
    this.fovPunch *= 0.86;
  }

  draw(w: World, alpha = 1) {
    if (w.stage !== this.shown) {
      this.shown = w.stage;
      this.stages.forEach((g, i) => { g.visible = i === w.stage; });
      const sky = w.stage === 0 ? 0x0b0e1a : 0x120a08;
      this.scene.background = new THREE.Color(sky);
      this.scene.fog = new THREE.Fog(sky, 26, 48);
    }
    w.players.forEach((p, i) => {
      const v = this.playerView(i);
      this.show(`p${p.index}`, v.fig, alpha);
      const at = v.fig.root.position;
      const { sx, sy } = this.screen(at.x, p.state === 'down' ? 0.9 : 2.25 * CAST[i].look.scale, at.z);
      v.tag.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%)`;
      const reviving = p.state === 'down' && p.revive > 0;
      v.tag.textContent = p.state === 'down' ? (reviving ? `${CAST[i].name} ${Math.round(p.revive / T.coop.reviveFrames * 100)}%` : `${CAST[i].name} · HELP`) : CAST[i].name;
      v.tag.classList.toggle('down', p.state === 'down');
      // Solo, the floor ring marks you; the name only shows in co-op or when you need help.
      v.tag.style.opacity = w.players.length > 1 || p.state === 'down' ? '1' : '0';
    });
    for (let i = w.players.length; i < this.players.length; i++) { this.scene.remove(this.players[i].fig.root); this.players[i].tag.remove(); }
    this.players.length = Math.min(this.players.length, w.players.length);

    const seen = new Set<number>();
    for (const e of w.enemies) {
      seen.add(e.id);
      const v = this.enemyView(e);
      this.show(`e${e.id}`, v.fig, alpha);
      const at = v.fig.root.position;
      const head = new THREE.Vector3(at.x, 2.2 * SCALE[e.kind] + 0.1 + at.y, at.z).project(this.camera);
      const sx = (head.x * 0.5 + 0.5) * innerWidth, sy = (-head.y * 0.5 + 0.5) * innerHeight;
      const strike = framesToStrike(e);
      const canCounter = w.players.some(p => counterable(p, e, counterWindow(w)));
      const mustDodge = e.unblockable && strike !== null && strike <= counterWindow(w) + 10;
      v.prompt.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
      v.prompt.textContent = canCounter ? 'Y' : mustDodge ? 'A' : '';
      v.prompt.className = 'prompt' + (canCounter ? ' counter' : mustDodge ? ' dodge' : '');
      const atk = T.attacks[e.attack];
      v.lane.visible = e.unblockable && atk.lunge > 0 && (e.state === 'windup' || (e.state === 'active' && !e.connected));
      if (v.lane.visible) {
        const length = atk.lunge + atk.reach, u = e.state === 'windup' ? e.t / Math.max(1, e.dur) : 1;
        v.lane.scale.set(0.9, length, 1);
        v.lane.position.set(e.pos.x + e.facing.x * length / 2, 0.025, e.pos.y + e.facing.y * length / 2);
        v.lane.rotation.z = Math.atan2(-e.facing.x, -e.facing.y);
        (v.lane.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.5 * u + (u > 0.6 ? 0.15 * Math.sin(w.frame * 0.9) : 0);
      }
      // A red attack coming from off screen: an arrow at the screen edge pointing at him.
      const off = sx < 0 || sx > innerWidth || sy < 0 || sy > innerHeight;
      v.edge.hidden = !(off && e.unblockable && (e.state === 'windup' || e.state === 'active'));
      if (!v.edge.hidden) {
        const cx = innerWidth / 2, cy = innerHeight / 2, ang = Math.atan2(sy - cy, sx - cx);
        const ex = Math.max(24, Math.min(innerWidth - 24, sx)), ey = Math.max(24, Math.min(innerHeight - 24, sy));
        v.edge.style.transform = `translate(${ex}px, ${ey}px) translate(-50%, -50%) rotate(${ang + Math.PI / 2}rad)`;
      }
      v.bar.style.transform = `translate(${sx}px, ${sy + 22}px) translate(-50%, 0)`;
      v.bar.style.opacity = e.state === 'dead' || e.hp === e.maxHp ? '0' : '1';
      (v.bar.firstChild as HTMLElement).style.width = `${(e.hp / e.maxHp) * 100}%`;
    }
    for (const [id, v] of this.enemies) {
      if (!seen.has(id)) { this.scene.remove(v.fig.root); v.prompt.remove(); v.bar.remove(); v.edge.remove(); this.scene.remove(v.lane); this.enemies.delete(id); this.tracks.delete(`e${id}`); }
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
        m.position.set(b.pos.x, onTable ? ((() => { const under = LEVELS[w.stage].obstacles.find(o => Math.abs(o.x - b.pos.x) < o.w / 2 && Math.abs(o.y - b.pos.y) < o.h / 2); return under?.kind === 'planter' ? 0.8 : under?.kind === 'bar' ? 1.28 : 0.99; })()) : 0.1, b.pos.y);
        m.rotation.set(0, 0, onTable ? 0 : Math.PI / 2);
      }
    }

    // A finishing blow pulls the camera in on the knockout, then eases back out.
    const now = performance.now();
    const pk = this.punchUntil > now ? Math.sin(Math.min(1, (this.punchUntil - now) / this.punchMs) * Math.PI) : 0;
    const base = this.camPrev.clone().lerp(this.camTarget, alpha);
    const aim = pk > 0 ? base.lerp(new THREE.Vector3(this.punchAt.x, 0, this.punchAt.y), pk * 0.7) : base;
    // Trauma shake (squared, smoothed noise on the tick clock) plus a kick away from the hit.
    const shake = this.trauma * this.trauma, tt = this.ticks + alpha;
    const sx = noise(tt * 0.45, 1.3) * 0.32 * shake + this.kick.x, sy = noise(tt * 0.45, 7.1) * 0.22 * shake, sz = noise(tt * 0.45, 4.2) * 0.25 * shake + this.kick.y;
    const zoom = (0.88 - 0.4 * pk) * (this.zoomPrev + (this.camZoom - this.zoomPrev) * alpha);
    this.camera.position.set(aim.x + sx, 1.6 + 8.9 * zoom + sy, aim.z + 12.5 * zoom + sz);
    this.camera.lookAt(aim.x + sx * 0.5, 1.6 - 0.6 * pk, aim.z - 2.2 * zoom + sz * 0.5);
    this.camera.rotateZ(noise(tt * 0.5, 2.9) * 0.012 * shake);
    const fov = 38 - this.fovPunch;
    if (Math.abs(this.camera.fov - fov) > 0.01) { this.camera.fov = fov; this.camera.updateProjectionMatrix(); }
    this.renderer.render(this.scene, this.camera);
  }
}
