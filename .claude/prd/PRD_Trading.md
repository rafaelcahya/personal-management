# PRD — Trading Management Module

> Part of PRD_Personal_Management. Shared standards: [PRD_Shared.md](./PRD_Shared.md)

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
- Fee yang dikenakan

**Validasi:**

- Harga tidak boleh negatif
- Exit price opsional (trade masih open)
- Quantity minimal 1 lot

---

#### 3.2.3 Event (`/main/trading/event`)

**Deskripsi:** Pencatatan event pasar yang mempengaruhi keputusan trading.

**Fitur:**

- Tampilkan semua event dengan pagination 10 per halaman
- Search by title dan description (case-insensitive)
- Filter: All / Bullish / Bearish / Favorites / Upcoming / Past — persisted ke localStorage
- Tambah event baru
- Edit event
- Hapus event (soft-delete — data tidak hilang dari database)
- Favorite toggle per event

**Field Event:**

- Title (wajib, teks pendek, maks 100 karakter) — nama singkat event
- Description (opsional, maks 2000 karakter) — detail event
- Event Type (opsional): Earnings / Central Bank / Macro / Corporate Action / Geopolitical / Personal / Other
- Impact direction: UP (Bullish) / DOWN (Bearish)
- Event date (wajib) — disimpan sebagai date string (yyyy-MM-dd), bukan ISO timestamp, agar tidak terjadi timezone shift
- Links (wajib, minimal 1 entry) — list referensi; setiap entry punya 2 field wajib:
  - Hyperlink: teks yang ditampilkan (display label)
  - Link: URL lengkap

**Links Sub-Component (`EventLinksInput`):**

- Tampil di dalam form Add/Edit sebagai inline sub-form
- User isi field Hyperlink + Link, tekan Add → entry masuk ke list di bawahnya
- Setiap entry di list bisa dihapus
- Tidak ada batas maksimal jumlah link
- Form utama tidak bisa di-submit jika list links masih kosong
- Saat edit, existing links di-preload ke dalam list

**Validasi:**

- Title wajib diisi, 1–100 karakter
- Description opsional, maks 2000 karakter
- Event date wajib diisi
- Impact direction wajib dipilih (UP atau DOWN)
- Event type opsional
- Links wajib minimal 1 entry; setiap entry: hyperlink tidak boleh kosong, link harus URL valid

**UI States:**

- Loading: skeleton pada tabel dan summary cards
- Empty: pesan kosong jika tidak ada event (all/filter)
- Error: toast error jika fetch/save/delete gagal
- Pagination: prev/next + page indicator; disabled jika tidak ada halaman sebelumnya/selanjutnya

**Delete behavior:**

- Muncul confirmation dialog sebelum hapus
- Event di-soft-delete (kolom `deleted_at` diset) — tidak hilang dari database
- Copy dialog TIDAK menyebut "archived records" karena tidak ada UI untuk melihat atau restore event yang sudah dihapus

**API Endpoints:**

| Method | Path                          | Deskripsi                                                                  |
| ------ | ----------------------------- | -------------------------------------------------------------------------- |
| GET    | `/api/trade/v1/event`         | List events — support query params: `page`, `limit=10`, `search`, `filter` |
| POST   | `/api/trade/v1/event`         | Tambah event baru (termasuk links JSONB)                                   |
| PATCH  | `/api/trade/v1/event/:id`     | Edit event (termasuk links JSONB)                                          |
| DELETE | `/api/trade/v1/event/:id`     | Soft-delete event                                                          |
| GET    | `/api/trade/v1/event/summary` | Summary cards (total, bullish, bearish, favorites)                         |

**Data model links (JSONB):**

```json
[
  { "hyperlink": "Reuters article", "link": "https://reuters.com/..." },
  { "hyperlink": "BI Rate Decision", "link": "https://bi.go.id/..." }
]
```

**Acceptance Criteria:**

- [ ] Form Add/Edit punya field title (required), description (optional), event_type (optional), impact direction (required), event date (required), links (required min 1)
- [ ] Description menerima hingga 2000 karakter
- [ ] Form punya sub-component `EventLinksInput` — user bisa add link satu per satu ke list sebelum submit
- [ ] Setiap link entry punya field Hyperlink (label) dan Link (URL), keduanya wajib
- [ ] Form tidak bisa submit jika links masih kosong
- [ ] Saat edit, existing links di-preload ke dalam list
- [ ] List event terpaginasi 10 per halaman dengan kontrol prev/next
- [ ] Search bar memfilter event berdasarkan title dan description secara real-time atau on-submit
- [ ] Event type tampil sebagai badge di setiap baris tabel
- [ ] Saat user memilih tanggal 2 Juni, yang tersimpan dan ditampilkan adalah 2 Juni — tidak bergeser ke 1 Juni akibat konversi UTC
- [ ] Delete dialog tidak menyebut "archived records"
- [ ] Filter persists setelah page refresh (localStorage)

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
