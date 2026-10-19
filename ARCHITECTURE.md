# Technical Architecture: Artfuli Jewelry (`artfulijewelry.com`)

## 1. Guiding Engineering Principles
1. **Lazy Senior Dev Philosophy**: Favor native web platform capabilities (semantic HTML `<dialog>`, CSS transitions, URL search params, `localStorage` synchronization) over bloated third-party state or animation libraries.
2. **Server-First Rendering**: Next.js App Router Server Components handle all catalog reads, SEO metadata, and static page structure. Client Components (`"use client"`) are strictly isolated to interactive leaves.
3. **Thermal Guard Compliance**: Every build, test, typecheck, and dev server script is executed under CPU scheduling priority `nice -n 19` and uses `--webpack` for development stability.

## 2. Folder Structure (Adopted & Refined from `opt1/`)
```text
src/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, Cart/Wishlist Provider, Header & Footer
│   ├── page.tsx                    # Editorial Storefront (Hero, Collections, Heritage, Materials, Atelier)
│   ├── collections/
│   │   └── page.tsx                # Full filterable catalog view
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx            # Luxury PDP with multi-angle gallery, Ring Sizer, Specs
│   └── api/
│       └── inquiry/
│           └── route.ts            # Concierge & Atelier custom/wholesale inquiry endpoint
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Navigation, Collection links, Cart & Wishlist triggers
│   │   ├── Footer.tsx              # Editorial footer, Celuk address, care@artfulijewelry.com
│   │   ├── CartDrawer.tsx          # Client slide-over cart with WhatsApp/Email checkout
│   │   └── WishlistDrawer.tsx      # Client slide-over saved pieces drawer
│   ├── product/
│   │   ├── ProductCard.tsx         # Lookbook product card with authentic local image
│   │   ├── ProductGallery.tsx      # Multi-angle thumbnail + main viewer
│   │   ├── ProductInteractive.tsx  # Material finish selector, ring size selector, Add to Bag
│   │   └── RingSizerModal.tsx      # Interactive US/MM circumference & measurement guide
│   └── atelier/
│       └── AtelierInquiryModal.tsx # Custom 3D casting & wholesale consultation form
├── context/
│   └── StoreContext.tsx            # Lightweight React 19 Context for Cart & Wishlist persistence
├── data/
│   └── catalog-manifest.ts         # Curated products mapped to verified photos in old/images/produk/
├── lib/
│   ├── db/                         # Turso libSQL client & Drizzle ORM schema
│   │   ├── client.ts               # @libsql/client edge connection
│   │   └── schema.ts               # Drizzle schema (products, orders, items, addresses)
│   ├── midtrans.ts                 # Midtrans Snap & webhook verification helper
│   ├── concierge.ts                # WhatsApp URL generator & mailto:care@artfulijewelry.com formatter
│   └── utils.ts                    # Currency formatting, className merger
└── types/
    └── jewelry.ts                  # Strict TypeScript interfaces for Products, Variants, Inquiries