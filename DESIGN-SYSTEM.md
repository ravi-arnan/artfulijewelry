# Artfuli Jewelry: Design System & UI Specifications

## 1. Semantic Color Palette
Harmonisasi antara warna resmi logo Artfuli (Deep Royal Plum `#551F51` dan Balinese Turquoise `#2BA89B`) dengan permukaan kanvas hangat (Warm Bone Stone dan Warm Sandstone Ivory) serta aksen logam mulia perhiasan.

| Token Name | CSS Variable | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Warm Bone Stone** | `--ground-stone` | `#F5F3EF` | Main page background, primary editorial canvas |
| **Warm Sandstone Ivory** | `--ground-sand` | `#F4EFE6` | Product card background, section alternation, drawers |
| **Royal Plum Dusk** | `--ground-plum` | `#18111B` | Deep atmospheric ground (dark mode / twilight footer) |
| **Deep Obsidian Ink** | `--ink-dark` | `#151218` | Primary headings, body copy |
| **Charcoal Mauve** | `--ink-muted` | `#554D5D` | Subtitles, editorial captions, secondary notes |
| **Pure Light Cream** | `--ink-light` | `#FAF8F5` | Headings and text on dark ground |
| **Soft Lilac Slate** | `--ink-light-muted` | `#B8B0C0` | Secondary text on dark ground |
| **Royal Atelier Plum** | `--brand-plum` | `#551F51` | Primary CTA buttons, active state indicators |
| **Royal Plum Hover** | `--brand-plum-hover`| `#3F153C` | Hover state for primary buttons |
| **Balinese Turquoise** | `--accent-cyan` | `#2BA89B` | Official spiral emblem accent, assay verified marks |
| **Champagne Gold** | `--brand-gold` | `#C5A059` | 18k Vermeil badges, prices, gold metal highlights |
| **Sterling Mist** | `--accent-silver` | `#D8D8D6` | 925 Sterling Silver material swatch indicator |

---

## 2. Master Brand Assets & Dimensions
- **Circular Balinese Spiral Emblem**: `artfuli-emblem.png` (unclipped, tinggi 52px).
- **Official Calligraphic Wordmark**: `artfuli-wordmark.png` (warna gelap) dan `artfuli-wordmark-white.png` (warna putih), tinggi 44px–48px.
- **Header Navigation Bar**:
  - Tinggi total: 92px.
  - Sticky dengan background semi-transparan (`rgba(245, 243, 239, 0.94)`) dan backdrop filter blur ringan.
  - Teks navigasi: 15px, font sans-serif berbobot 500, sentence-case.
  - Tombol aksi utama: Royal Plum `#551F51` dengan padding 12px 28px.

---

## 3. Typography Scale (Few Sizes, Far Apart)
Mengikuti kaidah TasteSkill v2 untuk menghindari kekacauan ukuran font:

- **Editorial Display Font (`--font-serif`)**: `'Cormorant Garamond', Georgia, serif`
  - Digunakan untuk Headline Hero, judul section utama, dan nama perhiasan edisi terbatas.
- **UI & Body Font (`--font-sans`)**: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
  - Digunakan untuk navigasi, deskripsi perhiasan, tombol aksi, dan daftar direktori footer.

| Role | Ukuran (Desktop / Mobile) | Line Height | Tracking | Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `clamp(2.75rem, 5vw, 4.5rem)` | `1.05` | `-0.02em` | `400` (Regular) |
| **Section Heading (H2)**| `clamp(2rem, 3.2vw, 2.75rem)` | `1.15` | `-0.01em` | `400` (Regular) |
| **Subhead (H3)** | `1.25rem` (20px) / `1.125rem` (18px) | `1.3` | `0em` | `500` (Medium) |
| **Directory Heading** | `0.9375rem` (15px) | `1.4` | `0.02em` | `600` (Sentence-case) |
| **Body Regular** | `1rem` (16px) | `1.6` | `0em` | `400` |
| **Caption / Legal** | `0.875rem` (14px) | `1.5` | `0.01em` | `400` |

---

## 4. Anti-Slop Guidelines (TasteSkill v2 Compliance)
Untuk memastikan situs tetap otentik, mewah, dan bebas dari stereotip AI:

1. **Dilarang Menggunakan Decorative Status Dots**: Tidak ada pulsing green dot "Available" atau "Open" buatan.
2. **Dilarang Menampilkan Local Time / Weather Strips**: Widget jam lokal ("15:20 WITA") dihilangkan dari footer karena merupakan *agency tell*.
3. **Dilarang Menaruh Floating Badge Pills di Atas Foto**: Fotografi perhiasan tidak boleh ditimpa kartu kaca, badge, atau tag mengambang.
4. **Dilarang Menggunakan Micro-Labels Serba Kapital**: Judul kolom dan navigasi menggunakan sentence-case yang wajar, bukan kapital renggang berlebihan.
5. **Dilarang Menggunakan Garis Pemisah Tipis 1px (Hairline Dividers)**: Pemisahan antar elemen mengandalkan ruang (whitespace), ritme proporsional, atau pergantian bidang warna.
6. **Dilarang Menggunakan Bayangan Tombol (Box-Shadow)**: Tombol utama menggunakan flat fill satu warna.
7. **Dilarang Memakai Em Dash (`—`)**: Gunakan tanda titik, koma, atau tanda kurung.
8. **Dilarang Menggunakan Emoji**: Gunakan ikon Lucide bergaris tipis bila dibutuhkan secara fungsional.

---

## 5. Footer Architecture (Leedlime Soft Blend Standard)
Mengacu pada arsitektur referensi `footer.design/sites/leedlime`:

- **Upper Directory**: Grid 4 kolom (Brand + The Collections + The Atelier + Client Care) dengan jarak renggang (`gap: 64px`).
- **Utility Row**: Teks hak cipta dan aksi (*Consult Atelier* & *Back to top*) berada tepat di atas foto tanpa garis 1px pemisah.
- **Panoramic Jewelry Artwork**:
  - Foto perhiasan resolusi tinggi membentang 100% lebar layar di bagian dasar (`clamp(380px, 42vw, 560px)`).
  - Menggunakan CSS multi-stop feathered gradient mask (`mask-image: linear-gradient(...)`) dipadu dengan neutral scrim yang menyatu lembut (*soft blend*) ke warna latar belakang kanvas tanpa batas potong kaku.