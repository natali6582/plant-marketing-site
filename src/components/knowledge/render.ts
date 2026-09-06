/*
  The bridge between markdown articles and the site's components.

  The brief asked for components usable inside the article bodies —
  <Figure/>, <Layers/>, <Compare/> and friends. That needs MDX, and MDX is a new
  dependency, which the brief also forbids. So the articles stay plain .md and
  carry tokens instead:

      {{figure:keren-hishtalmut-deposit-employee}}   inline, in a sentence
      {{keyfigures:id-one,id-two}}                   a block, on its own line
      {{layers:concept}}                             a block
      {{compare:pension-vs-menahalim}}               a block
      {{timeline:policy-generations}}                a block

  and GitHub-style alerts for callouts:

      > [!info] optional title
      > body

  The guarantee the brief actually cared about is unchanged and is enforced
  here rather than trusted: a number reaches a reader only by id, so the
  January edit is still one file. What changed is the spelling of the
  reference, not the rule.

  Block tokens are split out of the rendered HTML so the layout can put real
  Astro components between the prose chunks. Inline figure tokens are replaced
  with markup directly, because an anchor does not need a component.
*/

import type { FigureData } from './figures';
import { formatFigure, figuresPath } from './figures';

export type Part =
  | { kind: 'html'; html: string }
  | { kind: 'block'; name: string; arg: string };

const BLOCK = /<p>\s*\{\{\s*(keyfigures|layers|compare|timeline)\s*:\s*([^}]+?)\s*\}\}\s*<\/p>/g;
const INLINE = /\{\{\s*figure\s*:\s*([a-z0-9-]+)\s*\}\}/g;

/*
  An id that is not in figures.yaml is a build error, not a blank. A ceiling
  that silently disappears from an article is worse than a page that refuses to
  build, because only one of the two is noticed.
*/
export function inlineFigures(html: string, figures: Map<string, FigureData>, where: string): string {
  return html.replace(INLINE, (_, id: string) => {
    const f = figures.get(id);
    if (!f) throw new Error(`${where}: {{figure:${id}}} is not in src/data/figures.yaml.`);
    const href = `${figuresPath(f.year)}#${id}`;
    const title = f.label.replace(/"/g, '&quot;');
    return (
      `<a href="${href}" title="${title}" class="font-bold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800">` +
      `<span class="ltr">${formatFigure(f)}</span>` +
      `<span class="whitespace-nowrap text-sm font-normal text-ink-700">&#32;(<span class="ltr">${f.year}</span>)</span>` +
      `</a>`
    );
  });
}

export function splitBlocks(html: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  for (const m of html.matchAll(BLOCK)) {
    if (m.index! > last) parts.push({ kind: 'html', html: html.slice(last, m.index) });
    parts.push({ kind: 'block', name: m[1], arg: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < html.length) parts.push({ kind: 'html', html: html.slice(last) });
  return parts;
}

/*
  GitHub-style alerts, turned into the site's Callout markup. Done as a string
  transform rather than a component split because a callout's body is prose
  that belongs in the flow, and splitting on it would break paragraphs in half.
*/
export function renderAlerts(html: string): string {
  return html.replace(
    /<blockquote>\s*<p>\s*\[!(info|warn)\]\s*([^<\n]*)([\s\S]*?)<\/p>([\s\S]*?)<\/blockquote>/g,
    (_, type: string, title: string, first: string, rest: string) => {
      const warn = type === 'warn';
      const box = warn
        ? 'border-warn-500 bg-warn-100 text-ink-900'
        : 'border-brand-200 bg-surface-blue text-ink-700';
      const heading = title.trim()
        ? `<p class="font-bold text-brand-800">${title.trim()}</p>`
        : '';
      const body = `<p>${first.trim()}</p>${rest}`;
      return (
        `<aside class="not-prose my-8 rounded-2xl border p-5 leading-relaxed ${box}">` +
        heading +
        `<div class="space-y-3${heading ? ' mt-2' : ''}">${body}</div>` +
        `</aside>`
      );
    }
  );
}

/* Reading time, stated in the meta row. 200 Hebrew words a minute is the
   conventional figure; the point of showing it is scale, not precision. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
