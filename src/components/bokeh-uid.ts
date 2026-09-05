/*
  Stable, unique ids for the bokeh gradients.

  This lives in its own module for one reason: an .astro frontmatter block runs
  on every render, so a counter declared there is a fresh counter every time and
  every instance thinks it is the first. That is exactly what happened —
  index, faq and solutions each rendered two bokeh fields and gave both the same
  id, so the second field referenced the first's gradient. Module scope is
  evaluated once per build, which is what a counter needs.

  Keyed by pathname so that adding an unrelated page does not shift the ids on
  every other one, and counted within the page because seed and intensity alone
  do not identify an instance: index renders half/seed-3 twice, once directly
  and once inside LeadForm.

  In dev a page re-renders per request and the counter climbs. Harmless — the
  markup is static and the ids only have to be unique inside one response.
*/
const counters = new Map<string, number>();

export function bokehUid(pathname: string, seed: number): string {
  const n = (counters.get(pathname) ?? 0) + 1;
  counters.set(pathname, n);
  const slug = pathname.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home';
  return `${slug}-${seed}-${n}`;
}
