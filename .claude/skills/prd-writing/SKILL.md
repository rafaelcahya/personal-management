---
name: prd-writing
description: Write or update the PRD files in .claude/prd/ for this repo — where a feature goes, the feature section template, acceptance criteria, validations and error states, numbering, version header and history, deprecation, and the writing style. Use for any PRD change, gap analysis, or prioritization.
---

# PRD Writing

## Files (PM owns all of them)

| File                                 | Covers                                                           |
| ------------------------------------ | ---------------------------------------------------------------- |
| `.claude/prd/PRD_Shared.md`          | API standards, UI/UX standards, DB tables, NFRs, product version |
| `.claude/prd/PRD_Inventory.md`       | Inventory (section 3.1)                                          |
| `.claude/prd/PRD_Trading.md`         | Trading (section 3.2)                                            |
| `.claude/prd/PRD_Auth.md`            | Auth + User Settings (sections 3.3–3.4)                          |
| `.claude/prd/PRD_Running_Tracker.md` | Running Tracker + AI Coach (own numbering)                       |
| `PRD_Personal_Management.md`         | Legacy — history only, never edit                                |

These files are large (15–221 KB). Read by section: Grep the heading, then Read with `offset`/`limit`.

## Writing style (user rule)

- Casual, easy-to-understand English. Short sentences. No formal or legal tone.
- Never use the section symbol — write "section 5.8".
- Say what the user sees and does; keep implementation detail to the API/DB parts.

## Feature section

Template: [references/feature-template.md](references/feature-template.md). Every feature has: Description, User Stories, Acceptance Criteria (GIVEN/WHEN/THEN, happy path **and** errors), Validations table, Error States table, Definition of Done.

User stories: "As a [user], I want to [action], so that [benefit]" — the benefit is something the user cares about ("so I can spot low stock"), not "so the data is saved". Every story maps to at least one acceptance criterion.

## Numbering

- Follow the numbering already in the file; add new features at the end of the module's section with the next number (3.1.6 → 3.1.7; sub-flows 3.1.1 D → 3.1.1 E).
- **Never renumber** existing sections — issues, commits, and other PRDs refer to them.
- A feature touching two modules lives in the primary module's file; the other file links to it ("Auth rules for this: see PRD_Auth.md section 3.3.0").

## Versions

- Every significant change bumps the file's header (`**Version:** 3.3` → `3.4`, `**Last Updated:**`) and adds a row to that file's **Version History** table at the bottom:

  ```markdown
  | 3.4 | 2026-10-17 | PM Agent | Added route pacing simulator (section 14.2); updated rate limits (section 5.5) |
  ```

- PRD version ≠ product release. Releases (v1.33…) live in each PRD's **Product Release Plan** and as GitHub milestones.

## Deprecation

Never delete — tag it:

```markdown
#### 3.1.4 Bulk CSV Import [DEPRECATED]

**Deprecated:** 2026-10-17 · **Reason:** low use, high upkeep · **Instead:** use the Add Product form
```

## Gap analysis and priority

For a module review, use the analysis report in [references/analysis-template.md](references/analysis-template.md).

| Priority | When                                                      |
| -------- | --------------------------------------------------------- |
| P0       | Broken flow, no workaround, or data-loss risk — build now |
| P1       | High value, low–medium effort — next                      |
| P2       | Nice to have, medium effort — backlog                     |
| P3       | Low value or high effort — parking lot                    |

Impact: High = core flow, Med = noticeable friction, Low = cosmetic. Effort: Low < 1 day, Med 2–5 days, High > 1 week. High impact + high effort → discuss with the user before calling it P0.

## After the PRD change

Create the feature issue (`github-issue-create`) with pointers to the exact sections, or — when agents are already working — post a PRD Change Impact comment (`git-workflow`).
