# Plan-T marketing site

Static Hebrew (RTL) marketing site for **plan-t.co.il**, built with Astro +
Tailwind and deployed to Cloudflare Pages. This is the **Plan B engine** from
§7 of the build plan: same design and copy, different host — no Base44
dependency, so the site can go live without waiting on a plan upgrade or an
RTL fix.

## Quick start

```bash
npm install
cp .env.example .env      # then paste the Make webhook URL
npm run dev               # http://localhost:4321
npm run build             # static output in dist/
npm run preview           # serve dist/ locally
```

## What is in here

| Path | What it is |
| --- | --- |
| `src/pages/` | One file per page: Home, Product/AI, Solutions, Webinar, About, Contact, Privacy, Accessibility, 404 |
| `src/layouts/BaseLayout.astro` | `lang="he" dir="rtl"`, SEO meta, OG tags, canonical, skip link, scroll-reveal |
| `src/components/LeadForm.astro` | The lead form — posts JSON to the Make webhook, honeypot, privacy consent |
| `src/components/Header.astro` / `Footer.astro` | Navigation |
| `src/styles/global.css` | Design tokens (`@theme`) + the `.ltr` and `.skip-link` helpers |
| `public/` | `robots.txt`, favicon, OG image, product-tour placeholders |
| `config.md` | Webhook URL, monday board ID, DNS records — fill in as you go |
| `backlog.md` | "Found, not fixed" list (scope lock, §4 of the plan) |

## Pages and routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/product/` | Plan-t AI |
| `/solutions/` | Solutions by role (advisors / agents / pension) |
| `/webinar/` | Webinar registration |
| `/about/` | About |
| `/contact/` | Contact + lead form |
| `/privacy/` | Privacy policy |
| `/accessibility/` | Accessibility statement |

`sitemap-index.xml` and `sitemap-0.xml` are generated at build time by
`@astrojs/sitemap`; `robots.txt` points at them.

## Design tokens

Tokens live in the `@theme` block of `src/styles/global.css` — colors, the
Hebrew font stack (Heebo), and the helpers. Components reference tokens
(`bg-brand-700`, `text-accent-300`), never raw hex values, so re-skinning the
site means editing that one block.

> **Before launch:** the `--color-brand-*` greens are a stand-in. Replace them
> with the palette extracted from plan-t.org.il, and drop the real logo SVG in
> place of the placeholder mark in `Header.astro` and `public/favicon.svg`.

## RTL rules this site follows

- `lang="he" dir="rtl"` on `<html>`; layout uses logical properties
  (`inset-inline-start`, `ms-`/`me-`) so nothing is hard-coded to left/right.
- Numbers, phone numbers, dates and Latin product names are wrapped in
  `<span class="ltr">`, which sets `direction: ltr; unicode-bidi: isolate`.
- Phone and email inputs carry `dir="ltr"` so typed values read correctly.

## Lead form → Make → monday

The form posts JSON to `PUBLIC_LEAD_WEBHOOK_URL`:

```json
{
  "name": "", "phone": "", "email": "", "office": "", "role": "",
  "message": "", "source": "website-home", "page": "/",
  "utm_source": "", "utm_medium": "", "utm_campaign": ""
}
```

`source` differs per page (`website-home`, `website-webinar`, …) so monday can
tell where a lead came from. Nothing is stored on the site — monday is the only
system of record. If the env var is empty, the form shows a Hebrew message
pointing at the email address instead of failing silently.

The honeypot field `company_website` is positioned off-screen. When it is
filled, the form shows the success state and sends nothing.

See `config.md` for the scenario setup and the test procedure.

## Accessibility

Target: WCAG 2.0 AA / Israeli standard 5568. Built in: semantic landmarks and
heading order, a skip-to-content link, visible focus rings, labels on every
field, alt text on every image, and `prefers-reduced-motion` support (the
scroll reveal is inert when reduced motion is requested).

Still to do before launch: real contrast measurement on the final palette, a
keyboard pass over every page, and filling the `[TBD]` fields in
`/accessibility/` (coordinator name, phone, audit date).

## Deploying to Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect this repo.
2. Build command `npm run build`, output directory `dist`, no framework preset needed.
3. Environment variables → add `PUBLIC_LEAD_WEBHOOK_URL` for both Production
   and Preview. Astro inlines `PUBLIC_*` vars at build time, so a change here
   needs a redeploy to take effect.
4. Custom domains → add `plan-t.co.il` and `www.plan-t.co.il`; Cloudflare shows
   the exact DNS records to create.
5. At DomainTheNet (`תומושר לוהינ תוינפהו`) add **only** those records. Do not
   change the nameservers (ns1–3.dtnt.info) and do not touch MX or any existing
   record.
6. Wait for the certificate, then verify: padlock on both hosts, `www`
   redirects to the root, and one form submission from the live domain lands in
   monday.

Record what was added in `config.md`.

## Ownership

- **Domain** — plan-t.co.il, registered by Plan-T (May 2026) at DomainTheNet,
  valid to 26.05.2028. Company property. Renewal and DNS stay with the
  colleague who manages the company's domains; registrar credentials never go
  in this repo.
- **Leads** — the monday board. Company property. Nothing depends on this
  site's storage, because it has none.
- **Site** — this repo plus the Cloudflare Pages project. Add a second company
  admin to the Cloudflare account as soon as one exists.
- **Design** — Claude Design project and the exported HTML/tokens, saved to the
  company Drive.

## Out of scope

plan-t.org.il and its /support form and automations · client login or member
area · e-commerce or payments · the English version (the structure is ready for
it, the content is not) · new monday boards or automations beyond the one lead
scenario · any live AI demo requiring a backend.

Anything noticed outside that list goes in `backlog.md` — never fixed silently.
