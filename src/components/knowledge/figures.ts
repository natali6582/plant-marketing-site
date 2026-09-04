/*
  Shared helpers for rendering figures. Kept out of the components so the
  article layout, the figures page and <Figure> all format a number the same
  way — a ceiling that reads 18,854 ₪ in a paragraph and 18854 in a table is
  two different-looking numbers to a reader.
*/

export interface FigureData {
  value: number | string;
  unit: string;
  year: number;
  label: string;
  note?: string;
  group: string;
  source: { label: string; url: string; tier: 0 | 1 | 2 };
}

/*
  Grouped headings for /knowledge/figures-<year>/, in reading order. A group
  that is not listed here still renders — under its own key — so adding a
  figure never silently drops it off the page.
*/
export const FIGURE_GROUPS: { key: string; title: string }[] = [
  { key: 'keren-hishtalmut', title: 'קרן השתלמות' },
  { key: 'gemel', title: 'קופת גמל להשקעה' },
  { key: 'pension', title: 'פנסיה וביטוח מנהלים' },
  { key: 'tikun-190', title: 'תיקון 190' },
  { key: 'tax', title: 'מיסוי רווחי הון' },
  { key: 'accredited', title: 'משקיע כשיר' },
  { key: 'securities', title: 'ניירות ערך והצעה לציבור' },
  { key: 'real-estate', title: 'מיסוי מקרקעין' },
];

export function formatFigure(f: FigureData): string {
  if (typeof f.value === 'string') return f.value;

  const number = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 }).format(f.value);

  switch (f.unit) {
    case '₪':
      return `${number} ₪`;
    case '%':
      return `${number}%`;
    case 'גיל':
      return `גיל ${number}`;
    case 'שנים':
      return `${number} שנים`;
    case 'חודשים':
      return `${number} חודשים`;
    default:
      return number;
  }
}

/* The route carries the year the data is for, so January's edit moves the
   page to its own URL instead of leaving 2026 in the path forever. */
export function figuresPath(year: number): string {
  return `/knowledge/figures-${year}/`;
}

export const TIER_LABEL: Record<number, string> = {
  0: 'טעון אימות',
  1: 'מקור ראשוני',
  2: 'מקור מסביר',
};

/*
  Notes are authored Hebrew prose that sometimes names a date or an amount —
  "הוראת שעה עד 31.12.2026". A dotted date sitting bare in an RTL paragraph can
  reorder against the text around it, which scripts/check-inline-ltr.mjs caught
  on the figures page. This wraps those runs in the site's .ltr helper.

  The text is escaped first and only the spans this function adds are markup, so
  a note can never inject anything through set:html.
*/
const ATOMIC = /(\d{1,2}\.\d{1,2}\.\d{4}|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?%)/g;

export function wrapAtomicRuns(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(ATOMIC, '<span class="ltr">$1</span>');
}
