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

# כמה צריך להפקיד כדי להגיע ליעד?

איזו הפקדה חודשית תואמת את היעד תחת ההנחות שנבחרו?

מגדירים יעד נומינלי, יתרה התחלתית ואופק. המנוע מחשב הפקדה קבועה לתחילת כל חודש, ומשווה בין שתי הנחות תשואה. זו תשובה חשבונאית להנחות, לפני בדיקת יכולת ההפקדה והתאמת התוכנית.

## הנחות גלויות
תשואה קבועה בכל תרחיש; שיעור שנתי מומר לחודשי לפי (1 + r)^(1/12) − 1. דמי ניהול מצבירה נגבים אחרי התשואה בשיעור שנתי חלקי 12. היעד וההפקדות נומינליים; אין אינפלציה, מס, דמי ניהול מהפקדה או משיכות. ההפקדה מחושבת במנוע החודשי, מעוגלת כלפי מעלה לאגורה, ואז מורצת שוב להצגת היתרה.

## דוגמה פתורה
מקרה בדיוני להמחשה: יעד של 1,000,000 ₪ בעוד 15 שנים ויתרה התחלתית של 50,000 ₪. משווים תשואה שנתית משוערת של 4% לעומת 2%, עם דמי ניהול מצבירה של 0.5% לשנה בשני התרחישים. ההפקדה נכנסת בתחילת כל חודש.

- הפקדה חודשית נדרשת — תרחיש א׳: 3,890.50 ₪
- הפקדה חודשית נדרשת — תרחיש ב׳: 4,649.01 ₪
- יתרה סופית — תרחיש א׳: 1,000,002.23 ₪
- יתרה סופית — תרחיש ב׳: 1,000,001.35 ₪

[פתיחת הדוגמה](/knowledge/planners/scenario-tool/?balance=50000&years=15&return=4&fee=0.5&target=1000000&returnB=2)

## שימוש בפגישה
1. נסחו עם הלקוח למה מיועד היעד ומתי הכסף נדרש. הבהירו שהסכום כאן נומינלי.
2. הציגו את שתי ההפקדות הנדרשות לצד ההנחות שלהן, בלי לתאר אחת מהתשואות כצפויה.
3. בדקו אם ההפקדה אפשרית בתקציב; המחשבון אינו מאמת הכנסה או יכולת התמדה.
4. בחנו שינוי באופק, ביעד או בהנחות ותעדו מה השתנה בכל חלופה.

## רשימת בדיקה
- להכין יעד, מועד ויתרה המיועדת דווקא למטרה זו.
- לברר אם היעד הוא בשקלים עתידיים או בכוח קנייה של היום.
- לבדוק תקציב פנוי והתחייבויות לפני קביעת הפקדה.

## מגבלות
אין התאמה לאינפלציה, מס, סיכון, תנודתיות או התאמת מוצר. תוצאה של אפס הפקדה מתייחסת להנחות בסוף האופק ואינה קביעה שהלקוח אינו צריך לחסוך. באופק אפס, יעד שאינו ממומן אינו ניתן להשגה באמצעות הפקדה עתידית.

כאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.

[תיאום הדגמה](/contact/)
