# Product Requirements Document (PRD)

## Personal Management App

**Version:** 1.17  
**Last Updated:** 2026-05-17  
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

| Role               | Akses                      |
| ------------------ | -------------------------- |
| Authenticated User | Full access ke semua fitur |
| Unauthenticated    | Redirect ke `/login`       |

- Auth via Supabase (Google OAuth only)
- Session dikelola via SSR cookies (middleware.js)
- Setiap request ke `/main/*` dan `/api/*` harus authenticated

---

## 3. Modules & Features

---

### 3.1 Inventory Management Module

**Tujuan:** Melacak stok produk rumah tangga, penggunaan, dan riwayat konsumsi.

---

#### 3.1.0 Inventory Dashboard (`/main/inventory`)

**Deskripsi:** Halaman utama modul Inventory yang memberikan gambaran menyeluruh kondisi stok dan analitik konsumsi produk. Dashboard terdiri dari 6 summary cards dan 11 section analitik yang dirancang untuk membantu user membuat keputusan restock yang tepat waktu dan berbasis data.

**Route:** `/main/inventory`
**Entry Point:** `app/main/inventory/page.jsx`
**Komponen Utama:** `app/main/inventory/InventoryDashboard.jsx`

**User Stories:**

> As a user, I want to see a high-level overview of my inventory, so that I can quickly understand the current state of my stock without navigating to individual product pages.

> As a user, I want to be alerted when products are running low, so that I can restock before they run out.

> As a user, I want to know how much I spend per product and per category, so that I can make smarter purchasing decisions.

> As a user, I want to see how my spending compares month-over-month, so that I can track whether I'm spending more or less than before.

> As a user, I want to know which products I restock most often, so that I can prioritize them and plan ahead.

> As a user, I want to see how my cost per use has trended over time per product, so that I can evaluate whether my purchasing decisions are improving.

> As a user, I want to know when each product will likely run out, so that I can plan restocks in advance before running out.

> As a user, I want to set a monthly budget per product category and track actual spend against it, so that I can control my spending.

> As a user, I want to see a heatmap of my purchase activity over the past year, so that I can identify spending patterns and seasonal trends.

> As a user, I want to see a composite score for each product combining cost efficiency and usage duration, so that I can identify which products are the best value.

---

##### Summary Cards (6 Cards)

**Deskripsi:** 6 card ringkasan yang memberikan overview cepat kondisi inventory saat ini. Setiap card dapat diklik untuk navigasi ke Product List dengan filter yang relevan.

| Card           | Kalkulasi                                              | Sumber Data    | Filter ke Product List |
| -------------- | ------------------------------------------------------ | -------------- | ---------------------- |
| Total Products | Jumlah semua produk (active + inactive, tidak deleted) | `product_list` | Semua produk           |
| Active         | Produk dengan `product_status = 'active'`              | `product_list` | Filter: active         |
| Low Stock      | Produk dengan `quantity ≤ 2` (dari `lowStockAlerts`)   | Dashboard API  | Filter: low-stock      |
| Total Stock    | SUM(`quantity`) semua produk                           | `product_list` | Semua produk           |
| In Use         | SUM(`usage_quantity`) semua produk                     | `product_list` | Semua produk           |
| Favorites      | Produk dengan `is_favorite = true`                     | `product_list` | Filter: favorites      |

**Catatan:**

- Card **Active** menampilkan sub-label `"of X products"` (X = totalProducts) untuk konteks cepat
- Card **Low Stock** menggantikan card "Inactive" — nilainya = `lowStockAlerts.length` (produk dengan `quantity ≤ 2`)
- Klik card menyimpan filter ke `localStorage` (`statusFilter` key) lalu navigasi ke `/main/inventory/product-list`

**Layout:** Responsive — 2 kolom (mobile) → 3 kolom (tablet) → 6 kolom (desktop)

**Accessibility:**

- Setiap card di-wrap dalam native `<button>` (keyboard accessible: Enter/Space)
- Icon menggunakan `aria-hidden="true"` (dekoratif)
- Focus ring: `focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2`
- Nilai angka menggunakan `tabular-nums` untuk rendering stabil

**Acceptance Criteria:**

```
GIVEN saya membuka halaman /main/inventory
WHEN data berhasil dimuat
THEN 6 summary cards ditampilkan dengan angka yang sesuai kondisi inventory saat ini

GIVEN data sedang dimuat
WHEN API belum merespons
THEN card menampilkan skeleton/pulse loading state

GIVEN saya klik card "Active"
WHEN navigasi terjadi
THEN localStorage["statusFilter"] = "active" dan diarahkan ke /main/inventory/product-list

GIVEN saya klik card "Low Stock"
WHEN navigasi terjadi
THEN localStorage["statusFilter"] = "low-stock" dan diarahkan ke /main/inventory/product-list

GIVEN saya navigasi ke summary card dengan keyboard (Tab)
WHEN saya tekan Enter atau Space pada card
THEN navigasi terjadi sama seperti klik mouse
```

**API:** `GET /api/inventory/v1/product/summary` (Total Products, Active, Total Stock, In Use, Favorites)
`GET /api/inventory/v1/dashboard` → `lowStockAlerts` (untuk Low Stock count)

---

##### Section 0: Spend This Month vs Last Month

**Deskripsi:** Chart perbandingan total pengeluaran bulan ini vs bulan lalu, lengkap dengan delta (naik/turun). Memberikan gambaran cepat apakah user lebih banyak atau lebih sedikit berbelanja dibanding bulan sebelumnya.

**Kalkulasi:**

- `thisMonth.total` = SUM(`price`) dari `product_quantity` di bulan berjalan (format YYYY-MM)
- `lastMonth.total` = SUM(`price`) dari `product_quantity` di bulan sebelumnya
- `delta` = `thisMonth.total - lastMonth.total`
- `deltaPercent` = `(delta / lastMonth.total) * 100` — null jika `lastMonth.total = 0`

**Tampilan:**

- Dua angka besar: This Month (hitam) dan Last Month (abu)
- Delta badge: merah jika naik (▲), hijau jika turun (▼), dengan persentase
- Bar chart: 2 bar (last month abu/ungu muda, this month ungu tua)

**Behavior:**

- Empty state jika tidak ada data sama sekali: "No purchase data yet 📋"

**Acceptance Criteria:**

```
GIVEN ada data pembelian di bulan ini dan bulan lalu
WHEN section dimuat
THEN kedua angka ditampilkan bersama delta badge dan bar chart

GIVEN total bulan ini lebih besar dari bulan lalu
WHEN section dimuat
THEN delta badge berwarna merah dengan arrow ▲ dan persentase kenaikan

GIVEN total bulan ini lebih kecil dari bulan lalu
WHEN section dimuat
THEN delta badge berwarna hijau dengan arrow ▼ dan persentase penurunan

GIVEN tidak ada data pembelian sama sekali
WHEN section dimuat
THEN tampilkan empty state "No purchase data yet 📋"
```

---

##### Section 1: Cost Per Use

**Deskripsi:** Menampilkan biaya per unit pemakaian setiap produk untuk membantu user mengevaluasi nilai ekonomis setiap produk dan membuat keputusan pembelian yang lebih rasional.

**Kalkulasi:**

- `total_spent` = SUM(`price`) dari `product_quantity` per produk
- `total_units` = `quantity` saat ini + jumlah unit yang pernah dipakai (dari `product_history.depleted_quantity`)
- `cost_per_use` = `total_spent` / `total_units`

**Tampilan:** Tabel dengan kolom: No, Product (brand + nama + type badge), Total Spent, Total Units, Cost/Use, Status

**Behavior:**

- Default: menampilkan top 5 produk dengan cost per use tertinggi
- View All: modal `max-w-6xl`, menampilkan semua produk sorted by `cost_per_use DESC`
- Empty state: "No products yet."

**Acceptance Criteria:**

```
GIVEN ada produk dengan data pembelian (product_quantity)
WHEN section Cost Per Use dimuat
THEN ditampilkan maksimal 5 produk dengan cost per use tertinggi, diurutkan descending

GIVEN user klik "View All"
WHEN modal dibuka
THEN semua produk ditampilkan sorted by cost per use DESC

GIVEN tidak ada produk yang memiliki data pembelian
WHEN section dimuat
THEN tampilkan empty state "No products yet."
```

---

##### Section 2: Low Stock Alert

**Deskripsi:** Peringatan dini untuk produk yang hampir habis agar user dapat melakukan restock sebelum kehabisan.

**Trigger:** Produk dengan `quantity ≤ 2` (semua status, termasuk inactive)

**Tampilan:** Tabel dengan kolom: No, Product (brand + nama + type badge), Status, Stock

**Stock Badge:**
| Kondisi | Badge |
|---------|-------|
| `quantity === 0` | Badge merah "Out of Stock" |
| `quantity ≤ 2` | Badge orange "Low: X left" |

**Behavior:**

- Default: top 5 produk sorted by `quantity ASC` (paling kritis di atas)
- View All: modal `max-w-2xl`
- Empty state: "All good! Stock levels are healthy 🎉"

**Acceptance Criteria:**

```
GIVEN ada produk dengan quantity ≤ 2
WHEN section Low Stock Alert dimuat
THEN produk tersebut ditampilkan dengan badge yang sesuai (merah jika 0, orange jika ≤ 2)

GIVEN ada produk dengan quantity = 0
WHEN section dimuat
THEN produk tersebut muncul paling atas dengan badge "Out of Stock" berwarna merah

GIVEN semua produk memiliki quantity > 2
WHEN section dimuat
THEN tampilkan empty state "All good! Stock levels are healthy 🎉"
```

---

##### Section 3: Most Restocked Products

**Deskripsi:** Menampilkan produk yang paling sering di-restock oleh user, membantu mengidentifikasi produk yang paling banyak dikonsumsi dan perlu stok ekstra.

**Data:** Count records per produk dari `product_quantity` + tanggal restock terakhir

**Tampilan:** Tabel dengan kolom: No, Product (brand + nama + type badge), Last Restock, Restocks (count badge)

**Behavior:**

- Default: top 5 produk sorted by `restock_count DESC`
- View All: modal `max-w-2xl`
- Empty state: "No restock history yet 📦"

**Acceptance Criteria:**

```
GIVEN ada produk dengan multiple purchase records di product_quantity
WHEN section Most Restocked dimuat
THEN produk ditampilkan sorted by restock_count DESC

GIVEN user klik "View All"
WHEN modal dibuka
THEN semua produk ditampilkan sorted by restock_count DESC

GIVEN tidak ada data pembelian sama sekali
WHEN section dimuat
THEN tampilkan empty state "No restock history yet 📦"
```

---

##### Section 4: Monthly Spend by Type

**Deskripsi:** Membantu user memahami pola pengeluaran per produk per bulan untuk perencanaan budget yang lebih baik.

**Data:** Join `product_quantity` (purchase records) dengan `product_list` (untuk `product`, `brand`, `type`)

**Periode:** 6 bulan terakhir

**Granularitas:** Per produk (bukan per kategori) — setiap baris mewakili 1 produk per bulan

**Tampilan:**

- Header: judul section + "This Month" total di pojok kanan (total spend bulan berjalan)
- Grouped list by month — tiap bulan punya header, diikuti baris per produk:
  - Brand (abu-abu kecil di atas)
  - Nama produk (bold) + type badge di sampingnya
  - Total spent (kanan)

**Behavior:**

- Header menampilkan total spend bulan ini (format Rupiah) di pojok kanan jika ada data
- Default: menampilkan 5 data entries pertama
- View All: modal `max-w-md`, menampilkan semua data 6 bulan
- Sort: Month DESC, `total_spent DESC` dalam satu bulan
- Empty state: "No purchase data yet 📋"
- Format angka: Rupiah (Rp X.XXX.XXX)

**Acceptance Criteria:**

```
GIVEN ada data pembelian dalam 6 bulan terakhir
WHEN section Monthly Spend by Type dimuat
THEN data ditampilkan grouped per bulan, per produk, diurutkan dari bulan terbaru

GIVEN ada data pembelian di bulan ini
WHEN section dimuat
THEN total spend bulan ini ditampilkan di pojok kanan header section

GIVEN user klik "View All"
WHEN modal dibuka
THEN semua data 6 bulan ditampilkan per produk, sorted by month DESC lalu total_spent DESC

GIVEN tidak ada data pembelian
WHEN section dimuat
THEN tampilkan empty state "No purchase data yet 📋"
```

---

##### Section 5: Avg Usage Duration

**Deskripsi:** Menampilkan rata-rata durasi satu sesi pemakaian per produk untuk membantu user mengestimasi kapan perlu restock.

**Kalkulasi:**

- Jika produk punya ≥ 2 history records: rata-rata gap antar consecutive `start_usage_date`
- Jika hanya 1 history record: `(NOW - start_usage_date)` dalam hari

**Tampilan:** Tabel dengan kolom: No, Product (brand + nama + type badge), Avg Duration

**Duration Badge:**
| Kondisi | Badge |
|---------|-------|
| `< 30 hari` | Badge merah (cepat habis) |
| `30–59 hari` | Badge kuning |
| `≥ 60 hari` | Badge hijau (tahan lama) |
| Format | `X days` |

**Behavior:**

- Default: top 5 produk sorted by `avg_days DESC`
- View All: modal `max-w-2xl`, subtitle "Sorted by longest average duration"
- Empty state: "Not enough usage data yet 📊"

**Acceptance Criteria:**

```
GIVEN ada produk dengan ≥ 2 product_history records
WHEN section Avg Usage Duration dimuat
THEN avg duration dihitung dari rata-rata gap antar consecutive start_usage_date

GIVEN ada produk dengan hanya 1 product_history record
WHEN section dimuat
THEN avg duration dihitung sebagai (NOW - start_usage_date) dalam hari

GIVEN produk memiliki avg duration < 30 hari
WHEN section dimuat
THEN badge berwarna merah (menandakan produk cepat habis)

GIVEN tidak ada produk yang memiliki data usage history
WHEN section dimuat
THEN tampilkan empty state "Not enough usage data yet 📊"
```

---

##### Section 6: Avg Cost/Use Over Time (CostPerUseHistory)

**Deskripsi:** Chart yang menampilkan tren cumulative cost per use per produk seiring waktu. Setiap data point mewakili satu event pembelian. Membantu user melihat apakah cost per use mereka naik atau turun dengan setiap restock.

**Kalkulasi per data point:**

- `cumulative_spent` = total pengeluaran kumulatif untuk produk hingga tanggal pembelian tersebut
- `total_units` = `current_quantity` + semua `product_history.quantity` (unit yang pernah dipakai)
- `cost_per_use` = `cumulative_spent` / `total_units`
- `delta` = `cost_per_use[i]` - `cost_per_use[i-1]` (perubahan dari pembelian sebelumnya)
- `delta_percent` = `delta / cost_per_use[i-1] * 100`

**Tampilan:**

- Header: judul + product selector dropdown (kanan atas)
- Line chart: x-axis = tanggal pembelian, y-axis = cost per use (format k untuk ribuan)
- Hover tooltip: tanggal, harga beli di pembelian itu, cumulative cost/use, delta dari pembelian sebelumnya (▲/▼ + Rp + %)

**Behavior:**

- Default: produk pertama dalam daftar (sorted by most purchase points)
- Product selector: semua produk yang memiliki ≥1 pembelian
- Jika produk hanya punya 1 pembelian: tampilkan pesan "Not enough purchases to show a trend yet."
- Empty state (tidak ada produk sama sekali): "No purchase history yet 📊"

**Acceptance Criteria:**

```
GIVEN ada produk dengan ≥ 2 purchase records
WHEN section Avg Cost/Use Over Time dimuat
THEN line chart ditampilkan dengan data points per purchase event

GIVEN user hover chart pada salah satu data point
WHEN tooltip muncul
THEN tooltip menampilkan: tanggal, harga beli, cumulative cost/use, dan delta vs pembelian sebelumnya (▲/▼)

GIVEN user memilih produk lain via selector
WHEN selector di-change
THEN chart di-update untuk menampilkan data produk yang dipilih

GIVEN produk hanya memiliki 1 purchase record
WHEN produk dipilih
THEN tampilkan pesan "Not enough purchases to show a trend yet."

GIVEN tidak ada produk dengan data pembelian
WHEN section dimuat
THEN tampilkan empty state "No purchase history yet 📊"
```

---

##### Section 7: Restock Prediction

**Deskripsi:** Prediksi kapan setiap produk akan habis berdasarkan rata-rata durasi pemakaian dan stok saat ini. Membantu user merencanakan restock sebelum kehabisan.

**Kalkulasi:**

- `days_until_empty` = `avg_days × quantity` (dibulatkan ke integer)
- `predicted_date` = `today + days_until_empty` dalam hari
- Produk dengan `quantity = 0`: `days_until_empty = 0`, `predicted_date = null`
- Produk aktif tanpa usage history di-skip (tidak dapat diprediksi)

**Filter:** Hanya produk dengan `product_status = 'active'`

**Tampilan:** Tabel dengan kolom: No, Product (brand + nama + type badge), Qty, Est. Empty, Status badge

**Urgency Badge:**
| Kondisi | Badge |
|---------|-------|
| `quantity = 0` | Badge merah "Out of Stock" |
| `days_until_empty ≤ 7` | Badge merah "Critical" |
| `days_until_empty ≤ 14` | Badge orange "Soon" |
| `days_until_empty ≤ 30` | Badge kuning "This Month" |
| `days_until_empty > 30` | Badge hijau "6+ Months" |

**Behavior:**

- Default: top 5, sorted by `days_until_empty DESC` (paling lama habis di atas)
- View All: modal `max-w-2xl`, subtitle "Sorted by most urgent first"
- Empty state: "Not enough usage data to predict 🔍"

**Acceptance Criteria:**

```
GIVEN ada produk aktif dengan usage history dan quantity > 0
WHEN section Restock Prediction dimuat
THEN predicted_date dihitung sebagai today + (avg_days × quantity)

GIVEN produk memiliki quantity = 0
WHEN section dimuat
THEN produk ditampilkan dengan badge "Out of Stock" dan tanpa predicted_date

GIVEN produk aktif tidak memiliki usage history
WHEN section dimuat
THEN produk tersebut tidak ditampilkan (tidak dapat diprediksi)
```

---

##### Section 8: Monthly Budget Tracker

**Deskripsi:** Memungkinkan user menetapkan budget bulanan per kategori produk (`type`) dan memantau realisasi pengeluaran bulan berjalan terhadap budget tersebut.

**Data:**

- Actual spend: aggregate `total_spent` bulan ini dari `monthlySpendByType` per `type`
- Budget settings: tabel `inventory_budget` (user-defined, persisted ke Supabase)

**Tampilan:** List per type dengan:

- Type name + persentase badge (%) di kiri
- Actual spend / budget amount (klik untuk edit inline) di kanan
- Progress bar dengan color coding

**Progress Bar Color:**
| Kondisi | Warna |
|---------|-------|
| `< 75%` | Violet |
| `75–99%` | Kuning |
| `≥ 100%` | Merah (over budget) |

**Inline Edit Budget:**

- Klik amount budget → input number muncul
- Enter atau klik "Save" untuk simpan
- Escape untuk cancel
- Validasi: angka ≥ 0

**Behavior:**

- Menampilkan semua type yang memiliki spend bulan ini ATAU budget yang sudah di-set
- Type belum punya budget menampilkan tombol "Set budget" sebagai placeholder
- Budget di-fetch terpisah dari `/api/inventory/v1/budget` (bukan dari dashboard API)
- Skeleton loading saat dashboard data atau budget data belum siap
- Empty state: "No spend data this month 📋"

**API:**

- `GET /api/inventory/v1/budget` → list semua budget user
- `POST /api/inventory/v1/budget` → upsert budget (body: `{ type, monthly_budget }`)

**Acceptance Criteria:**

```
GIVEN ada spend bulan ini untuk type "Skincare"
WHEN section Monthly Budget Tracker dimuat
THEN type "Skincare" ditampilkan dengan actual spend dan progress bar

GIVEN user belum set budget untuk suatu type
WHEN type tersebut ditampilkan
THEN tombol "Set budget" muncul sebagai placeholder budget

GIVEN user klik budget amount dan mengisi nilai baru
WHEN user tekan Enter atau klik Save
THEN budget tersimpan ke Supabase dan progress bar diupdate

GIVEN actual spend ≥ budget
WHEN section dimuat
THEN progress bar berwarna merah dan badge % menampilkan ≥ 100%
```

---

##### Section 9: Spending Heatmap

**Deskripsi:** Visualisasi aktivitas pembelian harian selama 12 bulan terakhir dalam format calendar heatmap (GitHub-style). Membantu user mengidentifikasi pola belanja dan tren musiman.

**Data:** Aggregate `SUM(price)` per hari dari `product_quantity`, periode 12 bulan terakhir

**Tampilan:**

- Grid 52 minggu × 7 hari (Sunday–Saturday), dirender dari kiri ke kanan
- Label bulan di atas grid
- Label hari (Mon, Wed, Fri) di kiri grid
- Legend di bawah kiri: "Less → More" dengan 5 kotak warna

**Color Levels (5 level):**
| Level | Range | Warna Tailwind |
|-------|-------|----------------|
| 0 | No spend | `bg-slate-100` |
| 1 | > 0 – < 50k | `bg-violet-200` |
| 2 | 50k – 200k | `bg-violet-400` |
| 3 | 200k – 500k | `bg-violet-600` |
| 4 | > 500k | `bg-violet-800` |

**Hover Tooltip:** Tanggal (dd MMM yyyy) + amount (format Rupiah atau "No spend")

**Behavior:**

- Hari di masa depan: tidak dirender (kosong)
- Implementasi custom tanpa library tambahan (murni React + Tailwind + date-fns)
- Loading state: skeleton `h-24` full width
- Posisi di dashboard: setelah SpendComparison

**Acceptance Criteria:**

```
GIVEN ada data pembelian pada tanggal tertentu
WHEN user hover cell tersebut di heatmap
THEN tooltip menampilkan tanggal dan total spend hari itu

GIVEN tidak ada pembelian pada suatu hari
WHEN user hover cell tersebut
THEN tooltip menampilkan "No spend" dan cell berwarna bg-slate-100

GIVEN total spend harian > 500k
WHEN cell dirender
THEN cell berwarna bg-violet-800 (level 4, tertinggi)
```

---

##### Section 10: Product Lifecycle Score

**Deskripsi:** Composite score 0–100 per produk yang menggabungkan efisiensi biaya (cost per use) dan daya tahan (avg usage duration). Membantu user mengidentifikasi produk "hero" di inventory.

**Kalkulasi:**

- Hanya produk yang memiliki **keduanya**: `cost_per_use ≠ null` dan `avg_days ≠ null`
- `cost_score` = normalisasi min-max inverted: `(1 - (cost_per_use - min) / (max - min)) × 100` — lebih rendah cost = skor lebih tinggi
- `duration_score` = normalisasi min-max: `((avg_days - min) / (max - min)) × 100` — lebih lama = skor lebih tinggi
- Edge case: jika semua produk sama nilainya, score = 100
- `lifecycle_score` = `round(cost_score × 0.5 + duration_score × 0.5)`

**Tier Badge:**
| Score | Tier | Warna |
|-------|------|-------|
| ≥ 80 | S | Violet |
| 60–79 | A | Hijau |
| 40–59 | B | Kuning |
| < 40 | C | Slate |

**Tampilan:** Tabel dengan kolom: No, Product (brand + nama + type badge), Cost/Use, Avg Duration, Tier, Score (progress bar + angka)

**Behavior:**

- Default: top 5 sorted by `score DESC`
- View All: modal `max-w-2xl`
- Empty state: "Not enough data to score products 📊"

**Acceptance Criteria:**

```
GIVEN ada ≥ 2 produk dengan cost_per_use dan avg_days
WHEN section Product Lifecycle Score dimuat
THEN setiap produk mendapat score 0–100 berdasarkan normalisasi relatif dalam dataset

GIVEN produk memiliki score tertinggi dalam dataset
WHEN section dimuat
THEN produk tersebut mendapat score mendekati 100

GIVEN produk tidak memiliki cost_per_use atau avg_days
WHEN section dimuat
THEN produk tersebut tidak ditampilkan

GIVEN hanya ada 1 produk eligible
WHEN section dimuat
THEN produk tersebut mendapat score 100
```

---

##### Layout & UX

**Struktur Layout (urutan section):**

1. Summary Cards — 2 kolom mobile → 3 kolom tablet → 6 kolom desktop
2. Spend This Month vs Last Month — full width
3. Spending Heatmap — full width
4. Low Stock Alert + Most Restocked — 2-column grid (`md:grid-cols-2`), 1 kolom di mobile
5. Restock Prediction — full width
6. Monthly Budget Tracker — full width
7. Monthly Spend by Type — full width
8. Cost Per Use — full width
9. Avg Cost/Use Over Time — full width
10. Avg Usage Duration — full width
11. Product Lifecycle Score — full width

**Loading State:** Skeleton rows / pulse animation di semua section selama data dimuat

**Scrollable:** Layout menggunakan `overflow-y-auto` agar dashboard dapat di-scroll

**Acceptance Criteria:**

```
GIVEN saya membuka dashboard di perangkat mobile
WHEN halaman dirender
THEN summary cards tampil 2 kolom, Low Stock Alert dan Most Restocked tampil 1 kolom (full width)

GIVEN saya membuka dashboard di desktop
WHEN halaman dirender
THEN summary cards tampil 6 kolom, Low Stock Alert dan Most Restocked tampil 2-column grid

GIVEN API sedang memuat data
WHEN halaman dirender
THEN semua section menampilkan skeleton loading state
```

---

##### Validasi

- Dashboard hanya memuat data produk yang belum di-soft delete (`deleted_at IS NULL`)
- Summary counts dan analytics dihitung server-side untuk konsistensi data
- Kalkulasi `cost_per_use` hanya dilakukan jika `total_units > 0` (hindari division by zero)
- Kalkulasi `cost_per_use_history` hanya dilakukan jika `total_units > 0` (hindari division by zero)

---

##### Error States

| Kondisi                 | Tampilan                             |
| ----------------------- | ------------------------------------ |
| API gagal (5xx)         | Pesan error generik di level section |
| Data kosong per section | Empty state spesifik per section     |
| Loading                 | Skeleton animation                   |

---

##### API Endpoints

`GET /api/inventory/v1/dashboard`

- Auth: Required
- Deskripsi: Mengembalikan semua data yang dibutuhkan dashboard — summary cards + 11 section analitik
- Response: `{ data: { top5, all, lowStockAlerts, monthlySpendByType, avgUsageDuration, mostRestocked, spendComparison, costPerUseHistory, restockPrediction, spendingHeatmap, lifecycleScore } }`

`GET /api/inventory/v1/product/summary`

- Auth: Required
- Deskripsi: Mengembalikan summary counts (total, active, inactive, totalStock, inUse, favorites)
- Response: `{ data: { total, active, inactive, totalStock, inUse, favorites } }`

`GET /api/inventory/v1/budget`

- Auth: Required
- Deskripsi: Mengembalikan semua budget setting user per type
- Response: `{ data: [{ type, monthly_budget }] }`

`POST /api/inventory/v1/budget`

- Auth: Required
- Body: `{ type: string, monthly_budget: number }`
- Deskripsi: Upsert budget untuk satu type (insert atau update jika sudah ada)
- Response: `{ success: true }`

`GET /api/inventory/v1/product/restock-predictions` _(implemented — v1.11)_

- Auth: Required
- Deskripsi: Mengembalikan prediksi `days_until_empty` per produk aktif berdasarkan rata-rata interval pemakaian (avg_days × quantity). Produk tanpa usage history di-skip.
- Response: `{ data: [{ product_list_id, days_until_empty, ... }], message: "OK" }`
- Digunakan oleh: `ProductsPage` untuk menampilkan `~Xd left` hint di tabel

`GET /api/inventory/v1/product/[id]/last-price` _(implemented — v1.11)_

- Auth: Required
- Param: `id` — integer, product_list_id
- Deskripsi: Mengembalikan harga dan tanggal pembelian terakhir untuk produk tertentu
- Response: `{ success: true, data: { last_purchase_price, last_purchase_date } }`
- Error: 400 jika ID tidak valid; 404 jika produk tidak ditemukan
- Digunakan oleh: `AddStockForm` (hint di bawah field Price)

`GET /api/inventory/v1/product/stock/history/[id]`

- Auth: Required
- Param: `id` — product_list_id
- Deskripsi: Mengembalikan semua riwayat pembelian/restock untuk produk tertentu, diurutkan terbaru di atas
- Response: array of `{ id, purchase_date, quantity_added, price, note }`
- Digunakan oleh: `AddStockForm` (Recent Purchases section) dan `ProductDetailPage` (Purchase History table)

---

##### Database Tables yang Digunakan

| Tabel              | Kolom yang Relevan                                                                                                                     | Kegunaan                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `product_list`     | `id`, `user_id`, `product`, `brand`, `type`, `quantity`, `usage_quantity`, `product_status`, `is_favorite`, `usage_date`, `deleted_at` | Data produk utama                                                                                 |
| `product_quantity` | `product_list_id`, `price`, `purchase_date`                                                                                            | Riwayat pembelian/restock untuk kalkulasi total spent, monthly spend, heatmap, restock prediction |
| `product_history`  | `product_list_id`, `depleted_quantity`, `start_usage_date`                                                                             | Riwayat aktivasi pemakaian untuk kalkulasi avg duration dan lifecycle score                       |
| `inventory_budget` | `id`, `user_id`, `type`, `monthly_budget`, `created_at`, `updated_at`                                                                  | Budget bulanan per kategori produk (user-defined, RLS enabled, UNIQUE per user+type)              |

---

#### 3.1.1 Product List (`/main/inventory/product-list`)

**Deskripsi:** Halaman utama manajemen produk. Menampilkan semua produk dalam tabel dengan kemampuan search, filter, dan aksi per produk.

**Route:** `/main/inventory/product-list`
**Entry Point:** `app/main/inventory/product-list/page.jsx`

---

**User Stories:**

> As a user, I want to search products by brand or name, so that I can quickly find a specific product without scrolling through the entire list.

> As a user, I want to filter products by status or stock level, so that I can focus on products that need attention.

> As a user, I want to edit product details, so that I can correct mistakes or update product information.

> As a user, I want to see at a glance which products are out of stock or running low, so that I can prioritize restocking.

> As a user, I want to add stock with the last purchase price visible, so that I can make an informed decision about the price I enter.

> As a user, I want to record when I start using a product, so that I can track usage duration and consumption patterns.

---

**Fitur & Acceptance Criteria:**

**A. Tabel Produk**

Kolom yang ditampilkan:

| Kolom          | Data                | Alignment | Note                                                                                        |
| -------------- | ------------------- | --------- | ------------------------------------------------------------------------------------------- |
| Product        | brand + tipe + nama | Left      | Star icon favorit di kiri — space selalu direservasi (visibility:hidden jika tidak favorit) |
| Quantity       | `quantity`          | Right     | Font monospace                                                                              |
| In Use         | `usage_quantity`    | Right     | Font monospace — jumlah unit yang sedang dipakai                                            |
| Usage Date     | `usage_date`        | Center    | Format: DD MMM YYYY, "-" jika belum pernah dipakai                                          |
| Product Status | `product_status`    | Center    | Badge: active (hijau) / inactive (merah)                                                    |
| Actions        | —                   | Center    | Dropdown 3-titik                                                                            |

```
GIVEN produk ada di database
WHEN halaman dimuat
THEN semua produk ditampilkan dalam tabel, favorit di urutan atas
```

**B. Search Bar**

```
GIVEN user berada di halaman Product List
WHEN user mengetik di search bar
THEN tabel difilter berdasarkan brand ATAU nama produk (AND dengan filter aktif)
AND filter dilakukan setelah 300ms debounce
AND tombol clear (×) muncul saat ada teks

GIVEN search bar berisi teks
WHEN user klik tombol clear (×)
THEN search direset dan semua produk ditampilkan (filter tetap aktif)
```

**C. Filter Dropdown**

Filter options (by status/stock level — terpisah dari text search):

| Filter       | Kondisi                                           | Group     |
| ------------ | ------------------------------------------------- | --------- |
| All Products | semua produk                                      | General   |
| Active       | `product_status = 'active'`                       | Status    |
| Inactive     | `product_status = 'inactive'`                     | Status    |
| Favorite     | `is_favorite = true`                              | Status    |
| Low Stock    | `quantity < LOW_STOCK_THRESHOLD AND quantity > 0` | Inventory |
| Out of Stock | `quantity = 0`                                    | Inventory |
| Never Used   | `usage_date IS NULL`                              | Usage     |
| [Type name]  | `product.type === type` (dinamis)                 | Category  |

**Category filter (dinamis):** Dropdown menampilkan section "Category" berisi semua nilai `product.type` unik yang ada di daftar produk saat ini. Filter value menggunakan prefix `"type:"` — contoh: `"type:Skincare"`. Setiap item category menampilkan jumlah produk per type.

**Filter counts:** Setiap item dropdown menampilkan jumlah produk yang cocok. Status group menggunakan data dari `summary` API; Inventory dan Usage group dihitung client-side dari `products` array.

```
GIVEN filter aktif + search aktif
WHEN hasil kombinasi keduanya = 0 produk
THEN tampilkan empty state: icon 📦 + "No products match your filters"
AND tampilkan label filter aktif dan/atau teks pencarian
AND tombol "Clear filters & search" untuk reset keduanya sekaligus

GIVEN ada produk dengan type "Skincare" di daftar
WHEN user membuka filter dropdown
THEN section "Category" muncul dengan item "Skincare" dan jumlah produk

GIVEN user klik filter "Skincare" di section Category
WHEN filter diterapkan
THEN hanya produk dengan type = "Skincare" yang ditampilkan
AND filter value tersimpan sebagai "type:Skincare"
```

**Controls Bar (Search + Filter + Add Button) — Sticky Behavior**

Controls bar menggunakan `sticky top-0 z-10 bg-white` sehingga tetap terlihat saat user men-scroll daftar produk. Halaman di-scroll secara natural di dalam `main` (scroll container global) — tidak ada inner scroll container terpisah.

```
GIVEN halaman Product List memiliki banyak produk (daftar lebih panjang dari viewport)
WHEN user men-scroll ke bawah
THEN controls bar (search, filter dropdown, tombol "+ Add Product") tetap terlihat di bagian atas halaman
AND tabel produk scroll di bawahnya
```

**D. Tambah Produk**

```
GIVEN user klik "+ Add Product"
WHEN form dibuka (Dialog)
THEN field: Brand (Select wajib), Tipe (Select wajib), Nama Produk (Input wajib), Quantity Awal (Number, default 0)

GIVEN semua field valid
WHEN user submit
THEN produk baru tersimpan dan muncul di tabel
AND toast sukses ditampilkan
```

**E. Edit Produk**

```
GIVEN user klik "Edit Product" di action dropdown
WHEN Dialog terbuka
THEN field pre-filled: Brand (Select), Product Name (Select), Type (Input), Status (Select active/inactive)
AND setiap field memiliki guide message di bawahnya

GIVEN perubahan valid
WHEN user klik "Save Changes"
THEN produk terupdate di tabel
AND toast sukses ditampilkan
AND Dialog tertutup
```

UI: Gunakan `<Dialog>` — konsisten dengan seluruh action lain (Add Stock, Record Usage, Delete, Add Product).

**F. Tambah Stok**

```
GIVEN user klik "Add Stock" di action dropdown
WHEN Dialog terbuka
THEN tampilkan: Quantity to Add, Price (Rp), Purchase Date, Note (opsional)
AND di bawah field Price ditampilkan hint last purchase price (lihat F.1)
AND di atas form fields ditampilkan section Recent Purchases (lihat F.2)

GIVEN quantity_added ≥ 1 dan price ≥ 0
WHEN user submit
THEN stok bertambah dan riwayat tersimpan
```

**F.1 Last Purchase Price Hint (implemented — v1.11)**

Saat Add Stock dialog dibuka, sistem melakukan `GET /api/inventory/v1/product/[id]/last-price` dan menampilkan hasilnya di bawah field Price.

| Kondisi        | Tampilan                                     |
| -------------- | -------------------------------------------- |
| Loading        | "Loading last price..."                      |
| Ada data       | "Last purchase price: Rp X.XXX — d MMM yyyy" |
| Tidak ada data | "No previous purchase data available"        |

```
GIVEN user membuka Add Stock dialog untuk produk yang pernah dibeli
WHEN API last-price merespons
THEN hint "Last purchase price: Rp X — d MMM yyyy" ditampilkan di bawah field Price

GIVEN user membuka Add Stock dialog untuk produk yang belum pernah dibeli
WHEN API last-price merespons dengan data kosong
THEN teks "No previous purchase data available" ditampilkan
```

**F.2 Recent Purchases Section (implemented — v1.11)**

Saat Add Stock dialog dibuka, sistem melakukan `GET /api/inventory/v1/product/stock/history/[id]` dan menampilkan 3 pembelian terakhir di atas form fields (sebelum Quantity to Add).

Tampilan setiap baris: tanggal (font mono), qty, harga (Rp, format id-ID, font mono).
Section hanya ditampilkan jika ada data pembelian (tidak ditampilkan jika history kosong).

```
GIVEN user membuka Add Stock dialog dan ada riwayat pembelian sebelumnya
WHEN API stock-history merespons
THEN section "Recent Purchases" ditampilkan di atas form dengan maksimal 3 entri terbaru

GIVEN user membuka Add Stock dialog dan belum ada riwayat pembelian
WHEN API stock-history merespons dengan data kosong
THEN section "Recent Purchases" tidak ditampilkan
```

**API untuk Add Stock:**

- `GET /api/inventory/v1/product/[id]/last-price` — Response: `{ success: true, data: { last_purchase_price, last_purchase_date } }`
- `GET /api/inventory/v1/product/stock/history/[id]` — Response: array of `{ purchase_date, quantity_added, price }`

**G. Record Usage** _(sebelumnya disebut "Update Usage" — nama diubah untuk kejelasan)_

```
GIVEN user klik "Record Usage" di action dropdown
WHEN dialog terbuka
THEN user dapat mencatat kapan mulai memakai produk dan quantity yang dipakai

GIVEN usage dicatat
WHEN berhasil tersimpan
THEN kolom "Usage Date" dan "In Use" di tabel terupdate
```

**G.1 Note Display di Usage Log (implemented — v1.11)**

Di halaman detail produk (Usage History), saat user meng-expand sebuah log row, jika `item.note` ada maka ditampilkan di atas `UsageCompletionForm` dalam card bertampilan: label "Note" (text-xs, text-slate-500) dan isi note (text-sm, text-slate-700).

```
GIVEN usage log item memiliki field note yang terisi
WHEN user meng-expand row tersebut
THEN card "Note" ditampilkan di atas form completion berisi isi note

GIVEN usage log item tidak memiliki note
WHEN user meng-expand row tersebut
THEN card "Note" tidak ditampilkan (kondisional rendering)
```

**H. Favorit**

```
GIVEN user klik "Add to Favorites" di action dropdown
WHEN berhasil
THEN produk pindah ke urutan teratas tabel
AND icon bintang muncul di kolom Product
AND menu berubah menjadi "Remove from Favorites"
```

**I. Hapus Produk**

```
GIVEN user klik "Delete Product" di action dropdown
WHEN dialog konfirmasi muncul
THEN user harus konfirmasi sebelum dihapus (destructive action)

GIVEN user konfirmasi
WHEN berhasil dihapus
THEN produk hilang dari tabel dan toast sukses ditampilkan
```

---

**Validasi:**

- Brand wajib dipilih
- Tipe produk wajib dipilih
- Nama produk wajib diisi
- Quantity tidak boleh negatif
- Quantity to Add minimal 1
- Price minimal 0
- Pengurangan stok tidak boleh melebihi stok tersedia

---

**Stock Status & Error States:**

| Kondisi                                           | Tampilan                                       |
| ------------------------------------------------- | ---------------------------------------------- |
| `quantity = 0`                                    | Badge merah "Out of Stock" di kolom Quantity   |
| `quantity < LOW_STOCK_THRESHOLD AND quantity > 0` | Badge kuning "Low Stock" di kolom Quantity     |
| `quantity ≥ LOW_STOCK_THRESHOLD`                  | Angka normal (font monospace)                  |
| `product_status = 'inactive'`                     | Badge merah "inactive" di kolom Product Status |

**`LOW_STOCK_THRESHOLD` constant (implemented — v1.11):** Nilai default = `5`. Konstanta ini didefinisikan di 3 file:

- `ProductFilterDropdown.jsx` — untuk menghitung jumlah produk low stock di dropdown
- `ProductsTable.jsx` — untuk `QuantityBadge` dan restock hint display
- `ProductsPage.jsx` — untuk logika filter "low-stock"

Untuk mengubah threshold, update nilai di ketiga file tersebut. Tidak ada magic number `5` tersebar di luar konstanta ini.

---

**Empty States:**

| Kondisi                      | Tampilan                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| Belum ada produk sama sekali | Teks "No products yet. Start by adding a new product 🚀"                                                |
| Search/filter aktif, hasil 0 | Icon 📦 + "No products match your filters" + info filter/search aktif + tombol "Clear filters & search" |

---

**J. Column Sorting (implemented — v1.11)**

Header kolom di desktop table dapat diklik untuk sort ascending/descending. Sorting dilakukan client-side pada array `products` yang sudah difilter.

| Kolom      | Sort Key                                | Tipe Sort                   |
| ---------- | --------------------------------------- | --------------------------- |
| Product    | `brand + product` (gabungan, lowercase) | String                      |
| Quantity   | `quantity`                              | Numerik                     |
| In Use     | `usage_quantity`                        | Numerik                     |
| Usage Date | `usage_date` (timestamp)                | Date — null selalu di bawah |

Kolom "Product Status" dan "Actions" tidak sortable.

UI: Header sortable menampilkan icon `ArrowUpDown` (inactive) → `ArrowUp` (asc) → `ArrowDown` (desc). Klik kedua kali pada kolom yang sama membalik arah sort.

```
GIVEN user klik header kolom "Quantity"
WHEN sort diterapkan
THEN produk diurutkan ascending by quantity
AND icon header berubah ke ArrowUp

GIVEN user klik header "Quantity" sekali lagi
WHEN sort dibalik
THEN produk diurutkan descending by quantity
AND icon header berubah ke ArrowDown

GIVEN produk memiliki usage_date = null
WHEN sort by usage_date (ascending atau descending)
THEN produk tanpa usage_date selalu muncul paling bawah
```

**K. Restock Prediction Hint di Tabel (implemented — v1.11)**

Di bawah `QuantityBadge` pada kolom Quantity (desktop) dan di stats row (mobile), ditampilkan prediksi waktu habis per produk aktif jika data tersedia.

Format: `~Xd left` (font mono)

| Kondisi                             | Tampilan                             |
| ----------------------------------- | ------------------------------------ |
| `days_until_empty ≤ 7`              | Text orange (`text-orange-500`)      |
| `days_until_empty > 7`              | Text muted (`text-muted-foreground`) |
| `quantity = 0`                      | Tidak ditampilkan                    |
| Tidak ada prediksi untuk produk ini | Tidak ditampilkan                    |

Data diambil via `GET /api/inventory/v1/product/restock-predictions` saat halaman pertama dimuat, disimpan sebagai map `{ [product_list_id]: { days_until_empty } }` di state `ProductsPage`.

```
GIVEN produk aktif memiliki data prediksi restock
WHEN halaman Product List dimuat
THEN "~Xd left" ditampilkan di bawah QuantityBadge di kolom Quantity

GIVEN days_until_empty produk = 5 (≤ 7)
WHEN tabel dirender
THEN teks "~5d left" ditampilkan dalam warna orange

GIVEN produk memiliki quantity = 0
WHEN tabel dirender
THEN prediksi hint tidak ditampilkan untuk produk tersebut
```

**L. Summary Cards — Clickable untuk Filter (implemented — v1.11)**

Cards di `ProductListSummary` yang memiliki `filterValue` dapat diklik untuk langsung menerapkan filter pada tabel. Cards tanpa filterValue (Total Stock, In Use) tidak clickable.

| Card           | Filter Value | Clickable |
| -------------- | ------------ | --------- |
| Total Products | `null` (all) | Ya        |
| Active         | `"active"`   | Ya        |
| Inactive       | `"inactive"` | Ya        |
| Total Stock    | —            | Tidak     |
| In Use         | —            | Tidak     |
| Favorites      | `"favorite"` | Ya        |

UI: Card clickable mendapatkan `cursor-pointer` dan `hover:shadow-md transition-shadow`. Pada mobile (collapsible view) perilaku yang sama diterapkan.

```
GIVEN user klik card "Active" di ProductListSummary
WHEN filter diterapkan
THEN tabel difilter untuk menampilkan hanya produk dengan status active
AND toast "Showing active products" muncul

GIVEN user klik card "Favorites"
WHEN filter diterapkan
THEN tabel difilter untuk menampilkan hanya produk favorit

GIVEN user klik card "Total Stock"
WHEN tidak ada filterValue
THEN tidak ada aksi (card tidak clickable)
```

**Action Dropdown per Produk (urutan):**

1. Edit Product _(baru)_
2. Add Stock
3. Record Usage _(sebelumnya: Update Usage)_
4. — separator —
5. Add to Favorites / Remove from Favorites
6. — separator —
7. Delete Product _(hanya muncul jika belum dihapus)_

---

#### 3.1.2 Product Brand (`/main/inventory/product-brand`)

**Description:** This is the master data page for product brands. Brands are used as a foreign key in `product_list`, so every brand needs to have a unique name per user. You also can't delete a brand while it's still being used by active products — that would break your product data.

**Route:** `/main/inventory/product-brand`

**What it does:**

- Show all brands along with how many active products are using each one (`product_count`)
- Add a new brand (with a uniqueness check)
- Edit a brand name (also checks uniqueness, but skips the brand itself when checking)
- Delete a brand — only allowed if no active products are using it

---

**User Stories:**

> As a user, I want to see all my product brands in one place, so that I can manage and maintain my brand master data.

> As a user, I want to know how many active products use each brand, so that I can make informed decisions before editing or deleting a brand.

> As a user, I want to be prevented from creating a duplicate brand name, so that my brand list stays clean and unambiguous.

> As a user, I want to be prevented from deleting a brand that is still in use by active products, so that I don't accidentally break product data integrity.

> As a user, I want to see a clear warning when a brand cannot be deleted, so that I understand why the delete action is disabled before I try.

---

**Acceptance Criteria:**

**A. Show Brand List**

Each brand shows its name and how many active products are using it (`product_count`). The count comes from joining `product_brand` with `product_list`, counting only products where `deleted_at IS NULL`.

```
GIVEN the user opens /main/inventory/product-brand
WHEN data loads successfully
THEN all brands are shown, each with their product_count

GIVEN data is still loading
WHEN the API hasn't responded yet
THEN show a loading state (skeleton or spinner)

GIVEN no brands have been saved yet
WHEN the page loads
THEN show an appropriate empty state
```

**B. Add a New Brand**

```
GIVEN the user opens the add brand form and types a brand name
WHEN that name already exists (case-insensitive) and isn't soft-deleted
THEN the API returns HTTP 409 and the form shows "Brand name already exists"

GIVEN the user types a brand name that doesn't exist yet
WHEN the user submits the form
THEN the new brand is saved and appears in the list with product_count = 0
AND a success toast is shown

GIVEN the user submits the form with an empty brand name
WHEN frontend validation runs
THEN the form doesn't submit and shows "Brand name is required"
```

**C. Edit a Brand Name**

```
GIVEN the user opens the edit modal and changes the name to one already used by another brand
WHEN the user submits the form
THEN the API returns HTTP 409 and the form shows "Brand name already exists"

GIVEN the user opens the edit modal and saves without changing the name
WHEN the user submits the form
THEN there's no conflict — the update goes through (the API excludes the brand itself from the uniqueness check)

GIVEN the user changes the brand name to something genuinely new
WHEN the user submits the form
THEN the brand is updated in the list and a success toast is shown
```

**D. Delete Brand — Guard: Brand Still in Use**

This is a P0 validation. The delete button is disabled upfront — not after a failed attempt.

```
GIVEN the user opens the edit modal for a brand with product_count > 0
WHEN the modal opens
THEN a warning box appears below the Note field with the message:
     "Brand is still used by X product(s) and cannot be deleted."
AND the delete button is disabled (opacity-40, cursor-not-allowed)

GIVEN the user opens the edit modal for a brand with product_count = 0
WHEN the modal opens
THEN no warning box is shown
AND the delete button is active and clickable

GIVEN a brand has product_count > 0 and the delete API is called directly (bypassing the UI)
WHEN the deleteProductBrand service runs
THEN it throws an error with status 409 and message "Brand is still used by X product(s) and cannot be deleted"
AND the API route returns HTTP 409

GIVEN the user confirms deletion of a brand with product_count = 0
WHEN it succeeds
THEN the brand disappears from the list and a success toast is shown
```

---

**Validations:**

| Rule                                                                                 | Scope           | How it's enforced                                                                    |
| ------------------------------------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------ |
| Brand name is required                                                               | Create + Update | Frontend form validation                                                             |
| Brand name must be unique (case-insensitive, excluding soft-deleted)                 | Create          | Backend service — HTTP 409 if duplicate                                              |
| Brand name must be unique (case-insensitive, excluding self, excluding soft-deleted) | Update          | Backend service — HTTP 409 if it conflicts with another brand                        |
| Can't delete a brand that's still used by active products                            | Delete          | Backend service — HTTP 409; Frontend — delete button disabled if `product_count > 0` |

---

**Error States:**

| Situation                                            | Layer                 | What the user sees                                    |
| ---------------------------------------------------- | --------------------- | ----------------------------------------------------- |
| Brand name already taken (create)                    | Backend → Frontend    | Form error: "Brand name already exists"               |
| Brand name conflicts with another brand (update)     | Backend → Frontend    | Form error: "Brand name already exists"               |
| Brand is still used by products (delete via UI)      | Frontend (preventive) | Red warning box in modal + delete button disabled     |
| Brand is still used by products (delete bypasses UI) | Backend → Frontend    | HTTP 409 + `toast.error(err.message)` as a safety net |
| API fails (5xx)                                      | Backend → Frontend    | Generic error toast                                   |

**Warning Box — Visual Spec (Edit modal):**

- Position: below the Note field
- Style: red border, light red background
- Icon: `AlertCircle` in the top-left, red color
- Text: `"Brand is still used by X product(s) and cannot be deleted."` (X = `product_count`)
- Render condition: `isInUse && !isDeleted` where `isInUse = product_count > 0`

---

**API Endpoints:**

`GET /api/inventory/v1/product-brand`

- Auth: Required
- What it does: Returns all brands for the user, each with a `product_count` (number of active products using that brand)
- Implementation: `Promise.all` — fetch `product_brand` + `product_list` (active only) in parallel, then merge the results
- Response: `{ data: [{ id, brand, brand_status, product_count, ... }] }`

`POST /api/inventory/v1/product-brand`

- Auth: Required
- Body: `{ brand: string }`
- Validation: uniqueness check — query `product_brand` where `brand ilike newName AND user_id = userId AND brand_status != 'deleted'`
- Success response: `{ data: {...}, message: "Brand created" }` (201)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Brand name already exists" }` if duplicate

`PUT /api/inventory/v1/product-brand/[id]`

- Auth: Required
- Param: `id` — integer, brand ID
- Body: `{ brand: string }`
- Validation: same uniqueness check as create, but adds `.neq("id", id)` to exclude the current brand from the check
- Success response: `{ data: {...}, message: "Brand updated" }` (200)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Brand name already exists" }` if conflict

`DELETE /api/inventory/v1/product-brand/[id]`

- Auth: Required
- Param: `id` — integer, brand ID
- Guard: query `product_list` where `brand_id = id AND user_id = userId AND deleted_at IS NULL` — if any records exist, throw 409
- Implementation: soft-delete (set `brand_status = 'deleted'` or equivalent)
- Success response: `{ message: "Brand deleted" }` (200)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Brand is still used by X product(s) and cannot be deleted" }` if still in use

---

**Database Tables:**

| Table           | Relevant columns                          | What it's used for                                  |
| --------------- | ----------------------------------------- | --------------------------------------------------- |
| `product_brand` | `id`, `user_id`, `brand`, `brand_status`  | Brand master data                                   |
| `product_list`  | `id`, `brand_id`, `user_id`, `deleted_at` | Used to calculate `product_count` and guard deletes |

---

**New Features — implemented v1.13**

---

**E. Search Bar**

There's a text input on the left side of the controls bar. Placeholder: "Search brands...". Filtering is purely client-side — it filters the already-fetched brand list by checking if the `brand` name contains the search query (case-insensitive substring match). All three client-side filters (search, status filter, sort) are applied together in one pass, so they all work in combination without any conflicts.

The input has a clear (X) button that appears when the query is non-empty. Clicking it resets the search to empty.

**User Story:**

> As a user, I want to search for a brand by name, so that I can quickly find the one I'm looking for without scrolling through the whole list.

```
GIVEN the user types in the search box
WHEN a query is present
THEN the table shows only brands whose name contains that query (case-insensitive)
AND the status filter and sort still apply on top of the search results

GIVEN the query is non-empty
WHEN the clear (X) button is clicked
THEN the search resets and all brands matching the current filter/sort are shown again
```

---

**F. Product Count Badge on Table**

A new "Products" column sits between the Status and Notes columns in the table. Each row shows a badge displaying the brand's `product_count`.

- Badge is **blue** when `product_count > 0`
- Badge is **gray** when `product_count === 0`
- When `product_count > 0`, the badge is **clickable** — clicking it navigates to `/main/inventory/product-list?brand=<brandName>`, which pre-populates the product list search with that brand name so the user lands directly on filtered results

**User Story:**

> As a user, I want to see how many products use each brand at a glance, so that I can click through to that brand's products without manually searching.

```
GIVEN the brand list is loaded
WHEN product_count > 0
THEN the badge is blue and clickable

GIVEN the user clicks a blue product count badge
WHEN the click is handled
THEN the user is navigated to /main/inventory/product-list?brand=<brandName>

GIVEN product_count === 0
WHEN the badge renders
THEN it is gray and not clickable (no navigation)
```

---

**G. Filter & Sort Dropdown (merged)**

The old separate Filter and Sort controls are now merged into a single "Filter & Sort" dropdown button. The button uses a `SlidersHorizontal` icon. Inside the dropdown there are two distinct sections:

- **Filter section** — same status filter as before (Active / Inactive / Deleted / All)
- **Sort section** — four options: A → Z (default), Z → A, Most products first, Fewest products first

Each section has its own Clear/Reset button inside the dropdown so the user can reset filter and sort independently.

The button shows a small violet badge dot in the top-right corner counting how many active filters or non-default sort options are currently applied. So if the user has a status filter active and a non-default sort, the dot shows "2".

**User Stories:**

> As a user, I want to filter and sort brands in one place, so that the controls bar stays clean and easy to use.

> As a user, I want to sort brands by name or product count, so that I can find what I need faster.

> As a user, I want to know at a glance whether any filters or non-default sorts are active, so that I'm not confused about why I'm seeing fewer results.

```
GIVEN the Filter & Sort dropdown is opened
WHEN the user selects a sort option
THEN the brand list re-sorts accordingly (client-side)
AND the dropdown badge counter increments if the selected sort is non-default

GIVEN the user has an active filter or non-default sort
WHEN they click the section-level Clear/Reset button inside the dropdown
THEN only that section (filter or sort) resets — the other section is unchanged

GIVEN no filters are active and sort is at default (A → Z)
WHEN the dropdown button renders
THEN no badge dot is shown
```

---

**H. Bulk Status Change**

Each table row has a checkbox in the leftmost column. The table header has a select-all checkbox that toggles all visible rows at once.

When 1 or more rows are checked, a bulk action bar appears above the table showing:

- "X selected" label
- "Set Active" button
- "Set Inactive" button
- "Deselect All" button

Clicking Set Active or Set Inactive loops through all selected brands and calls the PUT update API for each one with the appropriate `brand_status`. When all calls finish, a toast summary appears: "X brands updated". After that, the selection clears and the list refreshes.

**User Stories:**

> As a user, I want to change the status of multiple brands at once, so that I don't have to open each edit modal individually.

> As a user, I want to see a summary of how many brands were updated, so that I know the bulk action finished successfully.

```
GIVEN the user checks one or more rows
WHEN at least 1 row is selected
THEN the bulk action bar appears above the table with Set Active, Set Inactive, and Deselect All buttons

GIVEN the user clicks Set Active or Set Inactive
WHEN all update API calls complete
THEN a success toast shows "X brands updated"
AND the selection is cleared
AND the list refreshes

GIVEN the user clicks Deselect All
WHEN the click is handled
THEN all checkboxes are unchecked and the bulk action bar disappears

GIVEN the user checks the header checkbox
WHEN it is checked
THEN all visible rows are selected
WHEN it is unchecked
THEN all rows are deselected
```

---

**I. Edit Button on Table Row**

Each row has a pencil icon button at the rightmost end. Clicking it opens the edit modal — same modal that row-click already opens. The row-click behavior is preserved alongside the explicit button, so both ways work.

**User Story:**

> As a user, I want a visible edit button on each row, so that I can open the edit modal without having to know to click the row itself.

```
GIVEN the brand list is showing
WHEN the user clicks the pencil icon on a row
THEN the edit modal opens for that brand (same behavior as clicking the row)
```

---

**J. Restore Deleted Brand**

When the user opens the edit modal for a brand whose `brand_status` is `"deleted"`, the modal footer shows a green **"Restore Brand"** button instead of the Delete button.

Clicking Restore calls the PUT update API with `brand_status: 'active'`, shows a success toast, and refreshes the list. The brand is then back in the active list.

**User Stories:**

> As a user, I want to restore a brand I previously deleted, so that I can bring it back without having to recreate it from scratch.

```
GIVEN the user opens the edit modal for a deleted brand
WHEN the modal opens
THEN a green "Restore Brand" button is shown in the footer (no Delete button)

GIVEN the user clicks Restore Brand
WHEN the API call succeeds
THEN a success toast is shown
AND the list refreshes with the brand now showing as active
```

---

**K. Empty State**

When there are no brands to show (either the list is genuinely empty or all results are filtered out), the page shows:

- `PackageOpen` icon
- "No brands yet" title
- A short subtitle with context
- An "Add Brand" CTA button (not just plain text)

This replaces the old plain-text empty state.

**User Story:**

> As a user, I want a helpful empty state when there are no brands, so that I know what to do next instead of staring at a blank table.

```
GIVEN the brand list is empty (or all filtered out)
WHEN the table would render with zero rows
THEN the PackageOpen icon, "No brands yet" heading, subtitle, and Add Brand button are shown instead of the table
```

---

**L. Loading Skeleton**

While the brand list data is loading (API hasn't responded yet), the page shows a skeleton table instead of a spinner or blank space. The skeleton includes:

- A header row matching the real table columns
- 5 body rows with placeholder blocks matching the real column widths
- Built using the shadcn `Skeleton` component

This replaces any generic spinner or blank state during load.

**User Story:**

> As a user, I want to see a table-shaped skeleton while data loads, so that the page feels fast and stable rather than jumping from blank to populated.

```
GIVEN the API call is in progress
WHEN the component renders
THEN a skeleton table (1 header + 5 body rows) is shown with column widths matching the real table

GIVEN the API responds
WHEN data is ready
THEN the skeleton is replaced by the real brand list
```

---

**M. Layout Alignment to Product List**

The controls bar and page card structure of the Brand page is now aligned with the Product List page for visual consistency:

- Controls bar structure: search input (left, full-width on mobile, `max-w-xs` on desktop) + Filter & Sort button + Add Brand button (right, `shrink-0`)
- Controls bar is `sticky top-0` using CSS sticky — no IntersectionObserver
- Same card structure as Product List: Title section → Controls bar → Table area

No new user stories for this — it's a layout consistency improvement that makes the two pages feel like they belong to the same product.

---

#### 3.1.3 Product Name (`/main/inventory/product-name`)

**Description:** This is the master data page for product names (types). Product names are used as a foreign key in `product_list`, so every name needs to be unique per user. You also can't delete a product name while it's still being used by active products — that would break your product data.

**Route:** `/main/inventory/product-name`

**What it does:**

- Show all product names along with how many active products are using each one (`product_count`)
- Add a new product name (with a uniqueness check)
- Edit a product name (also checks uniqueness, but skips itself when checking)
- Delete a product name — only allowed if no active products are using it

---

**User Stories:**

> As a user, I want to see all my product names in one place, so that I can manage and maintain my product name master data.

> As a user, I want to know how many active products use each product name, so that I can make informed decisions before editing or deleting a name.

> As a user, I want to be prevented from creating a duplicate product name, so that my name list stays clean and unambiguous.

> As a user, I want to be prevented from deleting a product name that is still in use by active products, so that I don't accidentally break product data integrity.

> As a user, I want to see a clear warning when a product name cannot be deleted, so that I understand why the delete action is disabled before I try.

---

**Acceptance Criteria:**

**A. Show Product Name List**

Each product name shows its name and how many active products are using it (`product_count`). The count comes from joining `product_name` with `product_list`, counting only products where `deleted_at IS NULL`.

```
GIVEN the user opens /main/inventory/product-name
WHEN data loads successfully
THEN all product names are shown, each with their product_count

GIVEN data is still loading
WHEN the API hasn't responded yet
THEN show a loading state (skeleton or spinner)

GIVEN no product names have been saved yet
WHEN the page loads
THEN show an appropriate empty state
```

**B. Add a New Product Name**

```
GIVEN the user opens the add product name form and types a name
WHEN that name already exists (case-insensitive) and isn't soft-deleted
THEN the API returns HTTP 409 and the form shows "Product name already exists"

GIVEN the user types a name that doesn't exist yet
WHEN the user submits the form
THEN the new product name is saved and appears in the list with product_count = 0
AND a success toast is shown

GIVEN the user submits the form with an empty name
WHEN frontend validation runs
THEN the form doesn't submit and shows "Product name is required"
```

**C. Edit a Product Name**

```
GIVEN the user opens the edit modal and changes the name to one already used by another product name
WHEN the user submits the form
THEN the API returns HTTP 409 and the form shows "Product name already exists"

GIVEN the user opens the edit modal and saves without changing the name
WHEN the user submits the form
THEN there's no conflict — the update goes through (the API excludes the product name itself from the uniqueness check)

GIVEN the user changes the name to something genuinely new
WHEN the user submits the form
THEN the product name is updated in the list and a success toast is shown
```

**D. Delete Product Name — Guard: Name Still in Use**

This is a P0 validation. The delete button is disabled upfront — not after a failed attempt.

```
GIVEN the user opens the edit modal for a product name with product_count > 0
WHEN the modal opens
THEN a warning box appears below the Note field with the message:
     "Product name is still used by X product(s) and cannot be deleted."
AND the delete button is disabled (opacity-40, cursor-not-allowed)

GIVEN the user opens the edit modal for a product name with product_count = 0
WHEN the modal opens
THEN no warning box is shown
AND the delete button is active and clickable

GIVEN a product name has product_count > 0 and the delete API is called directly (bypassing the UI)
WHEN the deleteProductName service runs
THEN it throws an error with status 409 and message "Product name is still used by X product(s) and cannot be deleted"
AND the API route returns HTTP 409

GIVEN the user confirms deletion of a product name with product_count = 0
WHEN it succeeds
THEN the product name disappears from the list and a success toast is shown
```

---

**Validations:**

| Rule                                                                                   | Scope           | How it's enforced                                                                    |
| -------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------ |
| Product name is required                                                               | Create + Update | Frontend form validation                                                             |
| Product name must be unique (case-insensitive, excluding soft-deleted)                 | Create          | Backend service — HTTP 409 if duplicate                                              |
| Product name must be unique (case-insensitive, excluding self, excluding soft-deleted) | Update          | Backend service — HTTP 409 if it conflicts with another name                         |
| Can't delete a product name that's still used by active products                       | Delete          | Backend service — HTTP 409; Frontend — delete button disabled if `product_count > 0` |

---

**Error States:**

| Situation                                                   | Layer                 | What the user sees                                    |
| ----------------------------------------------------------- | --------------------- | ----------------------------------------------------- |
| Product name already taken (create)                         | Backend → Frontend    | Form error: "Product name already exists"             |
| Product name conflicts with another name (update)           | Backend → Frontend    | Form error: "Product name already exists"             |
| Product name is still used by products (delete via UI)      | Frontend (preventive) | Red warning box in modal + delete button disabled     |
| Product name is still used by products (delete bypasses UI) | Backend → Frontend    | HTTP 409 + `toast.error(err.message)` as a safety net |
| API fails (5xx)                                             | Backend → Frontend    | Generic error toast                                   |

**Warning Box — Visual Spec (Edit modal):**

- Position: below the Note field
- Style: red border, light red background
- Icon: `AlertCircle` in the top-left, red color
- Text: `"Product name is still used by X product(s) and cannot be deleted."` (X = `product_count`)
- Render condition: `isInUse && !isDeleted` where `isInUse = product_count > 0`

---

**API Endpoints:**

`GET /api/inventory/v1/product-name/list`

- Auth: Required
- What it does: Returns all product names for the user, each with a `product_count` (number of active products using that name)
- Implementation: `Promise.all` — fetch `product_name` + `product_list` (active only, `deleted_at IS NULL`) in parallel, then merge the results
- Response: `{ data: [{ id, product_name, product_name_status, product_count, note, ... }] }`

`POST /api/inventory/v1/product-name/create`

- Auth: Required
- Body: `{ product_name: string }`
- Validation: uniqueness check — query `product_name` where `product_name ilike newName AND user_id = userId AND product_name_status != 'deleted'`
- Success response: `{ success: true, productName: {...} }` (201)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Product name already exists" }` if duplicate

`PUT /api/inventory/v1/product-name/update/[id]`

- Auth: Required
- Param: `id` — integer, product name ID
- Body: `{ product_name: string, product_name_status: string }`
- Validation: same uniqueness check as create, but adds `.neq("id", id)` to exclude the current record from the check
- Success response: `{ success: true, productName: {...} }` (200)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Product name already exists" }` if conflict

`DELETE /api/inventory/v1/product-name/delete/[id]`

- Auth: Required
- Param: `id` — integer, product name ID
- Guard: query `product_list` where `product_name_id = id AND user_id = userId AND deleted_at IS NULL` — if any records exist, throw 409
- Implementation: soft-delete (set `product_name_status = 'deleted'`, set `deleted_at`)
- Success response: `{ success: true, data: {...} }` (200)
- Error response: HTTP 409 `{ error: "CONFLICT", message: "Product name is still used by X product(s) and cannot be deleted" }` if still in use

`GET /api/inventory/v1/product-name/summary`

- Auth: Required
- What it does: Returns aggregate stats — total count of product names, count per status
- Response: `{ success: true, data: { totalProductNames: number, totalStatus: { active: number, inactive: number, deleted: number } } }`

`GET /api/inventory/v1/product-name/[id]`

- Auth: Required
- Param: `id` — integer, product name ID
- What it does: Returns a single product name record
- Response: `{ success: true, data: {...} }`

---

**Database Tables:**

| Table          | Relevant columns                                                             | What it's used for                                  |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| `product_name` | `id`, `user_id`, `product_name`, `product_name_status`, `note`, `deleted_at` | Product name master data                            |
| `product_list` | `id`, `product_name_id`, `user_id`, `deleted_at`                             | Used to calculate `product_count` and guard deletes |

---

**Implemented Features (P1 — delivered v1.16):**

---

**E. Search Bar**

Client-side substring filter on product name. Works in combination with the sort dropdown.

> As a user, I want to type into a search box and instantly see only the product names that match, so that I can find a specific name without scrolling.

```
GIVEN the user is on /main/inventory/product-name
WHEN the user types into the search box
THEN the table filters in real time to show only rows where the product name contains the typed text (case-insensitive)

GIVEN the search box has text in it
WHEN the user clicks the clear (X) button
THEN the search input clears and all product names are shown again
```

- Component files: `ProductNamesPageClient.jsx`, `ProductNamesTable.jsx`
- Key IDs: `searchInput_productNamePage`, `clearSearchBtn_productNamePage`

---

**F. Sort Controls**

Sort dropdown with 4 options (A→Z default, Z→A, most products, fewest products). Works in combination with search.

> As a user, I want to sort product names by name or by how many products use them, so that I can quickly spot the most-used or alphabetically adjacent names.

```
GIVEN the user opens the sort dropdown
WHEN the user selects a sort option
THEN the table reorders immediately — A→Z (default), Z→A, most products first, fewest products first

GIVEN a non-default sort is active
WHEN the user clicks the reset button inside the dropdown
THEN the sort returns to A→Z (default)
```

- Component files: `ProductNameFilterDropdown.jsx`, `ProductNamesTable.jsx`
- Key IDs: `filterSortBtn_productNamePage`, `sortOption_*_productNamePage` (e.g. `sortOption_az_productNamePage`), `resetSortBtn_productNamePage`

---

**G. Edit Button Per Row**

Each table row has an explicit pencil icon button to open the edit modal, in addition to the existing row-click behavior.

> As a user, I want a clear edit button on each product name row, so that I don't have to guess that clicking the row opens the edit modal.

```
GIVEN the user is viewing the product names table
WHEN the user clicks the pencil icon on a row
THEN the edit modal opens for that product name
```

- Component file: `ProductNamesTable.jsx`
- ID pattern: `editProductNameBtn_{id}_productNamePage` (e.g. `editProductNameBtn_42_productNamePage`)

---

**H. Restore Deleted Product Name**

When the edit modal is opened for a soft-deleted product name, a green Restore button appears instead of Delete.

> As a user, I want to restore a soft-deleted product name, so that I can bring it back without having to recreate it.

```
GIVEN the user opens the edit modal for a product name with status = 'deleted'
WHEN the modal opens
THEN a green "Restore" button is shown instead of the Delete button

GIVEN the user clicks the Restore button
WHEN the PUT request succeeds
THEN the product name status is set back to 'active'
AND a success toast shows: "Product name restored successfully!"
AND the modal closes
```

- Component file: `UpdateProductName.jsx`
- Key ID: `restoreProductNameBtn_productNamePage`
- Success toast: `"Product name restored successfully!"`

---

**I. Loading Skeleton**

While the product name list is fetching, a shadcn Skeleton table is shown instead of a blank page.

> As a user, I want to see a skeleton placeholder while data loads, so that the page feels responsive and I know something is happening.

```
GIVEN the user navigates to /main/inventory/product-name
WHEN the API call is in flight
THEN a skeleton table is rendered with 6 columns and 5 rows

GIVEN the API call completes
WHEN data arrives
THEN the skeleton is replaced by the real product names table
```

- Component file: `ProductNamesPageClient.jsx`
- Key ID: `loadingSkeleton_productNamePage`
- Skeleton shape: 6 columns × 5 rows

---

**J. Empty States**

Two distinct empty states: one for a truly empty list, one for a filtered result with no matches.

> As a user, I want a helpful empty state when there are no product names yet, so that I know how to get started.

> As a user, I want a clear message when my search returns no results, so that I know the filter is working and not that the list is broken.

**True empty (no product names saved):**

```
GIVEN no product names have been created yet
WHEN the page loads
THEN show: PackageOpen icon + "No product names yet" heading + subtitle + "Add Product Name" CTA button
```

- Component file: `ProductNamesPageClient.jsx`
- Key ID: `emptyState_productNamePage`

**Filtered empty (search returns no matches):**

```
GIVEN there are product names in the list
WHEN the user types a search term that matches nothing
THEN show: SearchX icon + "No results" message + a clear search button to reset the filter
```

- Component file: `ProductNamesTable.jsx`

---

**Upcoming Scope (P2 — not yet implemented):**

---

##### K. Bulk Status Change

**Description:** Let the user select multiple product name rows and flip their status to Active or Inactive in one shot — no need to open each edit modal one by one.

**User Story:**

> As a user, I want to select multiple product names and set their status to Active or Inactive in one action, so I can manage a group of names without editing them one by one.

**Acceptance Criteria:**

```
GIVEN the product name table is loaded
WHEN the user checks one or more row checkboxes
THEN a bulk action bar appears above the table showing "{n} selected" and three buttons: Set Active, Set Inactive, Deselect All
```

```
GIVEN the bulk action bar is visible
WHEN the user clicks Set Active or Set Inactive
THEN all selected names update to that status, a success toast shows "{n} name(s) updated", checkboxes clear, and the table re-fetches
```

```
GIVEN the bulk action bar is visible
WHEN the user clicks Deselect All
THEN all checkboxes uncheck and the bar disappears
```

```
GIVEN some rows are checked
WHEN the user changes the search query or filter
THEN any rows no longer visible are automatically deselected
```

```
GIVEN all visible rows are checked
THEN the header checkbox shows a checked state

GIVEN some (but not all) visible rows are checked
THEN the header checkbox shows an indeterminate state
```

**Component changes:** `ProductNamesTable.jsx` — add Checkbox column, select-all in header, bulk action bar.

**Key test IDs:**

| Element                    | id                                   |
| -------------------------- | ------------------------------------ |
| Bulk action bar            | `bulkActionBar_productNamePage`      |
| Set Active button          | `bulkSetActiveBtn_productNamePage`   |
| Set Inactive button        | `bulkSetInactiveBtn_productNamePage` |
| Deselect All button        | `bulkDeselectAllBtn_productNamePage` |
| Header select-all checkbox | `selectAllNames_productNamePage`     |
| Per-row checkbox           | `nameCheckbox_{id}_productNamePage`  |

---

##### L. Product Count Badge Navigation

**Description:** The product count badge on each row becomes a clickable link (when count > 0) that takes the user straight to the product list pre-filtered by that product name — so they can instantly see which products use it.

**User Story:**

> As a user, I want to click the product count badge on a product name row and be taken to the product list page filtered to that name, so I can quickly see which products use it.

**Acceptance Criteria:**

```
GIVEN a product name has product_count > 0
WHEN the user clicks its count badge
THEN the browser navigates to /main/inventory/product-list?name={product_name} (URL-encoded)
```

```
GIVEN a product name has product_count = 0
THEN the badge is slate-colored, not clickable, and has no hover effect
```

```
GIVEN the badge button receives keyboard focus
THEN a visible focus ring is shown
```

**Component changes:** `ProductNamesTable.jsx` — wrap clickable badge in `<button>`.

**Key test ID:** `productCountBadge_{id}_productNamePage`

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

#### 3.1.6 Product Detail Page (`/main/inventory/product-list/[id]`) — implemented v1.11

**Deskripsi:** Halaman detail individual produk yang menampilkan statistik ringkas, riwayat pembelian, dan riwayat penggunaan dalam satu tampilan. Dapat diakses dari route `/main/inventory/product-list/[id]`.

**Route:** `/main/inventory/product-list/[id]`
**Entry Point:** `app/main/inventory/product-list/[id]/page.jsx`
**Komponen Utama:** `app/main/inventory/product-list/[id]/ProductDetailPage.jsx`

**User Stories:**

> As a user, I want to see a complete history of purchases and usage sessions for a single product, so that I can understand how I've been using and buying it.

> As a user, I want to see summary stats (current stock, total added, total spent, usage sessions) for a product in one place, so that I can evaluate its consumption at a glance.

**Struktur Halaman:**

1. Back link — "Back to Product List" → `/main/inventory/product-list`
2. PageHeader — `title`: nama produk, `description`: brand · type, `breadcrumbs`: Inventory > Product List > [nama produk]
3. Status badge (active/inactive) — di samping PageHeader (float right on sm+)
4. 4 stat cards (2-col mobile, 4-col desktop):
   - **Current Stock** — `product.quantity`, sub-label "Out of stock" / "Low stock" jika berlaku
   - **Total Added** — SUM(`quantity_added`) dari stock history, sub-label "all time"
   - **Total Spent** — SUM(`price`) dari stock history, format `Rp X.XXX`
   - **Usage Sessions** — COUNT records dari usage history
5. 2-column content grid (1-col mobile, 2-col desktop):
   - **Purchase History** — tabel kolom: Date, Qty Added, Price, Note; sorted most recent first; empty state: icon + "No purchase history yet"
   - **Usage History** — reuse `ProductUsageLog` component

**Data Fetching:** 3 parallel API calls via `Promise.all` saat komponen mount:

- `GET /api/inventory/v1/product/[id]` → product data
- `GET /api/inventory/v1/product/stock/history/[id]` → purchase history
- Usage history API → usage log

**Loading State:** Full skeleton dengan back link tetap terlihat — skeleton untuk header, 4 stat cards, dan 2 content sections.

**Error State:** Tampilan centered dengan icon `Package`, pesan error, dan tombol "Try again" (retry button memanggil ulang `loadData`).

**Acceptance Criteria:**

```
GIVEN user navigasi ke /main/inventory/product-list/[id]
WHEN halaman dimuat
THEN 4 stat cards menampilkan data akurat berdasarkan stock history dan usage history produk

GIVEN data sedang dimuat
WHEN API belum merespons
THEN skeleton ditampilkan untuk semua section
AND back link tetap visible

GIVEN API gagal (network error atau 5xx)
WHEN error terjadi
THEN pesan error ditampilkan dengan tombol "Try again"
AND klik "Try again" me-retry semua 3 API calls

GIVEN produk memiliki status "active"
WHEN halaman dimuat
THEN badge "active" berwarna emerald ditampilkan di samping PageHeader

GIVEN produk tidak memiliki riwayat pembelian
WHEN section Purchase History dirender
THEN empty state ditampilkan dengan icon dan teks "No purchase history yet"
```

**Validasi:**

- `productId` divalidasi sebagai integer positif sebelum diteruskan ke API
- Halaman diproteksi via `requireAuth()` di server component wrapper

**API Endpoints:**

- `GET /api/inventory/v1/product/[id]` — product detail
- `GET /api/inventory/v1/product/stock/history/[id]` — purchase history
- `GET /api/inventory/v1/product/restock-predictions` — digunakan di halaman Product List (bukan di halaman detail)

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

## 4. API Standards

### Response Format

```json
// Success
{ "data": {...}, "message": "string" }

// Error
{ "error": "ERROR_CODE", "message": "Human readable message" }
```

### HTTP Status Codes

| Status | Kondisi                        |
| ------ | ------------------------------ |
| 200    | OK                             |
| 201    | Created                        |
| 400    | Validation error / Bad request |
| 401    | Unauthenticated                |
| 403    | Forbidden                      |
| 404    | Not found                      |
| 500    | Server error                   |

### Auth

- Semua endpoint `/api/*` (kecuali `/api/auth/*`) harus validasi session
- [DEPRECATED v1.1] ~~Gunakan JWT/authToken cookie untuk validasi auth di route handler~~ — diganti Supabase SSR `createClient()` + `supabase.auth.getUser()`
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

### PageHeader Component

**Komponen:** `app/main/components/PageHeader.jsx`

Setiap halaman dalam app (Inventory + Trading) harus menggunakan komponen `PageHeader` di bagian atas konten halaman.

**Props:**
| Prop | Type | Required | Keterangan |
|------|------|----------|------------|
| `title` | string | ✅ | Judul halaman — `<h1>` |
| `description` | string | — | Deskripsi singkat di bawah judul |
| `breadcrumbs` | `{label, href?}[]` | — | Array item breadcrumb; item tanpa `href` = current page |

**Halaman yang menggunakan PageHeader:**
| Halaman | Title | Breadcrumbs |
|---------|-------|-------------|
| Inventory Dashboard | "Inventory Dashboard" | Inventory > Dashboard |
| Product List | "Product List" | Inventory > Product List |
| Product Detail | [nama produk] | Inventory > Product List > [nama produk] |
| Product Brand | "Product Brand" | Inventory > Product Brand |
| Product Name | "Product Name" | Inventory > Product Name |
| Product History | "Product History" | Inventory > Product History |
| Trading Dashboard | "Trading Dashboard" | Trading > Dashboard |
| Trade List | "Trades" | Trading > Trades |
| Fee | "Fees" | Trading > Fees |
| Event | "Market Events" | Trading > Market Events |
| Settings | "Settings" | Trading > Settings |

---

## 6. Database Tables

| Tabel              | Module    | Keterangan               |
| ------------------ | --------- | ------------------------ |
| `product_list`     | Inventory | Data produk              |
| `product_brand`    | Inventory | Master brand             |
| `product_name`     | Inventory | Master tipe produk       |
| `product_quantity` | Inventory | Stok saat ini per produk |
| `product_history`  | Inventory | Log aktivitas stok       |
| `trade_list`       | Trading   | Data trade               |
| `event_list`       | Trading   | Event pasar              |
| `fee_list`         | Trading   | Struktur fee             |
| `settings`         | Trading   | Setting per user         |
| `auth.users`       | Auth      | Managed by Supabase      |

---

## 7. Non-Functional Requirements

| Aspek           | Requirement                                                              |
| --------------- | ------------------------------------------------------------------------ |
| Performance     | API response < 2 detik                                                   |
| Security        | No raw SQL interpolation, input sanitization, encrypted sensitive fields |
| Accessibility   | WCAG 2.1 AA                                                              |
| Browser Support | Chrome, Firefox, Safari (2 versi terakhir)                               |
| Auth            | Session-based via Supabase SSR cookies                                   |

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

| Versi | Tanggal    | Perubahan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Author       |
| ----- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1.0   | 2026-05-03 | Initial PRD — dokumentasi semua fitur existing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Rafael Cahya |
| 1.1   | 2026-05-03 | Auth module security & UX fixes — see sprint log. Updated 3.3.1 (Login: Google OAuth only, error/reason param handling, ?next= flow, Suspense); Added 3.3.3 (Logout: LogoutButton, POST /api/auth/logout); Added 3.3.4 (Session Expiry: AuthListener); Updated 3.3.2 (Callback: no_code/auth_failed redirects, ?next= preservation); Updated 3.4 (User Settings APIs: GET/PUT /api/user, POST /api/user/avatar); Updated Section 4 Auth (removed JWT, added createAdminClient pattern, added /api/auth/logout); Updated Section 2 (Google OAuth only)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Rafael Cahya |
| 1.2   | 2026-05-03 | Auth flow bug fixes & PRD clarity update. (1) Fixed: middleware sekarang preserve ?next= param saat redirect ke /login sehingga user kembali ke halaman tujuan setelah login. (2) Fixed: LogoutButton sekarang panggil POST /api/auth/logout (server-side canonical) bukan client-side signOut langsung — session di-clear di server sebelum redirect. (3) Fixed: AuthListener tidak lagi tampilkan toast "session expired" saat intentional logout — menggunakan sessionStorage flag untuk membedakan intentional logout vs session expiry. (4) Fixed: callback route validasi ?next= harus dimulai dengan "/" untuk keamanan. Added 3.3.0 Auth Flow Overview dengan visual flow diagram untuk login, logout, dan session expiry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Rafael Cahya |
| 1.3   | 2026-05-03 | Auth UI/UX overhaul berdasarkan frontend + UI/UX agent review. (1) Login page: tambah app identity (icon + "Personal Management" di atas Card); Google button sekarang ikut Google branding guidelines (bg putih, SVG 4-warna, label "Sign in with Google"); copy text diperbarui seluruhnya. (2) LogoutButton: default size="sm", warna neutral (bukan merah), label "Sign out". (3) Baru: UserMenu component di landing page — menampilkan avatar Google user + email di DropdownMenu dengan opsi Sign out. (4) Landing page: CTA buttons diubah ke "Go to Trading" / "Go to Inventory"; card descriptions diperbarui. (5) Double toast session expiry dihilangkan — toast hanya dari login page via ?reason= param. Updated 3.3.1, 3.3.3, 3.3.4 di PRD. PRD maintenance: header version diupdate ke 1.3; semua [DEPRECATED] diberi tag versi (v1.1); flow diagrams dan error messages table diselaraskan dengan implementasi aktual (SESSION EXPIRY FLOW: hapus toast dari AuthListener, update copy text; LOGIN FLOW: "Sign in with Google"; LOGOUT FLOW: "Sign out" + UserMenu).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Rafael Cahya |
| 1.4   | 2026-05-05 | Added 3.1.0 Inventory Dashboard — 6 summary cards (Total Products, Active, Inactive, Total Stock, In Use, Favorites) + 6 analytics sections (Cost Per Use, Low Stock Alert, Neglected Products, Monthly Spend by Type, Avg Usage Duration, Days Until Empty). Layout 2-column grid responsive (mobile 1-col → desktop 2-col untuk section analitik, 6-col untuk summary cards). API: GET /api/inventory/v1/dashboard dan GET /api/inventory/v1/product/summary. Database tables: product_list, product_quantity, product_history.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Rafael Cahya |
| 1.5   | 2026-05-09 | Dashboard v1.5 — removed Neglected Products (Section 3) and Days Until Empty (Section 6); added 4 new features: (1) Spend This Month vs Last Month — bar chart comparison dengan delta badge (Section 0, full width); (2) Most Restocked Products — tabel restock frequency per produk sorted by count DESC (replaces Section 3); (3) Monthly Spend by Type enhanced — tambah "This Month" total di header section; (4) Avg Cost/Use Over Time — line chart cumulative cost per use per produk dengan product selector dan hover tooltip berisi delta Rp + % per pembelian (Section 6, full width). Layout diupdate: Low Stock Alert + Most Restocked menjadi 2-col grid, sisanya full width. API response diupdate: tambah mostRestocked, spendComparison, costPerUseHistory; hapus neglected dan daysUntilEmpty. Installed recharts untuk chart components.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Rafael Cahya |
| 1.6   | 2026-05-09 | Dashboard v1.6 — 4 statistik baru + beberapa penyempurnaan: (1) Restock Prediction (Section 7) — prediksi tanggal habis per produk berdasarkan avg_days × quantity, sorted DESC, urgency badge 5 level; (2) Monthly Budget Tracker (Section 8) — set & track budget per type dengan inline edit, progress bar 3 warna, API budget baru + tabel Supabase `inventory_budget`; (3) Spending Heatmap (Section 9) — calendar heatmap GitHub-style 52 minggu × 7 hari, 5 level warna violet, hover tooltip, tanpa library tambahan; (4) Product Lifecycle Score (Section 10) — composite score 0-100 dari normalisasi cost_per_use + avg_days, tier S/A/B/C, score bar. Monthly Spend by Type diubah dari per-kategori menjadi per-produk (tampilkan brand + nama + type badge per baris). Semua table header di-unify ke style bg-slate-100 + rounded corners. API dashboard diupdate: tambah restockPrediction, spendingHeatmap, lifecycleScore. Baru: GET+POST /api/inventory/v1/budget. Database: tambah tabel inventory_budget (RLS, UNIQUE user+type).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Rafael Cahya |
| 1.10  | 2026-05-10 | **Sticky controls bar fix (Product List)** — fixed broken `h-full` height chain caused by `inventory/layout.jsx` wrapping children in a plain `div.relative` with no height constraints. Removed inner scroll container; page now scrolls naturally inside `main`. Controls bar (search + filter + add button) changed to `sticky top-0 z-10 bg-white` so it stays visible as the user scrolls the product list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 1.11  | 2026-05-12 | **Product List enhancements (9 fitur baru).** P0: (1) Last Purchase Price hint di Add Stock dialog — fetch `GET /api/inventory/v1/product/[id]/last-price` saat dialog dibuka, tampilkan "Last purchase price: Rp X — d MMM yyyy" atau "No previous purchase data available". P1: (2) Summary cards clickable — Total Products, Active, Inactive, Favorites di ProductListSummary dapat diklik untuk apply filter; Total Stock dan In Use tidak clickable. (3) Column sorting — header Product, Quantity, In Use, Usage Date di desktop table sortable client-side ascending/descending dengan icon indicator. (4) Category filter dinamis — dropdown menambahkan section "Category" berisi semua nilai `product.type` unik; filter value prefix `"type:"`. (5) Note di Usage Log — `item.note` ditampilkan dalam card di atas UsageCompletionForm saat row di-expand. (6) `LOW_STOCK_THRESHOLD = 5` — konstanta terdefinisi di 3 file (`ProductFilterDropdown`, `ProductsTable`, `ProductsPage`); tidak ada magic number tersebar. P2: (7) Recent Purchases di Add Stock dialog — fetch `GET /api/inventory/v1/product/stock/history/[id]` saat dialog dibuka, tampilkan 3 entri terbaru di atas form. (8) Restock prediction hint di tabel — `~Xd left` di bawah QuantityBadge, orange jika ≤ 7 hari; data dari `GET /api/inventory/v1/product/restock-predictions`. (9) Halaman detail produk — route baru `/main/inventory/product-list/[id]`: back link, PageHeader, 4 stat cards (Current Stock, Total Added, Total Spent, Usage Sessions), Purchase History table, Usage History (reuse ProductUsageLog), loading skeleton, error state + retry. Tambah 3 endpoint baru ke API doc: `GET restock-predictions`, `GET [id]/last-price`, `GET stock/history/[id]`. Update PageHeader table: tambah Product Detail. | Rafael Cahya |
| 1.9   | 2026-05-10 | Product List improvements & Edit Product feature. (1) **Edit Product** — implementasi `EditProductSheet` menggunakan `<Dialog>` (konsisten dengan semua action lain), bukan `<Sheet>`; field: Brand (Select), Product Name (Select), Type (Input), Status (Select); setiap field punya guide message; pre-fill dari data produk saat ini; PATCH `/api/inventory/v1/product/[id]`. (2) **Language** — semua teks UI di Product List diubah ke bahasa Inggris: "Habis" → "Out of Stock", "Menipis" → "Low Stock", "Tidak ada produk yang cocok" → "No products match your filters", "Hapus filter & pencarian" → "Clear filters & search", search placeholder diubah ke bahasa Inggris. (3) **API dedup fix** — `getProductSummary()` hanya dipanggil sekali di `ProductsPage`, hasilnya di-pass sebagai props ke `ProductListSummary`, `ProductTableHeader`, dan `ProductFilterDropdown` (sebelumnya 3× parallel API calls). (4) **`useDebounce` hook** — dibuat di `hooks/useDebounce.js` (sebelumnya di-import tapi belum ada). (5) **Quantity column** — kolom "On Hand Quantity" diubah menjadi "In Use"; kolom Quantity dan In Use sekarang right-aligned dengan `tabular-nums`. (6) **Star icon** — selalu dirender di kolom Product (`visibility:hidden` jika bukan favorit) untuk mencegah layout shift saat toggle favorite. (7) **Action dropdown reorder** — Edit Product → Add Stock → Record Usage → separator → Favorites → separator → Delete.                                                                                                                                                                                                                                                                                                                                                           | Rafael Cahya |
| 1.12  | 2026-05-15 | **Product Brand module — full spec + P0 validation enforcement.** Section 3.1.2 fully rewritten from stub to production-grade spec. (1) Added user stories (5). (2) Added acceptance criteria for all 4 operations: list, create, edit, delete. (3) Documented P0 uniqueness validation on create and update — case-insensitive ilike check, excludes soft-deleted brands; update excludes self via `.neq("id", id)`; API returns HTTP 409 on conflict. (4) Documented P0 delete guard — service queries `product_list` for active products using brand before soft-delete; throws 409 with count in message. (5) Documented preventive UX: modal edit checks `product_count > 0` → shows red warning box (AlertCircle icon, red border/bg, message with count) below Note field; delete button disabled (`opacity-40 cursor-not-allowed`) — guard fires at modal open, not after attempt. (6) Documented `product_count` field added to list endpoint — parallel fetch via `Promise.all`, merged into each brand object. (7) Added full API endpoint specs (GET/POST/PUT/DELETE) with request/response format, HTTP codes, and validation notes. (8) Added database table reference.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Rafael Cahya |
| 1.13  | 2026-05-15 | **Product Brand — 9 new features documented in section 3.1.2.** (E) Search bar — client-side substring filter on brand name, with clear (X) button, works in combination with status filter and sort. (F) Product count badge column — blue when count > 0 (clickable, navigates to product list pre-filtered by brand), gray when count = 0. (G) Filter & Sort merged dropdown — SlidersHorizontal icon, 4 sort options (A→Z default, Z→A, most/fewest products), independent clear buttons per section, violet badge dot showing active filter/sort count. (H) Bulk status change — per-row checkboxes + select-all, bulk action bar with Set Active / Set Inactive / Deselect All, loops PUT API per brand, toast summary "X brands updated". (I) Explicit edit (pencil icon) button on each row, alongside existing row-click behavior. (J) Restore deleted brand — edit modal for deleted brand shows green Restore Brand button (instead of Delete), calls PUT with brand_status: 'active'. (K) Empty state — PackageOpen icon + "No brands yet" heading + subtitle + Add Brand CTA button. (L) Loading skeleton — shadcn Skeleton table (1 header + 5 body rows) matching real column widths. (M) Layout aligned to Product List page — same controls bar structure, sticky top-0 CSS, same card layout pattern.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Rafael Cahya |
| 1.14  | 2026-05-16 | **Product Name — section 3.1.3 fully rewritten from stub to production-grade spec.** (1) Added description explaining the foreign key constraint and uniqueness requirement. (2) Added 5 user stories. (3) Added acceptance criteria for all 4 operations: list (with product_count), create (uniqueness check), edit (uniqueness check excluding self), delete (guard: name still in use). (4) Added validations table (4 rules). (5) Added error states table (5 states) including delete guard warning box visual spec. (6) Added full API endpoint specs for all 6 routes with request/response shape, HTTP codes, and current implementation state notes. (7) Added database table reference. (8) Documented 6 P0 implementation gaps found in code review: missing product_count join, missing uniqueness checks on create/update, missing delete guard, missing toast on delete error, missing warning box in edit modal — each gap lists the exact file to fix. (9) Documented upcoming P1/P2 scope for feature parity with Product Brand v1.13.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Rafael Cahya |
| 1.15  | 2026-05-17 | **Product Name — P0 gaps resolved.** All 6 P0 implementation gaps from v1.14 have been implemented by Backend + Frontend agents: `product_count` now returned by list endpoint; uniqueness check added to create and update (case-insensitive, excludes self on update); delete guard added (throws 409 with product count); delete error now surfaced via `toast.error`; warning box + disabled delete button shown in edit modal when `product_count > 0`. Removed P0 gap table from section 3.1.3 and removed "Current state: not yet implemented" notes from API endpoint specs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Rafael Cahya |
| 1.16  | 2026-05-17 | **Product Name — P1 features documented as production-ready (section 3.1.3).** Replaced 6 P1 bullet placeholders with full specs: (E) Search bar — client-side substring filter, IDs `searchInput_productNamePage` + `clearSearchBtn_productNamePage`, components `ProductNamesPageClient.jsx` + `ProductNamesTable.jsx`. (F) Sort controls — dropdown with A→Z / Z→A / most/fewest options, IDs `filterSortBtn_productNamePage` + `sortOption_*_productNamePage` + `resetSortBtn_productNamePage`, components `ProductNameFilterDropdown.jsx` + `ProductNamesTable.jsx`. (G) Edit button per row — pencil icon, ID pattern `editProductNameBtn_{id}_productNamePage`, component `ProductNamesTable.jsx`. (H) Restore deleted product name — green Restore button in edit modal, ID `restoreProductNameBtn_productNamePage`, success toast "Product name restored successfully!", component `UpdateProductName.jsx`. (I) Loading skeleton — 6 columns × 5 rows shadcn Skeleton table, ID `loadingSkeleton_productNamePage`, component `ProductNamesPageClient.jsx`. (J) Empty states — true empty (PackageOpen icon + Add CTA, ID `emptyState_productNamePage`, `ProductNamesPageClient.jsx`) and filtered empty (SearchX icon + clear button, `ProductNamesTable.jsx`). P2 backlog retained.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Rafael Cahya |
| 1.17  | 2026-05-17 | **Product Name P2 — full specs written for Bulk Status Change and Product Count Badge Navigation.** Merged Filter & Sort removed from P2 (delivered in P1). (K) Bulk Status Change — per-row checkboxes + select-all header checkbox, bulk action bar with Set Active / Set Inactive / Deselect All, auto-deselect on filter/search change, indeterminate header state, success toast "{n} name(s) updated". Key IDs: `bulkActionBar_productNamePage`, `bulkSetActiveBtn_productNamePage`, `bulkSetInactiveBtn_productNamePage`, `bulkDeselectAllBtn_productNamePage`, `selectAllNames_productNamePage`, `nameCheckbox_{id}_productNamePage`. (L) Product Count Badge Navigation — blue badge wraps a `<button>` when count > 0, navigates to `/main/inventory/product-list?name={encoded}`, slate badge is inert when count = 0, keyboard focus ring required. Key ID: `productCountBadge_{id}_productNamePage`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Rafael Cahya |
| 1.7   | 2026-05-09 | UX improvements & PageHeader rollout. (1) SummaryCards: card "Inactive" diganti "Low Stock" (value = `lowStockAlerts.length`, produk dengan `quantity ≤ 2`); card "Active" menambahkan sub-label "of X products"; semua card kini clickable — klik menyimpan filter ke `localStorage` lalu navigasi ke `/main/inventory/product-list`. (2) SummaryCards accessibility: card di-wrap dalam native `<button>` (keyboard accessible), icon `aria-hidden="true"`, `focus-visible:ring-2 focus-visible:ring-violet-500`, `tabular-nums` pada nilai angka, transisi eksplisit `transition-[box-shadow,border-color]`. (3) PageHeader component baru (`app/main/components/PageHeader.jsx`) — reusable component dengan props `title`, `description`, `breadcrumbs[]`; dirollout ke semua 10 halaman Inventory + Trading (lihat Section 5 — PageHeader Component). (4) Test: 12 test case baru pada Summary Cards suite; fix pattern `.scrollIntoView()` sebelum `.should('be.visible')` untuk semua section di scroll container; fix text mismatch "Avg Usage Duration" → "Average Usage Duration". Total dashboard-ui suite: 88/88 pass (100%).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Rafael Cahya |
