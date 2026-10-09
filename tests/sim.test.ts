import { describe, it, expect } from 'vitest';
import { createWorld, spawnEnemy, step, addPlayer, NO_INPUT, Input, World, framesToStrike, counterable, deflectable, counterWindow, styleRank } from '../src/sim/world';
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
  it('a counter inside the window staggers the attacker and the player takes nothing', () => {
    const { w, e } = duel();
    untilStrikeIn(w, e, 10);
    step(w, press({ counter: true }));
    expect(e.state).toBe('stun');
    expect(e.hp).toBe(T.thug.hp - T.counter.damage);
    run(w, 60);
    expect(w.players[0].hp).toBe(T.player.hp);
  });

  it('pressing counter too early whiffs and the hit lands', () => {
    const { w, e } = duel();
    untilStrikeIn(w, e, T.counter.window + 8);
    step(w, press({ counter: true }));
    expect(w.players[0].state).toBe('whiff');
    run(w, 40);
    expect(w.players[0].hp).toBe(T.player.hp - T.attacks[e.attack].damage);
  });

  it('a heavy cannot be countered, but a dodge avoids it', () => {
    const a = duel('heavy');
    untilStrikeIn(a.w, a.e, 8);
    step(a.w, press({ counter: true }));
    run(a.w, 40);
    expect(a.w.players[0].hp).toBe(T.player.hp - T.attacks[a.e.attack].damage);

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
    const m = T.moves;
    expect(e.hp).toBe(T.heavy.hp - m.jab.damage - m.cross.damage - m.roundhouse.damage);
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
    step(w, press({ bottle: true }));
    expect(w.players[0].holding).not.toBeNull();
    step(w, press({ bottle: true, mx: 1 }));
    run(w, 60);
    expect(e.state).toBe('down');
    expect(e.hp).toBeLessThanOrEqual(T.thug.hp - T.bottle.damage); // plus a slam if it sends him into the planter

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

// Reads prompts like a decent player: counters yellow, knocks cups back, dodges red (sideways,
// so a lunge goes past), helps a downed partner, otherwise attacks the nearest enemy.
function botFor(w: World, i: number): Input {
  const p = w.players[i];
  if (w.cups.some(c => deflectable(p, c) && Math.hypot(c.pos.x - p.pos.x, c.pos.y - p.pos.y) < 1.4)) return press({ counter: true });
  for (const e of w.enemies) {
    const f = framesToStrike(e);
    if (f === null || f > 12) continue;
    if (counterable(p, e)) return press({ counter: true });
    const d = Math.hypot(e.pos.x - p.pos.x, e.pos.y - p.pos.y);
    if (e.unblockable && d < T.attacks[e.attack].from + 1.5 && e.focus === i) return press({ dodge: true, mx: -(p.pos.y - e.pos.y), my: p.pos.x - e.pos.x });
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
    expect(e.state).toBe('stun');
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
    expect(afterFirst - e.hp).toBe(Math.round(T.moves.jab.damage * T.coop.tagMultiplier));
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

  it('the kicker\'s flying knee is red: it can\'t be countered, and a dodge to the side beats it', () => {
    const kneeDuel = () => {
      const d = duel('kicker', { x: 0, y: -1.2 });
      d.w.players[0].pos = { x: 0, y: 2.2 };
      d.e.attack = 'flyingKnee';
      d.e.state = 'approach'; d.e.t = 0; d.e.dur = 180;
      for (let i = 0; i < 200 && (d.e.state as string) !== 'windup'; i++) step(d.w, NO_INPUT);
      expect(d.e.state).toBe('windup');
      expect(d.e.unblockable).toBe(true);
      return d;
    };
    const a = kneeDuel();
    for (let i = 0; i < 200 && framesToStrike(a.e)! > 6; i++) step(a.w, NO_INPUT);
    step(a.w, press({ counter: true }));
    run(a.w, 30);
    expect(a.w.players[0].hp).toBe(T.player.hp - T.attacks.flyingKnee.damage);

    const b = kneeDuel();
    for (let i = 0; i < 200 && framesToStrike(b.e)! > 4; i++) step(b.w, NO_INPUT);
    step(b.w, press({ dodge: true, mx: 1 }));
    run(b.w, 40);
    expect(b.w.players[0].hp).toBe(T.player.hp);
  });

  it('nothing grabs or holds you: every enemy attack is a strike', () => {
    expect(Object.keys(T.attacks).every(a => !/grab|hold/i.test(a))).toBe(true);
    expect(T.waves.flatMap(wv => wv.enemies)).not.toContain('grappler');
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
    const { w, e } = duel('heavy', { x: 0.6, y: -2.0 });
    w.players[0].pos = { x: 0.6, y: -0.9 };
    e.state = 'stun'; e.dur = 999;
    for (let i = 0; i < 3; i++) { step(w, press({ attack: true, my: -1 })); run(w, 12); }
    run(w, 10);
    const dealt = T.moves.jab.damage + T.moves.cross.damage + T.moves.roundhouse.damage;
    expect(T.heavy.hp - e.hp).toBe(dealt + T.slam.damage);
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

describe('difficulty and stats', () => {
  it('easy takes less damage and gives a longer counter window than hard', () => {
    const hits = [0, 2].map(d => {
      const w = createWorld(7, 1, d);
      w.wave = 0; w.waveTimer = 1e9;
      w.players[0].pos = { x: 0, y: 2 };
      const e = spawnEnemy(w, 'thug', { x: 0, y: 0.8 }, 'circle');
      untilStrikeIn(w, e, 0);
      run(w, 30);
      return T.player.hp - w.players[0].hp;
    });
    expect(hits[0]).toBeLessThan(hits[1]);
    const easy = createWorld(1, 1, 0), hard = createWorld(1, 1, 2);
    expect(counterWindow(easy)).toBeGreaterThan(counterWindow(hard));
  });

  it('records counters, missed counters and damage taken by source', () => {
    const { w, e } = duel();
    untilStrikeIn(w, e, 10);
    step(w, press({ counter: true }));
    run(w, 200);
    const s = w.stats[0];
    expect(s.counters).toBe(1);
    expect(s.dealt).toBeGreaterThan(0);
    // Let the next swing land.
    const e2 = spawnEnemy(w, 'thug', { x: 0, y: 1.2 }, 'circle');
    untilStrikeIn(w, e2, 0);
    run(w, 30);
    expect(s.missedCounters).toBeGreaterThan(0);
    expect(Object.values(s.takenBy).reduce((a, b) => a + b, 0)).toBe(s.taken);
    expect(s.taken).toBeGreaterThan(0);
  });
});

// A staggered enemy in the open, well away from tables and walls.
function dummy(kind: EnemyKind = 'thug', at = { x: 0, y: 0.8 }) {
  const d = duel(kind, at);
  d.e.state = 'stun'; d.e.dur = 9999;
  d.w.players[0].pos = { x: at.x, y: at.y + 1.1 };
  return d;
}
const up = press({ attack: true, my: -1 });
// Press attack, then wait until the attack has landed (or the player is free again).
function hit(w: World, input: Input = up, wait = 40) {
  const p = w.players[0], before = p.lastHitAt;
  step(w, input);
  for (let i = 0; i < wait && p.lastHitAt === before; i++) step(w, NO_INPUT);
}

describe('hit detection and lunge', () => {
  it('reaches an enemy at the edge of lunge range instead of whiffing short', () => {
    const { w, e } = dummy('thug', { x: 5.2, y: 1.5 });
    w.players[0].pos = { x: 0, y: 1.5 };
    step(w, press({ attack: true, mx: 1 }));
    run(w, T.maxTravel + 10);
    expect(e.hp).toBe(T.thug.hp - T.moves.jab.damage);
  });

  it('the locked target is hit even if he drifts during the startup', () => {
    const { w, e } = dummy();
    step(w, up);
    e.pos.x += 0.6; // stepped sideways mid-swing
    run(w, 10);
    expect(e.hp).toBeLessThan(T.thug.hp);
  });

  it('counter and dodge cancel an attack before it lands', () => {
    const { w, e } = duel();
    untilStrikeIn(w, e, 12);
    step(w, press({ attack: true, mx: 1 })); // swing at nobody in particular
    expect(w.players[0].state).toBe('attack');
    step(w, press({ counter: true }));
    expect(w.players[0].state).toBe('counter');
    expect(e.state).toBe('stun');

    const b = duel();
    step(b.w, up);
    step(b.w, press({ dodge: true, mx: 1 }));
    expect(b.w.players[0].state).toBe('dodge');
  });

  it('getting hit never takes control away for long: dodge out of hitstun', () => {
    const { w, e } = duel();
    untilStrikeIn(w, e, 0);
    run(w, 6);
    const p = w.players[0];
    expect(p.state).toBe('hitstun');
    for (let i = 0; i < 30 && p.state === 'hitstun'; i++) step(w, press({ dodge: true, mx: 1 }));
    expect(p.state).toBe('dodge');
    expect(p.t).toBeLessThanOrEqual(1);
  });

  it('a prompt-reading player is never out of control for more than half a second', () => {
    const w = createWorld(4);
    let locked = 0, worst = 0;
    for (let i = 0; i < 60 * 200 && w.result === 'playing'; i++) {
      step(w, botFor(w, 0));
      const p = w.players[0];
      locked = p.state === 'hitstun' || p.state === 'whiff' ? locked + 1 : 0;
      worst = Math.max(worst, locked);
    }
    expect(worst).toBeLessThanOrEqual(30);
  });

  it('one counter answers two swings at once', () => {
    const { w, e } = duel('thug', { x: -0.9, y: 1.4 });
    const f = spawnEnemy(w, 'thug', { x: 0.9, y: 1.4 }, 'circle');
    for (const x of [e, f]) { x.attack = 'hook'; x.state = 'windup'; x.t = 20; x.dur = 30; x.unblockable = false; x.focus = 0; }
    step(w, press({ counter: true }));
    expect(e.state).toBe('stun');
    expect(f.state).toBe('stun');
    expect(w.stats[0].counters).toBe(2);
  });
});

describe('combos', () => {
  it('X X, pause, X is an uppercut that launches; X in the air juggles; the third air hit spikes him', () => {
    const { w, e } = dummy('heavy');
    const bystander = spawnEnemy(w, 'thug', { x: 1.4, y: 0.4 }, 'stun');
    bystander.dur = 9999;
    hit(w); run(w, 4);
    hit(w); run(w, T.string.delay + 4);
    hit(w);
    expect(w.players[0].move).toBe('uppercut');
    expect(e.state).toBe('air');
    run(w, 4);
    hit(w);
    expect(w.players[0].move).toBe('juggle');
    expect(e.state).toBe('air');
    expect(e.z).toBeGreaterThan(0);
    run(w, 4);
    hit(w);
    expect(w.players[0].move).toBe('juggle');
    run(w, 4);
    hit(w);
    expect(w.players[0].move).toBe('spike');
    expect(e.state).toBe('down');
    expect(e.z).toBe(0);
    expect(bystander.state).toBe('down'); // the shockwave
    expect(w.stats[0].launches).toBe(1);
  });

  it('X X X straight through is a roundhouse; pull back on the third for a sweep that drops him at your feet', () => {
    const a = dummy();
    hit(a.w); hit(a.w); hit(a.w);
    expect(a.w.players[0].move).toBe('roundhouse');
    expect(a.e.state).toBe('down');

    const b = dummy();
    hit(b.w); hit(b.w);
    hit(b.w, press({ attack: true, my: 1 }));
    expect(b.w.players[0].move).toBe('sweep');
    expect(b.e.state).toBe('down');
    run(b.w, 30);
    expect(Math.hypot(b.e.pos.x - b.w.players[0].pos.x, b.e.pos.y - b.w.players[0].pos.y)).toBeLessThan(2);
  });

  it('attack on a floored enemy is a stomp that keeps him down a little longer', () => {
    const { w, e } = dummy();
    hit(w); hit(w); hit(w, press({ attack: true, my: 1 })); // sweep
    run(w, 20);
    const left = e.dur - e.t, hp = e.hp;
    hit(w, press({ attack: true }));
    expect(w.players[0].move).toBe('stomp');
    expect(e.hp).toBe(hp - T.moves.stomp.damage);
    expect(e.dur - e.t).toBeGreaterThan(left - 10);
  });

  it('counter then attack is a riposte that launches', () => {
    const { w, e } = duel();
    untilStrikeIn(w, e, 10);
    step(w, press({ counter: true }));
    run(w, 6);
    hit(w);
    expect(w.players[0].move).toBe('riposte');
    expect(e.state).toBe('air');
  });

  it('dodge then attack is a flying knee with extra reach', () => {
    const { w, e } = dummy('thug', { x: 6.2, y: 1.5 });
    w.players[0].pos = { x: -1, y: 1.5 };
    step(w, press({ dodge: true, mx: 1 }));
    run(w, T.followUp.dodgeFrom);
    hit(w, press({ attack: true, mx: 1 }));
    expect(w.players[0].move).toBe('knee');
    expect(e.state).toBe('down');
    expect(e.hp).toBe(T.thug.hp - T.moves.knee.damage);
  });

  it('a finisher near a table is steered into it for a slam', () => {
    // Off to the side of the table, not lined up with it.
    const { w, e } = dummy('thug', { x: -1.2, y: -1.9 });
    w.players[0].pos = { x: -0.4, y: -0.9 };
    hit(w); hit(w); hit(w);
    run(w, 30);
    expect(w.stats[0].slams).toBe(1);
  });

  it('juggles, finishers and follow-ups stay deterministic', () => {
    const a = createWorld(21), b = createWorld(21);
    for (let i = 0; i < 2400; i++) {
      const inp = press({ mx: Math.sin(i / 40), my: Math.cos(i / 53), attack: i % 7 === 0 || i % 31 === 3, counter: i % 29 === 0, dodge: i % 61 === 0 });
      step(a, inp); step(b, inp);
    }
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe('evade', () => {
  it('with the stick left alone, steps back from the enemy and keeps facing him', () => {
    const { w, e } = dummy();
    const p = w.players[0];
    const before = Math.hypot(e.pos.x - p.pos.x, e.pos.y - p.pos.y);
    step(w, press({ dodge: true }));
    expect(p.dodgeKind).toBe('back');
    run(w, 20);
    const to = { x: e.pos.x - p.pos.x, y: e.pos.y - p.pos.y };
    expect(Math.hypot(to.x, to.y)).toBeGreaterThan(before + 1.5);
    expect(p.facing.x * to.x + p.facing.y * to.y).toBeGreaterThan(0.9 * Math.hypot(to.x, to.y));
  });

  it('pushing across the enemy is a sidestep that keeps him in front', () => {
    const { w } = dummy();
    step(w, press({ dodge: true, mx: 1 }));
    expect(w.players[0].dodgeKind).toBe('side');
    expect(w.players[0].facing.y).toBeLessThan(-0.9); // still looking up the screen at him
  });

  it('most of the distance is covered early, and it stops without sliding', () => {
    const w = createWorld(1);
    w.wave = 0; w.waveTimer = 1e9;
    const p = w.players[0];
    const x0 = p.pos.x;
    step(w, press({ dodge: true, mx: 1 }));
    run(w, Math.round(T.dodge.dash.frames / 2) - 1);
    const half = p.pos.x - x0;
    run(w, T.dodge.dash.frames);
    expect(half / (p.pos.x - x0)).toBeGreaterThan(0.65);
    expect(p.pos.x - x0).toBeCloseTo(T.dodge.dash.distance, 1);
  });

  it('dodging through a red lunge at the last moment is a perfect evade that powers up the knee', () => {
    const { w, e } = duel('kicker', { x: 0, y: -1.2 });
    w.players[0].pos = { x: 0, y: 2.2 };
    e.attack = 'flyingKnee'; e.state = 'approach'; e.t = 0; e.dur = 180;
    for (let i = 0; i < 300 && framesToStrike(e) !== 1; i++) step(w, NO_INPUT);
    step(w, press({ dodge: true, mx: 1 }));
    expect(w.events.some(ev => ev.type === 'perfect')).toBe(true);
    run(w, 20);
    expect(w.players[0].hp).toBe(T.player.hp);
    expect(w.stats[0].perfects).toBe(1);
  });
});

describe('style meter', () => {
  it('varied hits climb the ranks faster than repeating one move', () => {
    const varied = dummy('heavy');
    hit(varied.w); hit(varied.w); hit(varied.w, press({ attack: true, my: 1 })); // jab, cross, sweep
    const repeat = dummy('heavy');
    for (let i = 0; i < 3; i++) { hit(repeat.w); run(repeat.w, T.string.window + 2); } // jab, jab, jab
    expect(varied.w.players[0].style).toBeGreaterThan(repeat.w.players[0].style);
  });

  it('rising a tier is announced, and getting hit drops a tier', () => {
    const { w } = dummy('heavy');
    const p = w.players[0];
    p.style = T.style.tiers[2] - 1;
    let ranked = false;
    step(w, up);
    for (let i = 0; i < 20; i++) { ranked ||= w.events.some(e => e.type === 'rank'); step(w, NO_INPUT); }
    expect(ranked).toBe(true);
    expect(styleRank(p.style)).toBe(2);
    const e2 = spawnEnemy(w, 'thug', { x: p.pos.x, y: p.pos.y - 1.1 }, 'circle');
    untilStrikeIn(w, e2, 0);
    run(w, 10);
    expect(styleRank(p.style)).toBeLessThan(2);
  });

  it('fades when you stop fighting', () => {
    const { w } = dummy();
    hit(w);
    const s = w.players[0].style;
    run(w, 200);
    expect(w.players[0].style).toBeLessThan(s);
  });
});

describe('targeting around furniture', () => {
  it('prefers a man in the open over one behind the patio fence', () => {
    const w = createWorld(7);
    w.wave = 0; w.waveTimer = 1e9;
    w.players[0].pos = { x: -2, y: -1.4 };
    const behind = spawnEnemy(w, 'thug', { x: -2, y: -3.6 }, 'stun'); behind.dur = 999; // inside the fence
    const open = spawnEnemy(w, 'thug', { x: 0.6, y: -1.0 }, 'stun'); open.dur = 999;
    step(w, press({ attack: true, my: -1, mx: 0.3 }));
    expect(w.players[0].target).toBe(open.id);
  });
});
