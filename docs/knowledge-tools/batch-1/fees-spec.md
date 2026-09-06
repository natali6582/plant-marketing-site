=== KNOWLEDGE-CENTER FRAME ===

Scope: /knowledge/ only. Branch from updated main. Professional owner of every definition, number and text: Natali — nothing publishes without her line-by-line approval. Two phases per batch: Phase 1 = plan + content drafts + (for calculators) passing tests; Phase 2 = build after her OK. One PR per batch.

Rules on every item:

- Fixed sequence on the page: professional question → short explanation → tool or template → worked example → the standard demo CTA.
- Ownership line visible: «בעלים: נטלי · עודכן: [date]». The existing knowledge-center disclaimer on every page. Index status stays noindex.
- No invented facts, no regulatory parameters (ceilings, tax rates) unless sourced to an official page and dated; no claims about what Plan-T saves or earns.
- Calculators run on src/lib/finance-core.ts (the batch-1 engine), assumptions visible, unit tests with hand-computed vectors in CI, print/save-as-PDF, no email capture, URL-parameter prefill of inputs.
- Templates: print-friendly HTML pages (A4 print stylesheet) that fill in the browser; no backend, nothing stored.
- Site voice, Hebrew RTL, digits LTR, accessibility as elsewhere.
- Evidence per batch: desktop + mobile stills of every new page, a print sample per template/tool, test output listing the vectors, link check green, and the content-approval table with Natali's sign-off.

Execution amendment: Natali explicitly instructed the agent to complete all stages without intermediate approvals. Build and review preparation are authorized. Line-by-line content sign-off remains pending, and no merge or publication is authorized. Never invent a sign-off.

# דמי ניהול בתוך התוכנית — one-page specification

Route: /knowledge/agents/fees/
Owner: Natali. Updated: 2026-09-06. Status: DRAFT, pending approval.

| Input | Label | Default (fictional) | Unit | Bounds |
|---|---|---|---|---|
| balance | יתרה התחלתית | 300000 | ₪ | 0…1000000000 |
| deposit | הפקדה חודשית | 2000 | ₪ | 0…1000000000 |
| years | תקופת החישוב | 30 | שנים | 0…100 |
| return | תשואה שנתית נומינלית משוערת | 4 | % | -99…100 |
| depositFeeA | תרחיש א׳ — דמי ניהול מהפקדה | 1 | % | 0…100 |
| feeA | תרחיש א׳ — דמי ניהול מצבירה, לשנה | 0.6 | % | 0…100 |
| depositFeeB | תרחיש ב׳ — דמי ניהול מהפקדה | 0 | % | 0…100 |
| feeB | תרחיש ב׳ — דמי ניהול מצבירה, לשנה | 0.4 | % | 0…100 |

Outputs: יתרה בסוף התקופה — תרחיש א׳; יתרה בסוף התקופה — תרחיש ב׳; סך דמי הניהול — א׳; סך דמי הניהול — ב׳; הפרש ביתרה: ב׳ פחות א׳; ההפרש כאחוז מיתרת א׳. SVG balance paths include month 0.

Assumptions: monthly order and rate conversion in calculation-contract.md; constant return/inflation; deposits at start, fixed nominal; no tax/insurance/legal parameters; no rounding inside loop. URL query keys are the input names above, booleans 1/0, validated bounds, unknown keys ignored and invalid values visibly reset to example defaults. No email/backend/storage. Native browser print/PDF using A4 stylesheet.

אין כאן השוואת כיסוי ביטוחי, מס, הוצאות אחרות או התאמת מוצר. התשואה קבועה וזהה בין התרחישים. דמי הניהול נגבים לפי מוסכמת החישוב המוצגת, שעשויה להיות שונה מהחיוב בפועל.
