# Cutover runbook — plan-t.org.il → plan-t.co.il

For a human, in order. Nothing here is automated on purpose: every step
below changes what the public sees or what mail does, and each one has a
check before the next.

**Primary domain:** `plan-t.co.il` (M-1). **Old domain:** `plan-t.org.il`
becomes a 301 to the new one, path-mapped (`public/_redirects`).
**Never touch:** `portal.plan-t.org.il` (the product login) and any MX record.

---

## 0 · Blockers — do not start the DNS steps until these are green

| # | Check | State on 02/09/2026 |
|---|---|---|
| B1 | `PUBLIC_LEAD_WEBHOOK_URL` set in the Worker's Production env | **empty** — every lead form shows the "not connected" message and sends nothing |
| B2 | `PUBLIC_COMMUNITY_WEBHOOK_URL` set | **empty** |
| B3 | Forms end-to-end (section 5) all pass | **blocked by B1/B2** |
| B4 | Wix form submissions exported (section 4) | not done |
| B5 | Gate-2 content decisions that affect public copy (M-13 superlatives, the forbidden-word rulings listed in PR D) | **deferred** — the site goes live with migrated text pending rulings |

**The cutover is blocked while B1–B3 are red.** A domain that redirects to a
site whose forms send nowhere loses every lead the old site would have caught.

---

## 1 · `plan-t.co.il` — make Cloudflare authoritative

Facts verified 02/09 against the live DNS (see the DNS thread):

- Registrar: DomainTheNet. Current NS: `ns1.dtnt.info`, `ns2.dtnt.info`, `ns3.dtnt.info` (exactly three; confirmed at the `.il` registry).
- Cloudflare zone exists (Free plan). Assigned NS: `alexa.ns.cloudflare.com`, `ben.ns.cloudflare.com` — **copy the pair from the zone's Overview page; do not trust this file for them.**
- DNSSEC: **off** (no DS record at the `.il` registry). Not a blocker.
- Current records: `A @ → 62.219.91.45`, `A www → 62.219.91.45`, `A * → 62.219.91.45` (wildcard). No MX, no TXT.

Steps:

1. In the Cloudflare zone, confirm the DNS tab reproduces everything that must survive. Two questions the scan cannot answer — ask Elad before switching:
   - **What is on `62.219.91.45`, and which hostnames are in use?** The wildcard means any subdomain resolves today; none of them will after the switch unless recreated.
   - **Does mail arrive at `@plan-t.co.il`?** There is no MX, but with no MX mail falls back to the apex `A` record — so mail may be flowing to `62.219.91.45` silently. If yes, the apex `A` must be recreated (or a real MX added) or that mail breaks on switch.
2. Attach the domain to the Worker: Workers & Pages → `plant-marketing-site` → Settings → Domains & Routes → add `plan-t.co.il` and `www.plan-t.co.il`. Cloudflare creates the proxied records.
3. At DomainTheNet: replace the three `dtnt` NS with the two Cloudflare NS. Change nothing else.
4. Wait for propagation (registry TTL; check with `nslookup -type=NS plan-t.co.il 8.8.8.8` until it returns the Cloudflare pair).
5. Verify: `https://plan-t.co.il` loads with a padlock, `www` redirects to the apex, `/sitemap-index.xml` and `/robots.txt` reference `plan-t.co.il`, and both verification metas are in the served `<head>` (`view-source`).

---

## 2 · `plan-t.org.il` — redirect the old domain

Do this **after** section 1 is verified, and after B4.

**Why the hostname catch-all is not in `public/_redirects`:** Cloudflare Workers static assets do not support domain-level sources in `_redirects` — `https://host/* …` is listed as unsupported in the Workers docs. So `_redirects` handles the *paths* that changed shape, and the *hostname* is a zone-level Redirect Rule, below.

1. Bring `plan-t.org.il` into Cloudflare as its own zone (it is **not** the same zone as `.co.il`; check where it is served today before touching anything). Recreate every existing record first, byte for byte — **`portal.plan-t.org.il` and every MX record exactly as they are** — and verify them before changing NS.
2. In that zone: **Rules → Redirect Rules → Create rule**, name it `org.il → co.il`:
   - *When incoming requests match:* `(http.host eq "plan-t.org.il") or (http.host eq "www.plan-t.org.il")`
   - *Then:* **Dynamic** redirect, expression `concat("https://plan-t.co.il", http.request.uri.path)`, status **301**, *Preserve query string* on.
   Every old URL goes to the same path on the new host in one hop; `_redirects` on `plan-t.co.il` then handles the URLs whose shape changed (`/aboutus` → `/about/`, the Hebrew slugs, `/blog/*`). An old deep link resolves in **two** hops at most — host, then path.
3. The apex and `www` records in the old zone must be **proxied** (orange cloud): the rule runs at Cloudflare's edge and needs the request to reach it. Point them at a placeholder (`192.0.2.1`, proxied); the rule answers before any origin is contacted.
4. Run the 301 audit (section 6). Every old URL must return **301 → 200**, raw and percent-encoded alike, through the hops above.
5. Only then cancel the Wix site (section 4 first).

---

## 3 · Search Console and Bing

1. Both verification metas already ship in every page's `<head>` (copied from the old site on 02/09). Add `https://plan-t.co.il/` as a **URL-prefix property** in Search Console; it verifies from the meta tag. Do the same in Bing Webmaster Tools (`msvalidate.01`).
2. Submit `https://plan-t.co.il/sitemap-index.xml`.
3. In the **old** property (`plan-t.org.il`), after section 2's 301s are live: Settings → Change of address → select the new property. Search Console will check that a sample of old URLs 301s to the new host.
4. Keep the old property; do not delete it — the change-of-address signal runs against it for months.

---

## 4 · Wix — before cancelling

1. Export all form submissions (contact, support, monthly-registration) from the Wix dashboard. They are not migrated anywhere; once the plan lapses they are gone.
2. Save the eight module icons from `static.wixstatic.com/media/1831e6_*` (PNG, 230×129) to the company Drive — N-7 is still open and they are the only copies.
3. Download any media the export list in `old-site-content.md` § Media names.
4. Then cancel — and only after the 301 audit is green.

---

## 5 · Forms — end-to-end checklist

Run against whatever webhooks are set. **Every row must pass**; any red row blocks cutover.

| Form | Page(s) | `data-source` | Expected |
|---|---|---|---|
| Lead | `/`, `/product/`, `/solutions/`, `/agents/`, `/planners/`, `/wealth/`, `/about/`, `/contact/`, `/packages/`, `/packages/*`, `/faq/` | `website-*` (one per page) | success message shown **and** item appears in monday with the right `source` and `audience` |
| Community | `/community/` | `website-community` | success message **and** arrives at the community destination — never the lead board |
| Support | — | `website-support` | **page not built** (awaiting N-3) |
| Training | — | `website-training` | **page not built** (awaiting N-2 / M-8) |

Test from the **live domain**, not localhost: `PUBLIC_*` values are baked at build time, so a change in the Worker's env needs a redeploy before it is live.

---

## 6 · Pre-launch audit

Run from any machine after section 2:

```bash
NEW=https://plan-t.co.il
for u in \
  /aboutus /blank /copy-of-enterprise /monthlyregistration /support /blog /blog/anything \
  /copy-of-%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA-%D7%95%D7%9E%D7%95%D7%A6%D7%A8%D7%99%D7%9D \
  /copy-of-%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA-%D7%95%D7%9E%D7%95%D7%A6%D7%A8%D7%99%D7%9D-1 \
  /copy-of-%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA-%D7%95%D7%9E%D7%95%D7%A6%D7%A8%D7%99%D7%9D-2 \
  /%D7%A9%D7%90%D7%9C%D7%95%D7%AA-%D7%95%D7%AA%D7%A9%D7%95%D7%91%D7%95%D7%AA \
  /%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%94%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA ; do
  # Hebrew paths are percent-encoded on purpose: that is what browsers send, and
  # it is the only form Cloudflare matches (verified in production 02/09 — raw
  # UTF-8 bytes in the request returned 404, the encoded form 301).
  for host in https://www.plan-t.org.il https://plan-t.org.il; do
    printf "%-70s " "$host$u"
    curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "$host$u"
  done
done
# Every line must read: 301 -> https://plan-t.co.il/<mapped path>
# Then confirm each target itself is 200:
for p in / /about/ /packages/ /packages/pro/ /packages/planner/ /packages/enterprise/ /packages/funds/ /faq/ /contact/ /privacy/; do
  printf "%-40s %s\n" "$NEW$p" "$(curl -s -o /dev/null -w '%{http_code}' "$NEW$p")"
done
```

Also: Lighthouse on `/`, `/product/`, `/packages/`, `/faq/` — scores no lower than before cutover; and the OG image is the new asset (C-12 is still **SKIP**; the current `og.png` ships until an asset is supplied).

**Known gap — the branded 404 is not served (found 02/09/2026).** An unknown path on production returns a **0-byte** 404, not `dist/404.html`. Workers static assets only serve a custom 404 page when the Worker's assets config says so (`assets.not_found_handling = "404-page"` in `wrangler.jsonc`); this repo has no wrangler config, so the platform default applies. The branded page has therefore never been served in production — before PR F or after. Fixing it means adding a `wrangler.jsonc`, which changes how Cloudflare builds and deploys this Worker; that is a decision, not a doc fix, and is left open here. Until it is made, an old URL that is *not* in the redirect map lands on an empty response.

---

## 7 · Rollback

Each step above is independently reversible; do them in reverse order.

- **Redirects misbehave:** disable the `org.il → co.il` Redirect Rule in the `plan-t.org.il` zone (Rules → Redirect Rules → toggle off). The old hostnames then serve whatever their proxied records point at — the placeholder from §2 step 3, i.e. nothing useful — so this is a stop, not a restore; re-point the records at the old Wix origin if the old site must come back. Nothing on `.co.il` is affected either way.
- **`plan-t.co.il` broken after the NS switch:** at DomainTheNet, set the NS back to `ns1/ns2/ns3.dtnt.info`. Propagation takes as long as it took forward. This is why the wildcard/mail questions in section 1 are asked *before* the switch — a rollback recovers the records, not the mail that bounced meanwhile.
- **Search Console change-of-address:** can be withdrawn from the old property within 180 days.
- **Wix:** cannot be rolled back once cancelled — hence section 4 before section 2's final step.

---

## מרכז הידע — פרסום מדורג

למרכז הידע שני מתגים נפרדים, כי סקירה ופרסום הן שתי החלטות שונות:

- `KNOWLEDGE_ENABLED=true` מפעיל **מצב סקירה** רק ב־Workers Build של ענף מזוהה
  שאינו `main`, או ב־`npm run dev` מקומי נקי. המצב כולל טיוטות ונתוני Tier‑0;
  כל 31 עמודי הידע מקבלים `noindex`.
- `KNOWLEDGE_PUBLIC=true` מפעיל **מצב ציבורי**, כולל ב־`main`. המצב מציג רק
  מאמרים עם `draft: false`, אינו חושף שמות טיוטה ומסנן נתוני Tier‑0 מדף הנתונים.

כששני המתגים כבויים לא נוצרים עמודי `/knowledge/`, אין רשומות שלהם ב־sitemap
וקישורי הניווט מוסתרים. כשהמתג הציבורי דלוק והמצב הנוכחי הוא שכל 25 המאמרים
טיוטות, נוצרים 25 עמודים באתר כולו: 20 עמודי האתר הרגילים ועוד 5 עמודי ידע
(hub, שלושה מסלולים ודף נתוני 2026), ללא מאמרים. במצב סקירה נוצרים 51 עמודים
באתר כולו, מהם 31 עמודי ידע. הספירות אומתו פעמיים ויש לבדוק אותן מחדש אחרי
שינוי תוכן.

**זה משתנה בנייה, לא משתנה ריצה.** האתר סטטי לגמרי והדגל נקרא בזמן יצירת
העמודים, כמו ה-`PUBLIC_*` — ולכן שינוי שלו מחייב **בנייה מחדש**, לא רק שמירה
בדשבורד (ראו §5).

### הגדרות שאומתו בדשבורד, 04/09/2026

ב־Worker `plant-marketing-site`, בחשבון `Sales@plan-t.org.il's Account`:

- Production branch: `main`.
- Builds for non-production branches: מופעל.
- Build command: `npm run build`.
- Deploy command: `npx wrangler deploy`.
- Version command: `npx wrangler versions upload` — העלאת גרסת Preview, לא קידום לפרודקשן.
- Variables and secrets של Builds: ריק בזמן הבדיקה; לא נשמרו שינויים.

**אין כאן משתנה נפרד לכל ענף.** שני המתגים הם משתני Builds משותפים. ההגנה על
מצב הסקירה נעשית בקוד בעזרת הענף שמוזרק לבנייה. אין להגדיר ידנית או לדרוס את
`WORKERS_CI`, את `WORKERS_CI_BRANCH` או את `CI` כדי לפתוח את השער.

| הקשר | `KNOWLEDGE_ENABLED` | `KNOWLEDGE_PUBLIC` | תוצאה |
|---|---|---|---|
| Workers Builds, ענף `main` | `true` או כל ערך אחר | לא `true` | הסקשן לא קיים |
| Workers Builds, ענף `main` | כל ערך | `true` | מצב ציבורי; אין טיוטות או Tier‑0 |
| Workers Builds, ענף מזוהה שאינו `main` | `true` | כל ערך | מצב סקירה מלא עם `noindex` |
| Workers Builds, ענף חסר או ריק | `true` | לא `true` | הסקשן לא קיים |
| `npm run dev` מקומי, בלי סימוני CI או ענף | `true` | לא `true` | מצב סקירה מלא עם `noindex` |
| `npm run build` מקומי רגיל | `true` | לא `true` | הסקשן לא קיים |
| כל הקשר | כל ערך | `true` | מצב ציבורי, אלא אם מצב הסקירה הפעיל כולל גם טיוטות |

### סדר הפעלה — ללא חלון סיכון לפרודקשן

1. להשאיר את שני המתגים כבויים/לא מוגדרים בזמן הכנת ה־PR.
2. להריץ פעמיים את שלושת המצבים ולוודא פלט זהה: כבוי, ציבורי ב־`main`, ו־Preview
   מלא בענף שאינו `main`. לבדוק נתיבים, ניווט, `noindex`, sitemap והיעדר Tier‑0.
3. למזג את ההגנה ל־`main` ולוודא שהבנייה שלו הצליחה. תיקון שנמצא רק בענף
   Preview **אינו מגן על main**.
4. לרענן את `preview/knowledge` מ־`main` ב־fast-forward בלבד. אם נדרשת הכרעת
   מיזוג, לעצור — לא לבצע force push ולא לדרוס שינויים.
5. לבדוק בדשבורד שענף production הוא `main` ופקודת הגרסה היא
   `npx wrangler versions upload`. רק לאחר שהקוד המגן נמצא ב־`main`, להגדיר את
   שני משתני ה־Build המשותפים: `KNOWLEDGE_ENABLED=true` ו־`KNOWLEDGE_PUBLIC=true`.
6. לבנות מחדש את `main` ואת `preview/knowledge`. ב־main צריכים להופיע רק חמשת
   עמודי המעטפת הציבוריים כל עוד אין מאמר מאושר; ב־Preview צריכים להופיע כל 31
   עמודי הידע עם `noindex`.

### פיתוח מקומי וגבולות ההגנה

לסקירה מקומית יש להוסיף/לעדכן רק `KNOWLEDGE_ENABLED=true` ב־`.env`, בלי לדרוס
קובץ קיים או את ערכי ה־webhooks שבו, ולהריץ `npm run dev`. החריג המקומי דורש
`import.meta.env.DEV` וללא ערכים ב־`CI`, ב־`WORKERS_CI` וב־`WORKERS_CI_BRANCH`.
אם סביבת העבודה נושאת סימוני CI, לא לזייף ענף; להשתמש בתהליך מקומי נקי.

`DEV` הוא מצב development, **לא הוכחה שמדובר בשרת מקומי**: גם build עם
`NODE_ENV=development` או עם `--devOutput` יכול לייצר פלט כזה. פלט זה אינו
מיועד לפריסה. לפריסה משתמשים בבנייה רגילה עם `NODE_ENV=production` ובנתיב
ה־CI המאומת בלבד. קידום ידני של גרסת Preview לפרודקשן, או פריסה ידנית של
תוצריה, עוקפים את כוונת ההגנה ואסורים לפני אישור הפרסום.

מקורות: [משתני Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#default-variables),
[פקודת Preview](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#non-production-branch-deploy-command),
[מצבי Vite](https://vite.dev/guide/env-and-mode#built-in-constants).

### לפני הדלקה בפרודקשן

כל 25 המאמרים עדיין `draft: true`; 10 מתוך 35 הנתונים עדיין Tier‑0. מצב Public
אינו מפרסם אותם. `npm run build` מריץ תחילה את `scripts/check-figures.mjs`, והבנייה
נכשלת אם מאמר עם `draft: false` מצטט נתון Tier‑0.

כדי לפרסם מאמר: לאמת ולהוסיף מקור Tier‑1 עם URL, להסיר ממנו מקורות Tier‑0,
לאמת כל נתון שהוא מצטט, לשנות ל־`draft: false`, ולהריץ את הבנייה פעמיים. רק
מאמרים שעברו את כל השלבים יופיעו במצב Public; השאר נשארים ב־Preview בלבד.

