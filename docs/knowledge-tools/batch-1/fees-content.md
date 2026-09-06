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

# דמי ניהול בתוך התוכנית

בעלים: נטלי · עודכן: 2026-09-06

טיוטה — ממתינה לאישור שורה־שורה של נטלי.

## השאלה
איך שני מבני דמי ניהול משנים את החיסכון לאורך זמן?

## הסבר
משווים שני תרחישים עם אותה יתרה, אותה הפקדה ואותה תשואה משוערת. כך אפשר לבודד את השפעת העלויות, ואז להחזיר את התוצאה לשיחה על מטרות הלקוח ועל תנאי המוצר.

## הדוגמה
דוגמה בדיונית: יתרה התחלתית של 300,000 ₪, הפקדה חודשית של 2,000 ₪, תקופה של 30 שנה ותשואה שנתית נומינלית משוערת של 4%. בתרחיש א׳: 1% מההפקדה ו־0.6% לשנה מהצבירה. בתרחיש ב׳: 0% מההפקדה ו־0.4% לשנה מהצבירה. אלו הנחות להמחשה, לא הצעות מסחריות.

| מדד | תוצאה |
|---|---|
| יתרה בסוף התקופה — תרחיש א׳ | 2,036,744.02 ₪ |
| יתרה בסוף התקופה — תרחיש ב׳ | 2,143,607.64 ₪ |
| סך דמי הניהול — א׳ | 192,491.85 ₪ |
| סך דמי הניהול — ב׳ | 127,839.99 ₪ |
| הפרש ביתרה: ב׳ פחות א׳ | 106,863.61 ₪ |
| ההפרש כאחוז מיתרת א׳ | 5.25 % |

[פתיחת נתוני הדוגמה](/knowledge/agents/fees/?balance=300000&deposit=2000&years=30&return=4&depositFeeA=1&feeA=0.6&depositFeeB=0&feeB=0.4)

## שימוש בפגישה
1. פותחים בהגדרת המטרה והתקופה: לאיזה שימוש מיועד הכסף ומתי צפוי צורך בו.
2. מעתיקים את שני רכיבי דמי הניהול מהצעות כתובות ומשאירים את יתר ההנחות זהות.
3. מציגים גם את סך החיובים וגם את ההפרש ביתרה. אלה שני מספרים שונים.
4. משנים את התשואה ואת התקופה ובודקים אם ההפרש נשאר רלוונטי להחלטה.

## מה להכין
- יתרה עדכנית ותאריך הדוח
- הפקדה חודשית צפויה
- שתי הצעות עם דמי ניהול מהפקדה ומצבירה, ותוקף ההטבה

## מה לשאול
- האם ההפקדות צפויות להשתנות?
- אילו כיסויים, תנאי משיכה או מאפייני שירות שונים בין החלופות?
- האם דמי הניהול שהוזנו חלים לאורך כל התקופה?

## גבולות התוצאה
אין כאן השוואת כיסוי ביטוחי, מס, הוצאות אחרות או התאמת מוצר. התשואה קבועה וזהה בין התרחישים. דמי הניהול נגבים לפי מוסכמת החישוב המוצגת, שעשויה להיות שונה מהחיוב בפועל.

כאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.

[תיאום הדגמה](/contact/)
