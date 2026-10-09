// Kilroy's on Kirkwood, 502 E Kirkwood Ave, Bloomington. Two stages: out front at night, then
// inside the bar for the final round. Sim units are metres; x runs along the street, y toward
// the camera.
import type { Vec } from './world';

// 'post' obstacles (lampposts, high-tops) block bodies but not line of sight.
export interface Box { x: number; y: number; w: number; h: number; kind: 'table' | 'fence' | 'post' | 'planter' | 'bar' | 'booth' }

export interface Level {
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  playerStart: Vec;
  obstacles: Box[];
  nav: Vec[];
  bottleSpots: Vec[];
  spawns: { from: Vec; to: Vec }[];
}

// Out front: the building along the back edge, a fenced patio of picnic tables, the brick
// sidewalk, then Kirkwood Avenue.
export const LEVEL = {
  bounds: { minX: -9, maxX: 9, minY: -6, maxY: 4.2 },
  facadeY: -6,
  fenceY: -2.6,
  curbY: 2.6,
  door: { x: -6.6, y: -6 }, // the "502" entrance, left of the patio
  playerStart: { x: 0, y: 0.6 },

  obstacles: [
    // Picnic tables (table plus both benches).
    { x: -2.6, y: -4.4, w: 1.9, h: 1.5, kind: 'table' },
    { x: 0.6, y: -4.4, w: 1.9, h: 1.5, kind: 'table' },
    { x: 3.8, y: -4.4, w: 1.9, h: 1.5, kind: 'table' },
    { x: 7.0, y: -4.4, w: 1.9, h: 1.5, kind: 'table' },
    // Black iron patio fence with a gate gap at x 1.2..3.0.
    { x: -1.65, y: -2.6, w: 5.7, h: 0.12, kind: 'fence' },
    { x: 6.0, y: -2.6, w: 6.0, h: 0.12, kind: 'fence' },
    { x: -4.5, y: -4.3, w: 0.12, h: 3.4, kind: 'fence' },
    // Green lamppost and the double parking meter at the curb.
    { x: 2.0, y: 2.3, w: 0.3, h: 0.3, kind: 'post' },
    { x: 3.2, y: 2.3, w: 0.2, h: 0.2, kind: 'post' },
    { x: -5.5, y: 2.2, w: 1.2, h: 0.6, kind: 'planter' },
  ] as Box[],

  // Corners an enemy can steer through when the straight line is blocked.
  nav: [
    { x: 2.1, y: -2.6 }, { x: 2.1, y: -1.6 }, { x: 2.1, y: -3.1 },
    { x: -5.0, y: -2.2 }, { x: -5.1, y: -5.4 }, { x: -3.9, y: -2.0 },
    { x: -4.0, y: -3.1 }, { x: -1.0, y: -3.1 }, { x: 5.4, y: -3.1 }, { x: 8.5, y: -3.1 },
  ] as Vec[],

  bottleSpots: [{ x: -5.15, y: 2.2 }, { x: 7.0, y: -4.4 }] as Vec[],

  // Where each wave's enemies come from, and where they walk to before joining the fight.
  spawns: [
    { from: { x: -6.6, y: -5.6 }, to: { x: -6.6, y: -1.5 } }, // out the bar door
    { from: { x: -10, y: 3.5 }, to: { x: -6.5, y: 3.5 } }, // up Kirkwood from the west
    { from: { x: 10, y: 3.7 }, to: { x: 6.5, y: 3.7 } }, // from the Sample Gates side
  ],
};

// Inside. Sourced: a long narrow room with a long straight wooden bar running front to back,
// high-tops across the walkway, elevated booths, TVs, a dance floor, stairs up, wood floors,
// red brick, red pendant lights, and the wall of 21st-birthday Polaroids. Where each sits is
// a best guess: no floor plan is published.
export const INSIDE: Level = {
  bounds: { minX: -9, maxX: 9, minY: -6, maxY: 4.2 },
  playerStart: { x: 0, y: 2.6 },
  obstacles: [
    { x: -7.3, y: -0.9, w: 0.8, h: 7.4, kind: 'bar' }, // the main bar, along the west wall
    { x: 7.9, y: -3.6, w: 2.2, h: 1.6, kind: 'booth' }, // elevated booths along the east wall
    { x: 7.9, y: -1.2, w: 2.2, h: 1.6, kind: 'booth' },
    { x: 7.9, y: 1.2, w: 2.2, h: 1.6, kind: 'booth' },
    { x: 3.6, y: -5.4, w: 2.4, h: 1.0, kind: 'booth' }, // DJ booth at the back of the dance floor
    { x: -6.0, y: -5.3, w: 1.8, h: 1.2, kind: 'booth' }, // foot of the stairs
    { x: -4.4, y: -2.4, w: 0.7, h: 0.7, kind: 'post' }, // high-tops
    { x: -4.4, y: 0.6, w: 0.7, h: 0.7, kind: 'post' },
    { x: -2.0, y: -0.9, w: 0.7, h: 0.7, kind: 'post' },
    { x: -2.0, y: 2.3, w: 0.7, h: 0.7, kind: 'post' },
    { x: 4.4, y: 1.8, w: 0.7, h: 0.7, kind: 'post' },
  ],
  nav: [
    { x: 6.3, y: -2.4 }, { x: 6.3, y: 0 }, { x: 6.3, y: 2.4 }, { x: 6.3, y: -4.8 },
    { x: 2.0, y: -4.4 }, { x: 5.2, y: -4.4 }, { x: -4.6, y: -4.4 }, { x: -6.4, y: 3.6 }, { x: -6.4, y: -4.4 },
  ],
  bottleSpots: [{ x: -7.3, y: -2.2 }, { x: -7.3, y: 1.6 }],
  spawns: [
    { from: { x: 1.0, y: -6.4 }, to: { x: 1.0, y: -4.0 } }, // through the back doors from the patio
    { from: { x: -6.0, y: -4.6 }, to: { x: -4.8, y: -3.6 } }, // down the stairs
    { from: { x: 0.5, y: 4.8 }, to: { x: 0.5, y: 3.2 } }, // in the front door
  ],
};

// The Salt Shed, 1357 N Elston Ave, Chicago: the old Morton Salt warehouse, now a 3,600-capacity
// concert hall under a huge timber A-frame. The fight is on the general-admission floor: the
// stage and its crowd barricade along the back (the far edge), the bar down the west wall, the
// sound desk out on the floor, delay towers by the stage and a few high-tops. The rest of the
// crowd packs the east side; the grandstand that faces the stage is behind the camera.
export const CONCERT: Level = {
  bounds: { minX: -9, maxX: 9, minY: -4.4, maxY: 4.2 },
  playerStart: { x: 0, y: 1.0 },
  obstacles: [
    { x: -8.45, y: 0.6, w: 0.9, h: 5.6, kind: 'bar' }, // the bar, along the west wall
    { x: 4.4, y: 2.3, w: 2.4, h: 1.4, kind: 'booth' }, // front-of-house sound desk
    { x: -7.3, y: -4.15, w: 0.6, h: 0.6, kind: 'post' }, // delay towers either side of the stage
    { x: 7.3, y: -4.15, w: 0.6, h: 0.6, kind: 'post' },
    { x: -5.4, y: -1.2, w: 0.7, h: 0.7, kind: 'post' }, // high-tops
    { x: -5.4, y: 2.4, w: 0.7, h: 0.7, kind: 'post' },
    { x: 6.4, y: -1.4, w: 0.7, h: 0.7, kind: 'post' },
  ],
  nav: [
    { x: 2.8, y: 1.2 }, { x: 6.0, y: 1.2 }, { x: 2.8, y: 3.4 }, { x: 6.0, y: 3.4 },
    { x: -7.5, y: -2.6 }, { x: -7.5, y: 3.8 },
  ],
  bottleSpots: [{ x: -8.45, y: -1.0 }, { x: -8.45, y: 2.4 }],
  spawns: [
    { from: { x: -10.5, y: -3.4 }, to: { x: -6.4, y: -3.0 } }, // out of the crowd at the barricade, stage left
    { from: { x: 10.5, y: -2.6 }, to: { x: 6.6, y: -3.0 } }, // out of the crowd, stage right
    { from: { x: -1.5, y: 5.6 }, to: { x: -1.5, y: 3.4 } }, // down from the grandstand
    { from: { x: 10.5, y: 0.8 }, to: { x: 7.4, y: 0.4 } },
  ],
};

export const LEVELS: Level[] = [LEVEL, INSIDE, CONCERT];
export const CONCERT_STAGE = 2;

// The stage the simulation is currently stepping. step() sets it from the world before any
// movement, so every geometry query below answers for that world's stage.
let active: Level = LEVEL;
export function useStage(stage: number) { active = LEVELS[stage] ?? LEVEL; }
export const activeLevel = () => active;

const R = 0.05; // clearance for line-of-sight tests

function segHitsBox(a: Vec, b: Vec, o: Box, pad: number): boolean {
  const minX = o.x - o.w / 2 - pad, maxX = o.x + o.w / 2 + pad;
  const minY = o.y - o.h / 2 - pad, maxY = o.y + o.h / 2 + pad;
  let t0 = 0, t1 = 1;
  const dx = b.x - a.x, dy = b.y - a.y;
  for (const [p, q] of [[-dx, a.x - minX], [dx, maxX - a.x], [-dy, a.y - minY], [dy, maxY - a.y]]) {
    if (p === 0) { if (q < 0) return false; continue; }
    const r = q / p;
    if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; }
    else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return true;
}

export function clearLine(a: Vec, b: Vec, pad = 0.35): boolean {
  return !active.obstacles.some(o => o.kind !== 'post' && segHitsBox(a, b, o, pad - R));
}

// Where to walk next to reach `to`: straight there if nothing is in the way, else the first
// waypoint on the shortest path through the nav points.
export function steer(from: Vec, to: Vec): Vec {
  if (clearLine(from, to)) return to;
  const nodes = [from, ...active.nav, to];
  const n = nodes.length, goal = n - 1;
  const cost = new Array(n).fill(Infinity), prev = new Array(n).fill(-1), done = new Array(n).fill(false);
  cost[0] = 0;
  for (;;) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && cost[i] < Infinity && (u < 0 || cost[i] < cost[u])) u = i;
    if (u < 0 || u === goal) break;
    done[u] = true;
    for (let v = 0; v < n; v++) {
      if (done[v] || v === u) continue;
      const d = Math.hypot(nodes[v].x - nodes[u].x, nodes[v].y - nodes[u].y);
      if (cost[u] + d < cost[v] && clearLine(nodes[u], nodes[v])) { cost[v] = cost[u] + d; prev[v] = u; }
    }
  }
  if (prev[goal] < 0) return to;
  let v = goal;
  while (prev[v] !== 0) v = prev[v];
  return nodes[v];
}

// Push a circle out of every obstacle it overlaps.
export function collide(p: Vec, r: number) {
  for (const o of active.obstacles) {
    const hx = o.w / 2, hy = o.h / 2;
    const cx = Math.max(o.x - hx, Math.min(o.x + hx, p.x));
    const cy = Math.max(o.y - hy, Math.min(o.y + hy, p.y));
    const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy);
    if (d >= r) continue;
    if (d > 1e-6) { p.x = cx + dx / d * r; p.y = cy + dy / d * r; continue; }
    // Centre inside the box: leave by the nearest side.
    const left = p.x - (o.x - hx), right = o.x + hx - p.x, top = p.y - (o.y - hy), bottom = o.y + hy - p.y;
    const m = Math.min(left, right, top, bottom);
    if (m === left) p.x = o.x - hx - r; else if (m === right) p.x = o.x + hx + r;
    else if (m === top) p.y = o.y - hy - r; else p.y = o.y + hy + r;
  }
}

export function insideObstacle(p: Vec, pad = 0): boolean {
  return active.obstacles.some(o => Math.abs(p.x - o.x) < o.w / 2 + pad && Math.abs(p.y - o.y) < o.h / 2 + pad);
}
