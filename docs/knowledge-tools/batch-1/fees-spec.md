# Knowledge-center calculation contract — batch 1

Scope: `/knowledge/` only. Base: updated `main`, e8ee526c2118354ec4237c623d16aafcd773c392. Professional owner: Natali (נטלי). Every definition, number and text awaits her line-by-line approval. One PR per batch. The user's instruction to finish all stages removes intermediate execution gates; it does not constitute content approval or permission to merge/publish. All new pages remain noindex.

Page sequence: professional question → short explanation → tool/template → worked example → standard demo CTA. Existing knowledge disclaimer; visible owner/update line; original writing/design/code; external tools linked with credit. Calculators: shared engine, visible assumptions, tested vectors, URL-prefill, print/PDF, no email. Templates: fillable A4 HTML, no backend/storage. Hebrew RTL, numbers LTR. Evidence: desktop/mobile, print samples, vector output, link checks and honest approval table.


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
