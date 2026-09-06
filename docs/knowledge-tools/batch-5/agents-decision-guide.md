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

# שכיר שהופך לעצמאי — מה צריך לבדוק בתיק?

נבדק לאחרונה: 2026-09-06

אילו נתונים ובדיקות נדרשים כשהלקוח עובר משכיר לעצמאי?

שינוי אופן העבודה מחייב קודם כול מיפוי של מועדים, מסמכים והפקדות. מפרידים בין סיום העבודה כשכיר, תחילת הפעילות העצמאית והמשך החיסכון והכיסוי. המדריך מסדר שאלות לבדיקה; הוא אינו מחשב חובות הפקדה או קובע זכאות.

## מה להכין
- תאריך סיום העבודה כשכיר ותאריך תחילת הפעילות העצמאית; ציינו אם קיימת תקופת חפיפה.
- מסמכי סיום העסקה, תלושים אחרונים, דוחות חיסכון ופירוט הפקדות בפועל.
- הערכת הכנסה והיקף פעילות, אישורי רישום שהתקבלו ורשימת התחייבויות משפחתיות.

## רשימת בדיקה ושדות למילוי
טקסט חופשי לכל קבוצת שאלות; הטופס מתחיל ריק, אינו נשמר או נשלח, וכולל הדפסת A4 של התשובות. אין ציון או מסקנה אוטומטית.

### סיום העבודה כשכיר
דף טופס 161 של רשות המסים מפריד בין דיווח המעסיק לבין בחירות העובד לגבי מענקי הפרישה. אוספים את המסמכים לפני בחינת חלופות. [מקור](https://www.gov.il/he/service/notice-of-retirement)

- אילו מסמכי סיום עבודה התקבלו, ומה חסר?
- האם בוצעו בעבר בחירות או משיכות שצריך להביא לבדיקה?
- מי יבדוק את השלכות החלופות לפני מתן הוראה לכספים?

שדה dates: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: משפחת א׳: התקבל מסמך סיום העסקה; נתוני הפרישה טרם הושלמו. אין הוראת משיכה. נבקש מהמעסיק את המסמכים החסרים.

### תחילת הפעילות והרישום
ביטוח לאומי מפנה להודעה על תחילת העבודה כעצמאי ולהצהרת היקף העבודה וההכנסה הצפויים. בודקים אישור רישום בפועל ואת הנתונים שנמסרו. [מקור](https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/howtoregister.aspx)

- האם הפעילות התחילה והאם התקבל אישור רישום?
- האם יש גם עבודה כשכיר או מקור הכנסה נוסף?
- מי יבדוק אם ההצהרה על הפעילות וההכנסה עדיין מתאימה?

שדה registration: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: לפי השיחה, הפעילות התחילה אך אישור הרישום לא הוצג. נבקש את האישור ונעביר שאלות על המעמד והדיווח לגורם המטפל.

### הפקדות וכיסוי בהמשך הדרך
המקור הרשמי מתאר חובת הפקדה לעצמאים בהתאם להוראות הדין. מכאן נדרשת בדיקה אישית של התחולה והנתונים, ולא העתקת סכום כללי לתיק. [מקור](https://www.gov.il/he/service/pension-deposit-report)

- אילו הפקדות בוצעו בפועל, ומאיזה מקור?
- אילו נתוני הכנסה ומסמכים דרושים לבדיקת ההפקדה המתאימה?
- מה יש לבדוק בנפרד לגבי המשך הכיסוי, תנאי המוצר ורצף התשלומים?

שדה savings: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: בדוחות הדוגמה מופיעות הפקדות ממעסיק קודם בלבד. סכום ההפקדה העתידי והכיסוי טרם נקבעו; נדרשות בדיקה מקצועית והצלבה עם מסמכי המוצר.

## דוגמה פתורה
מקרה בדיוני להמחשה: משפחת א׳ מתכוננת למעבר לעצמאות. הפגישה אינה מתחילה מהפקדה חדשה, אלא מרשימת מסמכים חסרים וממועדי המעבר. התוצאה הפתורה כאן היא חלוקת הבירורים והאחריות, ללא חישוב חבות או המלצת מוצר.

## מגבלות
אין במדריך קביעה על מעמד בביטוח לאומי, חובת הפקדה במקרה מסוים, גובה תשלום, הטבת מס או רצף כיסוי. יש לבדוק את הדין המעודכן, מסמכי המוצר ונסיבות הלקוח עם בעלי המקצוע המתאימים. סימון פריט או מילוי תשובה אינם אישור לביצוע.

## מקורות רשמיים
- [ביטוח לאומי — פתיחת תיק עצמאי](https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/howtoregister.aspx) — מקור להודעה על תחילת פעילות, רישום והצהרת הכנסה צפויה; את המעמד והתשלומים יש לבדוק לפי הנסיבות. נבדק: 2026-09-06.
- [רשות המסים — הודעה על פרישה מעבודה (טופס 161 חדש)](https://www.gov.il/he/service/notice-of-retirement) — מקור להליך הדיווח ולמסמכים. אין כאן חישוב מס או הוראה כיצד לבחור בכספים. נבדק: 2026-09-06.
- [רשות האכיפה והגבייה — דיווח עצמאים על הפקדות לפנסיה](https://www.gov.il/he/service/pension-deposit-report) — מקור רשמי לחובת הפקדה ולדיווח הרלוונטי. אין במדריך תקרות, שיעורים, חריגים מחושבים או קביעה שהשירות נדרש בכל מקרה. נבדק: 2026-09-06.

כאן מכינים שאלות לפגישה; בהדגמה אפשר לבחון עבודה על תיק לקוח ב־Plan-T.

[תיאום הדגמה](/contact/)
