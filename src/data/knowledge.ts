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
    icon: 'holistic-view',
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
  The planning stack — the "how it fits" list.

  Six layers, numbered, and they are the previews' own. Built first as seven
  from the docx's loose bullet list, which was the wrong source: the docx has
  no numbering and folds inheritance in as a line of its own, while the
  previews label these שכבה 1..6 and put insurance protection where I had put
  hedging. The brief said six; the brief was right and the docx reading was
  not.

  Described, never recommended. There are no weights here, no mix and no
  suitability — the horizons are the source's own framing of what each layer is
  for, not a target allocation.
*/
export const PLANNING_LAYERS: Layer[] = [
  {
    title: 'נזילות וחירום',
    body: 'עו״ש, פיקדונות, קרנות כספיות ומק״מ. מכסה שלושה עד שישה חודשי הוצאה, זמינה מיידית. לא לתשואה — לאיזון בסיסי.',
    icon: 'fast-prep',
  },
  {
    title: 'חיסכון לטווח קצר עד בינוני',
    body: 'קרנות נאמנות, ETFs, אג״ח, פוליסת חיסכון וקרן השתלמות. ליעדים בטווח שנה עד שבע שנים.',
    icon: 'piggy-bank',
  },
  {
    title: 'השקעה סחירה לטווח בינוני עד ארוך',
    body: 'מניות בת״א ובחו״ל, קרנות סל, ולמי שמבין אותם גם מוצרים מובנים ואופציות. החלק הסחיר בתיק, שמעניק פיזור ותשואה.',
    icon: 'chart-line-up',
  },
  {
    title: 'חיסכון פנסיוני לטווח ארוך',
    body: 'קרן פנסיה, ביטוח מנהלים, קופת גמל, קופת גמל להשקעה ותיקון 190. ליעדי פרישה והורשה, עם יעילות מס.',
    icon: 'hourglass',
  },
  {
    title: 'הגנות ביטוחיות',
    body: 'ביטוח חיים, אובדן כושר עבודה, בריאות, סיעוד ורכוש. כרית ביטחון למקרה של אירועים לא צפויים.',
    icon: 'shield-check',
  },
  {
    title: 'נכסים אלטרנטיביים ונדל״ן',
    body: 'לפי אופק, נזילות וכשירות: PE, VC, אשראי פרטי, נדל״ן ישיר, REIT וקרנות תשתיות. ליעדי טווח ארוך ולגיוון סיכוני שוק.',
    icon: 'buildings',
  },
];

/*
  The five bodies the document names, with the split between them. The Tel Aviv
  Stock Exchange is listed alongside them as a trading and clearing venue
  rather than a regulator, which is the distinction the document draws.
*/
export interface Regulator {
  name: string;
  icon: string;
  venue?: boolean;
}

export const REGULATORS: Regulator[] = [
  {
    name: 'רשות שוק ההון, ביטוח וחיסכון',
    icon: 'shield-check',
  },
  {
    name: 'רשות ניירות ערך',
    icon: 'compliance',
  },
  {
    name: 'רשות המסים',
    icon: 'scales',
  },
  {
    name: 'בנק ישראל',
    icon: 'bank',
  },
  {
    name: 'הבורסה לניירות ערך בתל אביב',
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

/*
  Two switches, because "review it" and "publish it" are two decisions.

  KNOWLEDGE_ENABLED deliberately enables the complete review/demo output in any
  build, including main. That is useful while the public workers.dev URL is the
  approved management-demo site and no custom domain or route points at it.
  Review output includes drafts and remains noindex.

  KNOWLEDGE_PUBLIC remains the separate curated-public switch. It includes only
  content that has cleared the publication gates.
*/
const knowledgeReview = import.meta.env.KNOWLEDGE_ENABLED === 'true';
const knowledgePublic = import.meta.env.KNOWLEDGE_PUBLIC === 'true';

export const KNOWLEDGE_ENABLED = knowledgeReview || knowledgePublic;

/*
  Drafts render for review and never in public. Before this, both were the same
  flag, so publishing the section would have published 25 pages carrying a
  "טיוטה" banner and an unverified figure to real visitors. Production shows
  only what has cleared its sources.
*/
export const KNOWLEDGE_DRAFTS = knowledgeReview;

export const SERIES: { slug: string; title: string; lead: string; audience?: 'planners' | 'wealth' }[] = [
  {
    slug: 'pension-guide',
    title: 'מדריך פנסיה מקצועי',
    lead: 'שבעת עמודי הליבה של הפנסיה הצוברת והחיסכון, בסדר קריאה אחד.',
  },
  {
    slug: 'investment-decisions',
    title: 'ממכשיר השקעה להחלטה מנומקת',
    lead: 'מסלול למתכננים פיננסיים: שיטת ניתוח, קרנות סל, אג״ח ומוצרים מובנים. כחצי שעה לקריאה ראשונה ולהתנסות, בקצב שלכם.',
    audience: 'planners',
  },
  {
    slug: 'wealth-decisions',
    title: 'נזילות, קרנות פרטיות והון משפחתי',
    lead: 'מסלול למנהלי עושר: התחייבויות הון, דוחות קרנות, אשראי פרטי, נדל״ן ומטבע. כחצי שעה לקריאה ראשונה, עם כלים להמשך העבודה.',
    audience: 'wealth',
  },
];
