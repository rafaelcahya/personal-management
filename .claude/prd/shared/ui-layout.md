### Page Container

Every page must follow this exact structure — outer wrapper, PageHeader, then section content.

```jsx
export default function ExamplePage() {
  return (
    <main id="{pageName}" className="space-y-6">
      <PageHeader
        title="Page Title"
        description="Short description"
        breadcrumbs={[{ label: 'Module', href: '/main/module' }, { label: 'Current Page' }]}
      />

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* content */}
      </section>
    </main>
  )
}
```

**Rules:**

| Rule            | Value                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Outer element   | `<main>` — never `<div>`                                                                             |
| Spacing         | `space-y-6` — never `flex flex-col gap-*`                                                            |
| Page ID         | `id="{pageName}"` on `<main>` — camelCase, e.g. `holdingsPage`, `analyticsPage`                      |
| PageHeader      | Required on every page — no inline breadcrumb nav                                                    |
| Section card    | `bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden` — exact classes, no variants |
| Section element | `<section>` for primary content blocks, `<div>` only for layout grouping inside a section            |

### PageHeader Component

**Component:** `app/main/components/PageHeader.jsx`

Every page in the app (Inventory, Trading, and Running Tracker) must use the `PageHeader` component at the top of the page content.

**Props:**

| Prop          | Type               | Required | Description                                                   |
| ------------- | ------------------ | -------- | ------------------------------------------------------------- |
| `title`       | string             | Yes      | Page title — rendered as `<h1>`                               |
| `description` | string             | —        | Short description below the title                             |
| `breadcrumbs` | `{label, href?}[]` | —        | Array of breadcrumb items; item without `href` = current page |

**Pages using PageHeader:**

| Page                | Route                               | Title                 | Breadcrumbs                               |
| ------------------- | ----------------------------------- | --------------------- | ----------------------------------------- |
| Inventory Dashboard | `/main/inventory/dashboard`         | "Inventory Dashboard" | Inventory > Dashboard                     |
| Product List        | `/main/inventory/product-list`      | "Product List"        | Inventory > Product List                  |
| Product Detail      | `/main/inventory/product-list/[id]` | [product name]        | Inventory > Product List > [product name] |
| Product Brand       | `/main/inventory/product-brand`     | "Product Brand"       | Inventory > Product Brand                 |
| Product Name        | `/main/inventory/product-name`      | "Product Name"        | Inventory > Product Name                  |
| Product History     | `/main/inventory/product-history`   | "Product History"     | Inventory > Product History               |
| Trading Dashboard   | `/main/trading/dashboard`           | "Trading Dashboard"   | Trading > Dashboard                       |
| Trade List          | `/main/trading/trade-list`          | "Trades"              | Trading > Trades                          |
| Fee                 | `/main/trading/fee`                 | "Fees"                | Trading > Fees                            |
| Event               | `/main/trading/event`               | "Market Events"       | Trading > Market Events                   |
| Settings            | `/main/trading/settings`            | "Settings"            | Trading > Settings                        |
| Running Dashboard   | `/main/running/dashboard`           | "Dashboard"           | —                                         |
| Activities          | `/main/running/activities`          | "Activities"          | —                                         |
| Activity Detail     | `/main/running/activities/[id]`     | [activity name]       | —                                         |
| Analytics           | `/main/running/analytics`           | "Analytics"           | —                                         |
| AI Coach            | `/main/running/ai`                  | "AI Coach"            | —                                         |
| Race Log            | `/main/running/race-log`            | "Race Log"            | —                                         |
| Race Detail         | `/main/running/race-log/[id]`       | [race title]          | —                                         |
| Route Builder       | `/main/running/route-builder`       | "Route Builder"       | Running > Route Builder                   |
| Run Calculator      | `/main/running/run-calculator`      | "Run Calculator"      | Running > Run Calculator                  |
| Settings            | `/main/running/settings`            | "Settings"            | Running > Settings                        |

### Sidebar Navigation Component

**Component:** `app/main/components/Sidebar.jsx`

The sidebar is the main navigation shared across all modules (Inventory, Trading, Running).

**Collapsed Mode Tooltip:**

When the sidebar is collapsed (icon only, no text label), each nav item must show a tooltip on hover to display the menu name.

- Tooltip uses base `<Tooltip>` + `<TooltipProvider>` from `@/components/base/Tooltip/Tooltip` — NOT the native HTML `title` attribute
- Tooltip appears on the `right` side of the icon
- Tooltip is only active when `collapsed === true`; when expanded the text label is already visible
- `delayDuration={0}` — appears immediately with no delay

**Acceptance Criteria:**

- GIVEN the sidebar is in collapsed state WHEN the user hovers a nav icon THEN a tooltip appears to the right of the icon showing the menu name
- GIVEN the sidebar is in expanded state WHEN the user hovers a nav item THEN no tooltip appears (the label is already visible)
