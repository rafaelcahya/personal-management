## 4. API Standards

### Response Format

```json
// Success
{ "data": {...}, "message": "string" }

// Error
{ "error": "ERROR_CODE", "message": "Human readable message" }
```

### HTTP Status Codes

| Status | Condition                      |
| ------ | ------------------------------ |
| 200    | OK                             |
| 201    | Created                        |
| 400    | Validation error / Bad request |
| 401    | Unauthenticated                |
| 403    | Forbidden                      |
| 404    | Not found                      |
| 500    | Server error                   |

### Auth

- All `/api/*` endpoints (except `/api/auth/*`) must validate session
- [DEPRECATED v1.1] ~~Use JWT/authToken cookie for auth validation in route handlers~~ — replaced by Supabase SSR `createClient()` + `supabase.auth.getUser()`
- All `/api/*` route handlers MUST use `lib/supabase/server.ts` `createClient()` + `supabase.auth.getUser()` for session validation
- Admin operations (e.g., bypass RLS) use `createAdminClient()` from `lib/supabase/admin.js` — not a singleton, call as a function each time it is needed
- Auth endpoints:
  - `POST /api/auth/logout` — server-side session termination

### Shared AI Chat Endpoints

The following endpoints power the AI chat features. Full specs are documented in their respective module PRDs:

- `POST /api/chat` — Inventory AI Chat (see PRD_Inventory.md)
- `POST /api/trade-chat` — Trading AI Chat (see PRD_Trading.md)

---
