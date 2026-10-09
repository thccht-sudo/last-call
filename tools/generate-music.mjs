// Generates the soundtrack with Google Lyria 3 via OpenRouter, then encodes it to MP3.
// Usage: OPENROUTER_API_KEY=... node tools/generate-music.mjs [track ...]
// Output lands in public/music/<track>.mp3. Not part of the build; rerun only to replace a track.
// The Hold Ready's setlist for the endless mode has its own script: tools/generate-setlist.mjs.
import { mkdirSync } from 'node:fs';
import { lyria } from './lyria.mjs';

// Straight synthwave / darksynth, in the spirit of Midnight Fight Express. No funk, no guitar.
const STYLE = 'Pure retro synthwave and darksynth instrumental for a neon night-time brawler video game. ' +
  'Pulsing sequenced 16th-note analog synth bass, punchy 1980s drum machine with big gated-reverb snare, ' +
  'shimmering arpeggiators, wide detuned saw leads, cinematic analog pads. Purely electronic: no funk, ' +
  'no slap bass, no guitar, no saxophone, no vocals.';

const TRACKS = {
  // Not music: Lyria asked for isolated one-shots and ambience, sliced by tools/slice-sfx.mjs.
  punches: {
    model: 'google/lyria-3-clip-preview',
    prompt: 'Sound effects only, no music, no melody, no beat, no rhythm: a series of separate heavy movie-fight punch impacts, ' +
      'meaty body blows and face punches, each one isolated, followed by a full second of silence. Dry foley recording.',
  },
  glass: {
    model: 'google/lyria-3-clip-preview',
    prompt: 'Sound effects only, no music, no melody, no rhythm: a series of separate glass beer bottles smashing on a brick floor, ' +
      'each smash isolated, followed by a full second of silence. Dry foley recording.',
  },
  street: {
    model: 'google/lyria-3-clip-preview',
    prompt: 'Ambient field recording, no music: a busy college bar street at midnight, muffled bass from inside a club, ' +
      'crowd chatter and laughter, distant whoops, a car passing. Seamless loop.',
  },
  club: {
    model: 'google/lyria-3-clip-preview',
    prompt: 'Ambient field recording, no music melody: inside a packed college bar, loud crowd chatter, glasses clinking, ' +
      'people shouting orders at the bar, laughter. Seamless loop.',
  },

  title: {
    model: 'google/lyria-3-clip-preview',
    prompt: `${STYLE} Title screen loop: brooding and cool, 95 BPM, slow-building arpeggio over a low pulsing bass, ` +
      'a lone wistful lead melody, like driving through an empty neon city at 2am.',
  },
  fight: {
    model: 'google/lyria-3-pro-preview',
    prompt: `${STYLE} Combat track: relentless and driving at 120 BPM, four-on-the-floor kick, rolling octave bass, ` +
      'urgent stabbing synth chords and a heroic soaring lead, keeps momentum the whole way, seamless for looping.',
  },
  boss: {
    model: 'google/lyria-3-pro-preview',
    prompt: `${STYLE} Final boss track: darker and heavier darksynth at 130 BPM, distorted growling bass, ` +
      'ominous minor-key arpeggios, pounding drums, tension rising to a huge climactic lead, seamless for looping.',
  },
};

async function generate(name) {
  const { model, prompt } = TRACKS[name];
  mkdirSync('public/music', { recursive: true }); mkdirSync('public/sfx', { recursive: true });
  const out = ['punches', 'glass', 'street', 'club'].includes(name) ? `public/sfx/${['street', 'club'].includes(name) ? name : 'raw-' + name}.mp3` : `public/music/${name}.mp3`;
  const text = await lyria(model, prompt, out);
  console.log(`${name} ->`, out, text ? `(${text.slice(0, 120).replace(/\n/g, ' ')})` : '');
}

await Promise.all((process.argv.slice(2).length ? process.argv.slice(2) : ['title', 'fight', 'boss']).map(generate));
