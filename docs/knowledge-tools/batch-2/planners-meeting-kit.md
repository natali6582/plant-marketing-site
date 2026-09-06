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

# ערכת פגישת היכרות

## שאלה מקצועית
איזו תמונה צריך לבנות לפני שמתחילים לתכנן?

## הסבר
אוספים הכנסות, הוצאות, התחייבויות, נכסים ומטרות, ומציינים ליד כל פריט את המקור ואת רמת הוודאות. התוצר הוא מפת שאלות להמשך, לפני בחירת הנחות או פתרונות.

## מדריך לפגישה
1. הסכימו על מטרת השיחה ועל האנשים שצריכים להיות שותפים לה. השתמשו בתקופה ובמטבע עקביים, וכתבו במפורש כשנתון הוא הערכה.
2. מפו הכנסות והוצאות בנפרד. הכנסה חד־פעמית אינה הכנסה חודשית, ונכס אינו בהכרח כסף שאפשר להשתמש בו היום.
3. רשמו לכל התחייבות את התשלום, יתרת החוב אם ידועה והמועד הרלוונטי. הפרידו נכסים בבעלות משותפת מחלקו של הלקוח.
4. נסחו כל מטרה במילים של הלקוח: למה היא חשובה, מתי הכסף נדרש ומה גמיש. סיימו ברשימת נתונים להשלמה לפני חישוב תרחיש.

## חוזה התבנית
קלט: השדות להלן, טקסט חופשי בעברית ובמספרים. ברירת מחדל: ריק. פלט: טופס HTML הניתן למילוי ולהדפסת A4, כולל כל הטקסט שהוזן. אין חישוב, שמירה או שליחה; רענון מוחק את הקלט.

### מסגרת וזרמי כסף
- **כינוי לתיק ומטרת הפגישה** (מזהה: meeting) — מי משתתף ומה רוצים לברר.
  דוגמה בדיונית: משפחת ב׳ — מיפוי לפני תקופת לימודים ושינוי בהיקף העבודה.
- **הכנסות: מקור, סכום, תקופה וודאות** (מזהה: income) — ציינו מטבע, נטו או ברוטו, וקבועה או משתנה.
  דוגמה בדיונית: הכנסה מעבודה: 24,000 ₪ נטו בחודש, לפי דיווח המשפחה; יש לאמת במסמכים. הכנסה משתנה אינה נכללת עד לבירור.
- **הוצאות שוטפות וחד־פעמיות** (מזהה: expenses) — הפרידו תקופות ומנעו ספירה כפולה של תשלומי חוב.
  דוגמה בדיונית: הוצאות שוטפות מדווחות: 16,000 ₪ לחודש, לפני הלוואה. שכר לימוד עתידי טרם ידוע; אין אומדן מוסכם.

### התחייבויות ונכסים
- **התחייבויות ותשלומים עתידיים** (מזהה: liabilities) — לכל פריט: יתרה, תשלום, מועד סיום ומקור מידע.
  דוגמה בדיונית: הלוואה: יתרה מדווחת 80,000 ₪; תשלום 2,000 ₪ לחודש. מועד סיום ותנאים חסרים וייבדקו מול ההסכם.
- **נכסים, בעלות ונזילות** (מזהה: assets) — לכל נכס: סכום ומועד הערכה, מטבע, בעלים ומועד זמינות.
  דוגמה בדיונית: יתרה בחשבון נזיל: 90,000 ₪, לפי דיווח המשפחה בתחילת השיחה. זכויות בחיסכון ארוך טווח יירשמו אחרי קבלת דוחות; אין אומדן שווי בשלב זה.
- **כסף שכבר מיועד למטרה** (מזהה: buffers) — מה כבר שמור להתחייבות ולא פנוי לתוכנית אחרת.
  דוגמה בדיונית: חלק מהיתרה בחשבון מיועד לשכר לימוד. ההיקף טרם נקבע, ולכן לא הוגדר סכום פנוי להשקעה.

### מטרות, אופקים והמשך
- **מטרות: סכום מבוקש, מועד ועדיפות** (מזהה: goals) — סכום לא ידוע נרשם כחסר; אין צורך לנחש.
  דוגמה בדיונית: תקופת לימודים בשנה הקרובה — עדיפות גבוהה, תקציב חסר. מעבר דירה בטווח מאוחר יותר — מועד וסכום גמישים.
- **מה גמיש ומה אינו גמיש** (מזהה: flexibility) — גובה הוצאה, תאריך, עבודה חלקית או סדר עדיפויות.
  דוגמה בדיונית: אפשר לשקול עבודה חלקית; יש לברר את ההכנסה האפשרית. תשלום שכר הלימוד תלוי במוסד ובמסלול שייבחרו.
- **מידע חסר ואחריות להשלמה** (מזהה: next) — מה לאומת במסמך, מי אחראי ומתי חוזרים לתכנון.
  דוגמה בדיונית: המשפחה: דפי חשבון, מסמכי הלוואה ואומדן לימודים. המתכנן: למפות כפילויות ולהציע תרחישים אחרי השלמת הנתונים. אין מסקנה על יכולת מימון בשלב זה.

## דוגמה מלאה
מקרה בדיוני להמחשה: משפחת ב׳ בוחנת תקופת לימודים. המספרים בטופס הם נתוני דוגמה מדווחים, לא תוצאה של חישוב ולא תחזית. טרם חושב עודף חודשי משום שתקציב הלימודים ונתונים נוספים חסרים.

## מגבלות
זהו כלי לאיסוף מידע, ללא חישוב תקציב, שווי נכסים, מס או המלצת השקעה. מילוי כל השדות אינו מוכיח שהמידע מלא או מאומת. החלטה מחייבת בחינת מסמכים, צרכים, סיכונים והנחות מתאימות.

כאן מכינים את מבנה הפגישה; בהדגמה אפשר לבחון עבודה על תיק לקוח ב־Plan-T.

[תיאום הדגמה](/contact/)
