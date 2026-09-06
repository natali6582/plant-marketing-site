# Knowledge-center implementation and approval status

Status checked: 2026-09-06. Scope: `/knowledge/` only.

## Five-batch plan

| Batch | Deliverable | Repository status | Professional line-by-line approval |
| --- | --- | --- | --- |
| 1 | Shared engine, three calculators, tools directory | [PR 59](https://github.com/natali6582/plant-marketing-site/pull/59), merged to main | Pending; see `batch-1/content-approval.md` |
| 2 | Three meeting guides and fillable templates | [PR 60](https://github.com/natali6582/plant-marketing-site/pull/60), merged to its prerequisite branch; included in main through PR 62 | Pending; see `batch-2/content-approval.md` |
| 3 | Three fictional cases and prefilled calculators | [PR 61](https://github.com/natali6582/plant-marketing-site/pull/61), merged to its prerequisite branch; included in main through PR 62 | Pending; see `batch-3/content-approval.md` |
| 4 | Three scenario tools | [PR 62](https://github.com/natali6582/plant-marketing-site/pull/62), merged to main | Pending; see `batch-4/content-approval.md` |
| 5 | Three decision guides with dated sources | [PR 63](https://github.com/natali6582/plant-marketing-site/pull/63), merged to main | Pending; see `batch-5/content-approval.md` |

## PR 63 and production reconciliation

GitHub records PR 63 as merged on **2026-09-06 at 08:04:46 UTC (11:04:46 Israel time)**, by `natali6582`, into main at `fcf5f989af478a36bcc04f630173257113d4842f`. The previous handoff's description of an open draft PR is a historical snapshot, not the current status. All five batches are now included in main.

A fresh browser visit to `/knowledge/agents/decision-guide/` confirmed the live employee-to-self-employed guide, owner Natali, update/check date `2026-09-06`, fictional-example label and `noindex, nofollow`. This is consistent with the merged batch-5 content. The page does not expose a deployment commit identifier, so content matching is not proof of the exact served commit.

A fresh visit to `/knowledge/` also found the existing directory link below the track cards. The missing feature is a prominent tools-and-meeting-kits block with direct links to each track's resources section.

## Acceptance and remaining indexing gate

The user's live review accepted the observed interface and reported an independent recalculation matching all six figures in the fees calculator's worked example. The review also confirmed five resource items in the agents track, the directory structure and credits, the live agents decision guide, and an unchanged marketing home page.

This records the scope of that reported acceptance. It does **not** record professional line-by-line approval of all text, definitions or sources. The agent cannot supply that approval on Natali's behalf. The original approval tables remain pending.

Before any indexing change, Natali must review and approve:

- Calculation assumptions: deposits and accumulation, transaction timing and indexation.
- Guides, meeting checklists and limits of the results.
- Decision-guide sources and their checked dates.
- Fictional-case labels and example wording.
- Definitions and figures on the existing figures-2026 page.

Then the user must explicitly authorize indexing. **Keep noindex unchanged.** Publication in the current repository does not imply that the original professional-review gate was fulfilled; the live-review follow-up makes this outstanding review a condition of opening indexing.

## Navigation follow-up

Branch `fix/knowledge-hub-tools` starts from updated main `fcf5f98`. The follow-up adds “כלים וערכות לפגישה” immediately below the knowledge hub hero, links to `/knowledge/tools/` and each track's `#meeting-tools` section, and preserves the existing conceptual-content order. Only the hub and track-resource components change at runtime. No calculator, professional content, marketing page, shared layout, global stylesheet or indexing configuration changes.

Completion checks: build and existing knowledge checks; browser clicks for all four links; desktop/mobile layout and keyboard navigation; deterministic verification output; repository scope check. Evidence is recorded separately for this follow-up. The user reviews and merges the PR; the agent does not merge or publish.

Follow-up verification also found a knowledge-CI reporting error: run 15's external-links badge was green despite its log reporting 11/19 URLs verified (seven gov.il 403 responses and one clearinghouse timeout). The knowledge-only workflow now explicitly selects Bash with pipeline failure propagation, so `tee` cannot hide a failed check. Blocked URLs remain unverified; their content and URLs are unchanged. See `hub-navigation/README.md` for the evidence and distinction between a successful calculation check and an incomplete network check.
