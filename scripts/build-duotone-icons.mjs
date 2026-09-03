/*
  Builds src/data/icons-duotone.ts from a vendored copy of the Phosphor assets.

  Why a script and not hand-typed paths: every icon here is two layers — a solid
  base glyph and one accent element in a second colour — and the accent is not
  invented. It is a subpath that already exists inside Phosphor's `fill` glyph,
  where the detail (a clock hand, a check, one of two arrows) is cut out of the
  body. Extract that subpath, paint it over the body in the accent colour, and
  the cut-out becomes the accent, in exactly the right place, for free.

  The one obstacle is that SVG subpaths after the first often start with a
  relative `m`, which is meaningless on its own — it needs the point the
  previous subpath ended on. So this walks the path, tracks the current point
  through every command, and rewrites each subpath to start with an absolute M.
  That is the whole reason this file exists.

  Usage: node scripts/build-duotone-icons.mjs <phosphor-assets-dir>
*/
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/* Command letter -> how many numbers it takes, and which of them are coordinates. */
const ARITY = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

function tokenize(d) {
  const out = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/gi;
  let m;
  while ((m = re.exec(d))) out.push(m[1] ? { cmd: m[1] } : { num: parseFloat(m[2]) });
  return out;
}

/*
  Split into subpaths, each rewritten to begin with an absolute M. Everything
  after the opening move is passed through untouched — only the entry point
  needs fixing, and rewriting the rest would risk changing the shape.
*/
export function splitSubpaths(d) {
  const toks = tokenize(d);
  const subs = [];
  let cur = null; // { start: [x,y], body: string }
  let x = 0, y = 0, startX = 0, startY = 0;
  let i = 0, cmd = null;

  const push = () => { if (cur) subs.push(cur); };

  while (i < toks.length) {
    if (toks[i].cmd) { cmd = toks[i].cmd; i++; }
    const up = cmd.toUpperCase();
    const rel = cmd !== up;
    const n = ARITY[up];

    if (up === 'Z') {
      if (cur) cur.body += 'Z';
      x = startX; y = startY;
      continue;
    }

    const args = [];
    for (let k = 0; k < n; k++) { args.push(toks[i].num); i++; }

    if (up === 'M') {
      const nx = rel ? x + args[0] : args[0];
      const ny = rel ? y + args[1] : args[1];
      push();
      cur = { start: [nx, ny], body: '' };
      x = nx; y = ny; startX = nx; startY = ny;
      // an M with extra pairs means implicit L; keep them verbatim
      cmd = rel ? 'l' : 'L';
      continue;
    }

    cur.body += cmd + args.join(',');

    if (up === 'H') x = rel ? x + args[0] : args[0];
    else if (up === 'V') y = rel ? y + args[0] : args[0];
    else {
      const px = args[n - 2], py = args[n - 1];
      x = rel ? x + px : px;
      y = rel ? y + py : py;
    }
    // a repeated command without a new letter keeps the same letter
  }
  push();
  return subs.map((s) => `M${s.start[0]},${s.start[1]}${s.body}`);
}

/*
  Per icon: the Phosphor glyph that forms the solid base, and which of its
  subpaths is the accent. `accent: null` means the glyph has no usable cut-out
  and the accent is supplied explicitly instead.
*/
const ICONS = {
  // /product modules
  'data-intake':   { glyph: 'arrows-clockwise', accent: 1 },
  'holistic-view': { glyph: 'chart-pie-slice',  accent: 0 },
  'planning-tools':{ glyph: 'chart-bar',        accentFrom: 'duotone' },
  'crm':           { glyph: 'currency-dollar',  accentFrom: 'duotone' },
  'forms':         { glyph: 'note-pencil',      accentFrom: 'duotone' },
  'client-reports':{ glyph: 'file-text',        accent: 3 },
  'client-portal': { glyph: 'devices',          accent: 1 },
  'compliance':    { glyph: 'clipboard-text',   accent: 2 },

  // /solutions capabilities
  'portfolio-picture':   { glyph: 'stack',            accentFrom: 'duotone' },
  'fast-prep':           { glyph: 'clock',            accent: 1 },
  'clearinghouse-data':  { glyph: 'database',         accentFrom: 'duotone' },
  'exposures':           { glyph: 'magnifying-glass', accent: 0 },
  'alternatives':        { glyph: 'scales',           accentFrom: 'duotone' },
  'branded-report':      { glyph: 'file-text',        accent: 2 },
  'compliance-record':   { glyph: 'shield-check',     accent: 1 },
  'clearinghouse':       { glyph: 'plugs-connected',  accent: 4 },

  // Home pain cards
  'hourglass':     { glyph: 'hourglass',     accentFrom: 'regular', accent: 1 },
  'puzzle':        { glyph: 'puzzle-piece',  accentDraw: 'M228.7,140.2a24.7,24.7,0,1,1-49.4,0a24.7,24.7,0,1,1,49.4,0Z' },
  'check-circle':  { glyph: 'check-circle',  accent: 1 },
};

const ASSETS = process.argv[2];
if (!ASSETS) {
  console.error('usage: node scripts/build-duotone-icons.mjs <phosphor-assets-dir>');
  process.exit(1);
}

const pathsOf = (svg) =>
  [...svg.matchAll(/<path\b[^>]*d="([^"]+)"[^>]*\/>/g)].filter((p) => !/opacity="0\.2"/.test(p[0])).map((p) => p[1]);
const secondaryOf = (svg) => {
  const m = svg.match(/<path[^>]*opacity="0\.2"[^>]*\/>/);
  return m ? m[0].match(/d="([^"]+)"/)[1] : null;
};

const out = {};
for (const [key, spec] of Object.entries(ICONS)) {
  const fill = pathsOf(readFileSync(join(ASSETS, 'fill', `${spec.glyph}-fill.svg`), 'utf8')).join(' ');
  let accent;
  if (spec.accentDraw) {
    /* The only two drawn by hand, and only because the glyph offers nothing:
       puzzle-piece is a single path with no cut-out to borrow. */
    accent = spec.accentDraw;
  } else if (spec.accentFrom === 'duotone') {
    accent = secondaryOf(readFileSync(join(ASSETS, 'duotone', `${spec.glyph}-duotone.svg`), 'utf8'));
  } else if (spec.accentFrom === 'regular') {
    /* The regular weight draws interiors the fill weight merges away — the sand
       in the hourglass is a subpath there and nowhere else. */
    const reg = pathsOf(readFileSync(join(ASSETS, 'regular', `${spec.glyph}.svg`), 'utf8')).join(' ');
    accent = splitSubpaths(reg)[spec.accent];
    if (!accent) throw new Error(`${key}: regular subpath ${spec.accent} missing`);
  } else {
    const subs = splitSubpaths(fill);
    accent = subs[spec.accent];
    if (!accent) throw new Error(`${key}: subpath ${spec.accent} missing (${subs.length} found)`);
  }
  out[key] = { glyph: spec.glyph, base: fill, accent };
}

const header = `/*
  Duotone icon geometry, built by scripts/build-duotone-icons.mjs.

  Each entry is two layers: a solid Phosphor \`fill\` glyph as the base, and one
  accent shape painted over it in a second colour. The accent is never invented
  — it is either a subpath already cut out of the fill glyph (the clock hand,
  the check, one of two arrows) or the secondary layer of the same icon's
  Phosphor \`duotone\` weight. Both come from the same 256x256 grid as the base,
  so they land in register without any positioning.

  Vendored from @phosphor-icons/core 2.1.1, MIT; licence in
  docs/third-party-licences.md. No npm package, nothing fetched at runtime.

  Regenerate rather than hand-edit: extract the package and run
  node scripts/build-duotone-icons.mjs <assets-dir>
*/
export interface DuotoneIcon {
  /** The Phosphor glyph this was built from, for tracing it back. */
  glyph: string;
  /** Solid base, painted in the dark tone. */
  base: string;
  /** Single accent element, painted in the sky tone over the base. */
  accent: string;
}

export const duotoneIcons: Record<string, DuotoneIcon> = `;

writeFileSync(
  'src/data/icons-duotone.ts',
  header + JSON.stringify(out, null, 2) + ';\n'
);
console.log(`wrote src/data/icons-duotone.ts with ${Object.keys(out).length} icons`);
