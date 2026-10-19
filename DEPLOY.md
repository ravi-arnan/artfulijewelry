# Panduan Deployment Vercel & Supabase

> Project: **Artfuli Jewelry** (`artfulijewelry`)  
> Repository: `https://github.com/ravi-arnan/artfulijewelry`  
> Domain Produksi: `https://artfulijewelry.com`  

---

## 1. Konfigurasi Vercel

Aplikasi Next.js saat ini berada di subfolder `opt1/`. Karena itu, konfigurasi di Vercel wajib menggunakan **Root Directory** = `opt1`.

### Pengaturan Proyek di Vercel Dashboard:
- **Framework Preset**: Next.js
- **Root Directory**: `opt1`
- **Build Command**: `next build`
- **Output Directory**: Next.js default (`.next`)
- **Node.js Version**: 24.x (atau 22.x LTS)

### Deploy via Vercel CLI:
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## 2. Environment Variables (Wajib)

Masukkan variabel lingkungan berikut pada menu **Project Settings > Environment Variables** di Vercel untuk environment *Preview* dan *Production*. Nilai referensi dapat dicek di `opt1/.env.local.example`:

| Variabel | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL publik proyek Supabase Anda |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key Supabase untuk akses client-side |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (hanya server, untuk aksi admin, jangan expose ke client) |

> Tanpa variabel di atas, aplikasi tetap dapat build menggunakan fallback katalog statis, namun otentikasi akun dan fitur admin tidak akan aktif.

---

## 3. Konfigurasi Auth Redirect URL (Supabase & Google OAuth)

Setelah domain produksi atau domain preview Vercel diketahui:

1. **Supabase Dashboard**:
   - Menu **Authentication > URL Configuration > Redirect URLs**:
     - Tambahkan: `https://YOUR_DOMAIN/auth/callback`
     - Tambahkan URL preview Vercel jika ingin menguji Google sign-in di preview.
   - Set **Site URL**: `https://YOUR_DOMAIN`

2. **Google Cloud Console (OAuth Client)**:
   - Supabase callback URL default: `https://dlpehfmzzwqlwbzwikza.supabase.co/auth/v1/callback`
   - Pastikan URI redirect di atas sudah terdaftar di Google OAuth Client ID Anda.

---

## 4. Verifikasi Pasca Deploy

Lakukan pengecekan checklist setelah deployment berstatus Ready:
- [ ] Buka beranda (`/`) dan pastikan seluruh visual dan navigasi render sempurna.
- [ ] Buka katalog produk (`/shop`) dan detail produk (`/shop/[id]`).
- [ ] Uji login/signup via Google di `/login`.
- [ ] Periksa endpoint SEO:
  - `https://YOUR_DOMAIN/sitemap.xml`
  - `https://YOUR_DOMAIN/robots.txt`
  - `https://YOUR_DOMAIN/opengraph-image`
