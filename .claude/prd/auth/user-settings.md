### 3.4 User Settings (`/settings`)

**Status:** API endpoints are implemented (`GET /api/user`, `PUT /api/user`, and `POST /api/user/avatar`). Only the Settings page UI is pending (P2 backlog).

**Data Source:** `auth.users` via `supabase.auth.getUser()`

**API Endpoints:**

`GET /api/user`

- Auth: Required (via `lib/supabase/server.ts` + `supabase.auth.getUser()`)
- Response (200):
  ```json
  {
    "data": {
      "user": {
        "id": "uuid",
        "username": "string",
        "nickname": "string",
        "avatar": "string (public URL from Supabase Storage, or null)"
      }
    },
    "message": "User fetched successfully"
  }
  ```
- Error (401): `{ "error": "Unauthorized", "message": "Authentication required" }`
- Error (500): `{ "error": "INTERNAL_ERROR", "message": "Something went wrong" }`

`PUT /api/user`

- Auth: Required
- Body (JSON): `{ "username": "string", "nickname": "string", "avatar": "string" }` — all fields optional; only fields present in the body are updated
- Response (200):
  ```json
  {
    "data": { "user": { "username": "...", "nickname": "...", "avatar": "..." } },
    "message": "User updated successfully"
  }
  ```
- Error (401): `{ "error": "Unauthorized", "message": "Authentication required" }`
- Error (500): `{ "error": "INTERNAL_ERROR", "message": "Something went wrong" }`

`POST /api/user/avatar`

- Auth: Required
- Body: multipart form data — field name `file` (image file)
- Storage: Supabase Storage bucket `avatar`, path pattern `avatars/{userId}-{timestamp}.{ext}`
- Response (201):
  ```json
  {
    "data": { "path": "avatars/...", "url": "https://..." },
    "message": "Avatar uploaded successfully"
  }
  ```
- Error (400): `{ "error": "BAD_REQUEST", "message": "No file provided" }`
- Error (401): `{ "error": "Unauthorized", "message": "Authentication required" }`
- Error (500): `{ "error": "INTERNAL_ERROR", "message": "Something went wrong" }`

**Features (P2 — Settings page UI not yet built):**

- Display and edit user profile
- Upload avatar photo
- Application preferences

---
