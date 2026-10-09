// Online co-op over WebRTC (PeerJS). The host's browser runs the fight; the guest sends its
// controls and draws the snapshots the host sends back. No server of ours: PeerJS's free public
// broker only introduces the two browsers, then data flows directly between them.
import Peer, { DataConnection } from 'peerjs';
import type { Input, World, GameEvent } from './sim/world';

// Presses travel as running counts so a lost or repeated packet can't drop or double a press.
export interface NetInput { mx: number; my: number; attack: number; counter: number; dodge: number; bottle: number; start: number }
type Msg =
  | { t: 'input'; input: NetInput }
  | { t: 'snap'; world: World; events: GameEvent[] }
  | { t: 'bye' };

const PREFIX = 'lastcall-kilroys-';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// ?peer=host:port points at a self-hosted broker (used by the tests).
function peerOptions() {
  const custom = new URLSearchParams(location.search).get('peer');
  if (!custom) return { debug: 0 };
  const [host, port] = custom.split(':');
  return { host, port: Number(port), path: '/', secure: false, debug: 0 };
}

export function roomFromUrl(): string | null {
  return new URLSearchParams(location.search).get('join')?.toUpperCase() ?? null;
}

export function joinLink(code: string) {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('join', code);
  const peer = new URLSearchParams(location.search).get('peer');
  if (peer) url.searchParams.set('peer', peer);
  return url.toString();
}

abstract class Link {
  conn: DataConnection | null = null;
  status: 'connecting' | 'waiting' | 'connected' | 'closed' | 'error' = 'connecting';
  error = '';
  protected peer: Peer;
  constructor(id?: string) {
    this.peer = id ? new Peer(id, peerOptions()) : new Peer(peerOptions());
    this.peer.on('error', e => { this.status = 'error'; this.error = e.type ?? String(e); });
  }
  protected attach(conn: DataConnection) {
    this.conn = conn;
    conn.on('open', () => { this.status = 'connected'; });
    conn.on('data', d => this.receive(d as Msg));
    conn.on('close', () => { this.status = 'closed'; });
  }
  protected send(m: Msg) { if (this.conn?.open) this.conn.send(m); }
  protected abstract receive(m: Msg): void;
}

export class Host extends Link {
  readonly code: string;
  private remote: NetInput = { mx: 0, my: 0, attack: 0, counter: 0, dodge: 0, bottle: 0, start: 0 };
  private seen: NetInput = { ...this.remote };
  private pending: GameEvent[] = [];
  constructor() {
    const code = Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
    super(PREFIX + code);
    this.code = code;
    this.peer.on('open', () => { this.status = 'waiting'; });
    this.peer.on('connection', conn => {
      if (this.conn?.open) { conn.close(); return; } // two players only
      this.attach(conn);
    });
  }
  protected receive(m: Msg) { if (m.t === 'input') this.remote = m.input; if (m.t === 'bye') this.status = 'closed'; }

  // The guest's input for this frame: presses are counts the host hasn't consumed yet.
  input(): { input: Input; start: boolean } {
    const r = this.remote, s = this.seen;
    const input: Input = {
      mx: r.mx, my: r.my,
      attack: r.attack > s.attack, counter: r.counter > s.counter, dodge: r.dodge > s.dodge, bottle: r.bottle > s.bottle,
    };
    const start = r.start > s.start;
    this.seen = { ...r };
    return { input, start };
  }

  // Events pile up between snapshots so the guest hears every hit.
  queue(events: GameEvent[]) { this.pending.push(...events); }
  snapshot(w: World) {
    if (this.status !== 'connected') { this.pending = []; return; }
    this.send({ t: 'snap', world: { ...w, events: [] }, events: this.pending });
    this.pending = [];
  }
}

export class Guest extends Link {
  snaps: { world: World; at: number }[] = [];
  events: GameEvent[] = [];
  private counts: NetInput = { mx: 0, my: 0, attack: 0, counter: 0, dodge: 0, bottle: 0, start: 0 };
  constructor(readonly code: string) {
    super();
    this.peer.on('open', () => this.attach(this.peer.connect(PREFIX + code, { serialization: 'json', reliable: false })));
  }
  protected receive(m: Msg) {
    if (m.t === 'snap') {
      this.snaps.push({ world: m.world, at: performance.now() });
      if (this.snaps.length > 30) this.snaps.shift();
      this.events.push(...m.events);
    }
    if (m.t === 'bye') this.status = 'closed';
  }
  sendInput(i: Input, start: boolean) {
    const c = this.counts;
    c.mx = i.mx; c.my = i.my;
    if (i.attack) c.attack++; if (i.counter) c.counter++; if (i.dodge) c.dodge++; if (i.bottle) c.bottle++; if (start) c.start++;
    this.send({ t: 'input', input: { ...c } });
  }
  takeEvents() { const e = this.events; this.events = []; return e; }
}

// What the guest draws: the host's world from a moment ago, positions interpolated between the
// two snapshots around that moment so movement stays smooth over a jittery connection.
export function interpolated(snaps: { world: World; at: number }[], delayMs = 70): World | null {
  if (!snaps.length) return null;
  const t = performance.now() - delayMs;
  let i = snaps.length - 1;
  while (i > 0 && snaps[i - 1].at > t) i--;
  const b = snaps[i], a = snaps[Math.max(0, i - 1)];
  if (a === b || b.at <= a.at) return b.world;
  const k = Math.max(0, Math.min(1, (t - a.at) / (b.at - a.at)));
  const lerp = (p: { x: number; y: number }, q: { x: number; y: number } | undefined) =>
    q ? { x: q.x + (p.x - q.x) * k, y: q.y + (p.y - q.y) * k } : p;
  const w: World = { ...b.world };
  // Animation clocks interpolate too (while the state hasn't changed), so moves don't step at
  // the snapshot rate.
  const clock = (bt: number, at: number | undefined, same: boolean) => (same && at !== undefined && at <= bt ? at + (bt - at) * k : bt);
  w.players = b.world.players.map(p => {
    const was = a.world.players[p.index];
    return { ...p, pos: lerp(p.pos, was?.pos), t: clock(p.t, was?.t, was?.state === p.state) };
  });
  w.enemies = b.world.enemies.map(e => {
    const was = a.world.enemies.find(x => x.id === e.id);
    return { ...e, pos: lerp(e.pos, was?.pos), z: was ? was.z + (e.z - was.z) * k : e.z, t: clock(e.t, was?.t, was?.state === e.state) };
  });
  w.cups = b.world.cups.map(c => ({ ...c, pos: lerp(c.pos, a.world.cups.find(x => x.id === c.id)?.pos) }));
  return w;
}
