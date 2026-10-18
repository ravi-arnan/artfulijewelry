# Artfuli Jewelry

> Handcrafted Balinese Fine Jewelry & Celuk Silversmithing Workshop  
> Production Domain: [artfulijewelry.com](https://artfulijewelry.com)  
> Legacy Catalog Archive: [bali-handmade.com](https://bali-handmade.com)  
> GitHub Repository: [github.com/ravi-arnan/artfulijewelry](https://github.com/ravi-arnan/artfulijewelry)

---

## 1. Overview

Artfuli Jewelry (Bali Handmade / ArtFuli Jewellery & Manufacturer) adalah platform e-commerce dan editorial storefront untuk perhiasan kriya perak 925, kuningan cetak, dan emas vermeil 18k khas Bali. Proyek ini memadukan estetika editorial kontemporer dengan sistem e-commerce ritel dan grosir utuh, meneruskan warisan katalog kerajinan perak Bali sejak tahun 2004.

Platform ini dikembangkan dengan arsitektur modern untuk keperluan implementasi ritel nyata dan laporan Kerja Praktek (KP), mencakup sistem pembayaran terintegrasi Midtrans Payment Gateway, dukungan multi-bahasa (ID/EN), dual-currency (IDR/USD), serta manajemen pesanan dan inventaris.

---

## 2. Navigasi Dokumentasi Teknis

Semua dokumen spesifikasi, arsitektur, dan panduan teknis tersedia di repositori ini:

- [TIMELINE_KP.md](TIMELINE_KP.md): **Timeline & Roadmap Kerja Praktek (KP)**, perincian Sprint 1 sampai 6, matriks laporan KP, dan skenario pengujian simulator Midtrans.
- [ARCHITECTURE.md](ARCHITECTURE.md): Arsitektur teknis menyeluruh, struktur data Turso/libSQL, Drizzle ORM, dan prinsip rekayasa.
- [BRAND_IDENTITY.md](BRAND_IDENTITY.md): Identitas brand, storytelling atelier Celuk, nilai luhur pande mas, dan pedoman tone of voice.
- [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md): Sistem token warna (Obsidian, Royal Plum, Gold Leaf, Bone White), tipografi editorial, dan tata kelola anti-slop.
- [PRD.md](PRD.md): Product Requirements Document, matriks fitur ritel, dan alur checkout.
- [ROADMAP.md](ROADMAP.md): Peta jalan pengembangan fitur storefront dan katalog.
- [HANDOFF.md](HANDOFF.md): Riwayat checkpoint status sesi kerja harian.
- [DEPLOY.md](DEPLOY.md): Panduan deployment Vercel, konfigurasi domain, dan environment variables.

---

## 3. Struktur Direktori Repositori

```text
.
├── ARCHITECTURE.md          # Spesifikasi teknis & prinsip arsitektur sistem
├── BRAND_IDENTITY.md        # Dokumen identitas brand & narasi kriya Celuk
├── DESIGN-SYSTEM.md         # Design tokens, tipografi & aturan anti-slop
├── PRD.md                   # Product Requirements Document & matriks fitur
├── ROADMAP.md               # Roadmap umum pengembangan storefront
├── TIMELINE_KP.md           # Roadmap detail retail KP & integrasi Midtrans
├── HANDOFF.md               # Catatan checkpoint progres sesi
├── DEPLOY.md                # Panduan deployment Vercel & Turso
│
├── opt1/                    # Aplikasi Next.js 16 aktif (App Router)
│   ├── app/                 # Server components, routes (/shop, /inquiry, /admin, /orders)
│   ├── components/          # Komponen UI storefront, mega menu, lookbook, cart
│   ├── drizzle/             # File migrasi SQL libSQL yang digenerate Drizzle
│   ├── lib/
│   │   ├── db/              # Client Turso libSQL (@libsql/client) & Drizzle Schema
│   │   ├── catalog.*        # Helper transformasi katalog produk
│   │   └── inquiry.*        # Concierge WhatsApp & lead formatting
│   └── test/                # Unit test suite (Node.js native test runner)
│
├── old/                     # Arsip website legacy (bali-handmade.com)
│   ├── images/produk/       # 4.550 foto produk kriya perak asli
│   └── *.html               # 1.600+ halaman katalog detail legacy
│
├── preview/                 # Lab visual prototype independen
│   ├── footer.html          # Prototype Footer Leedlime soft blend
│   └── landing.html         # Eksplorasi animasi dan komposisi layout
│
└── assets/                  # Aset master brand beresolusi tinggi
    ├── logo/                # Master emblem spiral Celuk & wordmark kaligrafi
    └── model/               # Fotografi editorial perhiasan
```

---

## 4. Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, React Server Components & Server Actions)
- **Library UI & Style**: React 19, Tailwind CSS v4, Lucide Icons (zero icon emoji)
- **Animasi Web**: [GSAP 3](https://gsap.com) & ScrollTrigger (masked line reveal, parallax drift, counter scrub, sticky header tone shift)
- **Backend & Database**: [Turso](https://turso.tech) (libSQL / Edge SQLite) + [Drizzle ORM](https://orm.drizzle.team) (dukungan offline `file:local.db`, 0 cold start, kuota free tier 9GB / 500 DB)
- **Payment Gateway**: [Midtrans](https://midtrans.com) Snap API & Core Webhook Handler (QRIS, GoPay, ShopeePay, Virtual Account Bank, Kartu Kredit)
- **Internasionalisasi**: Dual-language (ID/EN) dan Dual-currency (IDR/USD discrete pricing)
- **Pengujian**: Node.js Native Test Runner (`lib/**/*.test.ts`), Playwright E2E
- **Standar Kualitas Visual**: TasteSkill v2 (`.agents/skills/design-taste-frontend`) penegakan anti-slop

---

## 5. Menjalankan di Lingkungan Lokal (Development)

Sesuai aturan operasional laptop kerja (Thermal Guard), seluruh perintah build, compile, dan dev dibungkus dengan `nice -n 19`.

### 1. Menjalankan Next.js Storefront (`opt1`)
```bash
cd opt1
npm install
nice -n 19 npm run dev
```
Akses di browser: `http://localhost:3000`  
*(Catatan: script dev menggunakan flag `--webpack` untuk stabilitas proses compiler).*

### 2. Operasi Database Turso & Drizzle ORM
Secara default, database otomatis berjalan pada SQLite lokal (`file:local.db`) tanpa perlu instalasi cloud terlebih dahulu.

```bash
cd opt1

# Membuat file migrasi baru dari perubahan schema.ts
nice -n 19 npx drizzle-kit generate

# Menerapkan schema ke database (lokal atau cloud Turso)
nice -n 19 npx drizzle-kit push

# Membuka Drizzle Studio GUI untuk inspeksi data
nice -n 19 npx drizzle-kit studio
```

### 3. Menjalankan Unit Tests (50+ Tests)
```bash
cd opt1
nice -n 19 npm test
```

### 4. Verifikasi Standar Desain Anti-Slop (TasteSkill Linter)
```bash
node .agents/skills/design-taste-frontend/scripts/lint.mjs opt1/components/landing/ArtfuliLanding.tsx opt1/app/landing.css
```

---

## 6. Deployment ke Produksi

Aplikasi siap dideploy ke **Vercel** dengan konfigurasi:

- **Repository**: `ravi-arnan/artfulijewelry`
- **Vercel Project**: `artfulijewelry`
- **Root Directory**: `opt1`
- **Build Command**: `next build`
- **Output Directory**: `.next`

### Variabel Lingkungan (Environment Variables)
Tambahkan variabel berikut pada Vercel Project Settings:
```env
# Database Turso (Production Cloud)
TURSO_DATABASE_URL=libsql://artfuli-[tenant].turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# Midtrans Payment Gateway
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
```
Panduan konfigurasi deployment terinci dapat dibaca pada [DEPLOY.md](DEPLOY.md).
