---
name: a11y-review
description: Check a design spec or JSX in this repo against WCAG 2.1 AA — keyboard access, focus, labels, contrast, color-only meaning, live regions, modals, charts, and touch targets — with project-specific code fixes. Use when writing or reviewing a spec or UI for accessibility; load web-design-guidelines for a broader UI audit.
---

# Accessibility Review (WCAG 2.1 AA)

## Checklist

| Area           | Pass when                                                                                                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard       | Everything clickable is reachable with Tab and works with Enter/Space; Escape closes overlays                                                                                                               |
| Focus          | Visible focus on every control (violet ring on fields, never `outline-none` without a replacement); modals trap focus and return it to the trigger on close (base `Modal`/`Sheet` do this — don't break it) |
| Labels         | Every input has a visible `FieldLabel` or `aria-label`; icon-only buttons have `aria-label`                                                                                                                 |
| Errors         | Field errors sit next to the field (`FieldError`), are announced (`role="alert"` or `aria-live`), and say how to fix                                                                                        |
| Contrast       | Text 4.5:1, large text and UI parts 3:1. `text-slate-400` on white is ~2.6:1 — fine for decorative captions, **not** for important text; use `slate-500`+                                                   |
| Color alone    | Status/profit/loss also has a sign, icon, or label                                                                                                                                                          |
| Live updates   | Loading, errors, and async results use `aria-live="polite"` (or `role="status"` / `role="alert"`)                                                                                                           |
| Semantics      | `button` for actions, `a`/`Link` for navigation, headings in order, lists as lists, tables with header cells                                                                                                |
| Charts         | Wrapper has `role="img"` + an `aria-label` that states the takeaway; key numbers also appear as text                                                                                                        |
| Images / icons | Decorative icons `aria-hidden="true"`; meaningful images have `alt`                                                                                                                                         |
| Touch          | Targets ≥ 44×44px on mobile                                                                                                                                                                                 |
| Motion         | GSAP or CSS animations respect `prefers-reduced-motion`                                                                                                                                                     |

## Common fixes

```jsx
// Icon-only button
<Button variant="ghost" aria-label="Delete gear" id="deleteGearBtn_gearPage">
  <Trash2 className="h-4 w-4" aria-hidden="true" />
</Button>

// Async region
<div aria-live="polite" aria-busy={loading}>
  {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : children}
</div>

// Section / card
<Card id="hrZonesSection_analyticsPage" aria-label="Heart rate zones">...</Card>

// Reduced motion with GSAP
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reduce) gsap.from(el, { opacity: 0, y: 8, duration: 0.3 })
```

## Output

For a spec: an **Accessibility** section with the decisions. For a review: findings as `file:line — problem — fix`, grouped CRITICAL (blocks a keyboard or screen-reader user) / WARNING / SUGGESTION.
