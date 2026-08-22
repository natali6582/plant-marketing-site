# Found, not fixed

Scope lock (§4 of the build plan): anything noticed outside the agreed scope
goes here rather than being fixed silently. Move an item out of this file only
after it has been agreed.

## Blocking launch — must be filled before go-live

These are placeholders currently visible on the site.

- [ ] **Brand palette.** `--color-brand-*` in `src/styles/global.css` is a
      stand-in green scale. Replace with the hex list extracted from
      plan-t.org.il, then re-check contrast.
- [ ] **Logo.** The mark in `src/components/Header.astro` and
      `public/favicon.svg` is a placeholder. Drop in the official SVG.
- [ ] **OG image.** `public/og.png` is a generated placeholder rendered in a
      fallback font. Replace with the real 1200×630 asset once brand assets land.
- [ ] **Product-tour screenshots.** `public/images/tour-*.svg` are wireframe
      placeholders. Replace with real product screenshots (and update the alt
      text and captions in `src/pages/index.astro`).
- [ ] **Social proof.** Home page has three `[TBD]` cards. Either supply real
      testimonials, numbers and client logos — with written permission — or
      remove the section. No invented claims (ambiguity #8).
- [ ] **Privacy policy.** `/privacy/` is a skeleton with a visible warning
      banner. Needs the legally approved Hebrew text (ambiguity #7).
- [ ] **Accessibility statement.** `/accessibility/` needs the coordinator's
      name, a real phone number, the audit date and the known-limitations list
      (ambiguity #6).
- [ ] **Phone number.** `03-000-0000` appears in the footer, `/contact/` and
      `/accessibility/`. Replace with the real number.
- [ ] **Email address.** Confirm `info@plan-t.co.il` exists and is monitored.
- [ ] **Company story and team.** `/about/` has two `[TBD]` blocks.
- [ ] **Webhook URL.** `PUBLIC_LEAD_WEBHOOK_URL` must be set in the Cloudflare
      Pages environment before the form works in production.
- [ ] **Analytics snippet.** Add to `BaseLayout.astro` once the tool is chosen
      (ambiguity #5).
- [ ] **Final page list.** Built to the eight pages in §1; confirm nothing is
      missing (ambiguity #2).

## Post-launch backlog (§8 — not now)

- English version: hreflang, LTR variant of the layout.
- Live interactive demo of Plan-t AI (currently a static product tour).
- Blog / content hub for the LinkedIn and TikTok posts from the marketing plan.
- Conversion tracking: form submission → GA4 event, campaign UTM reporting.
- Move hosting or add a second admin as the company's accounts are opened.

## Noticed during the build

- The webinar page collects registrations through the same lead form as every
  other page, distinguished only by `source: website-webinar`. If registration
  needs its own monday board or a calendar invite, that is a separate scenario
  and a separate decision.
- The role dropdown on the lead form offers advisor / agent / pension / other.
  These must match whatever the monday status column accepts, or Make will
  reject the value.
