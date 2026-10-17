---
name: prd-writing
description: Write or update the PRD files in .claude/prd/ for this repo — where a feature goes, the feature section template, acceptance criteria, validations and error states, numbering, version header and history, deprecation, and the writing style. Use for any PRD change, gap analysis, or prioritization.
---

# PRD Writing

## Files (PM owns all of them)

One folder per module, **one file per feature**. Each folder has an `index.md` (title, `**Version:**`, file list) and a `version-history.md`. Start from [.claude/prd/README.md](../../prd/README.md).

| Folder                   | Covers                                                           |
| ------------------------ | ---------------------------------------------------------------- |
| `.claude/prd/shared/`    | API standards, UI/UX standards, DB tables, NFRs, product version |
| `.claude/prd/inventory/` | Inventory (section 3.1)                                          |
| `.claude/prd/trading/`   | Trading (section 3.2)                                            |
| `.claude/prd/auth/`      | Auth + User Settings (sections 3.3–3.4)                          |
| `.claude/prd/running/`   | Running Tracker + AI Coach (own numbering)                       |

- `PRD_Personal_Management.md` — legacy, history only, never edit. The other `PRD_*.md` files are stubs that map old sections to the new files; never write in them.
- Read only the feature file you're changing (plus the module `index.md` when you bump the version). Skip `version-history.md` unless you need past changes.

## Adding a feature

- New feature → a new file in the module folder, named in kebab-case after the feature (`route-simulator.md`), starting with its numbered heading. Add it to the file table between the `<!-- files:start -->` / `<!-- files:end -->` markers in the module's `index.md`.
- Change to an existing feature → edit its file only.
- A feature that clearly belongs to a sub-area of a large file may get its own file — move the whole numbered section, keep the number, and update `index.md`.

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
- A feature touching two modules lives in the primary module's file; the other file links to it ("Auth rules for this: see `auth/authentication.md`, section 3.3.0").

## Versions

- Every significant change bumps the **module's** `index.md` header (`**Version:** 3.3` → `3.4`, `**Last Updated:**`) and adds a row to the module's `version-history.md`:

  ```markdown
  | 3.4 | 2026-10-17 | PM Agent | Added route pacing simulator (section 14.2); updated rate limits (section 5.5) |
  ```

- PRD version ≠ product release. Releases (v1.33…) live in each module's **Product Release Plan** (in `index.md` for shared and running) and as GitHub milestones.

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

Create the feature issue (`github-issue-create`) with the exact PRD file path(s), or — when agents are already working — post a PRD Change Impact comment (`git-workflow`).
