/*
  Typography behaviour check — run in the browser, against a running preview.

  Why a console script and not a test runner: measuring which font the browser
  ACTUALLY applies requires a real browser with the webfont loaded. Neither
  vitest+happy-dom nor a grep over dist/ can prove it. Playwright could, but it
  is a new dependency (~200MB of browsers); this file needs none.

  How to run:
    npm run build && npm run preview
    open http://localhost:4321/ , DevTools console, paste this whole file

  It loads all nine routes in same-origin iframes at two widths, reads
  getComputedStyle on each element, and prints a pass/fail table.

  Passing means: h1 and every h2 render in the display face at weight 700;
  body, h3, buttons and form fields stay on the UI face; and no route at any
  width has horizontal overflow, clipped headings or headings off-viewport.
*/

const EXPECT_DISPLAY = 'Noto Serif Hebrew';
const EXPECT_DISPLAY_WEIGHT = '700';
const EXPECT_UI = 'Heebo';

const ROUTES = [
  '/', '/product/', '/solutions/', '/webinar/', '/about/',
  '/contact/', '/privacy/', '/accessibility/', '/404.html',
];
const WIDTHS = [
  { label: 'desktop', w: 1280, h: 900 },
  { label: 'mobile', w: 375, h: 812 },
];

const uses = (family, name) => family.toLowerCase().includes(name.toLowerCase());

function probe(el, win) {
  if (!el) return null;
  const c = win.getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const lh = parseFloat(c.lineHeight) || parseFloat(c.fontSize) * 1.2;
  // Only overflow that is actually cut off counts. With overflow:visible a tight
  // line-height lets glyphs paint past the box without anything being hidden,
  // so scrollHeight > clientHeight there is normal, not a defect.
  const cuts = c.overflowY !== 'visible' || c.overflowX !== 'visible';
  return {
    family: c.fontFamily,
    weight: c.fontWeight,
    size: c.fontSize,
    lines: Math.round(r.height / lh),
    clipped: cuts && el.scrollHeight > el.clientHeight + 1,
    offscreen: r.right > win.innerWidth + 1 || r.left < -1,
  };
}

function measure(win) {
  const d = win.document;
  return {
    h1: probe(d.querySelector('h1'), win),
    h2: [...d.querySelectorAll('h2')].map((el) => probe(el, win)),
    h3: probe(d.querySelector('h3'), win),
    body: probe(d.body, win),
    button: probe(d.querySelector('button, a[href="/contact/"]'), win),
    input: probe(d.querySelector('input'), win),
    hOverflow: d.documentElement.scrollWidth > d.documentElement.clientWidth,
  };
}

function judge(m) {
  const fails = [];
  const heads = [m.h1, ...m.h2].filter(Boolean);
  if (!m.h1) fails.push('no h1');
  for (const h of heads) {
    if (!uses(h.family, EXPECT_DISPLAY)) fails.push(`heading not ${EXPECT_DISPLAY}: ${h.family}`);
    else if (h.weight !== EXPECT_DISPLAY_WEIGHT) fails.push(`heading weight ${h.weight}`);
    if (h.clipped) fails.push('heading clipped');
    if (h.offscreen) fails.push('heading off-viewport');
  }
  for (const [name, el] of Object.entries({ body: m.body, h3: m.h3, button: m.button, input: m.input })) {
    if (el && !uses(el.family, EXPECT_UI)) fails.push(`${name} not ${EXPECT_UI}: ${el.family}`);
  }
  if (m.hOverflow) fails.push('horizontal overflow');
  return fails;
}

async function inFrame(route, size) {
  const f = document.createElement('iframe');
  f.style.cssText = `position:fixed;top:0;left:0;opacity:0;pointer-events:none;z-index:-1;border:0;width:${size.w}px;height:${size.h}px`;
  f.src = route;
  document.body.appendChild(f);
  try {
    await new Promise((res, rej) => {
      f.onload = res;
      f.onerror = () => rej(new Error('load failed'));
      setTimeout(() => rej(new Error('timeout')), 15000);
    });
    await f.contentWindow.document.fonts.ready;
    await new Promise((r) => setTimeout(r, 120));
    return measure(f.contentWindow);
  } finally {
    f.remove();
  }
}

const rows = [];
const detail = {};
for (const size of WIDTHS) {
  for (const route of ROUTES) {
    let m, fails;
    try {
      m = await inFrame(route, size);
      fails = judge(m);
    } catch (e) {
      m = null;
      fails = [`error: ${e.message}`];
    }
    const key = `${size.label} ${route}`;
    detail[key] = m;
    rows.push({
      route,
      viewport: size.label,
      h1: m?.h1 ? `${m.h1.family.split(',')[0].replace(/"/g, '')} ${m.h1.weight}` : '—',
      h1Lines: m?.h1 ? m.h1.lines : '—',
      body: m?.body ? m.body.family.split(',')[0].replace(/"/g, '') : '—',
      overflow: m?.hOverflow ?? '—',
      result: fails.length ? 'FAIL' : 'PASS',
      why: fails.join(' | '),
    });
  }
}

console.table(rows);
const failed = rows.filter((r) => r.result === 'FAIL');
console.log(failed.length === 0
  ? `GREEN — ${rows.length}/${rows.length} checks passed`
  : `RED — ${failed.length}/${rows.length} checks failed`);
({ summary: failed.length === 0 ? 'GREEN' : 'RED', total: rows.length, failed: failed.length, rows, detail });
