// Devices: each gamepad, plus two keyboard layouts. The first device to press a button is
// player 1; the next unused device to press one joins as player 2.
import type { Input } from './sim/world';
import { NO_INPUT } from './sim/world';

// Standard gamepad: 0=A 1=B 2=X 3=Y 9=Start
const PAD = { attack: 2, counter: 3, dodge: 0, grab: 1, start: 9 };
const KEYMAPS = {
  kb1: {
    up: ['KeyW'], down: ['KeyS'], left: ['KeyA'], right: ['KeyD'],
    attack: ['KeyJ'], counter: ['KeyK'], dodge: ['Space', 'KeyL'], grab: ['KeyE'], start: ['Enter'],
  },
  kb2: {
    up: ['ArrowUp'], down: ['ArrowDown'], left: ['ArrowLeft'], right: ['ArrowRight'],
    attack: ['Numpad1', 'Comma'], counter: ['Numpad2', 'Period'], dodge: ['Numpad0', 'Slash'], grab: ['Numpad3', 'Quote'], start: ['NumpadEnter', 'Backslash'],
  },
};
type KeyDevice = keyof typeof KEYMAPS;
export type Device = KeyDevice | `pad${number}`;

export interface Sample { input: Input; start: boolean; any: boolean }

export class Controls {
  private down = new Set<string>();
  private pressed = new Set<string>();
  private prevPad = new Map<number, boolean[]>();
  slots: Device[] = [];

  constructor() {
    addEventListener('keydown', e => {
      if (!e.repeat) this.pressed.add(e.code);
      this.down.add(e.code);
      if (e.code === 'Space' || e.code.startsWith('Arrow') || e.code === 'Slash' || e.code === 'Quote') e.preventDefault();
    });
    addEventListener('keyup', e => this.down.delete(e.code));
    addEventListener('blur', () => this.down.clear());
  }

  private pads(): Gamepad[] {
    return [...(navigator.getGamepads?.() ?? [])].filter((g): g is Gamepad => !!g && g.connected);
  }

  private readKeys(dev: KeyDevice): Sample {
    const m = KEYMAPS[dev];
    const held = (c: string[]) => c.some(k => this.down.has(k));
    const hit = (c: string[]) => c.some(k => this.pressed.has(k));
    const input: Input = {
      mx: (held(m.right) ? 1 : 0) - (held(m.left) ? 1 : 0),
      my: (held(m.down) ? 1 : 0) - (held(m.up) ? 1 : 0),
      attack: hit(m.attack), counter: hit(m.counter), dodge: hit(m.dodge), grab: hit(m.grab),
    };
    const start = hit(m.start);
    return { input, start, any: start || input.attack || input.counter || input.dodge || input.grab };
  }

  private readPad(g: Gamepad): Sample {
    const b = g.buttons.map(x => x.pressed);
    const prev = this.prevPad.get(g.index) ?? [];
    const edge = (i: number) => !!b[i] && !prev[i];
    let mx = 0, my = 0;
    const [ax, ay] = [g.axes[0] ?? 0, g.axes[1] ?? 0];
    if (Math.hypot(ax, ay) > 0.18) { mx = ax; my = ay; }
    if (b[12]) my = -1; if (b[13]) my = 1; if (b[14]) mx = -1; if (b[15]) mx = 1;
    const input: Input = { mx, my, attack: edge(PAD.attack), counter: edge(PAD.counter), dodge: edge(PAD.dodge), grab: edge(PAD.grab) };
    const start = edge(PAD.start);
    return { input, start, any: start || input.attack || input.counter || input.dodge || input.grab };
  }

  // Call once per sim frame. Returns one sample per device that exists right now.
  poll(): Map<Device, Sample> {
    const out = new Map<Device, Sample>();
    out.set('kb1', this.readKeys('kb1'));
    out.set('kb2', this.readKeys('kb2'));
    for (const g of this.pads()) {
      out.set(`pad${g.index}`, this.readPad(g));
      this.prevPad.set(g.index, g.buttons.map(x => x.pressed));
    }
    this.pressed.clear();
    return out;
  }

  // An unassigned device that pressed something this frame, if any.
  joiner(samples: Map<Device, Sample>): Device | null {
    for (const [dev, s] of samples) if (s.any && !this.slots.includes(dev)) return dev;
    return null;
  }

  inputFor(slot: number, samples: Map<Device, Sample>): Input {
    const dev = this.slots[slot];
    return (dev && samples.get(dev)?.input) || NO_INPUT;
  }

  startPressed(samples: Map<Device, Sample>): boolean {
    return this.slots.some(d => samples.get(d)?.start);
  }

  isPad(slot: number) { return this.slots[slot]?.startsWith('pad') ?? false; }

  rumble(slot: number, strong: number, weak: number, ms: number) {
    const dev = this.slots[slot];
    if (!dev?.startsWith('pad')) return;
    const g = this.pads().find(p => `pad${p.index}` === dev) as (Gamepad & { vibrationActuator?: { playEffect?: (t: string, p: object) => Promise<unknown> } }) | undefined;
    g?.vibrationActuator?.playEffect?.('dual-rumble', { duration: ms, strongMagnitude: strong, weakMagnitude: weak }).catch(() => {});
  }
}
