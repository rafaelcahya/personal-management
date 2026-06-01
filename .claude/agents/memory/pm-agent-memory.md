# PM Agent Memory

> This file is the persistent memory for the Senior PM Agent.
> Update this file after every significant product decision, analysis, or PRD change.
> Format: newest entries at the top of each section.

---

## Architectural Decisions

<!-- Record product-level decisions: why a feature was scoped a certain way, what was cut and why, trade-offs accepted -->

| Date                | Decision          | Rationale    | Impact                        |
| ------------------- | ----------------- | ------------ | ----------------------------- |
| <!-- YYYY-MM-DD --> | <!-- decision --> | <!-- why --> | <!-- which agent / module --> |

---

## Feature Priority History

<!-- Track how priorities shifted over time and why. Helps avoid re-debating closed decisions. -->

| Date                | Feature          | Old Priority   | New Priority   | Reason          |
| ------------------- | ---------------- | -------------- | -------------- | --------------- |
| <!-- YYYY-MM-DD --> | <!-- feature --> | <!-- P0–P3 --> | <!-- P0–P3 --> | <!-- reason --> |

---

## PRD Change Log

<!-- High-level log of significant PRD edits. Detailed history lives in PRD.md version section. -->

| Date       | Section              | Change Type | Summary                                                                                                                                                                                      |
| ---------- | -------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-30 | 10.4 Derived Metrics | Updated     | Marked EF trend arrow, VO2max trend on Analytics page, and full Analytics page as DONE. Updated EF tile testid. Bumped to v2.7. Post-delivery validation for v1.1: 12/12 criteria PASS.      |
| 2026-05-27 | 13 Race Log          | Updated     | Synced PRD with actual implementation: column names position_place/position_male, table layout, detail page, GET :id endpoint, "add from activity" flow, known test ID gaps. Bumped to v2.5. |
| 2026-05-17 | 3.1.3 Product Name   | Updated     | Removed P0 gap table and "not yet implemented" notes from API specs — all gaps resolved by Backend + Frontend. Bumped to v1.15.                                                              |

---

## Lessons Learned

<!-- Things discovered during analysis that are non-obvious — patterns, recurring gaps, or scope traps -->

- <!-- YYYY-MM-DD: lesson -->

---

## Cross-Agent Signals

<!-- Flags raised by other agents that PM needs to act on (UX concerns, infeasibility, quality gaps) -->

| Date                | From Agent                      | Signal                     | PM Action Taken                                |
| ------------------- | ------------------------------- | -------------------------- | ---------------------------------------------- |
| <!-- YYYY-MM-DD --> | <!-- Frontend/Backend/QA/UX --> | <!-- what they flagged --> | <!-- PRD update / deprioritized / accepted --> |

---

## Recurring Scope Traps

<!-- Features or requirements that keep getting misunderstood or gold-plated — note them here to prevent repeat -->

- <!-- e.g., "Bulk export always gets scoped too large — cap at CSV-only unless explicitly requested" -->

---

## Open Questions

<!-- Unresolved product questions pending stakeholder input or more data -->

- <!-- YYYY-MM-DD: question | blocked on: ... -->
