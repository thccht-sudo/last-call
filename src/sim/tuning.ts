// Every number that shapes how the fight feels. Frames are 1/60 s.

export const TUNING = {
  fps: 60,
  arena: { w: 18, h: 12 },

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

  thug: {
    hp: 46, speed: 3.4, radius: 0.45, circleRadius: 3.8, attackRange: 1.35,
    windup: 34, trackUntil: 10, active: 4, recovery: 26, damage: 12,
    cooldown: 50, stun: 18, armored: false,
  },
  heavy: {
    hp: 70, speed: 2.8, radius: 0.55, circleRadius: 4.2, attackRange: 1.5,
    windup: 48, trackUntil: 14, active: 5, recovery: 34, damage: 26,
    cooldown: 80, stun: 14, armored: true,
  },
  knockdownFrames: 70,
  getupFrames: 20,

  bottle: { speed: 0.3, damage: 25, meleeDamage: 30, pickup: 1.3, throwRange: 13, respawn: 480 },

  waves: [
    { maxAttackers: 1, enemies: ['thug', 'thug', 'thug'] },
    { maxAttackers: 2, enemies: ['thug', 'heavy', 'thug', 'thug'] },
  ] as { maxAttackers: number; enemies: ('thug' | 'heavy')[] }[],
  waveDelay: 90,
} as const;

export type EnemyKind = 'thug' | 'heavy';
