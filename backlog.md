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

## Blocking launch — must be filled before go-live

These are placeholders currently visible on the site.

- [ ] **Product-tour screenshots.** `public/images/tour-*.svg` are wireframe
      placeholders. Replace with real product screenshots (and update the alt
      text and captions in `src/pages/index.astro`).
- [ ] **Social proof.** Home page has three `[TBD]` cards. Either supply real
      testimonials, numbers and client logos — with written permission — or
      remove the section. No invented claims (ambiguity #8).
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

## Noticed during the build

- The webinar page collects registrations through the same lead form as every
  other page, distinguished only by `source: website-webinar`. If registration
  needs its own monday board or a calendar invite, that is a separate scenario
  and a separate decision.
- The role dropdown on the lead form offers advisor / agent / pension / other.
  These must match whatever the monday status column accepts, or Make will
  reject the value.
