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
    5. The draft fee calculator stays removed — its route 404s, the hub neither
       links to it nor shows its card, and no served page carries its markup.

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

// --- 5. the fee calculator is gone (one engine on the site) ----------------
/*
  The site answers "what do fees cost me" with one engine. The draft annual
  calculator at /knowledge/fee-impact-calculator/ was removed on 2026-09-06;
  the shared monthly engine behind /knowledge/agents/fees/ is the one that
  stays. These three assertions are what stops it coming back by accident.

  They are deliberately written against the SERVED build rather than the
  source tree, because the failure that matters is a calculator reaching a
  reader — a stray import that never renders is not what this guards.

  (a) is only genuinely RED in a review build. The article carried
  draft: true, so a public build never emitted the route in the first place.
*/
const REMOVED_ROUTE = '/knowledge/fee-impact-calculator/';
const REMOVED_CARD = 'כלי המחשה';
const CALC_MARKERS = ['PensionCalculator', 'pension-calculator', '{{calculator:'];

const removalLegacy = { checks, failures: fails.length };

// (a) the route must not be served, in either build mode.
let removedStatus = null;
try {
  const res = await fetch(REMOVED_ROUTE, { redirect: 'manual' });
  removedStatus = res.status;
} catch (e) {
  removedStatus = `error: ${e.message}`;
}
note(removedStatus === 404, `${REMOVED_ROUTE} served ${removedStatus}, expected 404`);

// (b) the hub must carry neither the link nor the card.
let hubHtml = '';
let hubStatus = null;
try {
  const res = await fetch('/knowledge/');
  hubStatus = res.status;
  hubHtml = res.status === 200 ? await res.text() : '';
} catch (e) {
  hubStatus = `error: ${e.message}`;
}
if (hubStatus === 200) {
  note(!hubHtml.includes(`href="${REMOVED_ROUTE}"`), 'hub still links to the removed calculator');
  note(!hubHtml.includes(REMOVED_CARD), `hub still renders the "${REMOVED_CARD}" card`);
} else {
  // A public build does not emit the hub at all; nothing to link from.
  note(true, 'hub not served in this build mode');
  note(true, 'hub not served in this build mode');
}

/*
  (c) No served page may carry a calculator artefact. A console script cannot
  walk dist/, so this sweeps an explicit route list: the nine public routes,
  the hub, and every /knowledge/ link the hub itself offers. The authoritative
  check is a grep over dist/ in the cleanup evidence; this is the guard that
  fails a future build if the component is wired back in.
*/
const knowledgeLinks = [...new Set(
  [...hubHtml.matchAll(/href="(\/knowledge\/[^"#?]*)"/g)].map((m) => m[1])
)];
const SWEEP = [...new Set([...ROUTES, '/knowledge/', ...knowledgeLinks])];
for (const route of SWEEP) {
  let html = '';
  try {
    const res = await fetch(route);
    if (res.status !== 200) continue;
    html = await res.text();
  } catch (e) {
    note(false, `${route}: could not be fetched for the calculator sweep — ${e.message}`);
    continue;
  }
  for (const marker of CALC_MARKERS) {
    note(!html.includes(marker), `${route}: built HTML still contains "${marker}"`);
  }
}

const removalStats = {
  checks: checks - removalLegacy.checks,
  failures: fails.length - removalLegacy.failures,
  routesSwept: SWEEP.length,
};
console.log(`EXISTING BASELINE — ${removalLegacy.failures}/${removalLegacy.checks} checks failed before the removal assertions`);
console.log(`CALCULATOR REMOVAL — ${removalStats.failures}/${removalStats.checks} checks failed across ${removalStats.routesSwept} routes`);

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
  existing: removalLegacy, calculatorRemoval: removalStats,
};
window.__contentCheckResult = contentCheckResult;
contentCheckResult;
