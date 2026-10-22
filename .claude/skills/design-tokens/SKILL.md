---
name: design-tokens
description: The real color, spacing, typography, and focus tokens of this repo (Tailwind 3.4 + app/tokens.css palette variables + app/globals.css semantic tokens) and how to apply them in className, charts, and design specs. Use whenever choosing colors, status styles, focus rings, or spacing in a spec or component.
---

# Design Tokens

Tailwind **3.4**. Two CSS files define the tokens:

| File              | What's in it                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/tokens.css`  | Palette variables for every Tailwind color: `--color-violet-600`, `--color-slate-500`, `--color-red-500`, ... (use in charts, SVG, inline styles) |
| `app/globals.css` | Semantic tokens mapped onto the palette, plus dark mode (`.dark`) and a violet theme variant (`.violet.dark`)                                     |

Tailwind config maps the semantic tokens to classes (`text-success`, `bg-destructive-subtle`, `text-muted-foreground`, `border-border`, `bg-chart-1`, ...).

## Semantic tokens

| Token                                  | Light value           | Use for                                                         |
| -------------------------------------- | --------------------- | --------------------------------------------------------------- |
| `primary` / `primary-foreground`       | black-900 / slate-50  | Default `Button` — **primary is black, not violet**             |
| `secondary`                            | slate-100             | Secondary buttons, quiet backgrounds                            |
| `muted` / `muted-foreground`           | slate-100 / slate-500 | Secondary text, metadata, axis labels                           |
| `border`, `input`                      | slate-200             | Borders, input outlines                                         |
| `ring`                                 | black-900             | Default focus ring — **override with violet on fields** (below) |
| `success` (+ `-subtle`, `-foreground`) | green-600             | Positive values, profit, completed                              |
| `destructive` (+ `-subtle`)            | red-500               | Errors, loss, delete actions                                    |
| `warning` (+ `-subtle`)                | amber-500             | Caution, near-limit, pending                                    |
| `info` (+ `-subtle`)                   | blue-500              | Neutral notices                                                 |
| `chart-1` … `chart-5`                  | hsl palette           | Default series colors                                           |

`--color-trade-profit`, `--color-trade-loss`, `--color-trade-warning`, and `--color-tertiary` **don't exist** — older docs mention them; never use them.

## Brand and neutrals (what the code actually uses)

- **Accent / brand: violet** — `violet-600` (`#7c3aed`) for CTAs that need emphasis, active states, highlights, focus. Common classes: `text-violet-700`, `bg-violet-50`, `border-violet-100`, `bg-violet-500`.
- **Neutrals: slate** — `text-slate-500/700` for text that matters (slate-500 is 4.8:1 on white); `text-slate-400` (2.6:1) only for decorative captions; `border-slate-200`, `bg-slate-100`.
- **Status:** prefer the semantic classes (`text-success`, `text-destructive`, `bg-warning-subtle`) over raw `green-*`/`red-*` in new code. Always pair color with a sign or label (`+12.4%`, `−3.2%`, "Low stock").

## Field focus (required on every input and textarea)

```
text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500
```

Native `<textarea>` without the base component: `focus:outline-none focus:ring-2 focus:ring-violet-500`. Error state adds `border-rose-500`.

## Charts and SVG

Chart axis ticks and SVG text: `fontSize: 11` at the least (Recharts `tick={{ fontSize: 11 }}`, SVG `fontSize={11}`), the same floor as `text-2xs`.

Use CSS variables, never hex: `var(--color-violet-600)`, `var(--color-border)`, `var(--color-muted-foreground)`, `var(--color-success)`, `var(--color-destructive)`, `var(--chart-1)`.

## Spacing and type

- 4px grid via the Tailwind scale: `gap-2` (8), `gap-4` (16, default inside sections), `gap-6` (24, between sections / card padding), `gap-8` (32).
- Page title `text-2xl font-semibold md:text-3xl`; section title via `CardTitle`; metadata `text-xs text-slate-400` or `text-sm text-muted-foreground`.
- Numbers, prices, paces, IDs: `tabular-nums` (and `font-mono` where columns must align).
- Table headers: `uppercase tracking-wide text-xs`.
- Smallest text is `text-2xs` (11px): tiny labels, badges, chart captions. Never write `text-[10px]`, `text-[9px]` or any arbitrary size under 11px. It is readable on a phone; smaller is not.

## Rules

- No raw hex in `className`. Arbitrary values only through variables: `text-[var(--color-violet-600)]`.
- Don't add new tokens in `globals.css` / `tokens.css` without a plan approval — they're global.
- Check dark mode when you use palette classes directly (`dark:` variants), or prefer semantic tokens that already switch.
