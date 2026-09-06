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

# ריאלי מול נומינלי אחרי דמי ניהול

בעלים: נטלי · עודכן: 2026-09-06

טיוטה — ממתינה לאישור שורה־שורה של נטלי.

## השאלה
מה משמעות היתרה העתידית במונחי כוח הקנייה של היום?

## הסבר
מחשבים את הצבירה בשקלים עתידיים ובשקלים של היום. לצד שתי היתרות מוצג פירוק שמבדיל בין ההפקדות, הצמיחה בתרחיש, השפעת דמי הניהול והשפעת האינפלציה.

## הדוגמה
דוגמה בדיונית: יתרה התחלתית 500,000 ₪, הפקדה חודשית 1,000 ₪ למשך 10 שנים, תשואה שנתית נומינלית משוערת 5%, אינפלציה משוערת 2% ודמי ניהול מצבירה 0.7% לשנה.

| מדד | תוצאה |
|---|---|
| יתרה נומינלית בסוף התקופה | 908,592.63 ₪ |
| יתרה בשקלים של היום | 745,362.42 ₪ |
| סכום התחלתי והפקדות | 620,000.00 ₪ |
| צמיחה בתרחיש ללא דמי ניהול | 349,439.37 ₪ |
| השפעת דמי הניהול על היתרה | 60,846.74 ₪ |
| פער כוח הקנייה בגלל אינפלציה | 163,230.21 ₪ |

[פתיחת נתוני הדוגמה](/knowledge/wealth/real-return/?balance=500000&deposit=1000&years=10&return=5&inflation=2&fee=0.7)

## שימוש בפגישה
1. מסכימים על מועד היעד ועל המטבע שבו נמדדים הסכומים.
2. מבהירים אם ההפקדות העתידיות קבועות בשקלים או אמורות להשתנות; הכלי מניח סכום נומינלי קבוע.
3. מציגים את היתרה הנומינלית ואת כוח הקנייה זו לצד זו.
4. משנים את האינפלציה ובודקים כיצד משתנה היכולת לממן את המטרה.

## מה להכין
- יתרה התחלתית והפקדה חודשית מתוכננת
- תקופת ההשקעה והנחת תשואה נומינלית
- הנחת אינפלציה ודמי ניהול מצבירה

## מה לשאול
- האם היעד נקוב במחירי היום או בסכום עתידי?
- האם קיימות עלויות נוספות שלא הוזנו?
- האם סל ההוצאות של המשפחה מתאים להנחת האינפלציה שבחרנו?

## גבולות התוצאה
אין חישוב מס, תשואה מובטחת או תחזית שער חליפין. האינפלציה קבועה ומשותפת לכל הסכום. פירוק ההשפעות תלוי בסדר החישוב ואינו מציג רווח ריאלי לאחר מס.

כאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.

[תיאום הדגמה](/contact/)
