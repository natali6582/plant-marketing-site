import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

function walk(directory) { return readdirSync(directory).flatMap(name => { const path = join(directory, name); return statSync(path).isDirectory() ? walk(path) : [path]; }); }
const root = resolve('dist');
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
  const jsBytes = sources.filter(src => src.startsWith('/')).reduce((sum, src) => sum + gzipSync(readFileSync(join(root, src))).length, 0);
  largestJs = Math.max(largestJs, jsBytes);
  // Conservative local guardrails, explicitly proposed because the repository has no numeric budget file.
  if (jsBytes > 32768) errors.push(`${route}: first-party JS exceeds 32 KiB gzip guardrail (${jsBytes})`);
  if (gzipSync(Buffer.from(html)).length > 49152) errors.push(`${route}: HTML exceeds 48 KiB gzip guardrail`);
}
console.log(`${pages.length} knowledge pages; ${links} internal links; largest first-party script payload ${largestJs} bytes gzip`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('PASS: knowledge noindex, disclaimers, ownership, internal links and page-weight guardrails.');
