/*
  The eight platform modules, migrated verbatim from the old site's Home
  (plan-t.org.il, section "(פלאנטי) Plan-T מודולים ב"). Source of record:
  old-site-content.md L19–36. MIGRATED — verify with Natali.

  Icons: the old site used eight PNGs on wixstatic. Decision N-7 (reuse PNG |
  redraw SVG) is still open, and this is neither — the reserved slot now holds a
  Lucide icon from the site-wide set, which is a placeholder no one has to
  apologise for. Swapping in the real artwork later means changing one name.
*/
export interface Module {
  name: string;
  line: string;
  /** Duotone icon key; must exist in src/data/icons-duotone.ts. */
  icon: string;
}

export const modules: Module[] = [
  {
    name: 'ממשקי קליטת נתונים',
    line: 'טעינת קבצים: מסלקה, הר ביטוח, בנקים, ניהול תיקים, מוצרים אלטרנטיביים ישירות למערכת',
    icon: 'data-intake',
  },
  {
    name: 'תמונה הוליסטית',
    line: 'הצגת תמונה הוליסטית של הלקוח והתא המשפחתי עד לרמת הנכס הבודד והחשיפה במונחי דלתא',
    icon: 'holistic-view',
  },
  {
    name: 'כלי תכנון פיננסי',
    line: 'ניהול תזרים עתידי ומעקב אחר מטרות ויעדי הלקוח, ניתוח התיק הפנסיוני והביטוחי',
    icon: 'planning-tools',
  },
  {
    name: 'CRM פנימי',
    line: 'ניהול הקשר מול הלקוחות לרבות לידים, הזדמנות מכירה, תיעוד פגישות, ארכוב מיילים אוטומטי ומסמכים, ניהול משימות ופעולות',
    icon: 'crm',
  },
  {
    name: 'מערכת טפסים',
    line: 'מערכת טפסים המאפשרת הפקת טפסים חכמים, חתימה מרחוק ונעילת מסמכים',
    icon: 'forms',
  },
  {
    name: 'דוחות ללקוח',
    line: 'מערכת הפקה ושליחת מגוון דוחות ללקוחות — דו"ח תשואה לתקופה, דו"ח פנסיוני, דו"ח תכנון פיננסי ועוד',
    icon: 'client-reports',
  },
  {
    name: 'פורטל לקוח',
    line: 'פורטל לקוח מקצועי ומעוצב לכל לקוחות הקצה של הסוכן',
    icon: 'client-portal',
  },
  {
    name: 'דוחות בקרה, רגולציה ותפעול',
    line: 'דוחות בקרה ותמיכה בתהליכי התפעול בכל הנוגע להפקת דוחות עסקיים והצפה של חריגים ומעקב אחר ביצוע פעולות',
    icon: 'compliance',
  },
];
