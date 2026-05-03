# Product Requirements Document (PRD)
## Personal Management App

**Version:** 1.0  
**Last Updated:** 2026-05-03  
**Owner:** Rafael Cahya  
**Stack:** Next.js 15 App Router · Supabase (PostgreSQL) · Tailwind CSS · shadcn/ui · Claude AI (Sonnet 4.6)

---

## 1. Overview

Personal Management App adalah aplikasi web pribadi untuk mengelola dua domain utama:
1. **Inventory** — Manajemen stok produk rumah tangga
2. **Trading** — Manajemen dan analisis portofolio saham

Aplikasi ini dilengkapi dengan **AI Chat** berbasis Claude untuk interaksi natural language di kedua domain.

---

## 2. Users & Access

| Role | Akses |
|------|-------|
| Authenticated User | Full access ke semua fitur |
| Unauthenticated | Redirect ke `/login` |

- Auth via Supabase (Google OAuth only)
- Session dikelola via SSR cookies (middleware.js)
- Setiap request ke `/main/*` dan `/api/*` harus authenticated

---

## 3. Modules & Features

---

### 3.1 Inventory Management Module

**Tujuan:** Melacak stok produk rumah tangga, penggunaan, dan riwayat konsumsi.

#### 3.1.1 Product List (`/main/inventory/product-list`)

**Deskripsi:** Halaman utama manajemen produk.

**Fitur:**
- Tampilkan semua produk dengan informasi: nama, brand, stok saat ini, status favorit
- Filter produk berdasarkan brand, nama, atau status favorit
- Tambah produk baru (form: nama, brand, quantity awal)
- Edit detail produk
- Hapus produk (soft delete atau hard delete)
- Tandai/hapus produk sebagai favorit
- Tambah stok (input quantity penambahan)
- Kurangi stok / log penggunaan (input quantity pemakaian)

**Validasi:**
- Nama produk wajib diisi
- Brand wajib dipilih
- Quantity tidak boleh negatif
- Pengurangan stok tidak boleh melebihi stok tersedia

**Error States:**
- Stok habis (quantity = 0) → tampilkan badge "Habis"
- Stok menipis (quantity ≤ threshold) → tampilkan warning

---

#### 3.1.2 Product Brand (`/main/inventory/product-brand`)

**Deskripsi:** Manajemen master data brand produk.

**Fitur:**
- Tampilkan semua brand
- Tambah brand baru
- Edit nama brand
- Hapus brand (hanya jika tidak digunakan produk)

**Validasi:**
- Nama brand wajib diisi
- Nama brand harus unik
- Tidak bisa hapus brand yang masih dipakai produk

---

#### 3.1.3 Product Name (`/main/inventory/product-name`)

**Deskripsi:** Manajemen master data tipe/nama produk.

**Fitur:**
- Tampilkan semua tipe produk
- Tambah tipe produk baru
- Edit tipe produk
- Hapus tipe produk (hanya jika tidak digunakan)

---

#### 3.1.4 Product History (`/main/inventory/product-history`)

**Deskripsi:** Riwayat penggunaan dan penambahan stok.

**Fitur:**
- Tampilkan log aktivitas (tambah stok / kurangi stok) per produk
- Filter berdasarkan produk, tanggal, atau tipe aktivitas
- Tidak ada aksi edit/hapus — history bersifat immutable

---

#### 3.1.5 Inventory AI Chat

**Deskripsi:** Chat interface dengan Claude untuk perintah natural language.

**Kemampuan AI:**
- Cari produk berdasarkan nama
- Log penggunaan produk ("pakai 2 sabun mandi")
- Tambah stok produk ("tambah 5 susu")
- Buat brand baru
- Buat tipe produk baru
- Tanya stok saat ini

**API:** `POST /api/chat`

---

### 3.2 Trading Management Module

**Tujuan:** Mencatat, menganalisis, dan mengevaluasi performa trading saham.

---

#### 3.2.1 Dashboard (`/main/trading/dashboard`)

**Deskripsi:** Overview performa trading dengan KPI metrics.

**Fitur:**
- Tampilkan metrics: Win Rate, Total P&L, Avg Profit, Avg Loss, Risk/Reward Ratio
- Tampilkan Quick View: trade terbaru, trade terbaik, trade terburuk
- Grafik performa (profit/loss over time)
- Risk analysis metrics
- Filter berdasarkan periode (minggu, bulan, semua)

---

#### 3.2.2 Trade List (`/main/trading/trade`)

**Deskripsi:** CRUD untuk data trade individual.

**Fitur:**
- Tampilkan semua trade dengan informasi: saham, entry price, exit price, quantity, P&L, tanggal
- Tambah trade baru
- Edit trade
- Hapus trade
- Filter berdasarkan saham, tanggal, hasil (profit/loss), sesi masuk

**Field Trade:**
- Kode saham (stock type)
- Harga beli (entry price)
- Harga jual (exit price)
- Quantity / lot
- Tanggal entry & exit
- Sesi masuk (entry session)
- Alasan beli (buy reason)
- Alasan jual (sell reason)
- Event terkait (opsional)
- Fee yang dikenakan

**Validasi:**
- Harga tidak boleh negatif
- Exit price opsional (trade masih open)
- Quantity minimal 1 lot

---

#### 3.2.3 Event (`/main/trading/event`)

**Deskripsi:** Pencatatan event pasar yang mempengaruhi trading.

**Fitur:**
- Tampilkan semua event
- Tambah event baru (nama event, tanggal, dampak)
- Edit event
- Hapus event
- Event bisa dikaitkan ke trade

---

#### 3.2.4 Fee (`/main/trading/fee`)

**Deskripsi:** Manajemen biaya/komisi trading.

**Fitur:**
- Tampilkan semua struktur fee
- Tambah fee baru
- Edit fee
- Hapus fee
- Fee dipakai dalam kalkulasi net P&L

---

#### 3.2.5 Settings (`/main/trading/settings`)

**Deskripsi:** Konfigurasi parameter trading personal.

**Fitur:**
- Set initial margin
- Set risk-free rate
- Set risk parameters
- Simpan ke database per user

---

#### 3.2.6 Trading AI Chat

**Deskripsi:** Chat interface dengan Claude untuk analisis trading.

**Kemampuan AI:**
- Hitung win rate
- Analisis trade terbaik dan terburuk
- Saran perbaikan performa
- Query data trade dengan natural language

**API:** `POST /api/trade-chat`

---

### 3.3 Authentication Module

#### 3.3.1 Login (`/login`)

**Deskripsi:** Halaman login dengan Google OAuth. Menangani error params dan session expiry messaging.

**Fitur:**
- [DEPRECATED] ~~Form email + password~~
- [DEPRECATED] ~~Validasi format email~~
- [DEPRECATED] ~~Error message jika credentials salah~~
- Login via Google OAuth (single sign-on button)
- Loading/disabled state pada Google button selama OAuth redirect berlangsung
- Baca `?error=` query param dan tampilkan toast message:
  - `?error=auth_failed` → "Authentication failed. Please try again."
  - `?error=no_code` → "OAuth callback did not receive an authorization code."
- Baca `?reason=` query param dan tampilkan toast message:
  - `?reason=session_expired` → "Your session has expired. Please sign in again."
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

**Deskripsi:** Logout terpusat via `LogoutButton` component. Satu canonical implementation.

**Component:** `app/login/components/Logout.jsx` (`LogoutButton`)

**Fitur:**
- Memanggil `supabase.auth.signOut()` client-side
- Loading/disabled state selama proses logout
- Toast error jika logout gagal
- Redirect ke `/login` setelah logout berhasil
- WCAG: `aria-label` pada button, keyboard accessible

**Lokasi button:**
- Inventory layout (`app/main/inventory/layout.jsx`) — di header
- Trading layout (`app/main/trading/layout.jsx`) — di samping Settings button
- Landing page

**API endpoint:** `POST /api/auth/logout`
- Server-side session termination via `supabase.auth.signOut()`
- Response: `{ message: "Logged out successfully" }`

**User Story:**
> As an authenticated user, I want to log out securely, so that my session is terminated and no one else can access my account.

**Acceptance Criteria:**
```
GIVEN I am logged in and click the Logout button
WHEN logout is processing
THEN the button shows loading state and is disabled

GIVEN logout completes successfully
WHEN supabase.auth.signOut() resolves
THEN I am redirected to /login

GIVEN logout fails due to a network error
WHEN supabase.auth.signOut() rejects
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
- Saat event `SIGNED_OUT` terdeteksi → redirect ke `/login?reason=session_expired`
- Login page membaca `?reason=session_expired` dan menampilkan toast message

**User Story:**
> As an authenticated user whose session has expired, I want to be automatically redirected to login with a clear message, so that I understand why I was logged out.

**Acceptance Criteria:**
```
GIVEN I am on any /main/* page
WHEN my Supabase session expires (SIGNED_OUT event fires)
THEN I am automatically redirected to /login?reason=session_expired

GIVEN I arrive at /login?reason=session_expired
WHEN the page loads
THEN a toast message is shown: "Your session has expired. Please sign in again."
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

## 4. API Standards

### Response Format
```json
// Success
{ "data": {...}, "message": "string" }

// Error
{ "error": "ERROR_CODE", "message": "Human readable message" }
```

### HTTP Status Codes
| Status | Kondisi |
|--------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error / Bad request |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Server error |

### Auth
- Semua endpoint `/api/*` (kecuali `/api/auth/*`) harus validasi session
- [DEPRECATED] ~~Gunakan JWT/authToken cookie untuk validasi auth di route handler~~
- Semua `/api/*` route handler WAJIB menggunakan `lib/supabase/server.ts` `createClient()` + `supabase.auth.getUser()` untuk validasi session
- Admin operations (misal: bypass RLS) menggunakan `createAdminClient()` dari `lib/supabase/admin.js` — bukan singleton, panggil sebagai fungsi setiap kali dibutuhkan
- Endpoint auth:
  - `POST /api/auth/logout` — server-side session termination

---

## 5. UI/UX Standards

- **Design System:** shadcn/ui + Tailwind CSS
- **Color Tokens:** `primary`, `secondary`, `tertiary`, `trade-profit`, `trade-loss`, `trade-warning`
- **Responsive:** Mobile-first, minimal breakpoint tablet (768px) dan desktop (1024px)
- **Loading States:** Setiap async operation harus tampilkan skeleton atau spinner
- **Empty States:** Setiap list harus punya tampilan saat data kosong
- **Error States:** Setiap form dan API call harus handle error dengan pesan yang jelas
- **Accessibility:** WCAG 2.1 AA (keyboard nav, contrast ratio, aria labels, semantic HTML)

---

## 6. Database Tables

| Tabel | Module | Keterangan |
|-------|--------|------------|
| `product_list` | Inventory | Data produk |
| `product_brand` | Inventory | Master brand |
| `product_name` | Inventory | Master tipe produk |
| `product_quantity` | Inventory | Stok saat ini per produk |
| `product_history` | Inventory | Log aktivitas stok |
| `trade_list` | Trading | Data trade |
| `event_list` | Trading | Event pasar |
| `fee_list` | Trading | Struktur fee |
| `settings` | Trading | Setting per user |
| `auth.users` | Auth | Managed by Supabase |

---

## 7. Non-Functional Requirements

| Aspek | Requirement |
|-------|-------------|
| Performance | API response < 2 detik |
| Security | No raw SQL interpolation, input sanitization, encrypted sensitive fields |
| Accessibility | WCAG 2.1 AA |
| Browser Support | Chrome, Firefox, Safari (2 versi terakhir) |
| Auth | Session-based via Supabase SSR cookies |

---

## 8. Agent Instructions

Dokumen ini adalah **sumber kebenaran tunggal** untuk semua agent. Saat mengerjakan task:

- **PM Agent** → analisis product, identifikasi gap, dan update PRD ini sebagai owner
- **Frontend Agent** → implementasi sesuai section 3 (features) dan section 5 (UI/UX standards)
- **Backend Agent** → implementasi sesuai section 3 (features) dan section 4 (API standards)
- **Tester Agent** → buat test case berdasarkan semua fitur, validasi, dan error states di section 3

Setiap perubahan requirement harus diupdate oleh PM Agent di file ini terlebih dahulu sebelum diimplementasi oleh agent lain.

---

## 9. Version History

| Versi | Tanggal | Perubahan | Author |
|-------|---------|-----------|--------|
| 1.0 | 2026-05-03 | Initial PRD — dokumentasi semua fitur existing | Rafael Cahya |
| 1.1 | 2026-05-03 | Auth module security & UX fixes — see sprint log. Updated 3.3.1 (Login: Google OAuth only, error/reason param handling, ?next= flow, Suspense); Added 3.3.3 (Logout: LogoutButton, POST /api/auth/logout); Added 3.3.4 (Session Expiry: AuthListener); Updated 3.3.2 (Callback: no_code/auth_failed redirects, ?next= preservation); Updated 3.4 (User Settings APIs: GET/PUT /api/user, POST /api/user/avatar); Updated Section 4 Auth (removed JWT, added createAdminClient pattern, added /api/auth/logout); Updated Section 2 (Google OAuth only) | Rafael Cahya |
