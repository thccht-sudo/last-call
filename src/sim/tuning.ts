// Every number that shapes how the fight feels. Frames are 1/60 s.

export const TUNING = {
  fps: 60,

  player: { hp: 100, speed: 6.5, radius: 0.45 },
  inputBuffer: 8,

  // Three-hit string; the third hit knocks down.
  combo: [
    { startup: 5, active: 3, recovery: 11, damage: 8, knock: 1.2, stun: 18, knockdown: false },
    { startup: 5, active: 3, recovery: 11, damage: 10, knock: 1.2, stun: 18, knockdown: false },
    { startup: 9, active: 4, recovery: 20, damage: 18, knock: 5.5, stun: 0, knockdown: true },
  ],
  lungeRange: 4.5, // freeflow: how far an attack will travel to reach a target
  strikeDistance: 1.05, // where the lunge stops in front of the target
  hitReach: 1.5,
  maxLungeSpeed: 0.45, // units per frame

  dodge: { frames: 18, invulnFrom: 1, invulnTo: 13, distance: 3.6 },

  counter: { window: 24, frames: 26, damage: 20, range: 2.8, whiffFrames: 24 },

  hitstop: { light: 4, heavy: 8, counter: 10, bottle: 8 },

  // Enemy stats. `unblockable` attacks show the red prompt: dodge, don't counter.
  thug: {
    hp: 46, speed: 3.4, radius: 0.45, circleRadius: 3.8, attackRange: 1.35,
    windup: 34, trackUntil: 10, active: 4, recovery: 26, damage: 12,
    cooldown: 50, stun: 18, unblockable: false,
  },
  heavy: {
    hp: 70, speed: 2.8, radius: 0.55, circleRadius: 4.2, attackRange: 1.5,
    windup: 48, trackUntil: 14, active: 5, recovery: 34, damage: 26,
    cooldown: 80, stun: 14, unblockable: true,
  },
  // Hangs back and lobs red cups. Counter a cup to knock it back at him.
  thrower: {
    hp: 30, speed: 3.2, radius: 0.42, circleRadius: 6.2, attackRange: 8,
    windup: 30, trackUntil: 6, active: 2, recovery: 30, damage: 10,
    cooldown: 70, stun: 22, unblockable: false,
  },
  // Grabs and holds. Mash attack to break free, or have your partner hit him.
  grappler: {
    hp: 60, speed: 3.6, radius: 0.5, circleRadius: 3.6, attackRange: 1.3,
    windup: 40, trackUntil: 12, active: 4, recovery: 30, damage: 5,
    cooldown: 90, stun: 30, unblockable: true,
  },
  // The FIJI President: two counterable swings, then an unblockable haymaker. Super armour,
  // calls for backup once at half health.
  boss: {
    hp: 240, speed: 3.0, radius: 0.62, circleRadius: 4.0, attackRange: 1.6,
    windup: 26, trackUntil: 8, active: 4, recovery: 18, damage: 14,
    cooldown: 60, stun: 12, unblockable: false,
  },
  bossHaymaker: { windup: 44, damage: 28, recovery: 40 },
  bossEnrage: 0.5, // health fraction where phase two starts
  cup: { speed: 0.2, hitRadius: 0.6, deflectRange: 1.9, deflectSpeed: 0.34, deflectDamage: 24 },
  grab: { holdFrames: 150, tick: 30, escapePresses: 6, throwDamage: 10 },
  slam: { speed: 0.09, damage: 12, extraDown: 30, bowlDamage: 8 },
  knockdownFrames: 70,
  getupFrames: 20,

  bottle: { speed: 0.3, damage: 25, meleeDamage: 30, pickup: 1.3, throwRange: 13, respawn: 480 },

  waves: [
    { maxAttackers: 1, enemies: ['thug', 'thug', 'thug'] },
    { maxAttackers: 2, enemies: ['thug', 'thrower', 'grappler', 'thug'] },
    { maxAttackers: 2, enemies: ['boss', 'heavy', 'thrower'] },
  ] as { maxAttackers: number; enemies: EnemyKind[] }[],
  waveDelay: 90,

  coop: { extraPerWave: 1, reviveRange: 1.3, reviveFrames: 120, reviveHp: 40, tagWindow: 45, tagMultiplier: 1.5 },
} as const;

export type EnemyKind = 'thug' | 'heavy' | 'thrower' | 'grappler' | 'boss';
