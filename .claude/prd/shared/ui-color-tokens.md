## 5. UI/UX Standards

- **Design System:** Base Components + Tailwind CSS
- **Color Tokens:** see Color Token System below
- **Responsive:** Mobile-first, minimal breakpoints tablet (768px) and desktop (1024px)
- **Loading States:** Every async operation must show a skeleton or spinner
- **Empty States:** Every list must have a display state when data is empty
- **Error States:** Every form and API call must handle errors with clear messages
- **Accessibility:** WCAG 2.1 AA (keyboard nav, contrast ratio, aria labels, semantic HTML)

### Color Token System

All color tokens are defined as CSS variables in `app/globals.css` (HSL format) and mapped to Tailwind in `tailwind.config.ts`. Always use Tailwind classes — never reference CSS variables directly in JSX.

**Defined in:** `app/globals.css` + `tailwind.config.ts`  
**Storybook docs:** `Base/Colors` story

#### Token Groups

| Group          | Tokens                                                                                                                                                 | Usage                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Surfaces**   | `background`, `foreground`, `card` / `card-foreground`, `popover` / `popover-foreground`                                                               | Page and card backgrounds                                        |
| **Brand**      | `primary` / `primary-foreground`, `secondary` / `secondary-foreground`                                                                                 | Main CTA and supporting actions                                  |
| **UI**         | `muted` / `muted-foreground`, `accent` / `accent-foreground`, `border`, `input`, `ring`                                                                | Neutral UI chrome                                                |
| **Feedback**   | `destructive` / `destructive-foreground`, `success` / `success-foreground`, `warning` / `warning-foreground`, `info` / `info-foreground`               | Full-strength status colors                                      |
| **Additional** | `success-subtle` / `success-subtle-foreground`, `destructive-subtle` / `destructive-subtle-foreground`, `warning-subtle` / `warning-subtle-foreground` | Tinted surface variants — use for profit/loss text, status pills |
| **Charts**     | `chart-1` through `chart-5`                                                                                                                            | Recharts data series                                             |

#### Usage Rules

- Hover states use Tailwind opacity modifiers — `hover:bg-primary/90`, `hover:bg-secondary/80` — never a separate hover token
- Profit/loss text: `text-success-subtle-foreground` (green) and `text-destructive-subtle-foreground` (red)
- Cancel buttons in dialogs: `bg-transparent hover:bg-secondary/80 text-secondary-foreground border-none`
- Dark mode: all tokens have `.dark` variants — do not hardcode light-mode hex values

#### Token Reference Table

Complete token inventory sourced from `app/globals.css` and `tailwind.config.ts`. All tokens have full light + dark parity. Always use the **Tailwind Class** column — never reference CSS variables directly in JSX.

**Surfaces**

| Tailwind Class                      | CSS Variable           | Light (HSL) | Dark (HSL)  | Usage                                                                                        |
| ----------------------------------- | ---------------------- | ----------- | ----------- | -------------------------------------------------------------------------------------------- |
| `bg-background` / `text-background` | `--background`         | `0 0% 100%` | `0 0% 3.9%` | Page background — replaces `bg-white` on `<body>` / page wrappers                            |
| `text-foreground`                   | `--foreground`         | `0 0% 3.9%` | `0 0% 98%`  | Default body text — replaces `text-slate-900`                                                |
| `bg-card` / `text-card`             | `--card`               | `0 0% 100%` | `0 0% 3.9%` | Card / section surface — replaces `bg-white` in Page Container and Data Table outer sections |
| `text-card-foreground`              | `--card-foreground`    | `0 0% 3.9%` | `0 0% 98%`  | Text on card surface                                                                         |
| `bg-popover`                        | `--popover`            | `0 0% 100%` | `0 0% 3.9%` | Dropdown / Select / Combobox menu surface                                                    |
| `text-popover-foreground`           | `--popover-foreground` | `0 0% 3.9%` | `0 0% 98%`  | Text on popover surface                                                                      |

**Brand**

| Tailwind Class              | CSS Variable             | Light (HSL)    | Dark (HSL)    | Usage                                      |
| --------------------------- | ------------------------ | -------------- | ------------- | ------------------------------------------ |
| `bg-primary`                | `--primary`              | `262 83% 58%`  | `263 70% 70%` | Primary CTA, active state, brand violet    |
| `text-primary-foreground`   | `--primary-foreground`   | `0 0% 98%`     | `262 83% 10%` | Text on primary surface                    |
| `text-primary`              | `--primary`              | `262 83% 58%`  | `263 70% 70%` | Violet text (links, active nav item label) |
| `bg-secondary`              | `--secondary`            | `250 100% 98%` | `262 30% 18%` | Secondary action / tinted violet surface   |
| `text-secondary-foreground` | `--secondary-foreground` | `262 83% 58%`  | `263 70% 70%` | Text on secondary surface                  |

**UI Chrome**

| Tailwind Class           | CSS Variable          | Light (HSL)      | Dark (HSL)       | Usage                                                                                                  |
| ------------------------ | --------------------- | ---------------- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| `bg-muted`               | `--muted`             | `240 4.8% 95.9%` | `240 3.7% 15.9%` | Neutral subtle background — replaces `bg-slate-50`, `bg-slate-100`, `bg-gray-200` (Skeleton)           |
| `text-muted-foreground`  | `--muted-foreground`  | `240 3.8% 46.1%` | `240 5% 64.9%`   | Secondary / helper text — replaces `text-slate-400`, `text-slate-500`                                  |
| `bg-accent`              | `--accent`            | `240 4.8% 95.9%` | `240 3.7% 15.9%` | Hover / highlight state on menu items                                                                  |
| `text-accent-foreground` | `--accent-foreground` | `240 5.9% 10%`   | `0 0% 98%`       | Text on accent surface                                                                                 |
| `border-border`          | `--border`            | `240 5.9% 90%`   | `240 3.7% 15.9%` | Default border — replaces `border-slate-100`, `border-slate-200`, `border-gray-200`, `border-gray-300` |
| `border-input`           | `--input`             | `240 5.9% 90%`   | `240 3.7% 15.9%` | Form control border (Input, Select, Checkbox)                                                          |
| `ring-ring`              | `--ring`              | `262 83% 58%`    | `263 70% 70%`    | Focus ring base — used via `focus-visible:ring-ring`                                                   |

**Feedback — Full Strength**

| Tailwind Class                | CSS Variable               | Light (HSL)     | Dark (HSL)      | Usage                       |
| ----------------------------- | -------------------------- | --------------- | --------------- | --------------------------- |
| `bg-destructive`              | `--destructive`            | `0 84.2% 60.2%` | `0 62.8% 30.6%` | Delete / danger action      |
| `text-destructive-foreground` | `--destructive-foreground` | `0 0% 98%`      | `0 0% 98%`      | Text on destructive surface |
| `bg-success`                  | `--success`                | `142 71% 45%`   | `142 71% 35%`   | Success full-strength       |
| `text-success-foreground`     | `--success-foreground`     | `0 0% 98%`      | `0 0% 98%`      | Text on success surface     |
| `bg-warning`                  | `--warning`                | `38 92% 50%`    | `38 92% 38%`    | Warning full-strength       |
| `text-warning-foreground`     | `--warning-foreground`     | `20 14% 4%`     | `0 0% 98%`      | Text on warning surface     |
| `bg-info`                     | `--info`                   | `217 91% 60%`   | `217 91% 50%`   | Info full-strength          |
| `text-info-foreground`        | `--info-foreground`        | `0 0% 98%`      | `0 0% 98%`      | Text on info surface        |

**Feedback — Subtle (tinted surface variants)**

| Tailwind Class                       | CSS Variable                      | Light (HSL)   | Dark (HSL)    | Usage                     |
| ------------------------------------ | --------------------------------- | ------------- | ------------- | ------------------------- |
| `bg-success-subtle`                  | `--success-subtle`                | `138 76% 97%` | `142 76% 10%` | Profit pill background    |
| `text-success-subtle-foreground`     | `--success-subtle-foreground`     | `160 84% 39%` | `160 84% 55%` | Profit text / green label |
| `bg-destructive-subtle`              | `--destructive-subtle`            | `0 86% 97%`   | `0 86% 10%`   | Loss pill background      |
| `text-destructive-subtle-foreground` | `--destructive-subtle-foreground` | `0 84% 60%`   | `0 84% 70%`   | Loss text / red label     |
| `bg-warning-subtle`                  | `--warning-subtle`                | `33 100% 96%` | `33 100% 12%` | Warning tinted surface    |
| `text-warning-subtle-foreground`     | `--warning-subtle-foreground`     | `25 95% 53%`  | `25 95% 65%`  | Warning label text        |

**Charts**

| Tailwind Class                | CSS Variable | Light (HSL)   | Dark (HSL)    | Usage             |
| ----------------------------- | ------------ | ------------- | ------------- | ----------------- |
| `bg-chart-1` / `fill-chart-1` | `--chart-1`  | `12 76% 61%`  | `220 70% 50%` | Recharts series 1 |
| `bg-chart-2` / `fill-chart-2` | `--chart-2`  | `173 58% 39%` | `160 60% 45%` | Recharts series 2 |
| `bg-chart-3` / `fill-chart-3` | `--chart-3`  | `197 37% 24%` | `30 80% 55%`  | Recharts series 3 |
| `bg-chart-4` / `fill-chart-4` | `--chart-4`  | `43 74% 66%`  | `280 65% 60%` | Recharts series 4 |
| `bg-chart-5` / `fill-chart-5` | `--chart-5`  | `27 87% 67%`  | `340 75% 55%` | Recharts series 5 |

#### Audit Findings — Issue #700

**`:root` → `.dark` parity:** ✅ No gaps — every token defined in `:root` has a corresponding `.dark` value.

**Tailwind config mapping:** ✅ No gaps — all tokens are mapped under `theme.extend.colors` in `tailwind.config.ts`.

**`components/base/` hardcoded colors:** ⚠️ Gap found — the following components still use raw Tailwind colors instead of token classes. These must be migrated before dark mode (#698) and glass theme (#699) will work correctly:

| Component        | Hardcoded colors to replace                                                                                                    | Token to use                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `Card.jsx`       | `bg-white`, `border-slate-200`, `border-slate-100`, `text-slate-900`, `text-slate-500`                                         | `bg-card`, `border-border`, `text-card-foreground`, `text-muted-foreground`                             |
| `Tabs.jsx`       | `bg-slate-100`, `text-slate-500`, `text-slate-800`, `text-slate-900`, `text-slate-700`, `border-slate-200`, inline hex RGB     | `bg-muted`, `text-muted-foreground`, `text-foreground`, `border-border`                                 |
| `Checkbox.jsx`   | `border-gray-300`, `bg-white`, `bg-violet-600`, `border-violet-600`, `hover:border-violet-400`, `bg-red-500`, `border-red-500` | `border-input`, `bg-background`, `bg-primary`, `border-primary`, `bg-destructive`, `border-destructive` |
| `Skeleton.jsx`   | `bg-gray-200`, `border-gray-200`, `bg-white` (SkeletonCard)                                                                    | `bg-muted`, `border-border`, `bg-card`                                                                  |
| `EmptyState.jsx` | `text-gray-300`, `text-gray-700`, `text-gray-400`, `text-red-300`, `text-red-700`, `text-red-400`                              | `text-muted-foreground`, `text-foreground`, `text-destructive`                                          |
| `Button.jsx`     | `focus-visible:ring-violet-200`, `focus-visible:border-violet-600`                                                             | `focus-visible:ring-ring/30`, `focus-visible:border-ring`                                               |
| `Input.jsx`      | `focus-visible:ring-violet-200`, `focus-visible:border-violet-600`, `selection:bg-violet-500`                                  | `focus-visible:ring-ring/30`, `focus-visible:border-ring`, `selection:bg-primary/50`                    |
| `Select.jsx`     | `focus-visible:ring-violet-200`, `focus-visible:border-violet-600`                                                             | `focus-visible:ring-ring/30`, `focus-visible:border-ring`                                               |
| `Combobox.jsx`   | `focus-visible:ring-violet-200`, `focus-visible:border-violet-600`, `hover:bg-gray-100`                                        | `focus-visible:ring-ring/30`, `focus-visible:border-ring`, `hover:bg-accent`                            |

> The `focus-visible:ring-violet-200 focus-visible:border-violet-600` pattern is also used in **Form Field Styling Standard** (PRD section 5 → Form → Text Input Field). That standard should be updated to `focus-visible:ring-ring/30 focus-visible:border-ring` after base component migration is complete.

#### Removed Tokens (do not use)

| Old token                                    | Replacement                          |
| -------------------------------------------- | ------------------------------------ |
| `secondary-hover`                            | `hover:bg-secondary/80`              |
| `tertiary`                                   | removed — use `muted` or `accent`    |
| `trade-profit` / `var(--color-trade-profit)` | `text-success-subtle-foreground`     |
| `trade-loss` / `var(--color-trade-loss)`     | `text-destructive-subtle-foreground` |
| `trade-warning`                              | `text-warning-subtle-foreground`     |
