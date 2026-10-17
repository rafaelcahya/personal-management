---
name: design-spec
description: Produce a UI/UX design spec for a feature in this repo — layout and hierarchy, every interactive and async state, mapping to base components, tokens, responsive behavior, test ids, and the handoff to Frontend. Use when a feature needs design decisions before Frontend builds it.
---

# Design Spec

Output: `.claude/design/{release}-{feature}-uiux-spec.md` (e.g. `v1.33-route-pacing-uiux-spec.md`). Reference: `.claude/design/v1.1-analytics-uiux-spec.md`. No code, no branch.

## Steps

1. Read the issue AC and the PRD section it points to (the caller pastes the issue into your brief).
2. Look at the page you're designing for (`app/main/...`) and its existing components — match what's there.
3. Write the spec with the template: [references/spec-template.md](references/spec-template.md).
4. Run the handoff checklist below.
5. Return the Design Handoff comment text in your final report (format in `git-workflow`).

## Principles

- **One clear primary action per view.** Hierarchy through size, weight, and spacing — not more colors.
- **Same thing, same look**: delete is always a destructive button + confirmation; money and paces are always `tabular-nums` with a sign where it matters.
- **Summary first, detail on demand** — expand, Sheet, or detail page.
- **Every async section has 4 states**: loading (skeleton shaped like the content), empty (title + reason + CTA when there's an action), error (message + retry), success.
- **Every interactive element has 5 states**: default, hover, active, focus (visible violet ring), disabled (with a reason — tooltip or helper text).
- Design within what exists: base components (`ui-builder` → base component catalog) and real tokens (`design-tokens`). If a base component can't do it, say so explicitly — that triggers a Base Component Modification Request for Frontend.

## Patterns

| Situation                         | Pattern                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| Confirm, quick add (≤ 2–3 fields) | `Modal`, header with icon + title + description, Cancel + action in footer                     |
| Long form, record detail          | `Sheet` from the right, full width on mobile, `md:w-[400px]`                                   |
| Delete / irreversible             | Modal with item name + "can't be undone", destructive button with loading state, success toast |
| Section of a page                 | `Card` with icon + title + subtitle header (`Section` pattern)                                 |
| Row actions                       | `DropdownMenu` (Edit, Delete), not a row of inline buttons                                     |
| Too little data for a chart       | EmptyState that says how much data is needed and how much exists                               |
| Feedback                          | `sonner` toast: success auto-dismisses; errors stay until dismissed                            |
| Long lists                        | Pagination (no virtualization library is installed)                                            |

Module notes:

- **Running** — violet accent, data-dense analytics sections with charts, AI coach cards with pending/failed states, Strava connection states (connected / needs reconnect).
- **Trading** — P&L always with sign + color, prices `tabular-nums`, confirmation before irreversible actions, filters by date range / type.
- **Inventory** — table-first, low-stock badge (warning), bulk action bar only when rows are selected, add button top-right of the header.

## Handoff checklist

- [ ] Layout for 375px, 768px, 1280px
- [ ] All 5 interactive states and all 4 async states defined
- [ ] Every element mapped to a base component (or flagged as missing)
- [ ] Colors from real tokens only (no `--color-trade-*`, no hex)
- [ ] Touch targets ≥ 44px; focus order follows reading order
- [ ] Destructive actions have a confirmation step
- [ ] Test ids listed (`{elementName}_{pageName}`)
- [ ] Accessibility notes (labels, `aria-live` for async messages, chart `aria-label`) — see `a11y-review`
