# Project Handoff & Session Checkpoint

- **Tanggal & Waktu**: 2026-10-19 17:08 WITA
- **Branch Aktif**: `feat/dual-lang-dual-currency-art-6-art-7` (PR #1 ke `main`)
- **Tujuan Proyek**: Website e-commerce dan editorial storefront untuk brand perhiasan **Artfuli Jewelry** / **Bali Handmade** (`artfulijewelry.com` / `bali-handmade.com`).

---

## 1. Status Terakhir Proyek

1. **Sprint 1: Dual-Language (ID/EN) & Dual-Currency (IDR/USD) Engine**:
   - Berhasil mengimplementasikan `LanguageContext` dan `CurrencyContext` dengan dukungan persistensi ganda (`localStorage` dan `document.cookie`).
   - Kamus terjemahan lengkap di `opt1/locales/en.json` dan `opt1/locales/id.json`.
   - Komponen terpadu `LocaleCurrencySwitcher` (`EN / ID · USD / IDR`) disematkan pada header desktop dan drawer navigasi mobile.
   - Perhitungan harga cerdas: prioritas harga diskrit katalog (`priceIdr` & `priceUsd`), dengan fallback konversi dinamis jika data spesifik belum terisi.

2. **Penyelesaian Zero Layout Shift (0px CLS) pada Header**:
   - Mengunci lebar slot interaktif pada `.header-cta-group`:
     - `LocaleCurrencySwitcher`: lebar tetap 168px (`flex-shrink: 0`).
     - `.header-bag-btn`: lebar tetap 148px (pas rapi untuk `Bag (x)` maupun `Keranjang (x)`).
     - `.header-cta`: lebar tetap 168px (pas rapi untuk `Custom Order` maupun `Pesanan Kustom`).
     - Total lebar grup CTA stabil persis di 508px pada kedua bahasa.
   - Mengunci lebar slot item navigasi `.primary-nav li` (Collections/Koleksi: 104px, Workshop/Bengkel: 136px, Services/Layanan: 68px, Lookbook/Katalog Visual: 104px).
   - Terverifikasi via pengukuran browser Playwright: pergeseran horizontal (delta shift) antara mode EN dan ID adalah **0 pixel**.

3. **Status Git & Pull Request**:
   - Branch: `feat/dual-lang-dual-currency-art-6-art-7`
   - Commit: `eaf4831` (`feat(i18n): implement dual-language ID/EN and dual-currency IDR/USD with zero layout shift`)
   - Pull Request: [PR #1](https://github.com/ravi-arnan/artfulijewelry/pull/1) menuju branch `main`.
   - Unit test suite: 62 test lulus hijau (100% pass), ESLint 0 error.

4. **Sinkronisasi Linear Workspace (`artfuli-jewelry`)**:
   - **ART-6** (Dual-Language ID/EN): status **In Review**, catatan PR #1 tersinkronisasi.
   - **ART-7** (Dual-Currency IDR/USD): status **In Review**, catatan PR #1 tersinkronisasi.
   - **ART-21** (Product Catalogue & Collections Showcase): status **In Progress** (Assignee: Ravi Arnan).
   - **ART-17 & ART-18** (Admin Dashboard & Backoffice Order/Product Management): status **Todo** (Assignee: Chalimus Candra / `chalimuscandra@gmail.com`).

5. **Dokumen Akademik Kerja Praktek (KP)**:
   - Selesai mengonversi berkas `Form Surat Penentuan Pembimbing KP.pdf` menjadi format Word (`.docx`) dan PDF baru di direktori `Documents`.
   - Logo Universitas Udayana diperbarui ke versi resmi beresolusi tinggi, serta tanda tangan digital pembimbing (Pak Yogiswara Dharma Putra) telah disematkan presisi dengan latar transparan.

---

## 2. Berkas Dokumentasi Inti di Root

- `README.md`: Ringkasan platform, petunjuk instalasi, dokumentasi deployment, dan tautan resmi.
- `HANDOFF.md`: Catatan checkpoint progres dan handoff sesi ini.
- `BRAND_IDENTITY.md`: Pedoman identitas brand, tone of voice, dan filosofi kerajinan.
- `ARCHITECTURE.md`: Arsitektur teknis menyeluruh, arsitektur data libSQL, dan Drizzle ORM.
- `DESIGN-SYSTEM.md`: Sistem desain, spesifikasi token warna, tipografi, dan aturan anti-slop.
- `PRD.md`: Spesifikasi kebutuhan produk dan user stories e-commerce ritel.
- `TIMELINE_KP.md`: Roadmap Kerja Praktek, rincian sprint, dan rencana simulasi pembayaran Midtrans.
- `DEPLOY.md`: Panduan deployment Vercel dan Turso cloud.

---

## 3. Daftar File yang Diubah pada Sesi Ini

- `opt1/locales/en.json`: Kamus bahasa Inggris untuk header, nav, drawer, dan deskripsi produk.
- `opt1/locales/id.json`: Kamus bahasa Indonesia dengan penyesuaian istilah "Pesanan Kustom" dan "Keranjang".
- `opt1/lib/i18n.ts` & `opt1/lib/i18n.test.ts`: Helper terjemahan dan unit test suite i18n.
- `opt1/lib/currency.ts` & `opt1/lib/currency.test.ts`: Formatter mata uang IDR/USD dan unit test suite currency.
- `opt1/context/LanguageContext.tsx`: Context provider bahasa dengan penyimpanan ganda localStorage + cookie.
- `opt1/context/CurrencyContext.tsx`: Context provider mata uang dengan penyimpanan ganda localStorage + cookie.
- `opt1/components/site/LocaleCurrencySwitcher.tsx`: Komponen switcher interaktif bahasa dan mata uang.
- `opt1/components/landing/ArtfuliLanding.tsx`: Integrasi switcher, translation hooks pada header, mobile drawer, dan cart drawer.
- `opt1/app/landing.css`: Penguncian dimensi slot navigasi dan CTA group untuk eliminasi 100% layout shift.
- `opt1/app/layout.tsx`: Penyertaan LanguageProvider dan CurrencyProvider pada root app layout.
- `HANDOFF.md`: Pembaruan status checkpoint penutupan sesi.

---

## 4. Next Action (Langkah Selanjutnya)

Lanjutkan pengerjaan **ART-21** (*Product Catalogue & Collections Showcase*) pada storefront untuk memuat katalog perhiasan kriya Bali berbasis data produk Turso libSQL.
