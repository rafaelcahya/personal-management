---
name: ui-builder
description: Build or change pages and UI components in app/main/ and components/ for this repo — page folder structure, base components first, section cards, loading/empty/error states, modals and sheets, colors, responsive layout, ids for Cypress, and the build check. Use for any JSX UI work that isn't mainly a form, chart, or Storybook doc.
---

# UI Builder

## Page structure

```
app/main/{module}/.../{page}/
├── page.jsx            layout + data loading only
├── loading.jsx         route-level skeleton (optional)
├── components/         one file per section, chart, card, or table
└── hooks/              page-specific hooks (useSectionVisibility, ...)
```

- **Mandatory:** a page with more than one section/chart/card puts each one in its own file under `components/`. Never stack them all in `page.jsx`. Reference: `app/main/running/(app)/analytics/`.
- Shared page-level pieces: `app/main/components/` (e.g. `PageHeader`), `app/main/running/components/`, and `components/` for cross-module UI.
- Pages in `app/main/` are client components (`'use client'`) that load data through `lib/api/` (see `api-consumption`). Keep `'use client'` off pure presentational files that don't need it.
- Logic over ~20 lines (fetching, derived state, visibility toggles) goes in a hook, not in JSX.

## Base components first

Check `components/base/` before building anything. Read the component's `Guide.stories.jsx` for props and variants. Catalog and import paths: [references/base-components.md](references/base-components.md).

- Extend through props, `className`, or a wrapper. **Never edit a file in `components/base/`** without the Base Component Modification Request (below) approved by the user.
- If nothing fits, check `components/ui/` and `components/` before creating a new component.

## Standard states — every async section has all four

| State   | How                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------ |
| Loading | `Skeleton` shaped like the real content (rows for tables, blocks for cards) with an `id` like `{section}Skeleton_{page}` |
| Empty   | `EmptyState` (`EmptyStateTitle`, `EmptyStateDescription`, optional CTA button)                                           |
| Error   | message + **Retry** button that re-runs the load                                                                         |
| Success | the content; mutations confirm with `toast.success(...)` from `sonner`                                                   |

Patterns with real code: [references/state-patterns.md](references/state-patterns.md).

## Section card

Every section uses the card header pattern: **icon + title + subtitle**, then content. Use the `Section` wrapper style from `app/main/running/(app)/analytics/components/Section.jsx` (`Card`, `CardHeader`, `CardIcon`, `CardHeaderContent`, `CardTitle`, `CardDescription`, `CardContent`). Table headers are `uppercase tracking-wide`.

## Overlays

| Need                                    | Use                                                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Confirmation, short form (≤ 2–3 fields) | `Modal` (`ModalHeader layout="beside"` + `ModalIcon` + title/description, `ModalBody`, `ModalFooter`) |
| Long form, detail view                  | `Sheet` — full width on mobile, `md:w-[400px]`                                                        |
| Destructive action                      | `Modal` with a destructive confirm button — never delete on a single click                            |

## Colors

- Brand / accent: Tailwind **violet** scale (`text-violet-700`, `bg-violet-50`, `border-violet-100`, `bg-violet-500`). Neutrals: **slate**.
- Status: prefer semantic tokens in new code — `text-success`, `text-destructive`, `text-warning`, `bg-*-subtle`, `text-muted-foreground`. Profit = success/green, loss = destructive/red, always with a `+`/`-` sign too.
- Never raw hex in className. In charts and inline SVG, use `var(--color-*)` (see `chart-builder`).
- `--color-trade-profit/loss/warning` **do not exist** — don't use them.
- Full token list: `design-tokens` skill.

## ids (Cypress)

- Every interactive element and every state container gets an `id`: **`{elementName}_{pageName}`** in camelCase, e.g. `addNewEventBtn_eventPage`, `efTrendEmptyCount_analyticsPage`. Repeated or contextual elements add a middle part: `addNewProductBrandBtn_${context}_productBrandPage`.
- Never `data-testid`.
- Register every new id in **both** `cypress/fixtures/app-constants.json` and `.yaml` under `test_ids.{group}` (Grep the group first, e.g. `running_analytics`, `trading_event`).

## Responsive + accessibility

- Mobile-first; check 375px, 768px, 1280px. Grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Tables: wrap in `overflow-x-auto`.
- Touch targets ≥ 44px on mobile. Icons that only decorate get `aria-hidden="true"`; icon-only buttons get `aria-label`.
- Cards and sections get `aria-label`; dynamic messages use `aria-live` / `role="alert"`.
- Long lists: paginate (`Pagination` base component). No virtualization library is installed — propose one in your plan if a list really needs it.

## Done check

```bash
npx eslint <changed files> --fix --quiet
npx next build 2>&1 | tail -40
```

Both clean, then post the UI Ready handoff (`git-workflow`).

## Base Component Modification Request

```
⚠️ Base Component Modification Request
Component:   components/base/[X]/[X].jsx
Reason:      [why props/wrapper/composition don't work]
Change:      [exactly what changes]
Impact:      [which pages use it — Grep the import]
Alternative: [what you tried first]
```

Put it in your plan run. If approved, update the component **and** its `Guide.stories.jsx` (see `storybook-docs`).
