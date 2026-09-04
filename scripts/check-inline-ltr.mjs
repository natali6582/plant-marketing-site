/*
  Inline-LTR check for the built site.

  Two failures on /privacy/ and /accessibility/ started this. An email address
  sat directly against its Hebrew label — «אותם:sales@plan-t.org.il» — because
  the space between them was a line break, and Astro's compressHTML removes
  whitespace that falls on a line break immediately before an inline tag. A
  same-line space survives; a wrapped one does not. Nothing caught it, because
  the source looked correct and only the built output was wrong. So this runs
  over dist/, not over src/.

  It checks two contracts:

    1. A Hebrew label and the value after it are separated by real whitespace.
       The failing shape is <hebrew>: immediately followed by a tag or by a
       Latin run, with nothing between them.

    2. Every reorder-prone run — an address, a phone number, a URL, a dotted
       date, a clock range — sits inside .ltr, which is
       direction: ltr; unicode-bidi: isolate; white-space: nowrap. Without the
       isolate a Latin run can swap places with the punctuation around it in an
       RTL paragraph; without nowrap it can be cut in half by a line break.

  Bare Latin words (Plan-T, CRM, WCAG, PDF) are NOT failures. A word with no
  internal punctuation cannot reorder against Hebrew: Unicode's bidi algorithm
  keeps it as one left-to-right run either way. They are listed under REVIEW so
  the count is visible and a real regression cannot hide inside it, and they do
  not affect the exit code.

  Usage: npm run build && node scripts/check-inline-ltr.mjs
  Exits non-zero if either contract is broken.
*/
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
};

const HEBREW = /[֐-׿]/;

/*
  The runs that actually reorder. Each needs punctuation or a mix of scripts
  inside it — that is what gives the bidi algorithm something to resolve
  against the paragraph direction instead of leaving the run alone.
*/
const REORDER_PRONE = [
  { name: 'email', re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
  { name: 'phone', re: /\b0\d{1,2}-?\d{7}\b/g },
  { name: 'url', re: /\b(?:https?:\/\/|www\.)[^\s<]+/g },
  { name: 'date', re: /\b\d{1,2}\.\d{1,2}\.\d{4}\b/g },
  { name: 'time range', re: /\b\d{1,2}:\d{2}\s*[–—-]\s*\d{1,2}:\d{2}\b/g },
];

/* A Latin run with nothing inside it that can reorder. Listed, never failed. */
const BARE_LATIN = /\b[A-Za-z][A-Za-z0-9]*(?:[ -][A-Za-z0-9]+)*\b/g;

/*
  Walk the markup, carrying whether the current text node is inside an element
  whose class list contains ltr. A depth counter is enough: the helper is never
  nested inside itself, and it is only ever put on leaf-ish inline elements.
*/
function textNodes(html) {
  /*
    Comments go first. Astro keeps source comments in the output, and the ones
    on this site are written in English — «MIGRATED — verify with Natali» and
    friends — so leaving them in filled the review list with prose no reader
    ever sees.
  */
  const body = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, '');
  const out = [];
  const stack = [];
  let ltrDepth = 0;
  let i = 0;
  const tag = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = tag.exec(body))) {
    const text = body.slice(i, m.index);
    if (text) out.push({ text, inLtr: ltrDepth > 0 });
    i = tag.lastIndex;

    const [, closing, name, attrs, selfClosing] = m;
    const isVoid = /^(br|img|input|hr|meta|link|source|area|base|col|embed|param|track|wbr)$/i.test(name);
    if (closing) {
      const popped = stack.pop();
      if (popped) ltrDepth -= popped;
    } else if (!selfClosing && !isVoid) {
      const carries = / class="[^"]*\bltr\b[^"]*"/.test(attrs) ? 1 : 0;
      stack.push(carries);
      ltrDepth += carries;
    }
  }
  const tail = body.slice(i);
  if (tail) out.push({ tail, text: tail, inLtr: ltrDepth > 0 });
  return out;
}

const files = walk('dist').sort();
const fused = [];
const unwrapped = [];
const review = new Map();

for (const file of files) {
  const route = '/' + file.split(sep).slice(1).join('/').replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');

  /*
    Contract 1 works on the raw markup, because the whole failure is that the
    separator between the label and the value is missing from the markup.
  */
  for (const m of html.matchAll(/([֐-׿״"']{2,}\s*:)(<[a-z]|[A-Za-z0-9])/g)) {
    fused.push({ route, sample: m[0].slice(0, 46) });
  }

  /* Contract 2 works on text nodes, because it is about what the reader sees. */
  for (const node of textNodes(html)) {
    if (node.inLtr) continue;
    /* Entities decoded, so &quot; does not read as the word "quot". */
    const text = node.text
      .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/&quot;/g, '"')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
    if (!HEBREW.test(text)) continue;

    for (const { name, re } of REORDER_PRONE) {
      for (const m of text.matchAll(re)) {
        unwrapped.push({ route, kind: name, value: m[0] });
      }
    }
    for (const m of text.matchAll(BARE_LATIN)) {
      const key = m[0];
      review.set(key, (review.get(key) ?? 0) + 1);
    }
  }
}

if (fused.length) {
  console.error('\n  FUSED LABEL AND VALUE — a real space is missing (use &#32; before the tag)');
  for (const f of fused) console.error(`    ${f.route.padEnd(20)} ${f.sample}`);
}

if (unwrapped.length) {
  console.error('\n  REORDER-PRONE RUN OUTSIDE .ltr');
  for (const u of unwrapped) console.error(`    ${u.route.padEnd(20)} ${u.kind.padEnd(12)} ${u.value}`);
}

const reviewed = [...review.entries()].sort((a, b) => b[1] - a[1]);
console.log(`\n  REVIEW — bare Latin words in Hebrew text, ${reviewed.length} distinct, not failures:`);
console.log(
  '    ' +
    reviewed
      .slice(0, 24)
      .map(([w, n]) => `${w}×${n}`)
      .join('  ')
);
if (reviewed.length > 24) console.log(`    …and ${reviewed.length - 24} more`);

const failures = fused.length + unwrapped.length;
console.log(
  `\n  ${files.length} pages — ${fused.length} fused, ${unwrapped.length} unwrapped, ${reviewed.length} reviewed\n`
);
process.exit(failures ? 1 : 0);
