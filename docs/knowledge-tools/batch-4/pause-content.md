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

# מה המשמעות של הפסקת הפקדות?

איך הפסקה וחידוש של הפקדות משנים את החיסכון?

משווים חיסכון עם הפקדות רצופות לחיסכון שבו מפסיקים להפקיד לתקופה מוגדרת ואז חוזרים לאותו סכום. ההפרש נובע מההפקדות שלא בוצעו ומהשפעתן על התשואה והעלויות במודל.

## הנחות גלויות
הפקדות בתחילת החודש, בסכום נומינלי קבוע, ללא דמי ניהול מהפקדה. תשואה קבועה; שיעור שנתי מומר לחודשי לפי (1 + r)^(1/12) − 1. דמי ניהול מצבירה הם שיעור שנתי חלקי 12 ונגבים אחרי התשואה. אין משיכות, אינפלציה, מס או השלמת הפקדות שהוחסרו.

## דוגמה פתורה
מקרה בדיוני להמחשה: מתחילים ב־100,000 ₪ ומפקידים 2,000 ₪ בחודש לאורך 10 שנים. ההפסקה היא בחודשים 13–24, ואחריה חוזרים להפקיד. תשואה שנתית משוערת 4% ודמי ניהול מצבירה 0.5% לשנה. אין השלמה של ההפקדות שהוחסרו.

- יתרה עם הפקדות רצופות: 427,389.28 ₪
- יתרה עם הפסקה וחידוש: 395,239.83 ₪
- הפרש ביתרות: 32,149.45 ₪
- הפקדות שלא בוצעו: 24,000.00 ₪

[פתיחת הדוגמה](/knowledge/agents/scenario-tool/?balance=100000&years=10&return=4&fee=0.5&deposit=2000&pauseStart=13&pauseMonths=12)

## שימוש בפגישה
1. הגדירו עם הלקוח את חודש תחילת ההפסקה ואת משכה, ולא רק את סיבת ההפסקה.
2. השוו תחילה את סכום ההפקדות שלא בוצעו, ואז את פער היתרות בסוף האופק.
3. פתחו תרחיש עם תשואה אפסית כדי לבדוק את החשבון, והחזירו הנחה שנבחרה במפורש לצורך השיחה.
4. בדקו בנפרד את המשמעות הביטוחית ואת תנאי המוצר לפני פעולה.

## רשימת בדיקה
- להכין יתרה, סכום הפקדה ומועדי הפסקה וחידוש מדויקים.
- לברר אם החידוש באותו סכום ואם מתוכננת השלמה חד־פעמית שאינה במודל.
- להפנות שאלות על רצף כיסוי, זכויות ותנאי מוצר לבדיקה נפרדת.

## מגבלות
חיסכון בלבד. השפעות ביטוחיות, רצף כיסוי, זכויות והטבות מס אינן נבדקות בכלי. תשואה קבועה אינה תחזית או בדיקה של תנודתיות.

כאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.

[תיאום הדגמה](/contact/)
