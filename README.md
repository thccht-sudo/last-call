# Last Call

Two friends, one bar, everyone wants a fight. A co-op brawler built by AI: two rounds out front of
Kilroy's on Kirkwood (502 E Kirkwood Ave, Bloomington) at night, then the final round inside.
The interior follows what's published (long straight bar, high-tops, raised booths, dance floor,
stairs, the Polaroid wall); the exact floor plan isn't public, so placement is a best guess.

Play: https://thccht-sudo.github.io/last-call/

The title card shows the controls and picks Easy, Normal or Hard (enemy damage, counter window,
enemy health). Esc or Start pauses: restart, music / sounds / voices volume, difficulty,
graphics (auto drops shadows, then resolution, if the frame rate sags) and a frame-rate readout
(F). First-time tips explain counters, dodges, combos, cups, bottles and revives as they come up.
After each fight a results screen grades each player (S to D, from style earned per minute
less damage taken) and shows style, damage, knockouts, best combo, launches, perfect evades,
counters landed and missed, slams, and what hurt you most. The last knockout of each round plays in slow motion.

Player 1 is Conrad, player 2 is George.

Online: press O (or Select on a gamepad) to host. The game shows a link; send it to George.
Opening it joins as George from anywhere. Conrad's browser runs the fight and streams it to
George's over a direct WebRTC connection; PeerJS's free public broker only introduces the two
browsers. George's own moves arrive with the network delay between you.

Local: The first controller (or keyboard layout) to press a
button is Conrad; the next one to press anything joins as George, even mid-fight. Two players
get one extra thug per wave. A downed player gets back up if their partner stands next to them
for two seconds; the fight is lost only when both are down. Hitting an enemy your partner just
hit is a TAG TEAM hit for 1.5x damage, and you can counter a swing aimed at your partner.

| | Gamepad | Keyboard P1 | Keyboard P2 |
|---|---|---|---|
| Move | Left stick | WASD | Arrows |
| Attack (locks onto the enemy you push toward) | X | J | Numpad 1 or , |
| Counter (yellow prompt) | Y | K | Numpad 2 or . |
| Dodge (red prompt: heavies can't be countered) | A | Space | Numpad 0 or / |
| Pick up / throw bottle | B | E | Numpad 3 or ' |
| Start / restart | Start | Enter | Numpad Enter |

### Fighting

Attacks lock onto the enemy you push toward (or keep hitting the one you're on if you let go
of the stick) and close the gap: anyone within about 6 m gets a sprint-in strike, so a press
never falls short. Counter (Y) and dodge (A) cancel an attack at any point, and you can dodge
out of a hit stagger after a split second, so nothing locks you out for long.

| Combo | Input | What it does |
|---|---|---|
| Jab, cross, roundhouse | X X X | Third hit knocks him flying; near a table, fence, wall or the bar it steers him into it for a SLAM |
| Sweep | X X, pull the stick away, X | Drops him at your feet |
| Uppercut launcher | X X, wait a beat, X | Launches him into the air |
| Juggle and spike | X X X while he's in the air | Two punches keep him up, the third spikes him into the floor and the shockwave floors anyone close |
| Riposte | Y (counter) then X | Counters stagger every yellow swing in range at once; the riposte launches him |
| Flying knee | A (dodge) then X | Reaches further than a normal lunge, knocks down |
| Stomp | X next to a man on the floor | Extra damage, keeps him down a little longer |
| Bottle | B to pick up, B to throw, or X to smash it over a head | |

Enemy attacks glow **yellow** (counter with Y, round prompt) or **red** (can't be countered,
diamond prompt: dodge with A). A red attack is heard as a warning sting, and one coming from
off screen shows an arrow at the screen edge. Nothing grabs or holds you.

**Evade (A):** you keep facing the nearest threat and step relative to him: push across him
for a sidestep, away for a backstep, toward him (or with nobody near) for a dash; leave the
stick alone to step back. Most of the distance comes in the first few frames, and you slip
through the crowd while invulnerable. Dodge just before a swing aimed at you lands for a
**PERFECT** evade: a beat of slow motion, and the flying knee after it hits much harder.
Sidestep red lunges and let them fly past.

**Style meter:** under each health bar. Hits, counters, slams, perfect evades and knockouts
fill it; repeating the same move earns a third as much; it fades when you stop fighting and
drops a tier when you're hit. Tiers: TIPSY, BUZZED, ROWDY, WILD, LEGENDARY, LAST CALL.

The opposition wears IU fraternity shirts (FIJI, ATO, Beta, Sigma Chi, Phi Delt, Kappa Sig);
the big ones are always FIJI. Three rounds:

1. Three brawlers: hooks, front kicks and shoves, all yellow. Learn to counter and chain the string.
2. Brawlers plus a cup thrower (counter a flying red cup to send it back) and a kicker: quick
   yellow elbows and spinning kicks, and a red flying knee from range.
3. Inside Kilroy's: a heavy (red haymakers and a red shoulder charge), a thrower, and the FIJI
   President: hook, elbow, then a red haymaker (a red charge once he's enraged), super armour,
   and backup at half health.

### The Hold Ready (endless)

Pick **THE HOLD READY** on the title card (↑ ↓, the stick, or click) for the second mode: an
endless fight on the general-admission floor of the Salt Shed in Chicago (the old Morton Salt
warehouse under its timber A-frame) while The Hold Ready, a bar-band parody, play a show that
never ends. Every wave is a song (SONG 7 OF ∞ on the LED wall); between songs the frontman
talks, everyone standing gets a water (+25 health) and anyone down gets back up. Songs grow by a
man every other song (up to nine), more of them swing at once, and they get sturdier and hit a
little harder as the night goes on. Every fifth song is an encore led by the OG Fan (412 shows,
super armour, calls in the message-board guys at half health). It ends only when you're both
down; the results screen counts the songs you lasted and the title card keeps your best.

The opposition is chopped uncs: 45-year-olds dressed like it's 2004. Cargo shorts with white
socks pulled up and dad sneakers, tucked-in polos and oxfords with braided belts, old tour
shirts, flame shirts on the big ones, fanny packs, trucker caps, frosted tips, horseshoe hair,
mullets, goatees, wraparound shades pushed up on the head and the odd Bluetooth earpiece. Same
moves as the frats (hooks, kicks, cup throwers, dad-dancing spin kicks, heavies), new voices.
The setlist (Stay Ready, Endless Nights, One More Song) is shout-along bar-band rock with
piano and organ, played through in order, round and round; the composition of every song's
wave is fixed, so scores compare fairly. Tuning lives in `TUNING.concert`; the venue layout in
`CONCERT` in `src/sim/level.ts` and its look (stage, band, lights, crowd) in `src/scene/saltshed.ts`.

Music: three straight-synthwave tracks (title, fight, final round) generated with Google Lyria 3
through OpenRouter by `tools/generate-music.mjs`, crossfaded by game state, plus The Hold Ready's three songs (vocals and lyrics by Lyria from our prompts in the same script). M mutes.

Characters: modelled in Blender by `tools/build-characters.py` (run with the `bpy` module,
Blender 4.2: `pip install bpy==4.2.0` on Python 3.11, then `python tools/build-characters.py
src/anim/bodies.json`). Each body type (regular, heavy, lean) is clay built from metaball
capsules per clothing layer, meshed, decimated, smoothed and weighted to a 13-bone skeleton laid
along the 18 mocap joints. `src/figure.ts` aims each bone along its joints every frame (limb
twist from the elbow or knee bend) and skins the mesh, with toon shading, a rim light and an
ink outline that takes the yellow or red of a telegraph. Heads carry hair, beards, glasses,
backwards caps (half the thugs), the kicker's red headband and the President's shades and
chain. Players have a ring in their colour on the floor, and show through as a silhouette in
that colour when an enemy or a prop stands in front of them. The knocked out sink away after a
few seconds.

Animation: posed from motion capture. Punches, the kick, the overhead smash,
walks and the frat swagger are real mocap from the Bandai Namco Research Motion Dataset,
retimed onto each move's frame data by `src/anim/moves.ts`, so tuning a move's startup, active
or recovery frames retimes its animation too. The lunge's sprint-in is the mocap dash, and
the spike is a mocap two-handed swing. Uppercuts, sweeps, knees, stomps, elbows, shoves, the
charge, rolls, hit reactions, juggles and knockdowns are procedural poses built with IK on top
of the mocap guard. `npm run dev` then open `/strip.html?move=jab` (any player move by its
name in `src/sim/tuning.ts`, `e-` plus any enemy attack such as `e-flyingKnee`, or dodge,
counter, air, knockdown; `&lead=8` adds sprint-in frames) to see a move as a row of stills,
or `/strip.html?clip=dash&from=0&to=27` for raw baked frames.
`tools/bake-mocap.mjs` re-bakes the clips listed in `tools/mocap-clips.txt`.

Physics: the fight runs on a deterministic 60 Hz simulation (circles on a flat floor plus a
height for launched enemies, knockback, juggle gravity, slams into obstacles). Hits use frame
data: the locked target is hit anywhere within 2.1 m on the active frames, anyone else only
inside the move's reach and a cone in front. Hitstop freezes the attacker for 5 to 9 frames
by weight of hit and the victim 2 frames longer, rattling along the line of the blow; counters
and spikes freeze the whole fight. Launched enemies rise slower than they fall and hang at the
top. The renderer advances poses, ragdolls, props, effects and the camera once per sim tick
and interpolates between ticks, so it plays the same at any refresh rate and slow motion stays
smooth. The camera shakes by accumulated trauma (smoothed noise), kicks along each blow, punches
in its field of view on big hits, and pulls back in co-op when you're far apart. On top of that, purely for looks, `src/physics.ts` turns anyone knocked down
into a Verlet ragdoll launched along the hit (harder hits fly higher) that tumbles, drapes and
slumps against tables, the fence and the bar, and scatters loose props: stools, cans, cups, a
trash can and a traffic cone. Each browser runs its own copy, so it never affects the fight.

AI playtesting: `?manual` stops the game loop and exposes `game.advance(frames, input)`, so an
agent can look at a frame, decide and act. A council of AI playtesters (a first-time player, a
telegraph reader, a combo explorer, an art director and an evade tester) played it this way
from screenshots; their reports drove the readability fixes, and a second round of three
checked that the fixes landed (player marker, banners, lunge lanes, move words) and found the
last few (occlusion, stacked popups, bodies piling up).

`npm install && npm run dev` to run locally. After each deploy CI plays the live site with
`tools/smoke.mjs` and keeps a screenshot as a run artifact. `npm test` runs the fight simulation headless,
including a bot that has to clear the bar. All feel numbers live in `src/sim/tuning.ts`; the
level layout (patio, fence, tables, lamppost, spawns) in `src/sim/level.ts`, and its look in
`src/scene/kilroys.ts`.

## Credits

Motion capture: [Bandai Namco Research Motion Dataset](https://github.com/BandaiNamcoResearchInc/Bandai-Namco-Research-Motiondataset)
by Bandai Namco Research Inc., licensed [CC BY-NC 4.0](src/anim/MOCAP-LICENSE.txt), retargeted
and retimed for this game. Because of that license, this game is and stays non-commercial.
Music, punch and glass sounds, and street and bar ambience generated with Google Lyria 3; voice
lines performed by OpenAI's GPT audio; both through OpenRouter (`tools/generate-music.mjs`,
`tools/generate-voice.mjs`, `tools/slice-sfx.py`). Everything else built by Claude.
