/*
  Named comparisons and timelines the articles reference by key —
  {{compare:pension-vs-menahalim}}, {{timeline:policy-generations}}.

  They live here rather than in the markdown because they are tabular data with
  a fixed shape, and a hand-drawn table inside prose is the thing that goes out
  of date without anyone noticing. Every cell is the source document's own
  wording, condensed but not extended: no row states anything the document does
  not state.
*/

export interface CompareTable {
  caption?: string;
  columns: string[];
  rows: { label: string; values: string[] }[];
}

export const COMPARE: Record<string, CompareTable> = {
  /* The document's product table, which is the agents track's spine. */
  'pension-products-map': {
    caption: 'שבעת המוצרים במפת החיסכון והפנסיה, לפי נזילות, רכיב ביטוחי ומעמד מס.',
    columns: ['נזילות ותפקיד', 'ביטוח', 'מס והטבה', 'נקודת התוכן המרכזית'],
    rows: [
      {
        label: 'קרן פנסיה',
        values: [
          'חיסכון קצבתי ארוך',
          'נכות ושאירים לפי התקנון',
          'הטבות בהפקדה ובקצבה לפי דין',
          'מנגנון תקנוני ואקטוארי',
        ],
      },
      {
        label: 'ביטוח מנהלים',
        values: [
          'קופת ביטוח לקצבה',
          'כיסויים חוזיים לפי הפוליסה',
          'פנסיוני',
          'שנת הפוליסה ותנאיה קריטיים',
        ],
      },
      {
        label: 'קופת גמל לקצבה',
        values: [
          'צבירה פנסיונית, בדרך כלל ללא ביטוח מובנה',
          'לרוב אין',
          'פנסיוני',
          'הפרדה בין חיסכון לכיסוי',
        ],
      },
      {
        label: 'קרן השתלמות',
        values: [
          'חיסכון בינוני; בדרך כלל נזיל אחרי שש שנים',
          'אין',
          'הטבות עד תקרות',
          'שכיר מול עצמאי',
        ],
      },
      {
        label: 'גמל להשקעה',
        values: [
          'נזיל, עם אפשרות למסלול קצבתי מגיל 60',
          'אין',
          'דחיית מס; הטבת קצבה בתנאים',
          'קיימת תקרת הפקדה שנתית',
        ],
      },
      {
        label: 'פוליסת חיסכון',
        values: [
          'חיסכון נזיל במסלולי חברת ביטוח',
          'בדרך כלל לא כיסוי סיכון מהותי',
          'מס בעת מימוש',
          'אין כיום ניוד רוחבי מלא בין יצרנים ללא בחינת מס',
        ],
      },
      {
        label: 'תיקון 190',
        values: [
          'שימוש בקופת גמל לקצבה לכספים שכבר מוסו',
          'אין כשלעצמו',
          '15% נומינלי בהיוון קצבה מוכרת, בתנאים',
          'הסדר מס, לא מוצר עצמאי',
        ],
      },
    ],
  },

  /*
    Comprehensive against general. The document states the mechanism —
    regulations and actuarial balance against a contract — and the coverage
    difference; it does not rank them, and neither does this.
  */
  'pension-fund-types': {
    caption: 'שני סוגי קרן הפנסיה, לפי המנגנון שמאחוריהם.',
    columns: ['קרן פנסיה מקיפה', 'קרן פנסיה כללית'],
    rows: [
      {
        label: 'מה מגדיר את הזכויות',
        values: ['תקנון הקרן, המשתנה לפי דין ולפי מצב אקטוארי', 'תקנון הקרן, ללא רכיבי הכיסוי המובְנים'],
      },
      {
        label: 'רכיב ביטוחי',
        values: ['כיסויי נכות ושאירים לפי התקנון', 'ככלל אין כיסוי מובנה'],
      },
      {
        label: 'תפקיד בתיק',
        values: ['שכבת הפרישה הארוכה', 'שכבת חיסכון קצבתי משלימה'],
      },
      {
        label: 'מה משתנה בין חוסכים',
        values: ['מסלול ההשקעה, דמי הניהול והכיסויים בפועל', 'מסלול ההשקעה ודמי הניהול'],
      },
    ],
  },

  /* The two regimes the document names for an individual's capital gains. */
  'capital-gains': {
    caption: 'שני שיעורי המס שהמסמך מבחין ביניהם ליחיד, ככלל.',
    columns: ['רווח הון ריאלי', 'הכנסה נומינלית לא-צמודה'],
    rows: [
      { label: 'השיעור', values: ['25%', '15%'] },
      { label: 'הבסיס', values: ['הרווח בניכוי אינפלציה', 'הרווח הנומינלי'] },
      {
        label: 'מה עשוי לשנות את התוצאה',
        values: [
          'נסיבות אישיות, מעמד בעל שליטה, פעילות עסקית ומס יסף',
          'אותם גורמים, לצד סיווג הנכס',
        ],
      },
    ],
  },
};

export interface TimelineTable {
  items: { label: string; title: string; body: string }[];
}

export const TIMELINE: Record<string, TimelineTable> = {
  /*
    Policy generations. The document gives one dated fact — the September 2023
    restriction — and one structural rule: that older policies may carry terms
    that newer products do not, so a comparison by product name says nothing.
    The entries below say exactly that and no more; there is no list of
    generation years here, because the document does not contain one.
  */
  'policy-generations': {
    items: [
      {
        label: 'הכלל',
        title: 'שנת הפוליסה היא תנאי, לא פרט',
        body: 'בביטוח מנהלים אין להשוות פוליסות לפי שם המוצר. תנאיהן של פוליסות ותיקות עשויים להיות שונים מהותית מתנאיהם של מוצרים חדשים, ולכן ההשוואה היא בין מסמכי הפוליסה עצמם.',
      },
      {
        label: 'ספטמבר 2023',
        title: 'הגבלת ההצטרפות החדשה',
        body: 'מאז ספטמבר 2023 הוגבלה הצטרפות חדשה לביטוח מנהלים לחלק השכר שמעל פעמיים השכר הממוצע, בכפוף לתקנות ולחריגים הרלוונטיים.',
      },
      {
        label: 'בכל בדיקה',
        title: 'מה נקרא בפועל',
        body: 'הכיסויים בביטוח מנהלים הם חוזיים ונקבעים בפוליסה, בשונה מקרן פנסיה שבה הם נקבעים בתקנון. זו ההבחנה שמכתיבה מה בכלל אפשר להשוות בין השניים.',
      },
    ],
  },
};
