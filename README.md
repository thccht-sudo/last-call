# Last Call

Two friends, one bar, everyone wants a fight. A co-op brawler built by AI. Right now: single player,
two waves, out front of Kilroy's on Kirkwood (502 E Kirkwood Ave, Bloomington) at night.

Play: https://thccht-sudo.github.io/last-call/

Player 1 is Conrad, player 2 is George. The first controller (or keyboard layout) to press a
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
| Grab / throw bottle | B | E | Numpad 3 or ' |
| Start / restart | Start | Enter | Numpad Enter |

The opposition wears IU fraternity shirts (FIJI, ATO, Beta, Sigma Chi, Phi Delt, Kappa Sig);
the big ones are always FIJI. Three rounds:

1. Three brawlers. Learn to counter (yellow prompt) and chain the three-hit string.
2. Brawlers plus a cup thrower (counter a flying red cup to send it back) and a grappler (red
   prompt: dodge; if he catches you, mash any button, or have your partner hit him).
3. The FIJI President: two counterable swings then an unblockable haymaker, super armour, and
   backup at half health. Knock anyone into a table, the fence or a wall for a SLAM.

Music: three straight-synthwave tracks (title, fight, final round) generated with Google Lyria 3
through OpenRouter by `tools/generate-music.mjs`, crossfaded by game state. M mutes.

Animation: jointed mannequins posed from motion capture. Punches, the kick, the overhead smash,
walks and the frat swagger are real mocap from the Bandai Namco Research Motion Dataset,
retimed onto each move's frame data by `src/anim/moves.ts`, so tuning a move's startup, active
or recovery frames retimes its animation too. Rolls, hit reactions, knockdowns and grabs are
procedural poses built with IK. `npm run dev` then open `/strip.html?move=jab` (or kick,
dodge, haymaker, grapple, knockdown...) to see any move as a row of stills.
`tools/bake-mocap.mjs` re-bakes the clips listed in `tools/mocap-clips.txt`.

`npm install && npm run dev` to run locally. After each deploy CI plays the live site with
`tools/smoke.mjs` and keeps a screenshot as a run artifact. `npm test` runs the fight simulation headless,
including a bot that has to clear the bar. All feel numbers live in `src/sim/tuning.ts`; the
level layout (patio, fence, tables, lamppost, spawns) in `src/sim/level.ts`, and its look in
`src/scene/kilroys.ts`.

## Credits

Motion capture: [Bandai Namco Research Motion Dataset](https://github.com/BandaiNamcoResearchInc/Bandai-Namco-Research-Motiondataset)
by Bandai Namco Research Inc., licensed [CC BY-NC 4.0](src/anim/MOCAP-LICENSE.txt), retargeted
and retimed for this game. Because of that license, this game is and stays non-commercial.
Music generated with Google Lyria 3. Everything else built by Claude.
