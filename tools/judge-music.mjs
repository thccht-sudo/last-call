// Listens to the endless mode's songs with an audio-capable model through OpenRouter and scores
// how well each one passes as a Hold Steady parody, so off-style takes can be regenerated.
// Usage: OPENROUTER_API_KEY=... node tools/judge-music.mjs public/music/set1.mp3 [...]
// Prints one JSON line per file. Not part of the build.
import { readFileSync } from 'node:fs';

const MODEL = process.env.JUDGE_MODEL ?? '~google/gemini-pro-latest';

const RUBRIC = `You are a strict music critic who knows The Hold Steady inside out (Almost Killed Me,
Separation Sunday, Boys and Girls in America, Stay Positive). This track is meant to be an affectionate
parody of them for a video game: a fictional band, original lyrics, but it should sound unmistakably
like that band. Listen to the whole track and score it honestly. Hallmarks to check:
- Lead vocal: Craig Finn's talk-sing: conversational, half-spoken, wordy storytelling, sometimes ranted
  or shouted, more speaking than singing, a plain untrained Midwestern male voice. Not a polished,
  melodic, or pop-punk singer; not a gravelly growl; not a woman.
- Twin crunchy overdriven classic-rock electric guitars with big Thin Lizzy / AC/DC style riffs and leads.
- Barroom piano (E Street style) and/or Hammond organ prominent in the mix, sometimes a piano break.
- Big gang-vocal singalong choruses ("whoa-oh"), anthemic, like a bar band playing to a packed room.
- Mid-2000s indie bar-band production: live, loose, loud, not slick or modern.
Return ONLY JSON with these keys:
{"genre": "<what it actually sounds like in a few words>",
 "vocal": "<describe the lead vocal: gender, singing vs talking, tone>",
 "talk_sing": 0-10, "guitars": 0-10, "keys": 0-10, "singalong": 0-10, "production": 0-10,
 "hold_steady": 0-10, "lyrics_heard": "<a line or two you can make out>",
 "problems": ["<anything off-style or broken: synths, wrong genre, garbled vocals, abrupt ending, silence>"]}`;

export async function judge(file) {
  const audio = readFileSync(file).toString('base64');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL, temperature: 0,
      messages: [{ role: 'user', content: [
        { type: 'text', text: RUBRIC },
        { type: 'input_audio', input_audio: { data: audio, format: 'mp3' } },
      ] }],
    }),
  });
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status} ${await res.text()}`);
  const json = await res.json();
  const text = json.choices?.[0]?.message?.content ?? '';
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error(`${file}: no JSON in ${text.slice(0, 300)}`);
  return { file, ...JSON.parse(m[0]) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const file of process.argv.slice(2)) {
    try { console.log(JSON.stringify(await judge(file))); }
    catch (e) { console.log(JSON.stringify({ file, error: String(e.message ?? e).slice(0, 300) })); }
  }
}
