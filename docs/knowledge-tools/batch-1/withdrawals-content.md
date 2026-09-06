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

# כמה זמן יספיק החיסכון

בעלים: נטלי · עודכן: 2026-09-06

טיוטה — ממתינה לאישור שורה־שורה של נטלי.

## השאלה
לכמה משיכות חודשיות יכול להספיק החיסכון בתרחיש שבחרנו?

## הסבר
בוחנים יתרה זמינה מול משיכה חודשית, עלויות ואינפלציה. התוצאה היא תיאור של תרחיש חשבוני; אפשר לשנות כל הנחה ולראות את השפעתה על רצף המשיכות.

## הדוגמה
דוגמה בדיונית: חיסכון זמין של 600,000 ₪ ומשיכה ראשונה של 6,000 ₪ בתחילת החודש. תשואה שנתית משוערת 3%, אינפלציה משוערת 2%, דמי ניהול מצבירה 0.5% לשנה והצמדה מופעלת. אופק הבדיקה הוא 30 שנה.

| מדד | תוצאה |
|---|---|
| אורך התקופה לפי ההנחות | החיסכון מגיע לאפס בחודש 103 |
| משיכות חודשיות רצופות שמומנו במלואן | 102.00 חודשים |
| חודש ההתרוקנות, בשנים | 8.58 שנים |
| יתרה בסוף אופק הבדיקה | 0.00 ₪ |
| סך המשיכות ששולמו | 666,076.41 ₪ |
| החודש הראשון עם משיכה שלא מומנה במלואה | 103.00 |

[פתיחת נתוני הדוגמה](/knowledge/planners/withdrawals/?balance=600000&withdrawal=6000&years=30&return=3&inflation=2&fee=0.5&indexed=1&timing=start)

## שימוש בפגישה
1. מפרידים בין חיסכון זמין למשיכה לבין כסף שמועד הנזילות שלו אינו ידוע.
2. מגדירים את הפער החודשי שצריך לממן אחרי הכנסות אחרות.
3. בודקים תרחיש עם הצמדה ותרחיש ללא הצמדה, ומסבירים את ההבדל בכוח הקנייה.
4. מציגים תרחיש עם תשואה נמוכה יותר ועם משיכה גבוהה יותר לפני שמסיקים מסקנה.

## מה להכין
- יתרה זמינה בתחילת התקופה
- תקציב חודשי והכנסות אחרות
- מועד תחילת המשיכות, דמי ניהול ואופק בדיקה

## מה לשאול
- אילו הוצאות אינן חודשיות אך צריך להכין עבורן כסף?
- מה אפשר לשנות אם החיסכון מתרוקן מוקדם מהמתוכנן?
- האם סכום המשיכה צריך לשמור על כוח קנייה קבוע?

## גבולות התוצאה
אין חיזוי תשואות, תוחלת חיים או הסתברות הצלחה. לא נכללים מס, הוצאה פתאומית או מגבלות משיכה מהמוצר. סדר תשואות בפועל יכול לשנות את התוצאה גם כשהממוצע דומה.

כאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.

[תיאום הדגמה](/contact/)
