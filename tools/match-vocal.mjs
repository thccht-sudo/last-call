// Compares a song's lead vocal to a human-approved reference take, through an audio-capable
// model on OpenRouter. Absolute "does this sound like the band" scores proved useless for the
// voice (they rated takes a listener rejected 10/10); comparing against the take that listener
// picked is what the setlist script gates on.
// Usage: OPENROUTER_API_KEY=... node tools/match-vocal.mjs reference.mp3 candidate.mp3 [...]
import { readFileSync } from 'node:fs';

const MODEL = process.env.JUDGE_MODEL ?? '~google/gemini-pro-latest';

const Q = `You will hear two recordings by the same fictional rock band. Recording 1 is the REFERENCE: a listener
approved its lead vocal as exactly right. In the reference, the frontman basically just talks over the band in his
ordinary speaking voice, like a singer who stops singing and simply talks to the crowd over the music, unhurried and
conversational, getting worked up toward the chorus. He is not singing, not rapping, not chanting on pitch.
Compare ONLY the LEAD VOCAL of Recording 2 to the reference, mostly in the verses. Be strict: any held notes,
melody, crooning, or a "rock singer" voice in Recording 2's verses is a mismatch.
Return ONLY JSON:
{"talks_like_reference": 0-10 (10 = he just talks over the music exactly like the reference),
 "voice_like_reference": 0-10 (timbre, age, accent),
 "sings_in_verses": true/false,
 "notes": "<one sentence on the difference>"}`;

export async function matchVocal(reference, candidate) {
  const audio = f => ({ type: 'input_audio', input_audio: { data: readFileSync(f).toString('base64'), format: 'mp3' } });
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL, temperature: 0,
      messages: [{ role: 'user', content: [{ type: 'text', text: Q }, { type: 'text', text: 'Recording 1 (reference):' }, audio(reference), { type: 'text', text: 'Recording 2:' }, audio(candidate)] }],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  const text = (await res.json()).choices?.[0]?.message?.content ?? '';
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error(`no JSON in ${text.slice(0, 200)}`);
  return { file: candidate, ...JSON.parse(m[0]) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [ref, ...files] = process.argv.slice(2);
  for (const f of files) {
    try { console.log(JSON.stringify(await matchVocal(ref, f))); }
    catch (e) { console.log(JSON.stringify({ file: f, error: String(e.message ?? e) })); }
  }
}
