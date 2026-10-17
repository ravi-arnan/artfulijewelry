# Bali Handmade — Original Website Clone (bali-handmade.com)

Kloning lengkap offline dari website asli **bali-handmade.com/shop** (Wholesale 925 Sterling Silver Beads & Findings, est. 2004).

## Struktur Folder
- `home.html` / `index.html`: Halaman beranda utama
- `category/`: Halaman kategori utama (Silver, Bronze, Fine Jewelry, dsb.)
- `subcategory/`: Halaman subkategori
- `lastcategory/`: Halaman leaf category lengkap dengan paginasi
- `detail-<ID>.html`: Halaman katalog detail produk (1.600+ varian produk)
- `images/produk/`: Seluruh foto produk asli
- `images/`: Aset logo, banner, dan UI ikon
- `css/`: Stylesheet asli (styles.css, animate.css, reset.css, base.css, dsb.)
- `js/`: jQuery, zoom viewer, dan script kustom

## Cara Menjalankan
Buka `index.html` atau `home.html` langsung di browser, atau jalankan server lokal:
```bash
# Menggunakan npx serve
npx serve -p 3001 .

# Atau menggunakan Python 3
python3 -m http.server 3001
```
Akses di browser: http://localhost:3001
