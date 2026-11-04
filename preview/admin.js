(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const TOKEN_KEY = "artfuli_admin_token";

  // =========================================================================
  // FEATURE FLAG: PRODUCT CATALOG ADMIN MODULE
  // Ubah CATALOG_ENABLED menjadi `true` ketika halaman Catalog Product di
  // website utama sudah selesai dibuat. Selama bernilai `false`, halaman
  // admin Product Catalog tetap dapat dilihat strukturnya namun seluruh
  // input dan tombol aksinya dikunci (dinonaktifkan).
  // =========================================================================
  const CATALOG_ENABLED = false;

  let token = sessionStorage.getItem(TOKEN_KEY) || "";
  let content = null;
  let savedSnapshot = "";
  let view = "hero";
  let pendingUploadPath = null;
  let catalogFilterCategory = "all";
  let catalogSearchQuery = "";

  const CATALOG_CATEGORIES = [
    { value: "rings", label: "Rings & Bands" },
    { value: "necklaces", label: "Chains & Pendants" },
    { value: "earrings", label: "Sculptural Earrings" },
    { value: "bracelets", label: "Cuffs & Bangles" },
    { value: "mens", label: "Men's Signets" },
    { value: "vermeil", label: "Fine Gold Vermeil" }
  ];

  const CATALOG_STATUSES = [
    { value: "in_stock", label: "In Stock · Ready to Ship" },
    { value: "made_to_order", label: "Made to Order (5–7 Days)" },
    { value: "archival", label: "Archival · Custom Inquiry Only" }
  ];

  const STAGED_CATALOG_ITEMS = [
    {
      sku: "AJ-RNG-014",
      title: "Subak Architectural Signet",
      category: "rings",
      status: "in_stock",
      alloy: "925 Sterling Silver & 18k Gold Vermeil",
      baseWeight: 11.4,
      dimensions: "8.5 mm band width · 2.2 mm wall",
      silverPrice: 165,
      vermeilPrice: 215,
      moq: 1,
      featured: true,
      isNew: false,
      xrfVerified: true,
      image: "images/bench-signet.webp",
      hoverImage: "images/edition-rings.webp",
      description: "Hand-forged in Bali with a solid inner gallery and river-agate burnished bevels."
    },
    {
      sku: "AJ-PND-009",
      title: "Amethyst Druzy & Botanical Collar",
      category: "necklaces",
      status: "in_stock",
      alloy: "925 Sterling Silver & 18k Gold Vermeil",
      baseWeight: 22.8,
      dimensions: "42 cm collar · 28 mm bezel drop",
      silverPrice: 240,
      vermeilPrice: 310,
      moq: 1,
      featured: true,
      isNew: true,
      xrfVerified: true,
      image: "images/bench-pendant.webp",
      hoverImage: "images/edition-pendants.webp",
      description: "Lost-wax botanical collar set with raw crystalline amethyst druzy and solid sterling clasp."
    },
    {
      sku: "AJ-EAR-028",
      title: "Jawan Botanical Drop Earrings",
      category: "earrings",
      status: "in_stock",
      alloy: "925 Sterling Silver & 18k Gold Vermeil",
      baseWeight: 8.6,
      dimensions: "34 mm drop length · 0.9 mm post",
      silverPrice: 145,
      vermeilPrice: 190,
      moq: 1,
      featured: true,
      isNew: false,
      xrfVerified: true,
      image: "images/bench-earrings.webp",
      hoverImage: "images/edition-earrings.webp",
      description: "Sculptural openwork drops with traditional Balinese jawan micro-granulation and hypoallergenic posts."
    },
    {
      sku: "AJ-CUF-004",
      title: "Klotok Heavy Wrist Cuff",
      category: "bracelets",
      status: "made_to_order",
      alloy: "925 Sterling Silver & 18k Gold Vermeil",
      baseWeight: 38.5,
      dimensions: "64 mm inner span · 12 mm profile",
      silverPrice: 320,
      vermeilPrice: 410,
      moq: 1,
      featured: false,
      isNew: false,
      xrfVerified: true,
      image: "images/bench-cuff.webp",
      hoverImage: "images/edition-cuffs.webp",
      description: "Cold-hammered solid ingot wrist cuff tension-forged for structural permanence."
    }
  ];

  const VIEWS = {
    hero: {
      crumb: "Hero & Announcement",
      title: "Hero & Announcement",
      sub: "First visual impression: top announcement banner, headline typography, metallurgical proof points, and lookbook shutter photos.",
      render: renderHero
    },
    collections: {
      crumb: "Signature Collections",
      title: "Signature Collections Showcase",
      sub: "Curated archival silhouettes shown in the editorial mosaic. Order here dynamically matches the front-page mosaic.",
      render: renderCollections
    },
    bench: {
      crumb: "Assay Bench & Sizing",
      title: "Interactive Assay Bench & Sizing Simulator",
      sub: "Live jewelry configurator pieces, grams, 925 silver vs 18k vermeil pricing, and millimeter ring size calibration.",
      render: renderBench
    },
    heritage: {
      crumb: "Heritage & Craft Story",
      title: "Balinese Heritage Narrative & Figures",
      sub: "Historical storytelling of Balinese metallurgy, workshop blockquote statement, animated counter figures, and foundry photography.",
      render: renderHeritage
    },
    assay: {
      crumb: "XRF & Material Specs",
      title: "Laboratory XRF Assay Matrix",
      sub: "Non-destructive spectrometry specs for 925 Sterling Silver, 18k Vermeil (2.5 µm), Hypoallergenic safety, and Hard Solder.",
      render: renderAssay
    },
    lookbook: {
      crumb: "Editorial Lookbook",
      title: "Editorial Lookbook Gallery",
      sub: "High-resolution triptych plates photographed in tropical Bali daylight across volcanic stone and natural textiles.",
      render: renderLookbook
    },
    guarantee: {
      crumb: "100-Year Guarantee",
      title: "Provenance & 100-Year Structural Care",
      sub: "Lifetime structural forging warranty, certified recycled precious metals sourcing, and atelier re-vermeil maintenance.",
      render: renderGuarantee
    },
    contact: {
      crumb: "Contact & Concierge",
      title: "Client Care & Atelier Footer",
      sub: "Direct WhatsApp concierge number (updates all buttons across the entire site), official inquiry email, and atelier address.",
      render: renderContact
    },
    catalog: {
      crumb: "Catalog & Inventory / Product Catalog",
      title: "Product Catalog Management",
      sub: "Central SKU registry, category taxonomy, 925 sterling silver & 18k vermeil pricing, gram weights, and product photography.",
      render: renderCatalog
    }
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const get = (p) => p.split(".").reduce((o, k) => (o == null ? o : o[k]), content);
  const set = (p, v) => {
    const keys = p.split(".");
    const last = keys.pop();
    keys.reduce((o, k) => o[k], content)[last] = v;
  };
  const isDirty = () => content && JSON.stringify(content) !== savedSnapshot;

  /* ---------- Field builders ---------- */
  function fText(path, label, opt = {}) {
    const v = opt.value !== undefined ? opt.value : get(path);
    const control = opt.rows
      ? `<textarea data-path="${path}" rows="${opt.rows}">${esc(v)}</textarea>`
      : `<input type="text" data-path="${path}" value="${esc(v)}"${opt.inputmode ? ` inputmode="${opt.inputmode}"` : ""}>`;
    return `<label class="field${opt.wide ? " wide" : ""}"><span class="field-label">${label}</span>${control}${opt.hint ? `<span class="field-hint">${opt.hint}</span>` : ""}</label>`;
  }

  function fNum(path, label, opt = {}) {
    const v = opt.value !== undefined ? opt.value : get(path);
    return `<label class="field${opt.wide ? " wide" : ""}"><span class="field-label">${label}</span><input type="number" data-path="${path}" data-type="number" step="${opt.step || "any"}" min="0" value="${esc(v)}">${opt.hint ? `<span class="field-hint">${opt.hint}</span>` : ""}</label>`;
  }

  function fSelect(path, label, options, opt = {}) {
    const v = opt.value !== undefined ? opt.value : get(path);
    const optsHtml = options.map((o) => `<option value="${esc(o.value)}"${o.value === v ? " selected" : ""}>${esc(o.label)}</option>`).join("");
    return `<label class="field${opt.wide ? " wide" : ""}"><span class="field-label">${label}</span><select data-path="${path}">${optsHtml}</select>${opt.hint ? `<span class="field-hint">${opt.hint}</span>` : ""}</label>`;
  }

  function fCheck(path, label, opt = {}) {
    const checked = opt.value !== undefined ? Boolean(opt.value) : Boolean(get(path));
    return `<label class="check-field"><input type="checkbox" data-path="${path}" data-type="checkbox"${checked ? " checked" : ""}><span>${label}</span></label>`;
  }

  function fImage(path, label, opt = {}) {
    const v = (opt.value !== undefined ? opt.value : get(path)) || "";
    return `<div class="field wide"><span class="field-label">${label}</span>
      <div class="image-row">
        <img class="thumb" src="${esc(v ? "/" + v : "")}" alt="">
        <div class="field-input"><input type="text" data-path="${path}" data-image="1" value="${esc(v)}" aria-label="${label} path"></div>
        <button type="button" class="mini-btn" data-action="upload" data-path="${path}">Upload Photo</button>
      </div></div>`;
  }

  const card = (title, note, body, tools = "") =>
    `<section class="card"><div class="card-head"><div><h3 class="card-title">${title}</h3>${note ? `<p class="card-note">${note}</p>` : ""}</div>${tools}</div>${body}</section>`;

  /* ---------- 1. Hero & Announcement ---------- */
  function renderHero() {
    const facts = get("hero.facts") || [];
    const badgePanels = facts.map((_, i) => `
      <div class="subcard">
        <div class="subcard-head">
          <span class="subcard-title">Proof Badge 0${i + 1}</span>
        </div>
        ${fText(`hero.facts.${i}.title`, `Badge ${i + 1} Headline`)}
        ${fText(`hero.facts.${i}.note`, `Badge ${i + 1} Supporting Detail`, { rows: 2 })}
      </div>`).join("");

    return [
      card("Announcement Bar", "A discreet top ticker bar above the sticky header. Activate for shipping offers or new batch alerts.",
        `<div class="grid-2">${fCheck("announcement.enabled", "Display Top Announcement Bar on Live Storefront")}
          ${fText("announcement.text", "Message Text", { wide: true })}
          ${fText("announcement.linkLabel", "Action Link Label", { hint: "Short CTA text displayed next to the message." })}
          ${fText("announcement.linkUrl", "Action Link Target", { hint: "Page anchor such as #bespoke or external URL." })}</div>`),
      card("Headline & Editorial Copy", "Strict 2-line display headline with supporting craft summary.",
        `<div class="grid-2">${fText("hero.line1", "Headline, Line 1")}${fText("hero.line2", "Headline, Line 2")}
          ${fText("hero.subtext", "Supporting Lead Paragraph", { rows: 3, wide: true, hint: "Recommended length: 15 to 25 words." })}
          ${fText("hero.primaryCta", "Primary Action Button")}${fText("hero.secondaryCta", "Secondary Action Button")}</div>`),
      card("Proof Points (Metallurgy Badges)", "Two certified claims displayed side-by-side beneath the action buttons.",
        `<div class="grid-2">${badgePanels}</div>`),
      renderHeroSlides()
    ].join("");
  }

  const MAX_SLIDES = 6;
  function renderHeroSlides() {
    const slides = get("hero.slides") || [];
    const addBtn = `<div class="card-tools"><button type="button" class="mini-btn mini-btn-accent" data-action="slide-add"${slides.length >= MAX_SLIDES ? " disabled" : ""}>+ Add Slide (${slides.length}/${MAX_SLIDES})</button></div>`;
    const slideItems = slides.map((s, i) => {
      const p = `hero.slides.${i}`;
      const tools = `<div class="card-tools">
        <button type="button" class="mini-btn" data-action="slide-up" data-index="${i}"${i === 0 ? " disabled" : ""}>Move up</button>
        <button type="button" class="mini-btn" data-action="slide-down" data-index="${i}"${i === slides.length - 1 ? " disabled" : ""}>Move down</button>
        <button type="button" class="mini-btn mini-btn-danger" data-action="slide-remove" data-index="${i}"${slides.length <= 1 ? " disabled" : ""}>Remove</button></div>`;
      return `<div class="subcard">
        <div class="subcard-head">
          <span class="subcard-title">Slide 0${i + 1} · ${esc(s.title || "Untitled")}</span>
          ${tools}
        </div>
        <div class="grid-2">
          ${fText(`${p}.title`, "Slide Title")}
          ${fText(`${p}.subtitle`, "Slide Subtitle")}
          ${fImage(`${p}.image`, "Slide Photo")}
        </div>
      </div>`;
    }).join("");

    return card(
      "Hero Carousel",
      `Full-bleed photographs rotating on the right stage of the storefront hero. ${slides.length} of ${MAX_SLIDES} slides active.`,
      `<div class="subcard-stack">${slideItems}</div>`,
      addBtn
    );
  }

  /* ---------- 2. Collections ---------- */
  function renderCollections() {
    const items = get("collections.items") || [];
    const head = card("Collections Overview", "Section title and introductory text for the Signature Collections showcase.",
      `<div class="grid-2">${fText("collections.heading", "Section Title", { wide: true })}${fText("collections.intro", "Introductory Paragraph", { rows: 3, wide: true })}</div>`);
    const cards = items.map((_, i) => {
      const tools = `<div class="card-tools">
        <button type="button" class="mini-btn" data-action="move-up" data-index="${i}"${i === 0 ? " disabled" : ""}>Move up</button>
        <button type="button" class="mini-btn" data-action="move-down" data-index="${i}"${i === items.length - 1 ? " disabled" : ""}>Move down</button></div>`;
      const p = `collections.items.${i}`;
      return card(`${i + 1}. ${esc(items[i].title)}`, `Connected Simulator Key: ${esc(items[i].benchKey)}`,
        `<div class="grid-2">${fText(`${p}.title`, "Edition Title", { hint: "Displayed as the collection card title." })}${fText(`${p}.meta`, "Specification Line", { hint: "E.g.: 48 Archival Designs · 6.4g to 18.2g" })}
          ${fText(`${p}.description`, "Edition Narrative", { rows: 3, wide: true })}${fImage(`${p}.image`, "Edition Photo")}</div>`, tools);
    }).join("");
    return head + cards;
  }

  /* ---------- 3. Assay Bench ---------- */
  function renderBench() {
    const pieces = get("bench.pieces") || {};
    const pieceCards = Object.keys(pieces).map((key) => {
      const p = `bench.pieces.${key}`;
      return card(esc(pieces[key].label), `Internal Piece Code: ${esc(pieces[key].code)} · Key: ${esc(key)}`,
        `<div class="grid-2">${fText(`${p}.label`, "Selector Button Label")}${fText(`${p}.title`, "Display Title")}
          ${fText(`${p}.code`, "Archive Reference Code")}${fText(`${p}.desc`, "Short Silhouette Description")}
          ${fImage(`${p}.img`, "Silhouette Photo")}</div>
         <div class="card-divider">
           <div class="card-divider-label">Weight &amp; Alloy Pricing Matrix</div>
           <div class="grid-3">
             ${fNum(`${p}.baseWeight`, "Base Weight — US 7 (g)", { hint: "Solid metal reference weight." })}
             ${fNum(`${p}.silverPrice`, "925 Sterling Silver (USD)", { hint: "Base retail price in 925 Ag." })}
             ${fNum(`${p}.vermeilPrice`, "18k Gold Vermeil (USD)", { hint: "Base retail price in 18k Au." })}
           </div>
         </div>`);
    }).join("");
    const sizes = get("bench.sizes") || {};
    const rows = Object.keys(sizes).map((k) => `<tr><td class="size-key">US ${esc(k)}</td>
      <td><input type="text" data-path="bench.sizes.${k}.diameter" value="${esc(sizes[k].diameter)}" aria-label="US ${k} diameter"></td>
      <td><input type="text" data-path="bench.sizes.${k}.circumference" value="${esc(sizes[k].circumference)}" aria-label="US ${k} circumference"></td>
      <td><input type="number" step="0.01" min="0.01" data-type="number" data-path="bench.sizes.${k}.weightFactor" value="${esc(sizes[k].weightFactor)}" aria-label="US ${k} weight factor"></td></tr>`).join("");
    const sizeCard = card("Ring Sizer & Weight Calibration Table", "The weight factor scales base gram weight dynamically based on size. US 7 is 1.00.",
      `<div class="table-wrap"><table class="size-table"><thead><tr><th>US Size</th><th>Inner Diameter</th><th>Circumference</th><th>Weight Factor</th></tr></thead><tbody>${rows}</tbody></table></div>`);
    return pieceCards + sizeCard;
  }

  /* ---------- 4. Heritage & Narrative ---------- */
  function renderHeritage() {
    return [
      card("Atelier Metallurgy Story", "Historical narrative celebrating centuries of Balinese silversmithing.",
        `<div class="grid-2">${fText("heritage.heading", "Section Title", { wide: true })}
          ${fText("heritage.subtext", "First Paragraph (Historical Background)", { rows: 3, wide: true })}
          ${fText("heritage.statement", "Atelier Manifesto Blockquote", { rows: 3, wide: true, hint: "Highlighted in the warm stone callout block." })}
          ${fText("heritage.note", "Second Paragraph (Foundry & Ethical Standards)", { rows: 3, wide: true })}</div>`),
      card("Animated Counter Metrics", "Live figures that count up when scrolled into view.",
        `<div class="grid-3">${fNum("heritage.years", "Centuries / Years Figure", { hint: "Target figure (e.g. 100)." })}
          ${fNum("heritage.artisans", "Master Artisans Figure", { hint: "Target figure (e.g. 32)." })}
          ${fNum("heritage.archiveCount", "Archival Catalog Count", { hint: "Target figure (e.g. 4550)." })}</div>`),
      card("Foundry Photography", "Photograph of Balinese brazier smithing.",
        `<div class="grid-2">${fImage("heritage.image", "Artisan Workshop Photo")}${fText("heritage.caption", "Photo Caption", { rows: 2, wide: true })}</div>`)
    ].join("");
  }

  /* ---------- 5. XRF & Assay Specs ---------- */
  function renderAssay() {
    const asy = get("assay") || {};
    return Object.keys(asy).map((key) => {
      const p = `assay.${key}`;
      const titleLabel = key === "silver" ? "925 Sterling Core" :
                         key === "vermeil" ? "18k Gold Vermeil (2.5 µm)" :
                         key === "hypoallergenic" ? "Hypoallergenic Purity" : "Hard Solder Assay";
      return card(titleLabel, `Laboratory Assay Tab Key: ${esc(key)}`,
        `<div class="grid-2">
          ${fText(`${p}.title`, "Specification Title", { wide: true })}
          ${fText(`${p}.desc`, "Technical Description", { rows: 3, wide: true })}
          ${fText(`${p}.method`, "Laboratory Verification Protocol")}
          ${fText(`${p}.status`, "Assay Badge / Certificate Tag Status")}
          ${fText(`${p}.norm`, "Commercial Scrap / Industry Norm Comparison", { rows: 2, wide: true })}
        </div>`);
    }).join("");
  }

  /* ---------- 6. Lookbook Gallery ---------- */
  function renderLookbook() {
    const lb = get("lookbook") || {};
    const head = card("Lookbook Overview", "Section heading and setting note.",
      `<div class="grid-2">${fText("lookbook.heading", "Heading", { wide: true })}${fText("lookbook.intro", "Introductory Note", { rows: 3, wide: true })}</div>`);
    const plates = (lb.plates || []).map((plate, i) => {
      const p = `lookbook.plates.${i}`;
      return card(`Editorial Plate 0${i + 1}: ${esc(plate.title || "Untitled")}`, `Lookbook Triptych Position #${i + 1}`,
        `<div class="grid-2">
          ${fText(`${p}.title`, "Plate Title", { wide: true })}
          ${fText(`${p}.caption`, "Caption / Archive Note", { rows: 2, wide: true })}
          ${fImage(`${p}.image`, "Editorial Photo")}
        </div>`);
    }).join("");
    return head + plates;
  }

  /* ---------- 7. Guarantee & Care ---------- */
  function renderGuarantee() {
    return [
      card("Provenance & Guarantee Header", "Heading and commitment narrative.",
        `<div class="grid-2">${fText("guarantee.headline", "Headline", { wide: true })}${fText("guarantee.subtext", "Lead Supporting Copy", { rows: 3, wide: true })}</div>`),
      card("100-Year Structural Guarantee Banner", "Lead banner displayed in warm bone stone.",
        `<div class="grid-2">${fText("guarantee.warrantyTitle", "Guarantee Title", { wide: true })}${fText("guarantee.warrantyDesc", "Guarantee Terms", { rows: 3, wide: true })}</div>`),
      card("Secondary Commitments (2 Columns)", "Ethical sourcing and vermeil renewal servicing displayed side-by-side.",
        `<div class="grid-2">
          <div class="subcard">
            <div class="subcard-head"><span class="subcard-title">Left Column · Ethical Sourcing</span></div>
            ${fText("guarantee.recycledTitle", "Commitment Title")}
            ${fText("guarantee.recycledDesc", "Commitment Description (Recycled Metals)", { rows: 3 })}
          </div>
          <div class="subcard">
            <div class="subcard-head"><span class="subcard-title">Right Column · Atelier Care</span></div>
            ${fText("guarantee.renewalTitle", "Commitment Title")}
            ${fText("guarantee.renewalDesc", "Commitment Description (Vermeil Renewal)", { rows: 3 })}
          </div>
        </div>`)
    ].join("");
  }

  /* ---------- 8. Contact & Concierge ---------- */
  function renderContact() {
    return [
      card("Direct Client Concierge", "Central atelier contact channels that dynamically update all inquiry and acquisition buttons across the storefront.",
        `<div class="grid-2">
          ${fText("contact.whatsapp", "WhatsApp Concierge Number", { inputmode: "numeric", hint: "Digits only with country code (e.g. 6281234567890)." })}
          ${fText("contact.email", "Official Concierge Email", { hint: "Direct inquiry & checkout email (e.g. sales@bali-handmade.com)." })}
        </div>`),
      card("Social Channels & Atelier Footer", "Official social profiles and copyright line shown in the storefront footer.",
        `<div class="grid-2">
          ${fText("contact.instagram", "Official Instagram URL", { hint: "Full https:// URL to Instagram profile." })}
          ${fText("contact.facebook", "Official Facebook URL", { hint: "Full https:// URL to Facebook page." })}
          ${fText("contact.address", "Atelier Legal / Copyright Line", { wide: true })}
        </div>`)
    ].join("");
  }

  /* ---------- 9. Product Catalog (Staged / Ready for Storefront Catalog) ---------- */
  function getCatalogItems() {
    if (CATALOG_ENABLED) {
      if (!content.catalog) {
        content.catalog = {
          heading: "Atelier Archival Catalog",
          intro: "Every piece is forged to order or dispatched from our Sukawati vault in solid 925 sterling silver and 2.5-micron 18k gold vermeil.",
          items: JSON.parse(JSON.stringify(STAGED_CATALOG_ITEMS))
        };
      }
      return content.catalog.items || [];
    }
    return (content && content.catalog && content.catalog.items) || STAGED_CATALOG_ITEMS;
  }

  function renderCatalog() {
    const items = getCatalogItems();
    const catHeading = (content?.catalog && content.catalog.heading) || "Atelier Archival Catalog";
    const catIntro = (content?.catalog && content.catalog.intro) || "Every piece is forged in our Bali workshop in solid 925 sterling silver and heavy 2.5-micron 18k gold vermeil, verified via XRF spectrometry.";

    const lockBanner = CATALOG_ENABLED ? "" : `
      <aside class="catalog-lock-banner" role="note" aria-label="Module staged notice">
        <div class="catalog-lock-main">
          <div class="catalog-lock-eyebrow">
            <span class="dot-gold"></span>
            <span>Module Status: Dinonaktifkan Sementara (Staged)</span>
          </div>
          <h3 class="catalog-lock-title">Menunggu Halaman Catalog Product di Website Selesai</h3>
          <p class="catalog-lock-desc">
            Antarmuka manajemen <strong>Product Catalog</strong> di bawah ini sudah disiapkan secara lengkap (pencarian SKU, filter kategori, harga 925 Silver &amp; 18k Vermeil, berat gram, MOQ, serta foto multi-sudut), namun saat ini <strong>dikunci (nonaktif)</strong> agar tidak mengubah data sebelum halaman katalog di storefront selesai dibangun. Setelah halaman katalog siap, ubah konstanta <code>CATALOG_ENABLED = true</code> di <code>preview/admin.js</code> untuk mengaktifkan seluruh fitur.
          </p>
        </div>
        <div class="catalog-lock-badge">Locked · Preview Mode</div>
      </aside>`;

    const inStockCount = items.filter((it) => it.status === "in_stock").length;
    const featuredCount = items.filter((it) => it.featured).length;

    const statsBar = `
      <div class="grid-4">
        <div class="catalog-stat-card">
          <span class="catalog-stat-label">Prepared SKUs</span>
          <span class="catalog-stat-value">${items.length}</span>
          <span class="catalog-stat-note">Ready in admin schema</span>
        </div>
        <div class="catalog-stat-card">
          <span class="catalog-stat-label">Categories</span>
          <span class="catalog-stat-value">${CATALOG_CATEGORIES.length}</span>
          <span class="catalog-stat-note">Rings, Pendants, Earrings, Cuffs</span>
        </div>
        <div class="catalog-stat-card">
          <span class="catalog-stat-label">Ready to Ship</span>
          <span class="catalog-stat-value">${inStockCount} / ${items.length}</span>
          <span class="catalog-stat-note">${featuredCount} marked as Featured</span>
        </div>
        <div class="catalog-stat-card">
          <span class="catalog-stat-label">Storefront Sync</span>
          <span class="catalog-stat-value">${CATALOG_ENABLED ? "Active" : "Staged"}</span>
          <span class="catalog-stat-note">${CATALOG_ENABLED ? "Connected to /catalog" : "Awaiting catalog page"}</span>
        </div>
      </div>`;

    const categoryFilterOptions = [
      { value: "all", label: "All Categories (6)" },
      ...CATALOG_CATEGORIES
    ].map((o) => `<option value="${esc(o.value)}"${o.value === catalogFilterCategory ? " selected" : ""}>${esc(o.label)}</option>`).join("");

    const toolbarCard = card(
      "Catalog Header, Filter & Actions",
      "Configure the main catalog page header or filter SKU cards below by category and keyword.",
      `<div class="grid-2">
        ${fText("catalog.heading", "Catalog Page Heading", { wide: true, value: catHeading })}
        ${fText("catalog.intro", "Catalog Introductory Copy", { rows: 2, wide: true, value: catIntro })}
      </div>
      <div class="card-divider">
        <div class="card-divider-label">Filter &amp; Manage Catalog Items</div>
        <div class="catalog-toolbar">
          <label class="field">
            <span class="field-label">Search by Title or SKU</span>
            <input type="search" id="catalogSearchInput" placeholder="E.g. AJ-RNG-014 or Signet..." value="${esc(catalogSearchQuery)}">
          </label>
          <label class="field">
            <span class="field-label">Filter Category</span>
            <select id="catalogCategoryFilter">${categoryFilterOptions}</select>
          </label>
          <label class="field">
            <span class="field-label">Alloy Standard</span>
            <select>
              <option value="all">All Alloys (925 Ag &amp; 18k Au)</option>
              <option value="silver">925 Sterling Silver</option>
              <option value="vermeil">18k Gold Vermeil (2.5 µm)</option>
            </select>
          </label>
          <button type="button" class="btn btn-primary" data-action="catalog-add">+ Add New Product</button>
        </div>
      </div>`
    );

    const visibleItems = items
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => {
        if (catalogFilterCategory !== "all" && item.category !== catalogFilterCategory) return false;
        if (catalogSearchQuery.trim()) {
          const q = catalogSearchQuery.trim().toLowerCase();
          return (
            String(item.title || "").toLowerCase().includes(q) ||
            String(item.sku || "").toLowerCase().includes(q)
          );
        }
        return true;
      });

    const productCards = visibleItems.map(({ item, idx }) => {
      const p = `catalog.items.${idx}`;
      const catLabel = (CATALOG_CATEGORIES.find((c) => c.value === item.category) || {}).label || item.category;
      const tools = `<div class="card-tools">
        <button type="button" class="mini-btn" data-action="catalog-up" data-index="${idx}"${idx === 0 ? " disabled" : ""}>Move up</button>
        <button type="button" class="mini-btn" data-action="catalog-down" data-index="${idx}"${idx === items.length - 1 ? " disabled" : ""}>Move down</button>
        <button type="button" class="mini-btn mini-btn-danger" data-action="catalog-remove" data-index="${idx}"${items.length <= 1 ? " disabled" : ""}>Remove</button>
      </div>`;

      return `<section class="card">
        <div class="card-head">
          <div>
            <h3 class="card-title">${idx + 1}. ${esc(item.title || "Untitled Product")}</h3>
            <div class="catalog-meta-pills">
              <span class="sku-pill">SKU: ${esc(item.sku)}</span>
              <span class="sku-pill">${esc(catLabel)}</span>
              <span class="status-pill-staged">${CATALOG_ENABLED ? "Ready" : "Staged"}</span>
            </div>
          </div>
          ${tools}
        </div>

        <div class="grid-2">
          ${fText(`${p}.title`, "Product Title", { value: item.title })}
          ${fText(`${p}.sku`, "Archive SKU Code", { value: item.sku })}
          ${fSelect(`${p}.category`, "Collection Category", CATALOG_CATEGORIES, { value: item.category })}
          ${fSelect(`${p}.status`, "Inventory / Casting Availability", CATALOG_STATUSES, { value: item.status })}
          ${fText(`${p}.alloy`, "Available Metals / Finish", { value: item.alloy, hint: "Displayed on product card & material selector." })}
          ${fText(`${p}.dimensions`, "Millimeter Dimensions / Profile", { value: item.dimensions, hint: "E.g.: 8.5 mm band width · 2.2 mm wall" })}
          ${fText(`${p}.description`, "Craft & Metallurgical Description", { rows: 2, wide: true, value: item.description })}
        </div>

        <div class="card-divider">
          <div class="card-divider-label">Weight, Pricing &amp; Wholesale MOQ</div>
          <div class="grid-4">
            ${fNum(`${p}.baseWeight`, "Base Weight (grams)", { value: item.baseWeight, hint: "Solid metal weight." })}
            ${fNum(`${p}.silverPrice`, "925 Silver Price (USD)", { value: item.silverPrice, hint: "Retail 925 Ag price." })}
            ${fNum(`${p}.vermeilPrice`, "18k Vermeil Price (USD)", { value: item.vermeilPrice, hint: "Retail 18k Au price." })}
            ${fNum(`${p}.moq`, "Min Wholesale Order", { step: "1", value: item.moq, hint: "Minimum pieces per order." })}
          </div>
        </div>

        <div class="card-divider">
          <div class="card-divider-label">Storefront Badges &amp; Product Photography</div>
          <div class="grid-2">
            <div class="check-grid-3">
              ${fCheck(`${p}.featured`, "Featured in Catalog", { value: item.featured })}
              ${fCheck(`${p}.isNew`, "New Arrival Badge", { value: item.isNew })}
              ${fCheck(`${p}.xrfVerified`, "XRF Assay Verified", { value: item.xrfVerified })}
            </div>
            ${fImage(`${p}.image`, "Primary Studio Photo (Default Card View)", { value: item.image })}
            ${fImage(`${p}.hoverImage`, "Secondary Lookbook Photo (Hover / Detail View)", { value: item.hoverImage })}
          </div>
        </div>
      </section>`;
    }).join("");

    return `
      ${lockBanner}
      <fieldset class="catalog-fieldset"${CATALOG_ENABLED ? "" : " disabled"}>
        ${statsBar}
        ${toolbarCard}
        ${productCards}
      </fieldset>
    `;
  }

  /* ---------- Rendering & State ---------- */
  function render() {
    const v = VIEWS[view] || VIEWS.hero;
    $("#viewCrumb").textContent = v.crumb;
    $("#viewTitle").textContent = v.title;
    $("#viewSub").textContent = v.sub;
    $("#viewBody").innerHTML = v.render();
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === view));

    const badge = $("#catalogNavBadge");
    if (badge) {
      badge.textContent = CATALOG_ENABLED ? "Live" : "Nonaktif";
      badge.classList.toggle("is-live", CATALOG_ENABLED);
    }

    syncDirty();
  }

  function syncDirty() {
    const d = isDirty();
    $("#dirtyNote").hidden = !d;
    $("#saveBtn").disabled = !d;
    $("#discardBtn").disabled = !d;
  }

  let toastTimer;
  function toast(msg, kind = "") {
    const t = $("#toast");
    t.textContent = msg;
    t.className = `toast show ${kind}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.className = "toast"), 3200);
  }

  function showLogin(msg = "") {
    $("#console").hidden = true;
    $("#loginScreen").hidden = false;
    $("#loginError").textContent = msg;
    $("#loginPassword").value = "";
    $("#loginPassword").focus();
  }

  function showConsole() {
    $("#loginScreen").hidden = true;
    $("#console").hidden = false;
    render();
  }

  async function api(path, opts = {}) {
    let res;
    try {
      res = await fetch(path, { ...opts, headers: { ...(opts.headers || {}), Authorization: `Bearer ${token}` } });
    } catch {
      return { res: { ok: false, status: 0 }, data: { error: "Cannot reach atelier preview server." } };
    }
    let data = {};
    try { data = await res.json(); } catch { /* empty body */ }
    return { res, data };
  }

  async function loadContent() {
    const res = await fetch("/api/content", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not load content");
    content = data;
    savedSnapshot = JSON.stringify(content);
  }

  /* ---------- Events ---------- */
  $("#viewBody").addEventListener("input", (e) => {
    const el = e.target;
    if (el.id === "catalogSearchInput") {
      if (!CATALOG_ENABLED) return;
      catalogSearchQuery = el.value;
      render();
      const input = $("#catalogSearchInput");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
      return;
    }
    if (el.id === "catalogCategoryFilter") {
      if (!CATALOG_ENABLED) return;
      catalogFilterCategory = el.value;
      render();
      return;
    }

    const path = el.dataset.path;
    if (!path) return;
    if (path.startsWith("catalog.") && !CATALOG_ENABLED) return;

    let v;
    if (el.dataset.type === "checkbox") v = el.checked;
    else if (el.dataset.type === "number") v = el.value === "" ? "" : Number(el.value);
    else v = el.value;
    set(path, v);
    if (el.dataset.image) {
      const img = el.closest(".image-row").querySelector(".thumb");
      img.src = v ? "/" + v : "";
    }
    syncDirty();
  });

  $("#viewBody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action.startsWith("catalog-") && !CATALOG_ENABLED) {
      return toast("Modul Product Catalog masih dinonaktifkan sampai halaman katalog website selesai.", "error");
    }
    if (action === "upload") {
      if (btn.dataset.path && btn.dataset.path.startsWith("catalog.") && !CATALOG_ENABLED) return;
      pendingUploadPath = btn.dataset.path;
      $("#fileInput").value = "";
      $("#fileInput").click();
    } else if (action.startsWith("slide-")) {
      const slides = content.hero.slides = content.hero.slides || [];
      const i = Number(btn.dataset.index);
      if (action === "slide-add" && slides.length < MAX_SLIDES) {
        slides.push({ image: "images/lookbook-hero-1.webp", title: "New slide", subtitle: "" });
      } else if (action === "slide-remove" && slides.length > 1) {
        slides.splice(i, 1);
      } else if (action === "slide-up" || action === "slide-down") {
        const j = action === "slide-up" ? i - 1 : i + 1;
        if (j < 0 || j >= slides.length) return;
        [slides[i], slides[j]] = [slides[j], slides[i]];
      }
      render();
    } else if (action === "move-up" || action === "move-down") {
      const i = Number(btn.dataset.index);
      const j = action === "move-up" ? i - 1 : i + 1;
      const items = content.collections.items;
      if (j < 0 || j >= items.length) return;
      [items[i], items[j]] = [items[j], items[i]];
      render();
    } else if (action.startsWith("catalog-")) {
      const items = getCatalogItems();
      const i = Number(btn.dataset.index);
      if (action === "catalog-add") {
        items.push({
          sku: `AJ-NEW-00${items.length + 1}`,
          title: "New Atelier Piece",
          category: "rings",
          status: "in_stock",
          alloy: "925 Sterling Silver & 18k Gold Vermeil",
          baseWeight: 10.0,
          dimensions: "6.0 mm profile",
          silverPrice: 150,
          vermeilPrice: 195,
          moq: 1,
          featured: false,
          isNew: true,
          xrfVerified: true,
          image: "images/bench-signet.webp",
          hoverImage: "images/edition-rings.webp",
          description: "Handcrafted in our Bali silversmithing workshop."
        });
      } else if (action === "catalog-remove" && items.length > 1) {
        items.splice(i, 1);
      } else if (action === "catalog-up" || action === "catalog-down") {
        const j = action === "catalog-up" ? i - 1 : i + 1;
        if (j < 0 || j >= items.length) return;
        [items[i], items[j]] = [items[j], items[i]];
      }
      render();
    }
  });

  $("#fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file || !pendingUploadPath) return;
    toast("Uploading image to atelier assets...");
    const { res, data } = await api("/api/upload", {
      method: "POST",
      headers: { "x-filename": encodeURIComponent(file.name), "Content-Type": "application/octet-stream" },
      body: file
    });
    if (res.status === 401) return handleExpired();
    if (!res.ok) return toast(data.error || "Upload failed", "error");
    set(pendingUploadPath, data.path);
    render();
    toast("Image uploaded. Remember to save changes.", "ok");
  });

  document.querySelectorAll(".nav-item").forEach((b) =>
    b.addEventListener("click", () => {
      view = b.dataset.view;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
  );

  $("#saveBtn").addEventListener("click", async () => {
    if (!/^\d{8,15}$/.test(String(content.contact.whatsapp || ""))) {
      view = "contact";
      render();
      return toast("WhatsApp number must be digits only with country code (e.g. 6281234567890).", "error");
    }
    $("#saveBtn").disabled = true;
    const { res, data } = await api("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });
    if (res.status === 401) return handleExpired();
    if (!res.ok) {
      syncDirty();
      return toast(data.error || "Could not save content", "error");
    }
    savedSnapshot = JSON.stringify(content);
    syncDirty();
    toast("Saved. Live landing page updated.", "ok");
  });

  $("#discardBtn").addEventListener("click", () => {
    if (!confirm("Discard all unsaved edits on this view?")) return;
    content = JSON.parse(savedSnapshot);
    render();
  });

  $("#logoutBtn").addEventListener("click", async () => {
    if (isDirty() && !confirm("You have unsaved changes. Sign out anyway?")) return;
    await api("/api/logout", { method: "POST" });
    sessionStorage.removeItem(TOKEN_KEY);
    token = "";
    showLogin();
  });

  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#loginSubmit").disabled = true;
    $("#loginError").textContent = "";
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: $("#loginPassword").value })
      });
      const data = await res.json();
      if (!res.ok) {
        $("#loginError").textContent = data.error || "Could not sign in";
      } else {
        token = data.token;
        sessionStorage.setItem(TOKEN_KEY, token);
        await loadContent();
        showConsole();
      }
    } catch {
      $("#loginError").textContent = "Cannot reach atelier preview server.";
    }
    $("#loginSubmit").disabled = false;
  });

  function handleExpired() {
    sessionStorage.removeItem(TOKEN_KEY);
    token = "";
    showLogin("Your atelier session expired. Please sign in again.");
  }

  window.addEventListener("beforeunload", (e) => {
    if (isDirty()) { e.preventDefault(); e.returnValue = ""; }
  });

  /* ---------- Boot ---------- */
  (async () => {
    if (token) {
      const { res } = await api("/api/session");
      if (res.ok) {
        try {
          await loadContent();
          return showConsole();
        } catch {
          showLogin("Could not load content. Sign in again to retry.");
          return;
        }
      }
      sessionStorage.removeItem(TOKEN_KEY);
      token = "";
    }
    showLogin();
  })();
})();
