# Artfuli Jewelry: GSAP Interactive Preview Lab

Folder ini disiapkan khusus untuk eksperimen visual, animasi GSAP v3, dan pengujian perbandingan konsep antarmuka sebelum diintegrasikan penuh ke Next.js App Router.

---

## 1. Menjalankan Server Preview

Server preview menggunakan native Node.js HTTP server (tanpa overhead build atau dependensi berat):

```bash
nice -n 19 node preview/server.mjs
```

Akses di browser pada:
`http://localhost:3002`

---

## 2. Fitur & Pengujian Interaktif yang Tersedia

Di bagian atas layar terdapat **Floating Control Bar**:

1. **Hero Concept Switcher**:
   - `Split Editorial`: Menguji format layout dua kolom (tipografi Cormorant Garamond di kiri + reveal curtain foto lookbook di kanan via GSAP clip-path timeline).
   - `Full-Bleed`: Menguji format sinematik layar penuh dengan zoom lembut (ambient scale-down) dan teks mengambang di tengah.
2. **Storytelling Switcher (Celuk Heritage)**:
   - `Parallax`: Menguji kedalaman scroll foto master artisan Celuk dengan efek parallax halus via `ScrollTrigger.scrub`.
   - `Pinned Step`: Menguji efek pinning di mana halaman tertahan sejenak saat poin teknik kriya (Jawan, Cold Forging, Direct Atelier) berpindah fokus.
3. **Sticky Header Transition**:
   - Menguji transisi header dari transparan menjadi glassmorphic Warm Cream (`#FAF7F2` blur 16px) dengan border halus saat melewati batas hero.
4. **Collections Stagger**:
   - Menguji entrance animasi kartu kategori produk saat memasuki viewport.
5. **Assay Transparency Numbers & Meter**:
   - Menguji counter angka kemurnian 925 Silver dan 18k Vermeil beserta meter fill bar via GSAP.
