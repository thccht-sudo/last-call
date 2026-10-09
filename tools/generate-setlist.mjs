// The Hold Ready's setlist for the endless mode: a parody of a wordy, piano-and-twin-guitar
// American bar band whose frontman doesn't really sing: he just talks over the music, telling
// long stories, while the band and crowd shout the choruses back. Each song is generated with
// Lyria 3 through OpenRouter from the prompt that made the one take a listener approved.
// Usage: OPENROUTER_API_KEY=... node tools/generate-setlist.mjs [set2 set3 ...]
// Writes public/music/<name>.mp3 and prints each take's verdicts. Not part of the build.
// Lyria refuses prompts that name real artists, so the style is described, never named.
//
// What we learned checking takes: no automatic check could hear the difference that matters.
// An audio model's absolute "does this sound like the band" score rated takes the listener
// rejected 10/10; comparing against the approved take (tools/match-vocal.mjs, used below) turns
// away obvious singing but also passed a rejected take; the share of held notes in the
// separated vocal didn't separate them either. So the check here is only a coarse filter:
// every take that goes into the game is picked by ear.
import { mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { lyria } from './lyria.mjs';
import { matchVocal } from './match-vocal.mjs';

// The approved take ("Stay Ready", set1) came from exactly this prompt, after rounds of
// listening: "beat poet vocals" got closest, the thin nasal voice description kept him from
// sounding like a gravelly rock singer, and the unhurried, conversational pacing is what
// stopped him singing. TALK adds the listener's own description of the target.
const CORE = 'Beat poet vocals over indie rock: the frontman does not sing the verses, he tells the story out loud like a guy at the end of the bar, in rhythm with the band.';
const PACE = 'He is unhurried and conversational, almost casual at first, words landing a little behind the beat, then gets more and more worked up until he is shouting by the chorus.';
const TALK = 'He basically just talks in his ordinary speaking voice, like a singer who stops singing and simply talks to the crowd over the music.';
const TIMBRE = 'His voice is thin, nasal, reedy and a little hoarse, a nerdy excitable everyman with a flat Minnesota accent: not gravelly, not raspy, not deep, not a rock-star voice, not a trained singer.';
const BAND = 'Loud, loose 2000s indie rock bar band recorded live in a sweaty club: two crunchy overdriven guitars with big classic-rock riffs, ' +
  'pounding barroom piano and Hammond organ, driving drums, the whole band shouting the choruses. No horns, no synths, no country.';

const V = '[Verse: spoken word]', C = '[Chorus: gang vocals, shouted]', B = '[Bridge: spoken word]';

// Titles must match TRACKS in src/setlist.ts. Recurring cast, as the band likes: Kevin from the
// message board (412 shows), Denise who works the merch table, Big Dave in the Oakleys.
export const SONGS = {
  set1: { title: 'Stay Ready', bpm: 132, lyrics: `${V}
We pulled in off the Kennedy at seven with the van still smoking
Kevin from the message board was waiting at the loading dock and he was not joking
He said he's seen us four hundred and twelve times, he's got every setlist in a binder
He said the new stuff's fine but the old stuff's better, and the old stuff's a little kinder
${C}
Stay ready! Whoa-oh! Stay ready! Whoa-oh!
The night's not over till we say so
${V}
There were uncles in the pit in cargo shorts with wraparounds pushed up on their foreheads
They were throwing tallboys at the kids and talking about the shows back when the scene was better instead
And the curfew was eleven but the curfew is a rumor that the promoters like to spread
We played the one about Elston Avenue three times and then we played it once again instead
${C}
Stay ready! Whoa-oh! Stay ready! Whoa-oh!
The night's not over till we say so` },

  set2: { title: 'Endless Nights', bpm: 136, lyrics: `${V}
It was one of those endless nights under the Salt Shed lights, the doors said seven-thirty and it's two a.m. tonight
Denise at the merch table sold out of the larges and the mediums and the hoodies and the pins
She said the guy in cargo shorts keeps asking if we're gonna play the old one, I said honey we just did, and we'll play it again
${C}
Whoa-oh, endless nights! We never say goodnight
Whoa-oh, endless nights! Leave on the house lights
${V}
The bartender called a cab at midnight and the cab is still outside with the meter running
The drummer's on his second wind, the bass player's on his fourth, and the keyboard player's got a moustache and he's humming
And somebody's dad got baptized in a puddle of light beer by the soundboard and he came up singing
${C}
Whoa-oh, endless nights! We never say goodnight
Whoa-oh, endless nights! Leave on the house lights` },

  set3: { title: 'One More Song', bpm: 140, lyrics: `${V}
We said thank you and goodnight at a quarter after twelve and we got halfway to the van
Then the drummer heard the crowd still chanting from the parking lot and the drummer is a sentimental man
So we came back out in our coats and the roadies started crying and the merch guy's out of black
And the promoter's looking at his watch like a watch has ever held this band back
${C}
One more song! Whoa-oh! Nobody's going home!
One more song! Whoa-oh! We play until the dawn!
${V}
Big Dave lost his wraparounds in the pit around eleven and he found them around three
He's been leaning on the barricade since the opener and he swears this one's about him, it's actually about me
And there's a kid on his shoulders who was not born when we wrote it, singing every single word
And there's a curfew somewhere in this city, but it's nothing anybody here has heard
${C}
One more song! Whoa-oh! Nobody's going home!
One more song! Whoa-oh! We play until the dawn!
[Outro: chanted by the crowd]
One more! One more! One more! One more!` },

  set4: { title: 'Kevin from the Message Board', bpm: 138, lyrics: `${V}
Kevin from the message board has a ponytail and a lanyard and a laminated pass that doesn't work
He's got a spreadsheet of the setlists going back to two thousand four and he color codes the encores, he's kind of a jerk
He told me that the bridge on the second record is the most important bridge in Minnesota rock
I said Kevin we're from Brooklyn, Kevin, he said that's not what the message board thought
${C}
Kevin! Whoa-oh! He was there the first night!
Kevin! Whoa-oh! He'll be there the last night!
${B}
And when the lights came up in Milwaukee he was crying by the coat check
And when the lights came up in Cleveland he was crying by the coat check
And the lights don't come up anymore, Kevin, the lights don't ever come up anymore
${C}
Kevin! Whoa-oh! He was there the first night!
Kevin! Whoa-oh! He'll be there the last night!` },

  set5: { title: 'Cargo Shorts Kids', bpm: 135, lyrics: `${V}
They used to be the kids in the basement shows in Uptown with the bleach in their hair
Now they're forty-five with fanny packs and frosted tips and a Bluetooth in their ear that nobody calls
They park the minivan on Elston and they tell you that they saw us at the Metro when the floor was sticky and the drinks were cheap
They tuck their polos in, they cinch their braided belts, they wear their white socks pulled up high
${C}
Cargo shorts kids! Whoa-oh! They never left the scene!
Cargo shorts kids! Whoa-oh! Forty-five and seventeen!
${V}
And they'll throw a beer cup at the opener and they'll throw a punch at you
'Cause you're standing in their spot and that's the spot they've stood in since two thousand two
And their backs are shot and their knees are shot and their wives are in the car
But they'll stay until the encore 'cause the encore never ends, and that's the whole point of the band
${C}
Cargo shorts kids! Whoa-oh! They never left the scene!
Cargo shorts kids! Whoa-oh! Forty-five and seventeen!` },

  set6: { title: 'Baptized in the Chicago River', bpm: 120, lyrics: `${V}
She got baptized in the Chicago River on Saint Patrick's Day when it was green
She said it doesn't count, I said it counts if you believe it, and you've got to believe in something if you're gonna be seen
She had a rosary from her grandma and a ticket stub from a show that ran six hours long
She said the priest did a reading from the gospel and the band did a reading from a song
${C}
Whoa-oh, come up singing! Whoa-oh, come up clean!
Get yourself baptized in the river when the river's green!
${B}
And the organ came in like a choir in a parking lot
And the guitars came in like the cops
And she said lord, if this is heaven, then heaven's got a really long set
${C}
Whoa-oh, come up singing! Whoa-oh, come up clean!
Get yourself baptized in the river when the river's green!` },

  set7: { title: 'Curfew Is a Rumor', bpm: 136, lyrics: `${V}
The promoter came backstage at ten fifty-nine with a clipboard and a lanyard and a frown
He said the city has a curfew and the neighbors on Elston have a curfew and the cops are coming down
I said a curfew is a rumor that the parents tell the kids to get them home before it's late
And we've been late since nineteen ninety-nine, so tell the city it can wait
${C}
Curfew is a rumor! Whoa-oh! Nobody here believes it!
Curfew is a rumor! Whoa-oh! If you're tired you can leave it!
${V}
Now the promoter's in the pit at two a.m. with his necktie tied around his head
And the guy the city sent to shut us down is doing shots at the bar with Denise instead
And the sun is coming up over the Kennedy and the salt pile out back is turning pink
And Kevin from the message board says this is only the second set, I think
${C}
Curfew is a rumor! Whoa-oh! Nobody here believes it!
Curfew is a rumor! Whoa-oh! If you're tired you can leave it!` },

  set8: { title: 'Denise Works the Merch', bpm: 140, lyrics: `${V}
Denise works the merch, she's got a cash box and a card reader and a marker behind her ear
She's sold a thousand tour shirts and she's sold them all to Kevin, he buys one every year
She knows the setlist better than the band does, she knows when to take a break
She knows the guy in the flame shirt's gonna start a fight around the eighteenth song for old times' sake
${C}
Denise! Denise! Whoa-oh! She knows how it ends!
Denise! Denise! Whoa-oh! It never ends!
${V}
And she said the vinyl's forty dollars and the hoodie is sixty-five
And she said the band's been playing so long now that the hoodies came back into style
And she said if you're looking for the exit, honey, there's an exit by the bar
But nobody's ever used it, and nobody knows where the exits are
${C}
Denise! Denise! Whoa-oh! She knows how it ends!
Denise! Denise! Whoa-oh! It never ends!` },

  set9: { title: 'Blue Line at Sunrise', bpm: 118, lyrics: `${V}
We came out on Elston when the Blue Line started running and the sky was the color of a bruise
The bass player's wife called twice, the drummer's on his ninth pair of shoes
And the kids we used to be were on the platform with their headphones in, heading home to sleep
And the uncles we became were in the parking lot, still arguing about the deep cuts we didn't play
${C}
Whoa-oh, Blue Line at sunrise! Whoa-oh, we're still not done!
Whoa-oh, Blue Line at sunrise! Turn around, there's one more song!
${B}
And she said do you ever think about stopping
And I said all the time
And then the drummer counted off another one
${C}
Whoa-oh, Blue Line at sunrise! Whoa-oh, we're still not done!
Whoa-oh, Blue Line at sunrise! Turn around, there's one more song!` },

  set10: { title: 'Four Hundred and Twelve', bpm: 138, lyrics: `${V}
The OG Fan is standing in the second row with a laminate from two thousand five
He's got a tattoo of our first van on his calf and the van is still alive
He's seen four hundred and twelve shows and he remembers every encore, every spill, every fight
He said boys you're getting slower and I said Gary, we've been playing since last night
${C}
Four hundred and twelve! Whoa-oh! He's never missed a show!
Four hundred and thirteen! Whoa-oh! He's never gonna go!
${V}
And he threw a hook at a kid who tried to stand in his spot by the monitor
He said this is a church and that kid is a sinner and I'm the bishop of the barricade, I'm the monitor
And security tried to move him but security's been here since Thursday too
And they all just raised their lighters and they sang the chorus, what else are they gonna do
${C}
Four hundred and twelve! Whoa-oh! He's never missed a show!
Four hundred and thirteen! Whoa-oh! He's never gonna go!` },
};

export const promptFor = s => `${CORE} ${PACE} ${TALK} ${TIMBRE} ${BAND} A song called "${s.title}", ${s.bpm} BPM. Lyrics:\n${s.lyrics}`;

export const REFERENCE = 'public/music/set1.mp3';
// Kept when he talks like the reference: two of three listens agree, and the voice is close.
const PASS = j => j.talks >= 7 && j.voice >= 6 && j.sings <= 1;
const score = j => j.talks * 2 + j.voice - j.sings * 3;
const TRIES = 6;
// One listen is noisy, so each take is compared three times and kept on the medians.
async function listen(file) {
  const runs = (await Promise.allSettled([1, 2, 3].map(() => matchVocal(REFERENCE, file)))).filter(r => r.status === 'fulfilled').map(r => r.value);
  if (!runs.length) throw new Error('judge failed');
  const median = k => { const v = runs.map(r => Number(r[k]) || 0).sort((a, b) => a - b); return v[Math.floor((v.length - 1) / 2)]; };
  return { talks: median('talks_like_reference'), voice: median('voice_like_reference'), sings: runs.filter(r => r.sings_in_verses).length, listens: runs.map(r => r.talks_like_reference), notes: runs[0].notes };
}

async function make(name) {
  const song = SONGS[name];
  mkdirSync('public/music', { recursive: true });
  // The song already on disk is the take to beat: a rerun never makes it worse.
  const current = `public/music/${name}.mp3`;
  let best = null;
  if (existsSync(current)) {
    try {
      best = { take: current, j: await listen(current) };
      console.log(`${name} current: talks ${best.j.talks} (${best.j.listens}) voice ${best.j.voice} sings ${best.j.sings}/3`);
    } catch { /* judge unavailable: the first new take to pass replaces it */ }
    if (best && PASS(best.j)) { console.log(`${name}: current take already passes`); return; }
  }
  for (let t = 1; t <= TRIES; t++) {
    const take = `public/music/.${name}-take${t}.mp3`;
    try {
      // Lyria sometimes streams the lyrics back with no audio; that's a retry, not a take.
      for (let attempt = 1; ; attempt++) {
        try { await lyria('google/lyria-3-pro-preview', promptFor(song), take); break; }
        catch (e) { if (attempt >= 4) throw e; await new Promise(r => setTimeout(r, 15000 * attempt)); }
      }
      const j = await listen(take);
      console.log(`${name} take ${t}: talks ${j.talks} (${j.listens}) voice ${j.voice} sings ${j.sings}/3 · ${j.notes}`);
      if (!best || score(j) > score(best.j)) best = { take, j };
      if (PASS(j)) break;
    } catch (e) { console.log(`${name} take ${t}: failed ${String(e.message ?? e).slice(0, 200)}`); }
  }
  if (best && best.take !== current) copyFileSync(best.take, current);
  for (let t = 1; t <= TRIES; t++) rmSync(`public/music/.${name}-take${t}.mp3`, { force: true });
  if (!best) { console.log(`${name}: no usable take`); return; }
  console.log(`${name} KEPT ${best.take === current ? 'the current take' : 'a new take'} (${PASS(best.j) ? 'pass' : 'best so far'}): ${JSON.stringify(best.j)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // set1 is the reference itself, so it's never regenerated from here.
  const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SONGS).filter(n => n !== 'set1');
  // One at a time: in parallel Lyria starts returning songs with no audio.
  for (const name of names) await make(name);
}
