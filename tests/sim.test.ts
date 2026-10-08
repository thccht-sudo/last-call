import { describe, it, expect } from 'vitest';
import { createWorld, spawnEnemy, step, NO_INPUT, Input, World, framesToStrike } from '../src/sim/world';
import { TUNING as T } from '../src/sim/tuning';
import { insideObstacle } from '../src/sim/level';

const press = (k: Partial<Input>): Input => ({ ...NO_INPUT, ...k });
const run = (w: World, n: number, input: Input = NO_INPUT) => { for (let i = 0; i < n; i++) step(w, input); };

// A world with the wave system parked and one enemy placed by hand.
function duel(kind: 'thug' | 'heavy' = 'thug', at = { x: 0, y: 0.8 }) {
  const w = createWorld(7);
  w.wave = 0; w.waveTimer = 1e9;
  const e = spawnEnemy(w, kind, at, 'circle');
  w.player.pos = { x: 0, y: 2 };
  return { w, e };
}

function untilStrikeIn(w: World, e: ReturnType<typeof duel>['e'], frames: number) {
  e.state = 'approach'; e.t = 0; e.dur = 180;
  for (let i = 0; i < 600; i++) {
    const f = framesToStrike(e);
    if (f !== null && f <= frames) return;
    step(w, NO_INPUT);
  }
  throw new Error('enemy never wound up');
}

describe('counter', () => {
  it('a counter inside the window knocks the attacker down and the player takes nothing', () => {
    const { w, e } = duel();
    untilStrikeIn(w, e, 10);
    step(w, press({ counter: true }));
    expect(e.state).toBe('down');
    run(w, 60);
    expect(w.player.hp).toBe(T.player.hp);
  });

  it('pressing counter too early whiffs and the hit lands', () => {
    const { w, e } = duel();
    untilStrikeIn(w, e, T.counter.window + 8);
    step(w, press({ counter: true }));
    expect(w.player.state).toBe('whiff');
    run(w, 40);
    expect(w.player.hp).toBe(T.player.hp - T.thug.damage);
  });

  it('a heavy cannot be countered, but a dodge avoids it', () => {
    const a = duel('heavy');
    untilStrikeIn(a.w, a.e, 8);
    step(a.w, press({ counter: true }));
    run(a.w, 40);
    expect(a.w.player.hp).toBe(T.player.hp - T.heavy.damage);

    const b = duel('heavy');
    untilStrikeIn(b.w, b.e, 6);
    step(b.w, press({ dodge: true, mx: 1 }));
    run(b.w, 40);
    expect(b.w.player.hp).toBe(T.player.hp);
  });
});

describe('freeflow attacks', () => {
  it('lunges to the enemy in the pushed direction', () => {
    const { w } = duel('thug', { x: -3, y: 3.5 });
    w.player.pos = { x: 0, y: 3.5 };
    const right = spawnEnemy(w, 'thug', { x: 3, y: 3.5 }, 'stun');
    right.dur = 999;
    w.enemies[0].state = 'stun'; w.enemies[0].dur = 999;
    step(w, press({ attack: true, mx: 1 }));
    run(w, 6);
    expect(w.player.pos.x).toBeGreaterThan(1.5);
    expect(right.hp).toBeLessThan(T.thug.hp);
  });

  it('a three-hit string ends in a knockdown', () => {
    const { w, e } = duel('heavy', { x: 0, y: 1 });
    e.state = 'stun'; e.dur = 999;
    for (let i = 0; i < 3; i++) {
      step(w, press({ attack: true, my: -1 }));
      run(w, 12);
    }
    expect(e.state).toBe('down');
    expect(e.hp).toBe(T.heavy.hp - T.combo.reduce((s, c) => s + c.damage, 0));
  });

  it('a hit interrupts a thug wind-up but not a heavy one', () => {
    const t = duel('thug');
    untilStrikeIn(t.w, t.e, 20);
    step(t.w, press({ attack: true, my: -1 }));
    run(t.w, 8);
    expect(t.e.state).toBe('stun');

    const h = duel('heavy');
    untilStrikeIn(h.w, h.e, 30);
    step(h.w, press({ attack: true, my: -1 }));
    run(h.w, 8);
    expect(h.e.state).toBe('windup');
  });
});

describe('bottle', () => {
  it('picks up, throws at the nearest enemy and knocks it down', () => {
    const { w, e } = duel('thug', { x: 3, y: 3.2 });
    e.state = 'stun'; e.dur = 999;
    w.player.pos = { x: w.bottles[0].home.x, y: w.bottles[0].home.y + 1 };
    step(w, press({ grab: true }));
    expect(w.player.holding).not.toBeNull();
    step(w, press({ grab: true, mx: 1 }));
    run(w, 60);
    expect(e.state).toBe('down');
    expect(e.hp).toBe(T.thug.hp - T.bottle.damage);
  });
});

describe('crowd', () => {
  it('never lets more enemies commit than the wave allows', () => {
    const w = createWorld(3);
    let worst = 0;
    for (let i = 0; i < 3000 && w.result === 'playing'; i++) {
      step(w, NO_INPUT);
      if (w.wave < 0) continue;
      const busy = w.enemies.filter(e => e.state === 'approach' || e.state === 'windup' || e.state === 'active').length;
      worst = Math.max(worst, busy - T.waves[w.wave].maxAttackers);
    }
    expect(worst).toBeLessThanOrEqual(0);
  });

  it('an idle player eventually loses', () => {
    const w = createWorld(5);
    run(w, 60 * 120);
    expect(w.result).toBe('lose');
  });

  it('is deterministic for a seed', () => {
    const a = createWorld(11), b = createWorld(11);
    for (let i = 0; i < 1500; i++) {
      const inp = press({ mx: Math.sin(i / 30), my: Math.cos(i / 47), attack: i % 9 === 0, counter: i % 23 === 0 });
      step(a, inp); step(b, inp);
    }
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe('playtest bot', () => {
  // Counters yellow prompts, dodges red ones, otherwise attacks the nearest enemy.
  function bot(w: World): Input {
    const p = w.player;
    for (const e of w.enemies) {
      const f = framesToStrike(e);
      const d = Math.hypot(e.pos.x - p.pos.x, e.pos.y - p.pos.y);
      if (f !== null && f <= 12 && d < T.counter.range) {
        if (T[e.kind].armored) return press({ dodge: true, mx: p.pos.x - e.pos.x, my: p.pos.y - e.pos.y });
        return press({ counter: true });
      }
    }
    const live = w.enemies.filter(e => e.state !== 'dead' && e.state !== 'spawn' && e.state !== 'down' && e.state !== 'getup');
    if (!live.length) return NO_INPUT;
    live.sort((a, b) => Math.hypot(a.pos.x - p.pos.x, a.pos.y - p.pos.y) - Math.hypot(b.pos.x - p.pos.x, b.pos.y - p.pos.y));
    const t = live[0], mx = t.pos.x - p.pos.x, my = t.pos.y - p.pos.y;
    return press({ mx, my, attack: w.frame % 7 === 0 });
  }

  it('a player who reads prompts clears the bar', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const w = createWorld(seed);
      for (let i = 0; i < 60 * 300 && w.result === 'playing'; i++) step(w, bot(w));
      expect(w.result, `seed ${seed} hp ${w.player.hp}`).toBe('win');
    }
  });
});

describe('Kilroy\'s patio', () => {
  it('enemies inside the patio find the gate instead of grinding on the fence', () => {
    const { w, e } = duel('thug', { x: 5.5, y: -3.2 });
    w.player.pos = { x: 5.5, y: 0.5 };
    e.state = 'approach'; e.t = 0; e.dur = 600;
    run(w, 240);
    expect(e.pos.y).toBeGreaterThan(-2.6);
  });

  it('nobody ends up inside a table, fence or post', () => {
    const w = createWorld(9);
    for (let i = 0; i < 4000 && w.result === 'playing'; i++) {
      step(w, press({ mx: Math.sin(i / 50), my: Math.cos(i / 70), attack: i % 11 === 0 }));
      for (const b of [w.player, ...w.enemies.filter(e => e.state !== 'spawn' && e.state !== 'dead')]) {
        expect(insideObstacle(b.pos)).toBe(false);
      }
    }
  });
});
