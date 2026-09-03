/*
  Register check for the duotone icon set.

  Every accent must land inside the silhouette of the glyph it colours. Two did
  not, and neither was visible by reading the path data: chart-bar's duotone
  secondary is 8 units off the fill weight's bar, and a hand-drawn puzzle tab
  sat over a notch instead of a tab. Both showed up here as a non-zero share of
  accent pixels falling on background, so this runs as a gate rather than a
  one-off.

  The silhouette is the base with its holes filled — flood-filled inward from
  the canvas border — because an accent that fills a cut-out (a clock hand, a
  check) is correct and would otherwise read as entirely off-glyph.

  Usage: node scripts/check-duotone-register.mjs
  Exits non-zero if any accent has more than 0.5% of its pixels outside.
*/
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const S = 256;
const TOTAL = S * S;

const source = readFileSync('src/data/icons-duotone.ts', 'utf8');
const icons = JSON.parse(source.slice(source.indexOf('= {') + 2, source.lastIndexOf(';')));

async function raster(d) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 256 256"><path d="${d}" fill="#000"/></svg>`;
  const { data } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = new Uint8Array(TOTAL);
  let n = 0;
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    if (data[i + 3] > 128) { px[j] = 1; n++; }
  }
  return { px, n };
}

async function silhouette(d) {
  const glyph = await raster(d);
  const inside = new Uint8Array(TOTAL).fill(1);
  const seen = new Uint8Array(TOTAL);
  const stack = [];
  for (let x = 0; x < S; x++) { stack.push([x, 0], [x, S - 1]); }
  for (let y = 0; y < S; y++) { stack.push([0, y], [S - 1, y]); }
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= S || y >= S) continue;
    const i = y * S + x;
    if (seen[i] || glyph.px[i]) continue;
    seen[i] = 1;
    inside[i] = 0;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return inside;
}

let failures = 0;
for (const [key, icon] of Object.entries(icons)) {
  const inside = await silhouette(icon.base);
  const accent = await raster(icon.accent);
  let outside = 0;
  for (let i = 0; i < TOTAL; i++) if (accent.px[i] && !inside[i]) outside++;
  const pct = (100 * outside) / (accent.n || 1);
  if (pct > 0.5) {
    failures++;
    console.error(`  OFF REGISTER  ${key.padEnd(20)} ${pct.toFixed(1)}% of the accent is outside the base`);
  }
}

console.log(
  failures
    ? `${Object.keys(icons).length} icons, ${failures} off register`
    : `${Object.keys(icons).length} icons, every accent in register`
);
process.exit(failures ? 1 : 0);
