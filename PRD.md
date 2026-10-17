# Product Requirements Document (PRD): Artfuli Jewelry E-Commerce Platform

## 1. Target Buyer Personas
| Persona | Profile & Needs | Key Site Features Used |
| :--- | :--- | :--- |
| **1. Fine Jewelry Lover** | Discerning buyer seeking durable 925 silver and 18k vermeil staples for daily layering. Values skin-safe metals and weight specs. | Collections Grid, Material Filter, XRF Transparency Section, Wishlist. |
| **2. Intentional Gift Buyer** | Purchasing for a milestone. Needs certainty on sizing, packaging presentation, and fast human guidance. | Ring Sizer Guide, Multi-angle PDP Gallery, Instant WhatsApp Concierge. |
| **3. Custom Jewelry Seeker** | Individual or designer wanting a bespoke signet, engagement setting, or one-of-a-kind wax cast piece. | Atelier Services Section, Custom 3D Inquiry Form, Direct Spec Upload/Email. |
| **4. Wholesale / B2B Client** | Independent boutique or jewelry label seeking reliable ethical manufacturing in Celuk, Bali. | Atelier Services (Wholesale Partnership), MOQ & Assay Standards Overview, B2B Concierge. |

## 2. Priority Feature Matrix
| Priority | Feature Module | Description |
| :--- | :--- | :--- |
| **P0 (Core)** | **Editorial Storefront** | Lookbook Hero, Visual Collections Grid (Rings, Necklaces, Earrings, Bracelets, Men's, Fine Gold Vermeil), Celuk Heritage narrative, Materials & XRF Transparency, and Atelier Services. |
| **P0 (Core)** | **Authentic Local Asset Engine** | Deterministic mapping to authentic images in `old/images/produk/` with zero broken links and graceful fallback handling. |
| **P0 (Core)** | **Luxury Product Detail Page (PDP)** | Multi-angle image gallery, Material/Finish selector (925 Sterling Silver vs. 18k Gold Vermeil), interactive Ring Sizer Guide modal, exact gram weight and millimeter dimensions. |
| **P0 (Core)** | **Cart Drawer & Wishlist** | Slide-over Cart Drawer with subtotal calculation, quantity controls, and direct checkout/concierge dispatch; persistent Wishlist drawer/view. |
| **P0 (Core)** | **Concierge & Inquiry System** | Contextual WhatsApp integration (pre-populated with product SKU, selected material, and ring size) and direct email dispatch to `care@artfulijewelry.com`. |
| **P1 (Enhanced)** | **Supabase Catalog & Inquiry Persistence** | Database tables for catalog items, saved wishlists, and submitted bespoke/wholesale inquiries (adopting patterns from `opt1/`). |

## 3. Core User Journeys
1. **Discovery to Acquisition**:
   User lands on Editorial Storefront -> Browses "Fine Gold Vermeil" or "Rings" -> Opens PDP -> Reviews multi-angle photos and XRF purity badge -> Checks size via interactive Ring Sizer Guide -> Selects "18k Gold Vermeil" and "US Size 6" -> Adds to Cart Drawer -> Proceeds to Order Checkout or Instant WhatsApp Concierge Finalization.
2. **Bespoke / Wholesale Consultation**:
   User navigates to "Atelier Services" -> Reviews 3D CAD and Lost-Wax Casting capabilities -> Selects inquiry type (Custom Piece or Wholesale Partnership) -> Submits brief via Concierge Drawer or initiates pre-formatted communication with `care@artfulijewelry.com`.

## 4. Page-by-Page Acceptance Criteria

### A. Editorial Storefront (`/`)
- [ ] **Header Navigation**: Sticky glassmorphic warm-cream header featuring links to Shop, Collections, Celuk Atelier, Materials, Atelier Services, Wishlist counter, and Cart Drawer trigger.
- [ ] **Hero Lookbook**: Full-bleed editorial split or overlay layout using high-resolution craft/product imagery from `old/images/produk/`, serif headline, and dual CTAs ("Explore Collection" and "The Celuk Atelier").
- [ ] **Shop & Collections Grid**: Visual category cards for `Rings`, `Necklaces`, `Earrings`, `Bracelets`, `Men's`, and `Fine Gold Vermeil`, each displaying curated authentic photography and item counts.
- [ ] **Our Heritage / Celuk Atelier Section**: Editorial storytelling highlighting traditional Balinese silversmithing, granulation, and hand-finishing with process imagery from the local archive.
- [ ] **Materials & Transparency Section**: Clear breakdown comparing 925 Sterling Silver, 18k Gold Vermeil (2.5+ microns), and XRF Assay Verification standards.
- [ ] **Atelier Services Section**: Dedicated structured showcase for Custom 3D Design, Precious Metal Casting, and Wholesale Partnerships with direct inquiry triggers.

### B. Catalog & Collection View (`/collections` & `/collections/[category]`)
- [ ] Filterable by Category (`rings`, `necklaces`, `earrings`, `bracelets`, `mens`, `vermeil`) and Material (`925 Sterling Silver`, `18k Gold Vermeil`).
- [ ] Every product card displays a primary image, hover secondary image (from `old/images/produk/`), title, material badge, price, and quick-wishlist toggle.

### C. Product Detail Page (`/products/[slug]`)
- [ ] Multi-angle gallery using authentic local product photos.
- [ ] Interactive Material Selector (`925 Sterling Silver`, `18k Gold Vermeil`) that dynamically updates SKU and price.
- [ ] Ring Size selector (`US 5` through `US 11`) with an interactive **Ring Sizer Guide** modal containing millimeter circumference and diameter conversion tables.
- [ ] Technical Specifications accordion: Metal Purity (XRF Verified), Weight (grams), Band Width / Dimensions (mm), and Origin (Celuk Atelier, Bali).
- [ ] Dual action buttons: "Add to Bag" (opens Cart Drawer) and "Inquire via Concierge" (opens pre-filled WhatsApp / `care@artfulijewelry.com` options).