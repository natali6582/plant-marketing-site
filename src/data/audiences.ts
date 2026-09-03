/*
  The three audiences the site addresses. Single-sourced because the same
  three appear in four places — the Home selector, the header dropdown, the
  footer link list, and the `audience` value each page passes to LeadForm —
  and they must never drift apart.

  `id` doubles as the lead-payload value: the union below is the allowed set,
  and the form runtime coerces anything outside it to "". Adding an audience
  here is therefore a data decision with a payload consequence — see config.md.
*/
export type AudienceId = 'agents' | 'planners' | 'wealth';

export interface Audience {
  id: AudienceId;
  href: string;
  /** plural, matching the nav — the pages address the reader in second person */
  name: string;
  /** the selector card's single line (proposal §2.2, D2) */
  line: string;
}

export const audiences: Audience[] = [
  {
    id: 'agents',
    href: '/agents/',
    name: 'סוכני ביטוח',
    line: 'סוכן ביטוח זה כרטיס הכניסה.',
  },
  {
    id: 'planners',
    href: '/planners/',
    name: 'מתכננים פיננסיים',
    line: 'לחבר את כל התמונה הפיננסית',
  },
  {
    id: 'wealth',
    href: '/wealth/',
    name: 'מנהלי עושר',
    line: 'לנהל מורכבות מתוך תמונה אחת ברורה',
  },
];
