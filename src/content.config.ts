import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/*
  Content collections for the knowledge hub.

  Two of them, and the split is the point. `knowledge` holds the articles, which
  Natali edits as markdown. `figures` holds every number any article cites,
  which she edits once a year in one file. An article that types a number
  inline is a number nobody will remember to update; an article that references
  a key is a number that updates everywhere at once.

  The figures file is YAML loaded through Astro's own file() loader, so nothing
  new is installed to read it.
*/

const source = z.object({
  label: z.string(),
  /*
    Empty string means "not yet verified", and it is only tolerated at tier 0.
    A URL that looks right but was never checked is worse than a blank, because
    the blank is visible in a review and the plausible link is not.
  */
  url: z.string(),
  /*
    1 primary — gov.il, רשות ניירות ערך, רשות המסים, בנק ישראל, הבורסה, נבו.
    2 explanatory — insurers, professional sites. Only alongside a tier 1.
    0 not yet verified. Draft articles only; the build refuses to publish one.
  */
  tier: z.union([z.literal(0), z.literal(1), z.literal(2)]),
});

const track = z.enum(['shared', 'agents', 'planners', 'wealth']);

const knowledge = defineCollection({
  loader: glob({ base: './src/content/knowledge', pattern: '**/*.md' }),
  schema: z
    .object({
      title: z.string(),
      /* An article can belong to several tracks — the wealth track reads most
         of the planners' articles, and repeating the file would mean two files
         drifting apart. */
      audience: z.union([track, z.array(track).nonempty()]),
      summary: z.string(),
      updated: z.string().regex(/^\d{4}-\d{2}$/, 'updated must be YYYY-MM'),
      sources: z.array(source).default([]),
      order: z.number().default(100),
      related: z.array(z.string()).default([]),
      series: z.string().optional(),
      seriesOrder: z.number().optional(),
      draft: z.boolean().default(true),
      /* Figure ids the article cites. Checked against figures.yaml by
         scripts/check-figures.mjs, which is what makes a typo a build failure
         rather than a silently missing number. */
      figures: z.array(z.string()).default([]),
      icon: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      /*
        A published article must stand on at least one primary source, and a
        tier-2 source may only appear beside one. Draft articles are exempt so
        that work in progress can be reviewed before its links are verified.
      */
      if (data.draft) return;

      const tiers = data.sources.map((s) => s.tier);
      if (!tiers.includes(1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'a published article needs at least one tier-1 source',
          path: ['sources'],
        });
      }
      if (tiers.includes(0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'tier-0 ("לאימות") sources are allowed only while draft: true',
          path: ['sources'],
        });
      }
      for (const s of data.sources) {
        if (s.tier !== 0 && !s.url) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `source "${s.label}" has no url`,
            path: ['sources'],
          });
        }
      }
    }),
});

const figures = defineCollection({
  loader: file('./src/data/figures.yaml'),
  /* The key in the YAML file becomes the entry id; the loader supplies it, so
     it is not part of the data shape. */
  schema: z.object({
    value: z.union([z.number(), z.string()]),
    unit: z.string(),
    year: z.number(),
    label: z.string(),
    note: z.string().optional(),
    group: z.string(),
    source,
  }),
});

export const collections = { knowledge, figures };
