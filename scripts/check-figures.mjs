/*
  Gate for the knowledge hub.

  Four contracts, all of which are easy to break by writing a sentence and hard
  to notice afterwards:

    1. Every {{figure:id}} an article cites exists in figures.yaml, and every
       entry there has a year and a source. A ceiling with no year is a claim
       with an invisible expiry date.
    2. No article body types a number. The whole point of figures.yaml is that
       January is one edit; a figure typed into prose is a figure that will
       still say 2026 in 2028.
    3. No advice phrasing. This is educational content in a supervised field,
       and the line between explaining and recommending is a legal one, not a
       stylistic one.
    4. No Plan-T capability claims inside an article beyond the one fixed
       closing line.

  It reads the markdown sources for 2 to 4 — the built HTML would also carry
  the figures the components legitimately rendered, so the source is where the
  distinction between "typed" and "referenced" is still visible.

  Usage: node scripts/check-figures.mjs
  Exits non-zero on any breach. Tier-0 sources are reported and may be cited by
  drafts, but a published article that cites one fails the build.
*/
import { readdirSync, readFileSync } from 'node:fs';

const ARTICLES = 'src/content/knowledge';
const FIGURES = 'src/data/figures.yaml';

/* Small enough to parse for what this needs: top-level keys and their fields.
   Astro reads the same file properly through its own loader; this only has to
   agree with it about which keys exist and what year and source each carries. */
function parseFigures(text) {
  const out = {};
  let key = null;
  for (const raw of text.split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const top = raw.match(/^([a-z0-9-]+):\s*$/);
    if (top) {
      key = top[1];
      out[key] = {};
      continue;
    }
    if (!key) continue;
    const field = raw.match(/^\s+([a-z]+):\s*(.*)$/);
    if (field) out[key][field[1]] = field[2].trim();
  }
  return out;
}

const figures = parseFigures(readFileSync(FIGURES, 'utf8'));
const files = readdirSync(ARTICLES).filter((f) => f.endsWith('.md'));

const errors = [];
const tierZero = [];
const used = new Set();

/* Never "כדאי", "מומלץ", "עדיף ל…", "אתם צריכים". Explain, compare, describe. */
const ADVICE = [
  { re: /כדאי/g, word: 'כדאי' },
  { re: /מומלץ/g, word: 'מומלץ' },
  { re: /עדיף\s+ל/g, word: 'עדיף ל…' },
  { re: /אתם\s+צריכים/g, word: 'אתם צריכים' },
  { re: /אנחנו\s+ממליצים/g, word: 'אנחנו ממליצים' },
];

/* A thousands-separated number, or a bare 4+ digit number, in prose. */
const TYPED_NUMBER = /(?<![\w-])\d{1,3}(?:,\d{3})+(?![\w-])|(?<![\w\d.,-])\d{4,}(?![\w\d,-])/g;

const CLOSING_LINE = 'ב-Plan-T כל השכבות האלה נראות בתיק אחד';

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const text = readFileSync(`${ARTICLES}/${file}`, 'utf8');
  const split = text.indexOf('\n---', 3);
  const frontmatter = text.slice(0, split);
  const body = text.slice(split + 4);
  const isDraft = /^draft:\s*true\s*$/m.test(frontmatter);
  const articleFigures = new Set();

  for (const m of body.matchAll(/\{\{\s*figure\s*:\s*([a-z0-9-]+)\s*\}\}/g)) {
    used.add(m[1]);
    articleFigures.add(m[1]);
    if (!figures[m[1]]) errors.push(`${slug}: {{figure:${m[1]}}} is not in figures.yaml`);
  }
  for (const m of body.matchAll(/\{\{\s*keyfigures\s*:\s*([^}]+)\}\}/g)) {
    for (const id of m[1].split(',').map((s) => s.trim())) {
      used.add(id);
      articleFigures.add(id);
      if (!figures[id]) errors.push(`${slug}: {{keyfigures}} references ${id}, not in figures.yaml`);
    }
  }
  if (!isDraft) {
    for (const id of articleFigures) {
      if (/tier:\s*0/.test(figures[id]?.source ?? '')) {
        errors.push(`${slug}: published article cites tier-0 figure ${id}`);
      }
    }
  }

  /* Numbers in prose. Percentages and small counts written as words are fine;
     what must not happen is a ceiling or an amount typed by hand. */
  const prose = body
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/`[^`]*`/g, '')
    /*
      A four-digit year between 1900 and 2099 is a date, not a ceiling. The rule
      exists so that an amount which changes every January cannot be typed into
      prose; the year a law was published never changes and belongs in the
      sentence. A year touching a currency sign is still an amount and is not
      exempted here.
    */
    .replace(/(?<![₪\d,.])\b(19|20)\d{2}\b(?![\d,.]*\s*₪)/g, '');
  for (const m of prose.matchAll(TYPED_NUMBER)) {
    errors.push(`${slug}: the number ${m[0]} is typed in the body — use a figures.yaml id`);
  }

  /*
    A phrase inside Hebrew quotation marks is being named, not used —
    licensing-boundaries teaches the rule by quoting the words it forbids, and
    failing it for that would be failing it for being right.
  */
  const spoken = body.replace(/״[^״]{0,60}״/g, '');
  for (const { re, word } of ADVICE) {
    const hits = [...spoken.matchAll(re)];
    if (hits.length) errors.push(`${slug}: advice phrasing "${word}" ×${hits.length}`);
  }

  /* Plan-T may appear once, in the fixed closing line, and that line lives in
     the layout rather than the body — so a body mention is a claim. */
  const mentions = [...body.matchAll(/Plan-?T/gi)].length;
  if (mentions > 0 && !body.includes(CLOSING_LINE)) {
    errors.push(`${slug}: mentions Plan-T ×${mentions} in the body (the closing line is in the layout)`);
  }

  if (!/^updated:\s*'\d{4}-\d{2}'/m.test(frontmatter)) errors.push(`${slug}: no updated date`);
}

for (const [id, f] of Object.entries(figures)) {
  if (!f.year) errors.push(`figures.yaml: ${id} has no year`);
  if (!f.source) errors.push(`figures.yaml: ${id} has no source`);
  else if (/tier:\s*0/.test(f.source)) tierZero.push(id);
}

const unused = Object.keys(figures).filter((id) => !used.has(id));

if (tierZero.length) {
  console.log(`\n  FIGURES NEEDING A SOURCE — ${tierZero.length} of ${Object.keys(figures).length}, tier 0:`);
  for (const id of tierZero) console.log(`    ${id}`);
}
if (unused.length) {
  console.log(`\n  Not cited by any article yet — ${unused.length}:`);
  console.log(`    ${unused.join('  ')}`);
}
if (errors.length) {
  console.error('\n  BREACHES');
  for (const e of errors) console.error(`    ${e}`);
}

console.log(
  `\n  ${files.length} articles, ${Object.keys(figures).length} figures, ${used.size} cited — ${errors.length} breaches\n`
);
process.exit(errors.length ? 1 : 0);
