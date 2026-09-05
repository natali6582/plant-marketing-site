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
    caption: 'שני סוגי קרן הפנסיה, לפי מה שכל אחת מהן קולטת ומבטיחה.',
    columns: ['קרן פנסיה מקיפה', 'קרן פנסיה כללית ("משלימה")'],
    rows: [
      {
        label: 'תפקיד',
        values: ['ברירת המחדל לרוב החוסכים', 'קולטת הפקדות מעל התקרה של המקיפה'],
      },
      {
        label: 'ערבות הדדית',
        values: ['כן', 'לא'],
      },
      {
        label: 'רכיב ביטוחי',
        values: ['כיסוי לשארים ולאובדן כושר עבודה', 'ככלל אין כיסוי מובנה'],
      },
      {
        label: 'הבטחת תשואה',
        values: ['מנגנון הבטחת תשואה על חלק מהנכסים', 'ללא הבטחת תשואה'],
      },
      {
        label: 'תקרת הפקדה',
        values: ['ההפקדה מוגבלת בתקרה חודשית', 'שכר קובע חודשי גבוה יותר'],
      },
    ],
  },

  /* The two regimes the document names for an individual's capital gains. */
  'capital-gains': {
    caption: 'שני השיעורים שסעיף 91 לפקודה קובע ליחיד. שניהם תקרות, לא שיעורים קבועים.',
    columns: ['רווח הון ריאלי', 'איגרת חוב או הלוואה שאינן צמודות למדד'],
    rows: [
      { label: 'השיעור', values: ['לא יעלה על 25%', 'לא יעלה על 15%'] },
      { label: 'הבסיס', values: ['הרווח בניכוי אינפלציה', 'הרווח הנומינלי'] },
      { label: 'בעל מניות מהותי', values: ['30%', '20%'] },
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
    Policy generations. Written first as a single structural note, because the
    docx has no list of generations; the HTML previews Natali supplied on 04/09
    do, and this is theirs. Four generations, each defined by what the contract
    guarantees — which is the point: the guarantee, not the product name, is
    what a comparison is between.
  */
  'policy-generations': {
    items: [
      {
        label: 'עד 1990',
        title: 'פוליסות קלאסיות',
        body: 'מרכיב חיסכון נמוך, ללא הבטחת תשואה וללא השתתפות ברווחים.',
      },
      {
        label: 'עד 2004',
        title: 'פוליסות ״עדיף״',
        body: 'מסלול יסוד, כפולות משכורת ומסלול צמוד מדד. פוליסות משתתפות ברווחים, עם אפשרות להשתתף בתשואות שוק ההון.',
      },
      {
        label: '2004 עד 2013',
        title: 'מקדם קצבה מובטח',
        body: 'פוליסות עם מקדם המרה לקצבה שנקבע כבר ברכישה.',
      },
      {
        label: 'מ-2013 ואילך',
        title: 'ללא מקדם מובטח',
        body: 'מקדמי ההמרה אינם קבועים, ובעת ההמרה לקצבה הם מחושבים לפי תוחלת חיים וריבית תעריפית עדכניים.',
      },
    ],
  },
};
