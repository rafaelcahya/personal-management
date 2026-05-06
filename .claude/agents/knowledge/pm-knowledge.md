# PM Agent — Knowledge Layer

> Reference cookbook for this project's product management work.
> These are the canonical templates. Always use these structures when writing requirements, analyzing features, or updating the PRD.

---

## Stack Identity

- **Domains**: Inventory Management, Stock Trading
- **Tech**: Next.js 15, Supabase, Claude Sonnet 4.6
- **PRD location**: `.claude/PRD.md` (single source of truth — you own this)
- **Users**: Individual users managing personal inventory and stock portfolio

---

## 1. PRD Feature Section Template

Every new feature added to `.claude/PRD.md` must follow this structure:

```markdown
## Feature: [Feature Name]

**Status:** Draft | Review | Approved | Deprecated
**Version:** 1.0
**Date:** YYYY-MM-DD
**Impacted Agents:** Frontend, Backend, Tester, UI/UX

### Description

[1–2 sentences: what this feature does and why it exists for the user]

### User Stories

- As a [user], I want to [action], so that [benefit].
- As a [user], I want to [action], so that [benefit].

### Acceptance Criteria
```

GIVEN [context]
WHEN [action]
THEN [expected result]

GIVEN [error context]
WHEN [invalid action]
THEN [error feedback shown to user]

```

### Validations
| Field | Rule | Error Message |
|-------|------|---------------|
| name | Required, max 100 chars | "Name is required" / "Name must be under 100 characters" |
| stock | Integer, min 0 | "Stock cannot be negative" |

### Error States
| Scenario | UI Behavior |
|----------|-------------|
| Network failure | Show inline error with retry CTA |
| 401 Unauthorized | Redirect to login |
| 500 Server error | Show toast: "Something went wrong. Please try again." |

### Definition of Done
- [ ] UI implemented per WCAG 2.1 AA
- [ ] API endpoint complete with validation and error handling
- [ ] Cypress test cases written and passing
- [ ] PRD updated with final spec
```

---

## 2. Feature Gap Analysis Template

Use this when analyzing an existing module:

```markdown
## Product Analysis Report

**Date:** YYYY-MM-DD
**Module:** [Inventory | Trading | Auth | Landing]
**Analyzed by:** PM Agent

### Findings

- [GAP] Missing empty state on inventory list — no CTA shown when no items exist
- [GAP] No bulk delete — users can only delete one item at a time
- [INCONSISTENCY] Error message format differs between create and update endpoints
- [IMPROVEMENT] Filter by stock level would reduce time to spot low-stock items

### Recommendations

| #   | Recommendation                                        | Priority | Effort | Impacted Agent    |
| --- | ----------------------------------------------------- | -------- | ------ | ----------------- |
| 1   | Add empty state with CTA to inventory list            | P0       | Low    | Frontend          |
| 2   | Standardize error message format across all endpoints | P1       | Low    | Backend           |
| 3   | Add bulk delete for inventory items                   | P2       | Med    | Frontend, Backend |
| 4   | Add filter by stock level                             | P2       | Med    | Frontend, Backend |

### PRD Changes Made

- Added: Inventory Empty State — section 3.4
- Updated: Error State Standards — section 1.5 (added consistency requirement)
```

---

## 3. Prioritization Framework

```markdown
| Priority | Criteria                                          | Action                                  |
| -------- | ------------------------------------------------- | --------------------------------------- |
| P0       | Broken user flow / no workaround / data loss risk | Build immediately                       |
| P1       | High user value, low–medium effort                | Next sprint                             |
| P2       | Nice to have, medium effort                       | Backlog — schedule when capacity allows |
| P3       | Low value or high effort                          | Parking lot — revisit quarterly         |
```

Scoring rules:

- **Impact**: High = core user flow affected; Med = noticeable friction; Low = cosmetic
- **Effort**: Low = < 1 day; Med = 2–5 days; High = > 1 week (across all agents)
- When Impact=High + Effort=High: always involve discussion before committing to P0

---

## 4. User Story Quality Checklist

Before adding a user story to the PRD:

- [ ] Follows format: "As a [user], I want to [action], so that [benefit]"
- [ ] The "so that" benefit is user-facing, not technical ("so that data is saved" is bad — "so that I can track my stock levels" is good)
- [ ] Each story maps to at least one acceptance criterion
- [ ] Acceptance criteria cover both happy path and error/edge cases
- [ ] Validations table is complete for all form inputs

---

## 5. PRD Update Rules (enforced)

```
1. Always read current PRD before editing — never overwrite without reading
2. Mark deprecated features with [DEPRECATED] tag — never delete
3. Add to version history at bottom of PRD on every significant change
4. Notify impacted agents in the feature section header
5. Every feature section must have: Description, User Stories, Acceptance Criteria, Validations, Error States, DoD
```

---

## 6. Version History Entry Format

```markdown
## Version History

| Version | Date       | Author   | Changes                                                                                   |
| ------- | ---------- | -------- | ----------------------------------------------------------------------------------------- |
| 1.2     | 2026-05-06 | PM Agent | Added bulk delete feature spec (section 3.6); updated error state standards (section 1.5) |
| 1.1     | 2026-04-20 | PM Agent | Added empty state requirement to inventory list                                           |
| 1.0     | 2026-04-01 | PM Agent | Initial PRD                                                                               |
```

---

## 7. Cross-Agent Communication Format

When notifying another agent of a change, include in the PRD comment or analysis report:

```markdown
**→ Frontend Agent**: Implement empty state component for inventory list (section 3.4)
**→ Backend Agent**: Standardize all error responses to { error, message } format (section 1.5)
**→ Tester Agent**: Add test case for empty state and error response format
**→ UI/UX Agent**: Design empty state illustration and CTA for inventory module
```

---

## 8. Feature Deprecation Format

```markdown
## Feature: Bulk CSV Import [DEPRECATED]

**Deprecated:** 2026-05-06
**Reason:** Low usage, high maintenance cost. Replaced by manual item creation flow.
**Migration:** Users should use the "Add Item" form for individual entries.
```
