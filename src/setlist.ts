// The Hold Ready, live at the Salt Shed: what the endless mode calls each song, and the band's
// banter between them. Every wave is a song; every fifth is an encore. It never ends.
import { TUNING as T } from './sim/tuning';

// The songs actually playing, in order, round and round (public/music/set*.mp3, made and
// checked for style by tools/generate-setlist.mjs).
export const TRACKS = [
  { file: 'set1', title: 'Stay Ready' },
  { file: 'set2', title: 'Endless Nights' },
  { file: 'set4', title: 'Kevin from the Message Board' },
  { file: 'set5', title: 'Cargo Shorts Kids' },
  { file: 'set6', title: 'Baptized in the Chicago River' },
  { file: 'set7', title: 'Curfew Is a Rumor' },
  { file: 'set8', title: 'Denise Works the Merch' },
  { file: 'set10', title: 'Four Hundred and Twelve' },
  { file: 'set9', title: 'Blue Line at Sunrise' },
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
