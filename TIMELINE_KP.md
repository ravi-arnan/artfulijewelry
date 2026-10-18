# Timeline & Roadmap Implementasi E-Commerce Ritel (Kerja Praktek)
**Platform**: Artfuli Jewelry (Redesign Bali Handmade)  
**Studi Kasus**: Kerajinan Perak dan Kuningan Celuk, Gianyar, Bali  
**Fokus Utama**: Sistem Transaksi Ritel Utuh, Payment Gateway Midtrans, Multi-Bahasa (ID/EN), Dual-Currency (IDR/USD), dan Manajemen Pesanan

---

## 1. Ringkasan Ruang Lingkup Proyek

Proyek ini bertujuan membangun platform e-commerce ritel perhiasan siap pakai (*production-ready*) dengan alur transaksi digital dari pemilihan katalog hingga pelunasan pembayaran dan pelacakan pengiriman. Dokumen ini menjadi acuan kerja teknis sekaligus panduan penyusunan Bab 3 (Perancangan) dan Bab 4 (Implementasi & Pengujian) pada Laporan Kerja Praktek (KP).

### Arsitektur Teknologi
- **Frontend**: Next.js 16 (App Router, React Server Components & Server Actions), Tailwind CSS v4, GSAP Animations.
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Auth, Storage).
- **Payment Gateway**: Midtrans Snap API & Core Webhook Handler (QRIS, GoPay, ShopeePay, Virtual Account BCA/Mandiri/BNI/BRI, Credit Card).
- **Internasionalisasi**: 
  - Dual-Language: Bahasa Indonesia (`id`) & English (`en`).
  - Dual-Currency: Rupiah (`IDR`) & US Dollar (`USD`) dengan model *discrete pricing* (`price_idr`, `price_usd`).
- **Logistik Pengiriman**: Kalkulasi tarif domestik (JNE/J&T/SiCepat) dan internasional flat-tier (DHL/EMS).

---

## 2. Timeline Mingguan (Sprint 1 s/d Sprint 6)

```
[Sprint 1: Minggu 1] -> Fondasi Database, i18n (ID/EN) & Currency Engine (IDR/USD)
[Sprint 2: Minggu 2] -> Shopping Cart, Kalkulator Ongkir & Alur Checkout
[Sprint 3: Minggu 3] -> Integrasi Midtrans Snap & Webhook State Machine (SHA-512)
[Sprint 4: Minggu 4] -> Customer Order Tracking, Digital Invoice & WhatsApp Concierge
[Sprint 5: Minggu 5] -> Backoffice Admin Dashboard & Kontrol Inventaris Stok
[Sprint 6: Minggu 6] -> Blackbox Testing, Simulasi Sandbox & Finalisasi Laporan KP
```

---

### Sprint 1 (Minggu 1): Database Modeling, i18n & Multi-Currency Engine
Fokus: Menyiapkan struktur data transaksi dan sistem penggantian bahasa/mata uang global.

- [ ] **Database Schema & Migrations**:
  - Tabel `products`: penambahan kolom `price_idr`, `price_usd`, `weight_grams`, `stock_quantity`, `is_active`.
  - Tabel `orders`: `id`, `order_number` (format `ORD-YYYYMMDD-XXXX`), `user_id`, `guest_email`, `guest_name`, `guest_phone`, `currency`, `total_amount`, `shipping_cost`, `grand_total`, `status`, `payment_method`, `snap_token`.
  - Tabel `order_items`: `order_id`, `product_id`, `variant_selected` (ring size, metal finish), `quantity`, `unit_price`, `subtotal`.
  - Tabel `shipping_addresses`: detail alamat pengiriman lengkap (provinsi, kota, kecamatan, kodepos, negara).
  - Setup Row Level Security (RLS) di Supabase untuk mengisolasi data pembeli dan guest.
- [ ] **Dual-Language Engine (ID / EN)**:
  - Setup kamus lokalisasi JSON (`locales/id.json` dan `locales/en.json`).
  - Context provider `LanguageContext` dengan persistensi cookie/localStorage.
  - Komponen switch bahasa di Header & Mobile Drawer.
- [ ] **Dual-Currency Engine (IDR / USD)**:
  - Context provider `CurrencyContext`.
  - Helper pemformat mata uang: `formatCurrency(amount, 'IDR' | 'USD')`.
  - Sinkronisasi tampilan harga katalog dan product detail secara reaktif tanpa re-render penuh.

**Output Deliverables**:
1. Migration file SQL Supabase yang sudah teruji di staging database.
2. Komponen selector bahasa dan mata uang yang aktif di navbar.
3. Dokumentasi Entity Relationship Diagram (ERD) untuk Bab 3 Laporan KP.

---

### Sprint 2 (Minggu 2): Shopping Cart, Ongkir & Alur Checkout
Fokus: Membangun interaksi keranjang belanja hingga halaman ringkasan pemesanan.

- [ ] **Cart State & Persistent Storage**:
  - LocalStorage cart untuk guest user.
  - Sinkronisasi otomatis ke tabel `saved_carts` jika pembeli melakukan login.
  - Validasi batas stok saat menambah kuantitas item.
- [ ] **Slide-Over Cart Drawer**:
  - Item counter badge di header icon cart.
  - Kontrol kuantitas (`+`, `-`, `hapus item`).
  - Subtotal dinamis sesuai mata uang yang aktif.
- [ ] **Checkout Page (`/checkout`)**:
  - Form validasi input alamat penerima (domestik vs internasional).
  - Kalkulasi ongkos kirim berdasarkan berat total perhiasan (`weight_grams`) dan destinasi.
  - Pemilihan layanan pengiriman (Reguler / Express / International Courier).
- [ ] **Server Action Create Order**:
  - Validasi ketersediaan stok di sisi server (*server-side integrity check*).
  - Pembuatan record order dengan status awal `pending_payment`.

**Output Deliverables**:
1. Alur Cart Drawer dan Checkout page fungsional.
2. Server action yang memvalidasi data keranjang dan menyimpan order ke Supabase.
3. Activity Diagram alur pemesanan untuk Bab 3 Laporan KP.

---

### Sprint 3 (Minggu 3): Integrasi Midtrans Payment Gateway & Webhook
Fokus: Menghubungkan sistem pemesanan dengan Midtrans Snap dan penanganan webhook asinkron.

- [ ] **Midtrans Snap Integration**:
  - Konfigurasi environment variables (`MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION=false`).
  - Endpoint pembuatan token: `/api/checkout/snap-token`.
  - Komponen frontend pemanggil modal Snap (`window.snap.pay`).
  - Dukungan metode pembayaran: QRIS (GoPay, ShopeePay), Virtual Account (BCA, Mandiri, BNI, BRI), dan Kartu Kredit.
- [ ] **Webhook Handler (`/api/webhooks/midtrans`)**:
  - Verifikasi keamanan signature: `SHA512(order_id + status_code + gross_amount + server_key)`.
  - State Machine Status Transaksi:
    - `capture` / `settlement` -> update status order menjadi `paid`, kurangi stok barang.
    - `pending` -> update status order menjadi `pending`, catat VA number / QR link.
    - `deny` / `cancel` / `expire` -> update status menjadi `cancelled`, batalkan reservasi stok.
  - Proteksi Idempotency: Mencegah pemrosesan duplikat jika Midtrans mengirim retry webhook berulang kali.

**Output Deliverables**:
1. Modul pembayaran Midtrans aktif di sandbox mode.
2. Endpoint webhook terverifikasi dengan respon HTTP 200 OK ke Midtrans simulator.
3. Sequence Diagram integrasi payment gateway untuk Bab 3 & 4 Laporan KP.

---

### Sprint 4 (Minggu 4): Order Lifecycle, Digital Invoice & Notifikasi
Fokus: Pengalaman purnajual pembeli, pelacakan pesanan, dan bukti bayar resmi.

- [ ] **Halaman Pelacakan Pesanan (`/orders/[orderNumber]`)**:
  - Akses aman via token / nomor order unik (bisa diakses guest).
  - Visual timeline status: `Menunggu Pembayaran` -> `Dibayar` -> `Diproses Pande Mas` -> `Dalam Pengiriman` -> `Selesai`.
  - Informasi rekening tujuan pembayaran / QRIS jika masih berstatus pending.
- [ ] **Digital Invoice & Print Engine**:
  - Halaman invoice ritel resmi dengan nomor seri invoice, rincian perhiasan, kadar perak/emas, rincian pajak/ongkir, dan cap lunas (*Paid Stamp*).
  - Tombol cetak langsung ke PDF (*browser print style optimized*).
- [ ] **WhatsApp Concierge Notification**:
  - Tombol otomatis kirim ringkasan order ke WhatsApp Admin / CS (`https://wa.me/...`) untuk konfirmasi cepat atau asistensi kustom ukuran perhiasan.

**Output Deliverables**:
1. Halaman order status dan invoice siap cetak.
2. Integrasi direct WhatsApp dispatch dengan payload pesanan terformat rapi.
3. Dokumentasi pengujian alur customer journey untuk Bab 4 Laporan KP.

---

### Sprint 5 (Minggu 5): Backoffice Admin Dashboard
Fokus: Pengelolaan operasional toko oleh admin / pemilik usaha.

- [ ] **Admin Order Management (`/admin/orders`)**:
  - Proteksi rute dengan autentikasi admin.
  - Tabel data pesanan: filter status (`paid`, `pending`, `shipped`, `cancelled`), pencarian nomor order atau nama pembeli.
  - Modal input nomor resi pengiriman (*Tracking Number*) beserta nama kurir.
  - Aksi update status pesanan menjadi `shipped` atau `delivered`.
- [ ] **Product & Inventory Management (`/admin/products`)**:
  - Pengelolaan katalog: tambah produk baru, edit harga IDR & USD, perbarui stok unit.
  - Upload foto produk perhiasan ke Supabase Storage bucket.
  - Sakelar status produk (`active` / `draft`).

**Output Deliverables**:
1. Panel admin fungsional untuk pemrosesan order dan katalog.
2. Screenshot antarmuka dashboard admin untuk lampiran Laporan KP.

---

### Sprint 6 (Minggu 6): Testing, Security Audit & Penyusunan Laporan KP
Fokus: Pengujian sistem secara komprehensif, simulasi edge case, dan perakitan dokumen akademik.

- [ ] **Simulasi Midtrans Sandbox**:
  - Pengujian transaksi QRIS (skenario sukses bayar dan skenario kedaluwarsa).
  - Pengujian Virtual Account Bank simulator (BCA, Mandiri, BNI).
  - Pengujian Kartu Kredit 3D Secure (skenario OTP sukses dan OTP ditolak/insufficient funds).
  - Uji penolakan webhook jika signature SHA-512 tidak valid (*tamper protection test*).
- [ ] **Blackbox Testing**:
  - Penyusunan tabel pengujian fungsionalitas (Test Case, Input, Ekspektasi, Hasil Aktual, Status).
- [ ] **Penyusunan Materi Laporan Kerja Praktek**:
  - Bab 3: Diagram Arsitektur, Use Case, Activity, Sequence Diagram, dan Skema Database (ERD).
  - Bab 4: Implementasi kode utama (Next.js server actions, Midtrans client, webhook handler) dan matriks hasil uji blackbox.
  - Bab 5: Kesimpulan sistem dan saran pengembangan tahap berikutnya (misal: multi-vendor atau auto-sync stok toko fisik).

---

## 3. Matriks Kebutuhan Dokumen Laporan KP

| Bab Laporan KP | Kebutuhan Teknis / Diagram | Status Sumber Daya |
|---|---|---|
| **Bab 1 & 2** | Latar belakang Celuk artisan, identitas brand Artfuli, studi pustaka payment gateway & e-commerce | Tersedia di `BRAND_IDENTITY.md` & `PRD.md` |
| **Bab 3 (Perancangan)** | Use Case Diagram (Guest, Customer, Admin) | Dirancang dari alur Sprint 1 - 5 |
| **Bab 3 (Perancangan)** | Entity Relationship Diagram (ERD) & Struktur Tabel PostgreSQL | Dirancang di Sprint 1 (`supabase/migrations`) |
| **Bab 3 (Perancangan)** | Sequence Diagram Alur Pembayaran Midtrans Snap & Webhook | Dirancang di Sprint 3 |
| **Bab 4 (Implementasi)** | Cuplikan kode Server Action, Webhook Verification, i18n Context | Dibangun di Sprint 1 s/d Sprint 5 |
| **Bab 4 (Pengujian)** | Tabel Uji Blackbox & Tangkapan Layar Simulator Midtrans | Dijalankan di Sprint 6 |

---

## 4. Checklist Kunci Sukses Sidang KP
1. **Bukti Transaksi Nyata**: Ada nomor order yang berhasil disimulasikan dari status `pending` hingga `settlement/paid` di dashboard Midtrans Sandbox.
2. **Keandalan Webhook**: Sistem tetap konsisten meskipun user menutup browser setelah bayar di aplikasi bank/e-wallet (karena webhook berjalan di background).
3. **Data Integrity**: Stok produk berkurang otomatis saat pembayaran dinyatakan lunas dan kembali normal jika transaksi kedaluwarsa.
4. **Dua Bahasa & Mata Uang**: Tampilan antarmuka dan harga dapat berganti mulus antara pasar domestik (IDR/Bahasa Indonesia) dan turis/ekspor (USD/English).
