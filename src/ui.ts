// Title card, first-time tips, pause menu, results screen and the FPS readout. Settings are kept
// per browser in localStorage when it's available.
import { TUNING as T } from './sim/tuning';
import { World, counterable, counterWindow, deflectable } from './sim/world';
import { CAST } from './render';

export interface Settings { music: number; sfx: number; voice: number; difficulty: number; quality: 'auto' | 'high' | 'low'; fps: boolean }
const DEFAULTS: Settings = { music: 1, sfx: 1, voice: 1, difficulty: 1, quality: 'auto', fps: false };

export function loadSettings(): Settings {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('lastcall-settings') ?? '{}') }; } catch { return { ...DEFAULTS }; }
}
export function saveSettings(s: Settings) {
  try { localStorage.setItem('lastcall-settings', JSON.stringify(s)); } catch { /* storage blocked: settings last this visit */ }
}

const el = (id: string) => document.getElementById(id)!;

// ----- Title card --------------------------------------------------------------------------

export function showTitle(s: Settings, guest: boolean) {
  const t = el('title');
  t.hidden = false;
  t.innerHTML = guest ? '' : `
    <h1>LAST CALL</h1>
    <p class="sub">Two friends. One bar. Every frat on Kirkwood wants a piece.</p>
    <div class="cols">
      <table>
        <tr><th></th><th>Gamepad</th><th>Keyboard</th></tr>
        <tr><td>Attack</td><td>X</td><td>J</td></tr>
        <tr><td>Counter <span class="dot y"></span></td><td>Y</td><td>K</td></tr>
        <tr><td>Dodge <span class="dot r"></span></td><td>A</td><td>Space</td></tr>
        <tr><td>Bottle</td><td>B</td><td>E</td></tr>
        <tr><td>Pause</td><td>Start</td><td>Esc</td></tr>
      </table>
      <ul>
        <li>Push toward an enemy and attack to lunge at him. Three hits knock him down.</li>
        <li>Third hit: pull back to sweep, or wait a beat to launch him, then juggle.</li>
        <li>Counter then attack: riposte. Dodge then attack: flying knee.</li>
        <li><b class="y">Yellow</b> over a head: counter. <b class="r">Red</b>: dodge, don't counter.</li>
        <li>Counter a flying red cup to send it back.</li>
        <li>Knock them into tables, the fence or the bar for a SLAM.</li>
        <li>Second player: press any button on another controller, or the arrow keys.</li>
      </ul>
    </div>
    <p class="diff">Difficulty: ${T.difficulty.map((d, i) => `<span class="${i === s.difficulty ? 'on' : ''}" data-d="${i}">${d.name}</span>`).join(' ')}
      <small>← → or 1 2 3</small></p>
    <p class="go">Click, then press <b>Start</b> / <b>Enter</b> to fight · <b>O</b> / <b>Select</b> to play online</p>`;
}
export function hideTitle() { el('title').hidden = true; }
export function setTitleDifficulty(d: number) {
  el('title').querySelectorAll<HTMLElement>('.diff span').forEach(sp => sp.classList.toggle('on', Number(sp.dataset.d) === d));
}

// ----- Tips: each shown once per visit, the first time it's relevant ------------------------

const shownTips = new Set<string>();
let tipUntil = 0;
function tip(key: string, html: string, now: number) {
  if (shownTips.has(key) || now < tipUntil) return;
  shownTips.add(key);
  const t = el('tip');
  t.innerHTML = html; t.classList.add('on');
  tipUntil = now + 4200;
  setTimeout(() => t.classList.remove('on'), 4000);
}

export function tips(w: World, pad: boolean) {
  const now = performance.now();
  const k = (padKey: string, keyKey: string) => `<b>${pad ? padKey : keyKey}</b>`;
  if (w.enemies.some(e => w.players.some(p => counterable(p, e, counterWindow(w)))))
    tip('counter', `<span class="dot y"></span> Yellow over his head: press ${k('Y', 'K')} now to counter`, now);
  if (w.enemies.some(e => e.unblockable && e.state === 'windup'))
    tip('dodge', `<span class="dot r"></span> Red means you can't counter it: ${k('A', 'Space')} to dodge out of the way`, now);
  if (w.cups.some(c => w.players.some(p => deflectable(p, c))))
    tip('cup', `Incoming cup: ${k('Y', 'K')} knocks it back at him`, now);
  if (w.enemies.some(e => e.unblockable && e.state === 'windup' && T.attacks[e.attack].lunge > 0))
    tip('lunge', `<span class="dot r"></span> He's about to lunge: ${k('A', 'Space')} to the side so he flies past`, now);
  if (w.players.some(p => p.combo === 2 && p.state === 'attack'))
    tip('finish', `Third hit: ${k('X', 'J')} kicks him away · pull back + ${k('X', 'J')} sweeps · wait a beat, then ${k('X', 'J')} launches`, now);
  if (w.enemies.some(e => e.state === 'air'))
    tip('juggle', `He's in the air: ${k('X', 'J')} ${k('X', 'J')} ${k('X', 'J')} to juggle and spike him`, now);
  if (w.players.some(p => p.state === 'counter' && p.t < 4) && shownTips.has('counter'))
    tip('riposte', `Countered: hit ${k('X', 'J')} right away for a riposte that launches`, now);
  if (w.players.some(p => p.state === 'dodge') && shownTips.has('dodge'))
    tip('knee', `Dodge then ${k('X', 'J')}: a flying knee that reaches further`, now);
  if (w.enemies.some(e => e.state === 'down' && e.t > 20 && w.players.some(p => Math.hypot(p.pos.x - e.pos.x, p.pos.y - e.pos.y) < 2)))
    tip('stomp', `${k('X', 'J')} on a man who's down to stomp him`, now);
  if (w.players.some(p => p.state === 'down') && w.players.length > 1)
    tip('revive', 'Stand next to your partner to get them back up', now);
  if (w.bottles.some(b => b.state === 'ground' && w.players.some(p => Math.hypot(p.pos.x - b.pos.x, p.pos.y - b.pos.y) < 1.8)))
    tip('bottle', `Bottle: ${k('B', 'E')} to grab, ${k('B', 'E')} again to throw, or attack to smash it over a head`, now);
}

// ----- Pause menu --------------------------------------------------------------------------

export interface MenuActions { resume(): void; restart(): void; change(s: Settings): void }

export function openMenu(s: Settings, online: 'host' | 'guest' | null, a: MenuActions) {
  const m = el('menu');
  const slider = (key: 'music' | 'sfx' | 'voice', label: string) =>
    `<label>${label}<input type="range" id="vol-${key}" min="0" max="1" step="0.05" value="${s[key]}"></label>`;
  m.innerHTML = `
    <h2>PAUSED</h2>
    ${online === 'guest' ? '<p class="note">Online: the fight keeps going while this is open.</p>' : ''}
    ${online === 'host' ? '<p class="note">George\'s game is paused too.</p>' : ''}
    <div class="buttons">
      <button id="m-resume">Resume</button>
      ${online === 'guest' ? '' : '<button id="m-restart">Restart fight</button>'}
    </div>
    ${slider('music', 'Music')}${slider('sfx', 'Sounds')}${slider('voice', 'Voices')}
    <label>Difficulty <select id="m-diff">${T.difficulty.map((d, i) => `<option value="${i}" ${i === s.difficulty ? 'selected' : ''}>${d.name}</option>`).join('')}</select>
      <small>from the next fight</small></label>
    <label>Graphics <select id="m-quality">${(['auto', 'high', 'low'] as const).map(q => `<option ${q === s.quality ? 'selected' : ''}>${q}</option>`).join('')}</select></label>
    <label class="check"><input type="checkbox" id="m-fps" ${s.fps ? 'checked' : ''}> Show frame rate (F)</label>
    <p class="note">Start / Esc to resume</p>`;
  m.hidden = false;
  const update = () => {
    a.change({
      ...s,
      music: +(el('vol-music') as HTMLInputElement).value, sfx: +(el('vol-sfx') as HTMLInputElement).value,
      voice: +(el('vol-voice') as HTMLInputElement).value, difficulty: +(el('m-diff') as HTMLSelectElement).value,
      quality: (el('m-quality') as HTMLSelectElement).value as Settings['quality'], fps: (el('m-fps') as HTMLInputElement).checked,
    });
  };
  m.querySelectorAll('input, select').forEach(i => i.addEventListener('input', update));
  el('m-resume').addEventListener('click', a.resume);
  document.getElementById('m-restart')?.addEventListener('click', a.restart);
}
export function closeMenu() { el('menu').hidden = true; }

// ----- Results -----------------------------------------------------------------------------

export function showResults(w: World) {
  const r = el('results');
  const secs = Math.round(w.frame / T.fps);
  const time = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const cols = w.players.map((p, i) => {
    const s = w.stats[i];
    const worst = Object.entries(s.takenBy).sort((a, b) => b[1] - a[1])[0];
    return `<div class="col" style="--c:${CAST[i].css}">
      <h3>${CAST[i].name}</h3>
      <dl>
        <dt>Damage dealt</dt><dd>${s.dealt}</dd>
        <dt>Knockouts</dt><dd>${s.kos}</dd>
        <dt>Counters</dt><dd>${s.counters}</dd>
        <dt>Cups returned</dt><dd>${s.deflects}</dd>
        <dt>Slams</dt><dd>${s.slams}</dd>
        <dt>Damage taken</dt><dd>${s.taken}</dd>
        <dt>Best combo</dt><dd>${s.bestCombo}</dd>
        <dt>Launches</dt><dd>${s.launches}</dd>
        <dt>Counters missed</dt><dd>${s.missedCounters}</dd>
        <dt>Counter whiffs</dt><dd>${s.whiffs}</dd>
        <dt>Times down</dt><dd>${s.downs}</dd>
      </dl>
      ${worst ? `<p class="worst">Hurt most by ${worst[0]} (${worst[1]})</p>` : ''}
    </div>`;
  }).join('');
  const title = w.result === 'win' ? "LAST CALL" : 'KNOCKED OUT';
  const sub = w.result === 'win' ? "Kilroy's is yours" : `Made it to round ${w.wave + 1} of ${T.waves.length}`;
  r.innerHTML = `<h2>${title}</h2><p class="sub">${sub} · ${time} · ${T.difficulty[w.difficulty].name}</p>
    <div class="cols">${cols}</div><p class="go">Start / Enter to fight again</p>`;
  r.hidden = false;
}
export function hideResults() { el('results').hidden = true; }

// ----- Frame rate --------------------------------------------------------------------------

export class Fps {
  private frames = 0;
  private since = performance.now();
  value = 60;
  tick(show: boolean) {
    this.frames++;
    const now = performance.now();
    if (now - this.since >= 1000) {
      this.value = this.frames * 1000 / (now - this.since);
      this.frames = 0; this.since = now;
      const f = el('fps');
      f.hidden = !show;
      f.textContent = `${Math.round(this.value)} fps`;
      return true;
    }
    return false;
  }
}
