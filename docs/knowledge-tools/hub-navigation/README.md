# Knowledge hub: meeting resources navigation

Baseline: main `fcf5f989af478a36bcc04f630173257113d4842f`, fetched before branching. The previous hub had a directory link below its track cards but no prominent tools block or direct links into track resources.

Adds a compact block immediately below the hub hero, with a directory link and one card for each audience. Native fragment links target the existing resources section. A scoped scroll offset keeps the heading below the sticky header; a focusable target lets keyboard users continue directly to the first tool. The previous directory link is moved into the new block.

## Verification

- `npm run build:knowledge`: pass, 67 total site pages generated.
- `npm run check:knowledge`: pass, 47 knowledge pages, 2,241 internal links, noindex/disclaimers/ownership and existing page-weight guardrails. Two independent runs have identical SHA256 `14F34C390F332D91D8E77E93737B3705DC4D8F7AAD6D4C30EAB6D724C80850A1`.
- Before the change: the built hub had zero `#meeting-tools` track links and no `meeting-tools-title` heading. After the change: all four new navigation links were clicked in Chrome; the directory loaded and each track exposed its five existing resources.
- Desktop 1440×1000: three cards in a row, no horizontal overflow, all four links visible beneath the hero. Screenshots: `evidence/hub-desktop.jpg` and `evidence/track-anchor-desktop.jpg`.
- Mobile 390×844: cards stack, no horizontal overflow, links have at least 50px height. The two hub screenshots show the upper/lower parts of the block; the track screenshot shows the destination.
- Keyboard: Tab from the directory reaches the agents card with a visible 3px outline; Enter navigates to `#meeting-tools`; the target receives focus; the next Tab reaches the fees calculator. Settled heading top is 136px, below the 77px desktop header. Mobile wealth heading top is 136px, below the 68px header.
- Only `HubPage.astro`, `TrackResources.astro` and knowledge-center documentation/evidence change. No shared stylesheet, layout, script, finance-core, content draft, approval table or indexing configuration changes.

`evidence/browser-checks.json` includes intermediate measurements taken immediately after native navigation; smooth scrolling was still in progress for those initial desktop readings. The separate settled keyboard measurement and mobile anchor measurement verify the final position.

The existing figures checker still reports ten figures needing an official source. This predates the navigation change and is already recorded in `../found-not-fixed.md`; the navigation follow-up changes no figures. This follow-up introduces no new calculator/template or print output.

## Status and approval

[Current five-batch status](../status.md) reconciles PR 63's merge with production and records the user's live verification within its stated scope. Professional line-by-line approval remains pending. Indexing requires that approval and the user's explicit decision. This navigation change is prepared as a PR for the user to review and merge.
