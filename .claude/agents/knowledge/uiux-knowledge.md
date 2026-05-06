# UI/UX Agent — Knowledge Layer

> Reference cookbook for this project's design work.
> These are the canonical patterns. Always follow these when producing design decisions or component specs.

---

## Stack Identity

- **Styling**: Tailwind CSS + project CSS variables (tokens)
- **Components**: shadcn/ui (Radix UI primitives) in `components/ui/`
- **Pages**: `app/main/{landing, inventory, trading}/`
- **Design target**: Desktop-primary, mobile-responsive
- **Domains**: Inventory Management, Stock Trading

---

## 1. Design Decision Output Template

Every design output must follow this format exactly:

```markdown
## Design Decision: [Feature/Component Name]

**Date:** YYYY-MM-DD
**Module:** Inventory | Trading | Auth | Shared
**Requested by:** PM Agent | User | Self-initiated

### Problem

[What user pain or confusion does this solve? 1–2 sentences.]

### Design Solution

[What is the proposed UI pattern and why this pattern fits the user's mental model?]

### Layout & Hierarchy

[Describe visual structure — what is prominent, what is secondary, where things sit on the page]

### States Required

| State          | Description        | Component Behavior                          |
| -------------- | ------------------ | ------------------------------------------- |
| Default        | Resting state      | ...                                         |
| Hover          | Interactivity hint | subtle bg change                            |
| Active/Pressed | Confirms click     | scale or color shift                        |
| Focus          | Keyboard indicator | ring visible, never removed                 |
| Disabled       | Non-interactive    | opacity-50, cursor-not-allowed, tooltip why |
| Loading        | Async in progress  | skeleton matching content shape             |
| Success        | Operation complete | toast or inline confirmation                |
| Empty          | No data            | icon + message + CTA                        |
| Error          | Failed operation   | inline message + retry CTA                  |

### Component Mapping (shadcn/ui)

- Use `<Dialog>` for: ...
- Use `<Sheet>` for: ...
- Use `<Table>` for: ...
- Use `<Badge>` for: ...

### Tailwind Implementation Notes

[Exact classes or patterns the Frontend Engineer should use]

### Accessibility Notes

[ARIA roles, focus management requirements, contrast checks]

### Handoff Checklist

- [ ] All 5 interactive states defined
- [ ] All 4 async states defined
- [ ] Mobile layout specified (375px behavior)
- [ ] Color usage maps to tokens only — no raw hex
- [ ] Touch targets ≥ 44px
- [ ] Destructive actions have confirmation step
- [ ] Empty states have icon + message + CTA
```

---

## 2. Token Usage Reference

```
--color-primary       → CTA buttons, active nav item, selected state, links
--color-secondary     → Secondary buttons, borders, card backgrounds, dividers
--color-tertiary      → Placeholder text, disabled labels, muted metadata
--color-trade-profit  → Positive P&L, stock gains, success badges (+12.4%)
--color-trade-loss    → Negative P&L, stock losses, destructive actions (-3.2%)
--color-trade-warning → Near-limit stock, pending status, caution badges
```

**Tailwind usage:**

```jsx
<span className="text-[var(--color-trade-profit)]">+12.4%</span>
<span className="text-[var(--color-trade-loss)]">-3.2%</span>
<Badge className="bg-[var(--color-trade-warning)] text-white">Low Stock</Badge>
```

---

## 3. Component → shadcn Mapping

| Use Case                              | shadcn Component                    | Notes                                               |
| ------------------------------------- | ----------------------------------- | --------------------------------------------------- |
| Confirmation / short form (≤2 fields) | `<Dialog>`                          | Center on all screen sizes                          |
| Complex form / detail view            | `<Sheet>`                           | Slide from right, 400px desktop / full-width mobile |
| Data list                             | `<Table>`                           | Add `overflow-x-auto` wrapper for mobile            |
| Status indicators                     | `<Badge>`                           | Use trade tokens for financial status               |
| Inline notifications                  | `<Alert>`                           | Use for persistent page-level messages              |
| Transient notifications               | Toast (`sonner`)                    | Success 4s auto-dismiss, error persists             |
| Navigation (desktop)                  | `<NavigationMenu>`                  | Sidebar layout on lg+                               |
| Form inputs                           | `<Input>`, `<Select>`, `<Checkbox>` | Always with `<FormLabel>` and `<FormMessage>`       |
| Data actions                          | `<DropdownMenu>`                    | For row-level actions (edit, delete, view)          |
| Page sections                         | `<Card>`                            | For grouping related content                        |
| Long content                          | `<Tabs>`                            | When one screen has multiple views                  |

---

## 4. Spacing Grid

All spacing uses the 4px base grid via Tailwind scale:

```
4px  → gap-1, p-1, m-1
8px  → gap-2, p-2, m-2
12px → gap-3, p-3, m-3
16px → gap-4, p-4, m-4   ← default section padding
24px → gap-6, p-6, m-6   ← card padding / section gap
32px → gap-8, p-8, m-8   ← major section separation
48px → gap-12            ← page-level vertical rhythm
```

---

## 5. Typography Scale

```jsx
// Page title
<h1 className="text-2xl font-semibold md:text-3xl">Inventory</h1>

// Section heading
<h2 className="text-lg font-medium">Recent Trades</h2>

// Label / metadata
<p className="text-sm text-[var(--color-tertiary)]">Last updated 2 min ago</p>

// Monospace for numbers / prices / IDs
<span className="font-mono text-sm tabular-nums">$1,234.56</span>
<span className="font-mono text-sm tabular-nums text-[var(--color-trade-profit)]">+12.4%</span>
```

---

## 6. Interaction Pattern Cheatsheet

### Modal (Dialog)

- Trigger: user-initiated action (confirm delete, quick add)
- Width: `max-w-md` centered
- Always has: title, body, Cancel + primary action in footer
- Dismiss: ✕ button, backdrop click, Escape key

### Side Drawer (Sheet)

- Trigger: view detail, edit record, complex form
- Width: `w-full md:w-[400px]` from right
- Always has: header title, ✕ button, backdrop click to dismiss

### Toast

- Position: bottom-right desktop / bottom-center mobile
- Success: auto-dismiss 4s
- Error: persists until dismissed by user
- Max 1 toast visible at a time

### Destructive Action Flow

```
1. User clicks "Delete" → opens confirmation Dialog
2. Dialog shows: item name + "This cannot be undone"
3. Two buttons: "Cancel" (outline) + "Delete" (destructive/red)
4. On confirm: show loading state on button → execute → show success toast
```

---

## 7. Inventory Module Patterns

```
- Default view: table list
- Row actions: dropdown menu (Edit, Delete) — not inline buttons
- Low stock indicator: Badge with --color-trade-warning on stock cell
- Bulk action bar: appears above table only when rows are selected
- Search input: always visible on desktop (top of table), collapsible on mobile
- Add item: primary button top-right of page header
```

---

## 8. Trading Module Patterns

```
- Price display: always monospace + trade token color (never plain black text)
- Buy/Sell form: large inputs, real-time subtotal visible before submit
- Confirm trade: always show confirmation modal before executing
- P&L display: always include sign (+/-) + color — never just a number
- Trade history: filterable by date range, type (buy/sell), status
- Portfolio card: show total value + overall P&L prominently at top
```

---

## 9. Empty States by Module

| Module         | Icon          | Message                                         | CTA             |
| -------------- | ------------- | ----------------------------------------------- | --------------- |
| Inventory list | `PackageOpen` | "No items yet. Start by adding your inventory." | "Add Item"      |
| Trade history  | `BarChart2`   | "No trades yet. Make your first trade."         | "Trade Now"     |
| Portfolio      | `TrendingUp`  | "Your portfolio is empty."                      | "Start Trading" |
| Search results | `SearchX`     | "No results for '[query]'"                      | "Clear search"  |

---

## 10. Accessibility Cheatsheet

```jsx
// Icon-only button — must have aria-label
<Button aria-label="Delete item" variant="ghost" size="icon">
  <Trash2 className="h-4 w-4" aria-hidden="true" />
</Button>

// Decorative icon — aria-hidden
<PackageOpen className="h-10 w-10" aria-hidden="true" />

// Dynamic content (loading/error) — aria-live
<div aria-live="polite" aria-atomic="true">
  {error && <p>{error.message}</p>}
</div>

// Form error — adjacent to field, id-linked
<Input id="name" aria-describedby="name-error" />
<p id="name-error" role="alert" className="text-sm text-[var(--color-trade-loss)]">
  Name is required
</p>
```
