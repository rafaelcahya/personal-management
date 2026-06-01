# PRD — Authentication & User Settings

> Part of PRD_Personal_Management. Shared standards: [PRD_Shared.md](./PRD_Shared.md)

---

### 3.3 Authentication Module

---

#### 3.3.0 Authentication Flow Overview

> Baca bagian ini dulu sebelum membaca detail teknis. Ini adalah peta besar seluruh auth flow.

---

##### LOGIN FLOW

```
User buka halaman protected (misal: /main/trading)
    │
    ▼
[Middleware] cek session
    │
    ├── ❌ Tidak ada session
    │       │
    │       ▼
    │   Redirect → /login?next=/main/trading
    │       │
    │       ▼
    │   [Login Page] User klik "Sign in with Google"
    │       │
    │       ▼
    │   signInWithOAuth() → redirect ke Google
    │       │
    │       ▼
    │   [Google Auth] User approve
    │       │
    │       ▼
    │   Redirect ke /auth/v1/callback?code=xxx&next=/main/trading
    │       │
    │       ├── ❌ code tidak ada → /login?error=no_code
    │       ├── ❌ code exchange gagal → /login?error=auth_failed
    │       └── ✅ berhasil → redirect ke /main/trading (dari ?next=)
    │
    └── ✅ Ada session → lanjut ke halaman tujuan
```

---

##### LOGOUT FLOW

```
User klik tombol "Sign out"
    │
    ▼
[LogoutButton / UserMenu] set sessionStorage flag "intentional_logout"
    │
    ▼
POST /api/auth/logout
    │
    ├── ❌ Gagal → hapus flag → tampilkan toast error → tetap di halaman
    │
    └── ✅ Berhasil → server clear session cookie
            │
            ▼
        Redirect → /login
            │
            ▼
        [AuthListener] deteksi SIGNED_OUT event
            │
            └── cek flag "intentional_logout" → ada → tidak tampilkan toast
                (redirect sudah ditangani LogoutButton)
```

---

##### SESSION EXPIRY FLOW

```
User sedang aktif di /main/* → session Supabase habis/expired
    │
    ▼
[AuthListener] deteksi SIGNED_OUT event
    │
    └── cek flag "intentional_logout" → tidak ada
            │
            ▼
        Redirect → /login?reason=session_expired
        (tidak ada toast di sini — untuk menghindari double toast)
            │
            ▼
        [Login Page] baca ?reason=session_expired
            │
            ▼
        Tampilkan toast: "You've been signed out. Please sign in again to continue."
```

---

##### ERROR MESSAGES QUICK REFERENCE

| URL Param                 | Artinya                   | Pesan ke User                                               |
| ------------------------- | ------------------------- | ----------------------------------------------------------- |
| `?error=auth_failed`      | Google OAuth gagal        | "Login failed. Please try again."                           |
| `?error=no_code`          | Callback tidak dapat code | "Invalid login attempt. Please try again."                  |
| `?reason=session_expired` | Sesi habis otomatis       | "You've been signed out. Please sign in again to continue." |

---

#### 3.3.1 Login (`/login`)

**Deskripsi:** Halaman login dengan Google OAuth. Menangani error params dan session expiry messaging. Menampilkan app identity (logo + nama app) di atas card login.

**Fitur:**

- [DEPRECATED v1.1] ~~Form email + password~~ — diganti Google OAuth only
- [DEPRECATED v1.1] ~~Validasi format email~~ — tidak relevan setelah OAuth only
- [DEPRECATED v1.1] ~~Error message jika credentials salah~~ — tidak relevan setelah OAuth only
- App identity ditampilkan di atas Card: icon `LayoutDashboard` + teks "Personal Management"
- Login via Google OAuth (single sign-on button)
- **Google button harus mengikuti Google branding guidelines:**
  - Background putih (`bg-white`), border `border-slate-300`, teks `text-slate-700`
  - SVG icon Google 4-warna (bukan `currentColor`): `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`
  - Label button: `"Sign in with Google"` (bukan "Continue with Google")
- Loading/disabled state pada Google button selama OAuth redirect berlangsung
  - Loading text: `"Redirecting to Google..."`
- Baca `?error=` query param dan tampilkan toast message:
  - `?error=auth_failed` → `"Login failed. Please try again."`
  - `?error=no_code` → `"Invalid login attempt. Please try again."`
- Baca `?reason=` query param dan tampilkan toast message:
  - `?reason=session_expired` → `"You've been signed out. Please sign in again to continue."`
  - **Catatan:** Toast session expiry hanya ditampilkan di login page via `?reason=` param, BUKAN di `AuthListener` (untuk menghindari double toast)
- `?next=` param diteruskan melalui OAuth flow untuk preservasi redirect tujuan
- Halaman di-wrap dalam `<Suspense>` untuk kompatibilitas Next.js SSR

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

**Deskripsi:** Handler OAuth callback dari Supabase. Menggunakan `lib/supabase/server.ts` createClient.

**Behavior:**

- Jika `?code=` param tidak ada → redirect ke `/login?error=no_code`
- Jika code exchange gagal → redirect ke `/login?error=auth_failed`
- Jika auth berhasil → redirect ke `?next=` param (jika ada) atau ke `/main/landing`
- `?next=` param dipreservasi dari original request dan diteruskan ke redirect tujuan
- Menggunakan `lib/supabase/server.ts` `createClient()` (bukan manual `createServerClient`)

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

**Deskripsi:** Logout terpusat via dua komponen tergantung lokasi. Logout dilakukan **server-side** melalui API endpoint untuk memastikan session cookie benar-benar di-clear di server sebelum redirect.

**Komponen:**

- `app/login/components/Logout.jsx` → `LogoutButton` — dipakai di Inventory & Trading layout
- `app/login/components/UserMenu.jsx` → `UserMenu` — dipakai di Landing page (menampilkan avatar + email user)

**`LogoutButton` — Fitur:**

- Default `size="sm"` (bisa di-override via prop) — konsisten dengan tombol action lain di layout
- Label: `"Sign out"` | Loading: `"Signing out..."`
- Warna: neutral (`text-slate-500`, `hover:text-slate-700`) — bukan merah (logout bukan aksi destructive)
- Set `sessionStorage` flag `intentional_logout` sebelum memanggil API
- Panggil `POST /api/auth/logout` (server-side session termination)
- Loading/disabled state selama proses
- Toast error jika gagal: `"Couldn't sign you out — please try again."`
- Redirect ke `/login` setelah berhasil
- WCAG: `aria-label="Sign out from application"`, keyboard accessible

**`UserMenu` — Fitur:**

- Tampilkan avatar Google user (foto profil dari `user_metadata.avatar_url`)
- Fallback avatar: inisial huruf pertama nama user dengan background `bg-primary/10`
- Tampilkan first name di sebelah avatar (hidden on mobile `sm:inline`)
- Klik buka `DropdownMenu` yang menampilkan email user dan opsi "Sign out"
- Logout logic sama dengan `LogoutButton` (API call + intentional flag + redirect)

**Lokasi:**

- Inventory layout (`app/main/inventory/layout.jsx`) → `LogoutButton`
- Trading layout (`app/main/trading/layout.jsx`) → `LogoutButton` (di samping Settings button)
- Landing page (`app/main/landing/page.jsx`) → `UserMenu` (dengan `user` prop dari `requireAuth()`)

**API endpoint:** `POST /api/auth/logout`

- Validasi session dulu — return 401 jika tidak authenticated
- Server-side session termination via `supabase.auth.signOut()`
- Clear session cookie di server
- Response success: `{ message: "Logged out successfully" }` (200)
- Response error: `{ error: "LOGOUT_FAILED", message: "..." }` (500)

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

**Deskripsi:** Global listener untuk deteksi sesi yang habis, dipasang di root layout.

**Component:** `components/AuthListener.jsx`

**Behavior:**

- Di-mount secara global di `app/layout.tsx`
- Mendengarkan `supabase.auth.onAuthStateChange`
- Saat event `SIGNED_OUT` terdeteksi:
  - Cek `sessionStorage` key `intentional_logout`
  - Jika ada → intentional logout (sudah ditangani `LogoutButton`/`UserMenu`) → tidak lakukan apapun
  - Jika tidak ada → session expired → redirect ke `/login?reason=session_expired`
- Toast ditampilkan **hanya oleh login page** (bukan AuthListener) via `?reason=session_expired` param
- **Mengapa tidak toast di AuthListener:** Untuk menghindari double toast — toast dari AuthListener bisa muncul sebelum redirect terjadi, lalu login page menampilkan toast kedua

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

### 3.4 User Settings (`/settings`)

**Status:** `/settings` page belum diimplementasi — P2 backlog.

**Data Source:** `auth.users` via `supabase.auth.getUser()` + tabel `users`

**API Endpoints:**

`GET /api/user`

- Auth: Required (via `lib/supabase/server.ts` + `supabase.auth.getUser()`)
- Response: `{ data: { user: { id, username, nickname, avatar } } }`

`PUT /api/user`

- Auth: Required
- Body: `{ username, nickname, avatar }`
- Response: `{ data: { user: {...} }, message: "Updated successfully" }`

`POST /api/user/avatar`

- Auth: Required
- Body: multipart form data (file upload)
- Storage: Supabase Storage bucket `avatar`
- Response: `{ data: { path, url }, message: "Avatar uploaded" }`

**Fitur (P2 — belum diimplementasi):**

- Tampilkan & edit profil user
- Upload foto avatar
- Preferensi aplikasi

---

