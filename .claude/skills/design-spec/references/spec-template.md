# Design Spec Template

```markdown
# [Release] UI/UX Design Spec — [Feature]

**Date:** YYYY-MM-DD
**Issue:** #n
**PRD:** `.claude/prd/{module}/{feature}.md`
**Module:** Running | Trading | Inventory | Auth | Shared

## 1. [Section / Component name]

### Problem

[What user pain this solves — 1–2 sentences]

### Placement

[Which page, where on it, what it sits next to]

### Layout & hierarchy

[What's prominent, what's secondary. Mobile → desktop changes.]

### Component structure

- `Section` (Card) — icon: `[LucideIcon]`, title "...", subtitle "..."
  - [child] → `components/base/[X]`
  - ...

### Data shown

| Field | Format                   | Notes      |
| ----- | ------------------------ | ---------- |
| pace  | `m:ss /km`, tabular-nums | null → "—" |

### States

| State             | Behavior                                           |
| ----------------- | -------------------------------------------------- |
| Loading           | skeleton: [shape]                                  |
| Empty             | title "...", description "...", CTA "..." (if any) |
| Error             | "...", Retry button                                |
| Success           | ...                                                |
| Disabled (if any) | why + how the user learns it                       |

### Interaction

[Clicks, hovers, keyboard, what opens what]

### Tokens & classes

[Exact classes / variables for anything non-default]

### Accessibility

[Labels, aria-live, focus management, chart aria-label]

### Test ids

| Element      | id                         |
| ------------ | -------------------------- |
| Section      | `[section]Section_[page]`  |
| Retry button | `[section]RetryBtn_[page]` |

---

## Summary table

| #   | Component | Page | New base component needed? |
| --- | --------- | ---- | -------------------------- |
```
