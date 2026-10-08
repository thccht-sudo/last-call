# Last Call

Two friends, one bar, everyone wants a fight. A co-op brawler built by AI. Right now: single player,
two waves, out front of Kilroy's on Kirkwood (502 E Kirkwood Ave, Bloomington) at night.

Play: https://thccht-sudo.github.io/last-call/

| | Gamepad | Keyboard |
|---|---|---|
| Move | Left stick | WASD |
| Attack (locks onto the enemy you push toward) | X | J |
| Counter (yellow prompt) | Y | K |
| Dodge (red prompt: heavies can't be countered) | A | Space |
| Grab / throw bottle | B | E |
| Start / restart | Start | Enter |

`npm install && npm run dev` to run locally. `npm test` runs the fight simulation headless,
including a bot that has to clear the bar. All feel numbers live in `src/sim/tuning.ts`; the
level layout (patio, fence, tables, lamppost, spawns) in `src/sim/level.ts`, and its look in
`src/scene/kilroys.ts`.
