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

# לוח נזילות והתחייבויות

באילו חודשים חסר מזומן מול התשלומים המתוכננים?

מזינים מזומן זמין ותקבולים ותשלומים לכל חודש, באותו מטבע. הלוח מציג יתרות ופערים בלי להניח תשואה, מימוש השקעה או קבלת אשראי.

## הנחות גלויות
חשבון חודשי בלבד: יתרת פתיחה + תקבולים − תשלומים = יתרת סגירה. כל הסכומים בשקלים, ללא המרת מטבע, תשואה, ריבית, אינפלציה, מס או עמלות מחושבים. עלויות ידועות אפשר להזין כתשלומים. יתרה שלילית נגררת ואינה מקור אשראי. הבדיקה היא בסוף כל חודש ואינה מזהה בהכרח פער בתוך החודש. תזמון התקבולים הוא הנחת המשתמש.

## דוגמה פתורה
מקרה בדיוני להמחשה: מתחילים ב־10,000 ₪ ובוחנים שישה חודשים. התקבולים הם 5,000 ₪ בכל חודש, למעט 20,000 ₪ בחודש הרביעי. התשלומים הם 8,000 ₪ בכל אחד מהחודשיים הראשונים, 12,000 ₪ בחודש השלישי ו־5,000 ₪ בכל אחד משלושת החודשים האחרונים. הטבלה להלן מחושבת במנוע.

- יתרה בסוף הלוח: 12,000.00 ₪
- פער המזומן המרבי: 3,000.00 ₪
- חודשים עם פער בסוף החודש: 3 

[פתיחת הדוגמה](/knowledge/wealth/scenario-tool/?balance=10000&months=6&flows=%5B%5B5000%2C8000%5D%2C%5B5000%2C8000%5D%2C%5B5000%2C12000%5D%2C%5B20000%2C5000%5D%2C%5B5000%2C5000%5D%2C%5B5000%2C5000%5D%5D)

## שימוש בפגישה
1. הכניסו רק סכום זמין שאינו מיועד כבר לתשלום מחוץ ללוח.
2. רשמו את המקור ואת מידת הוודאות לכל תקבול לפני הזנתו. נכס אינו תקבול עד שיש הנחת מימוש מפורשת.
3. אתרו חודשים עם פער והציגו גם את החודשים שלאחריהם: פער לא נעלם בלי מקור מימון.
4. בדקו בנפרד מועדי יום, מטבע, תנאי פדיון והתחייבויות שלא נכללו.

## רשימת בדיקה
- להכין מועדי תשלום ותקבול, מטבע ומסמך תומך.
- לברר אילו תקבולים מותנים ואילו התחייבויות אינן ניתנות לדחייה.
- לבחון תרחיש עיכוב בתקבול, בלי להניח מימון חיצוני.

## מגבלות
הלוח אינו הערכת שווי, בדיקת יכולת פירעון או התחייבות של גורם להעביר כסף. אין חישוב של תשואה או עלות אשראי. יתרה חיובית בסוף חודש אינה מבטיחה שלא היה פער בתוכו. סכומים במטבע אחר יש לבדוק בנפרד.

כאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.

[תיאום הדגמה](/contact/)
