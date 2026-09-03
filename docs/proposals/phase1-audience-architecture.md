# Repository verification — Prompt 1
Verified against `natali6582/plant-marketing-site` on 02.09.2026 · `main` @ `0257d03` · read-only, one file created (this one)

> The proposal below is reproduced verbatim from `phase1-audience-architecture-proposal.md` (02.09.2026, written from the live staging site without repository access). This section replaces every `[REPO]` inference with what the repository actually contains. Where the two disagree, this section wins; the proposal text underneath is left untouched so the diff of judgement is visible.

## (a) Precondition results

| Check | Result |
|---|---|
| Working tree clean | **Yes.** `git status` empty; `main` = `origin/main` (0 ahead / 0 behind). |
| Cleanup/alignment PR merged into `main` | **No — stop condition met.** planV3 §9 defines this PR as launch-path item (1): *old-message sweep, OG card rebuilt around «כל תיק הלקוח. תמונה אחת ברורה.», webinar removal executed (301 + sitemap), optional «להמחשה» caption, content drop-ins*. Evidence it has not landed: `src/pages/webinar.astro` exists; `webinar` is in the built `dist/sitemap-0.xml`; no `public/_redirects` and no `redirects` in `astro.config.mjs`; `src/components/WebinarStrip.astro:28` still reads «וובינר השקה: Plan-t AI» (the component is no longer imported by any page, but it ships in the repo); `public/images/og.png` is the 31 Aug build (19,605 B, 16:03) — not rebuilt around the new hero line. The old-message sweep is *partial*: «אל תישאר מאחור» / «תתקדם ל» are gone from `src/`, but «Plan-t AI» survives in `WebinarStrip.astro` and `webinar.astro`. |
| Stack | Confirmed: Astro 7 (`astro.config.mjs`, static output), Tailwind v4 via `@tailwindcss/vite`, deployed to a Cloudflare **Worker** (not Pages — the proposal says Workers; `config.md:86` still says "Cloudflare Pages", stale). `site: 'https://plan-t.co.il'`; `BaseLayout.astro:30/37/38` derive `<title>`, `og:title`, `og:description` from page props, canonical from `Astro.site`. |
| Analytics layer | Confirmed none. `BaseLayout.astro` carries only an HTML comment placeholder for the snippet. |

Per Prompt 1 step 1 the verification should stop here. It was completed anyway because every remaining step is read-only and its results are needed regardless of when the cleanup PR lands; **PR A must not branch until that PR is in `main`.**

## (b) Document paths

| Document the proposal calls `[REPO]` | Where it actually is |
|---|---|
| `CLAUDE.md` | repo root. Working rules and the two-tier definition of done. **It contains no image or §5.5 rule** — the only "image" mentions (L62, L88) are examples in the "why this rule exists" list. |
| Build plan | **Not in the repository.** `README.md` cites "§7 of the build plan"; that document is `plant-marketing-site-planV3` in OneDrive `שיווק\אתר שיווק חדש\`. V6 (`plantmarketingsiteplanV6.md`) has no §5.5 text — it defers to "V5 §6", and V5 §6 is a one-line summary. |
| §5.5 image design law | `plant-marketing-site-planV3`, heading `### 5.5 Image design law (agreed)` (file line 192), plus the "Approved exception (31 Aug)" paragraph directly under it. Quoted in full in (c). |
| `config.md` | repo root. |
| `LeadForm` | `src/components/LeadForm.astro` (markup + payload builder). Runtime: `src/scripts/lead-submit.ts` (shared with `CommunityForm.astro`). |
| Header / nav | `src/components/Header.astro`. |
| Home | `src/pages/index.astro`. Marquee source list: `src/data/advantages.ts` (rendered by `src/components/Marquee.astro` on Home and by `src/pages/product.astro`). Footer: `src/components/Footer.astro`. |
| Proposals location | `docs/` did not exist. Created `docs/proposals/` for this file, as Prompt 1 allows. |

## (c) Corrections to the proposal

### §5.5 — the actual text, and what it means for the visual

Quoted from planV3 §5.5:

> 1. The product is the hero — real Plan-T screens only, presented straight (no tilt), framed and softly shadowed.
> 2. One unifying treatment on all photos: navy duotone/overlay from the ink token. Green is a CTA accent only, never a large surface.
> 3. Human imagery follows the campaign's contrast (paper-buried old world vs calm planner). No glowing brains, holograms, robots, handshake stock.
> 4. No text inside images — words live in HTML. Single exception: the OG share card. Never an invented dashboard.
> 5. "Skip" is the default: an image must make the page clearly better to earn a slot.
> 6. Only images Plan-T owns or generated go public. Stock inherited from the old site is not cleared for the new domain.
>
> **Approved exception (31 Aug, by Natali as content authority):** the Home hero uses the campaign montage `hero-montage.jpg` — stylized screens from the teaser footage with an in-image caption («כל התמונה של הלקוח. במקום אחד.») — a deliberate, single-slot override of rules 1 and 4. The rest of the site stays under the law as written.

Constraints that apply to a **decorative SVG outside the hero**: rule 2 (green = accent only, never a surface), rule 4 (no text in the image; *never an invented dashboard*), rule 5 (skip is the default — it must clearly improve the page), and rule 6 by construction (an authored SVG is owned). Rules 1 and 3 concern photographs and do not bind it. The 31 Aug exception is **single-slot and hero-only** — it does not extend to the audience-page marker or the Home backdrop.

**Verdict on V1 "field of view": allowed with changes.**

1. **Rule 5 is a burden the proposal never states.** §5.5 puts the default at *no image*; the visual has to earn its slot. PR B's description must argue that the rings make `#audiences` clearly better than cards alone — otherwise the law says skip.
2. **Rule 4's "never an invented dashboard" is the binding line.** The proposal already says "no screens, dashboards, charts"; keep that, and additionally make sure nodes + rings at 120 px do not read as a radar/gauge widget (V2's "looks like a window" weakness applies to V1 at small sizes too).
3. Green as thin strokes on the three node highlights is consistent with rule 2 — provided it never fills.
4. The proposal's list "SVG only, no baked text, HTML labels, tokens only, no animation library, reduced-motion → final state, no CLS" is **not in §5.5**; it is V5 §6. Both apply. The proposal attributes it to "the task brief", which is fine, but PR B should cite V5 §6 for those and §5.5 for the four rules above.

### `config.md` — format, and where `audience` goes

`config.md` is a record of *what was configured*, not a spec: markdown tables, one JSON block under `### Payload the site sends` (L27–41), two prose lines for `role`/`source` values (L43–45), a `### Column mapping` table (L49–60), and a curl test (L64–68). The proposal's §12 block is written as a standalone `### audience (string)` section; adapted to the file's format it becomes three edits:

- **L28–40 payload JSON:** add `"audience": ""` after `"page"`.
- **After L45:** a prose line in the existing style — `` `audience` arrives as `agents` / `planners` / `wealth` or empty. It is the landing context of the submission — which audience page the visitor was on — not a verified declaration of the person's role. Do not map it to a role column in monday. ``
- **L49–60 column mapping:** add a row `` | `audience` | text | ☐ | ``.
- **L67 curl test:** add `"audience":""` to the sample body.

**`config.md` is stale in three places the proposal could not see:** (i) it still documents a `role` field (L33, L43, L55, L67) that `LeadForm.astro` no longer renders — the role select was removed in commit `ee9bf0e`; the file was not updated. (ii) The `source` list (L44–45) omits `website-community` and the community form's **separate** webhook `PUBLIC_COMMUNITY_WEBHOOK_URL` (declared in `.env.example`) is not recorded at all. (iii) L83 says nameservers "do not change" and L86 says "Cloudflare Pages" — both superseded by planV3 §9 (NS swap approved; Worker in use). PR A should fix (i) while it is in the file; (ii) and (iii) belong to the cleanup PR.

### `LeadForm` — how `source` is passed today

`LeadForm.astro:7–17`: `source` is an **optional prop typed `string`**, default `'website'`. It is rendered as `data-source={source}` (L32) and reused to namespace every input id (`name-${source}`, L36ff). The runtime (`LeadForm.astro:109–120`) builds the payload with `source: f.dataset.source ?? 'website'` (L115). **There is no validation or narrowing of `source` anywhere** — the proposal's "typed to the union" for `audience` would be the first typed prop on the component. `audience` can follow the identical path: `audience?: 'agents'|'planners'|'wealth'|''` → `data-audience={audience}` → `audience: f.dataset.audience` in the payload builder, coerced at L109–120.

Two corrections to §1.2: (1) `cleanTrackingValue` (`lead-submit.ts:88–92`) exists and is exported, but **`LeadForm` does not use it** — it has its own unsanitised `getUtm` (L97–99); only `CommunityForm` uses the sanitiser. Reusing it for `audience` is fine; note the utm path is inconsistent today. (2) The proposal's payload list is correct (`name, phone, email, office, message, source, page, utm_*`) — confirmed there is no `role` key, contradicting `config.md`. Pre-existing and unrelated: the required `privacy` checkbox (L69) is never sent.

### Header — no dropdown; mobile is `<details>`

Confirmed. Desktop nav is a flat `<a>` list from a three-item `links` array (`Header.astro:3–7`: הפלטפורמה, תהליכי עבודה, אודות) plus the CTA (L43–48). Mobile (`md:hidden`, L53–71) is a **native `<details>/<summary>`** with an absolutely-positioned `<nav>`: no JavaScript, no `aria-expanded` (native semantics), **no Escape-to-close and no outside-click close**. A `minimal` prop (L2) hides both navs; `/community` uses it. Proposal §2.4 "Current: הפלטפורמה | תהליכי עבודה | אודות | תיאום הדגמה" is exact. N1's dropdown would be the first JS-driven nav element; PR A should decide whether the mobile group nests inside the existing `<details>` or replaces it.

### Smaller corrections

- **§1.5 motion tokens:** confirmed against `global.css` — `--motion-reveal 500ms`, `--reveal-stagger 70ms`, `--motion-line 1200ms`, `--line-stagger 100ms`, `--ease-line cubic-bezier(0.215,0.61,0.355,1)`, `--motion-card 300ms`, `--motion-interactive 250ms`. Reveal gating is `.js` + `prefers-reduced-motion: no-preference`, as stated.
- **C-4 has one source, three renders:** `src/data/advantages.ts:10`. Home renders it twice (the marquee duplicates its track for the seamless loop, `Marquee.astro:22`) and `/product` once (`product.astro:57`). Change the source once; confirm three rendered instances.
- **R-3 count:** the proposal says «ייעוץ» appears three times (C-5, C-11, C-14). Outside `/webinar/` the three hits are `index.astro:11` (ייעוץ, C-5), `about.astro:8` (ייעוץ, C-11) and `about.astro:45` (יועץ, **C-9**, not C-14). `/webinar/` adds two more (`webinar.astro:11`, `:66`). Five total; three if the webinar page is removed as decided.
- **§1.1 sitemap:** confirmed automatic (`@astrojs/sitemap` in `astro.config.mjs`); new pages need no registration.

## (d) Where the repository contradicts the proposal

1. **`/webinar/` is treated as living content (C-14, C-15, B-1, §16.5) — but the decision record says it is removed.** planV3 §9 (1 Sep): "webinar removal is final — page removed, 301 to /, out of the sitemap". The repo has not executed that (page present, in sitemap, no 301). Both cannot stand. The proposal's B-1 question ("do we touch the campaign pages?") is already answered for `/webinar/`: it goes away in the cleanup PR, and C-14/C-15 become moot. `/community/` (C-13) is a separate, live campaign and B-1 still applies to it.
2. **`config.md` describes a form that no longer exists** (the `role` field) — see (c). The proposal's §12 text assumes `config.md` is current; it is not.
3. **§1.2 "lead-submit already exports a slug sanitizer" is true but LeadForm bypasses it** — see (c).
4. **The proposal's OG concern (C-12) is also a precondition failure:** the OG card rebuild is part of the cleanup PR that has not landed, so C-12 is not only a copy conflict but a missing prerequisite.

## Copy conflicts C-1 … C-15 — file and line

| # | File : line | Current text (verbatim from repo) |
|---|---|---|
| C-1 | `src/pages/index.astro:55` → `BaseLayout.astro:30,37` | `title="Plan-T — הפלטפורמה למתכננים פיננסיים"` |
| C-2 | `src/pages/index.astro:56` → `BaseLayout.astro:38` | `…ומאפשרת למתכננים פיננסיים לראות את התיק בתמונה אחת ברורה.` |
| C-3 | `src/pages/index.astro:62` | `<p class="… text-accent-300">הפלטפורמה למתכננים פיננסיים</p>` |
| C-4 | `src/data/advantages.ts:10` (renders: `Marquee.astro:22` ×2 on Home, `product.astro:57`) | `'התאמה לשוק הישראלי ולצרכים של מתכננים פיננסיים'` |
| C-5 | `src/pages/index.astro:11` | `…גוזלים את הזמן שהיה אמור ללכת לייעוץ עצמו.` |
| C-6 | `src/components/Footer.astro:18` | `פלטפורמה למתכננים פיננסיים בישראל.` |
| C-7 | `src/pages/product.astro:9` (meta) and `:47` (body) | `…ומאפשרת למתכננים פיננסיים לקבל תמונה רחבה…` / `…כך שמתכננים פיננסיים יכולים לבחון את התיק…` |
| C-8 | `src/pages/solutions.astro:39` (title), `:40` (meta), `:44` (h1) | `תהליכי עבודה למתכננים פיננסיים \| Plan-T` / `…של מתכננים פיננסיים…` / `<h1>תהליכי עבודה למתכננים פיננסיים</h1>` |
| C-9 | `src/pages/about.astro:45` | `אנחנו בונים את שולחן העבודה של היועץ הישראלי — כדי שהזמן ילך ללקוחות, לא לניירת.` |
| C-10 | `src/pages/about.astro:23` | `description="מי אנחנו: פלטפורמה ישראלית שנבנית יחד עם מתכננים פיננסיים."` |
| C-11 | `src/pages/about.astro:8` | `…עם משרדי ייעוץ וסוכנויות בישראל…` |
| C-12 | `public/images/og.png` (19,605 B, 31 Aug 16:03) — referenced by `BaseLayout.astro` default `ogImage` | binary; text baked in per proposal |
| C-13 | `src/pages/community.astro:21` (title), `:22` (meta), `:31` (h1), `:34` (body), `:16` (value line) | `קהילת Plan-T למתכננים פיננסיים` ×2, `…עם מתכננים פיננסיים נוספים.` ×2, `חיבור בין מתכננים פיננסיים` |
| C-14 | `src/pages/webinar.astro:11` | `'מה השתנה בשולחן העבודה של היועץ בשנה האחרונה.'` — **moot if webinar removal executes** |
| C-15 | `src/pages/webinar.astro:66` | `הוובינר מיועד ליועצים פיננסיים, סוכני ביטוח ויועצים פנסיוניים.` — **moot if webinar removal executes** |

Note for PR C: C-13's count is five rendered strings across four lines, not "h1, body ×3" — the meta description (L22) and the value line (L16) are the extra two.

---

*End of repository verification. The original proposal follows unchanged.*

---

# Phase 1 — Audience Architecture Proposal
Plan-T marketing site · 02.09.2026 · PROPOSAL ONLY — nothing built, nothing edited

> How this was produced: a full review of the live staging site (`plant-marketing-site.shrill-bread-1333.workers.dev`) — every route, the compiled CSS/JS, the lead-form runtime, sitemap, robots, and the OG image. Repository documents (`CLAUDE.md`, build-plan, §5.5, `config.md`) were **not** available, so section 0 lists what was inferred instead of read. Anything that needs the repo is marked `[REPO]`.

---

## 0. Precondition check and sources

| Check | Result |
|---|---|
| Cleanup/alignment PR merged into `main` | `[REPO]` not verifiable from the live site. The staging build looks post-cleanup (consistent nav, one `LeadForm` component, one form runtime). Confirm with `git log` before PR A. |
| Stack | **Astro** (static, `/_astro/*` bundles, `sitemap-index.xml`) + **Tailwind v4** (CSS-variable tokens) on **Cloudflare Workers**. Canonical/OG URLs already point to `plan-t.co.il`. |
| `CLAUDE.md`, build-plan, `config.md` | `[REPO]` not read. |
| §5.5 image design law | `[REPO]` not read. The constraints in this proposal are the ones stated in the task brief; if §5.5 is stricter, §5.5 wins. |
| Form handler | Read from the compiled bundles `LeadForm.astro_*.js` and `lead-submit.*.js`. |
| Analytics layer | None found (no GA4/GTM/Plausible/Clarity tag in any page). Per the decision, no analytics events are proposed. |

---

## 1. Current-state inventory

### 1.1 Routes

| Route | Title | Purpose | Primary CTA | Under new IA |
|---|---|---|---|---|
| `/` | Plan-T — הפלטפורמה למתכננים פיננסיים | Home | in-page form + header link → `/contact/` | **modified** (selector, copy, visual) |
| `/product/` | הפלטפורמה | Platform overview + 4 benefits | in-page form | **modified** (copy only) |
| `/solutions/` | תהליכי עבודה למתכננים פיננסיים | Before / during / after the meeting | in-page form | **modified** (title/meta only — see §2.3) |
| `/about/` | אודות Plan-T | Company; two `[TBD]` blocks still open | in-page form | **modified** (copy) |
| `/contact/` | יצירת קשר ותיאום הדגמה | Email, phone, form | in-page form | unchanged |
| `/privacy/`, `/accessibility/` | — | legal | — | unchanged |
| `/community/` | קהילת Plan-T למתכננים פיננסיים | Campaign page, own short form (name + mobile), **not in nav** | own form | **copy only** |
| `/webinar/` | וובינר השקה של Plan-t AI — 13 ו-15 באוקטובר 2026 | Campaign page, **not in nav**, uses `LeadForm` with `data-source="website-webinar"` | in-page form | **copy only** |
| new `/agents/`, `/planners/`, `/wealth/` | — | audience pages | in-page form | **new** |

No route is removed → **no redirects needed**. Sitemap is generated by Astro's integration → new pages are picked up automatically.

### 1.2 The demo form (`LeadForm`)

- Rendered **in-page on every main page** (Home, product, solutions, about, contact, webinar). There is no shared "demo" page that the CTAs funnel to — the header "תיאום הדגמה" goes to `/contact/`, which is itself just another instance of the same form.
- Each instance carries `data-source="website-<page>"` and `data-webhook` (empty on staging → the runtime shows the "הטופס עדיין לא מחובר" message; expected).
- Payload sent as JSON POST: `name, phone, email, office, message, source, page (window.location.pathname), utm_source, utm_medium, utm_campaign`. Honeypot field `company_website`.
- `lead-submit.js` already exports a slug sanitizer (`/^[A-Za-z0-9_-]+$/`, max 64 chars). It is the natural place to validate `audience`.
- Implication for §6: **no query parameter is needed**. The audience value can be rendered server-side as `data-audience` on the form of each audience page, exactly like `data-source` is today.

### 1.3 Existing audience/persona mechanisms

**None.** The site has no persona tabs, toggles or segmented sections. The audience selector will be the first and only audience-selection system — no merge required. (Good: the "two systems" risk in the brief does not exist here.)

### 1.4 Home page structure today (section order)

1. Hero (dark `ink-950→ink-800` gradient, `hero-slope` clip, montage JPG with text baked in — the §5.5 hero exception)
2. Benefits **marquee** (4 lines, auto-scroll; wraps statically under reduced-motion) — `bg-ink-50`
3. "מכירים את זה מהמשרד שלכם?" — 3 cards (2 pains + "הדרך של Plan-T") — `bg-white`
4. "סיור קצר במוצר" — 3 screenshots — `bg-ink-50`
5. "משרדים שכבר עובדים איתנו" — one testimonial (רווית, סוכנת ביטוח ופיננסים עצמאית) — `bg-ink-950`
6. Lead form — `bg-ink-900`

### 1.5 Design tokens relevant to this work

| Token group | Values found |
|---|---|
| Brand (blue) | `--color-brand-50 … 800` (`#eef8fd` → `#15567a`, mid `#249fda`) |
| Accent (green) | `--color-accent-300/400/500` (`#b2db75`, `#9bcf4e`, `#8dc63f`) — used on buttons only; **not** as surfaces |
| Ink (navy/neutral) | `--color-ink-50 … 950` (`#f5f6fa` → `#080918`) |
| Surface / warn | `--color-surface #f6f8fb`, `--color-warn-*` |
| Type | `--font-display` = Noto Serif Hebrew (headings); sans body |
| Motion | `--motion-reveal .5s`, `--reveal-stagger 70ms`, `--motion-line 1.2s` + `--ease-line`, `--line-stagger .1s`, `--motion-card .3s`, `--motion-interactive .25s` |
| Motion infra | `.reveal` (IntersectionObserver, threshold .15, unobserve after first hit), `.reveal-lines` (line-split headline reveal), `.card-lift`. All gated on `.js` + `prefers-reduced-motion: no-preference`; reduced-motion shows final state. |
| Layout | `.band` / `.band--large` vertical rhythm (44/54px mobile → 88/108px desktop), `hero-slope` |

Everything the evolution visual needs (line-draw timing, reveal observer, reduced-motion fallback) **already exists**. No animation library is justified.

---

## 2. Proposed information architecture

### 2.1 Home audience selector

**Placement:** directly below the hero, **in the slot currently occupied by the benefits marquee** (`bg-ink-50` band). Reasons: it is the first thing after the hero; the marquee is generic and its 4th line ("...לצרכים של מתכננים פיננסיים") is a copy conflict anyway; keeping both would put two horizontal three-ish elements back-to-back.

What happens to the marquee → decision **D3**: (a) remove it, (b) move it below the pains section, (c) keep it above the selector. Recommendation: **(a) remove** — its four claims are already restated on `/product/` and in the pains section.

**Mobile:** three stacked full-width cards (no horizontal scroll, no hiding). Each card is one `<a>` (whole card clickable, visible focus ring using existing `focus:border-brand-500` pattern), `card-lift` hover.

**Relation to the evolution visual (§3):** ONE component. The selector cards sit on/around the Home visual: the visual is the backdrop, the three cards are the labels. This is what avoids "two three-things elements". PR A ships the cards with a static placeholder layout; PR B adds the SVG behind them (see §8/§13).

### 2.2 Selector copy — `DRAFT — requires Natali approval`

Heading options:

| # | Heading | Note |
|---|---|---|
| H1 | **איפה אתם נמצאים היום?** | the brief's framing; slight "position on a path" undertone |
| H2 | **איך אתם רואים את הלקוח היום?** | matches the "expanding view" concept literally; recommended |
| H3 | **בחרו את הדף שנכתב בשבילכם** | most literal, least evocative |

Sub-line (optional, one line): `שלוש נקודות מבט על אותו לקוח — ו-Plan-T מתאימה את עצמה לכל אחת מהן.`

Cards (name · line · link):

| Audience | Option A (brief) | Option B | Option C |
|---|---|---|---|
| **סוכני ביטוח** → `/agents/` | לראות מעבר למוצר הבודד | מהפוליסה לתמונה השלמה של הלקוח | כל מה שיש ללקוח — לא רק מה שמכרתם לו |
| **מתכננים פיננסיים** → `/planners/` | לחבר את כל התמונה הפיננסית | השקעות, פנסיה וכיסויים — בתיק אחד | כל התמונה הפיננסית, מחוברת |
| **מנהלי עושר** → `/wealth/` | לנהל מורכבות מתוך תמונה אחת ברורה | יותר נכסים, יותר ישויות — פחות עומס | תמונה אחת ברורה גם כשהתיק מורכב |

Respect test on the agent line: Option A implies the agent currently sees only the single product. Option B keeps the same movement but starts from something the agent is proud of (the policy) rather than a limitation. **Recommend B** for agents, A for the other two.

Card names use plural (סוכני ביטוח) to match the nav; the audience-page hero addresses the reader in second person.

### 2.3 תהליכי עבודה (`/solutions/`)

**Recommendation: A — keep it**, with a scope correction.

Reasoning from the actual content: the page is a before/during/after-the-meeting capability walkthrough (portfolio picture, מסלקה data, comparison of alternatives, branded report, regulatory documentation). Every one of those bullets applies to all three audiences; only the **title, h1 and meta** lock it to planners. Folding it into the audience pages (option B) would triple the same bullets and leave the site with no "what can I do" page. So:

- Keep `/solutions/` as the capability page.
- Retitle: `תהליכי עבודה` / h1 `תהליכי עבודה עם Plan-T` / meta without "מתכננים פיננסיים" (see §10).
- Audience pages answer "who is this for"; they link to `/solutions/` **only through the nav** (no secondary CTA), per the brief.

### 2.4 Main navigation

Current: `הפלטפורמה | תהליכי עבודה | אודות | תיאום הדגמה`

Proposed (**N1, recommended**):

`הפלטפורמה | למי זה מתאים ▾ | תהליכי עבודה | אודות | תיאום הדגמה`

- `למי זה מתאים` opens: `סוכני ביטוח` / `מתכננים פיננסיים` / `מנהלי עושר`. Desktop: hover/focus/click dropdown, keyboard-operable (Esc closes, arrow keys optional). Mobile (`md:hidden` menu): the three items render as an indented group under the "למי זה מתאים" label — no nested toggle.
- The header currently has **no dropdown component** → PR A adds one. Small, but it is new UI.

Alternative (**N2**): no dropdown; `למי זה מתאים` is a plain link to `/#audiences` (the Home selector). Zero new components; one extra click for visitors on inner pages.

The brief's four-item version (`הפלטפורמה | למי זה מתאים ▾ | אודות | תיאום הדגמה`) drops תהליכי עבודה from the nav — only coherent if §2.3 had gone with option B. With option A it stays.

Footer link list gets the same three audience links added (one extra row).

### 2.5 SEO / routing hygiene

- No removed routes → no 301s.
- New pages (Hebrew titles/meta — `DRAFT — requires Natali approval`):

| Route | `<title>` | Meta description |
|---|---|---|
| `/agents/` | Plan-T לסוכני ביטוח — כל התיק של הלקוח במקום אחד | Plan-T מרכזת לסוכני ביטוח את הנתונים הפנסיוניים והפיננסיים של הלקוח — מסלקה, כיסויים וחיסכון — בתמונה אחת, ומכינה אתכם לפגישה בדקות. |
| `/planners/` | Plan-T למתכננים פיננסיים — כל התמונה הפיננסית, מחוברת | Plan-T מחברת למתכננים פיננסיים את ההשקעות, הפנסיה והכיסויים של הלקוח ושל התא המשפחתי לתיק אחד ברור, מהכנה לפגישה ועד הדוח ללקוח. |
| `/wealth/` | Plan-T למנהלי עושר — תמונה אחת ברורה גם בתיקים מורכבים | Plan-T מציגה למנהלי עושר את החשיפות והקצאת הנכסים של הלקוח ושל התא המשפחתי במקום אחד — עם תיעוד מלא לבקרה ולרגולציה. |

- Canonical: `https://plan-t.co.il/<slug>/`, same pattern as existing pages. `og:image`: see conflict C-12 — the shared OG image needs a new version before these pages go live.
- Internal links: Home selector, nav dropdown, footer. `/solutions/` and `/product/` do not need to link to audience pages.

---

## 3. Proposed Home selector — summary

Covered in §2.1–2.2. Component contract for PR A:

```
<section id="audiences" class="band bg-ink-50" aria-labelledby="audiences-title">
  <h2 id="audiences-title">…</h2>
  <p>…sub-line…</p>
  <div class="grid gap-4 md:grid-cols-3">            ← 3 × <a class="card-lift …" href="/agents/">
    <a> <h3>סוכני ביטוח</h3> <p>line</p> <span aria-hidden>←</span> </a>
    …
  </div>
  [PR B: SVG backdrop inserted here, aria-hidden]
</section>
```

---

## 4. `/agents/` — content draft
`DRAFT — requires Natali approval` · every claim footnoted to its source

**Headline options**
- A. כל מה שיש ללקוח שלך — בתמונה אחת.
- B. הלקוח שלך הוא יותר מהפוליסה. עכשיו אפשר לראות את זה.
- C. מהמסלקה ועד החיסכון: התיק המלא של הלקוח, מסודר.

**Subheadline**
Plan-T מרכזת את הנתונים הפנסיוניים והפיננסיים של הלקוח במקום אחד — כדי שתגיעו לכל פגישה עם התמונה השלמה, ולא רק עם המוצר שעל השולחן. [1][2]

**Pains** (section title: מכירים את זה?)
- המידע של הלקוח מפוזר: קובץ מסלקה כאן, נתוני יצרנים שם, וגיליון שמנסה לחבר הכל. [3]
- הכנה לפגישה לוקחת שעות של איסוף והקלדה — לפני שהתחלתם בכלל לדבר עם הלקוח. [3][4]
- ללקוח יש נכסים גם מחוץ למה שאתם מטפלים בו — ואין לכם דרך פשוטה לראות אותם לצד הכיסויים. [5]

**What Plan-T enables at this stage** (section title: מה Plan-T נותנת לכם)
- ריכוז נתוני המסלקה לצד שאר המידע בתיק. [5]
- תמונת תיק אחת: השקעות, חיסכון וכיסויים — של הלקוח ושל התא המשפחתי. [5][6]
- הכנה לפגישה בדקות במקום בשעות. [5]
- דוח מסודר ללקוח בסוף התהליך, ממותג במיתוג המשרד. [5]
- תיעוד מלא של התהליך לצורכי רגולציה ובקרה. [5]
- Optional proof: the existing testimonial (רווית, סוכנת ביטוח ופיננסים עצמאית) is the single strongest asset for this page — it is already approved site content. [7]

**Progression** (section title: כשהלקוחות צריכים מכם יותר)
- כשהלקוחות צריכים ממך יותר — Plan-T כבר מוכנה לשלב הבא.
- alt: הלקוחות שלכם לא נעצרים בפוליסה — וגם התיק שלהם ב-Plan-T לא. כשהשיחה מתרחבת להשקעות ולתכנון, אותו תיק, אותה מערכת, תמונה רחבה יותר.

**CTA context** — form title: `רוצים לראות את התיק של לקוח אמיתי מסודר במסך אחד?` · button stays `שלחו ונחזור אליכם` (existing) · form `data-source="website-agents"`, `data-audience="agents"`.

## 5. `/planners/` — content draft
`DRAFT — requires Natali approval`

**Headline options**
- A. כל התמונה הפיננסית של הלקוח. מחוברת.
- B. השקעות, פנסיה וכיסויים — בתיק אחד שאפשר לעבוד איתו.
- C. פחות זמן על חיבור נתונים. יותר זמן על התכנון.

**Subheadline**
Plan-T מרכזת את הנתונים הפיננסיים והפנסיוניים של הלקוח ושל התא המשפחתי, מסדרת את תהליך העבודה ומשאירה לכם את מה שחשוב: השיחה עם הלקוח וההחלטות המקצועיות. [1][6][8]

**Pains**
- המידע הפנסיוני והפיננסי מפוזר בין מסלקה, יצרנים וגיליונות — וקשה לבנות ממנו תמונה אחת שלמה. [3]
- להציג ללקוח השוואה ברורה בין חלופות דורש עבודה ידנית בכל פעם מחדש. [5]
- כל דוח ללקוח נבנה מהתחלה, בכלים שלא נועדו לזה. [5]

**What Plan-T enables**
- תמונת תיק אחת: השקעות, חיסכון וכיסויים במקום אחד. [5]
- בחינת התיק והחשיפות בצורה ברורה ומסודרת. [5][6]
- השוואה ברורה בין חלופות להצגה מול הלקוח. [5]
- דוח מסודר ללקוח, ממותג במיתוג המשרד. [5]
- ממשק שנבנה בשיתוף קהילת המשתמשים, מותאם לשוק הישראלי. [1]

**Progression** (section title: כשהתיקים גדלים)
- כשהתיקים גדלים והמורכבות עולה — גם נקודת המבט יכולה להתרחב.
- alt: תיק של לקוח אחד הופך לתיק של משפחה. חשיפה אחת הופכת למספר ישויות. Plan-T מציגה את כל זה באותה תמונה ברורה — בלי להחליף מערכת.

**CTA context** — form title: `נדבר על תהליך העבודה שלכם?` (existing wording from `/solutions/`) · `data-source="website-planners"`, `data-audience="planners"`.

## 6. `/wealth/` — content draft
`DRAFT — requires Natali approval`

**Headline options**
- A. יותר מורכבות לא צריכה לייצר יותר עומס.
- B. תיקים מורכבים. תמונה אחת ברורה.
- C. כל הנכסים, כל הישויות, כל החשיפות — במסך אחד.

**Subheadline**
Plan-T מרכזת את נתוני הנכסים של הלקוח ושל התא המשפחתי ומציגה תמונה רחבה של החשיפות והקצאת הנכסים — כדי שתוכלו לנהל היקף ומורכבות בלי לאבד את התמונה. [6]

**Pains**
- ככל שהתיק גדל, המידע מתפזר על פני יותר מקורות ויותר ישויות — והתמונה הכוללת הולכת לאיבוד. [3][6]
- חשיפות שמתפצלות בין חשבונות, קופות ומוצרים קשה לראות במקובץ. [6]
- דרישות התיעוד והבקרה גדלות יחד עם התיק. [5]

**What Plan-T enables**
- תמונה רחבה של החשיפות והקצאת הנכסים — של הלקוח ושל התא המשפחתי, במקום אחד. [6]
- בחינת התיק והחשיפות בצורה ברורה ומסודרת. [5]
- תיעוד מלא של התהליך לצורכי רגולציה ובקרה. [5]
- דוח מסודר ללקוח, ממותג במיתוג המשרד. [5]
- הנתונים נשארים בסביבת העבודה של המשרד ומשמשים אך ורק לצרכיו. [9]

**Final stage** (section title: שליטה, לא עומס) — no fourth persona
- יותר מורכבות לא צריכה לייצר יותר עומס. Plan-T נבנתה כדי שהתמונה תישאר ברורה גם כשהתיק מפסיק להיות פשוט.
- alt: הצמיחה של התיק לא צריכה להיות צמיחה של העומס. תמונה אחת, שליטה מלאה.

**CTA context** — form title: `רוצים לראות איך תיק מורכב נראה במסך אחד?` · `data-source="website-wealth"`, `data-audience="wealth"`.

**Sources for §4–6**
[1] Home marquee / `/product/` benefits · [2] Home hero · [3] Home "תמונה חלקית" pain card · [4] Home "שעות על ניירת" pain card · [5] `/solutions/` bullets · [6] `/product/` intro ("של הלקוח ושל התא המשפחתי… החשיפות והקצאת הנכסים") · [7] Home testimonial · [8] Home hero sub-line · [9] `/about/` "הנתונים הם שלכם"

Deliberately **not used**: anything from the old Wix site (`plan-t.org.il` — "היחידה בישראל", "עד רמת הנכס הבודד", CRM/forms/portal modules, "12+ שנים"), the webinar's "Plan-t AI", and any number. These are candidates in §11, not claims.

---

## 7. Evolution visual — options

All three: SVG, no baked text, HTML labels, existing tokens only, green only as thin accent strokes, animation via the existing `.reveal` observer + `stroke-dashoffset` with `--motion-line`/`--ease-line`, reduced-motion = final frame immediately.

### V1 — Field of view (concentric)
```
            ┌ ring 3: full connected picture (ink-200 strokes, brand-500 nodes)
        ┌───│─── ring 2: more layers connect
    ┌───│───│─── ring 1: the client + the nearest products
    │  ● ●  │   │
    │ ● ◎ ● │   │      ◎ = the client (always at the centre, always the same)
    │  ● ●  │   │
    └───┴───┴───┘
 labels (HTML, outside): סוכני ביטוח · מתכננים פיננסיים · מנהלי עושר
```
- One client at the centre for everyone. Each ring adds nodes and connecting lines; **nothing is removed and nothing is "below"** — a radial expansion has no rank.
- Home: as the visitor scrolls, ring 1 is drawn, then ring 2's connections, then ring 3 (three `.reveal` steps, `--line-stagger`). Full drawing in ~1.2 s per ring using `--motion-line`.
- Audience page marker: the same three rings at ~120 px, all rings visible in `ink-200`, the current audience's ring and nodes in `brand-500`, with the HTML label bold. An agent sees the whole picture with their ring lit — not a missing outer ring.
- Mobile: rings scale down; labels move from around the circle to a row beneath it.

### V2 — Widening frame
```
   ┌───────────────────────────────┐
   │   ┌───────────────────┐       │
   │   │   ┌─────────┐     │       │     dots/tiles = the client's assets & coverages
   │   │   │ ▪ ▪ ▪   │  ▪  │   ▪   │     inner frame = agent view, outer = wealth view
   │   │   │ ▪ ▪     │     │       │     content outside a frame is dimmed, not absent
   │   └───┴─────────┴─────┘       │
   └───────────────────────────────┘
```
- Reads as "the same reality, more of it in focus". Honest and calm; slightly less distinctive than V1.
- Home scroll: outer frames fade in, dimmed tiles brighten as each frame lands. Marker: three nested frames, current one in `brand-500`.
- Weakness: nested rectangles look like a mockup/window at small sizes — brushes against "no invented UI".

### V3 — Connecting constellation (left→right)
Three clusters of nodes; edges accumulate from cluster 1 to 3. **Not recommended**: a left-to-right (or, in RTL, right-to-left) sequence is exactly the staircase/ranking read the brief forbids.

## 8. Recommended visual direction

**V1 — Field of view.** It encodes the concept literally (the view widens), keeps every audience looking at the same client, has no directionality to misread as rank, and is the cheapest to build: circles, dots and paths, animated with the line-draw tokens the site already has. It doubles as the backdrop of the Home selector (the three cards sit beneath/around the rings) and as a 120 px "you are here" marker on each audience page with zero extra design language.

Constraint reminders for PR B: `aria-hidden="true"` on the SVG; labels are the `<h3>`s of the cards; reserve `width/height` (or `aspect-ratio`) so the reveal causes no CLS; green appears only on the three node highlights, never as a fill.

---

## 9. About-page copy correction
`DRAFT — requires Natali approval`

Current h1 sub-line: `אנחנו בונים את שולחן העבודה של היועץ הישראלי — כדי שהזמן ילך ללקוחות, לא לניירת.` — **not approved** ("היועץ" is both narrower than the three audiences and a licensing-loaded word).

Replacement options:

- A. אנחנו בונים את המקום שבו כל התמונה של הלקוח מתחברת — כדי שהזמן ילך ללקוחות, לא לניירת.
- B. אנחנו בונים את המקום שבו כל התמונה של הלקוח מתחברת. לסוכני ביטוח, מתכננים פיננסיים ומנהלי עושר שרוצים לעבוד עם תמונה רחבה יותר — בלי להוסיף עוד מורכבות ליום העבודה.
- C. (h1 line + supporting paragraph) h1: **המקום שבו כל התמונה של הלקוח מתחברת.** paragraph: Plan-T נבנית לסוכני ביטוח, למתכננים פיננסיים ולמנהלי עושר שרוצים לראות את הלקוח בתמונה רחבה יותר — בלי להוסיף עוד מורכבות ליום העבודה.

Recommend **C** (keeps the existing short-h1 rhythm of the site and moves the audience list to body text where it reads naturally).

Same page, "מהשטח, לא מהמעבדה": `…עבודה יומיומית עם משרדי ייעוץ וסוכנויות בישראל` → propose `…עם סוכנויות ביטוח, משרדי תכנון פיננסי וניהול עושר בישראל` (also removes "ייעוץ").

The two `[TBD]` blocks (הסיפור, הצוות) are still placeholders on the live build — flagged in §11, out of scope here.

---

## 10. Site-wide copy conflicts created by the new positioning
Listed for approval — **not changed**. File names are the page routes; `[REPO]` for exact source paths/lines.

| # | Location | Current text | Issue | Proposed direction |
|---|---|---|---|---|
| C-1 | `/` `<title>`, `og:title` | Plan-T — הפלטפורמה למתכננים פיננסיים | planner-only | Plan-T — כל התמונה של הלקוח, במקום אחד |
| C-2 | `/` meta + `og:description` | …ומאפשרת למתכננים פיננסיים לראות את התיק… | planner-only | …ומאפשרת לסוכני ביטוח, מתכננים פיננסיים ומנהלי עושר לראות את התיק בתמונה אחת ברורה. |
| C-3 | `/` hero eyebrow | הפלטפורמה למתכננים פיננסיים | planner-only, first line on the site | הפלטפורמה שרואה את כל התמונה של הלקוח / or drop the eyebrow |
| C-4 | `/` marquee + `/product/` benefits, 4th item | התאמה לשוק הישראלי ולצרכים של מתכננים פיננסיים | planner-only | התאמה לשוק הישראלי ולדרך העבודה של סוכנים, מתכננים ומנהלי עושר |
| C-5 | `/` pain card "שעות על ניירת" | …הזמן שהיה אמור ללכת לייעוץ עצמו | "ייעוץ" — licensing-loaded | …הזמן שהיה אמור ללכת ללקוח עצמו |
| C-6 | Footer, all pages | פלטפורמה למתכננים פיננסיים בישראל. | planner-only, site-wide | הפלטפורמה שבה כל התמונה של הלקוח מתחברת. |
| C-7 | `/product/` meta + body | …מאפשרת למתכננים פיננסיים לקבל תמונה רחבה / כך שמתכננים פיננסיים יכולים לבחון | planner-only | …מאפשרת לאנשי המקצוע… / כך שאפשר לבחון… |
| C-8 | `/solutions/` `<title>`, h1, meta | תהליכי עבודה למתכננים פיננסיים / …של מתכננים פיננסיים | planner-only | תהליכי עבודה עם Plan-T / …תהליך העבודה מהכנה לפגישה ועד הדוח ללקוח |
| C-9 | `/about/` h1 sub-line | שולחן העבודה של היועץ הישראלי | not approved | §9 |
| C-10 | `/about/` meta | פלטפורמה ישראלית שנבנית יחד עם מתכננים פיננסיים. | planner-only | …שנבנית יחד עם סוכני ביטוח, מתכננים פיננסיים ומנהלי עושר. |
| C-11 | `/about/` "מהשטח" | משרדי ייעוץ וסוכנויות | "ייעוץ" | §9 |
| C-12 | `/images/og.png` (shared OG image, all pages) | text baked in: הפלטפורמה למתכננים פיננסיים | planner-only **and** text-in-image | new OG asset (logo + domain, or logo + approved tagline) |
| C-13 | `/community/` `<title>`, h1, body ×3 | קהילת Plan-T למתכננים פיננסיים | planner-only; campaign page — may be intentional | קהילת Plan-T לאנשי מקצוע… — **ask before touching** |
| C-14 | `/webinar/` agenda item 1 | מה השתנה בשולחן העבודה של היועץ | "היועץ" | …בשולחן העבודה של איש המקצוע |
| C-15 | `/webinar/` audience line | מיועד ליועצים פיננסיים, סוכני ביטוח ויועצים פנסיוניים | different taxonomy from the new three audiences | מיועד לסוכני ביטוח, מתכננים פיננסיים ומנהלי עושר — **campaign page, ask first** |

---

## 11. עובדות ושאלות שדורשות החלטה של נטלי
(בעברית — לסקירה משותפת)

**עובדות מוצר — נדרש אישור לפני שהקופי מתחזק**

| # | שאלה | למה זה חשוב |
|---|---|---|
| F-1 | אילו מוצרים/מקורות נתונים נכנסים בפועל? (מסלקה, הר הביטוח, בנקים, ניהול תיקים, מוצרים אלטרנטיביים — הרשימה מהאתר הישן) | דפי הקהל יכולים לנקוב במקורות בשם — רק אם זה נכון היום |
| F-2 | "השוואה ברורה בין חלופות" (מופיע ב-/solutions) — האם זו השוואת מוצרים/מסלולים אמיתית או תצוגה זו לצד זו? | שורה מרכזית בדף המתכננים |
| F-3 | האם Plan-T מזהה הזדמנויות אוטומטית, או חושפת מידע שעוזר לאיש המקצוע לזהות? | קובע את הניסוח בכל שלושת הדפים; גם שאלה רגולטורית |
| F-4 | האם למנהלי עושר יש תצוגת משפחה / ריבוי ישויות (חברות, נאמנויות)? "התא המשפחתי" מופיע ב-/product — האם זה מכסה ישויות שאינן משפחה? | דף /wealth נשען על זה |
| F-5 | האם "כל המידע של הלקוח במקום אחד" נכון מילולית, או "כל הנתונים הפיננסיים והפנסיוניים"? | ההדליין של דף הבית |
| F-6 | "עד רמת הנכס הבודד" ו"חשיפה במונחי דלתא" (אתר ישן) — עדיין נכונים? מותר להשתמש? | חומר חזק לדף /wealth |
| F-7 | "היחידה בישראל" (אתר ישן) — האם יש גיבוי לטענה? | אם לא — לא נשתמש |
| F-8 | מהו הבידול החזק ביותר לכל קהל? (סוכנים / מתכננים / מנהלי עושר) | קובע איזה יכולת עולה ראשונה בכל דף |
| F-9 | האם מותר להשתמש בעדות של רווית בדף /agents (בנוסף לדף הבית)? | הנכס הכי חזק לדף הסוכנים |
| F-10 | CRM, מערכת טפסים, פורטל לקוח, דוחות בקרה (אתר ישן) — האם הם חלק מההצעה של האתר החדש, או הושמטו בכוונה? | האתר החדש שותק לגביהם; ההשמטה נראית מכוונת |

**מינוח ורגולציה**

| # | שאלה |
|---|---|
| R-1 | "סוכני ביטוח" — מול "סוכנים פנסיוניים" / "בעלי רישיון". איזה מונח הקהל עצמו משתמש בו, ואיזה בטוח מבחינת רגולציה? |
| R-2 | "מנהלי עושר" — האם יש חשש שיובן כ"מנהלי תיקים" (פעילות מורשית)? האם להוסיף שורת הבהרה בדף /wealth? |
| R-3 | "ייעוץ" מופיע 3 פעמים באתר (C-5, C-11, C-14). מאשרים להסיר בכולם? |
| R-4 | האם להוסיף לדפי הקהל שורה בסגנון "אין תחליף לשיקול הדעת המקצועי שלכם" (קיימת ב-/about)? |

**החלטות קופי/עסקיות**

| # | שאלה |
|---|---|
| B-1 | דפי הקמפיין /community ו-/webinar — האם נוגעים בהם ביישור הקופי, או שהם חיים בנפרד? |
| B-2 | תמונת ה-OG המשותפת (C-12) — צריך נכס חדש. עם טאגליין או רק לוגו + דומיין? |
| B-3 | שני ה-[TBD] בדף אודות (הסיפור, הצוות) — עדיין פתוחים באתר החי. לא חלק מהמשימה הזו, אבל חוסמים עלייה לאוויר. |
| B-4 | האם להציג חבילות (פלנר/פרו) בדפי הקהל? (ראו §12 — ההמלצה: לא בשלב הזה) |

---

## 12. Lead-tagging specification (site side only)

### Behaviour

| Page | `source` (existing) | `audience` (new) |
|---|---|---|
| `/agents/` | `website-agents` | `agents` |
| `/planners/` | `website-planners` | `planners` |
| `/wealth/` | `website-wealth` | `wealth` |
| `/`, `/product/`, `/solutions/`, `/about/`, `/contact/`, `/webinar/` | existing values | `""` |

- **Transport:** none needed. The form is rendered in-page on every page; the audience page passes `audience="agents"` to `LeadForm`, which renders `data-audience="agents"` next to the existing `data-source`. The runtime reads `form.dataset.audience`.
- **No session persistence** (decided): `/agents/` → Home → submit sends `""`. The header "תיאום הדגמה" from an audience page goes to `/contact/` and therefore also sends `""` — acceptable and consistent; the audience page's **own** primary CTA is an in-page anchor to `#lead-form`, so the audience-page visitor who converts on the page is tagged.
- **Sanitization:** at build time the prop is typed to the union `"agents" | "planners" | "wealth" | ""`; at runtime the payload does `["agents","planners","wealth"].includes(v) ? v : ""` (can reuse the exported slug sanitizer as a first pass).
- **Payload after change:** `{ name, phone, email, office, message, source, page, audience, utm_source, utm_medium, utm_campaign }` — one new key, no renames.
- **Analytics:** none exists on the site; nothing proposed.

### Proposed text for `config.md`

```
### audience (string)
Allowed values: "agents" | "planners" | "wealth" | "" (empty string).
Set from the page the form was submitted on:
  /agents/ → "agents", /planners/ → "planners", /wealth/ → "wealth",
  every other page → "".
Rendered server-side as data-audience on the LeadForm; the runtime copies it
into the payload and coerces any value outside the allowed set to "".
Not persisted across pages. Not derived from utm_* or the query string.

Meaning: the LANDING/AUDIENCE CONTEXT of the submission — which audience
page the visitor was on. It is NOT a verified declaration of the person's
professional role. Do not map it to a "role" field in monday.com unless the
visitor selects a role explicitly in a separate field.
```

---

## 13. SEO / routing changes
Covered in §2.5. Summary: 3 new URLs, 0 redirects, sitemap automatic, retitle `/solutions/` in place, new OG image asset required before launch (C-12).

---

## 14. Recommended PR split

**Recommendation: three PRs — A, B, C — in that dependency order, C independent.**

| PR | Contents | Depends on | Ships alone? |
|---|---|---|---|
| **A — Audience architecture** | `#audiences` selector on Home (cards only, static layout); `/agents/`, `/planners/`, `/wealth/` pages with approved copy; nav dropdown + footer links; `audience` prop → `data-audience` → payload; `config.md`; new page titles/meta | Natali approval of §4–6 copy, D-decisions | Yes. Visitors see three clean cards under the hero and three working pages. |
| **B — Evolution visual** | V1 SVG; Home scroll progression behind the selector; audience-page stage marker; reduced-motion state | A (needs the `#audiences` section and page templates) | Yes, after A. |
| **C — Copy alignment** | C-1…C-12 (+C-13…15 if B-1 says yes); About §9; new OG image | Natali approval only | Yes, and it can go **before** A — it fixes wording that is wrong regardless of the new pages. |

Why not one PR: A is structural and reviewable on its own; B is design-heavy and will iterate (easing, sizes, mobile) without touching copy; C touches 9+ files across pages that may be live campaigns (community/webinar) and should not be blocked by, or block, the new pages.

---

## 15. החלטות לאישור (D)

| # | החלטה | המלצה | חלופות |
|---|---|---|---|
| D1 | כותרת הסלקטור בדף הבית | H2 — "איך אתם רואים את הלקוח היום?" | H1 "איפה אתם נמצאים היום?" · H3 "בחרו את הדף שנכתב בשבילכם" |
| D2 | שורות הכרטיסים | סוכנים: אופציה B · מתכננים: A · מנהלי עושר: A | ראו טבלה §2.2 |
| D3 | מה קורה למרקיז היתרונות בדף הבית | להסיר (התוכן קיים ב-/product) | להזיז מתחת לסקשן הכאבים · להשאיר מעל הסלקטור |
| D4 | תהליכי עבודה (/solutions) | A — להשאיר כדף יכולות, לתקן כותרת ומטא | B — למזג לדפי הקהל |
| D5 | ניווט ראשי | N1 — dropdown "למי זה מתאים" (5 פריטים) | N2 — לינק יחיד ל-/#audiences, בלי dropdown |
| D6 | ויזואל האבולוציה | V1 — שדה ראייה (טבעות) | V2 — מסגרת מתרחבת |
| D7 | הסלקטור והוויזואל = רכיב אחד (הכרטיסים על רקע ה-SVG) | כן | שני רכיבים נפרדים |
| D8 | הדליין /agents | A או B | C |
| D9 | הדליין /planners | A | B, C |
| D10 | הדליין /wealth | A (השורה מהתקציר) | B, C |
| D11 | תיקון אודות | אופציה C | A, B |
| D12 | CTA ראשי בדפי הקהל = עוגן לטופס בדף (לא לינק ל-/contact) | כן — כך ה-audience נשמר | לינק ל-/contact (מאבד את ה-audience לפי ההחלטה על אי-שמירה) |
| D13 | פיצול PR | A + B + C, כאשר C יכול לצאת ראשון | A+C מאוחד, B נפרד |
| D14 | חבילות (פלנר/פרו) בדפי הקהל | לא בשלב זה — אין באתר החדש שום אזכור לחבילות; להוסיף עכשיו פותח שאלה עסקית באמצע שינוי IA | להוסיף ל-/planners בלבד — רק אם נטלי מאשרת |

סגור מראש ולא נפתח מחדש: הסלאגים `/agents` `/planners` `/wealth`; ללא שמירת `audience` בסשן; ללא אנליטיקס (אין שכבה באתר); מיקום קובץ ההצעה.

---

## 16. Risks and open items I could not resolve from the live site

1. `[REPO]` §5.5 exact text — the visual constraints here are from the brief; if §5.5 forbids decorative SVG outside the hero entirely, V1/V2 need a re-read.
2. `[REPO]` `config.md` current structure — the §12 text is written to be pasted as a new field entry; adjust to its format.
3. `[REPO]` Whether `LeadForm` already accepts a `source` prop from the page (it renders `data-source`, so yes in practice) — `audience` should follow the same path.
4. `data-webhook` is empty on staging → the audience field cannot be end-to-end tested until the Make webhook is configured (separate task).
5. `/community/` and `/webinar/` are dated campaign pages (webinar 13–15.10.2026) with their own wording — touching them needs B-1.
6. The Home hero montage has text baked in ("כל התמונה של הלקוח. במקום אחד.") — allowed by the hero exception, but note that the proposed new footer/eyebrow lines reuse that sentence; keep them consistent or the hero and the copy drift.
7. The About page still ships `[TBD]` placeholders (B-3). Not this task, but a launch blocker.

**Stopping here. Nothing was branched, edited, committed or opened. Waiting for D1–D14 and the §11 answers.**
