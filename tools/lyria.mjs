// One Lyria 3 generation through OpenRouter, streamed, encoded to MP3 at `out`. Shared by
// generate-music.mjs and generate-setlist.mjs. Returns the model's text (lyrics as it heard them).
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export async function lyria(model, prompt, out) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, stream: true, modalities: ['text', 'audio'], audio: { format: 'wav' }, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
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
      if (json.error) throw new Error(JSON.stringify(json.error));
      const delta = json.choices?.[0]?.delta ?? {};
      if (delta.audio?.data) chunks.push(Buffer.from(delta.audio.data, 'base64'));
      if (delta.audio?.format) format = delta.audio.format;
      if (delta.content) text += delta.content;
    }
  }
  if (!chunks.length) throw new Error(`no audio returned. Text: ${text.slice(0, 300)}`);
  const raw = join(tmpdir(), `lastcall-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.${format}`);
  writeFileSync(raw, Buffer.concat(chunks));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-c:a', 'libmp3lame', '-q:a', '4', out]);
  return text;
}
