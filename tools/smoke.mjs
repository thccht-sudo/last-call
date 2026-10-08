// Plays the deployed game for a few seconds and fails on anything broken.
// Usage: node tools/smoke.mjs <url> [expected-asset] [screenshot.png]
// With an expected asset (e.g. assets/index-abc.js) it first waits for that build to go live.
import { chromium } from 'playwright';

const [url, asset, shot = 'smoke.png'] = process.argv.slice(2);
const fail = (msg) => { console.error(`SMOKE FAIL: ${msg}`); process.exit(1); };

if (asset) {
  const deadline = Date.now() + 10 * 60_000;
  for (;;) {
    const html = await fetch(url, { cache: 'no-store' }).then(r => r.text()).catch(() => '');
    if (html.includes(asset)) break;
    if (Date.now() > deadline) fail(`${asset} not live at ${url} after 10 minutes`);
    await new Promise(r => setTimeout(r, 15_000));
  }
}

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => m.type() === 'error' && errors.push(m.text()));
page.on('response', r => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));

await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.game?.world, null, { timeout: 30_000 }).catch(() => fail('game never booted'));
await page.mouse.click(640, 360);
for (let i = 0; i < 20 && !(await page.evaluate(() => window.game.controls.slots.length)); i++) {
  await page.keyboard.down('Enter'); await page.waitForTimeout(300); await page.keyboard.up('Enter');
}
for (let i = 0; i < 20 && (await page.evaluate(() => window.game.world.players.length)) < 2; i++) {
  await page.keyboard.down('Numpad1'); await page.waitForTimeout(300); await page.keyboard.up('Numpad1');
}
await page.waitForFunction(() => window.game.world.enemies.length > 0, null, { timeout: 60_000 }).catch(() => fail('no enemies spawned'));
await page.keyboard.down('KeyD'); await page.waitForTimeout(800); await page.keyboard.up('KeyD');
await page.keyboard.press('KeyJ');
await page.waitForTimeout(1500);
const state = await page.evaluate(() => {
  const w = window.game.world;
  return { frame: w.frame, players: w.players.length, enemies: w.enemies.length, wave: w.wave, result: w.result };
});
await page.screenshot({ path: shot });
await browser.close();

if (state.players !== 2) fail(`expected 2 players, got ${state.players}`);
if (state.frame < 60) fail(`simulation barely ran (${state.frame} frames)`);
if (errors.length) fail(errors.join('\n'));
console.log('SMOKE OK', JSON.stringify(state));
