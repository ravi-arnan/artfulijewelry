// Register GSAP & ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

let currentHeroMode = 'split';
let currentStoryMode = 'parallax';
let heroTimeline = null;

// Initialize All GSAP Animations
function initAnimations() {
  // Clear any existing ScrollTriggers to prevent duplication
  ScrollTrigger.getAll().forEach(st => st.kill());

  // 1. Sticky Header Blur & Border Transition
  ScrollTrigger.create({
    trigger: "body",
    start: "92px top",
    onEnter: () => document.getElementById("siteHeader").classList.add("scrolled"),
    onLeaveBack: () => document.getElementById("siteHeader").classList.remove("scrolled")
  });

  // 2. Hero Animation based on active mode
  initHeroAnimation();

  // 3. Collections Grid Staggered Entrance
  gsap.from(".collection-card", {
    scrollTrigger: {
      trigger: ".collections-section",
      start: "top 75%",
      toggleActions: "play none none reverse"
    },
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "power2.out"
  });

  // 4. Storytelling Animation (Parallax vs Pinned)
  initStoryAnimation();

  // 5. Radical Material Transparency Meters & Counters
  initAssayAnimation();

  // Refresh ScrollTrigger calculations
  ScrollTrigger.refresh();
}

function initHeroAnimation() {
  if (heroTimeline) {
    heroTimeline.kill();
  }

  heroTimeline = gsap.timeline();

  if (currentHeroMode === 'split') {
    // Split Editorial Hero
    gsap.set(".hero-split", { display: "flex" });
    gsap.set(".hero-fullbleed", { display: "none" });

    heroTimeline
      .fromTo(".split-text-title", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .fromTo(".split-text-lead", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4")
      .fromTo(".split-cta-group", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .fromTo(".hero-image-wrap", 
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 }, 
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.2, ease: "power3.inOut" }, 
        0.2
      )
      .fromTo(".hero-image-wrap img",
        { scale: 1.15 },
        { scale: 1.05, duration: 1.4, ease: "power2.out" },
        0.2
      );
  } else {
    // Full-Bleed Cinematic Hero
    gsap.set(".hero-split", { display: "none" });
    gsap.set(".hero-fullbleed", { display: "flex" });

    heroTimeline
      .fromTo(".fullbleed-bg img", 
        { scale: 1.18, filter: "brightness(0.4) contrast(1.1)" }, 
        { scale: 1.04, filter: "brightness(0.72) contrast(1.05)", duration: 1.6, ease: "power2.out" }
      )
      .fromTo(".fullbleed-content .eyebrow", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 
        0.4
      )
      .fromTo(".fullbleed-content .hero-title", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 
        0.5
      )
      .fromTo(".fullbleed-content .hero-lead", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 
        0.7
      )
      .fromTo(".fullbleed-content .btn-group", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 
        0.85
      );
  }
}

function initStoryAnimation() {
  if (currentStoryMode === 'parallax') {
    document.getElementById("storyParallax").classList.remove("hidden");
    document.getElementById("storyPinned").classList.add("hidden");

    // Parallax scroll on atelier artisan photo
    gsap.fromTo("#storyArtisanImg", 
      { y: "-12%" }, 
      {
        y: "12%",
        ease: "none",
        scrollTrigger: {
          trigger: "#storyParallax",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      }
    );

    // Fade up text
    gsap.from(".story-content-reveal", {
      scrollTrigger: {
        trigger: "#storyParallax",
        start: "top 70%",
        toggleActions: "play none none reverse"
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });
  } else {
    document.getElementById("storyParallax").classList.add("hidden");
    document.getElementById("storyPinned").classList.remove("hidden");

    // Pinned Storytelling Sequence
    const steps = document.querySelectorAll(".step-card");
    steps.forEach((step, idx) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          steps.forEach(s => s.classList.remove("active"));
          step.classList.add("active");
        },
        onEnterBack: () => {
          steps.forEach(s => s.classList.remove("active"));
          step.classList.add("active");
        }
      });
    });
  }
}

function initAssayAnimation() {
  ScrollTrigger.create({
    trigger: ".assay-section",
    start: "top 70%",
    once: true,
    onEnter: () => {
      // Bar fills
      document.querySelectorAll(".meter-fill").forEach(fill => {
        const target = fill.getAttribute("data-width") || "100%";
        fill.style.width = target;
      });

      // Animated numbers
      const counter925 = { val: 0 };
      gsap.to(counter925, {
        val: 92.5,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          const el = document.getElementById("numSilver");
          if (el) el.innerText = counter925.val.toFixed(1) + "%";
        }
      });

      const counterVermeil = { val: 0 };
      gsap.to(counterVermeil, {
        val: 2.5,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          const el = document.getElementById("numGold");
          if (el) el.innerText = counterVermeil.val.toFixed(1) + " µm";
        }
      });
    }
  });
}

// UI Interactive Switcher Handlers
window.setHeroMode = function(mode) {
  if (currentHeroMode === mode) return;
  currentHeroMode = mode;

  document.querySelectorAll("#heroButtons .preview-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-mode") === mode);
  });

  initHeroAnimation();
  ScrollTrigger.refresh();
};

window.setStoryMode = function(mode) {
  if (currentStoryMode === mode) return;
  currentStoryMode = mode;

  document.querySelectorAll("#storyButtons .preview-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-mode") === mode);
  });

  initStoryAnimation();
  ScrollTrigger.refresh();
};

window.setHeroMood = function(mood) {
  const hero = document.getElementById("heroSplit");
  if (!hero) return;

  document.querySelectorAll("#moodButtons .preview-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-mood") === mood);
  });

  if (mood === 'dark') {
    hero.classList.add("dark-mood");
  } else {
    hero.classList.remove("dark-mood");
  }
};

window.replayAnimations = function() {
  initAnimations();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Initial bootstrap
window.addEventListener("DOMContentLoaded", () => {
  // Render lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
  initAnimations();
});
