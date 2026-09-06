# Knowledge-center calculation contract — batch 1

Scope: `/knowledge/` only. Base: updated `main`, e8ee526c2118354ec4237c623d16aafcd773c392. Professional owner: Natali (נטלי). Every definition, number and text awaits her line-by-line approval. One PR per batch. The user's instruction to finish all stages removes intermediate execution gates; it does not constitute content approval or permission to merge/publish. All new pages remain noindex.

Page sequence: professional question → short explanation → tool/template → worked example → standard demo CTA. Existing knowledge disclaimer; visible owner/update line; original writing/design/code; external tools linked with credit. Calculators: shared engine, visible assumptions, tested vectors, URL-prefill, print/PDF, no email. Templates: fillable A4 HTML, no backend/storage. Hebrew RTL, numbers LTR. Evidence: desktop/mobile, print samples, vector output, link checks and honest approval table.


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
