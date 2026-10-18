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

  /* Announcement */
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

  /* Hero */
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
  img($("#heroMainImage"), h.mainImage);
  img($(".hero-secondary-img img"), h.sideImage);
  text($(".hero-side-frame > .caption-note"), h.sideCaption);

  /* Bench data (catalogData and sizeCalibration are globals from landing.html) */
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

  /* Collections */
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

  /* Contact and footer */
  const k = c.contact || {};
  if (/^\d{8,15}$/.test(String(k.whatsapp || ""))) {
    window.SITE_WA = String(k.whatsapp);
    $$('a[href^="https://wa.me/"]').forEach((el) => {
      el.href = el.href.replace(/wa\.me\/\d+/, `wa.me/${window.SITE_WA}`);
    });
  }
  if (typeof k.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(k.email)) {
    window.SITE_EMAIL = k.email;
    $$('a[href^="mailto:"]:not(#briefEmailBtn)').forEach((el) => {
      el.href = `mailto:${k.email}`;
      if (el.textContent.includes("@")) el.textContent = k.email;
    });
  }
  text($(".utility-bar > div:first-child > span"), k.address);
  if (safeUrl(k.instagram)) $$('.brand-social-link[href*="instagram"]').forEach((el) => (el.href = k.instagram));
  if (safeUrl(k.facebook)) $$('.brand-social-link[href*="facebook"]').forEach((el) => (el.href = k.facebook));

  /* Refresh dependent widgets with the new data */
  if (typeof renderBench === "function") renderBench();
  if (typeof updateBespokeBrief === "function") updateBespokeBrief();
})();
