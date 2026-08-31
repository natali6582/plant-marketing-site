/*
  /community/ landing-page regression — run in the browser against a running preview.

  Step-2 contract: everything from step 1 (approved hero, three value lines,
  minimal chrome, unlinked from the navigation, indexable) plus the join form —
  exactly two visible fields (full name, mobile) with linked labels, the approved
  CTA and privacy line, sanitised hidden attribution ('direct' without UTM),
  non-aggressive mobile validation with a visible error, and, while no webhook is
  configured: zero network requests on submit and no fake success. The five
  existing site forms keep their exact behaviour — pinned here too.

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
    const form = d.querySelector('form.community-form');
    const visible = form ? [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')]
      .filter((e) => !e.closest('.hp-field')) : [];
    return {
      title: d.title,
      robots: d.querySelector('meta[name="robots"]') ? d.querySelector('meta[name="robots"]').content : null,
      h1s: [...main.querySelectorAll('h1')].map((e) => norm(e.textContent)),
      mainText: norm(main.innerText),
      forms: d.querySelectorAll('form').length,
      headerLinks: [...header.querySelectorAll('a')].map((a) => a.getAttribute('href')),
      headerNavs: header.querySelectorAll('nav').length,
      footerLinks: [...footer.querySelectorAll('a')].map((a) => a.getAttribute('href')),
      hOverflow: d.documentElement.scrollWidth > d.documentElement.clientWidth,
      visibleFields: visible.map((e) => ({ name: e.name, type: e.type, required: e.required === true,
        labelled: !!d.querySelector(`label[for="${e.id}"]`) })),
      hiddenFields: form ? [...form.querySelectorAll('input[type="hidden"]')].map((e) => e.name) : [],
      submitText: form ? norm(form.querySelector('button[type="submit"]').textContent) : null,
      dataWebhook: form ? (form.dataset.webhook ?? '') : null,
      privacyLine: form ? norm(form.textContent).includes('בהשארת הפרטים אני מבקש/ת לקבל מידע על ההצטרפות לקהילת Plan-T.') : false,
      privacyLink: form ? !!form.querySelector('a[href="/privacy/"]') : false,
    };
  } finally { f.remove(); }
}

/*
  Behavioural probe: load a page in an iframe, fill its form, submit, and
  observe what actually happens — the status message shown and every network
  request the page fired after load. fetch and XHR are wrapped, and the resource
  timeline is diffed, so a request to any webhook cannot hide.
*/
async function submitProbe(route, formSelector, fill, urlSuffix = '') {
  const f = document.createElement('iframe');
  f.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;z-index:-1;border:0;width:1280px;height:900px';
  f.src = route + urlSuffix;
  document.body.appendChild(f);
  try {
    await new Promise((res, rej) => {
      f.onload = res; f.onerror = () => rej(new Error('load'));
      setTimeout(() => rej(new Error('timeout')), 15000);
    });
    const win = f.contentWindow, d = win.document;
    const requests = [];
    const origFetch = win.fetch.bind(win);
    win.fetch = (...args) => { requests.push(String(args[0])); return origFetch(...args); };
    const origOpen = win.XMLHttpRequest.prototype.open;
    win.XMLHttpRequest.prototype.open = function (m, u, ...rest) { requests.push(String(u)); return origOpen.call(this, m, u, ...rest); };
    const resourcesBefore = win.performance.getEntriesByType('resource').length;

    const form = d.querySelector(formSelector);
    if (!form) return { error: 'form not found' };
    fill(form, d);
    form.querySelector('button[type="submit"]').click();
    await new Promise((r) => win.setTimeout(r, 400));

    const status = form.querySelector('.form-status');
    // Only initiators that can carry a submission (fetch/XHR/beacon). Clicking
    // submit focus-scrolls the page, which fires lazy <img> loads — browser
    // behaviour, not the form sending data — so media/style entries are noise
    // here, same as the font requests already filtered out.
    const newResources = win.performance.getEntriesByType('resource').slice(resourcesBefore)
      .filter((e) => ['fetch', 'xmlhttprequest', 'beacon'].includes(e.initiatorType))
      .map((e) => e.name).filter((n) => !n.includes('fonts.g'));
    return {
      statusText: status ? norm(status.textContent) : null,
      statusHidden: status ? status.classList.contains('hidden') : null,
      scriptedRequests: requests,
      newResources,
      hidden: Object.fromEntries([...form.querySelectorAll('input[type="hidden"]')].map((e) => [e.name, e.value])),
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
  note(p.forms === 1, `${label}: ${p.forms} form(s), expected exactly the join form`);
  note(JSON.stringify(p.visibleFields) === JSON.stringify([
    { name: 'full_name', type: 'text', required: true, labelled: true },
    { name: 'mobile', type: 'tel', required: true, labelled: true },
  ]), `${label}: visible fields = ${JSON.stringify(p.visibleFields)}`);
  note(JSON.stringify(p.hiddenFields) === JSON.stringify(['source_channel', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content']),
    `${label}: hidden fields = ${JSON.stringify(p.hiddenFields)}`);
  note(p.submitText === 'אני רוצה להצטרף', `${label}: CTA = "${p.submitText}"`);
  note(p.privacyLine, `${label}: approved privacy line missing`);
  note(p.privacyLink, `${label}: privacy link missing`);
  note(p.dataWebhook === '', `${label}: data-webhook = "${p.dataWebhook}" (expected unset)`);
  note(p.mainText.includes('מעוניינים להצטרף לקהילת Plan-T?'), `${label}: join heading missing`);
  note(p.mainText.includes('השאירו שם ונייד ונשלח לכם את פרטי ההצטרפות.'), `${label}: join intro missing`);
  note(p.headerNavs === 0, `${label}: header carries navigation — chrome is not minimal`);
  note(JSON.stringify(p.headerLinks) === '["/"]', `${label}: header links ${JSON.stringify(p.headerLinks)}, expected only "/"`);
  note(JSON.stringify(p.footerLinks) === '["/privacy/"]', `${label}: footer links ${JSON.stringify(p.footerLinks)}, expected only "/privacy/"`);
  note(!/\bAI\b/i.test(p.mainText), `${label}: AI mentioned`);
  note(!p.mainText.includes('וובינר'), `${label}: webinar mentioned`);
  note(!p.hOverflow, `${label}: horizontal overflow`);
  note(p.robots === null, `${label}: robots meta = ${p.robots} (page must stay indexable)`);
}

// --- behaviour: validation, attribution, and the no-endpoint contract -------
const NOT_CONNECTED = 'לא הצלחנו לקבל את הפרטים כרגע. אפשר לנסות שוב מאוחר יותר.';

// invalid mobile → visible error, nothing sent
const bad = await submitProbe('/community/', 'form.community-form', (form) => {
  form.querySelector('[name="full_name"]').value = 'ישראל ישראלי';
  form.querySelector('[name="mobile"]').value = '123';
});
note(bad.statusHidden === false && (bad.statusText || '').startsWith('נא להזין מספר נייד תקין'),
  `invalid mobile: status = "${bad.statusText}"`);
note(bad.scriptedRequests.length === 0 && bad.newResources.length === 0,
  `invalid mobile fired requests: ${JSON.stringify(bad.scriptedRequests.concat(bad.newResources))}`);

// valid Israeli mobile, no webhook → approved failure message, zero requests, no fake success
const ok = await submitProbe('/community/', 'form.community-form', (form) => {
  form.querySelector('[name="full_name"]').value = 'ישראל ישראלי';
  form.querySelector('[name="mobile"]').value = '050-1234567';
});
note(ok.statusText === NOT_CONNECTED, `no-endpoint submit: status = "${ok.statusText}"`);
note(ok.scriptedRequests.length === 0 && ok.newResources.length === 0,
  `no-endpoint submit fired requests: ${JSON.stringify(ok.scriptedRequests.concat(ok.newResources))}`);
note(!(ok.statusText || '').includes('תודה'), 'fake success shown without a server');
note(ok.hidden.source_channel === 'direct', `no UTM: source_channel = "${ok.hidden.source_channel}"`);

// +972 form accepted too (same no-endpoint outcome proves it passed validation)
const intl = await submitProbe('/community/', 'form.community-form', (form) => {
  form.querySelector('[name="full_name"]').value = 'Israel Israeli';
  form.querySelector('[name="mobile"]').value = '+972-50-1234567';
});
note(intl.statusText === NOT_CONNECTED, `+972 mobile rejected: status = "${intl.statusText}"`);

// clean UTM lands in the hidden fields; a hostile value is discarded
const utm = await submitProbe('/community/', 'form.community-form', () => {},
  '?utm_source=linkedin&utm_medium=paid_social&utm_campaign=community_launch_2026&utm_content=%3Cscript%3E');
note(utm.hidden.utm_source === 'linkedin' && utm.hidden.utm_medium === 'paid_social'
  && utm.hidden.utm_campaign === 'community_launch_2026', `utm capture: ${JSON.stringify(utm.hidden)}`);
note(utm.hidden.utm_content === '', `hostile utm_content not discarded: "${utm.hidden.utm_content}"`);
note(utm.hidden.source_channel === 'linkedin', `source_channel = "${utm.hidden.source_channel}"`);

// the existing lead forms keep their exact behaviour: same not-connected line, nothing sent
const lead = await submitProbe('/', 'form.lead-form', (form) => {
  form.querySelector('[name="name"]').value = 'בדיקה';
  form.querySelector('[name="phone"]').value = '0501234567';
  form.querySelector('[name="email"]').value = 'test@example.com';
  form.querySelector('[name="privacy"]').checked = true;
});
note(lead.statusText === 'הטופס עדיין לא מחובר. אפשר לפנות אלינו בדוא״ל: sales@plan-t.org.il',
  `home lead form not-connected message changed: "${lead.statusText}"`);
note(lead.scriptedRequests.length === 0 && lead.newResources.length === 0,
  `home lead form fired requests: ${JSON.stringify(lead.scriptedRequests.concat(lead.newResources))}`);

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
