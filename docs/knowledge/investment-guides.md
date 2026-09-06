# Investment guides: planners and wealth managers

## Scope

Expand the Knowledge Center only. Base: `0565af5a21195f2353beb803711ec14805f8ffe4`.
No marketing-page copy, domain, Worker, lead submission, pension-engine or deployment configuration changes.
The existing `/knowledge/agents/fees/` calculator stays; the removed
`/knowledge/fee-impact-calculator/` stays absent. These are investment education
examples, not a replacement pension calculator.

The user's strategic research document informed the topic selection. Its text
and any private client material are not published. The guides are original Hebrew
explanations with linked primary sources and clearly fictional examples.

## Delivery

Six new articles and five expanded articles:

| Route under `/knowledge/` | Delivery |
|---|---|
| `investment-analysis/` | Seven-question investment analysis and meeting checklist |
| `total-investment-costs/` | All-in costs without double-counting performance drag |
| `mutual-funds/` | Mutual-fund and ETF selection, structure, execution and costs |
| `bonds-price-yield/` | Coupon, yield, duration and credit, with a price explorer |
| `structured-products/` | Terms, barriers, issuer risk and a fictional payoff explorer |
| `capital-calls/` | Commitments, call notices and household liquidity |
| `private-markets/` | Reading NAV, DPI, RVPI, TVPI, MOIC and IRR together |
| `private-credit-vs-bonds/` | Credit, liquidity and valuation comparison |
| `currency-exposure/` | Trading currency, economic exposure and household spending |
| `reit-and-funds/` | Direct property, listed REITs, non-traded REITs and funds |
| `direct-real-estate/` | Property-level cash flow, financing and exit due diligence |

Two discoverable learning paths contain four planner chapters and five wealth
chapters. Supporting costs and property articles are linked from the relevant
guides. The hub and corresponding audience pages display the paths; the insurance
agents article list does not acquire these guides.

All eleven articles are `draft: false`. Existing publication flags remain intact;
review builds remain `noindex, nofollow`, including the new series. Maintenance
fields show editorial ownership, source-check date and planned recheck date.
They do not claim named licensed-professional approval. Foreign sources explain
general concepts, not Israeli regulatory or tax rules. No regulatory figure was
added or changed.

## Explorer contracts

- **Bond:** face value 100; annual fixed coupon and principal at maturity;
  annual discounting of every cash flow. Inputs: coupon 0–15%, yield −2–20%
  in 0.1-point steps, integer maturity 1–30 years. The sensitivity table
  recalculates at base yield and ±1 percentage point. No tax, accrued interest,
  default, inflation linkage or call feature. Display rounds only at output.
- **Structured note:** fictional initial investment and index of 100. Final
  index 0–200, to two decimal places. If final index is below 60, repayment
  equals the index. At or above 60, repayment is
  `100 + min(max(finalIndex - 100, 0), 20)`. The barrier is observed only at
  maturity. No coupon/autocall; issuer payment is assumed. The SVG shows the
  actual discontinuity at 60, not a continuous interpolation.
- Server-rendered examples and tables remain readable without JavaScript.
  Buttons start disabled and are enabled by the client module. Invalid inputs
  hide stale results. Reset recalculates in the next task, after native input
  reset; a microtask was insufficient for real user clicks.
- Markdown comparison tables have labelled, keyboard-focusable horizontal
  scrolling regions. The diagram has a text alternative and tabular values.

## Verification on 2026-09-06

| Check | Evidence |
|---|---|
| Normal build with knowledge enabled | Exit 0; 75 routes versus baseline 67 |
| Source figures gate | 31 articles; 33 figures, 14 cited; zero breaches |
| Existing pension model gate | 85/85; 14 Excel fixtures unchanged |
| Knowledge unit suite | 71/71, including 24 new explorer cases |
| Type checking | `npm run typecheck:knowledge`, exit 0 |
| New guide contract | 346 checks pass; wired into `build:knowledge` |
| Baseline comparison | 367 checks pass including 20 non-knowledge HTML files |
| New contract against old build | RED: 53 failures in 130 checks |
| Determinism | Two consecutive builds: all 123 emitted files byte-identical; guide JSON identical |
| Existing knowledge guardrails | 55 knowledge pages, 2,728 internal links; PASS |
| Largest knowledge first-party JS | 10,372 bytes gzip, below the existing 12 KB guardrail |
| Browser typography script | 18/18, desktop and mobile, baseline and final |
| Browser guide layout | 15 routes at 1280 and 375 px: no page overflow or clipped h1/h2 |
| Browser content regression | Same 30 pre-existing failures; 338 baseline checks versus 344 final checks |
| Removed-calculator checks | 54/54 pass; 17 routes swept |

Non-knowledge HTML is byte-identical after normalizing only the reference to the
one verified, changed Astro CSS asset. Inline scripts, script references, copy
and markup were not normalized. No non-knowledge route was added or removed.

Real-browser interaction evidence:

- Bond 4% coupon / 5% yield / 5 years displays 95.67; zero coupon and zero yield
  at 30 years displays 100.00. Empty yield and fractional years hide results.
- Reset initially reproduced a stale/hidden result with restored input values
  (RED). The next-task fix restores 4/4/5 and visible 100.00, clearing the alert
  after both invalid and changed inputs (GREEN).
- Structured final levels 59.99, 60, 160 and 0 display repayments 59.99, 100,
  120 and 0. Out-of-range 201 hides the result; reset restores level 80 and
  repayment 100. The SVG marker follows the selected scenario.
- Mobile table keyboard check: the labelled region receives focus; ArrowLeft
  moves its scroll position from 0 to −40 in RTL, without page overflow.
- Visual inspection covered the hub cards, article body/tables and both tools
  at desktop/mobile widths. No errors/warnings appeared in the tool-page console.

Network checker: 43/52 URLs returned HTTP 200; zero broken. Nine were explicitly
reported as unreachable (six existing gov.il 403 responses; three FINRA 429
responses). The three FINRA pages were separately opened successfully through
primary-source web retrieval: *Bonds*, *Exchange-Traded Funds and Products*, and
*Understanding Structured Notes With Principal Protection*. Rate-limited URLs
are not silently counted as successful CI HTTP checks.

## Found, not fixed

- `scripts/check-content.js` already fails on main: 26 older copy/navigation
  expectations and four reveal-timing checks in its hidden-frame sweep. The
  exact same failure list was reproduced before and after this change. Those
  unrelated pages/checks were not rewritten to manufacture a green result.
- Other pre-existing article placeholders and the uncited tier-0
  `tikun-190-min-age` figure remain outside this release.
- Cross-border tax, jurisdiction-specific regulation and a full derivatives
  curriculum are not claimed as delivered by these conceptual guides.

Reproduce: `npm run test:knowledge`, `npm run typecheck:knowledge`,
`npm run build:knowledge`, `npm run check:knowledge`,
`node scripts/knowledge/check-guides.mjs --baseline <baseline-dist>`.
The optional baseline must be an actual build of the stated base with the same
knowledge flags, not a copy of the new output. The guide checker is for the
review-build contract and deliberately requires noindex. It produces deterministic
JSON and exits 1 for failed checks, 2 for invocation/filesystem errors.
