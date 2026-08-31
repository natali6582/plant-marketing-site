/*
  The three roles the platform is sold to. Single-sourced because the content
  now renders in two places — the /solutions/ page and the persona tabs on the
  home page — and the two must never drift apart. Copy is unchanged from the
  original /solutions/ page.
*/
export interface Role {
  id: string;
  title: string;
  intro: string;
  points: string[];
}

export const roles: Role[] = [
  {
    id: 'advisors',
    title: 'ליועצים פיננסיים',
    intro:
      'הלקוח מגיע עם שאלה אחת — ומאחוריה תיק שלם. Plan-T מרכז את התמונה כדי שתענו ממקום מבוסס.',
    points: [
      'תמונת תיק אחת: השקעות, חיסכון וכיסויים במקום אחד.',
      'הכנה לפגישה בדקות במקום בשעות.',
      'דוח מסודר ללקוח בסוף התהליך, ממותג במיתוג המשרד.',
    ],
  },
  {
    id: 'agents',
    title: 'לסוכני ביטוח',
    intro:
      'פחות ניירת, יותר לקוחות. המערכת מסדרת את התהליכים החוזרים ומשאירה לכם את שיחות המכירה והשירות.',
    points: [
      'מעקב אחרי מסמכים, חידושים ומשימות פתוחות.',
      'איתור פערי כיסוי וכפילויות בתיק.',
      'היסטוריית פניות מרוכזת לפני כל שיחת שירות.',
    ],
  },
  {
    id: 'pension',
    title: 'ליועצים פנסיוניים',
    intro:
      'נתוני מסלקה, יצרנים וגיליונות — במקום אחד, בפורמט שאפשר לעבוד איתו.',
    points: [
      'ריכוז נתוני המסלקה לצד שאר המידע בתיק.',
      'השוואה ברורה בין חלופות להצגה מול הלקוח.',
      'תיעוד מלא של התהליך לצורכי רגולציה ובקרה.',
    ],
  },
];
