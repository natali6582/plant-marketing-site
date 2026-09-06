# One fee engine: removing the draft annual calculator

Removed on 2026-09-06, branch `fix/one-fee-calculator`, base `origin/main` at `5eaceb3`.

`main` carried two calculators answering the same question with different conventions:

| route | engine | fees | state |
|---|---|---|---|
| `/knowledge/agents/fees/` | `src/lib/finance-core.ts`, monthly | deposit + AUM | public — **kept** |
| `/knowledge/fee-impact-calculator/` | `src/lib/pension.mjs`, annual | AUM only | `draft: true` (PR #66) — **removed** |

In review mode (`KNOWLEDGE_ENABLED=true`, what workers.dev serves) both rendered and the hub
card pointed at the draft one. This change removes the draft calculator's **UI only**.
`pension.mjs`, `scripts/check-model.mjs`, `src/data/model-fixtures.json` and `docs/models/**`
(apart from one file move) are untouched, so `npm run build` keeps its model gate throughout.

## Baseline (S1) vs after (S4)

Both built with `KNOWLEDGE_ENABLED=true KNOWLEDGE_PUBLIC=false`, twice each.

| | S1 baseline | S4 after |
|---|---|---|
| `npm run build` | exit 0, twice | exit 0, twice |
| two builds byte-identical | yes (116 files) | yes (114 files) |
| built HTML pages | 68 | 67 |
| JS payload | 35,905 B across 10 files | **29,647 B across 9 files** (−6,258 B) |
| `check-model.mjs` inside `build` | `MODEL PASS — 85/85` | `MODEL PASS — 85/85` |
| `/knowledge/fee-impact-calculator/` | served, 52,055 B | **404**, in both build modes |

Marker counts over the whole of `dist/` (`grep -r`), the authoritative check:

| marker | S1 | S4 review | S4 public |
|---|---|---|---|
| `PensionCalculator` | 1 | 0 | 0 |
| `pension-calculator` | 2 | 0 | 0 |
| `data-pension-calculator` | 2 | 0 | 0 |
| `{{calculator:` | 0 | 0 | 0 |
| the hub card label | 1 | 0 | 0 |
| `fee-impact-calculator` | 12 | 0 | 0 |

## RED, then GREEN

New section 5 of `scripts/check-content.js`, run in a real browser against `astro preview`:

| | checks | failures |
|---|---|---|
| RED (before removal) | 51 over 16 routes | **5** |
| GREEN (after removal) | 48 over 15 routes | **0** |

The five RED failures were exactly the three contracts: the route served 200 instead of 404,
the hub still linked to it, the hub still rendered its card, and the served page still
contained `PensionCalculator` and `pension-calculator`.

The sweep drops from 16 routes to 15 because the hub no longer offers the calculator link
that the sweep discovers from the hub itself.

### Pre-existing assertions unchanged

Sections 1–4 measured in a real browser on the baseline: **285 checks, 26 failures,
5 unverified**. The region of `check-content.js` holding them is byte-identical to
`origin/main` apart from one comment line describing item 5:

    sections 1-4 + preamble, origin/main : 0c25f92c0ece20b3  24851 chars
    sections 1-4 + preamble, this branch : 2fa42ce5ed76584c  24849 chars
    only difference: the header comment for item 5 (no executable change)

`check-typography.js`: **GREEN 20/20** before (18 existing rows + 2 calculator rows),
**GREEN 18/18** after — the same nine routes at two widths, zero failures on both sides.

## Built-file diff

Every HTML page changed, which S4 did not predict. The cause is benign and worth recording:
removing `PensionCalculator.astro` removed its scoped rules from the shared stylesheet, so the
bundle's content hash changed (`BaseLayout.YP1dIcEl.css` → `BaseLayout.D284iyMd.css`, −780 B,
zero `pension` rules left) and every page links that file by name.

Normalising the bundle filename, exactly **three** HTML files differ:

| path | what changed |
|---|---|
| `dist/knowledge/index.html` | the hub card, and the counts 13→12 and 10→9 |
| `dist/knowledge/agents/index.html` | the article's listing entry |
| `dist/knowledge/planners/index.html` | the article's listing entry |

Removed: `dist/knowledge/fee-impact-calculator/index.html`,
`dist/_astro/PensionCalculator.astro_astro_type_script_index_0_lang.Dp0r4r9i.js`,
`dist/_astro/BaseLayout.YP1dIcEl.css`. Added: `dist/_astro/BaseLayout.D284iyMd.css`.

## Files changed

Deleted:

- `src/content/knowledge/fee-impact-calculator.md`
- `src/components/knowledge/PensionCalculator.astro`
- `src/scripts/pension-calculator.ts`

Reverted to their pre-PR-#66 state, byte-for-byte (`git diff a82f4bf` is empty for all four):

- `src/components/knowledge/ArticleBody.astro`
- `src/components/knowledge/HubPage.astro`
- `src/components/knowledge/render.ts`
- `src/pages/knowledge/[...slug].astro`

Rewritten: `scripts/check-content.js` (section 5 swapped for the removal assertions),
`scripts/check-typography.js` (calculator probes removed).

Moved: `docs/models/pension-aum-v1/ui-contract.md` to
`docs/models/pension-aum-v1/retired/ui-contract.md`, with a one-line header.
`scripts/check-model.mjs` does not read this file — it reads the workbook, the verify report,
the `extra/` archive and `model-fixtures.json` — so the gate is unaffected, and it still
reports `MODEL PASS — 85/85`.

## What was not verified

`check-content.js` and `check-typography.js` were run **in a real browser** (the in-app
Chromium) against `astro preview`, not headless. But the browser pane is never displayed, so
`requestAnimationFrame` never fires and `document.visibilityState` stays `hidden`.
Consequences:

- The harness self-reports **5 unverified** reveal contracts on `/` and `/product/`. Those are
  IntersectionObserver-driven and cannot be established without a window that paints.
- The **full** post-change `check-content.js` run did not finish. Sections 1–4 take 20–35
  minutes under a hidden tab's one-second timer clamp. The RED/GREEN numbers for section 5
  above come from running that section directly, and the sections 1–4 regression is
  established by the byte-identity proof rather than by a second slow run.
- Nobody has **looked** at the hub, the track pages or the removed route in a visible browser.
  Per `CLAUDE.md` that is Tier 2 and is not claimed as done.

To check by eye: `npm run build && npm run preview`, then http://localhost:4321/knowledge/ —
the hub card should be gone, and http://localhost:4321/knowledge/fee-impact-calculator/
should 404.

## Found, not fixed

1. **`check-content.js` is RED on `main` before this change** — 26 pre-existing failures, none
   calculator-related. They are approved-copy pins that the site has drifted from: the retired
   audience wording still in the navigation on nine routes, the `/webinar/` `<main>` hash, the
   home and `/product/` descriptions and titles, the `/solutions/` title, `h1` and `h2`
   outline, the footer blurb, and the `/about/` description. Either the site drifted or the
   pins are stale; both need a decision, neither is in scope here.
2. **PR #66 also changed `EXPECT_DISPLAY` in `check-typography.js`** from `Noto Serif Hebrew`
   to `Heebo` — nothing to do with the calculator. A literal revert would have restored the
   serif expectation; the typography run is GREEN with `Heebo`, so it was kept deliberately.
   Flagged rather than reverted.
3. **`window.__typographyCheckResult` / `window.__contentCheckResult`** were also added by
   PR #66 and were kept — they are how a caller reads the result, and removing them would have
   broken the way these scripts are driven.
4. **The pension contract in PR #66 could not be run to completion here.** Its 25 groups drive
   the calculator inside an iframe that never paints, and the run stalls. Recorded because it
   means that contract was never verifiable in this environment — it was deleted, not silently
   skipped.
5. **Astro's content-hashed shared stylesheet** makes "only page X may change" unachievable for
   any change that touches a component's scoped CSS. Worth knowing before writing that
   acceptance criterion again.

## Follow-up

The retarget task — `codex-prompt-model-evidence-gate.md`, written but not committed to this
repository — replaces `pension.mjs` and its fixtures with `finance-core.ts` fixtures built
under real LibreOffice. After it lands, `src/lib/pension.mjs` and `docs/models/pension-aum-v1/`
(including the retired UI contract) are deleted. Until then the model gate stays exactly as
it is.
