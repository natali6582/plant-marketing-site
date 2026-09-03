/*
  Text-content snapshot of the built site, for proving a refactor changed no
  copy.

  Strips script, style and svg wholesale, then every tag, decodes the entities
  the site actually uses, and collapses whitespace — so diffing two snapshots
  diffs what a reader sees rather than the markup around it. One word per line,
  because a word-level diff points at the word that changed instead of at a
  paragraph that reflowed.

  Usage: node scripts/text-diff.mjs <output-directory>
*/
import { readdirSync, statSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
};

const text = (html) =>
  html
    .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const outDir = process.argv[2];
if (!outDir) {
  console.error('usage: node scripts/text-diff.mjs <output-directory>');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

let n = 0;
for (const file of walk('dist').sort()) {
  const name = relative('dist', file).split(sep).join('__');
  writeFileSync(join(outDir, name + '.txt'), text(readFileSync(file, 'utf8')).split(' ').join('\n'));
  n++;
}
console.log(`snapshot: ${n} pages -> ${outDir}`);
