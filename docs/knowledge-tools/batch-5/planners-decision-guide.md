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

# לקראת פרישה — אילו נתונים והחלטות צריך להכין?

נבדק לאחרונה: 2026-09-06

מה צריך להיות על השולחן לפני בחירות לקראת פרישה?

מכינים תמונה של הכנסות, נכסים, התחייבויות והיסטוריית פרישה, ואז מפרידים בין איסוף מידע לבין בחירה שיש לה השלכות. המדריך נועד להכנת הפגישה, ללא חישוב קצבה, פטור או מס.

## מה להכין
- רשימת מעסיקים, תקופות עבודה ומסמכי פרישה שנמסרו בעבר ובהווה.
- דוחות עדכניים של חיסכון וקצבאות, אישורי יתרות ומידע על מענקים, משיכות ובחירות קודמות.
- תקציב משק הבית, הכנסות נוספות, התחייבויות ומועדים שבהם נדרש כסף.

## רשימת בדיקה ושדות למילוי
טקסט חופשי לכל קבוצת שאלות; הטופס מתחיל ריק, אינו נשמר או נשלח, וכולל הדפסת A4 של התשובות. אין ציון או מסקנה אוטומטית.

### מסמכי פרישה והיסטוריית בחירות
טופס 161 כולל דיווח מעסיק ובחירות עובד. יש להבחין בין נתון במסמך, פעולה שכבר בוצעה וחלופה שעדיין נבחנת. [מקור](https://www.gov.il/he/service/notice-of-retirement)

- מה התקבל מכל מעסיק, והאם קיימות סתירות בין המסמכים?
- אילו מענקים, משיכות ובחירות קודמות צריך לאמת?
- מה עדיין חסר לפני דיון בחלופות לכספים?

שדה history: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: משפחת ב׳: קיימים מסמכים ממעסיק אחרון אך חסר תיעוד מתקופת עבודה קודמת. התיק מסומן להשלמה לפני בחינת הוראה לכספי הפרישה.

### שאלות לקראת קיבוע זכויות
פותחים את דף הבקשה הרשמי כדי לבדוק את ההליך ואת המסמכים העדכניים. את ההתאמה האישית והשלכות הבחירה מעבירים לבדיקה מקצועית. [מקור](https://www.gov.il/he/service/itc-request-for-fixed-rights-at-retirement-age)

- אילו נתוני קצבה, מענקים והיוונים דרושים להשלמת הבדיקה?
- האם קיימות החלטות קודמות או הכנסות נוספות שמשפיעות על הבירור?
- מי מסביר את החלופות ואת מגבלות שינוי הבחירה, ומה יתועד לפני חתימה?

שדה decisions: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: לא הוגשה בקשה בדוגמה. נרכז את ההיסטוריה והאישורים, ונבקש מהגורם המקצועי להסביר את החלופות על בסיס תיק מלא. לא נקבע שיעור פטור.

### הכנסות וקצבאות לאורך התקופה
ביטוח לאומי מתאר הליך תביעה לקצבת אזרח ותיק וצירוף מידע על הכנסות. לא מוסיפים לתקציב סכום קצבה כאילו כבר אושר. [מקור](https://www.btl.gov.il/benefits/old_age/Pages/%D7%90%D7%95%D7%A4%D7%9F%20%D7%94%D7%92%D7%A9%D7%AA%20%D7%94%D7%AA%D7%91%D7%99%D7%A2%D7%94.aspx)

- אילו הכנסות מאושרות, מאיזה מועד, ואילו עדיין בגדר הערכה?
- האם נדרשת תביעה או השלמת מסמכים, ומי מטפל בכך?
- מה יממן את התקופה שבין סיום העבודה לתחילת כל תקבול?

שדה income: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: מועד תחילת חלק מהתקבולים טרם אושר. נרשום אותם כמידע חסר ונבדוק בנפרד את הצורך במזומן בתקופת הביניים.

## דוגמה פתורה
מקרה בדיוני להמחשה: משפחת ב׳ מגיעה לפני סיום עבודה. מסמכי מעסיק קודם חסרים, ומועדי חלק מהתקבולים אינם מאומתים. במקום למלא טופס מתוך אומדן, הפגישה מסתיימת ברשימת השלמות ובשאלות לבדיקת החלופות.

## מגבלות
אין כאן ייעוץ מס, קביעת זכאות, חישוב קיבוע זכויות או המלצה למשיכה, היוון או מסלול קצבה. אין להסיק שמסמך מסוים מספיק בכל מקרה. כל בחירה דורשת בדיקת נתונים, דין עדכני והשלכות פרטניות.

## מקורות רשמיים
- [רשות המסים — הודעה על פרישה מעבודה (טופס 161 חדש)](https://www.gov.il/he/service/notice-of-retirement) — מקור להליך הדיווח ולמסמכים. אין כאן חישוב מס או הוראה כיצד לבחור בכספים. נבדק: 2026-09-06.
- [רשות המסים — בקשה לקיבוע זכויות](https://www.gov.il/he/service/itc-request-for-fixed-rights-at-retirement-age) — מקור להליך הבקשה ולמסמכים הרלוונטיים. אין כאן חישוב שיעור פטור או המלצה על בחירה. נבדק: 2026-09-06.
- [ביטוח לאומי — הגשת תביעה לקצבת אזרח ותיק](https://www.btl.gov.il/benefits/old_age/Pages/%D7%90%D7%95%D7%A4%D7%9F%20%D7%94%D7%92%D7%A9%D7%AA%20%D7%94%D7%AA%D7%91%D7%99%D7%A2%D7%94.aspx) — מקור להליך הגשת תביעה ולמידע על הכנסות. אין כאן גיל זכאות, מבחן הכנסה או סכום קצבה. נבדק: 2026-09-06.

כאן מכינים שאלות לפגישה; בהדגמה אפשר לבחון עבודה על תיק לקוח ב־Plan-T.

[תיאום הדגמה](/contact/)
