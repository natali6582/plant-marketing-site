# Found, not fixed

Scope lock (§4 of the build plan): anything noticed outside the agreed scope
goes here rather than being fixed silently. Move an item out of this file only
after it has been agreed.

## Resolved — pulled from the live site (plan-t.org.il)

- [x] **Brand palette.** Sampled from the official Plan-T mark: navy `#101228`,
      blue `#249FDA`, green `#8DC63F`. Mapped to the `ink` / `brand` / `accent`
      token families in `src/styles/global.css`. All 21 foreground/background
      pairs the site renders were checked against WCAG AA.
- [x] **Logo.** The mark is reproduced as inline SVG in `Header.astro` and
      `public/favicon.svg`, geometry measured from the original artwork
      (1.5% pixel difference, anti-aliasing only).
- [x] **Phone number.** `073-3861711`, the number published on plan-t.org.il.
- [x] **Email.** `sales@plan-t.org.il`, likewise.
- [x] **OG image.** Rebuilt on the navy ground with the real mark.
- [x] **Product-tour screenshots (2 of 3).** מסך לקוח ראשי and מסך ראשי from the
      מסכי המערכת gallery, full-resolution originals, optimised to WebP with a
      JPEG fallback. The gallery publishes two screens, so the third tour slot
      keeps its wireframe.
- [x] **Social proof.** One published testimonial (רווית, סוכנת ביטוח ופיננסים
      עצמאית). Wording and punctuation verbatim; whitespace normalised and CRM
      wrapped in `.ltr`.

## Blocking launch — must be filled before go-live

These are placeholders currently visible on the site.

- [ ] **Third product-tour screenshot.** Slot three still shows
      `tour-report.svg`, a wireframe. Only two screens are published in the
      מסכי המערכת gallery. Supply a third, or drop the slot to a two-up.
- [ ] **Privacy policy.** `/privacy/` is a skeleton with a visible warning
      banner. Needs the legally approved Hebrew text (ambiguity #7).
- [ ] **Accessibility statement.** `/accessibility/` needs the coordinator's
      name, the audit date and the known-limitations list (ambiguity #6).
- [ ] **Company story and team.** `/about/` has two `[TBD]` blocks.
- [ ] **Webhook URL.** `PUBLIC_LEAD_WEBHOOK_URL` must be set in the Cloudflare
      Pages environment before the form works in production.
- [ ] **Analytics snippet.** Add to `BaseLayout.astro` once the tool is chosen
      (ambiguity #5).
- [ ] **Final page list.** Built to the eight pages in §1; confirm nothing is
      missing (ambiguity #2).

## Decisions needed on the contact details

- [ ] **Which email on the new domain?** The site currently shows
      `sales@plan-t.org.il` because that is what is published today. If a
      `@plan-t.co.il` mailbox is being set up, say which address should appear
      and it is a one-line change.
- [ ] **Which phone?** `073-3861711` is the number in the site's contact block.
      `03-9707070` is registered as the business phone in the Wix settings.
      Confirm which one belongs on the marketing site.
- [ ] **OG image typography.** The image is set in a fallback face because the
      build sandbox cannot reach Google Fonts. If it matters, re-render it with
      Heebo, or supply a designed 1200×630 asset.

## Post-launch backlog (§8 — not now)

- English version: hreflang, LTR variant of the layout.
- Live interactive demo of Plan-t AI (currently a static product tour).
- Blog / content hub for the LinkedIn and TikTok posts from the marketing plan.
- Conversion tracking: form submission → GA4 event, campaign UTM reporting.
- Move hosting or add a second admin as the company's accounts are opened.

## Resolved by the imagery PR (Phase 1 mapping approved 22.08)

- [x] **Home hero** — מסך לקוח ראשי in a browser frame under the headline (M1).
- [x] **Webinar strip** — brand mood image (seedlings on coins, from
      plan-t.org.il) under a navy duotone; green now appears only on the CTA,
      per design law 2 (M2, colour change approved).
- [x] **About hero** — the wide mood crop, same treatment (M3).
- [x] **OG image** — rebuilt 1200×630 on the duotone mood ground, moved to
      `public/images/og.png`, wired site-wide. Licence use approved by owner.

## Ideas noted from Orion and the old site (copy/structure — separate tasks)

- A named "Meet Plan-t AI" product-shot moment on /product/ — needs an AI
  screen published as a file first.
- A short FAQ above the lead form (the old site has a שאלות-ותשובות page).
- Team block on /about/ — the three headshots published on the old site are
  right for it, but it needs names, roles and approved copy.
- The hero now shows an interim crop (charts side only) because the full
  capture has a broken flag-icon slot in the client panel. When a fresh, clean
  capture of מסך לקוח ראשי arrives: regenerate the hero asset from it (and
  consider restoring the full-screen framing), and swap tour slot 1 too — the
  tour still shows the full capture, flag glitch and all, at small size.

## Noticed while adding the real screenshots (not touched)

- The screenshots are dense dashboards shown at roughly 362px in the three-up
  grid, so the detail is not legible at rest. A lightbox or a wider single-column
  presentation would fix it, but that is a layout change and out of this PR's
  scope.
- The tour now mixes two photographic screenshots with one flat wireframe. It
  reads as unfinished until the third screenshot lands or the grid drops to two.
- `public/images/tour-report.svg` is the only wireframe left in the repo, and it
  still uses the old stand-in green rather than the real brand palette. Not worth
  restyling if it is about to be replaced by a real screenshot.

## Noticed during the build

- The webinar page collects registrations through the same lead form as every
  other page, distinguished only by `source: website-webinar`. If registration
  needs its own monday board or a calendar invite, that is a separate scenario
  and a separate decision.
- The role dropdown on the lead form offers advisor / agent / pension / other.
  These must match whatever the monday status column accepts, or Make will
  reject the value.
