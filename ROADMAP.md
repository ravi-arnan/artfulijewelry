# Implementation Roadmap: Artfuli Jewelry (`artfulijewelry.com`)

Rencana kerja bertahap untuk pengembangan platform e-commerce dan editorial storefront Artfuli Jewelry.

> Untuk timeline lengkap implementasi ritel penuh, integrasi payment gateway Midtrans, multi-bahasa, dual-currency, dan penyusunan laporan Kerja Praktek (KP), silakan merujuk ke [TIMELINE_KP.md](TIMELINE_KP.md).

---

## Milestone 1: Foundation, Brand Identity & Specifications (Selesai)
- [x] Audit dan scraping lengkap 4.550 foto produk kriya asli dari `old/images/produk/`.
- [x] Pemisahan arsitektur folder ke `old/` (klon situs legacy) dan `opt1/` (referensi teknis Next.js).
- [x] Penyusunan dokumen arsitektur dan spesifikasi inti (`BRAND_IDENTITY.md`, `PRD.md`, `DESIGN-SYSTEM.md`, `ARCHITECTURE.md`, `HANDOFF.md`).
- [x] Integrasi aset logo master unclipped (`artfuli-emblem-master.png`, `artfuli-wordmark-master.png`, `artfuli-wordmark-white.png`).
- [x] Instalasi dan konfigurasi TasteSkill v2 (`.agents/skills/design-taste-frontend/`) untuk penegakan standar anti-slop.

---

## Milestone 2: Editorial Storefront (`/`) - In Progress
- [x] **Header Navigation Component (Validated)**:
  - Header tinggi 92px dengan lambang unclipped (52px), wordmark kaligrafi (48px), dan tombol aksi Royal Plum (`#551F51`).
- [x] **Footer System Leedlime Soft Blend (Validated & Anti-Slop Cleared)**:
  - Tata letak direktori 4 kolom bersih (The Collections, The Atelier, Client Care) di atas.
  - Baris utility berada di atas foto tanpa garis hairline 1px.
  - Panoramic jewelry photography di bagian bawah dengan feathered soft-blend gradient mask menyatu mulus ke ground.
  - Bebas dari AI slop (zero status dots, zero time widgets, zero floating badge pills). Linter TasteSkill: **0 FAIL**.
- [ ] **Next.js App Router Scaffolding (Next Action)**:
  - Setup root layout Next.js dengan font Cormorant Garamond dan Plus Jakarta Sans.
  - Scaffolding 10 section terencana:
    1. Sticky Header Nav (approved)
    2. Hero Lookbook Balinese High Jewelry
    3. Atelier Heritage Narrative (Celuk metallurgy)
    4. Curated Signature Collections Grid (Rings, Earrings, Pendants, Cuffs)
    5. Material Assay & XRF Transparency Ledger
    6. Master Craftsmen & Lost-Wax Casting Process
    7. Lookbook Visual Gallery (Large Editorial Plates)
    8. Client Services & Bespoke 3D CAD Inquiries
    9. Ethical Sourcing & 100-Year Guarantee
    10. Leedlime Soft-Blend Panoramic Footer (approved)

---

## Milestone 3: Collections & Filterable Catalog (`/collections`)
- [ ] Filter multi-facet: Kategori (`rings`, `necklaces`, `earrings`, `bracelets`, `mens`) dan Material (`925 Sterling Silver`, `18k Gold Vermeil`).
- [ ] Kartu produk interaktif (*ProductCard*) dengan foto hover sekunder, label material, harga, dan tombol simpan ke wishlist.
- [ ] Integrasi pemetaan data produk berbasis foto asli di `old/images/produk/` dengan fallback tanpa broken image.

---

## Milestone 4: Luxury Product Detail Page (`/products/[slug]`)
- [ ] Galeri foto multi-sudut (*ProductGallery*) dengan thumbnail interaktif.
- [ ] Selektor material dinamis (`925 Sterling Silver` vs `18k Gold Vermeil`) yang memperbarui SKU dan harga secara instan.
- [ ] Selektor ukuran cincin dengan modal panduan interaktif (*Ring Sizer Guide Modal*) lengkap dengan tabel konversi milimeter dan diameter.
- [ ] Accordion spesifikasi teknis: kadar kemurnian logam (XRF Verified), berat gram, dimensi millimeter, dan sertifikasi asal Celuk.
- [ ] Dual action buttons: "Add to Bag" (membuka Cart Drawer) dan "Inquire via Concierge" (membuka WhatsApp dengan detail SKU otomatis).

---

## Milestone 5: Cart Drawer, Wishlist & Concierge
- [ ] Slide-over Cart Drawer dengan kontrol kuantitas, kalkulasi subtotal, dan checkout cepat.
- [ ] Wishlist Drawer persisten menggunakan `localStorage` untuk menyimpan perhiasan favorit tanpa login wajib.
- [ ] Concierge dispatch: generator pesan WhatsApp terformat otomatis (nama produk, ukuran cincin, material) serta mailto ke `care@artfulijewelry.com`.

---

## Milestone 6: Verifikasi, Optimasi & Peluncuran
- [ ] Pengujian menyeluruh: Next.js build clean, ESLint 0 warning/error, TypeScript typecheck bebas error.
- [ ] Audit performa dan aksesibilitas (Lighthouse score target: 95+).
- [ ] Konfigurasi domain kustom dan checklist peluncuran produksi.
