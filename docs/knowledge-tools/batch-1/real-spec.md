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

# ריאלי מול נומינלי אחרי דמי ניהול — one-page specification

Route: /knowledge/wealth/real-return/
Owner: Natali. Updated: 2026-09-06. Status: DRAFT, pending approval.

| Input | Label | Default (fictional) | Unit | Bounds |
|---|---|---|---|---|
| balance | יתרה התחלתית | 500000 | ₪ | 0…1000000000 |
| deposit | הפקדה חודשית, אם יש | 1000 | ₪ | 0…1000000000 |
| years | תקופת החישוב | 10 | שנים | 0…100 |
| return | תשואה שנתית נומינלית משוערת | 5 | % | -99…100 |
| inflation | אינפלציה שנתית משוערת | 2 | % | -99…100 |
| fee | דמי ניהול מצבירה, לשנה | 0.7 | % | 0…100 |

Outputs: יתרה נומינלית בסוף התקופה; יתרה בשקלים של היום; סכום התחלתי והפקדות; צמיחה בתרחיש ללא דמי ניהול; השפעת דמי הניהול על היתרה; פער כוח הקנייה בגלל אינפלציה. SVG balance paths include month 0.

Assumptions: monthly order and rate conversion in calculation-contract.md; constant return/inflation; deposits at start, fixed nominal; no tax/insurance/legal parameters; no rounding inside loop. URL query keys are the input names above, booleans 1/0, validated bounds, unknown keys ignored and invalid values visibly reset to example defaults. No email/backend/storage. Native browser print/PDF using A4 stylesheet.

אין חישוב מס, תשואה מובטחת או תחזית שער חליפין. האינפלציה קבועה ומשותפת לכל הסכום. פירוק ההשפעות תלוי בסדר החישוב ואינו מציג רווח ריאלי לאחר מס.
