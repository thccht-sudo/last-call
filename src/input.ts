// Gamepad first (standard mapping), keyboard fallback. Produces one Input per sim frame.
import type { Input } from './sim/world';

// Standard gamepad: 0=A 1=B 2=X 3=Y 9=Start
const PAD = { attack: 2, counter: 3, dodge: 0, grab: 1, start: 9 };
const KEYS = { attack: ['KeyJ'], counter: ['KeyK'], dodge: ['Space', 'KeyL'], grab: ['KeyE'], start: ['Enter'] };

export class Controls {
  private down = new Set<string>();
  private pressedKeys = new Set<string>();
  private prevPad: boolean[] = [];
  lastDevice: 'pad' | 'keys' = 'keys';
  start = false;

  constructor() {
    addEventListener('keydown', e => {
      if (!e.repeat) this.pressedKeys.add(e.code);
      this.down.add(e.code);
      this.lastDevice = 'keys';
      if (e.code === 'Space') e.preventDefault();
    });
    addEventListener('keyup', e => this.down.delete(e.code));
    addEventListener('blur', () => this.down.clear());
  }

  pad(): Gamepad | null {
    for (const g of navigator.getGamepads?.() ?? []) if (g && g.connected) return g;
    return null;
  }

  sample(): Input {
    const g = this.pad();
    const buttons = g ? g.buttons.map(b => b.pressed) : [];
    const edge = (i: number) => !!buttons[i] && !this.prevPad[i];
    const key = (codes: string[]) => codes.some(c => this.pressedKeys.has(c));

    let mx = 0, my = 0;
    if (g) {
      const [ax, ay] = [g.axes[0] ?? 0, g.axes[1] ?? 0];
      if (Math.hypot(ax, ay) > 0.18) { mx = ax; my = ay; this.lastDevice = 'pad'; }
      if (buttons[12]) my = -1; if (buttons[13]) my = 1; if (buttons[14]) mx = -1; if (buttons[15]) mx = 1;
      if (buttons.some(b => b)) this.lastDevice = 'pad';
    }
    if (this.down.has('KeyA') || this.down.has('ArrowLeft')) mx = -1;
    if (this.down.has('KeyD') || this.down.has('ArrowRight')) mx = 1;
    if (this.down.has('KeyW') || this.down.has('ArrowUp')) my = -1;
    if (this.down.has('KeyS') || this.down.has('ArrowDown')) my = 1;

    const input: Input = {
      mx, my,
      attack: edge(PAD.attack) || key(KEYS.attack),
      counter: edge(PAD.counter) || key(KEYS.counter),
      dodge: edge(PAD.dodge) || key(KEYS.dodge),
      grab: edge(PAD.grab) || key(KEYS.grab),
    };
    this.start = edge(PAD.start) || key(KEYS.start);
    this.prevPad = buttons;
    this.pressedKeys.clear();
    return input;
  }

  rumble(strong: number, weak: number, ms: number) {
    const g = this.pad() as (Gamepad & { vibrationActuator?: { playEffect?: (t: string, p: object) => Promise<unknown> } }) | null;
    g?.vibrationActuator?.playEffect?.('dual-rumble', { duration: ms, strongMagnitude: strong, weakMagnitude: weak }).catch(() => {});
  }
}
