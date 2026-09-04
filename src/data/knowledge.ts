import type { Layer } from '../components/knowledge/Layers.astro';

/*
  Track and diagram definitions for the knowledge hub.

  The article bodies are markdown that Natali can edit; these are the structures
  the site draws around them, and they live in code because they are layout, not
  copy she would reword.
*/

export type Track = 'shared' | 'agents' | 'planners' | 'wealth';

export interface TrackMeta {
  slug: Exclude<Track, 'shared'>;
  name: string;
  title: string;
  lead: string;
  /* The audience page this track's articles close by linking to, and the value
     the lead form reports. */
  audiencePath: string;
  audienceKey: string;
  icon: string;
  /* Which layers of the planning stack this track's emphasis falls on, used to
     highlight rows in the shared "how it fits" list. */
  emphasis: number[];
}

export const TRACKS: TrackMeta[] = [
  {
    slug: 'agents',
    name: 'סוכני ביטוח',
    title: 'מרכז ידע לסוכני ביטוח',
    lead: 'פנסיה וחיסכון: איך המוצרים בנויים, מה מבדיל ביניהם, ואיפה הכללים והתקרות נקבעים.',
    audiencePath: '/agents/',
    audienceKey: 'agents',
    icon: 'piggy-bank',
    emphasis: [2, 3],
  },
  {
    slug: 'planners',
    name: 'מתכננים פיננסיים',
    title: 'מרכז ידע למתכננים פיננסיים',
    lead: 'שוק ההון: נכסים סחירים, קרנות, נגזרים ומוצרים מובנים — מה מייצר את החשיפה ואיך היא נארזת.',
    audiencePath: '/planners/',
    audienceKey: 'planners',
    icon: 'chart-line-up',
    emphasis: [3, 4],
  },
  {
    slug: 'wealth',
    name: 'מנהלי עושר',
    title: 'מרכז ידע למנהלי עושר',
    lead: 'מפת הנכסים המורחבת: נדל״ן, קרנות פרטיות, בדיקת נאותות ומיסוי חוצה גבולות.',
    audiencePath: '/wealth/',
    audienceKey: 'wealth',
    icon: 'buildings',
    emphasis: [5, 6],
  },
];

export const trackBySlug = (slug: string) => TRACKS.find((t) => t.slug === slug);

/*
  The four layers. This is the document's own opening table, and it is the
  thesis of the whole section: the same economic exposure can sit in five
  different wrappers, and the wrapper decides liquidity, tax, cost, supervision
  and inheritance — not the exposure.

  The document's table has five rows, not four: it separates a private
  investment structure from an insurance product. The hub shows all five and
  calls the section "the shared concept map", because dropping a row to make
  the count round would lose a category that the wealth track is built on.
*/
export const CONCEPT_LAYERS: Layer[] = [
  {
    title: 'נכס בסיס',
    body: 'המקור הכלכלי של הסיכון והתשואה.',
    examples: ['מניה', 'אג״ח', 'נדל״ן', 'ריבית', 'מטבע', 'סחורה'],
    question: 'מה יוצר רווח או הפסד?',
    icon: 'chart-line-up',
  },
  {
    title: 'מכשיר פיננסי',
    body: 'זכות חוזית או נייר ערך המעביר חשיפה.',
    examples: ['אופציה', 'קרן נאמנות', 'קרן סל', 'מוצר מובנה'],
    question: 'כיצד החשיפה נארזה?',
    icon: 'puzzle',
  },
  {
    title: 'מעטפת חיסכון או השקעה',
    body: 'מסגרת משפטית, מיסויית ותפעולית.',
    examples: ['קופת גמל', 'קרן השתלמות', 'גמל להשקעה', 'פוליסת חיסכון'],
    question: 'מהם כללי ההפקדה, המעבר והמשיכה?',
    icon: 'piggy-bank',
  },
  {
    title: 'מוצר ביטוחי',
    body: 'העברת סיכון למבטח, לעיתים לצד חיסכון.',
    examples: ['ביטוח מנהלים', 'אובדן כושר עבודה', 'ביטוח חיים'],
    question: 'איזה סיכון אנושי מכוסה?',
    icon: 'shield-check',
  },
  {
    title: 'מבנה השקעה פרטי',
    body: 'ישות המחזיקה ומשקיעה הון של משקיעים.',
    examples: ['שותפות מוגבלת', 'SPV', 'קרן PE, VC, חוב או נדל״ן'],
    question: 'מי שולט, מי שומר, ומתי אפשר לצאת?',
    icon: 'bank',
  },
];

/*
  The planning stack from the document's integration chapter.

  Seven entries, not six. The document lists inheritance as its own line —
  "מוטבים, צוואה, הסכמי שותפות ומיסוי אינם תחליפים זה לזה" — and it is the one
  layer that cuts across all the others, so it stays.

  These are described, never recommended: the chapter's own title is
  "עקרונות, לא הקצאה מומלצת", and nothing here tells a reader what to hold.
*/
export const PLANNING_LAYERS: Layer[] = [
  {
    title: 'נזילות וחירום',
    body: 'מזומן, פיקדונות, מק״מ או קרנות כספיות. המטרה היא זמינות, לא מקסום תשואה.',
    icon: 'fast-prep',
  },
  {
    title: 'טווח בינוני',
    body: 'קרן השתלמות נזילה, גמל להשקעה, פוליסת חיסכון או תיק סחיר — מול תאריך היעד והמס.',
    icon: 'piggy-bank',
  },
  {
    title: 'פרישה ארוכה',
    body: 'קרן פנסיה, קופת גמל וביטוח מנהלים. נבחנים קצבה, כיסויים, מוטבים ודמי ניהול.',
    icon: 'hourglass',
  },
  {
    title: 'שוק הון',
    body: 'מניות, אג״ח וקרנות מספקים צמיחה, הכנסה ופיזור.',
    icon: 'chart-line-up',
  },
  {
    title: 'גידור',
    body: 'אופציות ונגזרים נועדו לנהל סיכון מוגדר. הם אינם שכבת חירום.',
    icon: 'scales',
  },
  {
    title: 'אלטרנטיבי ונדל״ן',
    body: 'עשויים להוסיף מקורות תשואה ופיזור, ודורשים תקציב אי-נזילות ובדיקת ריכוזיות כוללת.',
    icon: 'buildings',
  },
  {
    title: 'הורשה',
    body: 'מוטבים, צוואה, הסכמי שותפות ומיסוי אינם תחליפים זה לזה, ויש לתאם ביניהם.',
    icon: 'compliance',
  },
];

/*
  The five bodies the document names, with the split between them. The Tel Aviv
  Stock Exchange is listed alongside them as a trading and clearing venue
  rather than a regulator, which is the distinction the document draws.
*/
export interface Regulator {
  name: string;
  scope: string;
  icon: string;
  venue?: boolean;
}

export const REGULATORS: Regulator[] = [
  {
    name: 'רשות שוק ההון, ביטוח וחיסכון',
    scope: 'חברות ביטוח, קרנות פנסיה, גמל, השתלמות, שירותים פיננסיים מוסדרים ורישוי בעלי רישיון פנסיוני.',
    icon: 'shield-check',
  },
  {
    name: 'רשות ניירות ערך',
    scope: 'הצעת ניירות ערך, קרנות נאמנות, ייעוץ ושיווק השקעות וניהול תיקים.',
    icon: 'compliance',
  },
  {
    name: 'רשות המסים',
    scope: 'מס הכנסה, רווחי הון, קצבאות ומיסוי מקרקעין.',
    icon: 'scales',
  },
  {
    name: 'בנק ישראל',
    scope: 'בנקים, פיקדונות, יציבות בנקאית ומערכות תשלום.',
    icon: 'bank',
  },
  {
    name: 'הבורסה לניירות ערך בתל אביב',
    scope: 'זירת מסחר וסליקה, ולא רגולטור: המסחר, המסלקות ומסלקת מעו״ף לנגזרים.',
    icon: 'chart-line-up',
    venue: true,
  },
];

/*
  The three framings the document opens with. They are the argument the whole
  hub makes, so they open the hub too.
*/
export const BIG_IDEAS = [
  {
    title: 'המעטפת אינה הנכס',
    body: 'אותה חשיפה כלכלית יכולה להופיע בתיק ניירות ערך, בקרן נאמנות, בקופת גמל, בפוליסה או בקרן פרטית. הנזילות, המס, העלויות, הפיקוח וההורשה עשויים להשתנות מהותית — בלי שהחשיפה עצמה השתנתה כלל.',
    icon: 'puzzle',
  },
  {
    title: 'נזילות היא תכונת מערכת',
    body: '״נסחר״ אינו בהכרח ״נזיל״. הנזילות נקבעת בשכבת המעטפת ובכללי המשיכה שלה, לא בנכס הבסיס — ולכן שני מוצרים עם אותה חשיפה יכולים להיפתח בתוך יום או להיסגר לשש שנים.',
    icon: 'fast-prep',
  },
  {
    title: 'תיקון 190 אינו מוצר',
    body: 'זהו תיקון לפקודת מס הכנסה, לא שם של קופה. ההפקדה נעשית לקופת גמל לקצבה במעמד עצמאי, וההטבה מתייחסת לרכיב הקצבה המוכרת. סיווג שגוי כאן משנה את כללי המשיכה, המס וההורשה.',
    icon: 'scales',
  },
];

/* Off in production until Natali approves the section; on for staging review. */
export const KNOWLEDGE_ENABLED = import.meta.env.KNOWLEDGE_ENABLED === 'true';

export const SERIES: { slug: string; title: string; lead: string }[] = [
  {
    slug: 'pension-guide',
    title: 'מדריך פנסיה מקצועי',
    lead: 'שבעת עמודי הליבה של הפנסיה הצוברת והחיסכון, בסדר קריאה אחד.',
  },
];
