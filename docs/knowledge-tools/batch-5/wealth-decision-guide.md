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

# לפני השקעה בקרן פרטית — שאלון בדיקת נאותות

נבדק לאחרונה: 2026-09-06

איזה מידע חסר לפני שמחליטים על השקעה בקרן פרטית?

מבקשים מסמכים ותשובות שאפשר לבדוק, ומפרידים בין תנאי ההסכם למצגת. השאלון אינו ציון איכות או אישור להשקיע. מקורות SEC משמשים כאן לנושאי בדיקה כלליים; הדין והמס הרלוונטיים ללקוח נבדקים בנפרד.

## מה להכין
- מסמכי הצעה והסכם השקעה עדכניים, פירוט עלויות, דוחות שנמסרו ונספחים או הסכמות צדדיות.
- לוח התחייבויות ומקורות מזומן של המשפחה, כולל מטבע ותנאים של כל מקור.
- רשימת בעלי תפקידים, נותני שירות וקשרים עסקיים שדורשים בירור.

## רשימת בדיקה ושדות למילוי
טקסט חופשי לכל קבוצת שאלות; הטופס מתחיל ריק, אינו נשמר או נשלח, וכולל הדפסת A4 של התשובות. אין ציון או מסקנה אוטומטית.

### נזילות ויציאה
המקורות הרשמיים מדגישים שמימוש השקעה פרטית עשוי להיות מוגבל. בודקים את התנאים של ההשקעה המסוימת. [מקור](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/private)

- מתי אפשר לבקש יציאה, ומה עלול לעכב או להגביל אותה?
- מי קובע את שווי הפדיון ומתי מתקבל התשלום?

שדה liquidity: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: משפחת ג׳: תנאי היציאה חסרים. נבקש סעיף חוזי ואישור למנגנון, ללא הנחת מימוש בתאריך מסוים.

### דמי ניהול, הוצאות ותגמול
מסמכי הקרן וההסכמים הם בסיס לבדיקת העלויות ותנאיהן. [מקור](https://www.investor.gov/introduction-investing/investing-basics/investment-products/private-investment-funds/private-equity)

- אילו עלויות חלות על הקרן ועל המשקיע, ועל איזה בסיס הן מחושבות?
- האם קיימים תגמול הצלחה, עלויות ברמת השקעות הבסיס או תשלום למפיץ?

שדה fees: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: קיימת מצגת בלבד. נבקש פירוט חוזי ודוגמת חישוב מקורית מהקרן; לא נקבעה עלות כוללת.

### התחייבות להזרמת הון
רושמים בנפרד כסף שהושקע וכסף שהמשקיע עשוי להתחייב להעביר בעתיד. [מקור](https://www.investor.gov/introduction-investing/investing-basics/investment-products/private-investment-funds/private-equity)

- מה היקף ההתחייבות, כיצד נדרשת הזרמה ומהו זמן ההיערכות לפי ההסכם?
- מה קורה אם לא עומדים בדרישה, ומאיזה מקור מתוכנן התשלום?

שדה commitments: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: לא התקבל נוסח התחייבות. נברר את התנאים ואת מקורות המזומן לפני בחינת התאמה.

### דיווח, שווי ובקרה
מידע מוגבל מקשה לבדוק את ההצעה. מבקשים תיעוד שאפשר לבחון, כולל זהות הגורם שבודק אותו. [מקור](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/private)

- אילו דוחות מתקבלים, באיזו תדירות ומי מבקר אותם?
- איך נקבע שווי נכסים, ואילו ניגודי עניינים או עסקאות עם צד קשור דורשים בירור?

שדה reports: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: נבקש דוחות, שיטת הערכה ופירוט נותני השירות. נתון שיווקי לא סומן כנתון מאומת.

### שאלות מס ומשפט לבעל המקצוע
אלה שאלות להפניה אישית; לא נקבע כאן סיווג מס או דין חל.

- איזו ישות מחזיקה בהשקעה ומהו הדין החל על ההסכם?
- אילו שאלות דיווח, ניכוי, הכנסה במטבע זר וחלוקות צריך להפנות לאיש המס ולעורך הדין?

שדה tax: מה ידוע, מה חסר ומי אחראי לבירור.

דוגמה בדיונית מלאה: נפנה את מסמכי המבנה לגורמים המתאימים. לא נבחרה דרך החזקה ולא חושב מס.

## דוגמה פתורה
מקרה בדיוני להמחשה: משפחת ג׳ קיבלה מצגת לקרן, אך חסרים הסכם, תנאי יציאה ופירוט עלויות. הדוגמה נפתרת ברשימת בקשות למידע ובחלוקת בירורים; אין החלטת השקעה.

## מגבלות
השאלון אינו בדיקת נאותות מלאה, הערכת סיכון או קביעה שהצעה חוקית ומתאימה. אין ספי כשירות, שיעורי מס או המלצת השקעה. מסמכים ותשובות אינם מבטיחים תשואה או מונעים הפסד.

## מקורות רשמיים
- [SEC / Investor.gov — Private Equity Funds](https://www.investor.gov/introduction-investing/investing-basics/investment-products/private-investment-funds/private-equity) — מקור רשמי אמריקאי לנושאי בדיקה בקרנות השקעה פרטיות. אינו מקור לקביעת הדין, הכשירות או המיסוי בישראל. נבדק: 2026-09-06.
- [SEC / Investor.gov — Private Placements: Investor Bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/private) — פורסם ב־17.08.2022; נבדק מחדש בתאריך המוצג. משמש למסגרת שאלות על מידע, נזילות וסיכונים, ללא אימוץ כללי ההצעה האמריקאיים. נבדק: 2026-09-06.

כאן מכינים שאלות לפגישה; בהדגמה אפשר לבחון עבודה על תיק לקוח ב־Plan-T.

[תיאום הדגמה](/contact/)
