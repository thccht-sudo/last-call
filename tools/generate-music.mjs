// Generates the soundtrack with Google Lyria 3 via OpenRouter, then encodes it to MP3.
// Usage: OPENROUTER_API_KEY=... node tools/generate-music.mjs [track ...]
// Output lands in public/music/<track>.mp3. Not part of the build; rerun only to replace a track.
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Straight synthwave / darksynth, in the spirit of Midnight Fight Express. No funk, no guitar.
const STYLE = 'Pure retro synthwave and darksynth instrumental for a neon night-time brawler video game. ' +
  'Pulsing sequenced 16th-note analog synth bass, punchy 1980s drum machine with big gated-reverb snare, ' +
  'shimmering arpeggiators, wide detuned saw leads, cinematic analog pads. Purely electronic: no funk, ' +
  'no slap bass, no guitar, no saxophone, no vocals.';

// The Hold Ready, live at the Salt Shed: the endless mode's setlist. Boozy, shout-along bar-band
// rock with piano and organ. Lyrics are ours; the joke is that the show never ends.
const ROCK = 'Boisterous bar-band indie rock with heartland-rock swagger, recorded live in a cavernous concert hall: ' +
  'crunchy overdriven twin electric guitars, rollicking barroom piano and wheezing Hammond organ, driving rock drums, ' +
  'melodic bass, a raspy half-spoken, half-shouted storytelling male lead vocal in the verses, and huge gang-vocal ' +
  'singalong choruses with whoa-oh backing vocals. The crowd cheers between lines.';

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
  // The setlist, played in order and round again for as long as the mode lasts.
  set1: {
    model: 'google/lyria-3-pro-preview',
    prompt: `${ROCK} Anthem at 150 BPM, a song called "Stay Ready". Lyrics:\n` +
      "[Verse] We rolled into Chicago on a Tuesday in the rain / Said we'd play until eleven, then we played it all again / " +
      "The kids are in the pit and the uncles at the bar / Somebody yelled for one more and we never got that far\n" +
      '[Chorus] Stay ready, stay ready, the night is never done / Stay ready, stay ready, there is always one more song\n' +
      "[Verse] The bassist's on his third wind and the drummer's on his fourth / The setlist said eleven but we wrote some more\n" +
      '[Chorus] Stay ready, stay ready, the night is never done / Stay ready, stay ready, there is always one more song',
  },
  set2: {
    model: 'google/lyria-3-pro-preview',
    prompt: `${ROCK} Big mid-tempo singalong at 128 BPM with a piano hook, a song called "Endless Nights". Lyrics:\n` +
      "[Verse] It was one of those endless nights under the salt shed lights / The doors said seven-thirty and it's two a.m. tonight / " +
      "Some guy in cargo shorts says he saw us in oh-four / He's been standing by the soundboard since we opened up the doors\n" +
      '[Chorus] Whoa-oh, endless nights / We never say goodnight / Whoa-oh, endless nights / Turn up the house lights, we will play right through the light\n' +
      "[Bridge] Thank you Chicago, this next one's a new one",
  },
  set3: {
    model: 'google/lyria-3-pro-preview',
    prompt: `${ROCK} Fast rave-up encore at 160 BPM, a song called "One More Song". Lyrics:\n` +
      "[Verse] Thank you and goodnight, ha, just kidding, we are back / The roadies started crying and the merch guy's out of black / " +
      "Somewhere there's a curfew but it's nobody we know / We'll be playing at the sunrise, we'll be playing at the snow\n" +
      '[Chorus] One more song, one more song, nobody is going home / One more song, one more song, we will play until the dawn\n' +
      '[Outro] One more, one more, one more, one more',
  },
  boss: {
    model: 'google/lyria-3-pro-preview',
    prompt: `${STYLE} Final boss track: darker and heavier darksynth at 130 BPM, distorted growling bass, ` +
      'ominous minor-key arpeggios, pounding drums, tension rising to a huge climactic lead, seamless for looping.',
  },
};

async function generate(name) {
  const { model, prompt } = TRACKS[name];
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model, stream: true, modalities: ['text', 'audio'], audio: { format: 'wav' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${await res.text()}`);
  const chunks = [];
  let format = 'wav', text = '', buf = '';
  const dec = new TextDecoder();
  for await (const part of res.body) {
    buf += dec.decode(part, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') continue;
      const json = JSON.parse(data);
      if (json.error) throw new Error(`${name}: ${JSON.stringify(json.error)}`);
      const delta = json.choices?.[0]?.delta ?? {};
      if (delta.audio?.data) chunks.push(Buffer.from(delta.audio.data, 'base64'));
      if (delta.audio?.format) format = delta.audio.format;
      if (delta.content) text += delta.content;
    }
  }
  if (!chunks.length) throw new Error(`${name}: no audio returned. Text: ${text.slice(0, 300)}`);
  mkdirSync('public/music', { recursive: true }); mkdirSync('public/sfx', { recursive: true });
  const raw = `/tmp/lastcall-${name}.${format}`;
  writeFileSync(raw, Buffer.concat(chunks));
  const out = ['punches', 'glass', 'street', 'club'].includes(name) ? `public/sfx/${['street', 'club'].includes(name) ? name : 'raw-' + name}.mp3` : `public/music/${name}.mp3`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-c:a', 'libmp3lame', '-q:a', '4', out]);
  console.log(`${name}: ${format} ->`, out, text ? `(${text.slice(0, 120).replace(/\n/g, ' ')})` : '');
}

await Promise.all((process.argv.slice(2).length ? process.argv.slice(2) : ['title', 'fight', 'boss']).map(generate));
