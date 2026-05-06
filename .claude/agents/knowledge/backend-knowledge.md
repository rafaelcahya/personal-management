# Backend Agent — Knowledge Layer

> Reference cookbook for this project's backend stack.
> These are the canonical patterns. Always follow these exactly unless a memory entry overrides them.

---

## Stack Identity

- **Framework**: Next.js 15 Route Handlers
- **Language**: JavaScript (no TypeScript in route/service files)
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod (schemas from `schemas/`)
- **Auth**: Supabase SSR with JWT via `middleware.js`
- **Supabase server client**: `lib/supabase/server.ts`
- **Supabase admin client**: `lib/supabase/admin.js` (bypasses RLS — use sparingly)

---

## 1. Checklist — Adding a New Endpoint

Follow these steps in order every time a new endpoint is needed:

```
Step 1 — Define the Zod schema
  └── schemas/[resource].js
      ├── Request schema (body or query)
      └── Ensure it's exported — Frontend and Tester both import from here

Step 2 — Write the service function
  └── lib/services/[resource].js
      ├── One function = one responsibility
      ├── Accept (supabase, userId, payload) signature
      ├── Select specific columns only — no .select('*')
      └── Throw on Supabase error

Step 3 — Write the route handler
  └── app/api/[resource]/v1/[action]/route.js
      ├── Auth check first (always)
      ├── Validate input with Zod safeParse
      ├── Call service function
      ├── Return consistent { data, message } or { error, message }
      └── Wrap everything in try/catch

Step 4 — Register endpoint in app-constants.yaml
  └── cypress/fixtures/app-constants.yaml
      └── endpoints.[resource].[action]: /api/[resource]/v1/[action]

Step 5 — Send API Contract to Frontend Agent
  └── Use 📡 API Contract format (see shared-knowledge.md)
      ├── Endpoint path + method
      ├── Request shape
      ├── Response shape
      └── All error cases (400, 401, 403, 404, 409, 500)
```

---

## 2. Route Handler Pattern

```js
// app/api/inventory/v1/create/route.js
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createInventoryItem } from '@/lib/services/inventory'
import { createInventoryItemSchema } from '@/schemas/inventory'

export async function POST(request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = createInventoryItemSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const item = await createInventoryItem(supabase, user.id, parsed.data)
    return NextResponse.json({ data: item, message: 'Item created successfully' }, { status: 201 })
  } catch (err) {
    console.error('[inventory/create]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
```

Rules:

- Route only: parse → auth check → validate → call service → return response
- Never put DB queries in the route handler
- Always wrap in try/catch and return consistent JSON

---

## 2. Service Function Pattern

```js
// lib/services/inventory.js

/**
 * Creates a new inventory item for a user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {{ name: string, stock: number, price: number }} payload
 */
export async function createInventoryItem(supabase, userId, payload) {
  const { data, error } = await supabase
    .from('inventory_items')
    .insert({ ...payload, user_id: userId })
    .select('id, name, stock, price, created_at')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getInventoryItems(supabase, userId, { page = 1, limit = 20 } = {}) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('inventory_items')
    .select('id, name, stock, price, created_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)
  return { items: data, total: count, page, limit }
}
```

Rules:

- Always select specific columns — never `.select('*')`
- Always accept `supabase` client as the first parameter (injected from route)
- All pagination is offset-based with `page` + `limit`
- Throw on Supabase error — route handler catches it

---

## 3. Zod Schema Pattern

```js
// schemas/inventory.js
import { z } from 'zod'

export const createInventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  price: z.number().min(0, 'Price cannot be negative'),
})

export const updateInventoryItemSchema = createInventoryItemSchema.partial().extend({
  id: z.string().uuid('Invalid item ID'),
})

export const listInventoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
})
```

---

## 4. GET Route with Query Params

```js
// app/api/inventory/v1/list/route.js
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getInventoryItems } from '@/lib/services/inventory'
import { listInventoryQuerySchema } from '@/schemas/inventory'

export async function GET(request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const parsed = listInventoryQuerySchema.safeParse(Object.fromEntries(searchParams))

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query', message: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const result = await getInventoryItems(supabase, user.id, parsed.data)
    return NextResponse.json({ data: result, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[inventory/list]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
```

---

## 5. Response Format (enforced across all routes)

```js
// Success
return NextResponse.json({ data: <payload>, message: '<human readable>' }, { status: 200 })
return NextResponse.json({ data: <payload>, message: 'Created successfully' }, { status: 201 })

// Client errors
return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required' }, { status: 401 })
return NextResponse.json({ error: 'Forbidden', message: 'You do not have access' }, { status: 403 })
return NextResponse.json({ error: 'Not found', message: '<resource> not found' }, { status: 404 })
return NextResponse.json({ error: 'Validation failed', message: '<field> <reason>' }, { status: 400 })
return NextResponse.json({ error: 'Conflict', message: '<resource> already exists' }, { status: 409 })

// Server errors (never expose details to client)
return NextResponse.json({ error: 'Internal server error', message: 'Something went wrong' }, { status: 500 })
```

---

## 6. Admin Client Usage (bypass RLS)

Only use for operations that legitimately need to bypass RLS (e.g., admin dashboards, background jobs):

```js
// lib/services/admin/user.js
import { createAdminClient } from '@/lib/supabase/admin'

export async function getAllUsers() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}
```

---

## 7. Encryption Pattern (sensitive fields)

```js
import { encrypt, decrypt } from '@/lib/utils/encryption'

// Storing sensitive data
const encrypted = encrypt(sensitiveValue, process.env.ENCRYPTION_SECRET_KEY)
await supabase.from('user_secrets').insert({ user_id, value: encrypted })

// Reading sensitive data
const { data } = await supabase.from('user_secrets').select('value').eq('user_id', userId).single()
const decrypted = decrypt(data.value, process.env.ENCRYPTION_SECRET_KEY)
```

---

## 8. Error Logging Convention

```js
// Log with context — format: [domain/action] error
console.error('[inventory/create]', err)
console.error('[trade/execute]', { userId, tradeId, err })

// Never log sensitive data (tokens, passwords, keys)
// Never return raw error.message to client from DB errors
```

---

## 9. Supabase MCP — Direct Database Access

Supabase MCP sudah aktif di environment ini. Gunakan untuk inspeksi schema, debugging, dan migration — **bukan** sebagai pengganti service layer di kode produksi.

### Kapan pakai MCP vs supabase client

| Task                        | Gunakan                                  |
| --------------------------- | ---------------------------------------- |
| Inspeksi schema / cek kolom | MCP `list_tables`                        |
| Debug data secara langsung  | MCP `execute_sql`                        |
| Buat atau ubah migration    | MCP `apply_migration`                    |
| Generate TypeScript types   | MCP `generate_typescript_types`          |
| Cek error logs Supabase     | MCP `get_logs`                           |
| Operasi dalam kode produksi | `lib/supabase/server.ts` atau `admin.js` |

### Inspeksi schema

```
// Lihat semua tabel dan strukturnya
mcp__supabase__list_tables

// Cek advisors (missing indexes, security issues)
mcp__supabase__get_advisors
```

### Menjalankan query ad-hoc

```sql
-- Cek data langsung (debugging)
mcp__supabase__execute_sql:
  "SELECT id, name, stock, user_id FROM inventory_items
   WHERE user_id = '<uuid>'
   ORDER BY created_at DESC
   LIMIT 10"

-- Cek apakah RLS aktif di tabel
mcp__supabase__execute_sql:
  "SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'"

-- Cek indexes yang ada
mcp__supabase__execute_sql:
  "SELECT indexname, indexdef
   FROM pg_indexes
   WHERE tablename = 'inventory_items'"
```

### Membuat migration

```sql
-- Selalu gunakan apply_migration, bukan execute_sql untuk schema changes
mcp__supabase__apply_migration:
  name: "add_deleted_at_to_inventory_items"
  query: "ALTER TABLE inventory_items
          ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL"

-- Tambah index
mcp__supabase__apply_migration:
  name: "add_user_id_index_inventory"
  query: "CREATE INDEX IF NOT EXISTS idx_inventory_items_user_id
          ON inventory_items(user_id)
          WHERE deleted_at IS NULL"

-- Aktifkan RLS pada tabel baru
mcp__supabase__apply_migration:
  name: "enable_rls_new_table"
  query: "ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
          CREATE POLICY 'users_own_data' ON new_table
          FOR ALL USING (auth.uid() = user_id)"
```

### Cek logs error

```
// Lihat error logs dari Supabase (DB errors, auth errors, dll)
mcp__supabase__get_logs:
  service: "postgres"   // atau "auth", "storage", "realtime"
```

### Generate TypeScript types (setelah migration)

```
// Jalankan ini setelah setiap schema change
// Output: type definitions yang bisa dipakai di lib/
mcp__supabase__generate_typescript_types
```

### Rules

- Jangan pakai `execute_sql` untuk operasi produksi — hanya untuk debugging dan inspeksi
- Semua schema changes wajib lewat `apply_migration` (bukan `execute_sql`) agar tercatat di migration history
- Setelah `apply_migration`, selalu cek `get_advisors` untuk memastikan tidak ada missing index atau security issue baru
- Konfirmasi cost sebelum operasi besar: `mcp__supabase__get_cost` → `mcp__supabase__confirm_cost`

---

## 10. Common Supabase Query Patterns

```js
// Filter + sort + paginate
const { data, error, count } = await supabase
  .from('trades')
  .select('id, type, amount, status, created_at', { count: 'exact' })
  .eq('user_id', userId)
  .eq('status', 'completed')
  .gte('created_at', fromDate)
  .order('created_at', { ascending: false })
  .range(from, to)

// Upsert (idempotent create/update)
const { data, error } = await supabase
  .from('portfolio')
  .upsert({ user_id: userId, symbol, quantity }, { onConflict: 'user_id, symbol' })
  .select('id, symbol, quantity')
  .single()

// Soft delete (preferred over hard delete)
const { error } = await supabase
  .from('inventory_items')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', itemId)
  .eq('user_id', userId)
```
