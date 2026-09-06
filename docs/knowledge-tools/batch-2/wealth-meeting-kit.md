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

# מפת ההון המשפחתית

## שאלה מקצועית
מי מחזיק במה — ומתי הכסף יכול להיות זמין?

## הסבר
מחברים בעלות, מעטפת החזקה, מטבע, מועדי נזילות והתחייבויות עתידיות לתמונה אחת. סכומים במטבעות שונים נשארים נפרדים; שווי מדווח אינו הבטחה למועד מימוש או לתמורה נטו.

## מדריך לפגישה
1. הגדירו את גבולות המפה: בני המשפחה והישויות הכלולים בה, מועד עדכון ומקורות. הבחינו בין בעלות משפטית, חלק יחסי ויכולת לתת הוראה.
2. רשמו כל החזקה פעם אחת, עם המעטפת והמטבע שלה. אם אותה החזקה מופיעה בדוח נוסף, סמנו זאת כדי למנוע ספירה כפולה.
3. לכל נכס, הפרידו מועד שווי ממועד נזילות. בקשו את המסמך שמגדיר תנאי פדיון, הודעה מוקדמת, מגבלות או התחייבות להזרמת הון.
4. הציבו ליד הנכסים את ההתחייבויות לפי מועד ומטבע. פער בתאריך או במטבע הוא נושא לבדיקה; אל תניחו שניתן למכור נכס בזמן.

## חוזה התבנית
קלט: השדות להלן, טקסט חופשי בעברית ובמספרים. ברירת מחדל: ריק. פלט: טופס HTML הניתן למילוי ולהדפסת A4, כולל כל הטקסט שהוזן. אין חישוב, שמירה או שליחה; רענון מוחק את הקלט.

### גבולות המפה
- **כינוי למשפחה, ישויות ומועד העדכון** (מזהה: scope) — אין צורך במספרי חשבון או זיהוי.
  דוגמה בדיונית: משפחת ג׳; משק הבית וחברה בבעלות המשפחה. מפת דוגמה בלבד, ללא חשבונות אמיתיים.
- **בעלות, חלק יחסי ומי מוסמך לפעול** (מזהה: authority) — רשמו אי־בהירות לבדיקה משפטית, בלי להסיק זכויות.
  דוגמה בדיונית: חשבון משפחתי משותף; נכס נוסף מוחזק בחברה. זכויות חתימה וחלקים יחסיים טרם אומתו במסמכים.

### החזקות — רשומה נפרדת לכל נכס
- **החזקה א׳: בעלים, מעטפת, סכום, מטבע, מועד שווי ונזילות** (מזהה: holding1) — הוסיפו מקור, מגבלה וחלק יחסי; אפשר להזין כמה שורות.
  דוגמה בדיונית: חשבון משפחתי | בעלות משותפת | 300,000 ₪ לפי דיווח | מועד שווי: תחילת השיחה | זמינות: לבירור מול הבנק | ללא מספר חשבון.
- **החזקה ב׳: בעלים, מעטפת, סכום, מטבע, מועד שווי ונזילות** (מזהה: holding2) — מועד הפדיון חייב להסתמך על מסמך, לא על שם המוצר.
  דוגמה בדיונית: השקעה דרך חברה | קרן פרטית | 150,000 דולר לפי דוח דוגמה | מועד הדוח: סוף הרבעון הקודם | מועדי פדיון והגבלות: טרם אומתו.
- **החזקות נוספות או מידע חסר** (מזהה: holding3) — ציינו כפל רישום אפשרי ושווי שאינו מעודכן.
  דוגמה בדיונית: נכס מקרקעין מוחזק בחברה. אין הערכת שווי עדכנית; לא נרשם אומדן ולא הונחה אפשרות למימוש מהיר.

### התחייבויות מול זמינות
- **התחייבויות: צד מתחייב, סכום, מטבע ומועד** (מזהה: commitments) — כללו גם התחייבות עתידית שטרם נדרשה לתשלום.
  דוגמה בדיונית: התחייבות עתידית להשקעה: 40,000 דולר. מועד דרישה אפשרי ותנאי ההסכם חסרים; אין לקזז אוטומטית מול יתרה בשקלים.
- **כסף זמין, ייעודו והמידע שמאשר זמינות** (מזהה: liquidity) — אל תכללו נכס לא נזיל במקור לתשלום קרוב בלי בסיס.
  דוגמה בדיונית: היתרה המשפחתית מיועדת גם להוצאות מחיה. צריך להגדיר כמה ממנה פנוי ומהו מטבע ההתחייבות לפני בחינת מקור תשלום.
- **שאלות להמשך וגורם מקצועי מתאים** (מזהה: questions) — בעלות, מיסוי, מטבע, זכויות חתימה, פדיון וקריאות הון.
  דוגמה בדיונית: לבקש מסמכי בעלות, תנאי פדיון והתחייבות הון; להפנות שאלות משפט ומס לגורמים המתאימים. לא נקבע שווי הון כולל ולא בוצעה המרת מטבע.

## דוגמה מלאה
מקרה בדיוני להמחשה: למשפחת ג׳ יש החזקות במעטפות ובמטבעות שונים לצד התחייבות דולרית. המפה שומרת על ההפרדה בין הכסף המשפחתי לנכסי החברה, ומסמנת מידע חסר לפני כל חיבור סכומים או תכנון תשלום.

## מגבלות
המפה אינה הערכת שווי, חוות דעת על בעלות, בדיקת נזילות, בדיקת נאותות או חישוב מס. אין כאן המרת מטבע או חיבור אוטומטי של סכומים. מועדי מימוש, זכויות ותנאים חייבים להיבדק במקורות המתאימים.

כאן מכינים את מבנה הפגישה; בהדגמה אפשר לבחון עבודה על תיק לקוח ב־Plan-T.

[תיאום הדגמה](/contact/)
