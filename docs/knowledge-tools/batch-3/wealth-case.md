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

# הרבה נכסים, מעט כסף זמין

**מקרה בדיוני להמחשה**

האם מועדי הנזילות מתאימים למועדי התשלומים?

שווי נכסים ומקור לתשלום קרוב הם שתי שאלות שונות. מתחילים מהסכום הזמין ומהמשיכות, ומשאירים החזקה שמועד מימושה אינו ודאי מחוץ למקור המימון הקרוב.

## מצב התחלתי
למשפחת ג׳ יש, בדוגמה, 120,000 ₪ זמינים ותשלומים שוטפים של 40,000 ₪ לחודש. בנוסף היא מחזיקה השקעה ששווייה המדווח 750,000 ₪. המשפחה מצפה לאפשרות מימוש בחודש השישי, אך המועד, הסכום והתנאים לא אומתו. במודל המזומן לא מכניסים את ההשקעה כמקור תשלום.

## מידע חסר
- איזה מסמך מגדיר את מועד הפדיון, והאם קיימים תנאים או מגבלות?
- האם יש התחייבויות נוספות, קריאות הון או תשלומים במטבע אחר?
- כמה מהיתרה הזמינה כבר מוקצה לצורך אחר?
- האם סכום המימוש המדווח הוא לפני עלויות ומס, ומה עדיין לא ידוע?

## חלופות ודוגמה מחושבת
### כסף זמין בלבד — התקציב המקורי

- חיסכון זמין בתחילת התקופה: 120,000.00 ₪
- משיכה חודשית בשקלים של היום: 40,000.00 ₪
- אופק הבדיקה: 1.00 שנים
- תשואה שנתית נומינלית משוערת: 0.00 %
- אינפלציה שנתית משוערת: 0.00 %
- דמי ניהול מצבירה, לשנה: 0.00 %
- הצמדת המשיכות לאינפלציה: לא
- מועד המשיכה: בתחילת החודש

[פתיחה במחשבון עם הנתונים](/knowledge/planners/withdrawals/?balance=120000&withdrawal=40000&years=1&return=0&inflation=0&fee=0&indexed=0&timing=start)

- אורך התקופה לפי ההנחות: החיסכון מגיע לאפס בחודש 3 
- משיכות חודשיות רצופות שמומנו במלואן: 3.00 חודשים
- חודש ההתרוקנות, בשנים: 0.25 שנים
- יתרה בסוף אופק הבדיקה: 0.00 ₪
- סך המשיכות ששולמו: 120,000.00 ₪
- החודש הראשון עם משיכה שלא מומנה במלואה: 4.00 

הכסף הזמין מממן את המשיכות המלאות המוצגות בתוצאה. אין בו מימון אוטומטי עד מועד המימוש המשוער של ההשקעה.

### חלופה לבירור — תקציב חודשי מצומצם

- חיסכון זמין בתחילת התקופה: 120,000.00 ₪
- משיכה חודשית בשקלים של היום: 30,000.00 ₪
- אופק הבדיקה: 1.00 שנים
- תשואה שנתית נומינלית משוערת: 0.00 %
- אינפלציה שנתית משוערת: 0.00 %
- דמי ניהול מצבירה, לשנה: 0.00 %
- הצמדת המשיכות לאינפלציה: לא
- מועד המשיכה: בתחילת החודש

[פתיחה במחשבון עם הנתונים](/knowledge/planners/withdrawals/?balance=120000&withdrawal=30000&years=1&return=0&inflation=0&fee=0&indexed=0&timing=start)

- אורך התקופה לפי ההנחות: החיסכון מגיע לאפס בחודש 4 
- משיכות חודשיות רצופות שמומנו במלואן: 4.00 חודשים
- חודש ההתרוקנות, בשנים: 0.33 שנים
- יתרה בסוף אופק הבדיקה: 0.00 ₪
- סך המשיכות ששולמו: 120,000.00 ₪
- החודש הראשון עם משיכה שלא מומנה במלואה: 5.00 

תקציב קטן יותר מאריך את משך המימון המחושב. לפני שבוחרים בחלופה, צריך לברר אילו תשלומים ניתן לשנות; אין כאן הנחה שניתן להקטין התחייבות קיימת.

### החזקה נפרדת — המחשת שווי בלבד

- יתרה התחלתית: 750,000.00 ₪
- הפקדה חודשית, אם יש: 0.00 ₪
- תקופת החישוב: 0.50 שנים
- תשואה שנתית נומינלית משוערת: 0.00 %
- אינפלציה שנתית משוערת: 0.00 %
- דמי ניהול מצבירה, לשנה: 0.00 %

[פתיחה במחשבון עם הנתונים](/knowledge/wealth/real-return/?balance=750000&deposit=0&years=0.5&return=0&inflation=0&fee=0)

- יתרה נומינלית בסוף התקופה: 750,000.00 ₪
- יתרה בשקלים של היום: 750,000.00 ₪
- סכום התחלתי והפקדות: 750,000.00 ₪
- צמיחה בתרחיש ללא דמי ניהול: 0.00 ₪
- השפעת דמי הניהול על היתרה: 0.00 ₪
- פער כוח הקנייה בגלל אינפלציה: 0.00 ₪

מחשבון השווי מציג רק את תוצאת הנחות השווי לחצי שנה. הוא אינו בודק נזילות או מוכיח שאפשר לפדות בחודש השישי. הסכום אינו מתווסף למחשבון המשיכות.

## רגישות להנחות
בתרחישי המזומן אין תשואה, אינפלציה או עלויות כדי שאפשר יהיה לבדוק את מספר המשיכות בחשבון פשוט. גם אחרי צמצום התקציב צריך לבדוק את רצף מועדי התשלום מול נזילות שאומתה. אפשר לבחון עיכוב במימוש על ציר זמן; אין להסיק מהיתרה הנומינלית את יום קבלת הכסף.

## שאלות לפגישה
- מה צריך להיות משולם לפני שמתקבל כסף מהמימוש?
- מה עושים אם הפדיון מתעכב או מתבצע בסכום אחר?
- מי מאמת את תנאי הפדיון ואת ההתחייבויות של כל ישות?
- אילו חלופות תשלום מותרות וישימות לאחר בדיקה, ומה עלותן וסיכונן?

## מגבלות
אין כאן הערכת שווי, אישור פדיון, חישוב מס, המרת מטבע או הצעת אשראי. התרחישים אינם לוח נזילות מלא ואינם בודקים פערים בתוך החודש. ההחזקה הנפרדת אינה נחשבת למזומן עד לאימות תנאי המימוש.

כאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.

[תיאום הדגמה](/contact/)
