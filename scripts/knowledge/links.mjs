import { DIRECTORY } from '../../src/data/knowledge-directory.ts';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function walk(path) { return readdirSync(path).flatMap(name => { const p = join(path, name); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
async function main() {
const links = new Set(DIRECTORY.map(t => t.url));
// Every external source used on a new knowledge-work page joins the same network check.
if (existsSync('dist/knowledge')) for (const file of walk('dist/knowledge').filter(p => p.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('class="knowledge-work"')) continue;
  const body = html.split('<main id="main">')[1]?.split('</main>')[0] ?? '';
  for (const [, url] of body.matchAll(/href="(https:\/\/[^"#]+)(?:#[^"]*)?"/g)) links.add(url.replaceAll('&amp;', '&'));
}
let failures = 0;
for (const url of [...links].sort()) {
  let message = '';
  let success = false;
  for (let attempt = 0; attempt < 3 && !success; attempt++) {
    if (attempt > 0) await new Promise(resolve => setTimeout(resolve, attempt * 2000));
    try {
      const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Plan-T-Knowledge-Link-Check/1.0', Accept: 'text/html,application/pdf' } });
      message = `${response.status} ${url}`;
      await response.body?.cancel(); success = response.ok;
    } catch (error) { message = `${error.cause?.code ?? error.name}: ${url}`; }
    if (!success && attempt < 2) console.log(`RETRY ${attempt + 1}/2 ${message}`);
  }
  console.log(`${success ? 'PASS' : 'UNVERIFIED'} ${message}`);
  if (!success) failures++;
}
console.log(`${links.size - failures}/${links.size} external URLs verified by HTTP. WAF blocks/timeouts are not counted as passes.`);
if (failures) process.exit(1);
}
await main();
