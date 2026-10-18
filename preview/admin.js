(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const TOKEN_KEY = "artfuli_admin_token";

  let token = sessionStorage.getItem(TOKEN_KEY) || "";
  let content = null;
  let savedSnapshot = "";
  let view = "hero";
  let pendingUploadPath = null;

  const VIEWS = {
    hero: { title: "Hero and announcement", sub: "The first impression: top banner, headline, proof points and lead photography.", render: renderHero },
    collections: { title: "Collections", sub: "Signature editions shown in the editorial mosaic. Order here is the order on the page.", render: renderCollections },
    bench: { title: "Assay bench", sub: "Pieces, prices and weights used by the interactive size and alloy simulator.", render: renderBench },
    contact: { title: "Contact and footer", sub: "WhatsApp concierge number, email, address and social links used across the page.", render: renderContact }
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

  /* ---------- Views ---------- */
  function renderHero() {
    return [
      card("Announcement bar", "Thin banner shown above the header. Turn it off when not needed.",
        `<div class="grid-2">${fCheck("announcement.enabled", "Show announcement bar")}
          ${fText("announcement.text", "Message", { wide: true })}
          ${fText("announcement.linkLabel", "Link label")}
          ${fText("announcement.linkUrl", "Link target", { hint: "A page anchor such as #bespoke, or a full web address." })}</div>`),
      card("Headline", "The hero headline is set on two lines.",
        `<div class="grid-2">${fText("hero.line1", "Headline, line 1")}${fText("hero.line2", "Headline, line 2")}
          ${fText("hero.subtext", "Supporting text", { rows: 3, wide: true, hint: "Keep it to one or two sentences." })}
          ${fText("hero.primaryCta", "Primary button label")}${fText("hero.secondaryCta", "Secondary button label")}</div>`),
      card("Proof points", "Two short claims shown under the buttons.",
        `<div class="grid-2">${get("hero.facts").map((_, i) =>
          fText(`hero.facts.${i}.title`, `Point ${i + 1} title`) + fText(`hero.facts.${i}.note`, `Point ${i + 1} note`, { rows: 2 })).join("")}</div>`),
      card("Photography", "Upload a .webp, .jpg or .png (max 5 MB). Landscape and portrait crops are handled by the page.",
        `<div class="grid-2">${fImage("hero.mainImage", "Main hero photo")}${fImage("hero.sideImage", "Detail photo")}
          ${fText("hero.sideCaption", "Detail caption", { rows: 2, wide: true })}</div>`)
    ].join("");
  }

  function renderCollections() {
    const items = get("collections.items");
    const head = card("Section copy", "", `<div class="grid-2">${fText("collections.heading", "Heading", { wide: true })}${fText("collections.intro", "Introduction", { rows: 3, wide: true })}</div>`);
    const cards = items.map((_, i) => {
      const tools = `<div class="card-tools">
        <button type="button" class="mini-btn" data-action="move-up" data-index="${i}"${i === 0 ? " disabled" : ""}>Move up</button>
        <button type="button" class="mini-btn" data-action="move-down" data-index="${i}"${i === items.length - 1 ? " disabled" : ""}>Move down</button></div>`;
      const p = `collections.items.${i}`;
      return card(`${i + 1}. ${esc(items[i].title)}`, "",
        `<div class="grid-2">${fText(`${p}.title`, "Title")}${fText(`${p}.meta`, "Caption line", { hint: "For example: 48 Archival Designs · 6.4g to 18.2g" })}
          ${fText(`${p}.description`, "Description", { rows: 3, wide: true })}${fImage(`${p}.image`, "Photo")}</div>`, tools);
    }).join("");
    return head + cards;
  }

  function renderBench() {
    const pieces = get("bench.pieces");
    const pieceCards = Object.keys(pieces).map((key) => {
      const p = `bench.pieces.${key}`;
      return card(esc(pieces[key].label), `Internal key: ${esc(key)}`,
        `<div class="grid-2">${fText(`${p}.label`, "Button label")}${fText(`${p}.title`, "Display name")}
          ${fText(`${p}.code`, "Archive code")}${fText(`${p}.desc`, "Short description")}
          ${fImage(`${p}.img`, "Photo")}</div>
         <div class="grid-3" style="margin-top:20px">${fNum(`${p}.baseWeight`, "Base weight (g)", { hint: "Weight at US size 7." })}
          ${fNum(`${p}.silverPrice`, "925 silver price (USD)")}${fNum(`${p}.vermeilPrice`, "18k vermeil price (USD)")}</div>`);
    }).join("");
    const sizes = get("bench.sizes");
    const rows = Object.keys(sizes).map((k) => `<tr><td class="size-key">US ${esc(k)}</td>
      <td><input type="text" data-path="bench.sizes.${k}.diameter" value="${esc(sizes[k].diameter)}" aria-label="US ${k} diameter"></td>
      <td><input type="text" data-path="bench.sizes.${k}.circumference" value="${esc(sizes[k].circumference)}" aria-label="US ${k} circumference"></td>
      <td><input type="number" step="0.01" min="0.01" data-type="number" data-path="bench.sizes.${k}.weightFactor" value="${esc(sizes[k].weightFactor)}" aria-label="US ${k} weight factor"></td></tr>`).join("");
    const sizeCard = card("Ring size calibration", "Weight factor multiplies the base weight. Size 7 is 1.00.",
      `<table class="size-table"><thead><tr><th>Size</th><th>Inner diameter</th><th>Circumference</th><th>Weight factor</th></tr></thead><tbody>${rows}</tbody></table>`);
    return pieceCards + sizeCard;
  }

  function renderContact() {
    return card("Concierge and footer", "",
      `<div class="grid-2">${fText("contact.whatsapp", "WhatsApp number", { inputmode: "numeric", hint: "Digits only with country code, no plus sign. Example: 6281234567890. Updates every WhatsApp button on the page." })}
        ${fText("contact.email", "Concierge email")}
        ${fText("contact.address", "Footer line (copyright and address)", { wide: true })}
        ${fText("contact.instagram", "Instagram link")}${fText("contact.facebook", "Facebook link")}</div>`);
  }

  /* ---------- Rendering and state ---------- */
  function render() {
    $("#viewTitle").textContent = VIEWS[view].title;
    $("#viewSub").textContent = VIEWS[view].sub;
    $("#viewBody").innerHTML = VIEWS[view].render();
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
    toast("Uploading image...");
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
      window.scrollTo({ top: 0 });
    })
  );

  $("#saveBtn").addEventListener("click", async () => {
    if (!/^\d{8,15}$/.test(String(content.contact.whatsapp || ""))) {
      view = "contact";
      render();
      return toast("WhatsApp number must be digits only, with country code.", "error");
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
      return toast(data.error || "Could not save", "error");
    }
    savedSnapshot = JSON.stringify(content);
    syncDirty();
    toast("Saved. The landing page is updated.", "ok");
  });

  $("#discardBtn").addEventListener("click", () => {
    if (!confirm("Discard all unsaved changes?")) return;
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
      $("#loginError").textContent = "Cannot reach the server.";
    }
    $("#loginSubmit").disabled = false;
  });

  function handleExpired() {
    sessionStorage.removeItem(TOKEN_KEY);
    token = "";
    showLogin("Your session expired. Sign in again; unsaved edits on this screen are kept until you reload.");
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
