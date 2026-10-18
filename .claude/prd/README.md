# PRD

Product requirements, split into one file per feature so agents read only what a task needs.

## How to read

1. Start from the GitHub issue — its Notes point to the exact PRD file(s).
2. Otherwise open the module's `index.md`, find the feature, and read that one file.
3. Don't read `version-history.md` files unless you need past changes.
4. Section numbers (e.g. "section 3.1.2", "section 11.2") are unchanged — they live in the headings.

## Modules

| Module                     | Folder                             | Covers                                                           |
| -------------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| Shared standards           | [shared/](./shared/index.md)       | API standards, UI/UX standards, DB tables, NFRs, product version |
| Inventory                  | [inventory/](./inventory/index.md) | section 3.1                                                      |
| Trading                    | [trading/](./trading/index.md)     | section 3.2                                                      |
| Auth + User Settings       | [auth/](./auth/index.md)           | sections 3.3–3.4                                                 |
| Running Tracker + AI Coach | [running/](./running/index.md)     | own numbering                                                    |

## Writing rules

PM owns these files. See the `prd-writing` skill: casual English, no section symbol, never renumber, bump the module's `index.md` version and add a row to its `version-history.md` on every significant change.

`PRD_Personal_Management.md` is the legacy monolith — history only, never edit. The other `PRD_*.md` files are stubs that point to the new files.
