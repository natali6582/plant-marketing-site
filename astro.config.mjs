// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/*
  Draft knowledge articles render on staging so they can be reviewed, and must
  never appear in the sitemap even there. The frontmatter is the single source
  of truth for that, so it is read here rather than restated in a list that
  would drift.
*/
const draftArticles = (() => {
  try {
    return readdirSync('src/content/knowledge')
      .filter((f) => f.endsWith('.md'))
      .filter((f) => /^draft:\s*true\s*$/m.test(readFileSync(`src/content/knowledge/${f}`, 'utf8')))
      .map((f) => `/knowledge/${f.replace(/\.md$/, '')}/`);
  } catch {
    return [];
  }
})();

// https://astro.build/config
export default defineConfig({
  site: 'https://plan-t.co.il',
  integrations: [
    sitemap({
      filter: (page) => !draftArticles.some((path) => new URL(page).pathname === path),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
