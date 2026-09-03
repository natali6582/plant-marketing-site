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
  /** Lucide icon name; must exist in src/data/lucide-icons.ts. */
  icon: string;
}

export const modules: Module[] = [
  {
    name: 'ממשקי קליטת נתונים',
    line: 'טעינת קבצים: מסלקה, הר ביטוח, בנקים, ניהול תיקים, מוצרים אלטרנטיביים ישירות למערכת',
    icon: 'download',
  },
  {
    name: 'תמונה הוליסטית',
    line: 'הצגת תמונה הוליסטית של הלקוח והתא המשפחתי עד לרמת הנכס הבודד והחשיפה במונחי דלתא',
    icon: 'pie-chart',
  },
  {
    name: 'כלי תכנון פיננסי',
    line: 'ניהול תזרים עתידי ומעקב אחר מטרות ויעדי הלקוח, ניתוח התיק הפנסיוני והביטוחי',
    icon: 'calculator',
  },
  {
    name: 'CRM פנימי',
    line: 'ניהול הקשר מול הלקוחות לרבות לידים, הזדמנות מכירה, תיעוד פגישות, ארכוב מיילים אוטומטי ומסמכים, ניהול משימות ופעולות',
    icon: 'users',
  },
  {
    name: 'מערכת טפסים',
    line: 'מערכת טפסים המאפשרת הפקת טפסים חכמים, חתימה מרחוק ונעילת מסמכים',
    icon: 'file-signature',
  },
  {
    name: 'דוחות ללקוח',
    line: 'מערכת הפקה ושליחת מגוון דוחות ללקוחות — דו"ח תשואה לתקופה, דו"ח פנסיוני, דו"ח תכנון פיננסי ועוד',
    icon: 'file-bar-chart',
  },
  {
    name: 'פורטל לקוח',
    line: 'פורטל לקוח מקצועי ומעוצב לכל לקוחות הקצה של הסוכן',
    icon: 'monitor-smartphone',
  },
  {
    name: 'דוחות בקרה, רגולציה ותפעול',
    line: 'דוחות בקרה ותמיכה בתהליכי התפעול בכל הנוגע להפקת דוחות עסקיים והצפה של חריגים ומעקב אחר ביצוע פעולות',
    icon: 'clipboard-check',
  },
];
