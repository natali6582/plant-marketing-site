> RETIRED 2026-09-06 — the UI this contract describes was removed so the site keeps one fee engine (`src/lib/finance-core.ts`, behind `/knowledge/agents/fees/`). Kept for reference until the retarget task replaces the model and its fixtures.

# Step 11 — knowledge-center pension calculator UI contract

Status: proposed for approval; documentation only. No calculator UI or RED browser assertions have been implemented or run by writing this document.

Owner: Codex drafts the contract; the implementation agent follows the approved version. Any change to copy, input domains or behavior below must be called out before implementation, not invented during styling.

## 1. Scope and existing dependencies

Build one AUM-fee-only illustration at `/knowledge/fee-impact-calculator/`. Work only within the knowledge center and its verification scripts. Use the existing pure `closingBalance` export from `src/lib/pension.mjs`; its contract in `calculation-contract.md` remains authoritative and unchanged.

Existing evidence: fourteen Excel-pinned scenarios; 85 model-gate checks. Fixtures vary every supported input at selected points, not across its entire domain. Negative-return Excel coverage remains false. Do not widen the financial-model-builder axes, add deposit fees, modify fixtures, or change the engine as part of C.

Use vanilla TypeScript and Astro, no framework, new dependency, Vitest or `npm test`. No regulatory caps, contribution rates, figures.yaml additions or tier-0 facts are needed. All calculator amounts/rates are editable illustrative assumptions, not authoritative figures.

The existing knowledge article template already renders one `Disclaimer` and one `LeadForm`. Reuse them; do not duplicate them inside the calculator or modify their shared implementations. On this article only, pass `source="pension-model"` to that existing lead form. Preserve the existing audience handling and lead fields.

## 2. Route and publication state

The new article uses the existing knowledge collection and these fields:

- `title`: `השפעת דמי ניהול מצבירה`
- `audience`: `[agents, planners]`
- `summary`: the proposed summary in section 8
- `updated`: actual implementation month, `YYYY-MM`
- `draft: true`, `figures: []`, `sources: []`
- `related`: `[pension-fund, pension-products-map]`
- Body contains the standalone `{{calculator:fee-impact}}` shortcode.

Extend both `render.ts` and `ArticleBody.astro` to recognize that one calculator name. Unknown calculator names must fail the build with the article slug, not appear as raw tokens or an empty region. Preserve all existing shortcode behavior.

Use existing gating: `KNOWLEDGE_ENABLED=true` includes draft articles through `KNOWLEDGE_DRAFTS`; `KNOWLEDGE_PUBLIC=true` alone does not publish this draft. Keep noindex behavior and do not add a visible draft banner. Do not change branch/environment gating or invent a Cloudflare preview environment. This contract does not authorize a deployment, main merge or domain change.

Add one discoverable link from `/knowledge/` to the calculator, using the title above. The article should also appear in its two existing track lists through collection metadata. No global navigation, homepage, product or other non-knowledge page edits.

## 3. Input contract

Render exactly six numeric inputs in a dedicated calculator form, separate from `form.lead-form`. All are required and have explicit visible labels. Numeric controls are LTR inside the RTL layout.

Load initial defaults from the `base` fixture's `inputs` at build time. Do not bundle the complete fixture JSON, workbook paths or reports into browser JavaScript. Monetary values remain ILS; percentage UI values are converted to decimal fractions exactly once at the UI boundary.

The following proposed UI bounds are demonstration/interaction limits, not legal limits. They are narrower than the engine's numeric domain and do not modify it. Do not describe a fee maximum as a pension fee cap.

| Input name | Visible label | Initial UI value | UI min | UI max | UI step | Engine mapping |
|---|---|---:|---:|---:|---:|---|
| `p0` | יתרת פתיחה (₪) | 100000 | 0 | 1000000000 | 0.01 | value unchanged |
| `deposit` | הפקדה שנתית ראשונה (₪) | 24000 | 0 | 1000000000 | 0.01 | value unchanged |
| `salaryGrowth` | שינוי שנתי בהפקדה (%) | 2 | -100 | 100 | 0.01 | UI value / 100 |
| `ret` | תשואה שנתית להמחשה (%) | 4 | -100 | 100 | 0.01 | UI value / 100 |
| `feeAum` | דמי ניהול שנתיים מצבירה (%) | 0.5 | 0 | 100 | 0.01 | UI value / 100 |
| `years` | תקופת החישוב (שנים) | 10 | 0 | 100 | 1 | integer value unchanged |

These defaults are the existing model example, not a recommendation. The engine's 100-year computation bound already exists; the UI's monetary/rate bounds above are proposed UX choices requiring approval with this document.

Validation:

1. Use each numeric input's `valueAsNumber` plus its range/step validity. Empty fields, non-finite values, fractional years and out-of-domain values are errors. Never use `Number('')`, `|| 0`, silent clamping or automatic correction of a rate.
2. Require `1 + (ret - feeAum) >= 0` after percentage conversion. Negative returns are allowed when this condition holds; their evidence gap is disclosed in methodology, not disguised as Excel coverage.
3. Always invoke the existing engine, including its validation. Catch its `TypeError`/`RangeError` and present an error rather than a partial/NaN/infinite result.
4. No `feeDeposit`, tax, withdrawal, contribution-rate, monthly-period or insurance-cost input. No hidden defaults for unsupported features.
5. Values stay in memory only: no URL parameters, local/session storage, analytics event, lead payload or network request containing calculator inputs.

## 4. Interaction and result states

The form has explicit `חישוב מחדש` and `איפוס להנחות ההמחשה` buttons. Enter submits the calculator form only. Submission prevents navigation and has no network side effects.

Use one state on the calculator root: `data-state="ready"`, `"dirty"` or `"invalid"`.

- Initial static HTML contains the base result, annual table, sensitivity table, assumptions and methodology. They must not depend on animation, a reveal observer or JavaScript to become visible.
- Server-render the input fieldset disabled; attach event handlers before enabling it. Without JavaScript, keep the base illustration readable, controls disabled and the noscript explanation visible. Do not leave editable controls whose results cannot update.
- On the first input edit, set dirty, show the pending message and hide the old results region from both visual and accessibility presentation. Collapse it normally; do not reserve an empty fixed-height results panel. A previous result must not appear current while inputs differ.
- On valid submit, calculate the headline, all annual rows and grid from one validated input snapshot, then replace the results together and set ready. Announce the concise success status with `role="status"`, `aria-live="polite"`. Do not announce the entire table on every edit.
- On invalid submit, set invalid, show the error in `role="alert"`, mark relevant input(s) `aria-invalid="true"` and focus the first invalid control. The results remain hidden; no old balance presented as current. A valid correction followed by submit must recover without reload.
- Reset restores all six original illustrative defaults, clears errors/invalid attributes and immediately regenerates the base output. Results and axes must be identical to the initial state. Each calculation is independent of previous runs.
- Keep keyboard focus on the invoking control for a successful calculation/reset. Do not move it into a result cell or auto-scroll the page.

## 5. Output contract

No second roll-forward or closed-form implementation in the UI. Call `closingBalance(inputs)` and use its returned rows. The final balance is `rows.at(-1)?.close ?? inputs.p0`.

### Closing balance

Heading: `יתרה בסוף התקופה`. Display ILS with grouping and two fractional digits using `Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 2, maximumFractionDigits: 2 })` and bidirectional isolation. Do not round the engine inputs or rows.

The default raw result must match the base fixture's `447626.821064296` within 1 ILS, displaying `447,626.82` plus the ILS symbol (allow locale bidi/spacing marks in assertions).

Do not add a recommended fee, guaranteed future value, pension income, savings-vs-provider claim or investment recommendation.

### Annual table

Caption: `פירוט שנתי של החישוב`.

Exactly `years` body rows, no extra total row in v1. Column order and mapping:

| Header | Engine field |
|---|---|
| שנה | year |
| יתרת פתיחה | open |
| הפקדה | deposit |
| תשואה | gain |
| דמי ניהול מצבירה | fee |
| יתרת סגירה | close |

Use real table headings and numeric bidirectional isolation. Render all rows, including on mobile; do not drop columns, paginate or invent simplified mobile calculations. Place the table in its own labelled, keyboard-scrollable horizontal overflow container when needed.

For zero years, show the unchanged opening balance, an empty tbody and the explicit empty-period explanation. Do not fabricate a year-zero cash flow. Retain table headers; no large empty region.

## 6. Sensitivity grid: return rows × AUM-fee columns

Caption: `רגישות היתרה לתשואה ולדמי ניהול מצבירה`.

Always render five row headers, five column headers and 25 cell positions. Holding p0, deposit, salaryGrowth and years at the current validated inputs, call the same engine for each return/fee pair. This is a scenario comparison, not a confidence interval or a regulatory range.

Proposed deterministic axis construction:

- Work in integer UI percentage ticks: one tick = 0.01 percentage point. Inputs already enforce that step. Convert ticks to engine fractions by dividing by 10000.
- Return spacing: 100 ticks = 1 percentage point. Fee spacing: 10 ticks = 0.1 percentage point.
- Start with offsets `[-2, -1, 0, 1, 2]` times the axis spacing around the user's value. If a value would fall outside that input's min/max, shift the entire window by whole spacing increments until all five headers fit. Do not clamp individual headers and create duplicates.
- There are always five distinct ascending values, and the exact user's base input appears exactly once on each axis. Apply the algorithm independently to the two axes. Preserve the exact input tick, including near boundaries; do not snap it to a different scenario.
- Defaults: return headers `[2, 3, 4, 5, 6]` percent; fee headers `[0.3, 0.4, 0.5, 0.6, 0.7]` percent. This regular UI spacing is a proposed presentation choice, not a copy of the workbook's irregular fee headers or a claim that all displayed grid cells are individual exported Excel fixtures.
- Use the inputs from the same committed snapshot as the headline. Rebuild axes when return/fee change, and recompute cells when any of the six inputs changes.

Base marking is determined by the input pair, not equality of balances. Exactly one base row heading, one base column heading and one base body cell are marked. Add visible `תרחיש הבסיס` wording and a non-color-only marker for the base cell. Its raw value equals the headline within 1 ILS. All balances can coincide when years or amounts are zero; that still gives only one marked base cell.

An axis pair can be invalid even when the main inputs are valid (e.g. return -100% with a positive fee). Keep its cell position and render `—` with the accessible explanation `השילוב מחוץ לתחום החישוב`. Do not clamp its inputs, substitute zero, leave the cell blank or print NaN/Infinity. The valid base cell must still be present and reconciled. At the default inputs all 25 cells must be numeric.

## 7. Proposed stable DOM hooks for RED assertions

These hooks expose rendered state, not an alternative calculator API or expected-value fixture embedded in the page.

| Hook | Required meaning |
|---|---|
| `[data-pension-calculator="aum-v1"]` | Exactly one root; owns data-state |
| `[data-pension-form]` | The six-input form, not a lead form |
| `#pension-input-{name}` | Unique control ID, matched by visible label |
| `#pension-assumptions` | Always-visible illustrative assumptions section |
| `#pension-methodology` | Same-page methodology target |
| `[data-pension-results]` | Hidden only in dirty/invalid states |
| `[data-pension-balance]` | Headline; data-value holds finite unrounded ILS |
| `[data-pension-years]` | Annual table; each tbody tr has data-year |
| `[data-pension-years] td[data-field]` | Individual amount cells; data-field is one of open, deposit, gain, fee or close; data-value holds raw amount |
| `[data-pension-sensitivity]` | Grid table, independent of annual table |
| `thead th[data-fee-aum]` | Five column headers; fractional fee values |
| `tbody th[data-return]` | Five row headers; fractional return values |
| `td[data-return][data-fee-aum]` | Each grid position; data-value only for valid computed cells |
| `th[data-base-axis="true"]` | One header per axis, scoped to its row/column header selection |
| `td[data-base-case="true"]` | Exactly one grid body cell |
| `td[data-invalid="true"]` | Invalid pair: visible dash, accessible reason, no data-value |
| `[data-pension-status]`, `[data-pension-error]` | Status/alert described in section 4 |
| `[data-pension-reset]` | Reset button |
| `form.lead-form[data-source="pension-model"]` | Exactly one existing lead form on this route |

## 8. Proposed Hebrew copy and existing disclaimer

All new Hebrew strings in this section and the tables above are proposed copy. Approve them with this document before UI implementation; record the decision in backlog.md during that later step as the repo requires. Do not alter approved shared copy.

| Purpose | Exact proposed text |
|---|---|
| Article summary / hub card | המחשה של השפעת דמי ניהול מצבירה לאורך זמן, לפי ההנחות שתבחרו. |
| Assumptions heading | הנחות להמחשה — לא תקרות רגולטוריות |
| Assumptions body | הערכים ההתחלתיים נועדו להמחשה בלבד וניתנים לשינוי. ההפקדה מתבצעת בסוף כל שנה. התשואה ודמי הניהול מחושבים על יתרת הפתיחה. החישוב אינו כולל דמי ניהול מהפקדה, משיכות או מסים. |
| Range explanation | טווחי הקלט מגבילים את ההדגמה ואינם תקרות חוקיות. |
| Methodology link and heading | מתודולוגיית החישוב |
| Methodology body | החישוב השנתי הושווה לתוצאות שמורות של מודלי Excel בתרחישים מוגדרים. אין בכך בדיקה של כל שילוב קלטים, הבטחת תשואה או התאמה למוצר פנסיוני מסוים. |
| Negative-return coverage | תשואות שליליות נבדקו בבדיקות חישוב, אך עדיין אינן מכוסות בתרחישי Excel מאומתים. |
| Pending status | ההנחות השתנו. לחצו על חישוב מחדש. |
| Success status | החישוב עודכן. |
| Invalid field | מלאו את כל השדות במספרים בטווחי ההדגמה. |
| Invalid net factor | השילוב בין התשואה לדמי הניהול יוצר מקדם שנתי שלילי. שנו את ההנחות. |
| Unexpected calculation failure | לא ניתן לחשב את התוצאה עבור ההנחות שהוזנו. בדקו את הערכים ונסו שוב. |
| Zero-period explanation | תקופת החישוב היא אפס שנים, ולכן היתרה נשארת ללא שינוי. |
| No JavaScript | מוצגת המחשה לפי ההנחות ההתחלתיות. לשינוי ההנחות נדרשת הפעלת JavaScript. |

No dedicated methodology article currently exists. Proposed C scope therefore uses a working link to `#pension-methodology` inside this article, not a broken `/knowledge/how-we-verify/` link. A separate methodology article remains the later content track; creating one is not silently added to C. This same-page choice needs approval with the contract.

Reuse `src/components/knowledge/Disclaimer.astro` once through the article template. Its existing heading is `הבהרה`, with this existing wording (whitespace-normalized for testing, not retyped in a new component):

> המידע באתר הוא מידע כללי בלבד. הוא אינו מהווה ייעוץ פנסיוני, שיווק פנסיוני, ייעוץ השקעות, שיווק השקעות, ייעוץ מס או ייעוץ משפטי, ואינו מותאם לנסיבותיו של אדם מסוים. הנתונים נכונים למועד העדכון המצוין ויש לאמתם מול המקור הרשמי. להחלטה אישית יש להתייעץ עם בעל רישיון מתאים.

## 9. RED assertions to implement before the first UI line

Append a knowledge-calculator block to `scripts/check-content.js`. Preserve its original route list, checks and approved-copy rules. Do not put the knowledge article into the generic retired-audience copy loop, whose contract concerns the existing marketing pages.

Run the complete console script in a real browser against local Astro preview, with the knowledge demo enabled, before implementing the shortcode, article or component. This document is not that RED run.

The new block must record explicit failures for a missing route/root rather than throw before producing a report or silently skip dependent assertions. The old baseline is documented as 288 checks: measure and retain its actual baseline count and outcomes, investigating any discrepancy rather than lowering an expected count. Record new assertions separately and include them in the final total.

Required assertion groups (expand parameterized cases into reported checks):

| ID | Contract to assert |
|---|---|
| C01 | Exact route loads the calculator root, not a 404/fallback page; one matching h1 and title |
| C02 | Exactly six named numeric controls inside the calculator form; labels, units, defaults, min/max/step and required flags match section 3 |
| C03 | Assumptions heading/body and range explanation are visibly rendered, not merely present in hidden DOM |
| C04 | Exactly one existing disclaimer is visibly rendered, with normalized text matching the shared component |
| C05 | Methodology link resolves to the visible same-page target; the negative-return evidence limitation is present |
| C06 | Initial ready state, enabled controls after initialization and visible non-empty results |
| C07 | Base headline raw amount agrees with the Excel base fixture within 1 ILS; formatted text agrees with raw amount to its stated display precision |
| C08 | Initial annual table has ten correctly numbered rows, six headers, five finite raw monetary cells per row, and final close reconciles with headline |
| C09 | Default grid has five distinct ascending headers per axis and 25 finite numeric cells; percentages map to fractions correctly |
| C10 | Exact base value appears once on each axis; exactly one marked body cell uses that pair and reconciles with headline |
| C11 | Change each input individually and submit; the visible headline and annual horizon follow the new input snapshot, not the old/default values |
| C12 | Drive the five new Excel cases through the form: years-30, deposit-0, p0-0, salgrowth-0, n-equals-g; headline agrees with each original cached expectation and every row's displayed value reflects its raw value |
| C13 | Alter return and AUM fee independently using existing original-grid fixture inputs; conversion is percent-to-fraction exactly once |
| C14 | Every valid grid cell is checked against an independent test-only closed form, including its equality limit; no imported production calculator as the only numerical oracle |
| C15 | Editing marks dirty and hides stale outputs; no reserved blank results region; successful submit updates all outputs together |
| C16 | Blank, negative amount, fractional year, out-of-range value and invalid net-factor cases show an error, mark/focus invalid input, and do not expose an old result as current |
| C17 | Correct invalid inputs and recalculate successfully without reloading |
| C18 | Zero years: unchanged p0, no annual rows, explicit explanation and one base grid marker despite coincident balances |
| C19 | Fee zero and upper/lower rate boundaries: axes remain distinct and include the base; invalid pairs have dash/reason and no numeric data-value |
| C20 | Reset restores defaults, headline, rows and axes after normal, dirty and invalid states |
| C21 | Exactly one `form.lead-form[data-source="pension-model"]`; original lead fields/consent remain intact; existing non-calculator lead sources unchanged |
| C22 | Calculator submit/reset make no fetch/XHR/navigation, do not write URL/storage and never submit the lead form; no real lead is sent by this test |
| C23 | Hub and both audience tracks contain working calculator links; no new global/non-knowledge navigation entry |
| C24 | No raw shortcode, NaN, Infinity, duplicate IDs, unintended empty band or observer-hidden calculator region |
| C25 | Keyboard submit/reset, focus visibility, status/error announcements and table overflow controls work; measurement limitations are reported as PARTIAL, never GREEN |

For test-only browser numeric expectations, use the approved fixture IDs, inputs and expected balances from `model-fixtures.json`; do not derive expected balances from the UI under test. If a small fixture subset is copied into the console script, identify its source/hash and verify it against that JSON during review. Do not expose all developer fixtures in the public page just to make console checks convenient.

Run the new block at 1280×900 and 375×812. Extend `check-typography.js` with this route at those same widths, retaining existing routes: headings use Noto Serif Hebrew 700, UI/body/form controls use Heebo, no clipped headings or document-wide horizontal overflow. Horizontal scrolling may exist only inside labelled table wrappers. Perform focus checks in an actively rendering browser; do not use a forced reveal or headless DOM as visibility evidence.

With JavaScript disabled, separately inspect the static base illustration and disabled controls/noscript message. This is a separate browser observation, not a result inferred from a successful JS run.

## 10. Verification sequence and completion

Execute one approved step at a time, reporting evidence before proceeding:

1. Approve this document's copy, UI bounds, regular grid spacing, dirty-state behavior and same-page methodology decision.
2. Add only the RED browser assertions. Run the whole content script against the unchanged site; preserve existing outcomes and show the new requirements failing. Save the result before any UI code.
3. Implement the shortcode, component, route-specific source prop and knowledge links against this contract. Do not weaken failing assertions to accommodate the UI.
4. GREEN: `npm run build` exits 0 with the existing 85 model checks; full browser content and typography scripts pass at both widths. Keep the numeric and browser evidence distinct.
5. REGRESS: reset/reload and run the browser checks twice from the same clean initial state; compare normalized reports excluding timing-only diagnostics. No old reports, caches, mutated fixtures or persisted inputs can supply a pass. Restore/clean up any temporary iframe or network-observation hooks in finally blocks.
6. Record an actual keyboard/mobile/JS-disabled review. A human visual sign-off remains separate under CLAUDE.md; do not call automation a human sign-off or mark draft false automatically.
7. Hand off locally. Publication is a later authorized step restricted to the intended workers.dev site after checking domain attachment; no custom-domain changes in C.

Record JS payload before/after, distinguishing raw and gzip bytes, external and inline scripts, and unique asset sum from per-route requests. The repo's 12 KB claim is not a measured baseline for this new route: define and report the measurement, do not change units to manufacture a pass. No framework or full fixture bundle. No calculator initialization or added calculator requests on non-knowledge routes. Keep unavoidable build-generated asset fingerprint differences separate from actual content/style changes; all non-knowledge page behavior/copy must remain unchanged.

## 11. Later implementation file boundary

| File | Allowed purpose after approval |
|---|---|
| `scripts/check-content.js` | RED and regression assertions above |
| `scripts/check-typography.js` | Calculator route at existing two widths |
| `src/content/knowledge/fee-impact-calculator.md` | Article metadata, shortcode, approved prose |
| `src/components/knowledge/Calculator.astro` | Static base rendering, scoped styles and semantic controls/tables |
| `src/scripts/pension-calculator.ts` | Vanilla client wiring and axis construction; imports existing engine |
| `src/components/knowledge/render.ts` | Recognize calculator shortcode |
| `src/components/knowledge/ArticleBody.astro` | Validate/render the supported calculator |
| `src/pages/knowledge/[...slug].astro` | Calculator-only lead source and, if needed, article-only width adjustment |
| `src/components/knowledge/HubPage.astro` | One knowledge-center calculator link/card |
| `backlog.md` | Record new-copy approval or genuine found-not-fixed issues, not unrelated repairs |

No changes to Header, Footer, BaseLayout, global CSS, shared LeadForm/lead-submit, other pages, figures.yaml, financial-model-builder, model fixtures, pension.mjs, Cloudflare settings or domains. Scoped styles and existing design tokens should contain presentation changes. If the approved behavior cannot fit this boundary, report the specific dependency rather than modifying it silently.
