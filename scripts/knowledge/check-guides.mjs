/**
 * Post-build contract for the planners/wealth guide release.
 * Node only; reads emitted HTML and assets, never edits its inputs.
 * --dist defaults to dist. Optional --baseline compares every non-knowledge
 * HTML file, permitting only changed references to real, changed Astro CSS.
 * Intended for the review build: guide/series pages must remain noindex.
 * JSON output has no timestamps and is reproducible for identical inputs.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

function htmlFiles(root) {
  return readdirSync(root).sort().flatMap(name => {
    const path = join(root, name);
    return statSync(path).isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  });
}

function decode(value) {
  return value.replace(/&#(x[\da-f]+|\d+);/gi, (_, code) =>
    String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

function plain(html) {
  return decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ').trim();
}

// Select one element by an opening-tag predicate, retaining nested elements.
function element(html, matches) {
  const tags = /<([a-z][\w:-]*)\b[^>]*>/gi;
  for (const opening of html.matchAll(tags)) {
    if (!matches(opening[0])) continue;
    const tag = opening[1];
    const nested = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    nested.lastIndex = opening.index + opening[0].length;
    let depth = 1;
    for (let match; (match = nested.exec(html));) {
      depth += match[0].startsWith('</') ? -1 : match[0].endsWith('/>') ? 0 : 1;
      if (depth === 0) return html.slice(opening.index, nested.lastIndex);
    }
    return '';
  }
  return '';
}

function hrefs(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)].map(match => decode(match[2]));
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/\b([\w:-]+)\s*=\s*(["'])(.*?)\2/g)]
    .map(match => [match[1], decode(match[3])]));
}

function frontmatterFields(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
  return Object.fromEntries(['updated', 'reviewed', 'reviewAfter', 'contentOwner'].map(key => {
    const value = frontmatter.match(new RegExp(`^${key}:\\s*([^\\r\\n]*)`, 'm'))?.[1].trim() ?? '';
    return [key, /^(['"]).*\1$/.test(value) ? value.slice(1, -1) : value.split('#')[0].trim()];
  }));
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

function hasReviewRobots(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].some(match => {
    const attrs = attributes(match[0]);
    const directives = (attrs.content ?? '').toLowerCase().split(/\s*,\s*/);
    return attrs.name?.toLowerCase() === 'robots' && directives.includes('noindex') && directives.includes('nofollow');
  });
}

function emittedFile(root, pathname) {
  const decoded = decodeURIComponent(pathname);
  const target = resolve(root, `.${decoded}`);
  if (target !== root && !target.startsWith(root + sep)) return null;
  const candidates = decoded.endsWith('/') ? [join(target, 'index.html')] : [target, join(target, 'index.html')];
  return candidates.find(path => existsSync(path) && statSync(path).isFile()) ?? null;
}

function normalizeChangedStyles(before, after, baseline, dist, cssPairs) {
  // Only href attribute values identifying real Astro CSS assets are eligible.
  // Script URLs, inline CSS/JS, and all other HTML bytes stay untouched.
  const pattern = /\bhref=(["'])(\/_astro\/[^"'?#]+\.css)\1/g;
  const oldStyles = [...before.matchAll(pattern)].map(match => match[2]);
  const newStyles = [...after.matchAll(pattern)].map(match => match[2]);
  if (oldStyles.length !== newStyles.length) return [before, after];
  const eligible = oldStyles.map((oldUrl, index) => {
    const newUrl = newStyles[index];
    if (oldUrl === newUrl) return false;
    const oldFile = emittedFile(baseline, oldUrl);
    const newFile = emittedFile(dist, newUrl);
    if (!oldFile || !newFile || readFileSync(oldFile).equals(readFileSync(newFile))) return false;
    cssPairs.add(`${oldUrl} -> ${newUrl}`);
    return true;
  });
  function normalize(html) {
    let index = 0;
    return html.replace(pattern, (attribute, quote) => {
      const position = index++;
      return eligible[position] ? `href=${quote}/_astro/changed-style-${position}.css${quote}` : attribute;
    });
  }
  return [normalize(before), normalize(after)];
}

function main(argv) {
  let dist = resolve('dist');
  let baseline = null;
  for (let index = 0; index < argv.length; index++) {
    const option = argv[index];
    if (!['--dist', '--baseline'].includes(option) || !argv[index + 1] || argv[index + 1].startsWith('--')) {
      throw new Error('Usage: node scripts/knowledge/check-guides.mjs [--dist directory] [--baseline directory]');
    }
    const path = resolve(argv[++index]);
    if (option === '--dist') dist = path;
    else baseline = path;
  }
  for (const [name, path] of [['dist', dist], ['baseline', baseline]]) {
    if (path && (!existsSync(path) || !statSync(path).isDirectory())) throw new Error(`${name} directory does not exist: ${path}`);
  }

  const articles = [
    'investment-analysis', 'total-investment-costs', 'mutual-funds', 'bonds-price-yield',
    'structured-products', 'capital-calls', 'private-markets', 'private-credit-vs-bonds',
    'currency-exposure', 'reit-and-funds', 'direct-real-estate',
  ];
  const series = ['investment-decisions', 'wealth-decisions'];
  const contentRoot = fileURLToPath(new URL('../../src/content/knowledge/', import.meta.url));
  const failures = [];
  let checks = 0;
  let internalLinks = 0;
  let baselinePages = 0;
  const cssPairs = new Set();
  function check(ok, message) { checks++; if (!ok) failures.push(message); }
  function page(route) {
    const file = emittedFile(dist, route);
    check(Boolean(file), `${route}: emitted HTML missing`);
    return file && file.endsWith('.html') ? readFileSync(file, 'utf8') : '';
  }
  function checkLinks(html, route) {
    const origin = 'https://knowledge.local';
    const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
    const ownOrigins = new Set([origin]);
    if (canonical) { try { ownOrigins.add(new URL(decode(canonical)).origin); } catch {} }
    for (const href of [...new Set(hrefs(html))].sort()) {
      let url;
      try { url = new URL(href, origin + route); }
      catch { check(false, `${route}: malformed href ${href}`); continue; }
      if (!ownOrigins.has(url.origin) || !(url.pathname === '/knowledge' || url.pathname.startsWith('/knowledge/'))) continue;
      internalLinks++;
      let target;
      try { target = emittedFile(dist, url.pathname); }
      catch { check(false, `${route}: invalid encoded path ${href}`); continue; }
      const isHtml = Boolean(target?.endsWith('.html'));
      check(isHtml, `${route}: knowledge link has no emitted HTML: ${href}`);
      if (isHtml && url.hash.length > 1) {
        let fragment;
        try { fragment = decodeURIComponent(url.hash.slice(1)); }
        catch { check(false, `${route}: invalid encoded fragment ${href}`); continue; }
        const ids = [...readFileSync(target, 'utf8').matchAll(/\b(?:id|name)\s*=\s*(["'])(.*?)\1/gi)].map(match => decode(match[2]));
        check(ids.includes(fragment), `${route}: missing fragment target ${href}`);
      }
    }
  }

  function checkExplorer(html, route, kind) {
    const matchingTags = [...html.matchAll(/<section\b[^>]*>/gi)]
      .filter(match => attributes(match[0])['data-investment-explorer'] === kind);
    check(matchingTags.length === 1, `${route}: expected exactly one ${kind} explorer`);
    const explorer = element(html, tag => attributes(tag)['data-investment-explorer'] === kind);
    if (!explorer) return;
    const inputs = [...explorer.matchAll(/<input\b[^>]*>/gi)].map(match => ({ tag: match[0], ...attributes(match[0]) }));
    const contracts = kind === 'bond' ? [
      { id: 'bond-coupon', name: 'coupon', min: '0', max: '15', step: '0.1', value: '4' },
      { id: 'bond-yield', name: 'yield', min: '-2', max: '20', step: '0.1', value: '4' },
      { id: 'bond-years', name: 'years', min: '1', max: '30', step: '1', value: '5' },
    ] : [{ id: 'structured-level', name: 'level', min: '0', max: '200', step: '0.01', value: '80' }];
    check(inputs.length === contracts.length, `${route}: unexpected explorer input count`);
    for (const contract of contracts) {
      const input = inputs.find(candidate => candidate.id === contract.id);
      check(Boolean(input && input.type === 'number' && /\brequired(?:\s|=|\/?>)/.test(input.tag)
        && Object.entries(contract).every(([key, value]) => input[key] === value)), `${route}: input contract differs for ${contract.id}`);
      const label = element(explorer, tag => /^<label\b/i.test(tag) && attributes(tag).for === contract.id);
      check(Boolean(plain(label)), `${route}: input ${contract.id} has no associated text label`);
    }
    const results = element(explorer, tag => /\bdata-explorer-results(?:\s|=|>)/.test(tag));
    const tbody = element(explorer, tag => /\bdata-explorer-rows(?:\s|=|>)/.test(tag));
    const rows = [...tbody.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
    check(rows.length === (kind === 'bond' ? 3 : 8), `${route}: server-rendered sensitivity table is incomplete`);
    check(rows.length > 0 && rows.every(row => {
      const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(match => plain(match[1]));
      return cells.length === 2 && cells.every(Boolean) && /^-?\d+(?:\.\d+)?$/.test(cells[1]);
    }), `${route}: server-rendered table has empty or nonnumeric results`);
    check(Boolean(results) && !/^<[^>]*\bhidden(?:\s|=|>)/.test(results), `${route}: initial explorer results are missing or hidden`);
    check(/<caption\b[^>]*>[^<]+<\/caption>/.test(explorer), `${route}: scenario table has no caption`);
    check(plain(element(explorer, tag => /^<noscript\b/i.test(tag))).length > 0, `${route}: no-JavaScript explanation is missing`);
    const context = plain(element(explorer, tag => /\bclass=["'][^"']*\bexplorer-context\b/.test(tag)));
    check(context.includes(kind === 'bond' ? 'דוגמה לימודית' : 'מוצר בדיוני בלבד'), `${route}: explorer is missing its illustrative-model explanation`);
    const disclosure = element(html, tag => attributes(tag)['aria-label'] === 'הבהרה');
    check(Boolean(plain(disclosure)), `${route}: existing disclaimer is missing`);
  }

  for (const slug of articles) {
    const route = `/knowledge/${slug}/`;
    const html = page(route);
    if (!html) continue;
    const prose = element(html, tag => /\bclass=["'][^"']*\bkb-prose\b/.test(tag));
    const text = plain(prose);
    check(text.split(/\s+/).filter(Boolean).length >= 200, `${route}: article body is not substantive (minimum 200 words)`);
    check(!text.includes('בהכנה'), `${route}: article still contains placeholder copy`);
    check(!/\{\{\s*[a-z][\w-]*\s*:/i.test(text), `${route}: unrendered shortcode in article`);
    const sources = element(html, tag => /\baria-labelledby=["']sources-title["']/.test(tag));
    check(hrefs(sources).some(href => /^https?:\/\//.test(href)), `${route}: no linked sources in source section`);
    check(plain(sources).includes('מקור ראשוני'), `${route}: source section has no primary source`);
    check(!plain(sources).includes('טעון אימות'), `${route}: source section includes tier-0 source`);
    const sourcePath = join(contentRoot, `${slug}.md`);
    check(existsSync(sourcePath), `${route}: article source is missing`);
    const metadata = frontmatterFields(existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '');
    check(validDate(metadata.reviewed), `${route}: frontmatter reviewed date is absent or invalid`);
    check(validDate(metadata.reviewAfter), `${route}: frontmatter reviewAfter date is absent or invalid`);
    check(Boolean(metadata.contentOwner), `${route}: frontmatter contentOwner is absent`);
    check(validDate(metadata.reviewed) && validDate(metadata.reviewAfter) && metadata.reviewAfter > metadata.reviewed,
      `${route}: next review must be after the reviewed date`);
    check(/^\d{4}-\d{2}$/.test(metadata.updated) && validDate(`${metadata.updated}-01`) && metadata.reviewed >= `${metadata.updated}-01`,
      `${route}: reviewed date precedes the updated month or updated is invalid`);
    const maintenance = plain(element(html, tag => /\bdata-article-maintenance(?:\s|=|>)/.test(tag)));
    for (const [key, label] of [['reviewed', 'reviewed date'], ['reviewAfter', 'next-review date'], ['contentOwner', 'content owner']]) {
      check(Boolean(metadata[key]) && maintenance.includes(metadata[key]), `${route}: visible ${label} differs from source frontmatter`);
    }
    check(hasReviewRobots(html), `${route}: review-build article must be noindex, nofollow`);
    if (slug === 'bonds-price-yield') checkExplorer(html, route, 'bond');
    if (slug === 'structured-products') checkExplorer(html, route, 'structured');
    checkLinks(html, route);
  }

  for (const slug of series) {
    const route = `/knowledge/series/${slug}/`;
    const html = page(route);
    if (!html) continue;
    check(hasReviewRobots(html), `${route}: review-build series must be noindex, nofollow`);
    const articleLinks = hrefs(html).filter(href => articles.some(article => href === `/knowledge/${article}/`));
    check(new Set(articleLinks).size >= 4, `${route}: reading series has fewer than four substantive guides`);
    checkLinks(html, route);
  }

  for (const [route, expected] of [
    ['/knowledge/', series],
    ['/knowledge/planners/', ['investment-decisions']],
    ['/knowledge/wealth/', ['wealth-decisions']],
  ]) {
    const links = hrefs(page(route));
    for (const slug of expected) check(links.includes(`/knowledge/series/${slug}/`), `${route}: missing series link ${slug}`);
  }
  const agents = hrefs(page('/knowledge/agents/'));
  for (const slug of articles) check(!agents.includes(`/knowledge/${slug}/`), `/knowledge/agents/: planners/wealth guide leaked into agents list: ${slug}`);
  check(Boolean(emittedFile(dist, '/knowledge/agents/fees/')), 'Existing agents fee calculator is missing');
  check(!emittedFile(dist, '/knowledge/fee-impact-calculator/'), 'Removed fee-impact calculator was emitted again');

  if (baseline) {
    const nonKnowledge = root => htmlFiles(root).map(path => relative(root, path).replaceAll('\\', '/')).filter(path => !path.startsWith('knowledge/'));
    const oldPages = nonKnowledge(baseline);
    const newPages = nonKnowledge(dist);
    check(JSON.stringify(oldPages) === JSON.stringify(newPages), 'Non-knowledge HTML route set differs from baseline');
    for (const path of oldPages) {
      if (!existsSync(join(dist, path))) continue;
      baselinePages++;
      const before = readFileSync(join(baseline, path), 'utf8');
      const after = readFileSync(join(dist, path), 'utf8');
      const [normalizedBefore, normalizedAfter] = normalizeChangedStyles(before, after, baseline, dist, cssPairs);
      check(normalizedBefore === normalizedAfter, `${path}: non-knowledge HTML changed beyond verified Astro CSS references`);
    }
  }
  const report = {
    result: failures.length ? 'FAIL' : 'PASS', checks, failures,
    articles: articles.length, series: series.length, internalLinks, baselinePages,
    normalizedStyles: [...cssPairs].sort(),
  };
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = failures.length ? 1 : 0;
}

try { main(process.argv.slice(2)); }
catch (error) {
  console.log(JSON.stringify({ result: 'ERROR', checks: 0, failures: [error.message] }, null, 2));
  process.exitCode = 2;
}
