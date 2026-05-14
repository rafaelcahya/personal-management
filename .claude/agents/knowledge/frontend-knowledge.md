# Frontend Agent — Knowledge Layer

> Reference cookbook for this project's frontend stack.
> These are the canonical patterns. Always follow these exactly unless a memory entry overrides them.

---

## Stack Identity

- **Framework**: Next.js 15 App Router
- **Language**: JavaScript/JSX (no TypeScript in app code)
- **Styling**: Tailwind CSS + CSS variables
- **UI Primitives**: shadcn/ui (`components/ui/`)
- **Forms**: react-hook-form + Zod (schemas from `schemas/`)
- **API Client**: `lib/api/` (never fetch directly in components)
- **Path alias**: `@/*` → project root

---

## 1. Server vs Client Component Rules

Next.js 15 App Router renders everything as **Server Component by default**. Only add `'use client'` when necessary.

### Add `'use client'` when the component uses:

- React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`)
- Browser APIs (`window`, `localStorage`, `document`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- shadcn/ui or Radix UI interactive components (they use hooks internally)
- Context providers that wrap client state

### Do NOT add `'use client'` when the component:

- Only renders static JSX
- Fetches data server-side and passes it as props
- Just composes other server components

### Pattern: push `'use client'` as deep as possible

```jsx
// ✅ Good — page is a server component, only the interactive part is client
// app/main/inventory/page.jsx  (no 'use client')
import { getInventoryItems } from '@/lib/services/inventory'
import { InventoryTable } from '@/components/inventory/InventoryTable'

export default async function InventoryPage() {
  const items = await getInventoryItems(supabase, userId)
  return <InventoryTable initialItems={items} />
}

// components/inventory/InventoryTable.jsx
'use client'   ← only here because it uses useState/handlers
export function InventoryTable({ initialItems }) { ... }
```

```jsx
// ❌ Wrong — entire page becomes client bundle because 'use client' is too high
'use client'
export default function InventoryPage() { ... }
```

### Component boundary cheatsheet

| Component Type        | `'use client'`?     | Example                                                       |
| --------------------- | ------------------- | ------------------------------------------------------------- |
| Page (`page.jsx`)     | No (default server) | `app/main/inventory/page.jsx`                                 |
| Layout                | No                  | `app/layout.jsx`                                              |
| Static section        | No                  | `InventoryHeader` with no interactivity                       |
| Interactive component | Yes                 | `AddItemForm`, `InventoryTable`                               |
| shadcn/ui wrapper     | Yes                 | Any component using `<Dialog>`, `<Sheet>`, `<Button onClick>` |
| Custom hook consumer  | Yes                 | Any component calling `useInventory()`                        |

---

## 2. Page Structure

Every page in `app/main/` follows this skeleton:

```jsx
// app/main/inventory/page.jsx
import { InventoryHeader } from '@/components/inventory/InventoryHeader'
import { InventoryTable } from '@/components/inventory/InventoryTable'

export default function InventoryPage() {
  return (
    <main className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
      <InventoryHeader />
      <InventoryTable />
    </main>
  )
}
```

Rules:

- Pages only compose sections/feature components — no logic, no JSX business rules
- All data fetching and state lives in feature components or custom hooks

---

## 2. Feature Component Structure

```jsx
// components/inventory/InventoryTable.jsx
'use client'

import { useInventory } from '@/hooks/useInventory'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

export function InventoryTable() {
  const { items, isLoading, error } = useInventory()

  if (isLoading) return <InventoryTableSkeleton />
  if (error) return <ErrorState message={error.message} />
  if (!items.length) return <EmptyState />

  return <DataTable columns={columns} data={items} />
}
```

---

## 3. Custom Hook Pattern

Business logic always goes in a hook, never in JSX:

```jsx
// hooks/useInventory.js
import { useState, useEffect } from 'react'
import { getInventoryItems } from '@/lib/api/inventory'

export function useInventory() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getInventoryItems()
        if (!cancelled) setItems(data)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { items, isLoading, error }
}
```

---

## 4. Form Pattern (react-hook-form + Zod)

```jsx
// components/inventory/AddItemForm.jsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addInventoryItemSchema } from '@/schemas/inventory'
import { createInventoryItem } from '@/lib/api/inventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function AddItemForm({ onSuccess }) {
  const form = useForm({
    resolver: zodResolver(addInventoryItemSchema),
    defaultValues: { name: '', stock: 0, price: 0 },
  })

  async function onSubmit(values) {
    try {
      await createInventoryItem(values)
      form.reset()
      onSuccess?.()
    } catch (err) {
      form.setError('root', { message: err.message })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Widget A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-[var(--color-trade-loss)]" role="alert">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Add Item'}
        </Button>
      </form>
    </Form>
  )
}
```

---

## 5. API Client Function Pattern

```js
// lib/api/inventory.js
export async function getInventoryItems(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`/api/inventory/v1/list${query ? `?${query}` : ''}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch inventory')
  return json.data
}

export async function createInventoryItem(payload) {
  const res = await fetch('/api/inventory/v1/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to create item')
  return json.data
}
```

---

## 6. Loading Skeleton Pattern

Skeleton must match the shape of the content it replaces:

```jsx
// components/inventory/InventoryTableSkeleton.jsx
import { Skeleton } from '@/components/ui/skeleton'

export function InventoryTableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
  )
}
```

---

## 7. Empty State Pattern

Always: icon + message + CTA:

```jsx
// components/inventory/InventoryEmptyState.jsx
import { PackageOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function InventoryEmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <PackageOpen className="h-10 w-10 text-[var(--color-tertiary)]" aria-hidden="true" />
      <p className="text-sm text-[var(--color-tertiary)]">No items yet</p>
      <Button variant="outline" onClick={onAdd}>
        Add your first item
      </Button>
    </div>
  )
}
```

---

## 8. Modal / Dialog Pattern

Use `<Dialog>` for confirmations and short focused tasks (max 2 fields):

```jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function DeleteConfirmDialog({ open, onOpenChange, onConfirm, itemName }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {itemName}?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[var(--color-tertiary)]">This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 9. Side Drawer Pattern

Use `<Sheet>` for complex forms or detail views:

```jsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export function ItemDetailDrawer({ open, onOpenChange, item }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[400px]">
        <SheetHeader>
          <SheetTitle>{item?.name}</SheetTitle>
        </SheetHeader>
        {/* detail content */}
      </SheetContent>
    </Sheet>
  )
}
```

---

## 10. CSS Variable Usage

Never use raw hex. Always reference project tokens:

```jsx
// Correct
<p className="text-[var(--color-primary)]">Active</p>
<span className="text-[var(--color-trade-profit)]">+12.4%</span>
<span className="text-[var(--color-trade-loss)]">-3.2%</span>
<span className="text-[var(--color-trade-warning)]">Near limit</span>

// Wrong
<p className="text-violet-600">Active</p>
<span className="text-green-500">+12.4%</span>
```

---

## 11. Toast Pattern

```jsx
import { toast } from 'sonner' // or the project's toast lib

// Success — auto dismisses
toast.success('Item created successfully')

// Error — persists
toast.error('Failed to create item. Please try again.')
```

---

## 12. id — Mandatory Rules

Every component delivered by Frontend Agent must have `id` on all testable elements **before** the component is considered done.

### What needs an id

| Element Type        | Example                                               |
| ------------------- | ----------------------------------------------------- |
| Trigger buttons     | Add, Edit, Delete, Submit, Cancel, Confirm            |
| Form inputs         | All `<Input>`, `<Select>`, `<Textarea>`               |
| Form error messages | Every `<FormMessage />` or error `<p>`                |
| Data containers     | Tables, lists, cards that display fetched data        |
| State containers    | Skeleton, empty state, error state                    |
| Dialogs / Drawers   | The root `<DialogContent>` / `<SheetContent>`         |
| Action menus        | `<DropdownMenuContent>` and each `<DropdownMenuItem>` |

### Naming convention (kebab-case)

```
{module}-{element}           → inventory-table, trading-page
{module}-{element}-{variant} → inventory-row-actions, inventory-row-delete
{field}-input                → item-name-input, trade-quantity-input
{field}-error                → item-name-error, trade-symbol-error
```

### Example — component with correct id

```jsx
export function InventoryTable() {
  return (
    <div id="inventory-table">
      {isLoading && <div id="inventory-skeleton">...</div>}
      {!items.length && (
        <div id="inventory-empty-state">
          <Button id="inventory-empty-state-cta" onClick={onAdd}>
            Add your first item
          </Button>
        </div>
      )}
      {items.map((item) => (
        <tr key={item.id} id="inventory-table-row">
          <DropdownMenu>
            <DropdownMenuTrigger id="inventory-row-actions" />
            <DropdownMenuContent>
              <DropdownMenuItem id="inventory-row-edit">Edit</DropdownMenuItem>
              <DropdownMenuItem id="inventory-row-delete">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </tr>
      ))}
    </div>
  )
}
```

### Register in app-constants.yaml

After adding `id` to a component, register the IDs in `cypress/fixtures/app-constants.yaml` under `test_ids.[module].[key]`.

### Responding to Tester Agent requests

When Tester Agent sends a `🔖 id Request`, treat it as a blocking task:

1. Add the requested `id` attributes to the component
2. Register the IDs in `cypress/fixtures/app-constants.yaml`
3. Confirm back to Tester Agent with the exact IDs added and their file locations

---

## 13. Responsive Layout Cheatsheet

```jsx
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col lg:flex-row gap-6">
  <aside className="w-full lg:w-64 shrink-0">...</aside>
  <main className="flex-1 min-w-0">...</main>
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive table
<div className="overflow-x-auto rounded-lg border">
  <table className="min-w-full text-sm">...</table>
</div>

// Touch-safe button
<Button className="min-h-11 min-w-11">...</Button>
```
