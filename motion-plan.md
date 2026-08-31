# Orion motion study → Plan-T implementation plan

Branch: `feat/orion-motion`, cut from `main` @ `d9ec8bd` (imagery PR merged, precondition met).

**What crosses over: behaviour only.** No Orion CSS, JS, image, logo, font, copy or
colour enters this repo. Every value below was measured from their public
stylesheets and live DOM on 31.08.2026, then written here as a number. Their
site is closed; everything is reimplemented in our own code, on our own tokens
(`ink` navy / `brand` blue / `accent` green), Heebo, our copy, and our existing
hero decision (framed product shot, straight, unchanged).

---

## Step 0 — measured values

Source: `orion.com` — Drupal, theme `themekit`. Read from
`/themes/custom/themekit/dist/css/*.css` and from computed styles on the live page.

### Motion primitives

| What | Measured value |
| --- | --- |
| Interactive transition (buttons, links) | `250ms ease-in-out`, properties `background-position, color, box-shadow` |
| Card hover | `transform: scale(1.01)` + `box-shadow: 0 2px 18px rgba(0,0,0,.25)`, `300ms ease-in-out`, `translateZ(0)` at rest |
| Card hover (vertical-card variant) | `box-shadow: 0 8px 24px rgba(39,39,48,.149)` on `:hover, :focus-within` |
| Image micro-transition inside cards | `all 100ms linear` |
| Active state | `transition: none` — the press is instant, only the release eases |

### Logo ticker (their `.ticker`, `plugable--scss--ticker.css`)

| What | Measured value |
| --- | --- |
| Keyframe | `translateX(0)` → `translateX(calc(-1 * 100px * N))` |
| Duration | `calc(N * 3s)`, `linear`, `infinite` |
| Live values on the homepage | `--ticker-elements: 8`, `animation-duration: 24s`, 48 nodes in the track |
| **Derived speed** | 800px ÷ 24s = **33.3 px/s** |
| Reduced motion | `calc(N * 20s)` → ~5 px/s. They *slow* it; they never stop it |
| Pause | `animation-play-state: paused` on `.ticker__content:hover` — **hover only, no focus** |
| Item box | `flex-shrink: 0`, `max-width: 175px`, `max-height: 70px`, `margin: 0 1rem` → `0 1.5rem` ≥768px |
| Item media | `height: 60px`, `object-fit: contain`, `filter: grayscale(1)`, `transition: filter 250ms ease-in-out` |
| Edge fades | `::before`/`::after`, `width: 5rem` → `10rem` ≥640px, `linear-gradient(to right, <band colour> 0%, transparent 100%)` |

Two flaws to fix rather than copy: the pause is hover-only, so a keyboard user
tabbing into a logo link cannot stop the motion; and reduced-motion merely
slows the animation instead of honouring the preference.

### Hero band (their `billboard`)

| What | Measured value |
| --- | --- |
| Vertical padding | `2.25rem` → `6.5rem` (104px) ≥768px |
| Diagonal edge | `clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 70px))` |
| Padding reserved for the slope | `+27px` mobile, `+72px` ≥768px, `+145px` on the homepage |
| H1 | `64px / 80px` line-height, `letter-spacing: 0.5px` |
| **Weight contrast** | line 1 `font-weight: 400`, line 2 `<strong>` `font-weight: 700` — *same size*, weight alone carries the contrast |

### Buttons

| What | Measured value |
| --- | --- |
| Pill | `border-radius: 25px`, `height: 44px`, `padding: 8px 40px` (primary) / `10px 32px` (aux) |
| Type | `1.125rem`, `font-weight: 600`, `letter-spacing: .16px` |
| Fill mechanic | `background-size: 200% 100%`, hover → `background-position: 100% 0`, 250ms ease-in-out |
| Ghost border | `box-shadow: inset 0 0 0 2px <colour>` — an inset shadow, not a border, so hover never shifts layout |
| Pair spacing | `.button + .button { margin-left: 20px }` → `40px` ≥768px; below 768px both go `width: 100%` and stack |

### Section rhythm

`88px` top/bottom default · `48px` small · `108px` large. Below 1024px the
bottom half collapses to `44px` / `54px`.

### Persona tabs

| What | Measured value |
| --- | --- |
| Strip | `display: flex`, `justify-content: center` ≥768px, `margin-bottom: 30px` |
| Mobile | `scroll-snap-type: x mandatory` + `overflow-x: scroll`, each tab `scroll-snap-align: center` |
| Tab width | `100%` mobile / `20%` ≥768px / `240px`, max `20%` ≥1024px |
| Rest | `.875rem` → `1.125rem` ≥1024px, weight 600, `border-bottom: 1px solid #4f4f59` |
| Active | weight 700, `1.125rem`, border-colour = brand |
| Panel | `display: none` → `.is-active { display: block }` |

### Scroll reveal

**Orion does not have one.** 67 scripts on the page, zero animation libraries
(no AOS, GSAP, ScrollReveal, WOW). The only `IntersectionObserver` on the site
belongs to `quicklink.umd.js`, a link *prefetcher*. Their content is simply
present on load.

---

## Where the brief guessed and the measurement disagrees

| Brief | Measured | Plan |
| --- | --- | --- |
| Marquee "~40–60 px/s" | **33.3 px/s** | Use 33.3 px/s — slower than the guess, and calmer beside dense Hebrew text |
| Cards "~24px radius" | **12px / 16px / 18px** | Use 16px, matching our existing `rounded-2xl`. 24px is larger than anything Orion ships |
| Card hover "1–2px lift, 150–200ms" | **`scale(1.01)`, 300ms** | Use `scale(1.01)` + shadow at 300ms. On a 420px card that reads as a ~2px lift on every edge — the brief's instinct, their mechanism |
| Tabs "crossfade ~200–250ms" | **no transition at all** | Ours is an addition, not a reproduction. 200ms opacity fade, marked as our own |
| Scroll reveal "450–600ms, 60–80ms stagger" | **does not exist on Orion** | Keep and refine what we already have. Values below are ours |

Flagging these is the point of Step 0: three of the seven patterns would
otherwise have been built to numbers Orion never used.

---

## Implementation

### 1 · Hero presentation — `src/pages/index.astro`

Copy, headline text and the framed screenshot stay exactly as they are. Changes:

- Split the existing two-line headline into weight contrast at one size:
  `אל תישאר מאחור.` at `font-normal`, `תתקדם ל־Plan-t` at `font-black`. Today
  both lines are `font-black`, so the contrast is carried by colour alone.
- Button pair: the existing green solid pill (`bg-accent-500`, `text-ink-950` —
  design law 2 holds, green stays the only CTA colour) gains a ghost sibling,
  `תיאום הדגמה` + `לצפייה בוובינר`. Ghost = `box-shadow: inset 0 0 0 2px #fff`,
  transparent ground, white text; hover wipes to a white ground with `ink-950`
  text over 250ms. Gap 20px → 40px ≥768px, both full-width below 768px.
- Diagonal bottom edge on the hero band, **mirrored for RTL**: their
  `polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 70px))` puts the low corner at
  the left; ours becomes `polygon(0 0, 100% 0, 100% calc(100% - 70px), 0 100%)`
  so the slope falls toward the right, with the section's bottom padding raised
  by 72px (145px is Orion's homepage figure — too deep for our shorter hero) so
  the clip never eats content.

### 2 · Stats row — `src/data/stats.json` + `src/components/StatsRow.astro`

Data-driven and empty by default:

```json
[]
```

`StatsRow.astro` imports the file and returns nothing when the array is empty,
so the section does not render until you supply real numbers. Each entry:
`{ "value": "", "label": "", "footnote": "" }`. Numerals large in `brand-600`
and `.ltr`-wrapped, label small in `ink-700`, footnote as a `<sup>` at 9px per
Orion, resolving to a footnote line under the row.

**Needs you:** the numbers, and a source for each. Nothing invented — an
unverifiable statistic on a financial-services site is a liability, and
`/about/` already carries two unverified claims in the backlog.

### 3 · Marquee — two options, your call

Identical motion in both: 33.3 px/s, linear, infinite, seamless via a duplicated
track, `ink-50` band, grayscale at rest with a 250ms filter transition, edge
fades 5rem → 10rem, travelling right→left — which is also the Hebrew reading
direction, so no mirroring is needed here.

Two fixes over Orion: pause on `:hover` **and** `:focus-within`, and a real
`prefers-reduced-motion: reduce` branch that stops the animation and lays the
items out as a static wrapped row.

Seamlessness is computed from the real track width — `translateX(-50%)` of a
track duplicated exactly once — not from Orion's `100px × N` constant, which
only loops cleanly if every item happens to be 100px wide.

- **Option A — partner/integration logos.** The pattern as Orion uses it, and
  the stronger trust signal. Blocked: needs logos you have explicitly cleared,
  and none are cleared today.
- **Option B — the six Plan-t AI capability chips** (icon + label, from the
  existing `aiCards` array on the homepage). Ships now, no clearance needed,
  same motion. Reads as a capability band rather than a trust band.

Recommendation: **B now, A later.** The component takes its items as a prop, so
swapping the content is a one-line change once logos are cleared.

### 4 · Persona tabs — `src/components/PersonaTabs.astro`, on Home

Three tabs from the existing `/solutions/` content, verbatim: ליועצים פיננסיים ·
לסוכני ביטוח · ליועצים פנסיוניים. Sliding underline indicator (our addition —
Orion uses a static per-tab border), 250ms ease-in-out on `transform`/`width`,
positioned with logical properties so it tracks correctly in RTL. Panel
crossfade 200ms opacity — also ours.

Real tab semantics, which Orion's markup lacks: `role="tablist"` / `role="tab"` /
`role="tabpanel"`, `aria-selected`, `aria-controls`, roving tabindex, and
arrow-key navigation reversed for RTL (`ArrowLeft` = next). Panels stay in the
DOM and are toggled with `hidden`, so the content is present without JS.

### 5 · Cards

Applied to the existing pain / AI / tour / principle cards: radius 16px
(`rounded-2xl`, already in use), `transition: box-shadow 300ms ease-in-out,
transform 300ms ease-in-out`, hover and `:focus-within` → `scale(1.01)` +
`0 2px 18px rgba(0,0,0,.25)`. Image cards get the image bled to the card edge
(`overflow-hidden`, image flush, no inner padding above it).

### 6 · Section rhythm

Alternating full-bleed `white` / `ink-50` bands. Our `--color-surface`
(`#f6f8fb`) already fills the ink-50 role, so the alternation uses tokens we
have. Vertical padding to Orion's scale: `88px` desktop / `44px` mobile
default, `108px` / `54px` for the large band. Centred headings pick up the same
weight mix as the hero.

### 7 · Scroll reveal — ours, not theirs

Orion has none, so this is a refinement of what `BaseLayout` already runs:
opacity `0→1`, `translateY(20px→0)`, **500ms ease-out**, **70ms stagger** within
a card group — mid-points of the brief's ranges, since there is nothing to
measure against.

This also closes the bug from the earlier review: `.reveal` sets `opacity: 0` in
CSS while `is-visible` only ever arrives from JS, so if the script fails, 14
elements on the homepage — every pain card, every AI card, the testimonial —
stay invisible permanently. Fix: gate the hidden state behind a `js` class set
on `<html>` by an inline script, so no-JS renders everything at full opacity.

---

## Risks

**The rebrand branch deletes this plan's content sources.** `design/01-typography`
removes the Plan-t AI content (killing Option B's six chips) and narrows
`/solutions/` to a single audience (killing the three personas behind the tabs).
The brief says to branch from `main`, so that is what this branch does — but if
that branch merges afterwards, patterns 3B and 4 lose their content, and the
merge will conflict in `index.astro`, `solutions.astro` and `global.css`. Worth
settling which branch is trunk before this one grows further.

**Scope discipline.** Behaviours only. No new copy, no new imagery, no palette
change, no hero re-decision. Anything noticed outside this list goes to
`backlog.md` unfixed, per §4.
