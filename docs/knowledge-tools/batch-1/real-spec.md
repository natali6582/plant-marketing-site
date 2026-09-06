# Knowledge-center calculation contract — batch 1

Scope: `/knowledge/` only. Base: updated `main`, e8ee526c2118354ec4237c623d16aafcd773c392. Professional owner: Natali (נטלי). Every definition, number and text awaits her line-by-line approval. One PR per batch. The user's instruction to finish all stages removes intermediate execution gates; it does not constitute content approval or permission to merge/publish. All new pages remain noindex.

Page sequence: professional question → short explanation → tool/template → worked example → standard demo CTA. Existing knowledge disclaimer; visible owner/update line; original writing/design/code; external tools linked with credit. Calculators: shared engine, visible assumptions, tested vectors, URL-prefill, print/PDF, no email. Templates: fillable A4 HTML, no backend/storage. Hebrew RTL, numbers LTR. Evidence: desktop/mobile, print samples, vector output, link checks and honest approval table.


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
