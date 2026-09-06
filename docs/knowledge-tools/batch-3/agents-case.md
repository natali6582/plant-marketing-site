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

# שתי הצעות עם דמי ניהול שונים — מה עוד צריך לבדוק?

**מקרה בדיוני להמחשה**

איך מציגים פער בדמי ניהול כחלק מהתוכנית?

משווים עלויות תחת הנחות זהות, ואז חוזרים לשאלות שהחשבון אינו פותר: התאמה לצרכים, מסלול, תנאי המוצר ושירות. פער ביתרה אינו מסקנה על איזו הצעה מתאימה ללקוח.

## מצב התחלתי
משפחת א׳ מבקשת להשוות שתי הצעות לחיסכון. בדוגמה יש יתרה התחלתית של 300,000 ₪ והפקדה חודשית של 2,000 ₪ למשך 30 שנים. בהצעה א׳: 1% מההפקדה ו־0.6% לשנה מהצבירה; בהצעה ב׳: ללא דמי ניהול מהפקדה ו־0.4% לשנה מהצבירה. אלה מספרים בדיוניים, ללא גוף מנהל או מוצר אמיתי.

## מידע חסר
- האם ההצעות מתייחסות לאותו סוג מוצר ולתנאים שאפשר להשוות?
- מהם המסלול, הכיסוי אם יש, מגבלות הנזילות ותנאי השירות בכל הצעה?
- האם שיעורי העלויות מוגבלים בזמן, והאם קיימות עלויות נוספות שאינן כלולות בחישוב?
- מהן מטרות המשפחה, ומה צפוי להשתנות בהפקדות או במועד השימוש בכסף?

## חלופות ודוגמה מחושבת
### השוואה בסיסית — אותה תשואה בשתי ההצעות

- יתרה התחלתית: 300,000.00 ₪
- הפקדה חודשית: 2,000.00 ₪
- תקופת החישוב: 30.00 שנים
- תשואה שנתית נומינלית משוערת: 4.00 %
- תרחיש א׳ — דמי ניהול מהפקדה: 1.00 %
- תרחיש א׳ — דמי ניהול מצבירה, לשנה: 0.60 %
- תרחיש ב׳ — דמי ניהול מהפקדה: 0.00 %
- תרחיש ב׳ — דמי ניהול מצבירה, לשנה: 0.40 %

[פתיחה במחשבון עם הנתונים](/knowledge/agents/fees/?balance=300000&deposit=2000&years=30&return=4&depositFeeA=1&feeA=0.6&depositFeeB=0&feeB=0.4)

- יתרה בסוף התקופה — תרחיש א׳: 2,036,744.02 ₪
- יתרה בסוף התקופה — תרחיש ב׳: 2,143,607.64 ₪
- סך דמי הניהול — א׳: 192,491.85 ₪
- סך דמי הניהול — ב׳: 127,839.99 ₪
- הפרש ביתרה: ב׳ פחות א׳: 106,863.61 ₪
- ההפרש כאחוז מיתרת א׳: 5.25 %

התוצאה מבודדת את ההבדל בדמי הניהול שהוזנו. שתי ההצעות מקבלות כאן אותה תשואה קבועה; אין בכך טענה שכך יקרה במציאות.

### רגישות — ללא תשואה

- יתרה התחלתית: 300,000.00 ₪
- הפקדה חודשית: 2,000.00 ₪
- תקופת החישוב: 30.00 שנים
- תשואה שנתית נומינלית משוערת: 0.00 %
- תרחיש א׳ — דמי ניהול מהפקדה: 1.00 %
- תרחיש א׳ — דמי ניהול מצבירה, לשנה: 0.60 %
- תרחיש ב׳ — דמי ניהול מהפקדה: 0.00 %
- תרחיש ב׳ — דמי ניהול מצבירה, לשנה: 0.40 %

[פתיחה במחשבון עם הנתונים](/knowledge/agents/fees/?balance=300000&deposit=2000&years=30&return=0&depositFeeA=1&feeA=0.6&depositFeeB=0&feeB=0.4)

- יתרה בסוף התקופה — תרחיש א׳: 902,722.40 ₪
- יתרה בסוף התקופה — תרחיש ב׳: 944,428.45 ₪
- סך דמי הניהול — א׳: 117,277.60 ₪
- סך דמי הניהול — ב׳: 75,571.55 ₪
- הפרש ביתרה: ב׳ פחות א׳: 41,706.05 ₪
- ההפרש כאחוז מיתרת א׳: 4.62 %

מבטלים את צמיחת ההשקעה ובודקים מחדש את פער היתרות. גם כאן עלויות הן רק חלק מתנאי ההחלטה.

### רגישות — תשואה שנתית שלילית

- יתרה התחלתית: 300,000.00 ₪
- הפקדה חודשית: 2,000.00 ₪
- תקופת החישוב: 30.00 שנים
- תשואה שנתית נומינלית משוערת: -2.00 %
- תרחיש א׳ — דמי ניהול מהפקדה: 1.00 %
- תרחיש א׳ — דמי ניהול מצבירה, לשנה: 0.60 %
- תרחיש ב׳ — דמי ניהול מהפקדה: 0.00 %
- תרחיש ב׳ — דמי ניהול מצבירה, לשנה: 0.40 %

[פתיחה במחשבון עם הנתונים](/knowledge/agents/fees/?balance=300000&deposit=2000&years=30&return=-2&depositFeeA=1&feeA=0.6&depositFeeB=0&feeB=0.4)

- יתרה בסוף התקופה — תרחיש א׳: 629,758.30 ₪
- יתרה בסוף התקופה — תרחיש ב׳: 656,492.35 ₪
- סך דמי הניהול — א׳: 94,853.49 ₪
- סך דמי הניהול — ב׳: 60,034.98 ₪
- הפרש ביתרה: ב׳ פחות א׳: 26,734.05 ₪
- ההפרש כאחוז מיתרת א׳: 4.25 %

תשואה שלילית קבועה היא תרחיש בדיקה בלבד. הכלי אינו מודל לסיכון, לתנודתיות או להסתברות הפסד.

## רגישות להנחות
משנים תחילה רק את הנחת התשואה, תוך שמירה על יתר הנתונים. אפשר לפתוח כל קישור ולבחון גם תקופה קצרה יותר. השינוי בפער הכספי אינו מצדיק לבדו מעבר בין מוצרים. המספר של סך דמי הניהול מציג חיובים בפועל במודל; פער היתרות כולל גם את השפעתם המצטברת על הצמיחה.

## שאלות לפגישה
- איזה צורך של המשפחה כל הצעה נועדה לשרת?
- אילו תנאים עדיין חסרים להשוואה, ומי יבדוק אותם?
- האם העלויות שהוזנו הן כל העלויות הרלוונטיות ובאותה תקופה?
- מה יגרום למשפחה לשנות את ההפקדה, המסלול או מועד השימוש בכסף?

## מגבלות
אין בחישוב מס, כיסוי ביטוחי, עלויות נוספות, תנודתיות או הבדלי מסלולים. הוא אינו מדרג מוצרים ואינו נותן המלצת ניוד. אין כאן הנחת תשואה מומלצת או הבטחה לתוצאה.

כאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.

[תיאום הדגמה](/contact/)
