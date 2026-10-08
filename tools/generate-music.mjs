// Generates the soundtrack with Google Lyria 3 via OpenRouter, then encodes it to MP3.
// Usage: OPENROUTER_API_KEY=... node tools/generate-music.mjs [track ...]
// Output lands in public/music/<track>.mp3. Not part of the build; rerun only to replace a track.
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const TRACKS = {
  title: {
    model: 'google/lyria-3-clip-preview',
    prompt: 'Title screen loop for a late-night bar brawler video game. Moody 1980s synthwave, slow 90 BPM, ' +
      'warm analog pads, gated reverb snare, a lonely saxophone-like lead, neon city at 1am, cool and confident. Instrumental, no vocals.',
  },
  fight: {
    model: 'google/lyria-3-pro-preview',
    prompt: 'Driving combat music for a co-op beat-em-up video game set outside a college bar at night. ' +
      'Aggressive retro synthwave mixed with funk: punchy 128 BPM drum machine, slap bass riff, distorted analog synth stabs, ' +
      'tension builds and drops, loopable, energetic like an 80s action movie street fight. Instrumental, no vocals.',
  },
  boss: {
    model: 'google/lyria-3-pro-preview',
    prompt: 'Final round boss fight music for a retro brawler video game. Heavy, menacing darkwave at 140 BPM, ' +
      'pounding kick, growling detuned bass synth, urgent arpeggios, big gated drums, rising stakes, loopable. Instrumental, no vocals.',
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
  mkdirSync('public/music', { recursive: true });
  const raw = `/tmp/lastcall-${name}.${format}`;
  writeFileSync(raw, Buffer.concat(chunks));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-c:a', 'libmp3lame', '-q:a', '4', `public/music/${name}.mp3`]);
  console.log(`${name}: ${format} -> public/music/${name}.mp3`, text ? `(${text.slice(0, 120).replace(/\n/g, ' ')})` : '');
}

for (const name of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TRACKS)) await generate(name);
