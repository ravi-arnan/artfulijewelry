# Artfuli Jewelry (Next.js 16 Application)

Aplikasi Next.js 16 App Router untuk storefront editorial dan sistem e-commerce ritel Artfuli Jewelry.

Dokumentasi lengkap proyek, arsitektur, dan panduan Kerja Praktek (KP) tersedia di root repository:
- Master Documentation: [../README.md](../README.md)
- Timeline & Roadmap KP: [../TIMELINE_KP.md](../TIMELINE_KP.md)
- Spesifikasi Arsitektur: [../ARCHITECTURE.md](../ARCHITECTURE.md)
- Panduan Deployment: [../DEPLOY.md](../DEPLOY.md)

---

## Menjalankan Aplikasi di Lokal

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Development
```bash
nice -n 19 npm run dev
```
Buka browser pada `http://localhost:3000`.  
*(Gunakan selalu webpack dev sesuai script `package.json` untuk menjaga kestabilan laptop).*

### 3. Operasi Database Turso (libSQL) & Drizzle ORM
Database otomatis memakai SQLite lokal `file:local.db` saat variabel `TURSO_DATABASE_URL` belum diset:

```bash
# Push schema Drizzle ke database lokal/cloud
nice -n 19 npx drizzle-kit push

# Generate migration SQL
nice -n 19 npx drizzle-kit generate

# Buka Drizzle Studio web GUI
nice -n 19 npx drizzle-kit studio
```

### 4. Menjalankan Unit Test
```bash
nice -n 19 npm test
```

### 5. Memeriksa Tipe TypeScript
```bash
nice -n 19 npx tsc --noEmit
```
