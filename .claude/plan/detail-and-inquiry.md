# Plan: Product detail page + wholesale inquiry flow + motion + responsive

Workflow: /multi-frontend (Claude-led, code-architect agent for ideation).
Inquiry UI decision: dedicated `/inquiry` page only (no drawer). Adds update state +
Header count badge; no forced navigation on add.

## New files
- `lib/inquiry.ts` — InquiryItem type, buildWhatsAppHref, buildMailtoHref.
- `context/InquiryContext.tsx` — InquiryProvider, useInquiry, reducer (ADD/SET_QTY/REMOVE/CLEAR,
  qty clamped to minOrder), localStorage sync in effect.
- `hooks/useReveal.ts`, `components/ui/RevealWrapper.tsx` — IntersectionObserver reveal reusing `.rise`.
- `app/shop/[id]/page.tsx` — server: generateStaticParams, generateMetadata, JSON-LD, notFound().
- `components/product/{ProductGallery,ProductMeta,ProductInquiryCTA,ProductRelated}.tsx`.
- `app/inquiry/page.tsx`, `components/inquiry/{InquiryPageClient,InquiryLineItem,InquirySubmitButtons}.tsx`.

## Modified
- `lib/data.ts` — getProductById.
- `app/layout.tsx` — wrap in InquiryProvider.
- `components/ui/ProductCard.tsx` — Link to /shop/[id] + client Add-to-inquiry button.
- `components/site/Header.tsx` — inquiry count badge → /inquiry.
- `components/home/{FeaturedProducts,ValueProps,CategoryShowcase}.tsx` — RevealWrapper.
- Responsive: ShopCatalog mobile filters + sort wrap; CategoryShowcase line-clamp; Header mobile grid; ProductCard line-clamp.

## Verify
tsc + eslint + build; screenshots 320/768/1440 of /, /shop, /shop/[id], /inquiry.
