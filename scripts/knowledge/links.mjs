import { DIRECTORY } from '../../src/data/knowledge-directory.ts';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function walk(path) { return readdirSync(path).flatMap(name => { const p = join(path, name); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
function collectLinks() {
const links = new Set(DIRECTORY.map(t => t.url));
// Include sources on knowledge-work pages and maintained investment guides.
if (existsSync('dist/knowledge')) for (const file of walk('dist/knowledge').filter(p => p.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('class="knowledge-work"') && !html.includes('data-article-maintenance')) continue;
  const body = html.split('<main id="main">')[1]?.split('</main>')[0] ?? '';
  for (const [, url] of body.matchAll(/href="(https:\/\/[^"#]+)(?:#[^"]*)?"/g)) links.add(url.replaceAll('&amp;', '&'));
}
return [...links];
}

export function classifyHttpStatus(status) {
  if (status >= 200 && status < 300) return 'verified';
  if (status === 404 || status === 410 || (status >= 500 && status <= 599)) return 'broken';
  return 'unreachable-from-CI';
}

export async function checkLinks(urls, { request = fetch, timeoutMs = 20000 } = {}) {
  const results = [];
  for (const url of [...new Set(urls)].sort()) {
    let response;
    try {
      // One attempt per unique URL. Keep our explicit identity; follow ordinary redirects.
      response = await request(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': 'Plan-T-Knowledge-Link-Check/1.0', Accept: 'text/html,application/pdf' } });
    } catch (error) {
      results.push({ url, classification: 'unreachable-from-CI', detail: String(error?.cause?.code ?? error?.name ?? 'NETWORK_ERROR') });
      continue;
    }
    results.push({ url, classification: classifyHttpStatus(response.status), detail: `HTTP ${response.status}` });
    // The received HTTP status is evidence even if releasing the body fails.
    try { await response.body?.cancel(); } catch { /* Preserve the HTTP result. */ }
  }
  return results;
}

export function getExitCode(results) {
  return results.some(result => result.classification === 'broken') ? 1 : 0;
}

export function formatReport(results) {
  const verified = results.filter(result => result.classification === 'verified');
  const unreachable = results.filter(result => result.classification === 'unreachable-from-CI');
  const broken = results.filter(result => result.classification === 'broken');
  const lines = [
    ...verified.map(result => `VERIFIED ${result.detail} ${result.url}`),
    ...broken.map(result => `BROKEN ${result.detail} ${result.url}`),
  ];
  if (unreachable.length) {
    lines.push(`WARNING: ${unreachable.length} unreachable-from-CI — verify by hand; not counted as verified:`);
    lines.push(...unreachable.map(result => `  UNREACHABLE-FROM-CI ${result.url} (${result.detail})`));
  }
  lines.push(`${verified.length}/${results.length} external URLs verified by HTTP; ${unreachable.length} unreachable-from-CI; ${broken.length} broken.`);
  return lines.join('\n');
}

async function main() {
  const results = await checkLinks(collectLinks());
  console.log(formatReport(results));
  const unreachable = results.filter(result => result.classification === 'unreachable-from-CI').length;
  if (unreachable && process.env.GITHUB_ACTIONS === 'true') {
    console.log(`::warning title=External links need manual verification::${unreachable} links are unreachable-from-CI, not verified. The full URL list and reasons are in links.log.`);
  }
  process.exitCode = getExitCode(results);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await main();
