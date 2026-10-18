# Artfuli Jewelry

> Handcrafted Balinese Fine Jewelry & Celuk Metallurgy Atelier
> Production Domain: [artfulijewelry.com](https://artfulijewelry.com)
> Repository: [github.com/ravi-arnan/artfulijewelry](https://github.com/ravi-arnan/artfulijewelry)

---

## 1. Overview

Artfuli Jewelry adalah platform e-commerce dan editorial storefront mewah untuk perhiasan kriya perak 925 dan emas vermeil 18k khas Celuk, Gianyar, Bali. Proyek ini memadukan estetika editorial atelier kelas dunia dengan infrastruktur modern, meneruskan warisan katalog grosir kerajinan perak Bali sejak 2004.

---

## 2. Arsitektur Repositori

Struktur folder terbagi secara modular untuk menjaga keterlacakan aset dan kode:

```text
.
├── ARCHITECTURE.md       # Spesifikasi arsitektur teknis dan prinsip sistem
├── BRAND_IDENTITY.md     # Identitas brand, copywriting, dan nilai atelier
├── DESIGN-SYSTEM.md      # Token desain, tipografi, warna, dan aturan anti-slop
├── PRD.md                # Product Requirements Document & feature matrix
├── ROADMAP.md            # Rencana bertahap implementasi produk
├── HANDOFF.md            # Checkpoint progres sesi dan handoff log
├── DEPLOY.md             # Panduan deployment Vercel dan Supabase
│
├── opt1/                 # Aplikasi Next.js 16 aktif (App Router, Supabase, Admin, Cart)
│   ├── app/              # Halaman storefront, katalog, admin, dan auth
│   ├── components/       # Komponen UI, layout, dan editor katalog
│   ├── lib/              # Supabase clients, export CSV, catalog helpers
│   ├── supabase/         # Migrasi skema DB (0001_init, 0002_saved_carts) & seed
│   └── test/             # Unit test suite (Node test runner)
│
├── old/                  # Klon arsip offline website legacy (bali-handmade.com)
│   ├── images/produk/    # 4.550 foto produk kriya perak asli
│   └── *.html            # 1.600+ halaman katalog detail legacy
│
├── preview/              # Lab preview dan prototype visual independen
│   ├── footer.html       # Prototype Footer Leedlime soft blend (TasteSkill approved)
│   ├── landing.html      # Eksplorasi layout landing page
│   ├── server.mjs        # Server preview lokal (port 3002)
│   └── images/           # Aset visual preview terkurasi
│
└── assets/               # Aset master brand dan referensi
    ├── logo/             # Master emblem spiral Celuk & wordmark kaligrafi
    └── model/            # Koleksi fotografi perhiasan resolusi tinggi
```

---

## 3. Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, React Server Components)
- **Library UI**: React 19, Tailwind CSS v4, Lucide Icons
- **Backend & Database**: [Supabase](https://supabase.com) (PostgreSQL, Row Level Security, Auth)
- **Testing**: Node.js Native Test Runner (`lib/**/*.test.ts`), Playwright E2E
- **Design Governance**: TasteSkill v2 (`.agents/skills/design-taste-frontend`) untuk verifikasi anti-slop

---

## 4. Menjalankan di Lokal (Development)

Sesuai aturan operasional lingkungan kerja (Thermal Guard):

### Menjalankan Next.js Storefront (`opt1`)
```bash
cd opt1
npm install
nice -n 19 npm run dev
```
Akses di browser: `http://localhost:3000`

### Menjalankan Lab Preview Desain (`preview`)
```bash
node preview/server.mjs
```
Akses di browser: `http://localhost:3002/footer.html`

### Menjalankan Unit Tests
```bash
cd opt1
npm test
```

### Verifikasi Standar Desain (TasteSkill Anti-Slop Linter)
```bash
node .agents/skills/design-taste-frontend/scripts/lint.mjs preview/footer.html
```

---

## 5. Deployment

Proyek dideploy ke **Vercel** dengan konfigurasi:

- **Repository**: `ravi-arnan/artfulijewelry`
- **Vercel Project**: `artfulijewelry`
- **Root Directory**: `opt1`
- **Build Command**: `next build`
- **Output Directory**: Next.js default (`.next`)

Panduan lengkap mengenai variabel lingkungan (Environment Variables) dan konfigurasi redirect Auth Supabase dapat dilihat di [DEPLOY.md](file:///home/ravi/Projects/bali-handmade-redesign/DEPLOY.md).
