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


בעלים: נטלי · עודכן: 2026-09-06

טיוטה — ממתינה לאישור מקצועי שורה־שורה של נטלי.

# משפחה שמתכננת תקופת מעבר ללא הכנסה מעבודה

**מקרה בדיוני להמחשה**

אילו הנחות משנות את משך הזמן שהכסף הזמין יספיק?

מגדירים את הכסף המיועד לתקופת המעבר ואת המשיכה הנדרשת, ואז בודקים שינוי בהוצאה ובהנחות. משך מימון מחושב אינו הבטחה שהמשפחה תוכל להשלים את המעבר.

## מצב התחלתי
משפחת ב׳ בוחנת תקופה ללא הכנסה מעבודה. לצורך הדוגמה בלבד, הוקצו לה 240,000 ₪ נזילים ומשיכה בסיסית של 20,000 ₪ לחודש בשקלים של היום. אופק הבדיקה הוא 3 שנים. אין הכנסה נוספת, הפקדות או אירועי מס במודל.

## מידע חסר
- כמה מהחיסכון באמת זמין וכמה כבר מיועד להתחייבות אחרת?
- אילו הוצאות חד־פעמיות אינן כלולות בתקציב החודשי?
- מה גמיש במשך המעבר, בתקציב או בחזרה לעבודה?
- מהו מקור הנתונים, ואילו תשלומים או הכנסות עדיין אינם ודאיים?

## חלופות ודוגמה מחושבת
### תרחיש בסיס — משיכה צמודה בתחילת החודש

- חיסכון זמין בתחילת התקופה: 240,000.00 ₪
- משיכה חודשית בשקלים של היום: 20,000.00 ₪
- אופק הבדיקה: 3.00 שנים
- תשואה שנתית נומינלית משוערת: 2.00 %
- אינפלציה שנתית משוערת: 2.00 %
- דמי ניהול מצבירה, לשנה: 0.40 %
- הצמדת המשיכות לאינפלציה: כן
- מועד המשיכה: בתחילת החודש

[פתיחה במחשבון עם הנתונים](/knowledge/planners/withdrawals/?balance=240000&withdrawal=20000&years=3&return=2&inflation=2&fee=0.4&indexed=1&timing=start)

- אורך התקופה לפי ההנחות: החיסכון מגיע לאפס בחודש 12 
- משיכות חודשיות רצופות שמומנו במלואן: 11.00 חודשים
- חודש ההתרוקנות, בשנים: 1.00 שנים
- יתרה בסוף אופק הבדיקה: 0.00 ₪
- סך המשיכות ששולמו: 241,745.07 ₪
- החודש הראשון עם משיכה שלא מומנה במלואה: 12.00 

החודש שבו נותר רק סכום חלקי אינו חודש שמומן במלואו. התוצאה מפרידה בין מספר החודשים המלאים לבין חודש התרוקנות החיסכון.

### רגישות — משיכה חודשית גדולה יותר

- חיסכון זמין בתחילת התקופה: 240,000.00 ₪
- משיכה חודשית בשקלים של היום: 24,000.00 ₪
- אופק הבדיקה: 3.00 שנים
- תשואה שנתית נומינלית משוערת: 2.00 %
- אינפלציה שנתית משוערת: 2.00 %
- דמי ניהול מצבירה, לשנה: 0.40 %
- הצמדת המשיכות לאינפלציה: כן
- מועד המשיכה: בתחילת החודש

[פתיחה במחשבון עם הנתונים](/knowledge/planners/withdrawals/?balance=240000&withdrawal=24000&years=3&return=2&inflation=2&fee=0.4&indexed=1&timing=start)

- אורך התקופה לפי ההנחות: החיסכון מגיע לאפס בחודש 10 
- משיכות חודשיות רצופות שמומנו במלואן: 9.00 חודשים
- חודש ההתרוקנות, בשנים: 0.83 שנים
- יתרה בסוף אופק הבדיקה: 0.00 ₪
- סך המשיכות ששולמו: 241,426.85 ₪
- החודש הראשון עם משיכה שלא מומנה במלואה: 10.00 

משנים רק את גובה המשיכה. התרחיש מציף את הצורך לאמת את התקציב לפני קבלת החלטה על תקופת מעבר.

### רגישות — ללא תשואה וללא הצמדה

- חיסכון זמין בתחילת התקופה: 240,000.00 ₪
- משיכה חודשית בשקלים של היום: 20,000.00 ₪
- אופק הבדיקה: 3.00 שנים
- תשואה שנתית נומינלית משוערת: 0.00 %
- אינפלציה שנתית משוערת: 2.00 %
- דמי ניהול מצבירה, לשנה: 0.40 %
- הצמדת המשיכות לאינפלציה: לא
- מועד המשיכה: בתחילת החודש

[פתיחה במחשבון עם הנתונים](/knowledge/planners/withdrawals/?balance=240000&withdrawal=20000&years=3&return=0&inflation=2&fee=0.4&indexed=0&timing=start)

- אורך התקופה לפי ההנחות: החיסכון מגיע לאפס בחודש 12 
- משיכות חודשיות רצופות שמומנו במלואן: 11.00 חודשים
- חודש ההתרוקנות, בשנים: 1.00 שנים
- יתרה בסוף אופק הבדיקה: 0.00 ₪
- סך המשיכות ששולמו: 239,560.98 ₪
- החודש הראשון עם משיכה שלא מומנה במלואה: 12.00 

כאן משתנים שני תנאים במפורש: תשואה והצמדה. המשיכה נשארת קבועה נומינלית, ולכן כוח הקנייה שלה נשחק תחת הנחת האינפלציה החיובית. אין לייחס את כל הפער לגורם יחיד.

## רגישות להנחות
השוו קודם את התרחיש הבסיסי לתקציב המוגדל, ואז בחנו בנפרד את התרחיש ללא תשואה וללא הצמדה. שנו הנחה אחת בכל פעם בקישור המחשבון אם רוצים לבודד את השפעתה. משיכה בסוף החודש משאירה כסף מושקע זמן נוסף במודל; יש לבחור לפי התזרים המתוכנן בפועל.

## שאלות לפגישה
- איזה חלק מהתקציב ניתן לדחות במקרה של פער?
- מהו המועד שבו בוחנים מחדש את התוכנית?
- איך ימומנו הוצאות חד־פעמיות או מעבר שמתארך?
- האם תאריך המשיכה וההצמדה מתאימים לצרכים שעליהם המשפחה מדברת?

## מגבלות
אין במודל שכר עתידי, זכאות לקצבאות, מס, הוצאות לא צפויות או סדר תשואות משתנה. בחיים האמיתיים סדר התשואות עשוי להשפיע על החיסכון בזמן משיכות; תשואה קבועה אינה בדיקה של הסיכון הזה.

כאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.

[תיאום הדגמה](/contact/)
