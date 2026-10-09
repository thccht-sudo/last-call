// Voice lines for the frats, the President, Conrad and George, spoken by GPT audio via OpenRouter.
// Usage: OPENROUTER_API_KEY=... node tools/generate-voice.mjs [name ...]   (writes public/sfx/vo/*.mp3)
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// [name, voice, how to say it, the line]
export const LINES = [
  // Frats spotting you / taunting while they circle.
  ['bro1', 'ash', 'a drunk, cocky college frat guy picking a fight, loud', 'Bro. BRO. You did NOT just do that.'],
  ['bro2', 'echo', 'a smug frat guy, sneering', "You're not even on the list, pledge."],
  ['bro3', 'ash', 'a rowdy frat guy hyping himself up', "Let's GO! Hold my natty!"],
  ['bro4', 'verse', 'a frat guy, offended and slurring a little', "Do you know who my dad is?"],
  ['bro5', 'echo', 'a frat guy yelling to his brothers', "Yo, brothers! Get over here!"],
  ['bro6', 'ash', 'an angry frat guy', "This is a FIJI bar, man!"],
  // Frats getting hit / going down.
  ['oof1', 'ash', 'a young man getting punched in the stomach, a short pained grunt, no words', 'Oof!'],
  ['oof2', 'echo', 'a young man taking a hard hit, a sharp pained grunt, no words', 'Ugh!'],
  ['oof3', 'verse', 'a young man knocked to the floor, a long groan', 'Ohhh, my nose...'],
  ['oof4', 'ash', 'a frat guy hit with a bottle, shocked', 'Aagh! My Vineyard Vines!'],
  // The FIJI President.
  ['boss1', 'onyx', 'a big, menacing fraternity president, slow and threatening', "You picked the wrong bar on the wrong night."],
  ['boss2', 'onyx', 'a fraternity president bellowing for reinforcements', "BROTHERS! Get down here! NOW!"],
  ['boss3', 'onyx', 'a fraternity president winding up a huge punch, a roaring yell', 'RAAAH!'],
  ['boss4', 'onyx', 'a defeated fraternity president, groaning on the floor', "Nobody... tells nationals... about this."],
  // Conrad and George.
  ['conrad1', 'ash', 'a confident, calm man in his thirties, dry humor', "Last call, boys."],
  ['conrad2', 'ash', 'a confident man throwing a punch, a short sharp exertion', 'Hah!'],
  ['george1', 'verse', 'a cheerful, wry man in his thirties', "I wore a suit for this?"],
  ['george2', 'verse', 'a man throwing a punch, a short sharp exertion', 'Hyah!'],
  ['down1', 'ash', 'a man knocked down calling to his friend', "George! A little help!"],
  ['down2', 'verse', 'a man knocked down calling to his friend', "Conrad! Get me up!"],
  ['win', 'ash', 'a tired, satisfied man after a bar fight, with a little laugh', "Alright. Who's buying?"],
  // Perfect evades and the top style rank.
  ['evade1', 'ash', 'a calm man stepping out of the way of a punch, dry and amused', 'Too slow.'],
  ['evade2', 'verse', 'a wry man dodging a punch at the last second, cheeky', 'Missed me.'],
  ['rank1', 'ash', 'a man in a bar fight on a roll, shouting it like a bartender ringing the bell', 'LAST CALL!'],
  ['rank2', 'verse', 'a man in a bar fight on a roll, delighted, shouting', "Now we're talking!"],
  ['stomp1', 'onyx', 'a frat guy on the floor getting stepped on, a pained wheeze, no words', 'Hngh!'],
  // The Salt Shed: chopped uncs, the OG Fan, and the band between songs.
  ['unc1', 'ballad', 'a washed-up 45-year-old man at a rock concert, condescending', "I saw them at the Metro in oh-four. You don't even know the deep cuts."],
  ['unc2', 'onyx', 'a middle-aged dad at a concert, annoyed, puffing his chest out', "Hey! I've been holding this spot since the opener."],
  ['unc3', 'echo', 'a middle-aged man who thinks he is still cool, lecturing', 'Back in my day, we moshed with respect!'],
  ['unc4', 'ash', 'a 45-year-old guy in cargo shorts, offended', 'These are my good cargo shorts, buddy.'],
  ['unc5', 'verse', 'a middle-aged man yelling across a loud concert floor to his friends', 'Dave! Kevin! Get over here!'],
  ['unc6', 'ballad', 'a middle-aged man bragging, a little out of breath', "My back's shot, but my fists still work."],
  ['unc7', 'echo', 'a middle-aged man hit in the face, shocked and upset', 'Not the Oakleys!'],
  ['unc8', 'onyx', 'a middle-aged man knocked to the floor, a long groan', 'Ohhh... my lower back...'],
  ['og1', 'onyx', 'a big, gravelly, obsessive rock superfan in his fifties, slow and menacing', "Four hundred and twelve shows. And you're standing in my spot."],
  ['og2', 'onyx', 'a rock superfan bellowing for his friends from the online fan forum', 'Message board guys! Front and center! NOW!'],
  ['og3', 'onyx', 'a rock superfan winding up a huge punch, a roaring yell', 'STAY READY!'],
  ['og4', 'onyx', 'a defeated rock superfan on the floor, wheezing but loyal', "I'll... still be here... for the encore."],
  ['band1', 'echo', 'a raspy, sweaty indie-rock frontman shouting into a microphone to a huge concert crowd, delighted', "Thank you, Chicago! This next one's a new one!"],
  ['band2', 'echo', 'a raspy indie-rock frontman shouting into a microphone to a concert crowd, then a sly aside', "We've got time for one more! ...And then one more after that."],
  ['band3', 'echo', 'a raspy indie-rock frontman roaring into a microphone to a concert crowd', 'We are The Hold Ready, and we are not going home!'],
  ['band4', 'echo', 'a hoarse indie-rock frontman asking a concert crowd, cheerful and exhausted', "Is everybody still having a good time? It's been six hours!"],
  ['band5', 'echo', 'a raspy indie-rock frontman shouting a catchphrase to a concert crowd', 'Stay ready, Chicago!'],
  ['band6', 'echo', 'a raspy indie-rock frontman dedicating a song to a concert crowd, amused', 'This one goes out to the guys fighting by the soundboard!'],
  ['conrad3', 'ash', 'a tired, dry man in his thirties at a rock concert that will not end', "Didn't this start at eight?"],
];

async function speak([name, voice, style, line]) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai/gpt-audio', stream: true, modalities: ['text', 'audio'], audio: { voice, format: 'pcm16' },
      messages: [
        { role: 'system', content: 'You are a voice actor recording lines for a comedy video game. Perform exactly the line given, once, in character, with no extra words, no introduction and nothing after it.' },
        { role: 'user', content: `Perform this as ${style}: "${line}"` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${await res.text()}`);
  const chunks = []; let buf = '', transcript = '';
  const dec = new TextDecoder();
  for await (const part of res.body) {
    buf += dec.decode(part, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!l.startsWith('data:') || l.includes('[DONE]')) continue;
      const j = JSON.parse(l.slice(5));
      const a = j.choices?.[0]?.delta?.audio;
      if (a?.data) chunks.push(Buffer.from(a.data, 'base64'));
      if (a?.transcript) transcript += a.transcript;
    }
  }
  if (!chunks.length) throw new Error(`${name}: no audio`);
  mkdirSync('public/sfx/vo', { recursive: true });
  const raw = `/tmp/lastcall-vo-${name}.pcm`;
  writeFileSync(raw, Buffer.concat(chunks));
  // 24 kHz mono PCM in; trim silence, normalise, mp3 out.
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', raw,
    '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-14:TP=-1',
    '-ar', '44100', '-c:a', 'libmp3lame', '-q:a', '5', `public/sfx/vo/${name}.mp3`]);
  console.log(name, JSON.stringify(transcript.trim()));
}

const want = process.argv.slice(2);
const todo = LINES.filter(l => !want.length || want.includes(l[0]));
for (let i = 0; i < todo.length; i += 4) await Promise.all(todo.slice(i, i + 4).map(speak));
