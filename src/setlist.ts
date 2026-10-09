// The Hold Ready, live at the Salt Shed: what the endless mode calls each song, and the band's
// banter between them. Every wave is a song; every fifth is an encore. It never ends.
import { TUNING as T } from './sim/tuning';

// The songs actually playing, in order, round and round (public/music/set*.mp3, made by
// tools/generate-music.mjs).
export const TRACKS = [
  { file: 'set1', title: 'Stay Ready' },
  { file: 'set2', title: 'Endless Nights' },
  { file: 'set3', title: 'One More Song' },
] as const;

// Between songs the frontman talks; the banner prints what he says.
export const BANTER = [
  "This next one's a new one",
  "We've got time for one more",
  'We are not going home',
  'Is everybody still having a good time?',
  'Stay ready, Chicago',
  'This one goes out to the guys fighting by the soundboard',
];

export const isEncore = (wave: number) => (wave + 1) % T.concert.bossEvery === 0;
export const songLabel = (wave: number) => isEncore(wave) ? `ENCORE ${(wave + 1) / T.concert.bossEvery}` : `SONG ${wave + 1}`;
