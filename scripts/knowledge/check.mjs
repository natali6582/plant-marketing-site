import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

function walk(directory) { return readdirSync(directory).flatMap(name => { const path = join(directory, name); return statSync(path).isDirectory() ? walk(path) : [path]; }); }
function main() {
const root = resolve('dist');
function scriptBytes(path, seen) {
  if (seen.has(path)) return 0;
  seen.add(path);
  const source = readFileSync(path, 'utf8');
  let bytes = gzipSync(Buffer.from(source)).length;
  // Astro emits entry modules that import shared chunks. Count each fetched chunk once.
  for (const [, dependency] of source.matchAll(/(?:from\s*|import\s*\(?\s*)["']([^"']+\.js(?:\?[^"']*)?)["']/g)) {
    if (!dependency.startsWith('.') && !dependency.startsWith('/')) continue;
    const clean = dependency.split('?')[0];
    const child = clean.startsWith('/') ? join(root, clean) : resolve(dirname(path), clean);
    if (!relative(root, child).startsWith('..') && existsSync(child)) bytes += scriptBytes(child, seen);
  }
  return bytes;
}
const pages = walk(join(root, 'knowledge')).filter(p => p.endsWith('.html'));
const errors = [];
let links = 0;
let largestJs = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const route = '/' + relative(root, page).replaceAll('\\', '/').replace(/index\.html$/, '');
  if (!/<meta[^>]*name="robots"[^>]*content="noindex, nofollow"/.test(html)) errors.push(`${route}: missing noindex`);
  if (!html.includes('aria-label="הבהרה"')) errors.push(`${route}: missing existing disclaimer`);
  for (const [, raw] of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    if (raw.startsWith('//')) continue;
    const target = join(root, decodeURI(raw), raw.endsWith('/') ? 'index.html' : '');
    if (!existsSync(target)) errors.push(`${route}: broken internal link ${raw}`);
    links++;
  }
  if (!html.includes('class="knowledge-work"')) continue;
  if (!html.includes('בעלים: נטלי')) errors.push(`${route}: missing owner`);
  if (html.includes('type="email"')) errors.push(`${route}: unexpected email capture`);
  if (!html.includes('href="/contact/"')) errors.push(`${route}: missing demo CTA`);
  const sources = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]);
  const seen = new Set();
  const inlineBytes = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].reduce((sum, match) => sum + (match[1].trim() ? gzipSync(Buffer.from(match[1])).length : 0), 0);
  const jsBytes = inlineBytes + sources.filter(src => src.startsWith('/')).reduce((sum, src) => sum + scriptBytes(join(root, src), seen), 0);
  largestJs = Math.max(largestJs, jsBytes);
  // Conservative local guardrails, explicitly proposed because the repository has no numeric budget file.
  if (jsBytes > 32768) errors.push(`${route}: first-party JS exceeds 32 KiB gzip guardrail (${jsBytes})`);
  if (gzipSync(Buffer.from(html)).length > 49152) errors.push(`${route}: HTML exceeds 48 KiB gzip guardrail`);
}
console.log(`${pages.length} knowledge pages; ${links} internal links; largest first-party script payload ${largestJs} bytes gzip`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('PASS: knowledge noindex, disclaimers, ownership, internal links and page-weight guardrails.');
}
main();
