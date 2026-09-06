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

# כמה זמן יספיק החיסכון — one-page specification

Route: /knowledge/planners/withdrawals/
Owner: Natali. Updated: 2026-09-06. Status: DRAFT, pending approval.

| Input | Label | Default (fictional) | Unit | Bounds |
|---|---|---|---|---|
| balance | חיסכון זמין בתחילת התקופה | 600000 | ₪ | 0…1000000000 |
| withdrawal | משיכה חודשית בשקלים של היום | 6000 | ₪ | 0…1000000000 |
| years | אופק הבדיקה | 30 | שנים | 0…100 |
| return | תשואה שנתית נומינלית משוערת | 3 | % | -99…100 |
| inflation | אינפלציה שנתית משוערת | 2 | % | -99…100 |
| fee | דמי ניהול מצבירה, לשנה | 0.5 | % | 0…100 |
| indexed | הצמדת המשיכות לאינפלציה | true | — | true / false |
| timing | מועד המשיכה | start | — | start / end |

Outputs: אורך התקופה לפי ההנחות; משיכות חודשיות רצופות שמומנו במלואן; חודש ההתרוקנות, בשנים; יתרה בסוף אופק הבדיקה; סך המשיכות ששולמו; החודש הראשון עם משיכה שלא מומנה במלואה. SVG balance paths include month 0.

Assumptions: monthly order and rate conversion in calculation-contract.md; constant return/inflation; deposits at start, fixed nominal; no tax/insurance/legal parameters; no rounding inside loop. URL query keys are the input names above, booleans 1/0, validated bounds, unknown keys ignored and invalid values visibly reset to example defaults. No email/backend/storage. Native browser print/PDF using A4 stylesheet.

אין חיזוי תשואות, תוחלת חיים או הסתברות הצלחה. לא נכללים מס, הוצאה פתאומית או מגבלות משיכה מהמוצר. סדר תשואות בפועל יכול לשנות את התוצאה גם כשהממוצע דומה.
