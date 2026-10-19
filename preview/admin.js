(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const TOKEN_KEY = "artfuli_admin_token";

  let token = sessionStorage.getItem(TOKEN_KEY) || "";
  let content = null;
  let savedSnapshot = "";
  let view = "hero";
  let pendingUploadPath = null;

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
      title: "Celuk Heritage Narrative & Figures",
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
      sub: "High-resolution triptych plates photographed in tropical Gianyar daylight across volcanic stone and natural textiles.",
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
      sub: "Direct WhatsApp concierge number (updates all buttons across the entire site), official inquiry email, and Celuk workshop address.",
      render: renderContact
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
    const v = get(path);
    const control = opt.rows
      ? `<textarea data-path="${path}" rows="${opt.rows}">${esc(v)}</textarea>`
      : `<input type="text" data-path="${path}" value="${esc(v)}"${opt.inputmode ? ` inputmode="${opt.inputmode}"` : ""}>`;
    return `<label class="field${opt.wide ? " wide" : ""}"><span class="field-label">${label}</span>${control}${opt.hint ? `<span class="field-hint">${opt.hint}</span>` : ""}</label>`;
  }

  function fNum(path, label, opt = {}) {
    return `<label class="field${opt.wide ? " wide" : ""}"><span class="field-label">${label}</span><input type="number" data-path="${path}" data-type="number" step="${opt.step || "any"}" min="0" value="${esc(get(path))}">${opt.hint ? `<span class="field-hint">${opt.hint}</span>` : ""}</label>`;
  }

  function fCheck(path, label) {
    return `<label class="check-field"><input type="checkbox" data-path="${path}" data-type="checkbox"${get(path) ? " checked" : ""}><span>${label}</span></label>`;
  }

  function fImage(path, label) {
    const v = get(path) || "";
    return `<div class="field wide"><span class="field-label">${label}</span>
      <div class="image-row">
        <img class="thumb" src="${esc(v ? "/" + v : "")}" alt="">
        <div class="field-input"><input type="text" data-path="${path}" data-image="1" value="${esc(v)}" aria-label="${label} path"></div>
        <button type="button" class="mini-btn" data-action="upload" data-path="${path}">Upload</button>
      </div></div>`;
  }

  const card = (title, note, body, tools = "") =>
    `<section class="card"><div class="card-head"><div><h3 class="card-title">${title}</h3>${note ? `<p class="card-note">${note}</p>` : ""}</div>${tools}</div>${body}</section>`;

  /* ---------- 1. Hero & Announcement ---------- */
  function renderHero() {
    return [
      card("Announcement Bar", "A discreet top ticker bar above the sticky header. Activate for shipping offers or new batch alerts.",
        `<div class="grid-2">${fCheck("announcement.enabled", "Show Announcement Bar")}
          ${fText("announcement.text", "Message Text", { wide: true })}
          ${fText("announcement.linkLabel", "Action Link Label")}
          ${fText("announcement.linkUrl", "Action Link Target", { hint: "Page anchor such as #bespoke or external URL." })}</div>`),
      card("Headline & Editorial Copy", "Strict 2-line display headline with supporting craft summary.",
        `<div class="grid-2">${fText("hero.line1", "Headline, Line 1")}${fText("hero.line2", "Headline, Line 2")}
          ${fText("hero.subtext", "Supporting Lead Paragraph", { rows: 3, wide: true, hint: "Recommended length: 15 to 25 words." })}
          ${fText("hero.primaryCta", "Primary Action Button")}${fText("hero.secondaryCta", "Secondary Action Button")}</div>`),
      card("Proof Points (Metallurgy Badges)", "Two certified claims displayed beneath the action buttons.",
        `<div class="grid-2">${get("hero.facts").map((_, i) =>
          fText(`hero.facts.${i}.title`, `Badge ${i + 1} Title`) + fText(`hero.facts.${i}.note`, `Badge ${i + 1} Description`, { rows: 2 })).join("")}</div>`),
      renderHeroSlides(),
      card("Detail Photography", "Secondary craft photograph and its caption.",
        `<div class="grid-2">${fImage("hero.sideImage", "Detail Craft Photo")}
          ${fText("hero.sideCaption", "Detail Photo Caption", { rows: 2, wide: true })}</div>`)
    ].join("");
  }

  const MAX_SLIDES = 6;
  function renderHeroSlides() {
    const slides = get("hero.slides") || [];
    const cards = slides.map((s, i) => {
      const p = `hero.slides.${i}`;
      const tools = `<div class="card-tools">
        <button type="button" class="mini-btn" data-action="slide-up" data-index="${i}"${i === 0 ? " disabled" : ""}>Move up</button>
        <button type="button" class="mini-btn" data-action="slide-down" data-index="${i}"${i === slides.length - 1 ? " disabled" : ""}>Move down</button>
        <button type="button" class="mini-btn" data-action="slide-remove" data-index="${i}"${slides.length <= 1 ? " disabled" : ""}>Remove</button></div>`;
      return card(`Slide ${i + 1}: ${esc(s.title || "Untitled")}`, "",
        `<div class="grid-2">${fText(`${p}.title`, "Slide Title")}${fText(`${p}.subtitle`, "Slide Subtitle")}
          ${fImage(`${p}.image`, "Slide Photo")}</div>`, tools);
    }).join("");
    const add = `<button type="button" class="mini-btn" data-action="slide-add"${slides.length >= MAX_SLIDES ? " disabled" : ""}>Add slide</button>`;
    const head = card("Hero Carousel", `Full-bleed photographs rotating on the right stage, same as the storefront carousel. ${slides.length} of ${MAX_SLIDES} slides used.`,
      `<div class="card-tools">${add}</div>`);
    return head + cards;
  }

  /* ---------- 2. Collections ---------- */
  function renderCollections() {
    const items = get("collections.items") || [];
    const head = card("Collections Overview", "Section title and introductory text.",
      `<div class="grid-2">${fText("collections.heading", "Section Title", { wide: true })}${fText("collections.intro", "Introductory Paragraph", { rows: 3, wide: true })}</div>`);
    const cards = items.map((_, i) => {
      const tools = `<div class="card-tools">
        <button type="button" class="mini-btn" data-action="move-up" data-index="${i}"${i === 0 ? " disabled" : ""}>Move up</button>
        <button type="button" class="mini-btn" data-action="move-down" data-index="${i}"${i === items.length - 1 ? " disabled" : ""}>Move down</button></div>`;
      const p = `collections.items.${i}`;
      return card(`${i + 1}. ${esc(items[i].title)}`, `Connected Simulator Key: ${esc(items[i].benchKey)}`,
        `<div class="grid-2">${fText(`${p}.title`, "Edition Title")}${fText(`${p}.meta`, "Specification Line", { hint: "E.g.: 48 Archival Designs · 6.4g to 18.2g" })}
          ${fText(`${p}.description`, "Edition Narrative", { rows: 3, wide: true })}${fImage(`${p}.image`, "Edition Photo")}</div>`, tools);
    }).join("");
    return head + cards;
  }

  /* ---------- 3. Assay Bench ---------- */
  function renderBench() {
    const pieces = get("bench.pieces") || {};
    const pieceCards = Object.keys(pieces).map((key) => {
      const p = `bench.pieces.${key}`;
      return card(esc(pieces[key].label), `Internal Piece Code: ${esc(pieces[key].code)}`,
        `<div class="grid-2">${fText(`${p}.label`, "Selector Button Label")}${fText(`${p}.title`, "Display Title")}
          ${fText(`${p}.code`, "Archive Reference Code")}${fText(`${p}.desc`, "Short Silhouette Description")}
          ${fImage(`${p}.img`, "Silhouette Photo")}</div>
         <div class="grid-3" style="margin-top:20px">${fNum(`${p}.baseWeight`, "Base Weight at US 7 (grams)", { hint: "Base solid metal weight." })}
          ${fNum(`${p}.silverPrice`, "925 Sterling Silver Price (USD)")}${fNum(`${p}.vermeilPrice`, "18k Vermeil Price (USD)")}</div>`);
    }).join("");
    const sizes = get("bench.sizes") || {};
    const rows = Object.keys(sizes).map((k) => `<tr><td class="size-key">US ${esc(k)}</td>
      <td><input type="text" data-path="bench.sizes.${k}.diameter" value="${esc(sizes[k].diameter)}" aria-label="US ${k} diameter"></td>
      <td><input type="text" data-path="bench.sizes.${k}.circumference" value="${esc(sizes[k].circumference)}" aria-label="US ${k} circumference"></td>
      <td><input type="number" step="0.01" min="0.01" data-type="number" data-path="bench.sizes.${k}.weightFactor" value="${esc(sizes[k].weightFactor)}" aria-label="US ${k} weight factor"></td></tr>`).join("");
    const sizeCard = card("Ring Sizer & Weight Calibration Table", "The weight factor scales base gram weight dynamically based on size. US 7 is 1.00.",
      `<table class="size-table"><thead><tr><th>US Size</th><th>Inner Diameter</th><th>Circumference</th><th>Weight Factor</th></tr></thead><tbody>${rows}</tbody></table>`);
    return pieceCards + sizeCard;
  }

  /* ---------- 4. Heritage & Narrative ---------- */
  function renderHeritage() {
    return [
      card("Atelier Metallurgy Story", "Historical narrative celebrating centuries of Celuk silversmithing.",
        `<div class="grid-2">${fText("heritage.heading", "Section Title", { wide: true })}
          ${fText("heritage.subtext", "First Paragraph (Historical Background)", { rows: 3, wide: true })}
          ${fText("heritage.statement", "Atelier Manifesto Blockquote", { rows: 3, wide: true, hint: "Highlighted in the warm stone callout block." })}
          ${fText("heritage.note", "Second Paragraph (Foundry & Ethical Standards)", { rows: 3, wide: true })}</div>`),
      card("Animated Counter Metrics", "Live figures that count up when scrolled into view.",
        `<div class="grid-3">${fNum("heritage.years", "Centuries / Years Figure", { hint: "Target figure (e.g. 100)." })}
          ${fNum("heritage.artisans", "Master Artisans Figure", { hint: "Target figure (e.g. 32)." })}
          ${fNum("heritage.archiveCount", "Archival Catalog Count", { hint: "Target figure (e.g. 4550)." })}</div>`),
      card("Foundry Photography", "Photograph of Sukawati brazier smithing.",
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
      return card(titleLabel, `Tab Key: ${esc(key)}`,
        `<div class="grid-2">${fText(`${p}.title`, "Specification Title", { wide: true })}
          ${fText(`${p}.desc`, "Technical Description", { rows: 3, wide: true })}
          ${fText(`${p}.method`, "Laboratory Verification Protocol", { wide: true })}
          ${fText(`${p}.norm`, "Commercial Scrap / Industry Norm Comparison", { rows: 2, wide: true })}
          ${fText(`${p}.status`, "Assay Badge / Certificate Tag Status")}</div>`);
    }).join("");
  }

  /* ---------- 6. Lookbook Gallery ---------- */
  function renderLookbook() {
    const lb = get("lookbook") || {};
    const head = card("Lookbook Overview", "Section heading and setting note.",
      `<div class="grid-2">${fText("lookbook.heading", "Heading", { wide: true })}${fText("lookbook.intro", "Introductory Note", { rows: 3, wide: true })}</div>`);
    const plates = (lb.plates || []).map((_, i) => {
      const p = `lookbook.plates.${i}`;
      return card(`Editorial Plate ${i + 1}`, "",
        `<div class="grid-2">${fText(`${p}.title`, "Plate Title")}${fText(`${p}.caption`, "Caption / Archive Note", { rows: 2, wide: true })}
          ${fImage(`${p}.image`, "Editorial Photo")}</div>`);
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
      card("Secondary Commitments (2 Columns)", "Ethical sourcing and vermeil renewal servicing.",
        `<div class="grid-2">${fText("guarantee.recycledTitle", "Left Title")}${fText("guarantee.renewalTitle", "Right Title")}
          ${fText("guarantee.recycledDesc", "Left Description (Recycled Metals)", { rows: 3 })}${fText("guarantee.renewalDesc", "Right Description (Vermeil Renewal)", { rows: 3 })}</div>`)
    ].join("");
  }

  /* ---------- 8. Contact & Concierge ---------- */
  function renderContact() {
    return card("Concierge, Workshop & Footer Directory", "Central atelier contacts that automatically update across all buttons and footer links.",
      `<div class="grid-2">${fText("contact.whatsapp", "WhatsApp Concierge Number", { inputmode: "numeric", hint: "Format: Country code + phone digits without plus sign. Example: 6281234567890. Dynamically updates all acquisition & inquiry buttons." })}
        ${fText("contact.email", "Official Concierge Email", { hint: "Example: care@artfulijewelry.com" })}
        ${fText("contact.address", "Atelier Legal / Copyright Line", { wide: true })}
        ${fText("contact.instagram", "Official Instagram Link")}${fText("contact.facebook", "Official Facebook Link")}</div>`);
  }

  /* ---------- Rendering & State ---------- */
  function render() {
    const v = VIEWS[view] || VIEWS.hero;
    $("#viewCrumb").textContent = v.crumb;
    $("#viewTitle").textContent = v.title;
    $("#viewSub").textContent = v.sub;
    $("#viewBody").innerHTML = v.render();
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
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
    const res = await fetch(path, { ...opts, headers: { ...(opts.headers || {}), Authorization: `Bearer ${token}` } });
    let data = {};
    try { data = await res.json(); } catch { /* empty body */ }
    return { res, data };
  }

  async function loadContent() {
    const res = await fetch("/api/content", { cache: "no-store" });
    content = await res.json();
    savedSnapshot = JSON.stringify(content);
  }

  /* ---------- Events ---------- */
  $("#viewBody").addEventListener("input", (e) => {
    const el = e.target;
    const path = el.dataset.path;
    if (!path) return;
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
    if (action === "upload") {
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
        await loadContent();
        return showConsole();
      }
      sessionStorage.removeItem(TOKEN_KEY);
      token = "";
    }
    showLogin();
  })();
})();
