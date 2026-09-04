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
  The four layers, and the thesis of the whole section: the same economic
  exposure can sit in several wrappers, and the wrapper decides liquidity, tax,
  cost, supervision and inheritance — not the exposure.

  Built from five originally, off the docx's five-row table, and corrected to
  four against the HTML previews Natali supplied on 04/09. The previews are the
  canonical grouping and they are labelled Layer 1..4 explicitly, with a
  different split: a private partnership and a trust are examples of the legal
  wrapper, not a fifth layer of their own, and קופת גמל / קרן השתלמות belong to
  the pension layer rather than to the wrapper layer where the five-row reading
  had put them.
*/
export const CONCEPT_LAYERS: Layer[] = [
  {
    title: 'נכס בסיס',
    body: 'מקור התשואה והסיכון הכלכלי.',
    examples: ['מניה', 'אג״ח', 'נדל״ן', 'סחורה', 'מטבע'],
    question: 'מה יוצר רווח או הפסד?',
    icon: 'chart-line-up',
  },
  {
    title: 'מכשיר השקעה',
    body: 'הצורה שבה החשיפה נארזה ומועברת.',
    examples: ['קרן נאמנות', 'ETF', 'אופציה', 'מוצר מובנה', 'קרן פרטית', 'פיקדון'],
    question: 'כיצד החשיפה נארזה?',
    icon: 'puzzle',
  },
  {
    title: 'מעטפת משפטית או מיסויית',
    body: 'המסגרת שמחזיקה את המכשיר וקובעת את כללי המס והמשיכה.',
    examples: ['חשבון בנק', 'שותפות מוגבלת', 'IRA', 'קרן ריט', 'נאמנות'],
    question: 'מהם כללי ההפקדה, המעבר והמשיכה?',
    icon: 'scales',
  },
  {
    title: 'מוצר פנסיוני או ביטוחי',
    body: 'מעטפת ייעודית לחיסכון ארוך, לעיתים עם העברת סיכון למבטח.',
    examples: ['קרן פנסיה', 'קופת גמל', 'ביטוח מנהלים', 'קרן השתלמות', 'גמל להשקעה'],
    question: 'איזה סיכון אנושי מכוסה, ומה כללי הקצבה?',
    icon: 'piggy-bank',
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
    scope: 'קרנות פנסיה, קופות גמל, קרנות השתלמות, ביטוחי מנהלים, חברות ביטוח, סוכני ביטוח, יועצים וסוכני שיווק פנסיוני. הוקמה ב-2016.',
    icon: 'shield-check',
  },
  {
    name: 'רשות ניירות ערך',
    scope: 'הבורסה בת״א, תשקיפים, קרנות נאמנות, יועצי השקעות, מנהלי תיקים ומשווקי השקעות. פועלת מ-1969 מכוח חוק ניירות ערך התשכ״ח-1968.',
    icon: 'compliance',
  },
  {
    name: 'רשות המסים',
    scope: 'מיסוי כל השכבות — רווחי הון, מס שבח, פטורי הפקדה, תיקון 190, מיסוי קרנות ריט ומיסוי חוצה גבולות של קרנות פרטיות זרות.',
    icon: 'scales',
  },
  {
    name: 'בנק ישראל',
    scope: 'התאגידים הבנקאיים ושוק האשראי. קובע ריבית מוניטרית ומפרסם נתוני מאקרו רלוונטיים לכל אחד מהמקהלים.',
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
    body: 'קופת גמל, קרן השתלמות ופוליסת חיסכון הן מסגרות משפטיות-מיסויות. בתוך כל אחת עשויים להימצא מניות, אג״ח, מזומן, נגזרים ונכסים לא-סחירים — והנזילות, המס, הפיקוח וההורשה עשויים להשתנות מהותית בלי שהחשיפה עצמה השתנתה.',
    icon: 'puzzle',
  },
  {
    title: 'נזילות היא תכונת מערכת',
    body: 'צריך לבחון גם את נזילות נכסי הבסיס, גם את כללי המשיכה מהמעטפת וגם מגבלות כמו Lock-up, Gate ושוק משני. ״נסחר״ אינו בהכרח ״נזיל״.',
    icon: 'fast-prep',
  },
  {
    title: 'תיקון 190 אינו מוצר',
    body: 'זהו הסדר מס בפקודת מס הכנסה, המיושם באמצעות קופת גמל לקצבה, וההבחנה שבבסיסו היא בין קצבה מזכה לקצבה מוכרת. סיווג שגוי כאן משנה את כללי המשיכה, המס וההורשה.',
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
