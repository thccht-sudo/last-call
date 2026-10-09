import { describe, it, expect } from 'vitest';
import { createWorld, spawnEnemy, step, addPlayer, NO_INPUT, Input, World, framesToStrike, counterable, deflectable } from '../src/sim/world';
import { TUNING as T } from '../src/sim/tuning';
import { insideObstacle } from '../src/sim/level';
import type { EnemyKind } from '../src/sim/tuning';

const press = (k: Partial<Input>): Input => ({ ...NO_INPUT, ...k });
const run = (w: World, n: number, input: Input = NO_INPUT) => { for (let i = 0; i < n; i++) step(w, input); };

// A world with the wave system parked and one enemy placed by hand.
function duel(kind: EnemyKind = 'thug', at = { x: 0, y: 0.8 }) {
  const w = createWorld(7);
  w.wave = 0; w.waveTimer = 1e9;
  const e = spawnEnemy(w, kind, at, 'circle');
  w.players[0].pos = { x: 0, y: 2 };
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
    expect(w.players[0].hp).toBe(T.player.hp);
  });

  it('pressing counter too early whiffs and the hit lands', () => {
    const { w, e } = duel();
    untilStrikeIn(w, e, T.counter.window + 8);
    step(w, press({ counter: true }));
    expect(w.players[0].state).toBe('whiff');
    run(w, 40);
    expect(w.players[0].hp).toBe(T.player.hp - T.thug.damage);
  });

  it('a heavy cannot be countered, but a dodge avoids it', () => {
    const a = duel('heavy');
    untilStrikeIn(a.w, a.e, 8);
    step(a.w, press({ counter: true }));
    run(a.w, 40);
    expect(a.w.players[0].hp).toBe(T.player.hp - T.heavy.damage);

    const b = duel('heavy');
    untilStrikeIn(b.w, b.e, 6);
    step(b.w, press({ dodge: true, mx: 1 }));
    run(b.w, 40);
    expect(b.w.players[0].hp).toBe(T.player.hp);
  });
});

describe('freeflow attacks', () => {
  it('lunges to the enemy in the pushed direction', () => {
    const { w } = duel('thug', { x: -3, y: 3.5 });
    w.players[0].pos = { x: 0, y: 3.5 };
    const right = spawnEnemy(w, 'thug', { x: 3, y: 3.5 }, 'stun');
    right.dur = 999;
    w.enemies[0].state = 'stun'; w.enemies[0].dur = 999;
    step(w, press({ attack: true, mx: 1 }));
    run(w, 6);
    expect(w.players[0].pos.x).toBeGreaterThan(1.5);
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
    w.players[0].pos = { x: w.bottles[0].home.x, y: w.bottles[0].home.y + 1 };
    step(w, press({ grab: true }));
    expect(w.players[0].holding).not.toBeNull();
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

// Reads prompts like a decent player: counters yellow, knocks cups back, dodges red, mashes out
// of grabs, helps a downed partner, otherwise attacks the nearest enemy.
function botFor(w: World, i: number): Input {
  const p = w.players[i];
  if (p.state === 'grabbed') return press({ attack: w.frame % 2 === 0 });
  if (w.cups.some(c => deflectable(p, c) && Math.hypot(c.pos.x - p.pos.x, c.pos.y - p.pos.y) < 1.4)) return press({ counter: true });
  for (const e of w.enemies) {
    const f = framesToStrike(e);
    if (f === null || f > 12) continue;
    if (counterable(p, e)) return press({ counter: true });
    const d = Math.hypot(e.pos.x - p.pos.x, e.pos.y - p.pos.y);
    if (e.unblockable && d < 2.6 && e.focus === i) return press({ dodge: true, mx: p.pos.x - e.pos.x, my: p.pos.y - e.pos.y });
  }
  const down = w.players.find(o => o.state === 'down');
  if (down && down !== p) return press({ mx: down.pos.x - p.pos.x, my: down.pos.y - p.pos.y });
  const live = w.enemies.filter(e => e.state !== 'dead' && e.state !== 'spawn' && e.state !== 'down' && e.state !== 'getup');
  if (!live.length) return NO_INPUT;
  live.sort((a, b) => Math.hypot(a.pos.x - p.pos.x, a.pos.y - p.pos.y) - Math.hypot(b.pos.x - p.pos.x, b.pos.y - p.pos.y));
  const t = live[0];
  return press({ mx: t.pos.x - p.pos.x, my: t.pos.y - p.pos.y, attack: (w.frame + i * 3) % 7 === 0 });
}

describe('playtest bot', () => {
  it('a player who reads prompts clears the bar', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const w = createWorld(seed);
      for (let i = 0; i < 60 * 300 && w.result === 'playing'; i++) step(w, botFor(w, 0));
      expect(w.result, `seed ${seed} hp ${w.players[0].hp}`).toBe('win');
    }
  });
});

describe('Kilroy\'s patio', () => {
  it('enemies inside the patio find the gate instead of grinding on the fence', () => {
    const { w, e } = duel('thug', { x: 5.5, y: -3.2 });
    w.players[0].pos = { x: 5.5, y: 0.5 };
    e.state = 'approach'; e.t = 0; e.dur = 600;
    run(w, 240);
    expect(e.pos.y).toBeGreaterThan(-2.6);
  });

  it('nobody ends up inside a table, fence or post', () => {
    const w = createWorld(9);
    for (let i = 0; i < 4000 && w.result === 'playing'; i++) {
      step(w, press({ mx: Math.sin(i / 50), my: Math.cos(i / 70), attack: i % 11 === 0 }));
      for (const b of [w.players[0], ...w.enemies.filter(e => e.state !== 'spawn' && e.state !== 'dead')]) {
        expect(insideObstacle(b.pos)).toBe(false);
      }
    }
  });
});

describe('co-op', () => {
  function pair() {
    const w = createWorld(7, 2);
    w.wave = 0; w.waveTimer = 1e9;
    w.players[0].pos = { x: -1, y: 1 }; w.players[1].pos = { x: 1, y: 1 };
    return w;
  }

  it('player 2 can join mid-fight and fights with their own input', () => {
    const w = createWorld(7);
    w.wave = 0; w.waveTimer = 1e9;
    addPlayer(w);
    const e = spawnEnemy(w, 'thug', { x: w.players[1].pos.x + 1, y: w.players[1].pos.y }, 'stun');
    e.dur = 999;
    step(w, [NO_INPUT, press({ attack: true, mx: 1 })]);
    run(w, 8);
    expect(e.hp).toBeLessThan(T.thug.hp);
    expect(w.players[0].state).toBe('free');
  });

  it('a downed player is revived by standing next to them, and the game ends only when both are down', () => {
    const w = pair();
    const [a, b] = w.players;
    a.hp = 0; a.state = 'down';
    expect(w.result).toBe('playing');
    b.pos = { x: a.pos.x + 1, y: a.pos.y };
    run(w, T.coop.reviveFrames + 2);
    expect(a.state).toBe('free');
    expect(a.hp).toBe(T.coop.reviveHp);
  });

  it('losing both players loses the fight', () => {
    const w = createWorld(5, 2);
    run(w, 60 * 180);
    expect(w.result).toBe('lose');
  });

  it('you can counter a swing aimed at your partner', () => {
    const w = pair();
    const e = spawnEnemy(w, 'thug', { x: 1, y: -0.2 }, 'approach');
    e.dur = 180;
    for (let i = 0; i < 400 && !(framesToStrike(e) !== null && framesToStrike(e)! <= 10); i++) step(w, NO_INPUT);
    expect(e.focus).toBe(1);
    w.players[0].pos = { x: 0, y: 0.2 };
    step(w, [press({ counter: true }), NO_INPUT]);
    expect(e.state).toBe('down');
  });

  it('tag-team hits land harder', () => {
    const w = pair();
    const e = spawnEnemy(w, 'heavy', { x: 0, y: 0 }, 'stun');
    e.dur = 999;
    step(w, [press({ attack: true, mx: 1 }), NO_INPUT]);
    run(w, 10);
    const afterFirst = e.hp;
    step(w, [NO_INPUT, press({ attack: true, mx: -1 })]);
    run(w, 10);
    expect(afterFirst - e.hp).toBe(Math.round(T.combo[0].damage * T.coop.tagMultiplier));
  });

  it('two prompt-reading players clear the bigger co-op waves', () => {
    for (const seed of [1, 2, 3]) {
      const w = createWorld(seed, 2);
      for (let i = 0; i < 60 * 300 && w.result === 'playing'; i++) step(w, w.players.map(p => botFor(w, p.index)));
      expect(w.result, `seed ${seed}`).toBe('win');
    }
  });
});

describe('new enemies', () => {
  it('a thrower\'s cup can be knocked back to drop him', () => {
    const { w, e } = duel('thrower', { x: 0, y: -1.6 });
    w.players[0].pos = { x: 0, y: 3 };
    untilStrikeIn(w, e, 0);
    for (let i = 0; i < 120 && !w.cups.some(c => deflectable(w.players[0], c)); i++) step(w, NO_INPUT);
    step(w, press({ counter: true }));
    expect(w.cups[0]?.owner).toBe(0);
    run(w, 60);
    expect(e.hp).toBeLessThanOrEqual(T.thrower.hp - T.cup.deflectDamage);
    expect(['down', 'dead']).toContain(e.state);
    expect(w.players[0].hp).toBe(T.player.hp);
  });

  it('a grab can be mashed out of', () => {
    const { w, e } = duel('grappler');
    untilStrikeIn(w, e, 0);
    run(w, 3);
    expect(w.players[0].state).toBe('grabbed');
    for (let i = 0; i < T.grab.escapePresses * 2; i++) step(w, press({ attack: i % 2 === 0 }));
    expect(w.players[0].state).toBe('free');
    expect(e.state).toBe('stun');
  });

  it('a partner hitting the grappler frees you', () => {
    const w = createWorld(7, 2);
    w.wave = 0; w.waveTimer = 1e9;
    w.players[0].pos = { x: 0, y: 2 }; w.players[1].pos = { x: 3, y: 0.8 };
    const e = spawnEnemy(w, 'grappler', { x: 0, y: 0.8 }, 'circle');
    untilStrikeIn(w, e, 0);
    run(w, 3);
    expect(w.players[0].state).toBe('grabbed');
    step(w, [NO_INPUT, press({ attack: true, mx: -1 })]);
    run(w, 14);
    expect(w.players[0].state).toBe('free');
  });

  it('the boss swings twice (counterable) then throws an unblockable haymaker', () => {
    const { w, e } = duel('boss');
    const kinds: boolean[] = [];
    for (let i = 0; i < 1500 && kinds.length < 3; i++) {
      const was = e.state;
      step(w, NO_INPUT);
      if (was !== 'windup' && e.state === 'windup') kinds.push(e.unblockable);
      w.players[0].hp = T.player.hp; // keep the test alive
    }
    expect(kinds).toEqual([false, false, true]);
  });

  it('the boss calls for backup at half health', () => {
    const { w, e } = duel('boss');
    const before = w.enemies.length;
    e.state = 'stun'; e.dur = 999;
    e.hp = Math.ceil(e.maxHp * T.bossEnrage) + 5;
    step(w, press({ attack: true, my: -1 }));
    run(w, 10);
    expect(e.enraged).toBe(true);
    expect(w.enemies.length).toBe(before + 2);
  });

  it('knocking an enemy into a table slams them for extra damage', () => {
    const { w, e } = duel('grappler', { x: 0.6, y: -2.0 });
    w.players[0].pos = { x: 0.6, y: -0.9 };
    e.state = 'stun'; e.dur = 999;
    for (let i = 0; i < 3; i++) { step(w, press({ attack: true, my: -1 })); run(w, 12); }
    run(w, 10);
    const dealt = T.combo.reduce((s, c) => s + c.damage, 0);
    expect(T.grappler.hp - e.hp).toBe(dealt + T.slam.damage);
  });
});

describe('inside the bar', () => {
  it('the final round moves everyone inside Kilroy\'s', () => {
    const w = createWorld(3, 2);
    for (let i = 0; i < 60 * 300 && w.wave < 2 && w.result === 'playing'; i++) {
      step(w, w.players.map(p => botFor(w, p.index)));
    }
    expect(w.wave).toBe(2);
    expect(w.stage).toBe(1);
    expect(w.enemies.some(e => e.kind === 'boss')).toBe(true);
    for (const p of w.players) expect(p.pos.y).toBeGreaterThan(1.5);
    expect(w.bottles.length).toBe(2);
  });
});
