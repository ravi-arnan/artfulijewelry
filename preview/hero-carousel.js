/* Hero carousel for the preview landing page.
   Mirrors the 3-slide carousel of the Next.js storefront (opt1).
   Exposes window.heroCarousel.set(slides) so content-loader.js can apply the
   slides managed in the admin console. All text uses textContent (no innerHTML). */
(() => {
  const AUTOPLAY_MS = 6000;
  const DEFAULT_SLIDES = [
    { image: "images/lookbook-hero-1.webp", title: "Archival Royal Crown", subtitle: "Solid 925 Silver & 18k Gold Vermeil" },
    { image: "images/lookbook-plate-1.webp", title: "Granulation Rings & Heavy Cuffs", subtitle: "Authentic Balinese Metalworking" },
    { image: "images/lookbook-plate-2.webp", title: "Botanical Ear Cuff & Pendant", subtitle: "Precision 3D CAD & Master Casting" }
  ];

  const $ = (id) => document.getElementById(id);
  const stage = $("heroStage");
  if (!stage) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let slides = [];
  let idx = 0;
  let timer = null;
  let paused = false;
  let startedAt = 0;
  let raf = null;

  const slideEls = () => Array.from($("heroSlides").children);
  const pillEls = () => Array.from($("heroPills").children);

  function stopProgress() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function tickProgress() {
    const fill = pillEls()[idx] && pillEls()[idx].firstChild;
    if (!fill) return;
    const pct = Math.min(100, ((performance.now() - startedAt) / AUTOPLAY_MS) * 100);
    fill.style.width = pct + "%";
    if (pct < 100) raf = requestAnimationFrame(tickProgress);
  }

  function schedule() {
    clearTimeout(timer);
    stopProgress();
    pillEls().forEach((p) => (p.firstChild.style.width = "0%"));
    if (reduceMotion || slides.length < 2 || paused) return;
    startedAt = performance.now();
    raf = requestAnimationFrame(tickProgress);
    timer = setTimeout(() => go(idx + 1), AUTOPLAY_MS);
  }

  function go(n) {
    if (!slides.length) return;
    idx = (n + slides.length) % slides.length;
    slideEls().forEach((el, i) => {
      el.classList.toggle("is-active", i === idx);
      el.setAttribute("aria-hidden", String(i !== idx));
    });
    pillEls().forEach((p, i) => {
      p.classList.toggle("is-active", i === idx);
      p.setAttribute("aria-selected", String(i === idx));
    });
    $("heroIndex").textContent = `${idx + 1} / ${slides.length}`;
    $("heroSlideTitle").textContent = slides[idx].title || "";
    $("heroSlideSub").textContent = slides[idx].subtitle || "";
    schedule();
  }

  function build(list) {
    const clean = (Array.isArray(list) ? list : [])
      .filter((s) => s && typeof s.image === "string" && s.image.trim())
      .slice(0, 6);
    slides = clean.length ? clean : DEFAULT_SLIDES;

    const wrap = $("heroSlides");
    const pills = $("heroPills");
    wrap.textContent = "";
    pills.textContent = "";

    slides.forEach((s, i) => {
      const slide = document.createElement("div");
      slide.className = "hero-slide";
      const img = document.createElement("img");
      img.className = "hero-stage-backdrop";
      img.src = s.image.trim();
      img.alt = s.alt || s.title || "Artfuli lookbook photograph";
      if (i > 0) img.loading = "lazy";
      if (i === 0) img.id = "heroMainImage";
      const scrim = document.createElement("div");
      scrim.className = "hero-slide-scrim";
      scrim.setAttribute("aria-hidden", "true");
      slide.append(img, scrim);
      wrap.appendChild(slide);

      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "hero-progress-pill";
      pill.setAttribute("role", "tab");
      pill.setAttribute("aria-label", `Show ${s.title || "photograph " + (i + 1)}`);
      const fill = document.createElement("span");
      fill.className = "hero-progress-fill";
      pill.appendChild(fill);
      pill.addEventListener("click", () => go(i));
      pills.appendChild(pill);
    });

    const multi = slides.length > 1;
    $("heroPrev").hidden = !multi;
    $("heroNext").hidden = !multi;
    pills.hidden = !multi;
    go(0);
  }

  $("heroPrev").addEventListener("click", () => go(idx - 1));
  $("heroNext").addEventListener("click", () => go(idx + 1));
  stage.addEventListener("mouseenter", () => { paused = true; schedule(); });
  stage.addEventListener("mouseleave", () => { paused = false; schedule(); });
  stage.addEventListener("focusin", () => { paused = true; schedule(); });
  stage.addEventListener("focusout", () => { paused = false; schedule(); });
  stage.tabIndex = 0;
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(idx + 1);
    if (e.key === "ArrowLeft") go(idx - 1);
  });

  let touchX = null;
  stage.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const d = touchX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) go(d > 0 ? idx + 1 : idx - 1);
    touchX = null;
  });

  let initialized = false;
  function setSlides(list) {
    initialized = true;
    clearTimeout(fallbackTimer);
    build(list);
  }

  // Fallback if content-loader.js does not supply slides within 350ms
  const fallbackTimer = setTimeout(() => {
    if (!initialized) build(DEFAULT_SLIDES);
  }, 350);

  window.heroCarousel = { set: setSlides, defaults: DEFAULT_SLIDES };
})();
