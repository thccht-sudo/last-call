// Every number that shapes how the fight feels. Frames are 1/60 s.

export const TUNING = {
  fps: 60,

  player: { hp: 100, speed: 6.5, radius: 0.45 },
  inputBuffer: 10,

  // Player moves. Frames are startup / active / recovery; a far target adds travel frames in
  // front of the startup (see lunge). `effect` is what a clean hit does to an enemy:
  // stun = staggers, down = knocked flat, launch = into the air for a juggle,
  // spike = slammed out of the air into the floor with a shockwave.
  moves: {
    jab: { startup: 4, active: 3, recovery: 10, damage: 7, knock: 1.0, stun: 22, effect: 'stun', reach: 1.5 },
    cross: { startup: 5, active: 3, recovery: 11, damage: 9, knock: 1.2, stun: 24, effect: 'stun', reach: 1.5 },
    roundhouse: { startup: 8, active: 4, recovery: 18, damage: 16, knock: 6, stun: 0, effect: 'down', reach: 1.7 },
    sweep: { startup: 7, active: 4, recovery: 16, damage: 12, knock: 0.6, stun: 0, effect: 'down', reach: 1.7 },
    uppercut: { startup: 7, active: 4, recovery: 16, damage: 12, knock: 0.4, stun: 0, effect: 'launch', reach: 1.5 },
    juggle: { startup: 4, active: 3, recovery: 9, damage: 7, knock: 0.3, stun: 0, effect: 'launch', reach: 1.7 },
    spike: { startup: 7, active: 4, recovery: 16, damage: 16, knock: 1, stun: 0, effect: 'spike', reach: 1.8 },
    riposte: { startup: 4, active: 3, recovery: 12, damage: 10, knock: 0.4, stun: 0, effect: 'launch', reach: 1.6 },
    knee: { startup: 6, active: 4, recovery: 16, damage: 18, knock: 5, stun: 0, effect: 'down', reach: 1.7 },
    stomp: { startup: 7, active: 3, recovery: 12, damage: 12, knock: 0, stun: 0, effect: 'down', reach: 1.9 },
    smash: { startup: 9, active: 4, recovery: 20, damage: 30, knock: 5, stun: 0, effect: 'down', reach: 1.6 },
    throw: { startup: 4, active: 2, recovery: 8, damage: 0, knock: 0, stun: 0, effect: 'stun', reach: 0 }, // a bottle
  },
  // The string: X X X. Pull the stick away from him on the third hit for a sweep; pause before
  // it (delay frames after the second hit lands) for an uppercut that launches.
  string: { window: 46, delay: 20 },
  // Pressing attack this soon after a counter (riposte) or late in / just after a dodge (knee).
  followUp: { counter: 22, dodge: 14, dodgeFrom: 8 },

  // Freeflow: an attack locks onto the enemy you push toward (or the one in front) and closes
  // the gap at lunge speed; far targets add travel frames before the startup.
  lungeRange: 6,
  kneeRange: 7.5,
  lungeSpeed: 0.4, // metres per frame
  maxTravel: 14,
  strikeDistance: 1.05, // where the lunge stops in front of the target
  lockReach: 2.1, // the locked target is hit from this far, wherever he's drifted
  whiffRecovery: 6, // a missed attack can chain again this soon after its active frames

  // Evades keep you facing the nearest threat: a sidestep, a backstep, or a dash (toward him, or
  // anywhere when nobody is close). Ease-out travel: most of the distance in the first half.
  // A perfect evade (his hit would have landed during your invulnerable frames) slows time
  // and powers up the flying knee.
  dodge: {
    side: { frames: 16, invulnFrom: 1, invulnTo: 12, distance: 2.5 },
    back: { frames: 15, invulnFrom: 1, invulnTo: 11, distance: 2.1 },
    dash: { frames: 16, invulnFrom: 1, invulnTo: 12, distance: 3.2 },
    threatRange: 6,
    perfectWindow: 6, // dodging this few frames before a swing aimed at you lands is a perfect evade
    perfectKnee: 1.6, // damage multiplier on a knee straight after a perfect evade
  },

  // A counter staggers every counterable attacker in range. Attack straight after for a riposte.
  counter: { window: 24, frames: 22, cancel: 8, damage: 18, range: 2.8, whiffFrames: 14, stagger: 44 },

  // Hitstop freezes the attacker and the victim (the victim a little longer); counters and spikes
  // freeze the whole fight.
  hitstop: { light: 5, heavy: 9, counter: 10, bottle: 8, launch: 7, spike: 12, victimExtra: 2 },

  // Juggles: launched enemies fly on a 2D-plus-height arc; each air hit pops them up less.
  air: { gravity: 0.011, launch: 0.2, pop: 0.13, popDecay: 0.75, landDown: 46, maxHits: 3 },
  spikeWave: { radius: 2, damage: 6 },
  stompExtra: 16,

  // Taking a hit: short hitstun you can dodge out of after `breakout` frames. Never a long lock.
  hurt: { breakout: 8 },

  // Enemy attacks. Yellow (counterable) or red (unblockable: dodge). `lunge` is metres covered
  // during the active frames, locked in the direction set when tracking stops. `from` is how far
  // away he starts it.
  attacks: {
    hook: { windup: 30, active: 4, recovery: 24, damage: 10, from: 1.35, reach: 1.7, lunge: 0, knock: 0.5, stun: 14, red: false },
    kick: { windup: 34, active: 5, recovery: 26, damage: 12, from: 1.7, reach: 2.0, lunge: 0, knock: 1.1, stun: 16, red: false },
    shove: { windup: 22, active: 4, recovery: 20, damage: 4, from: 1.3, reach: 1.6, lunge: 0, knock: 1.7, stun: 12, red: false },
    elbow: { windup: 22, active: 4, recovery: 22, damage: 9, from: 1.2, reach: 1.6, lunge: 0, knock: 0.6, stun: 14, red: false },
    spinKick: { windup: 36, active: 6, recovery: 26, damage: 13, from: 1.7, reach: 2.0, lunge: 0, knock: 1.2, stun: 16, red: false },
    haymaker: { windup: 46, active: 5, recovery: 34, damage: 22, from: 1.5, reach: 1.9, lunge: 0, knock: 1.2, stun: 22, red: true },
    charge: { windup: 40, active: 14, recovery: 30, damage: 18, from: 4.2, reach: 1.3, lunge: 4.2, knock: 1.6, stun: 20, red: true },
    flyingKnee: { windup: 34, active: 12, recovery: 30, damage: 16, from: 3.8, reach: 1.25, lunge: 3.6, knock: 1.3, stun: 18, red: true },
    throw: { windup: 30, active: 2, recovery: 30, damage: 10, from: 8, reach: 0, lunge: 0, knock: 0.3, stun: 16, red: false },
  },

  // Enemy stats and what each one throws (picked at random, weighted by repeats).
  thug: { hp: 46, speed: 3.4, radius: 0.45, circleRadius: 3.8, trackUntil: 10, cooldown: 50, stun: 18, moves: ['hook', 'hook', 'kick', 'shove'] },
  heavy: { hp: 70, speed: 2.8, radius: 0.55, circleRadius: 4.2, trackUntil: 14, cooldown: 80, stun: 14, moves: ['haymaker', 'haymaker', 'charge'] },
  // Hangs back and lobs red cups. Counter a cup to knock it back at him.
  thrower: { hp: 30, speed: 3.2, radius: 0.42, circleRadius: 6.2, trackUntil: 6, cooldown: 70, stun: 22, moves: ['throw'] },
  // Quick on his feet: elbows and spinning kicks up close, a red flying knee from range.
  kicker: { hp: 52, speed: 3.9, radius: 0.45, circleRadius: 3.9, trackUntil: 10, cooldown: 60, stun: 18, moves: ['elbow', 'spinKick', 'flyingKnee', 'flyingKnee'] },
  // The FIJI President: hook, elbow, then a red haymaker (a red charge once enraged). Super
  // armour, calls for backup once at half health.
  boss: { hp: 240, speed: 3.0, radius: 0.62, circleRadius: 4.0, trackUntil: 8, cooldown: 60, stun: 12, moves: ['hook', 'elbow', 'haymaker'] },
  bossEnrage: 0.5, // health fraction where phase two starts
  cup: { speed: 0.2, hitRadius: 0.6, deflectRange: 1.9, deflectSpeed: 0.34, deflectDamage: 24 },
  slam: { speed: 0.06, damage: 12, extraDown: 30, bowlDamage: 8, aim: 2.4 }, // aim: finishers steer into a wall this close
  knockdownFrames: 70,
  getupFrames: 20,

  bottle: { speed: 0.3, damage: 25, meleeDamage: 30, pickup: 1.3, throwRange: 13, respawn: 480 },

  waves: [
    { stage: 0, maxAttackers: 1, enemies: ['thug', 'thug', 'thug'] },
    { stage: 0, maxAttackers: 2, enemies: ['thug', 'thrower', 'kicker', 'thug'] },
    { stage: 1, maxAttackers: 2, enemies: ['boss', 'heavy', 'thrower'] }, // inside the bar
  ] as { stage: number; maxAttackers: number; enemies: EnemyKind[] }[],
  waveDelay: 90,

  // Difficulty scales enemy damage, the counter window and enemy health.
  difficulty: [
    { name: 'EASY', damage: 0.6, window: 1.4, enemyHp: 0.8 },
    { name: 'NORMAL', damage: 1, window: 1, enemyHp: 1 },
    { name: 'HARD', damage: 1.35, window: 0.75, enemyHp: 1.2 },
  ],

  coop: { extraPerWave: 1, reviveRange: 1.3, reviveFrames: 120, reviveHp: 40, tagWindow: 45, tagMultiplier: 1.5 },
} as const;

export type EnemyKind = 'thug' | 'heavy' | 'thrower' | 'kicker' | 'boss';
export type MoveName = keyof typeof TUNING.moves;
export type AttackName = keyof typeof TUNING.attacks;
