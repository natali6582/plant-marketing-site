# Working rules for this project

This is a static Astro site — Hebrew, RTL, no backend, no database, no runtime.
It is deployed straight to production from `main`; there is no preview
environment (branch builds on this Cloudflare Worker fail by design, because
preview deployments are not enabled). **A merge to `main` is a publish.**

## The honest state of testing here

This project has **no test runner and no unit tests**, and that is a deliberate
choice, not an oversight. What exists instead:

| Check | What it proves | How it runs |
| --- | --- | --- |
| `npm run build` | Every page compiles and routes | Headless, ~5s, **automatic on every source edit** |
| `scripts/check-typography.js` | The face and weight the browser *actually* applies; no overflow or clipped headings at two widths | Browser console, needs a running preview |
| `scripts/check-content.js` | Copy, metadata, form contract, no blank regions (288 assertions) | Browser console, needs a running preview |
| `scripts/check-community.js` | The community page and its form, including network behaviour (63 assertions) | Browser console, needs a running preview |

The three `check-*.js` files are **not** a test suite you can run in CI. They
are console scripts that load every route in same-origin iframes and read
`getComputedStyle`. The reason is written at the top of each file and it is a
good one: proving which font the browser resolved, or that a region actually
painted, needs a real browser. `vitest` + `happy-dom` cannot do it, and
Playwright would add ~200MB of browsers to a site whose entire JS payload is
12KB.

So do not invent an `npm test`. There is nothing behind it.

## The cycle

Adapted from red-green-refactor to what this project can actually verify.

1. **RED — write the assertion first.** Before changing behaviour, add the
   assertion to whichever `check-*.js` covers it. Run it and watch it fail.
   If the change is a bug fix, the assertion must reproduce the bug.
2. **GREEN — make it pass.** The smallest change that satisfies the assertion.
3. **REGRESS — run the whole file, not just your assertion.** All 288 content
   checks, not the three you added. A number in the pass column that went down
   is a regression, and it blocks the task.

Never delete, skip, or weaken an assertion to make a run green. If an existing
assertion is genuinely wrong, say so and change it deliberately, in its own
commit, with the reason.

## Definition of done — two tiers, and be explicit about which you reached

This is the rule that matters most here, because getting it wrong has shipped
visible defects to production more than once.

**Tier 1 — what you can certify alone (headless):**

- `npm run build` exits 0
- Built markup contains what you expect (`grep` over `dist/`)
- Numeric properties computed from source: contrast ratios, animation
  durations derived from measured values, file sizes, byte-level diffs

**Tier 2 — what requires a human with a browser:**

- Whether anything is *visible*, and whether it looks right
- Whether an animation reads as intended, or as a page still loading
- Whether an image is legible under an overlay
- Anything gated on `IntersectionObserver`, `prefers-reduced-motion`, hover,
  or focus
- The three `check-*.js` scripts, all of which need a live preview

**You may not report Tier 2 work as done.** Report exactly what you verified,
name what you did not, and hand over the preview URL so it can be checked:

```bash
npm run build && npm run preview
```

Then say plainly: *"Built and deployed; the animation itself has not been seen
running by anyone. Please look at http://localhost:4321/ before this merges."*

### Why this rule exists

Four defects reached production in one session, all from the same cause —
a visual decision made without being able to see the result:

- Words in a heading ran together, because the split moved words between
  wrappers and left the spaces behind
- Fourteen elements on the home page were permanently invisible, because the
  stylesheet hid them and only JavaScript could unhide them
- Two photographs were loaded, served, and effectively black, because an
  opacity of 30% under a 90% veil compounds to nothing
- A hero image was replaced without checking how a light image would sit on a
  dark band

Every one of them would have been caught by one look at `localhost:4321`.
None of them broke the build.

## The build hook

`.claude/settings.json` runs `scripts/build-on-edit.mjs` after every `Edit` or
`Write`. It rebuilds only when the edited path can affect output (`src/`,
`public/`, `astro.config`, `package.json`), and exits 2 with the compiler error
when the build breaks, which stops the work until it is fixed.

Two notes for anyone changing it. `jq` is **not** installed on this machine, so
the documented `jq -r '.tool_input.file_path' | …` hook pattern fails silently —
it runs, finds no `jq`, and never builds. And when testing whether the build
catches a broken page, do not name the test file with a leading underscore:
Astro excludes `_`-prefixed files from routing, so it is never compiled and the
build passes for the wrong reason.

## Scope discipline

Anything noticed outside the agreed task goes into `backlog.md` unfixed, with
what was seen and why it was left. Do not fix it silently in passing.

Copy on this site is approved content. Do not reword, translate, or invent
Hebrew — including accessible names and `alt` text. If a string is needed that
does not exist yet, add it and flag it for approval in `backlog.md`.

Numbers about the business — client counts, sums under management, returns —
are never invented, not even as placeholders. `src/data/stats.json` ships as an
empty array for exactly this reason, and the section does not render while it
is empty.
