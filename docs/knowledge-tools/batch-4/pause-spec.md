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

# מה המשמעות של הפסקת הפקדות? — מפרט עמוד אחד

נתיב: /knowledge/agents/scenario-tool/

| מזהה קלט | שדה | ברירת מחדל בדיונית | טווח | יחידה |
|---|---|---|---|---|
| balance | יתרה התחלתית | 100000 | 0–1000000000 | ₪ |
| years | תקופת החישוב בשנים | 10 | 0–100 | — |
| return | תשואה שנתית נומינלית משוערת | 4 | -99–100 | % |
| fee | דמי ניהול מצבירה, לשנה | 0.5 | 0–100 | % |
| deposit | הפקדה חודשית | 2000 | 0–1000000000 | ₪ |
| pauseStart | תחילת ההפסקה — מספר חודש | 13 | 1–1200 | — |
| pauseMonths | משך ההפסקה בחודשים | 12 | 0–1200 | — |

האופק הוא מספר שלם של חודשים, עד 1,200. הפסקה חייבת להיות בתוך האופק. יעד דורש אופק חיובי אם אינו ממומן כבר.

פלט: יתרה עם הפקדות רצופות; יתרה עם הפסקה וחידוש; הפרש ביתרות; הפקדות שלא בוצעו; גרף SVG חודשי.

הנחות: הפקדות בתחילת החודש, בסכום נומינלי קבוע, ללא דמי ניהול מהפקדה. תשואה קבועה; שיעור שנתי מומר לחודשי לפי (1 + r)^(1/12) − 1. דמי ניהול מצבירה הם שיעור שנתי חלקי 12 ונגבים אחרי התשואה. אין משיכות, אינפלציה, מס או השלמת הפקדות שהוחסרו.

הקישור מקבל את שמות השדות לעיל. קלט לא תקין בקישור מחזיר את הדוגמה עם הודעה; קלט לא תקין בטופס מסיר תוצאה קודמת. אין שמירה, דוא״ל או backend. הדפסה/שמירה כ־PDF באמצעות CSS בגודל A4.

בדיקות: P1 זהות ללא הפסקה; P2 הפרש 24,000 ל־12 הפקדות שהוחסרו; T1 הפקדה 10,000 ליעד 120,000 ב־12 חודשים ב־0%; T2 נוסחת אנונה לתחילת חודש; L1 חודש פער יחיד מתוך שישה, עם יתרות 7,000, 4,000, ‎−3,000, 12,000, 12,000, 12,000.
