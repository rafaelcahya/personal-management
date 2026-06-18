# PRD — Authentication & User Settings

> Part of PRD_Personal_Management. Shared standards: [PRD_Shared.md](./PRD_Shared.md)

---

### 3.3 Authentication Module

---

#### 3.3.0 Authentication Flow Overview

> Read this section first before reading the technical details. It is the high-level map of the entire auth flow.

---

##### LOGIN FLOW

```
User opens a protected page (e.g. /main/trading)
    │
    ▼
[Middleware] checks session
    │
    ├── ❌ No session
    │       │
    │       ▼
    │   Redirect → /login?next=/main/trading
    │       │
    │       ▼
    │   [Login Page] User clicks "Sign in with Google"
    │       │
    │       ▼
    │   signInWithOAuth() → redirect to Google
    │       │
    │       ▼
    │   [Google Auth] User approves
    │       │
    │       ▼
    │   Redirect to /auth/v1/callback?code=xxx&next=/main/trading
    │       │
    │       ├── ❌ no code → /login?error=no_code
    │       ├── ❌ code exchange fails → /login?error=auth_failed
    │       └── ✅ success → redirect to /main/trading (from ?next=)
    │
    └── ✅ Session exists → proceed to the destination page
```

---

##### LOGOUT FLOW

```
User clicks "Sign out"
    │
    ▼
[LogoutButton / UserMenu] sets sessionStorage flag "intentional_logout"
    │
    ▼
POST /api/auth/logout
    │
    ├── ❌ Fails → remove flag → show toast error → stay on current page
    │
    └── ✅ Success → server clears session cookie
            │
            ▼
        Redirect → /login
            │
            ▼
        [AuthListener] detects SIGNED_OUT event
            │
            └── checks "intentional_logout" flag → present → no toast shown
                (redirect already handled by LogoutButton)
```

---

##### SESSION EXPIRY FLOW

```
User is active on /main/* → Supabase session expires
    │
    ▼
[AuthListener] detects SIGNED_OUT event
    │
    └── checks "intentional_logout" flag → not present
            │
            ▼
        Redirect → /login?reason=session_expired
        (no toast here — avoids double toast)
            │
            ▼
        [Login Page] reads ?reason=session_expired
            │
            ▼
        Shows toast: "You've been signed out. Please sign in again to continue."
```

---

##### ERROR MESSAGES QUICK REFERENCE

| URL Param                 | Meaning                       | Message shown to user                                       |
| ------------------------- | ----------------------------- | ----------------------------------------------------------- |
| `?error=auth_failed`      | Google OAuth failed           | "Login failed. Please try again."                           |
| `?error=no_code`          | Callback received no code     | "Invalid login attempt. Please try again."                  |
| `?reason=session_expired` | Session expired automatically | "You've been signed out. Please sign in again to continue." |

---

#### 3.3.1 Login (`/login`)

**Description:** Login page using Google OAuth. Handles error query params and session expiry messaging. Displays app identity (logo + app name) above the login card.

**Features:**

- [DEPRECATED v1.1] ~~Email + password form~~ — replaced by Google OAuth only
- [DEPRECATED v1.1] ~~Email format validation~~ — not relevant after OAuth only
- [DEPRECATED v1.1] ~~Error message for wrong credentials~~ — not relevant after OAuth only
- App identity displayed above the Card: `LayoutDashboard` icon + text "Personal Management"
- Login via Google OAuth (single sign-on button)
- **Google button must follow Google branding guidelines:**
  - White background (`bg-white`), border `border-slate-300`, text `text-slate-700`
  - 4-color Google SVG icon (not `currentColor`): `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`
  - Button label: `"Sign in with Google"` (not "Continue with Google")
- Loading/disabled state on Google button while OAuth redirect is in progress
  - Loading text: `"Redirecting to Google..."`
- Reads `?error=` query param and shows a toast message:
  - `?error=auth_failed` → `"Login failed. Please try again."`
  - `?error=no_code` → `"Invalid login attempt. Please try again."`
- Reads `?reason=` query param and shows a toast message:
  - `?reason=session_expired` → `"You've been signed out. Please sign in again to continue."`
  - **Note:** The session expiry toast is shown only by the login page via `?reason=` param, NOT inside `AuthListener` (to prevent double toast)
- `?next=` param is forwarded through the OAuth flow to preserve the intended redirect destination
- Page is wrapped in `<Suspense>` for Next.js SSR compatibility

**User Story:**

> As an unauthenticated user, I want to sign in with Google, so that I can access my personal management dashboard securely.

**Acceptance Criteria:**

```
GIVEN I am on /login
WHEN I click "Sign in with Google"
THEN I am redirected to Google OAuth and the button shows loading/disabled state

GIVEN the OAuth callback fails
WHEN I am redirected to /login?error=auth_failed
THEN a toast error message is shown explaining the failure

GIVEN my session has expired
WHEN I am redirected to /login?reason=session_expired
THEN a toast message informs me my session expired

GIVEN I was trying to access /main/inventory before login
WHEN I successfully authenticate
THEN I am redirected back to /main/inventory (via ?next= param)
```

---

#### 3.3.2 Auth Callback (`/auth/v1/callback`)

**Description:** OAuth callback handler from Supabase. Uses `lib/supabase/server.ts` `createClient`.

**Behavior:**

- If `?code=` param is missing → redirect to `/login?error=no_code`
- If code exchange fails → redirect to `/login?error=auth_failed`
- If auth succeeds → redirect to `?next=` param (if present) or to `/main/landing`
- `?next=` param is preserved from the original request and forwarded to the redirect destination
- Uses `lib/supabase/server.ts` `createClient()` (not manual `createServerClient`)

**Acceptance Criteria:**

```
GIVEN the OAuth callback URL has no ?code= param
WHEN the callback route is hit
THEN redirect to /login?error=no_code

GIVEN the OAuth callback URL has a valid ?code= param
WHEN code exchange with Supabase succeeds
THEN redirect to ?next= destination (or /main/landing if not set)

GIVEN the OAuth callback URL has a valid ?code= but exchange fails
WHEN the callback route is hit
THEN redirect to /login?error=auth_failed
```

---

#### 3.3.3 Logout

**Description:** Centralized logout via two components depending on location. Logout is performed **server-side** through an API endpoint to ensure the session cookie is fully cleared on the server before redirecting.

**Components:**

- `app/login/components/Logout.jsx` → `LogoutButton` — used in Inventory and Trading layouts
- `app/login/components/UserMenu.jsx` → `UserMenu` — used in the Landing page (shows user avatar + email)

**`LogoutButton` — Features:**

- Default `size="sm"` (overridable via prop) — consistent with other action buttons in the layout
- Label: `"Sign out"` | Loading: `"Signing out..."`
- Color: neutral (`text-slate-500`, `hover:text-slate-700`) — not red (logout is not a destructive action)
- Sets `sessionStorage` flag `intentional_logout` before calling the API
- Calls `POST /api/auth/logout` (server-side session termination)
- Loading/disabled state during the process
- Toast error if it fails: `"Couldn't sign you out — please try again."`
- Redirects to `/login` on success
- WCAG: `aria-label="Sign out from application"`, keyboard accessible

**`UserMenu` — Features:**

- Shows the user's Google avatar (profile photo from `user_metadata.avatar_url`)
- Fallback avatar: first letter of the user's name with `bg-primary/10` background
- Shows first name next to the avatar (hidden on mobile `sm:inline`)
- Click opens a `DropdownMenu` showing the user's email and a "Sign out" option
- Logout logic is the same as `LogoutButton` (API call + intentional flag + redirect)

**Locations:**

- Inventory layout (`app/main/inventory/layout.jsx`) → `LogoutButton`
- Trading layout (`app/main/trading/layout.jsx`) → `LogoutButton` (next to the Settings button)
- Landing page (`app/main/landing/page.jsx`) → `UserMenu` (with `user` prop from `requireAuth()`)

**API endpoint:** `POST /api/auth/logout`

- Validates session first — returns 401 if not authenticated
- Server-side session termination via `supabase.auth.signOut()`
- Clears session cookie on the server
- Success response: `{ message: "Logged out successfully" }` (200)
- Error response: `{ error: "LOGOUT_FAILED", message: "..." }` (500)

**User Story:**

> As an authenticated user, I want to log out securely, so that my session is terminated on the server and no one else can access my account.

**Acceptance Criteria:**

```
GIVEN I am logged in and click the Logout button
WHEN logout is processing
THEN the button shows loading state and is disabled

GIVEN logout completes successfully
WHEN POST /api/auth/logout returns 200
THEN I am redirected to /login WITHOUT any "session expired" toast

GIVEN logout fails due to a network error
WHEN POST /api/auth/logout returns non-200
THEN a toast error message is shown and I remain on the current page

GIVEN I use a keyboard
WHEN I Tab to the Logout button and press Enter
THEN logout is triggered (keyboard accessible, aria-label present)
```

---

#### 3.3.4 Session Expiry

**Description:** Global listener for detecting expired sessions, mounted in the root layout.

**Component:** `components/AuthListener.jsx`

**Behavior:**

- Mounted globally in `app/layout.tsx`
- Listens to `supabase.auth.onAuthStateChange`
- When a `SIGNED_OUT` event is detected:
  - Checks `sessionStorage` key `intentional_logout`
  - If present → intentional logout (already handled by `LogoutButton`/`UserMenu`) → do nothing
  - If not present → session expired → redirect to `/login?reason=session_expired`
- Toast is shown **only by the login page** (not AuthListener) via the `?reason=session_expired` param
- **Why not toast in AuthListener:** To avoid a double toast — a toast from AuthListener could appear before the redirect, and then the login page would show a second toast

**User Story:**

> As an authenticated user whose session has expired, I want to be automatically redirected to login with a clear message, so that I understand why I was logged out.

**Acceptance Criteria:**

```
GIVEN I am on any /main/* page
WHEN my Supabase session expires (SIGNED_OUT event fires)
AND there is no "intentional_logout" flag in sessionStorage
THEN I am automatically redirected to /login?reason=session_expired

GIVEN I arrive at /login?reason=session_expired
WHEN the page loads
THEN a toast is shown: "You've been signed out. Please sign in again to continue."

GIVEN I click the Logout button
WHEN SIGNED_OUT event fires
AND "intentional_logout" flag exists in sessionStorage
THEN AuthListener does NOT redirect or show toast (LogoutButton handles the redirect)
```

---

#### 3.3.5 Strava OAuth (Cross-reference)

Strava OAuth is a separate authentication flow used exclusively by the Running Tracker module. It is not part of the core app login flow described in sections 3.3.1–3.3.4.

The Strava OAuth flow (authorization, callback, token storage, token refresh) is documented in **PRD_Running_Tracker.md section 5**.

The middleware (`middleware.js`) explicitly bypasses auth checks for the Strava callback route:
`/api/running/v1/auth/strava/callback`

---

### 3.4 User Settings (`/settings`)

**Status:** API endpoints are implemented (`GET /api/user`, `PUT /api/user`, and `POST /api/user/avatar`). Only the Settings page UI is pending (P2 backlog).

**Data Source:** `auth.users` via `supabase.auth.getUser()` + `users` table

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

### Version History

| Version | Date       | Changes                                                                                                                                                                                                                                                                                                                                |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.3    | 2026-06-17 | Full language cleanup — translated all Indonesian text to English. Updated section 3.4 status note to reflect that API endpoints are implemented. Expanded API endpoint docs with request/response shapes. Added section 3.3.5 for Strava OAuth cross-reference. Fixed response message strings to match actual route implementations. |
| v1.2    | —          | Prior version (Indonesian content, stub API docs)                                                                                                                                                                                                                                                                                      |
