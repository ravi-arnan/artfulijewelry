/* Applies admin-managed content (GET /api/content) to landing.html.
   If the request fails the page keeps its built-in defaults. All text is set
   with textContent, never innerHTML, so admin input cannot inject markup. */
(async () => {
  let c;
  try {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (!res.ok) return;
    c = await res.json();
  } catch {
    return;
  }

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const text = (el, v) => { if (el && typeof v === "string") el.textContent = v; };
  const img = (el, v, alt) => {
    if (!el || typeof v !== "string" || !v) return;
    el.src = v;
    if (alt) el.alt = alt;
  };
  const safeUrl = (u) => typeof u === "string" && /^(#[\w-]*|https?:\/\/[^\s]+)$/.test(u.trim());

  /* 1. Announcement */
  const a = c.announcement || {};
  const bar = $("#announceBar");
  if (bar && a.enabled && a.text) {
    text($("#announceText"), a.text);
    const link = $("#announceLink");
    if (a.linkLabel && safeUrl(a.linkUrl)) {
      link.textContent = a.linkLabel;
      link.href = a.linkUrl.trim();
      if (/^https?:/.test(a.linkUrl)) { link.target = "_blank"; link.rel = "noopener"; }
      link.hidden = false;
    }
    bar.hidden = false;
  }

  /* 2. Hero */
  const h = c.hero || {};
  const lines = $$("#hero-heading [data-line]");
  text(lines[0], h.line1);
  text(lines[1], h.line2);
  text($(".hero-subtext"), h.subtext);
  text($(".hero-actions .btn-primary span"), h.primaryCta);
  text($(".hero-actions .btn-secondary"), h.secondaryCta);
  $$(".hero-facts > div").forEach((el, i) => {
    const f = (h.facts || [])[i];
    if (!f) return;
    text($(".hero-fact-title", el), f.title);
    text($(".caption-note", el), f.note);
  });
  if (window.heroCarousel) {
    const slides = Array.isArray(h.slides) && h.slides.length
      ? h.slides
      : (h.mainImage ? [{ image: h.mainImage, title: "", subtitle: "" }] : null);
    if (slides) window.heroCarousel.set(slides);
  }

  /* 3. Heritage Narrative & Counters */
  const her = c.heritage || {};
  text($("#heritage h2.section-heading"), her.heading);
  const herTexts = $$("#heritage .heritage-text-column > p.body-copy");
  if (herTexts[0]) text(herTexts[0], her.subtext);
  text($("#heritage .atelier-statement"), her.statement);
  if (herTexts[1]) text(herTexts[1], her.note);
  img($("#heritageParallaxImg"), her.image);
  text($("#heritage .heritage-caption"), her.caption);

  const counterEls = $$("#heritageCounters [data-count]");
  if (counterEls[0] && her.years != null) counterEls[0].setAttribute("data-count", her.years);
  if (counterEls[1] && her.artisans != null) counterEls[1].setAttribute("data-count", her.artisans);
  if (counterEls[2] && her.archiveCount != null) counterEls[2].setAttribute("data-count", her.archiveCount);

  /* 4. Collections */
  const col = c.collections || {};
  text($("#collections-heading"), col.heading);
  text($(".collections-header .body-copy"), col.intro);
  $$(".collection-plate").forEach((plate, i) => {
    const it = (col.items || [])[i];
    if (!it) return;
    if (typeof catalogData !== "undefined" && catalogData[it.benchKey]) {
      plate.setAttribute("onclick", `selectBenchPiece('${it.benchKey}')`);
    }
    img($("img", plate), it.image, it.title);
    text($(".plate-meta .subhead", plate), it.title);
    text($(".plate-meta .caption-note", plate), it.meta);
    text($(":scope > p.caption-note", plate), it.description);
  });

  /* 5. Bench data (catalogData and sizeCalibration are globals from landing.html) */
  const b = c.bench || {};
  if (typeof catalogData !== "undefined" && b.pieces) {
    for (const [key, p] of Object.entries(b.pieces)) {
      if (!catalogData[key]) continue;
      catalogData[key] = {
        ...catalogData[key],
        title: p.title, code: p.code, desc: p.desc, img: p.img,
        baseWeight: Number(p.baseWeight), silverPrice: Number(p.silverPrice), vermeilPrice: Number(p.vermeilPrice)
      };
      text($(`#pieceButtons [data-piece="${key}"]`), p.label);
    }
  }
  if (typeof sizeCalibration !== "undefined" && b.sizes) {
    for (const [key, s] of Object.entries(b.sizes)) {
      if (!sizeCalibration[key]) continue;
      sizeCalibration[key] = { diameter: s.diameter, circumference: s.circumference, weightFactor: Number(s.weightFactor) };
      text($(`#sizeButtons [data-size="${key}"]`), `US ${key} (${s.diameter})`);
    }
  }

  /* 6. Material Assay & XRF Matrix */
  const asy = c.assay || {};
  if (typeof assaySpecifications !== "undefined") {
    for (const [key, spec] of Object.entries(asy)) {
      if (assaySpecifications[key]) {
        Object.assign(assaySpecifications[key], spec);
      }
    }
    // Re-render currently active tab
    const activeBtn = $(".assay-tab-btn.active");
    if (activeBtn) {
      const activeKey = activeBtn.textContent.includes("18k") ? "vermeil" :
                        activeBtn.textContent.includes("Hypoallergenic") ? "hypoallergenic" :
                        activeBtn.textContent.includes("Solder") ? "solder" : "silver";
      const data = assaySpecifications[activeKey];
      if (data) {
        text($("#assaySpecTitle"), data.title);
        text($("#assaySpecDesc"), data.desc);
        text($("#assaySpecMethod"), data.method);
        text($("#assayIndustryNorm"), data.norm);
        text($("#assayCertificateTag"), data.status);
      }
    }
  }

  /* 7. Lookbook Visual Plates */
  const lb = c.lookbook || {};
  text($("#lookbook h2.section-heading"), lb.heading);
  text($(".lookbook-header .body-copy"), lb.intro);
  $$("[data-lookbook-plate]").forEach((plate, i) => {
    const item = (lb.plates || [])[i];
    if (!item) return;
    img($(".lookbook-img-wrap img", plate), item.image, item.title);
    text($("h3.subhead", plate), item.title);
    text($("p.caption-note", plate), item.caption);
  });

  /* 8. Guarantee & Provenance */
  const guar = c.guarantee || {};
  text($("#warranty h2.section-heading"), guar.headline);
  text($("#warranty .container > .guarantee-layout > div:first-child > p.body-copy"), guar.subtext);
  text($("#warranty .guarantee-lead-banner .subhead"), guar.warrantyTitle);
  text($("#warranty .guarantee-lead-banner .body-copy"), guar.warrantyDesc);
  const twoCol = $$("#warranty .guarantee-two-col > div");
  if (twoCol[0]) {
    text($(".subhead", twoCol[0]), guar.recycledTitle);
    text($(".body-copy", twoCol[0]), guar.recycledDesc);
  }
  if (twoCol[1]) {
    text($(".subhead", twoCol[1]), guar.renewalTitle);
    text($(".body-copy", twoCol[1]), guar.renewalDesc);
  }

  /* 9. Contact and footer */
  const k = c.contact || {};
  if (/^\d{8,15}$/.test(String(k.whatsapp || ""))) {
    window.SITE_WA = String(k.whatsapp);
    $$('a[href^="https://wa.me/"]').forEach((el) => {
      el.href = el.href.replace(/wa\.me\/\d+/, `wa.me/${window.SITE_WA}`);
    });
    if (typeof window.checkoutViaWhatsApp === "function") {
      const origWa = window.checkoutViaWhatsApp;
      window.checkoutViaWhatsApp = function(e) {
        if (e) e.preventDefault();
        if (typeof cartItems === "undefined" || cartItems.length === 0) return;
        const subtotal = cartItems.reduce((acc, it) => acc + (it.price * it.qty), 0);
        let text = "Hello Artfuli Jewelry Atelier, I would like to commission the following pieces from your collection:\n\n";
        cartItems.forEach((it, idx) => {
          text += `${idx + 1}. ${it.name} (${it.alloy}, ${it.size}) x${it.qty} = $${it.price * it.qty} USD\n`;
        });
        text += `\nEstimated Total: $${subtotal} USD\nInsured Celuk Worldwide Shipping included.\nPlease advise on current casting timeline and payment details.`;
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/${window.SITE_WA}?text=${encoded}`, "_blank");
      };
    }
  }
  if (typeof k.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(k.email)) {
    window.SITE_EMAIL = k.email;
    $$('a[href^="mailto:"]:not(#briefEmailBtn)').forEach((el) => {
      el.href = `mailto:${k.email}`;
      if (el.textContent.includes("@")) el.textContent = k.email;
    });
    if (typeof window.checkoutViaEmail === "function") {
      window.checkoutViaEmail = function(e) {
        if (e) e.preventDefault();
        if (typeof cartItems === "undefined" || cartItems.length === 0) return;
        const subtotal = cartItems.reduce((acc, it) => acc + (it.price * it.qty), 0);
        let text = "Hello Artfuli Jewelry Atelier,\n\nI would like to commission the following pieces:\n\n";
        cartItems.forEach((it, idx) => {
          text += `${idx + 1}. ${it.name} (${it.alloy}, ${it.size}) x${it.qty} = $${it.price * it.qty} USD\n`;
        });
        text += `\nEstimated Total: $${subtotal} USD\n\nPlease reply with atelier invoice and delivery estimate.`;
        const subject = encodeURIComponent("Artfuli Atelier Commission Inquiry");
        const body = encodeURIComponent(text);
        window.location.href = `mailto:${window.SITE_EMAIL}?subject=${subject}&body=${body}`;
      };
    }
  }
  text($(".utility-bar > div:first-child > span"), k.address);
  if (safeUrl(k.instagram)) $$('.brand-social-link[href*="instagram"]').forEach((el) => (el.href = k.instagram));
  if (safeUrl(k.facebook)) $$('.brand-social-link[href*="facebook"]').forEach((el) => (el.href = k.facebook));

  /* Refresh dependent widgets with the new data */
  if (typeof renderBench === "function") renderBench();
  if (typeof updateBespokeBrief === "function") updateBespokeBrief();
})();
