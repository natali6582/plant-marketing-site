/*
  /community/ landing-page regression — run in the browser against a running preview.

  Step-1 contract (skeleton): the page exists at /community/, carries the approved
  hero and the three value lines, has NO form of any kind yet, minimal chrome
  (logo-only header, privacy-link footer), stays out of the site navigation, and
  is indexable (no noindex; listed in the sitemap by design). No AI, no webinar.
  Later steps (the join form, the COMMUNITY mark) extend this file.

  How to run:
    npm run build && npm run preview
    open http://localhost:4321/ , DevTools console, paste this whole file
*/

const HERO = {
  eyebrow: 'COMMUNITY',
  h1: 'קהילת Plan-T למתכננים פיננסיים',
  support: 'מקום מקצועי לשיתוף ידע, קבלת עדכונים וחיבור עם מתכננים פיננסיים נוספים.',
};
const VALUES = ['שיתוף ידע מקצועי', 'עדכונים רלוונטיים', 'חיבור בין מתכננים פיננסיים'];
const WIDTHS = [{ label: 'desktop', w: 1440, h: 900 }, { label: 'mobile', w: 390, h: 844 }];

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

async function inFrame(width, height) {
  const f = document.createElement('iframe');
  f.style.cssText = `position:fixed;top:0;left:0;opacity:0;pointer-events:none;z-index:-1;border:0;width:${width}px;height:${height}px`;
  f.src = '/community/';
  document.body.appendChild(f);
  try {
    await new Promise((res, rej) => {
      f.onload = res; f.onerror = () => rej(new Error('load'));
      setTimeout(() => rej(new Error('timeout')), 15000);
    });
    const win = f.contentWindow, d = win.document;
    await d.fonts.ready;
    const header = d.querySelector('header'), footer = d.querySelector('footer'), main = d.querySelector('main');
    return {
      title: d.title,
      robots: d.querySelector('meta[name="robots"]') ? d.querySelector('meta[name="robots"]').content : null,
      h1s: [...main.querySelectorAll('h1')].map((e) => norm(e.textContent)),
      mainText: norm(main.innerText),
      forms: d.querySelectorAll('form').length,
      inputs: d.querySelectorAll('input, select, textarea').length,
      headerLinks: [...header.querySelectorAll('a')].map((a) => a.getAttribute('href')),
      headerNavs: header.querySelectorAll('nav').length,
      footerLinks: [...footer.querySelectorAll('a')].map((a) => a.getAttribute('href')),
      hOverflow: d.documentElement.scrollWidth > d.documentElement.clientWidth,
    };
  } finally { f.remove(); }
}

let checks = 0; const fails = [];
const note = (ok, msg) => { checks++; if (!ok) fails.push(msg); };

note((await fetch('/community/')).status === 200, '/community/ does not return 200');
const bySize = {};
for (const s of WIDTHS) bySize[s.label] = await inFrame(s.w, s.h);

for (const [label, p] of Object.entries(bySize)) {
  note(p.h1s.length === 1 && p.h1s[0] === HERO.h1, `${label}: h1 = ${JSON.stringify(p.h1s)}`);
  note(p.mainText.includes(HERO.eyebrow), `${label}: eyebrow missing`);
  note(p.mainText.includes(norm(HERO.support)), `${label}: support line missing`);
  for (const v of VALUES) {
    const n = p.mainText.split(v).length - 1;
    note(n === 1, `${label}: value "${v}" appears ${n}× (expected 1)`);
  }
  note(p.forms === 0, `${label}: ${p.forms} form(s) — step 1 must have none`);
  note(p.inputs === 0, `${label}: ${p.inputs} input(s) — step 1 must have none`);
  note(p.headerNavs === 0, `${label}: header carries navigation — chrome is not minimal`);
  note(JSON.stringify(p.headerLinks) === '["/"]', `${label}: header links ${JSON.stringify(p.headerLinks)}, expected only "/"`);
  note(JSON.stringify(p.footerLinks) === '["/privacy/"]', `${label}: footer links ${JSON.stringify(p.footerLinks)}, expected only "/privacy/"`);
  note(!/\bAI\b/i.test(p.mainText), `${label}: AI mentioned`);
  note(!p.mainText.includes('וובינר'), `${label}: webinar mentioned`);
  note(!p.hOverflow, `${label}: horizontal overflow`);
  note(p.robots === null, `${label}: robots meta = ${p.robots} (page must stay indexable)`);
}

// unlinked from the presented site: no page's shared navigation points here
const others = ['/', '/product/', '/solutions/', '/about/', '/contact/'];
for (const r of others) {
  const html = await (await fetch(r)).text();
  note(!html.includes('href="/community/"'), `${r}: links to /community/ — must stay out of the navigation`);
}
note((await (await fetch('/sitemap-0.xml')).text()).includes('community/'), 'community missing from the sitemap (indexable by decision)');

const summary = fails.length ? 'RED' : 'GREEN';
console.log(summary === 'RED' ? `RED — ${fails.length}/${checks} failed` : `GREEN — ${checks}/${checks} passed`);
fails.forEach((x) => console.log('  ✗', x));
({ summary, checks, failures: fails });
