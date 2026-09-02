/*
  The eight platform modules, migrated verbatim from the old site's Home
  (plan-t.org.il, section "(פלאנטי) Plan-T מודולים ב"). Source of record:
  old-site-content.md L19–36. MIGRATED — verify with Natali.

  Icons: the old site used eight PNGs on wixstatic. Their fate is decision
  N-7 (reuse PNG | redraw SVG), deferred to the next stage — so the grid ships
  as text cards with a reserved slot, and no image is invented in the meantime.
*/
export interface Module {
  name: string;
  line: string;
}

export const modules: Module[] = [
  {
    name: 'ממשקי קליטת נתונים',
    line: 'טעינת קבצים: מסלקה, הר ביטוח, בנקים, ניהול תיקים, מוצרים אלטרנטיביים ישירות למערכת',
  },
  {
    name: 'תמונה הוליסטית',
    line: 'הצגת תמונה הוליסטית של הלקוח והתא המשפחתי עד לרמת הנכס הבודד והחשיפה במונחי דלתא',
  },
  {
    name: 'כלי תכנון פיננסי',
    line: 'ניהול תזרים עתידי ומעקב אחר מטרות ויעדי הלקוח, ניתוח התיק הפנסיוני והביטוחי',
  },
  {
    name: 'CRM פנימי',
    line: 'ניהול הקשר מול הלקוחות לרבות לידים, הזדמנות מכירה, תיעוד פגישות, ארכוב מיילים אוטומטי ומסמכים, ניהול משימות ופעולות',
  },
  {
    name: 'מערכת טפסים',
    line: 'מערכת טפסים המאפשרת הפקת טפסים חכמים, חתימה מרחוק ונעילת מסמכים',
  },
  {
    name: 'דוחות ללקוח',
    line: 'מערכת הפקה ושליחת מגוון דוחות ללקוחות — דו"ח תשואה לתקופה, דו"ח פנסיוני, דו"ח תכנון פיננסי ועוד',
  },
  {
    name: 'פורטל לקוח',
    line: 'פורטל לקוח מקצועי ומעוצב לכל לקוחות הקצה של הסוכן',
  },
  {
    name: 'דוחות בקרה, רגולציה ותפעול',
    line: 'דוחות בקרה ותמיכה בתהליכי התפעול בכל הנוגע להפקת דוחות עסקיים והצפה של חריגים ומעקב אחר ביצוע פעולות',
  },
];
