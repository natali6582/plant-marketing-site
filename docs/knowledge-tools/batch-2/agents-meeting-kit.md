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

# הכנה לסקירה שנתית של תיק הלקוח

## שאלה מקצועית
מה השתנה מאז הסקירה הקודמת — ומה צריך לבדוק בתיק?

## הסבר
מתחילים בשינויים בחיי הלקוח, ואז מסמנים אילו מסמכים ובדיקות חסרים. התבנית מסייעת להכין שיחה מסודרת; היא אינה קובעת כיסוי, זכאות או פעולה במוצר.

## מדריך לפגישה
1. לפני הפגישה, בקשו מסמכים רלוונטיים ועדכניים והגדירו עם הלקוח את מטרת הסקירה. רשמו את תאריך כל מסמך ואת מה שחסר.
2. פתחו בשאלה מה השתנה במשפחה, בעבודה ובהתחייבויות. הבדילו בין תשובה שנמסרה בשיחה לבין מידע שאומת במסמך.
3. חברו כל שינוי לנושא לבדיקה: הפקדות, מוטבים, כיסויים, עלויות או נזילות. שאלת בדיקה אינה המלצה לבצע שינוי.
4. סכמו מי אחראי להשלים כל פריט ומתי חוזרים אליו. החלטה לביצוע נרשמת רק לאחר בדיקה מקצועית וקבלת ההסכמות הנדרשות.

## חוזה התבנית
קלט: השדות להלן, טקסט חופשי בעברית ובמספרים. ברירת מחדל: ריק. פלט: טופס HTML הניתן למילוי ולהדפסת A4, כולל כל הטקסט שהוזן. אין חישוב, שמירה או שליחה; רענון מוחק את הקלט.

### מסגרת הפגישה והמסמכים
- **כינוי לתיק ומטרת הסקירה** (מזהה: meeting) — אפשר להשתמש בכינוי בלבד, ללא מספר זהות.
  דוגמה בדיונית: משפחת א׳ — סקירה שנתית בעקבות החלפת מקום עבודה.
- **מסמכים שנאספו ותאריך עדכון** (מזהה: documents) — דוחות תקופתיים, פירוט הפקדות, תלושי שכר ופרטי כיסוי רלוונטיים.
  דוגמה בדיונית: דוח חיסכון: סוף השנה הקודמת; תלוש ממעסיק חדש: החודש האחרון. פרטי הכיסוי טרם אומתו.
- **מסמכים או מידע חסרים** (מזהה: missing) — מה חסר, ממי לבקש ומה לא ניתן לבדוק בלעדיו.
  דוגמה בדיונית: פירוט הפקדות מהמעסיק החדש ואישור תנאי הכיסוי. הלקוח יבקש מהמעסיק ומהגוף המנהל.

### שינויים מאז הפגישה הקודמת
- **משפחה ומי תלוי בהכנסה** (מזהה: family) — שינוי בהרכב המשפחה, במוטבים המבוקשים או באנשים הנתמכים.
  דוגמה בדיונית: לפי השיחה, נוספה אחריות לתמיכה בבן משפחה. יש לברר את ההיקף והמשך הצפוי.
- **עבודה והכנסה** (מזהה: work) — מעסיק, אופן העסקה, היקף משרה או הכנסה משתנה.
  דוגמה בדיונית: החלפת מעסיק במהלך השנה. נדרש להשוות בין מועדי השכר וההפקדות בפועל.
- **התחייבויות ומטרות** (מזהה: commitments) — שינויים בהוצאות, בחובות ובצרכים קרובים.
  דוגמה בדיונית: מתוכנן שיפוץ בעתיד הקרוב; סכום ומועד טרם נקבעו. אין החלטה למשוך חיסכון.

### נושאים לבדיקה וסיכום
- **נושא לבדיקה, מקור ומידע חסר** (מזהה: checks) — למשל רצף הפקדות, התאמת כיסוי, מוטבים, עלויות ונזילות.
  דוגמה בדיונית: הפקדות: להצליב תלושים ודוחות. כיסוי ומוטבים: לבדוק מול המסמכים העדכניים. עלויות: לרשום את התנאים הקיימים לפני השוואה.
- **שאלות שעדיין פתוחות** (מזהה: questions) — מה השתנה? איזה צורך הכי דחוף? איזה נתון עדיין מבוסס על הערכה?
  דוגמה בדיונית: מהו היקף התמיכה המשפחתית? מתי צפוי השיפוץ? אילו מסמכים חסרים להשלמת הסקירה?
- **המשך טיפול: פריט, אחראי ומועד** (מזהה: actions) — הפרידו בין השלמת מידע לבין החלטה לביצוע.
  דוגמה בדיונית: הלקוח: להעביר מסמכים לפני פגישת ההמשך. בעל המקצוע: לבדוק את הנתונים שהתקבלו ולסמן פערים. טרם ניתנה הוראת שינוי.

## דוגמה מלאה
מקרה בדיוני להמחשה: משפחת א׳ מגיעה אחרי החלפת מעסיק. במקום להתחיל מהצעת מוצר, הסקירה מסמנת תחילה את המסמכים החסרים ואת השינויים המשפחתיים. הדוגמה המלאה להלן היא תיעוד הכנה לשיחה בלבד.

## מגבלות
התבנית אינה בודקת רצף ביטוחי, חיתום, תנאי פוליסה, מיסוי או זכויות. אין להסיק ממנה שהכיסוי מספיק, שההפקדות תקינות או שיש לבצע ניוד. נדרשים מסמכים ובדיקה לפי נסיבות הלקוח.

כאן מכינים את מבנה הפגישה; בהדגמה אפשר לבחון עבודה על תיק לקוח ב־Plan-T.

[תיאום הדגמה](/contact/)
