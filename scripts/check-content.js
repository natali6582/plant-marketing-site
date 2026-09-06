/*
  Content and visibility regression check — run in the browser against a running preview.

  Covers five contracts that must keep holding after any later change:

    1. Webinar visibility (step 2A) — /webinar/ stays live and untouched, and is
       not linked from the presented site: no link to it anywhere, no strip on the
       home page or /product/. It is NOT hidden: it stays in the sitemap and carries
       no noindex, so search engines can still find and list it. Unlinked is not the
       same as unreachable. Its own metadata is pinned by hash, because the page is
       edit-forbidden.
    2. AI removal (step 2B) — no AI mention in the displayed text, navigation,
       title, meta description or Open Graph of any route. /webinar/ is exempt for
       its OWN content and metadata; the shared header/footer is in scope there too.
    3. The approved /product/ copy, and the lead-form contract behind it — every
       field's name, type, required flag and autocomplete pinned, so a later edit
       cannot quietly change what the form collects.
    4. No blank region. A removed section must not leave an empty band, and the
       scroll reveal must not make a region render empty when it should have content.
    5. The pension calculator contract (step 11) — inputs, Excel-pinned cases,
       annual output, sensitivity grid, accessibility and side-effect isolation.

  These started life as one-off console snippets during steps 2A and 2B. They live
  in a file so a later change cannot break them silently.

  How to run:
    npm run build && npm run preview
    open http://localhost:4321/ , DevTools console, paste this whole file

  Before taking a screenshot of a scrolled region, call
  await window.__prepareCapture(y) — it kills smooth scrolling, jumps instantly,
  waits for the reveal transition to finish and for two animation frames, and
  reports whether the region actually painted. A screenshot taken without it can
  show an empty page that is not empty.
*/

const ROUTES = [
  '/', '/product/', '/solutions/', '/webinar/', '/about/',
  '/contact/', '/privacy/', '/accessibility/', '/404.html',
];

// /webinar/ is edit-forbidden. Two source strings — its title and its description —
// reach four DOM fields, because BaseLayout copies them into og:title and
// og:description. The bundle of all four is pinned by hash.
//
// The <main> pin deliberately strips <script> tags before hashing: the shared
// LeadForm component renders inside this page's <main>, and the URL of its
// bundled script is a build fingerprint, not page content — it changed when the
// submit logic moved to src/scripts/lead-submit.ts while the rendered content
// stayed byte-identical (verified against the pre-refactor build: both sides
// normalise to the same hash and length).
const WEBINAR_MAIN_HASH = '9b6ab007a49d974a';
const WEBINAR_META_BUNDLE_HASH = '3e6bf22ecb2c19f8';

const PRODUCT = {
  title: 'הפלטפורמה | Plan-T',
  description: 'Plan-T מרכזת במקום אחד את נתוני הנכסים הפיננסיים והפנסיוניים של הלקוח ושל התא המשפחתי, ומאפשרת למתכננים פיננסיים לקבל תמונה רחבה של החשיפות והקצאת הנכסים.',
  strings: [
    'הפלטפורמה',
    'Plan-T מרכזת במקום אחד את נתוני הנכסים הפיננסיים והפנסיוניים של הלקוח ושל התא המשפחתי, ומציגה תמונה רחבה של החשיפות והקצאת הנכסים.',
    'מידע מרוכז. תמונה רחבה.',
    'המידע הפיננסי והפנסיוני מפוזר בין מערכות ומקורות שונים. Plan-T מרכזת אותו במקום אחד, כך שמתכננים פיננסיים יכולים לבחון את התיק ואת החשיפות בצורה ברורה ומסודרת.',
    'היתרונות המרכזיים',
    'רוצים לראות את הפלטפורמה בפעולה?',
  ],
  advantages: [
    'מבט רחב ומקיף על כלל נכסי הלקוח',
    'ממשק נוח ואינטואיטיבי שנבנה בשיתוף קהילת המשתמשים',
    'יכולות אנליטיות מתקדמות התומכות בקבלת החלטות',
    'התאמה לשוק הישראלי ולצרכים של מתכננים פיננסיים',
  ],
};

// The form contract. Measured on the pre-2B build, then amended once by the
// approved step-3B data decision: the role field was removed from every lead
// form (a select offering retired audiences has no place in a single-audience
// site, and monday/Make will be built to the approved form).
const PRODUCT_FORM = {
  dataSource: 'website-product',
  novalidate: true,
  submitText: 'שלחו ונחזור אליכם',
  fields: [
    { name: 'name', tag: 'input', type: 'text', required: true, autocomplete: 'name' },
    { name: 'phone', tag: 'input', type: 'tel', required: true, autocomplete: 'tel' },
    { name: 'email', tag: 'input', type: 'email', required: true, autocomplete: 'email' },
    { name: 'office', tag: 'input', type: 'text', required: false, autocomplete: 'organization' },
    { name: 'message', tag: 'textarea', type: 'textarea', required: false, autocomplete: null },
    { name: 'company_website', tag: 'input', type: 'text', required: false, autocomplete: 'off' },
    { name: 'privacy', tag: 'input', type: 'checkbox', required: true, autocomplete: null },
  ],
};

// The home page title, pinned in both places it reaches: the document title and
// the Open Graph card built from it.
const HOME_TITLE = 'Plan-T — הפלטפורמה למתכננים פיננסיים';

const DESCRIPTIONS = {
  '/': 'Plan-T מרכזת במקום אחד את נתוני הנכסים הפיננסיים והפנסיוניים של הלקוח, ומאפשרת למתכננים פיננסיים לראות את התיק בתמונה אחת ברורה.',
  '/contact/': 'השאירו פרטים ונחזור אליכם לתיאום הדגמה של Plan-T, או כתבו לנו ישירות בדוא״ל.',
  '/product/': PRODUCT.description,
};

// The retired slogan and eyebrow — forbidden everywhere, /webinar/ included
// (verified absent there), in displayed text and metadata alike.
const FORBIDDEN_COPY = ['מסוכן למתכנן', 'אל תישאר מאחור', 'תתקדם ל־'];

// The retired audience trio — gone from every route except /webinar/, which
// keeps its own content by decree.
const RETIRED_AUDIENCES = ['סוכני ביטוח', 'יועצים פנסיוניים', 'לפי תפקיד'];

// The approved single-audience copy, pinned exactly.
const HOME_HERO = {
  eyebrow: 'הפלטפורמה למתכננים פיננסיים',
  h1: 'כל תיק הלקוח. תמונה אחת ברורה.',
};
const SOLUTIONS = {
  title: 'תהליכי עבודה למתכננים פיננסיים | Plan-T',
  h1: 'תהליכי עבודה למתכננים פיננסיים',
  navLabel: 'תהליכי עבודה',
  h2s: ['לפני הפגישה', 'במהלך התכנון', 'לאחר הפגישה'],
};
const FOOTER_BLURB = 'פלטפורמה למתכננים פיננסיים בישראל.';
const ABOUT_DESCRIPTION = 'מי אנחנו: פלטפורמה ישראלית שנבנית יחד עם מתכננים פיננסיים.';

// Copy that left with the AI section and must not come back anywhere.
const RETIRED_AI_COPY = [
  'תמצות תיק לקוח', 'טיוטת סיכום פגישה', 'איתור פערים',
  'אמון, לא קסמים', 'כל תוצר AI', 'עושה בשבילכם',
];

// Scroll offsets that must render content, per route.
const CAPTURE_OFFSETS = { '/': [0, 1450, 2500], '/product/': [0, 800] };

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
const countAI = (s) => (norm(s).match(/\bAI\b/gi) || []).length;
const hex = (buf) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('').slice(0, 16);

async function sha(str) {
  return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)));
}

const meta = (d, sel) => { const el = d.querySelector(sel); return el ? el.content : null; };

/*
  Can this window paint at all?

  IntersectionObserver callbacks are delivered in the same "update the rendering"
  step as requestAnimationFrame. A window that is never given a rendering
  opportunity therefore never fires either — and document.visibilityState is NOT a
  reliable proxy for it: an automation pane can report "visible" while compositing
  nothing. Probing rAF directly is the only honest test, and it decides whether a
  reveal that did not fire is a defect in the site or a limit of the environment.
*/
async function canRender(win) {
  if (win.__canRender === undefined) {
    win.__canRender = await new Promise((res) => {
      let done = false;
      const fin = (v) => { if (!done) { done = true; res(v); } };
      win.requestAnimationFrame(() => fin(true));
      win.setTimeout(() => fin(false), 800);
    });
  }
  return win.__canRender;
}

/*
  Settle a window at a scroll offset so that what is on screen is what a reader
  would see. Smooth scrolling is switched off first — with it on, scrollTo starts
  an animation and a screenshot taken straight after catches the page mid-flight,
  which is how a fully populated page can photograph as blank.
*/
async function settleAt(win, y) {
  const doc = win.document;
  const prev = doc.documentElement.style.scrollBehavior;
  doc.documentElement.style.scrollBehavior = 'auto';
  win.scrollTo(0, y);

  /*
    A hidden or backgrounded tab does not fire requestAnimationFrame at all and
    clamps setTimeout to roughly one second. A frame-by-frame wait therefore either
    hangs forever or takes minutes — so every wait here races rAF against a timer,
    and the whole settle uses a small fixed number of ticks rather than a loop.
  */
  const frame = () => new Promise((r) => {
    let done = false;
    const fin = () => { if (!done) { done = true; r(); } };
    win.requestAnimationFrame(fin);
    win.setTimeout(fin, 50);
  });
  const tick = (ms) => new Promise((r) => win.setTimeout(r, ms));
  const visibleFraction = (el) => {
    const r = el.getBoundingClientRect();
    const shown = Math.min(r.bottom, win.innerHeight) - Math.max(r.top, 0);
    return r.height > 0 ? Math.max(0, shown) / r.height : 0;
  };

  // Anything the reveal observer will fire on (its threshold is 0.15) must reach
  // its visible state before we look.
  const pending = () => [...doc.querySelectorAll('.reveal')]
    .filter((el) => visibleFraction(el) >= 0.15 && !el.classList.contains('is-visible'));

  // Give the observer a tick to fire, a second one if anything is still pending,
  // then the 0.5s reveal transition, then two frames so it has painted.
  await tick(120);
  if (pending().length) await tick(400);
  await tick(600);
  await frame();
  await frame();

  doc.documentElement.style.scrollBehavior = prev;

  /*
    A window with no rendering opportunities is never sent IntersectionObserver
    callbacks, so the reveal cannot fire however long we wait. Rather than
    photograph a page that looks empty but is not, put the elements a reader would
    already be seeing into their revealed state — and report that it was forced, so
    the screenshot is honest about how it was produced. The reveal contract itself
    is not judged from here.
  */
  const renders = await canRender(win);
  const forcedReveal = renders ? [] : pending();
  if (forcedReveal.length) {
    forcedReveal.forEach((el) => el.classList.add('is-visible'));
    await tick(120);
  }

  // Is anything actually there? Sample a grid and require painted, inked content.
  const pts = [];
  for (let fx = 0.2; fx <= 0.81; fx += 0.3) {
    for (let fy = 0.15; fy <= 0.86; fy += 0.175) pts.push([win.innerWidth * fx, win.innerHeight * fy]);
  }
  let painted = 0;
  for (const [x, py] of pts) {
    const el = doc.elementFromPoint(x, py);
    if (!el) continue;
    const cs = win.getComputedStyle(el);
    if (parseFloat(cs.opacity) <= 0.05 || cs.visibility === 'hidden') continue;
    const inked = norm(el.innerText).length > 0 || ['IMG', 'SVG', 'PICTURE'].includes(el.tagName);
    if (inked) painted++;
  }
  /*
    A hidden document is never sent IntersectionObserver callbacks, so the site's
    scroll reveal cannot fire and `stillHidden` says nothing about the site. Report
    that as an environment limitation rather than a failure — but prove the reveal
    mechanism itself is sound, so a genuinely broken one is still caught: an element
    carrying `is-visible` must compute to full opacity.
  */
  const notDelivered = !renders && forcedReveal.length > 0;
  let mechanismOk = true;
  const probeEl = doc.querySelector('.reveal');
  if (probeEl) {
    const had = probeEl.classList.contains('is-visible');
    const prevTransition = probeEl.style.transition;
    // The reveal fades over 0.5s. Read the settled value, not the first frame of
    // the transition, or the probe measures the animation instead of the rule.
    probeEl.style.transition = 'none';
    probeEl.classList.add('is-visible');
    void probeEl.offsetHeight;
    mechanismOk = parseFloat(win.getComputedStyle(probeEl).opacity) > 0.99;
    if (!had) probeEl.classList.remove('is-visible');
    probeEl.style.transition = prevTransition;
  }
  return {
    requested: y, scrollY: win.scrollY, samples: pts.length, painted,
    stillHidden: pending().length, blank: painted === 0,
    revealNotDelivered: notDelivered, revealForced: forcedReveal.length,
    revealMechanismOk: mechanismOk, documentHidden: doc.hidden, rendersFrames: renders,
  };
}

// Exposed so a screenshot of the top window can be trusted.
window.__prepareCapture = (y) => settleAt(window, y);

async function inFrame(route, width = 1280) {
  const f = document.createElement('iframe');
  f.style.cssText = `position:fixed;top:0;left:0;opacity:0;pointer-events:none;z-index:-1;border:0;width:${width}px;height:900px`;
  f.src = route;
  document.body.appendChild(f);
  try {
    await new Promise((res, rej) => {
      f.onload = res;
      f.onerror = () => rej(new Error('load failed'));
      setTimeout(() => rej(new Error('timeout')), 15000);
    });
    const win = f.contentWindow;
    const d = win.document;
    await d.fonts.ready;
    const header = d.querySelector('header');
    const footer = d.querySelector('footer');
    const main = d.querySelector('main');
    const form = main && main.querySelector('form.lead-form');
    const secs = [...d.querySelectorAll('main > section, main > div > section')];
    const gaps = secs.slice(1).map((s, i) =>
      Math.round(s.getBoundingClientRect().top - secs[i].getBoundingClientRect().bottom));

    const metaBundle = {
      title: d.title,
      description: meta(d, 'meta[name="description"]'),
      ogTitle: meta(d, 'meta[property="og:title"]'),
      ogDescription: meta(d, 'meta[property="og:description"]'),
    };

    const captures = [];
    for (const y of (CAPTURE_OFFSETS[route] || [])) captures.push(await settleAt(win, y));
    win.scrollTo(0, 0);

    return {
      ...metaBundle,
      metaBundleHash: await sha(JSON.stringify(metaBundle)),
      headerText: norm(header && header.innerText),
      footerText: norm(footer && footer.innerText),
      mainText: norm(main && main.innerText),
      mainHash: await sha((main ? main.innerHTML : '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')),
      webinarLinks: d.querySelectorAll('a[href*="/webinar/"]').length,
      strip: d.querySelectorAll('#webinar-strip-title').length,
      robots: meta(d, 'meta[name="robots"]'),
      productLinkLabels: [...d.querySelectorAll('a[href="/product/"]')].map((a) => norm(a.textContent)),
      productLinksHeader: header ? header.querySelectorAll('a[href="/product/"]').length : 0,
      productLinksFooter: footer ? footer.querySelectorAll('a[href="/product/"]').length : 0,
      h1s: main ? [...main.querySelectorAll('h1')].map((e) => norm(e.textContent)) : [],
      h2s: main ? [...main.querySelectorAll('h2')].map((e) => norm(e.textContent)) : [],
      // The page's own headings, excluding the shared lead-form section, whose
      // heading is a component's and is pinned separately.
      h2sOwn: main ? [...main.querySelectorAll('h2')]
        .filter((e) => !e.closest('#lead-form')).map((e) => norm(e.textContent)) : [],
      formSource: form ? form.dataset.source : null,
      formNovalidate: form ? form.hasAttribute('novalidate') : null,
      formSubmitText: form ? norm(form.querySelector('button[type="submit"]').textContent) : null,
      formFields: form ? [...form.querySelectorAll('[name]')].map((e) => ({
        name: e.name, tag: e.tagName.toLowerCase(), type: e.type || null,
        required: e.required === true, autocomplete: e.getAttribute('autocomplete'),
      })) : null,
      gaps, captures,
    };
  } finally {
    f.remove();
  }
}

const page = {};
for (const r of ROUTES) page[r] = await inFrame(r);

let checks = 0;
const fails = [];
// Things this environment could not verify. Never silent: they are reported
// alongside the result so a green run cannot hide an unchecked contract.
const unverified = [];
const note = (ok, msg) => { checks++; if (!ok) fails.push(msg); };

// --- 1. webinar visibility -------------------------------------------------
for (const r of ROUTES) {
  note(page[r].webinarLinks === 0, `${r}: ${page[r].webinarLinks} link(s) to /webinar/`);
  note(page[r].strip === 0, `${r}: webinar strip present`);
  note(page[r].robots === null, `${r}: robots meta = ${page[r].robots}`);
}
note(page['/webinar/'].mainHash === WEBINAR_MAIN_HASH,
  `/webinar/ <main> changed: ${page['/webinar/'].mainHash} ≠ ${WEBINAR_MAIN_HASH}`);
note(page['/webinar/'].metaBundleHash === WEBINAR_META_BUNDLE_HASH,
  `/webinar/ metadata changed: ${page['/webinar/'].metaBundleHash} ≠ ${WEBINAR_META_BUNDLE_HASH}`);
note(page['/webinar/'].ogTitle === page['/webinar/'].title, '/webinar/ og:title no longer mirrors title');
note(page['/webinar/'].ogDescription === page['/webinar/'].description, '/webinar/ og:description no longer mirrors description');
note((await (await fetch('/sitemap-0.xml')).text()).includes('/webinar/'), '/webinar/ missing from sitemap-0.xml');
note((await fetch('/webinar/')).status === 200, '/webinar/ does not return 200');

// --- 2. AI removal ---------------------------------------------------------
for (const r of ROUTES) {
  const p = page[r];
  // The shared chrome is in scope on every route, /webinar/ included.
  const nav = countAI(p.headerText) + countAI(p.footerText);
  note(nav === 0, `${r}: ${nav} AI mention(s) in the header/footer navigation`);
  if (r === '/webinar/') continue; // its own content and metadata are exempt by decree
  const own = countAI(p.title) + countAI(p.description) + countAI(p.ogTitle) + countAI(p.ogDescription);
  note(own === 0, `${r}: ${own} AI mention(s) in title/description/og`);
  note(countAI(p.mainText) === 0, `${r}: AI in displayed text`);
  for (const s of RETIRED_AI_COPY) note(!p.mainText.includes(s), `${r}: retired AI copy — "${s}"`);
}
note(countAI(page['/webinar/'].mainText) > 0, '/webinar/ lost its own content');

// --- 3. approved copy and the form contract --------------------------------
for (const [r, d] of Object.entries(DESCRIPTIONS)) {
  note(norm(page[r].description) === norm(d), `${r}: description does not match the approved text`);
}
note(page['/product/'].title === PRODUCT.title, `/product/ title = "${page['/product/'].title}"`);
for (const s of PRODUCT.strings) {
  note(page['/product/'].mainText.includes(norm(s)), `/product/ missing approved string — "${s.slice(0, 40)}…"`);
}
for (const a of PRODUCT.advantages) {
  const n = page['/product/'].mainText.split(norm(a)).length - 1;
  note(n === 1, `/product/ advantage appears ${n}× (expected 1) — "${a}"`);
}
note(page['/product/'].formSource === PRODUCT_FORM.dataSource,
  `/product/ form data-source = ${page['/product/'].formSource}`);
note(page['/product/'].formNovalidate === PRODUCT_FORM.novalidate, '/product/ form novalidate changed');
note(page['/product/'].formSubmitText === PRODUCT_FORM.submitText,
  `/product/ submit label = "${page['/product/'].formSubmitText}"`);
note(JSON.stringify(page['/product/'].formFields) === JSON.stringify(PRODUCT_FORM.fields),
  `/product/ form contract changed: ${JSON.stringify(page['/product/'].formFields)}`);
// step 3B: the role select is gone from every route, /webinar/ included — the
// shared component renders there too, and the removal is a data decision.
for (const r of ROUTES) {
  const roleFields = (page[r].formFields || []).filter((x) => x.name === 'role').length;
  note(roleFields === 0, `${r}: a role field is still collected`);
}
note(page['/privacy/'].mainText.includes('שם מלא, טלפון, כתובת דוא״ל, שם המשרד ותוכן'),
  'privacy: the amended data list is missing');
note(!page['/privacy/'].mainText.includes('שם המשרד, תפקיד'),
  'privacy: the data list still names the role field');
/*
  The shared navigation carries exactly three links to /product/ on every route:
  two in the header (the desktop nav and the mobile nav render from one array) and
  one in the footer. Counting them matters — a filter over the labels alone also
  passes when every link has disappeared, which is a worse regression than a wrong
  label. Each label must equal the approved word exactly, not merely contain it.
*/
for (const r of ROUTES) {
  const p = page[r];
  note(p.productLinksHeader === 2, `${r}: ${p.productLinksHeader} header link(s) to /product/, expected 2`);
  note(p.productLinksFooter === 1, `${r}: ${p.productLinksFooter} footer link(s) to /product/, expected 1`);
  note(p.productLinkLabels.length === 3, `${r}: ${p.productLinkLabels.length} link(s) to /product/, expected 3`);
  const wrong = p.productLinkLabels.filter((l) => l !== 'הפלטפורמה');
  note(wrong.length === 0, `${r}: /product/ link label(s) ${JSON.stringify(wrong)}, expected exactly "הפלטפורמה"`);
}

/*
  The approved heading outline of /product/. Searching mainText proves the words are
  somewhere on the page; it does not prove they are headings, nor that they are in
  the approved order.
*/
note(page['/product/'].h1s.length === 1, `/product/ has ${page['/product/'].h1s.length} h1, expected 1`);
note(page['/product/'].h1s[0] === 'הפלטפורמה', `/product/ h1 = "${page['/product/'].h1s[0]}"`);
note(page['/product/'].h2sOwn.length === 2,
  `/product/ has ${page['/product/'].h2sOwn.length} own h2, expected 2 — ${JSON.stringify(page['/product/'].h2sOwn)}`);
note(page['/product/'].h2sOwn[0] === 'מידע מרוכז. תמונה רחבה.', `/product/ first h2 = "${page['/product/'].h2sOwn[0]}"`);
note(page['/product/'].h2sOwn[1] === 'היתרונות המרכזיים', `/product/ second h2 = "${page['/product/'].h2sOwn[1]}"`);

// The home title, in the document and in the Open Graph card built from it.
note(page['/'].title === HOME_TITLE, `/ title = "${page['/'].title}"`);
note(page['/'].ogTitle === HOME_TITLE, `/ og:title = "${page['/'].ogTitle}"`);

// --- step 3A: the single-audience contract ---------------------------------
for (const r of ROUTES) {
  const p = page[r];
  const everywhere = [p.title, p.description, p.ogTitle, p.ogDescription,
    p.headerText, p.footerText, r === '/webinar/' ? '' : p.mainText].map(norm).join(' | ');
  for (const f of FORBIDDEN_COPY) {
    note(!everywhere.includes(f), `${r}: forbidden copy present — "${f}"`);
  }
  if (r !== '/webinar/') {
    const own = [p.title, p.description, p.ogTitle, p.ogDescription, p.mainText].map(norm).join(' | ');
    for (const a of RETIRED_AUDIENCES) {
      note(!own.includes(a), `${r}: retired audience wording — "${a}"`);
    }
  }
  // the shared navigation carries neither, on any route
  const navText = norm(p.headerText) + ' | ' + norm(p.footerText);
  for (const a of RETIRED_AUDIENCES) {
    note(!navText.includes(a), `${r}: retired audience wording in the navigation — "${a}"`);
  }
}
note(page['/'].mainText.includes(HOME_HERO.eyebrow), `/ hero eyebrow missing`);
note(page['/'].h1s.length === 1 && page['/'].h1s[0] === HOME_HERO.h1,
  `/ h1 = ${JSON.stringify(page['/'].h1s)}`);
note(page['/solutions/'].title === SOLUTIONS.title, `/solutions/ title = "${page['/solutions/'].title}"`);
note(page['/solutions/'].h1s.length === 1 && page['/solutions/'].h1s[0] === SOLUTIONS.h1,
  `/solutions/ h1 = ${JSON.stringify(page['/solutions/'].h1s)}`);
note(JSON.stringify(page['/solutions/'].h2sOwn) === JSON.stringify(SOLUTIONS.h2s),
  `/solutions/ h2 outline = ${JSON.stringify(page['/solutions/'].h2sOwn)}`);
note(page['/'].footerText.includes(FOOTER_BLURB), `footer blurb missing or changed`);
note(norm(page['/about/'].description) === norm(ABOUT_DESCRIPTION),
  `/about/ description = "${page['/about/'].description}"`);
// the nav label for /solutions/ on every route
for (const r of ROUTES) {
  const d = page[r];
  note(d.headerText.includes(SOLUTIONS.navLabel), `${r}: nav label "${SOLUTIONS.navLabel}" missing from header`);
}

// --- 4. nothing renders blank ---------------------------------------------
for (const r of ['/', '/product/']) {
  const bad = page[r].gaps.filter((g) => g > 2);
  note(bad.length === 0, `${r}: empty band between sections — gaps ${JSON.stringify(page[r].gaps)}`);
  for (const c of page[r].captures) {
    note(!c.blank, `${r} at y=${c.requested}: region rendered blank (0/${c.samples} sample points painted)`);
    note(c.revealMechanismOk, `${r} at y=${c.requested}: .reveal + .is-visible does not reach full opacity`);
    if (c.revealNotDelivered) {
      unverified.push(`${r} at y=${c.requested}: reveal not verified — this window gets no rendering opportunities (requestAnimationFrame never fires), so no IntersectionObserver callbacks are delivered; ${c.revealForced} element(s) were forced visible for the capture`);
    } else {
      note(c.stillHidden === 0, `${r} at y=${c.requested}: ${c.stillHidden} reveal element(s) never became visible`);
    }
  }
}

// --- 5. pension calculator contract (step 11, RED-first) -------------------
//
// This block is deliberately separate from ROUTES. The generic marketing-page
// copy rules above do not apply to knowledge-center audience labels. The fixture
// subset is copied from src/data/model-fixtures.json, SHA-256
// 04dcf064b6524a59be54041aa126c6a1cb94189ded171f289bf6acd799c785c6.
// The source gate remains scripts/check-model.mjs; these values are only the
// browser-facing examples needed to prove the UI maps inputs correctly.
const PENSION_ROUTE = '/knowledge/fee-impact-calculator/';
const PENSION_TITLE = 'השפעת דמי ניהול מצבירה';
const PENSION_BASE = {
  id: 'base',
  inputs: { p0: 100000, deposit: 24000, salaryGrowth: 0.02, ret: 0.04, feeAum: 0.005, years: 10 },
  expected: 447626.821064296,
};
const PENSION_CASES = [
  PENSION_BASE,
  { id: 'return-low-fee-low', inputs: { ...PENSION_BASE.inputs, ret: 0.02, feeAum: 0.002 }, expected: 403834.856599844 },
  { id: 'return-low-fee-base', inputs: { ...PENSION_BASE.inputs, ret: 0.02 }, expected: 396631.338356635 },
  { id: 'return-low-fee-high', inputs: { ...PENSION_BASE.inputs, ret: 0.02, feeAum: 0.008 }, expected: 389577.104082856 },
  { id: 'return-base-fee-low', inputs: { ...PENSION_BASE.inputs, feeAum: 0.002 }, expected: 455907.262606481 },
  { id: 'return-base-fee-high', inputs: { ...PENSION_BASE.inputs, feeAum: 0.008 }, expected: 439517.357315344 },
  { id: 'return-high-fee-low', inputs: { ...PENSION_BASE.inputs, ret: 0.06, feeAum: 0.002 }, expected: 515744.347418258 },
  { id: 'return-high-fee-base', inputs: { ...PENSION_BASE.inputs, ret: 0.06 }, expected: 506231.614995703 },
  { id: 'return-high-fee-high', inputs: { ...PENSION_BASE.inputs, ret: 0.06, feeAum: 0.008 }, expected: 496914.400149312 },
  { id: 'years-30', inputs: { ...PENSION_BASE.inputs, years: 30 }, expected: 1873370.76342911 },
  { id: 'deposit-0', inputs: { ...PENSION_BASE.inputs, deposit: 0 }, expected: 141059.876062112 },
  { id: 'p0-0', inputs: { ...PENSION_BASE.inputs, p0: 0 }, expected: 306566.945002184 },
  { id: 'salgrowth-0', inputs: { ...PENSION_BASE.inputs, salaryGrowth: 0 }, expected: 422613.311916596 },
  { id: 'n-equals-g', inputs: { ...PENSION_BASE.inputs, salaryGrowth: 0.035 }, expected: 468155.240843822 },
];
const PENSION_INPUTS = {
  p0: { label: 'יתרת פתיחה (₪)', value: '100000', min: '0', max: '1000000000', step: '0.01' },
  deposit: { label: 'הפקדה שנתית ראשונה (₪)', value: '24000', min: '0', max: '1000000000', step: '0.01' },
  salaryGrowth: { label: 'שינוי שנתי בהפקדה (%)', value: '2', min: '-100', max: '100', step: '0.01' },
  ret: { label: 'תשואה שנתית להמחשה (%)', value: '4', min: '-100', max: '100', step: '0.01' },
  feeAum: { label: 'דמי ניהול שנתיים מצבירה (%)', value: '0.5', min: '0', max: '100', step: '0.01' },
  years: { label: 'תקופת החישוב (שנים)', value: '10', min: '0', max: '100', step: '1' },
};
const PENSION_DISCLAIMER = 'הבהרה המידע באתר הוא מידע כללי בלבד. הוא אינו מהווה ייעוץ פנסיוני, שיווק פנסיוני, ייעוץ השקעות, שיווק השקעות, ייעוץ מס או ייעוץ משפטי, ואינו מותאם לנסיבותיו של אדם מסוים. הנתונים נכונים למועד העדכון המצוין ויש לאמתם מול המקור הרשמי. להחלטה אישית יש להתייעץ עם בעל רישיון מתאים.';
const PENSION_EXTRA_IDS = ['years-30', 'deposit-0', 'p0-0', 'salgrowth-0', 'n-equals-g'];
const PENSION_ORIGINAL_GRID_IDS = PENSION_CASES.slice(1, 9).map((fixture) => fixture.id);

const pensionLegacy = { checks, failures: fails.length, unverified: unverified.length };
const pensionGroupResults = [];
const pensionWait = (win, ms = 40) => new Promise((resolve) => win.setTimeout(resolve, ms));
const pensionVisible = (el, win) => {
  if (!el || el.hidden) return false;
  const style = win.getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return style.display !== 'none' && style.visibility !== 'hidden'
    && parseFloat(style.opacity || '1') > 0 && rect.width > 0 && rect.height > 0;
};
const pensionNumber = (el, attribute = 'data-value') =>
  el?.hasAttribute(attribute) ? Number(el.getAttribute(attribute)) : Number.NaN;
const pensionUiValue = (name, value) => String(
  ['salaryGrowth', 'ret', 'feeAum'].includes(name) ? value * 100 : value,
);
const pensionApprox = (actual, expected, tolerance = 1) =>
  Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
const pensionClosedForm = ({ p0, deposit, salaryGrowth, ret, feeAum, years }) => {
  if (years === 0) return p0;
  const net = 1 + ret - feeAum;
  const growth = 1 + salaryGrowth;
  const opening = p0 * (net ** years);
  const deposits = Math.abs(net - growth) < 1e-12
    ? deposit * years * (net ** (years - 1))
    : deposit * ((net ** years) - (growth ** years)) / (net - growth);
  return opening + deposits;
};
const pensionRequire = (condition, message) => {
  if (!condition) throw new Error(message);
};

async function pensionLoadFrame() {
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;z-index:-1;border:0;width:1280px;height:900px';
  frame.src = PENSION_ROUTE;
  document.body.appendChild(frame);
  await new Promise((resolve, reject) => {
    frame.onload = resolve;
    frame.onerror = () => reject(new Error('calculator route load failed'));
    setTimeout(() => reject(new Error('calculator route timed out')), 15000);
  });
  await frame.contentWindow.document.fonts.ready;
  await pensionWait(frame.contentWindow, 120);
  return frame;
}

function pensionContext(frame) {
  const win = frame.contentWindow;
  const doc = win.document;
  const root = doc.querySelector('[data-pension-calculator="aum-v1"]');
  return { frame, win, doc, root, form: root && root.querySelector('[data-pension-form]') };
}

function pensionNeedRoot(frame) {
  const context = pensionContext(frame);
  pensionRequire(context.root, 'calculator root missing');
  pensionRequire(context.form, 'calculator form missing');
  return context;
}

async function pensionDrive(frame, inputs, { submit = true } = {}) {
  const { win, root, form } = pensionNeedRoot(frame);
  for (const [name, value] of Object.entries(inputs)) {
    const control = root.querySelector(`#pension-input-${name}`);
    pensionRequire(control, `input ${name} missing`);
    control.value = pensionUiValue(name, value);
    control.dispatchEvent(new win.Event('input', { bubbles: true }));
    control.dispatchEvent(new win.Event('change', { bubbles: true }));
  }
  if (submit) form.requestSubmit();
  await pensionWait(win, 80);
  return pensionNeedRoot(frame);
}

async function pensionDriveRaw(frame, overrides) {
  await pensionDrive(frame, PENSION_BASE.inputs);
  const { win, root, form } = pensionNeedRoot(frame);
  for (const [name, value] of Object.entries(overrides)) {
    const control = root.querySelector(`#pension-input-${name}`);
    pensionRequire(control, `input ${name} missing`);
    control.value = value;
    control.dispatchEvent(new win.Event('input', { bubbles: true }));
  }
  form.requestSubmit();
  await pensionWait(win, 80);
  return pensionNeedRoot(frame);
}

async function pensionGroup(id, run) {
  try {
    await run();
    note(true, `[${id}] pension calculator contract`);
    pensionGroupResults.push({ id, result: 'PASS' });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    note(false, `[${id}] ${detail}`);
    pensionGroupResults.push({ id, result: 'FAIL', detail });
  }
}

let pensionFrame;
try {
  pensionFrame = await pensionLoadFrame();
  const pensionResponse = await fetch(PENSION_ROUTE, { cache: 'no-store' });

  await pensionGroup('C01', async () => {
    const { doc, root } = pensionContext(pensionFrame);
    const h1s = [...doc.querySelectorAll('main h1')].map((el) => norm(el.textContent));
    pensionRequire(pensionResponse.status === 200, `route status ${pensionResponse.status}, expected 200`);
    pensionRequire(doc.querySelectorAll('[data-pension-calculator="aum-v1"]').length === 1,
      `calculator root count ${doc.querySelectorAll('[data-pension-calculator="aum-v1"]').length}, expected 1`);
    pensionRequire(root && h1s.length === 1 && h1s[0] === PENSION_TITLE,
      `h1 mismatch: ${JSON.stringify(h1s)}`);
    pensionRequire(doc.title.includes(PENSION_TITLE), `title mismatch: ${doc.title}`);
  });

  await pensionGroup('C02', async () => {
    const { root } = pensionNeedRoot(pensionFrame);
    const controls = [...root.querySelectorAll('[data-pension-form] input[type="number"]')];
    pensionRequire(controls.length === 6, `numeric input count ${controls.length}, expected 6`);
    for (const [name, expected] of Object.entries(PENSION_INPUTS)) {
      const control = root.querySelector(`#pension-input-${name}`);
      const label = control && root.querySelector(`label[for="${control.id}"]`);
      pensionRequire(control && control.name === name, `${name}: missing or wrong name`);
      pensionRequire(label && norm(label.textContent) === expected.label, `${name}: label mismatch`);
      for (const attr of ['value', 'min', 'max', 'step']) {
        pensionRequire(control.getAttribute(attr) === expected[attr],
          `${name}: ${attr}=${control.getAttribute(attr)}, expected ${expected[attr]}`);
      }
      pensionRequire(control.required, `${name}: required missing`);
    }
  });

  await pensionGroup('C03', async () => {
    const { win, root } = pensionNeedRoot(pensionFrame);
    const section = root.querySelector('#pension-assumptions');
    const text = norm(section && section.innerText);
    pensionRequire(pensionVisible(section, win), 'illustrative assumptions are not visible');
    for (const copy of [
      'הנחות להמחשה — לא תקרות רגולטוריות',
      'הערכים ההתחלתיים נועדו להמחשה בלבד וניתנים לשינוי. ההפקדה מתבצעת בסוף כל שנה. התשואה ודמי הניהול מחושבים על יתרת הפתיחה. החישוב אינו כולל דמי ניהול מהפקדה, משיכות או מסים.',
      'טווחי הקלט מגבילים את ההדגמה ואינם תקרות חוקיות.',
    ]) pensionRequire(text.includes(copy), `assumptions copy missing: ${copy}`);
  });

  await pensionGroup('C04', async () => {
    const { win, doc } = pensionNeedRoot(pensionFrame);
    const blocks = [...doc.querySelectorAll('aside[aria-label="הבהרה"]')];
    pensionRequire(blocks.length === 1, `disclaimer count ${blocks.length}, expected 1`);
    pensionRequire(pensionVisible(blocks[0], win), 'disclaimer is not visible');
    pensionRequire(norm(blocks[0].innerText) === PENSION_DISCLAIMER, 'disclaimer text changed');
  });

  await pensionGroup('C05', async () => {
    const { win, doc, root } = pensionNeedRoot(pensionFrame);
    const target = root.querySelector('#pension-methodology');
    const link = root.querySelector('a[href="#pension-methodology"]');
    pensionRequire(link && target, 'same-page methodology link/target missing');
    pensionRequire(pensionVisible(target, win), 'methodology target is not visible');
    pensionRequire(norm(target.innerText).includes('תשואות שליליות נבדקו בבדיקות חישוב, אך עדיין אינן מכוסות בתרחישי Excel מאומתים.'),
      'negative-return evidence limitation missing');
    pensionRequire(doc.getElementById(link.getAttribute('href').slice(1)) === target, 'methodology link does not resolve');
  });

  await pensionGroup('C06', async () => {
    const { win, root } = pensionNeedRoot(pensionFrame);
    const controls = [...root.querySelectorAll('[data-pension-form] input')];
    pensionRequire(root.dataset.state === 'ready', `initial state ${root.dataset.state}, expected ready`);
    pensionRequire(controls.length === 6 && controls.every((el) => !el.matches(':disabled')),
      'controls not enabled after initialization');
    pensionRequire(pensionVisible(root.querySelector('[data-pension-results]'), win), 'initial results not visible');
  });

  await pensionGroup('C07', async () => {
    await pensionDrive(pensionFrame, PENSION_BASE.inputs);
    const { root } = pensionNeedRoot(pensionFrame);
    const balance = root.querySelector('[data-pension-balance]');
    const raw = pensionNumber(balance);
    const formatted = new Intl.NumberFormat('he-IL', {
      style: 'currency', currency: 'ILS', minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(raw).replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\s]/g, '');
    const actual = norm(balance && balance.textContent).replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\s]/g, '');
    pensionRequire(pensionApprox(raw, PENSION_BASE.expected), `base balance ${raw}, expected ${PENSION_BASE.expected}`);
    pensionRequire(actual.includes(formatted), `formatted balance ${actual}, expected ${formatted}`);
  });

  await pensionGroup('C08', async () => {
    await pensionDrive(pensionFrame, PENSION_BASE.inputs);
    const { root } = pensionNeedRoot(pensionFrame);
    const table = root.querySelector('[data-pension-years]');
    const rows = [...table.querySelectorAll('tbody tr')];
    const headers = [...table.querySelectorAll('thead th')].map((el) => norm(el.textContent));
    pensionRequire(JSON.stringify(headers) === JSON.stringify(['שנה', 'יתרת פתיחה', 'הפקדה', 'תשואה', 'דמי ניהול מצבירה', 'יתרת סגירה']),
      `annual headers mismatch: ${JSON.stringify(headers)}`);
    pensionRequire(rows.length === 10, `annual row count ${rows.length}, expected 10`);
    rows.forEach((row, index) => {
      pensionRequire(Number(row.dataset.year) === index + 1, `annual year ${index + 1} missing`);
      const amounts = [...row.querySelectorAll('td[data-field]')];
      pensionRequire(amounts.length === 5 && amounts.every((cell) => Number.isFinite(pensionNumber(cell))),
        `year ${index + 1}: non-finite or missing amount`);
    });
    const finalClose = pensionNumber(rows.at(-1).querySelector('[data-field="close"]'));
    pensionRequire(pensionApprox(finalClose, pensionNumber(root.querySelector('[data-pension-balance]'))),
      'annual final close does not reconcile with headline');
  });

  await pensionGroup('C09', async () => {
    await pensionDrive(pensionFrame, PENSION_BASE.inputs);
    const { root } = pensionNeedRoot(pensionFrame);
    const grid = root.querySelector('[data-pension-sensitivity]');
    const fees = [...grid.querySelectorAll('thead th[data-fee-aum]')].map((el) => Number(el.dataset.feeAum));
    const returns = [...grid.querySelectorAll('tbody th[data-return]')].map((el) => Number(el.dataset.return));
    const cells = [...grid.querySelectorAll('td[data-return][data-fee-aum]')];
    const ascending = (values) => values.length === 5 && new Set(values).size === 5
      && values.every((value, index) => index === 0 || value > values[index - 1]);
    pensionRequire(ascending(fees) && ascending(returns), `axes invalid: ${JSON.stringify({ fees, returns })}`);
    pensionRequire(JSON.stringify(fees) === JSON.stringify([0.003, 0.004, 0.005, 0.006, 0.007]), `default fee axis ${JSON.stringify(fees)}`);
    pensionRequire(JSON.stringify(returns) === JSON.stringify([0.02, 0.03, 0.04, 0.05, 0.06]), `default return axis ${JSON.stringify(returns)}`);
    pensionRequire(cells.length === 25 && cells.every((cell) => Number.isFinite(pensionNumber(cell))),
      `default numeric grid count ${cells.filter((cell) => Number.isFinite(pensionNumber(cell))).length}/25`);
  });

  await pensionGroup('C10', async () => {
    const { root } = pensionNeedRoot(pensionFrame);
    const baseRows = root.querySelectorAll('tbody th[data-return="0.04"][data-base-axis="true"]');
    const baseColumns = root.querySelectorAll('thead th[data-fee-aum="0.005"][data-base-axis="true"]');
    const baseCells = root.querySelectorAll('td[data-return="0.04"][data-fee-aum="0.005"][data-base-case="true"]');
    pensionRequire(baseRows.length === 1 && baseColumns.length === 1 && baseCells.length === 1,
      `base markers row=${baseRows.length}, column=${baseColumns.length}, cell=${baseCells.length}`);
    pensionRequire(norm(baseCells[0].textContent).includes('תרחיש הבסיס'), 'base marker lacks visible wording');
    pensionRequire(pensionApprox(pensionNumber(baseCells[0]), pensionNumber(root.querySelector('[data-pension-balance]'))),
      'base grid cell does not reconcile with headline');
  });

  await pensionGroup('C11', async () => {
    const fixtureByInput = {
      p0: 'p0-0', deposit: 'deposit-0', salaryGrowth: 'salgrowth-0',
      ret: 'return-high-fee-base', feeAum: 'return-base-fee-high', years: 'years-30',
    };
    for (const [name, id] of Object.entries(fixtureByInput)) {
      const fixture = PENSION_CASES.find((item) => item.id === id);
      const { root } = await pensionDrive(pensionFrame, fixture.inputs);
      pensionRequire(pensionApprox(pensionNumber(root.querySelector('[data-pension-balance]')), fixture.expected),
        `${name}: output does not match ${id}`);
      pensionRequire(root.querySelectorAll('[data-pension-years] tbody tr').length === fixture.inputs.years,
        `${name}: annual horizon does not match input snapshot`);
    }
  });

  await pensionGroup('C12', async () => {
    for (const id of PENSION_EXTRA_IDS) {
      const fixture = PENSION_CASES.find((item) => item.id === id);
      const { root } = await pensionDrive(pensionFrame, fixture.inputs);
      pensionRequire(pensionApprox(pensionNumber(root.querySelector('[data-pension-balance]')), fixture.expected),
        `${id}: headline differs from Excel cache`);
      for (const cell of root.querySelectorAll('[data-pension-years] td[data-field]')) {
        pensionRequire(Number.isFinite(pensionNumber(cell)), `${id}: non-finite raw annual cell`);
        pensionRequire(norm(cell.textContent).length > 0, `${id}: annual cell has no displayed value`);
      }
    }
  });

  await pensionGroup('C13', async () => {
    for (const id of PENSION_ORIGINAL_GRID_IDS) {
      const fixture = PENSION_CASES.find((item) => item.id === id);
      const { root } = await pensionDrive(pensionFrame, fixture.inputs);
      pensionRequire(pensionApprox(pensionNumber(root.querySelector('[data-pension-balance]')), fixture.expected),
        `${id}: percent conversion is not exactly once`);
      pensionRequire(root.querySelector('#pension-input-ret').valueAsNumber === fixture.inputs.ret * 100,
        `${id}: return control does not hold UI percent`);
      pensionRequire(root.querySelector('#pension-input-feeAum').valueAsNumber === fixture.inputs.feeAum * 100,
        `${id}: fee control does not hold UI percent`);
    }
  });

  await pensionGroup('C14', async () => {
    await pensionDrive(pensionFrame, PENSION_BASE.inputs);
    const { root } = pensionNeedRoot(pensionFrame);
    const cells = [...root.querySelectorAll('[data-pension-sensitivity] td[data-return][data-fee-aum]:not([data-invalid="true"])')];
    pensionRequire(cells.length === 25, `valid default grid count ${cells.length}, expected 25`);
    for (const cell of cells) {
      const inputs = {
        ...PENSION_BASE.inputs,
        ret: Number(cell.dataset.return),
        feeAum: Number(cell.dataset.feeAum),
      };
      pensionRequire(pensionApprox(pensionNumber(cell), pensionClosedForm(inputs)),
        `grid cell ${inputs.ret}/${inputs.feeAum} differs from independent closed form`);
    }
    const equalityInputs = PENSION_CASES.find((item) => item.id === 'n-equals-g');
    pensionRequire(pensionApprox(pensionClosedForm(equalityInputs.inputs), equalityInputs.expected),
      'independent equality-limit branch differs from Excel fixture');
  });

  await pensionGroup('C15', async () => {
    await pensionDrive(pensionFrame, PENSION_BASE.inputs);
    const { win, root } = pensionNeedRoot(pensionFrame);
    const input = root.querySelector('#pension-input-deposit');
    input.value = '1';
    input.dispatchEvent(new win.Event('input', { bubbles: true }));
    await pensionWait(win);
    const results = root.querySelector('[data-pension-results]');
    pensionRequire(root.dataset.state === 'dirty', `edit state ${root.dataset.state}, expected dirty`);
    pensionRequire(!pensionVisible(results, win), 'stale results remain visible');
    pensionRequire(norm(root.querySelector('[data-pension-status]').textContent) === 'ההנחות השתנו. לחצו על חישוב מחדש.',
      'pending status missing');
    pensionRequire(results.getBoundingClientRect().height === 0, 'hidden results reserve blank height');
    await pensionDrive(pensionFrame, { ...PENSION_BASE.inputs, deposit: 1 });
    pensionRequire(root.dataset.state === 'ready' && pensionVisible(results, win), 'successful submit did not replace outputs together');
  });

  await pensionGroup('C16', async () => {
    const cases = [
      ['blank', { deposit: '' }], ['negative amount', { p0: '-1' }],
      ['fractional year', { years: '1.5' }], ['out of range', { feeAum: '100.01' }],
      ['invalid net factor', { ret: '-100', feeAum: '1' }],
    ];
    for (const [label, raw] of cases) {
      const { win, root } = await pensionDriveRaw(pensionFrame, raw);
      const invalid = [...root.querySelectorAll('[data-pension-form] input[aria-invalid="true"]')];
      pensionRequire(root.dataset.state === 'invalid', `${label}: state is not invalid`);
      pensionRequire(pensionVisible(root.querySelector('[data-pension-error][role="alert"]'), win), `${label}: alert not visible`);
      pensionRequire(!pensionVisible(root.querySelector('[data-pension-results]'), win), `${label}: stale result visible`);
      pensionRequire(invalid.length > 0 && invalid[0] === win.document.activeElement, `${label}: first invalid control not focused`);
    }
  });

  await pensionGroup('C17', async () => {
    const invalid = await pensionDriveRaw(pensionFrame, { deposit: '' });
    pensionRequire(invalid.root.dataset.state === 'invalid', 'recovery precondition never reached invalid state');
    const { root } = await pensionDrive(pensionFrame, PENSION_BASE.inputs);
    pensionRequire(root.dataset.state === 'ready', 'valid correction did not recover to ready');
    pensionRequire(pensionApprox(pensionNumber(root.querySelector('[data-pension-balance]')), PENSION_BASE.expected),
      'recovered output differs from base fixture');
  });

  await pensionGroup('C18', async () => {
    const inputs = { ...PENSION_BASE.inputs, years: 0 };
    const { win, root } = await pensionDrive(pensionFrame, inputs);
    pensionRequire(pensionNumber(root.querySelector('[data-pension-balance]')) === inputs.p0, 'zero-year balance changed');
    pensionRequire(root.querySelectorAll('[data-pension-years] tbody tr').length === 0, 'zero-year table is not empty');
    pensionRequire(norm(root.querySelector('[data-pension-years]').textContent).includes('תקופת החישוב היא אפס שנים, ולכן היתרה נשארת ללא שינוי.'),
      'zero-year explanation missing');
    pensionRequire(root.querySelectorAll('td[data-base-case="true"]').length === 1, 'zero-year base marker is not unique');
    pensionRequire(pensionVisible(root.querySelector('[data-pension-results]'), win), 'zero-year result not visible');
  });

  await pensionGroup('C19', async () => {
    for (const inputs of [
      { ...PENSION_BASE.inputs, feeAum: 0 },
      { ...PENSION_BASE.inputs, ret: -1, feeAum: 0 },
      { ...PENSION_BASE.inputs, ret: 1, feeAum: 1 },
    ]) {
      const { root } = await pensionDrive(pensionFrame, inputs);
      const fees = [...root.querySelectorAll('thead th[data-fee-aum]')].map((el) => Number(el.dataset.feeAum));
      const returns = [...root.querySelectorAll('tbody th[data-return]')].map((el) => Number(el.dataset.return));
      pensionRequire(fees.length === 5 && new Set(fees).size === 5 && fees.includes(inputs.feeAum), 'boundary fee axis invalid');
      pensionRequire(returns.length === 5 && new Set(returns).size === 5 && returns.includes(inputs.ret), 'boundary return axis invalid');
      for (const cell of root.querySelectorAll('td[data-invalid="true"]')) {
        pensionRequire(norm(cell.textContent).includes('—') && !cell.hasAttribute('data-value'), 'invalid pair is not a dash without value');
        pensionRequire((cell.getAttribute('aria-label') || '').includes('השילוב מחוץ לתחום החישוב'), 'invalid pair reason missing');
      }
    }
  });

  await pensionGroup('C20', async () => {
    await pensionDrive(pensionFrame, PENSION_CASES.find((item) => item.id === 'years-30').inputs);
    let { win, root } = pensionNeedRoot(pensionFrame);
    const edit = root.querySelector('#pension-input-p0');
    edit.value = '-1';
    edit.dispatchEvent(new win.Event('input', { bubbles: true }));
    root.querySelector('[data-pension-form]').requestSubmit();
    await pensionWait(win);
    root.querySelector('[data-pension-reset]').click();
    await pensionWait(win, 80);
    ({ root } = pensionNeedRoot(pensionFrame));
    for (const [name, expected] of Object.entries(PENSION_INPUTS)) {
      pensionRequire(root.querySelector(`#pension-input-${name}`).value === expected.value, `reset ${name} mismatch`);
    }
    pensionRequire(root.dataset.state === 'ready', 'reset did not restore ready state');
    pensionRequire(pensionApprox(pensionNumber(root.querySelector('[data-pension-balance]')), PENSION_BASE.expected), 'reset headline mismatch');
    pensionRequire(root.querySelectorAll('[data-pension-years] tbody tr').length === 10, 'reset annual rows mismatch');
  });

  await pensionGroup('C21', async () => {
    const { doc } = pensionNeedRoot(pensionFrame);
    const leads = [...doc.querySelectorAll('form.lead-form[data-source="pension-model"]')];
    pensionRequire(leads.length === 1, `pension-model lead form count ${leads.length}, expected 1`);
    const fields = [...leads[0].querySelectorAll('[name]')].map((el) => el.name);
    pensionRequire(JSON.stringify(fields) === JSON.stringify(PRODUCT_FORM.fields.map((field) => field.name)),
      `lead fields changed: ${JSON.stringify(fields)}`);
    for (const route of ROUTES) {
      pensionRequire(page[route].formSource !== 'pension-model', `${route}: existing lead source changed to pension-model`);
    }
  });

  await pensionGroup('C22', async () => {
    await pensionDrive(pensionFrame, PENSION_BASE.inputs);
    const { win, doc, root, form } = pensionNeedRoot(pensionFrame);
    const counts = { fetch: 0, xhr: 0, history: 0, storage: 0, leadSubmit: 0 };
    const before = win.location.href;
    const original = {
      fetch: win.fetch, xhrOpen: win.XMLHttpRequest.prototype.open,
      push: win.history.pushState, replace: win.history.replaceState,
      storageSet: win.Storage.prototype.setItem,
    };
    const onLead = () => { counts.leadSubmit += 1; };
    doc.querySelector('form.lead-form')?.addEventListener('submit', onLead);
    try {
      win.fetch = (...args) => { counts.fetch += 1; return original.fetch(...args); };
      win.XMLHttpRequest.prototype.open = function (...args) { counts.xhr += 1; return original.xhrOpen.apply(this, args); };
      win.history.pushState = function (...args) { counts.history += 1; return original.push.apply(this, args); };
      win.history.replaceState = function (...args) { counts.history += 1; return original.replace.apply(this, args); };
      win.Storage.prototype.setItem = function (...args) { counts.storage += 1; return original.storageSet.apply(this, args); };
      form.requestSubmit();
      root.querySelector('[data-pension-reset]').click();
      await pensionWait(win, 100);
    } finally {
      win.fetch = original.fetch;
      win.XMLHttpRequest.prototype.open = original.xhrOpen;
      win.history.pushState = original.push;
      win.history.replaceState = original.replace;
      win.Storage.prototype.setItem = original.storageSet;
      doc.querySelector('form.lead-form')?.removeEventListener('submit', onLead);
    }
    pensionRequire(Object.values(counts).every((count) => count === 0), `side effects observed: ${JSON.stringify(counts)}`);
    pensionRequire(win.location.href === before, `calculator navigated to ${win.location.href}`);
  });

  await pensionGroup('C23', async () => {
    for (const route of ['/knowledge/', '/knowledge/agents/', '/knowledge/planners/']) {
      const response = await fetch(route, { cache: 'no-store' });
      const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
      pensionRequire(response.status === 200, `${route}: status ${response.status}`);
      pensionRequire(parsed.querySelectorAll(`main a[href="${PENSION_ROUTE}"]`).length >= 1, `${route}: calculator link missing`);
    }
    const { doc } = pensionNeedRoot(pensionFrame);
    pensionRequire(doc.querySelectorAll(`header a[href="${PENSION_ROUTE}"], footer a[href="${PENSION_ROUTE}"]`).length === 0,
      'calculator leaked into global navigation');
  });

  await pensionGroup('C24', async () => {
    const { win, doc, root } = pensionNeedRoot(pensionFrame);
    const text = norm(doc.querySelector('main')?.innerText);
    const duplicateIds = [...doc.querySelectorAll('[id]')]
      .map((el) => el.id).filter((id, index, all) => all.indexOf(id) !== index);
    pensionRequire(!text.includes('{{calculator:') && !/\b(?:NaN|Infinity)\b/.test(text), 'raw shortcode or non-finite text visible');
    pensionRequire(duplicateIds.length === 0, `duplicate IDs: ${JSON.stringify([...new Set(duplicateIds)])}`);
    pensionRequire(pensionVisible(root, win) && root.getBoundingClientRect().height > 200, 'calculator is blank or observer-hidden');
    pensionRequire([...root.querySelectorAll('.reveal')].every((el) => pensionVisible(el, win)), 'calculator contains a hidden reveal region');
  });

  await pensionGroup('C25', async () => {
    const { win, root, form } = pensionNeedRoot(pensionFrame);
    const submit = form.querySelector('button[type="submit"]');
    const reset = root.querySelector('[data-pension-reset]');
    const wrappers = [...root.querySelectorAll('[data-pension-table-scroll]')];
    pensionRequire(submit && reset && reset.tagName === 'BUTTON', 'semantic calculate/reset buttons missing');
    pensionRequire(root.querySelector('[data-pension-status][role="status"][aria-live="polite"]'), 'polite status region missing');
    pensionRequire(root.querySelector('[data-pension-error][role="alert"]'), 'alert region missing');
    pensionRequire(wrappers.length === 2 && wrappers.every((el) => el.tabIndex === 0 && el.getAttribute('aria-label')),
      'labelled keyboard-scroll table wrappers missing');
    pensionRequire(wrappers.every((el) => ['auto', 'scroll'].includes(win.getComputedStyle(el).overflowX)),
      'table wrappers are not horizontally scrollable');
    submit.focus();
    pensionRequire(win.document.activeElement === submit, 'calculate control cannot receive focus');
    unverified.push('[C25] trusted keyboard activation and visible focus require the active browser review; synthetic console events are not accepted as proof');
  });
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  for (let number = pensionGroupResults.length + 1; number <= 25; number += 1) {
    const id = `C${String(number).padStart(2, '0')}`;
    note(false, `[${id}] browser harness stopped before group: ${detail}`);
    pensionGroupResults.push({ id, result: 'FAIL', detail });
  }
} finally {
  pensionFrame?.remove();
}

const pensionStats = {
  checks: checks - pensionLegacy.checks,
  failures: fails.length - pensionLegacy.failures,
  unverified: unverified.length - pensionLegacy.unverified,
};
console.log(`EXISTING BASELINE — ${pensionLegacy.failures}/${pensionLegacy.checks} checks failed before calculator assertions`);
console.log(`PENSION CALCULATOR — ${pensionStats.failures}/${pensionStats.checks} RED groups failed, ${pensionStats.unverified} unverified`);

/*
  Three outcomes, not two. A run with nothing failing but something unverified is
  not a pass — it is an unfinished verification, and calling it GREEN would let an
  unchecked contract ride along under a green label.
*/
const summary = fails.length ? 'RED' : (unverified.length ? 'PARTIAL' : 'GREEN');
console.log(
  summary === 'RED' ? `RED — ${fails.length}/${checks} checks failed`
  : summary === 'PARTIAL' ? `PARTIAL — ${checks}/${checks} checks passed, ${unverified.length} contract(s) could not be verified`
  : `GREEN — ${checks}/${checks} checks passed, nothing left unverified`);
fails.forEach((f) => console.log('  ✗', f));
unverified.forEach((u) => console.log('  ~', u));
const contentCheckResult = {
  summary, checks, failures: fails, unverified,
  existing: pensionLegacy, pensionCalculator: pensionStats,
  pensionGroups: pensionGroupResults,
};
window.__contentCheckResult = contentCheckResult;
contentCheckResult;
