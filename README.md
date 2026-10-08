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

`npm install && npm run dev` to run locally. `npm test` runs the fight simulation headless,
including a bot that has to clear the bar. All feel numbers live in `src/sim/tuning.ts`; the
level layout (patio, fence, tables, lamppost, spawns) in `src/sim/level.ts`, and its look in
`src/scene/kilroys.ts`.
