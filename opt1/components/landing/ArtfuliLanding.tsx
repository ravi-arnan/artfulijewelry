"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  Check,
  CheckCircle,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hero Section Carousel Slides Model
interface HeroSlide {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  objectPosition?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/images/lookbook-hero-1.webp",
    alt: "Balinese Royal Crown and 18k Gold Vermeil Heritage Collection",
    title: "Archival Royal Crown",
    subtitle: "Solid 925 Silver & 18k Gold Vermeil",
  },
  {
    src: "/images/lookbook-plate-1.webp",
    alt: "Hand-finished Granulation Rings and Heavy Cuffs in Solid 925 Silver",
    title: "Granulation Rings & Heavy Cuffs",
    subtitle: "Authentic Balinese Metalworking",
  },
  {
    src: "/images/lookbook-plate-2.webp",
    alt: "Sculptural Ear Cuff and Botanical Motif in FTC Standard Vermeil",
    title: "Botanical Ear Cuff & Pendant",
    subtitle: "Precision 3D CAD & Master Casting",
  },
];

// Catalog and Sizing Models
interface CatalogItem {
  title: string;
  code: string;
  desc: string;
  img: string;
  baseWeight: number;
  silverPrice: number;
  vermeilPrice: number;
}

const catalogData: Record<string, CatalogItem> = {
  signet: {
    title: "Subak Architectural Signet",
    code: "AJ-RNG-014",
    desc: "Handcrafted in Celuk, Bali with solid inner gallery.",
    img: "/images/bench-signet.webp",
    baseWeight: 11.4,
    silverPrice: 165,
    vermeilPrice: 215,
  },
  earrings: {
    title: "Jawan Botanical Drop Earrings",
    code: "AJ-EAR-028",
    desc: "Sculptural openwork gold-vermeil drops with carved floral inlay.",
    img: "/images/bench-earrings.webp",
    baseWeight: 8.6,
    silverPrice: 145,
    vermeilPrice: 190,
  },
  pendant: {
    title: "Amethyst Druzy & Botanical Collar",
    code: "AJ-PND-009",
    desc: "Lost-wax botanical collar set with raw crystalline amethyst druzy.",
    img: "/images/bench-pendant.webp",
    baseWeight: 22.8,
    silverPrice: 240,
    vermeilPrice: 310,
  },
  cuff: {
    title: "Klotok Heavy Wrist Cuff",
    code: "AJ-CUF-004",
    desc: "Cold-hammered solid ingot cuff with river-agate burnished edges.",
    img: "/images/bench-cuff.webp",
    baseWeight: 38.5,
    silverPrice: 320,
    vermeilPrice: 410,
  },
};

const sizeCalibration: Record<string, { diameter: string; circumference: string; weightFactor: number }> = {
  "5": { diameter: "15.7 mm", circumference: "49.3 mm", weightFactor: 0.94 },
  "6": { diameter: "16.5 mm", circumference: "51.9 mm", weightFactor: 0.97 },
  "7": { diameter: "17.3 mm", circumference: "54.4 mm", weightFactor: 1.0 },
  "8": { diameter: "18.1 mm", circumference: "57.0 mm", weightFactor: 1.04 },
  "9": { diameter: "18.9 mm", circumference: "59.5 mm", weightFactor: 1.08 },
  "10": { diameter: "19.8 mm", circumference: "62.1 mm", weightFactor: 1.12 },
};

const ringSizeMetrics: Record<string, { dia: string; circ: string; uk: string; eu: string }> = {
  "5": { dia: "15.7 mm", circ: "49.3 mm", uk: "UK J 1/2", eu: "EU 49" },
  "5.5": { dia: "16.1 mm", circ: "50.6 mm", uk: "UK L", eu: "EU 51" },
  "6": { dia: "16.5 mm", circ: "51.9 mm", uk: "UK M", eu: "EU 52" },
  "6.5": { dia: "16.9 mm", circ: "53.1 mm", uk: "UK N", eu: "EU 53" },
  "7": { dia: "17.3 mm", circ: "54.4 mm", uk: "UK O", eu: "EU 54" },
  "7.5": { dia: "17.7 mm", circ: "55.7 mm", uk: "UK P", eu: "EU 56" },
  "8": { dia: "18.1 mm", circ: "57.0 mm", uk: "UK Q", eu: "EU 57" },
  "8.5": { dia: "18.5 mm", circ: "58.3 mm", uk: "UK R", eu: "EU 58" },
  "9": { dia: "18.9 mm", circ: "59.5 mm", uk: "UK S", eu: "EU 60" },
  "9.5": { dia: "19.4 mm", circ: "60.8 mm", uk: "UK T", eu: "EU 61" },
  "10": { dia: "19.8 mm", circ: "62.1 mm", uk: "UK T 1/2", eu: "EU 62" },
  "10.5": { dia: "20.2 mm", circ: "63.4 mm", uk: "UK U 1/2", eu: "EU 63" },
  "11": { dia: "20.6 mm", circ: "64.6 mm", uk: "UK V 1/2", eu: "EU 65" },
};

const assaySpecifications = {
  silver: {
    title: "92.5% Pure Silver + 7.5% Oxygen-Free Copper",
    desc: "We alloy pure 999 silver bullion exclusively with electrolytic oxygen-free copper in our Sukawati crucibles. This prevents fire-scale porosity and delivers higher tensile hardness than commercial scrap silver.",
    method: "Verification Protocol: Olympus Vanta XRF Spectrometer · Batch Tolerance +/- 0.05%",
    norm: "89% to 92% mixed reclaimed scrap alloyed with brass and de-oxidizing silicon additives.",
    status: "Status: XRF Batch Verified in Celuk",
  },
  vermeil: {
    title: "2.5 to 3.0 Microns Solid 18k Gold over 925 Silver",
    desc: "Our vermeil pieces undergo multi-stage electro-bonding of 18k solid yellow gold over a solid 925 sterling silver core, exceeding FTC vermeil thickness requirements for heirloom longevity.",
    method: "Verification Protocol: X-Ray Fluorescence Coating Thickness Gauge · Minimum 2.5 µm",
    norm: "0.1 to 0.5 micron flash gold electroplate over brass or mystery base metal.",
    status: "Status: 2.5+ Micron Thickness Certified",
  },
  hypoallergenic: {
    title: "100% Free of Nickel, Lead, and Cadmium",
    desc: "Every earring post, clasp, and ring shank is formulated without nickel, lead, or cadmium brighteners, making every Artfuli creation safe for sensitive skin and continuous daily wear.",
    method: "Verification Protocol: EN 1811 Bio-Release Assay & Full Elemental XRF Scan",
    norm: "Nickel undercoat frequently applied beneath thin gold plating as a cheap leveler.",
    status: "Status: EN 1811 Hypoallergenic Passed",
  },
  solder: {
    title: "High-Fineness Silver and 18k Gold Hard Solder",
    desc: "Traditional Balinese granulation requires high-temperature eutectic fusing. We formulate our own hard solders matching the karat and fineness of the parent metal so joints never discolor.",
    method: "Verification Protocol: Sukawati Foundry Assay Log · Metallurgical Joint Inspection",
    norm: "Low-melting zinc and tin repair solder that oxidizes dark grey over time.",
    status: "Status: Eutectic Hard-Solder Verified",
  },
};

interface CartItem {
  id: string;
  name: string;
  alloy: string;
  size: string;
  price: number;
  qty: number;
  img: string;
}

interface WishlistItem {
  id: string;
  name: string;
  alloy: string;
  size: string;
  price: number;
  img: string;
}

export function ArtfuliLanding() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Assay Bench State
  const [benchPiece, setBenchPiece] = useState<string>("signet");
  const [benchAlloy, setBenchAlloy] = useState<"silver" | "vermeil">("silver");
  const [benchSize, setBenchSize] = useState<string>("7");

  // Assay Spec Tab State
  const [assayTab, setAssayTab] = useState<keyof typeof assaySpecifications>("silver");

  // Bespoke 3D CAD State
  const [briefType, setBriefType] = useState("Signet Ring with Intaglio Engraving");
  const [briefMetal, setBriefMetal] = useState("925 Sterling Silver");
  const [briefNotes, setBriefNotes] = useState("Solid inner gallery, oxidized Celuk jawan granulation around bezel.");

  // Drawer & Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTab, setCartTab] = useState<"bag" | "wishlist">("bag");
  const [isRingSizerOpen, setIsRingSizerOpen] = useState(false);
  const [sizerVal, setSizerVal] = useState("7");
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "AJ-RNG-014",
      name: "Subak Architectural Signet",
      alloy: "Solid 925 Sterling Silver",
      size: "US 7 (17.3 mm)",
      price: 165,
      qty: 1,
      img: "/images/bench-signet.webp",
    },
    {
      id: "AJ-EAR-028",
      name: "Jawan Botanical Drops",
      alloy: "18k Gold Vermeil (2.5 µm)",
      size: "One Size (42 mm drop)",
      price: 210,
      qty: 1,
      img: "/images/bench-earrings.webp",
    },
  ]);

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: "AJ-CUF-004",
      name: "Klotok Heavy Wrist Cuff",
      alloy: "Solid 925 Sterling Silver",
      size: "Medium (62 mm diameter)",
      price: 340,
      img: "/images/bench-cuff.webp",
    },
  ]);

  // Toast State
  const [toastMsg, setToastMsg] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);
  };

  // Sync theme with document element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  // Lock body scroll when drawer, modal, or mobile menu is open
  useEffect(() => {
    if (isCartOpen || isRingSizerOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isRingSizerOpen, isMobileMenuOpen]);

  // Global escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        setIsRingSizerOpen(false);
        setIsMegaMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener for Mega Menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    if (isMegaMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMegaMenuOpen]);

  // Hero Section GSAP Carousel State & Refs
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const heroSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroProgressRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const heroSlideIdxRef = useRef(0);
  const isHeroTransitioningRef = useRef(false);
  const heroProgressTweenRef = useRef<gsap.core.Tween | null>(null);
  const isHeroPausedRef = useRef(false);
  const heroTouchStartX = useRef<number | null>(null);

  const startHeroProgress = (idx: number) => {
    heroProgressRefs.current.forEach((ref, i) => {
      if (ref) gsap.set(ref, { width: i === idx ? "0%" : "0%" });
    });

    const activeBar = heroProgressRefs.current[idx];
    if (!activeBar) return;

    if (heroProgressTweenRef.current) {
      heroProgressTweenRef.current.kill();
    }

    heroProgressTweenRef.current = gsap.to(activeBar, {
      width: "100%",
      duration: 5.0,
      ease: "none",
      onComplete: () => {
        if (!isHeroPausedRef.current) {
          const next = (idx + 1) % HERO_SLIDES.length;
          switchHeroSlide(next, 1);
        }
      },
    });

    if (isHeroPausedRef.current) {
      heroProgressTweenRef.current.pause();
    }
  };

  const switchHeroSlide = (toIdx: number, direction: 1 | -1 = 1) => {
    if (isHeroTransitioningRef.current) return;
    if (toIdx === heroSlideIdxRef.current) return;

    isHeroTransitioningRef.current = true;
    const fromIdx = heroSlideIdxRef.current;
    const fromEl = heroSlideRefs.current[fromIdx];
    const toEl = heroSlideRefs.current[toIdx];

    if (heroProgressTweenRef.current) {
      heroProgressTweenRef.current.kill();
      heroProgressTweenRef.current = null;
    }

    if (heroProgressRefs.current[fromIdx]) {
      gsap.set(heroProgressRefs.current[fromIdx], { width: "0%" });
    }

    if (!fromEl || !toEl) {
      heroSlideIdxRef.current = toIdx;
      setHeroSlideIdx(toIdx);
      isHeroTransitioningRef.current = false;
      return;
    }

    gsap.set(toEl, {
      opacity: 0,
      scale: 1.06,
      zIndex: 2,
      visibility: "visible",
    });
    gsap.set(fromEl, {
      zIndex: 1,
    });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        gsap.set(fromEl, { opacity: 0, visibility: "hidden" });
        fromEl.classList.remove("is-active");
        toEl.classList.add("is-active");
        heroSlideIdxRef.current = toIdx;
        setHeroSlideIdx(toIdx);
        isHeroTransitioningRef.current = false;
        startHeroProgress(toIdx);
      },
    });

    tl.to(toEl, {
      opacity: 1,
      scale: 1.0,
      duration: 0.95,
    }).to(
      fromEl,
      {
        opacity: 0,
        scale: 0.98,
        duration: 0.75,
        ease: "power2.inOut",
      },
      0.05
    );
  };

  const handleNextHeroSlide = () => {
    const next = (heroSlideIdxRef.current + 1) % HERO_SLIDES.length;
    switchHeroSlide(next, 1);
  };

  const handlePrevHeroSlide = () => {
    const prev = (heroSlideIdxRef.current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    switchHeroSlide(prev, -1);
  };

  const handleSelectHeroSlide = (idx: number) => {
    if (idx === heroSlideIdxRef.current) return;
    const dir = idx > heroSlideIdxRef.current ? 1 : -1;
    switchHeroSlide(idx, dir);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startHeroProgress(0);
    }, 1200);

    return () => {
      clearTimeout(timer);
      if (heroProgressTweenRef.current) {
        heroProgressTweenRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    isHeroPausedRef.current = isHeroPaused;
    if (heroProgressTweenRef.current) {
      if (isHeroPaused) {
        heroProgressTweenRef.current.pause();
      } else {
        heroProgressTweenRef.current.resume();
      }
    }
  }, [isHeroPaused]);

  // GSAP & ScrollTrigger Choreography
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Hero Load Sequence
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .fromTo(
          ".display-hero .line > span",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.12 }
        )
        .fromTo(
          "#heroMainImage",
          { scale: 1.12, opacity: 0.7 },
          { scale: 1.0, opacity: 1, duration: 1.4, ease: "power2.out" },
          0.1
        )
        .fromTo(
          "[data-hero-reveal]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          0.3
        );

      // 2. Sticky Header Tone Shift & Scaling Emblem
      ScrollTrigger.create({
        trigger: "body",
        start: "40px top",
        onEnter: () => document.getElementById("siteHeader")?.classList.add("is-scrolled"),
        onLeaveBack: () => document.getElementById("siteHeader")?.classList.remove("is-scrolled"),
      });

      gsap.to("#headerEmblem", {
        scale: 0.92,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 3. Heritage Workshop Parallax Drift
      gsap.fromTo(
        "#heritageParallaxImg",
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: ".heritage-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 4. Heritage Ledger Figures Count-Up
      ScrollTrigger.create({
        trigger: "#heritageCounters",
        start: "top 85%",
        once: true,
        onEnter: () => {
          const counters = document.querySelectorAll<HTMLElement>("#heritageCounters [data-count]");
          counters.forEach((el) => {
            const target = parseInt(el.getAttribute("data-count") || "0", 10);
            const suffix = el.getAttribute("data-suffix") || "";
            const state = { val: 0 };
            gsap.to(state, {
              val: target,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => {
                const rounded = Math.round(state.val);
                const formatted = rounded >= 4000 ? rounded.toLocaleString("en-US") : String(rounded);
                el.textContent = formatted + suffix;
              },
            });
          });
        },
      });

      // 5. Canonical Section Reveal Stagger
      const revealElements = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      // 6. Lost-Wax Craft Steps Choreography (Section 6)
      const craftSteps = gsap.utils.toArray<HTMLElement>("[data-craft-step]");
      craftSteps.forEach((step, idx) => {
        gsap.fromTo(
          step,
          { opacity: 0, x: 24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            delay: idx * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      // 7. Lookbook Mosaic Staggered Shutter (Section 7)
      gsap.fromTo(
        "[data-lookbook-plate]",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".lookbook-mosaic",
            start: "top 82%",
            once: true,
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Bench readout micro-animation
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        "#benchReadoutStrip",
        { opacity: 0.4, y: 4 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [benchPiece, benchAlloy, benchSize]);

  // Assay tab transition micro-animation
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        "#assayDetailSurface",
        { opacity: 0.4, y: 6 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [assayTab]);

  // Bench Calculations
  const pieceData = catalogData[benchPiece] || catalogData.signet;
  const cal = sizeCalibration[benchSize] || sizeCalibration["7"];
  const isVermeil = benchAlloy === "vermeil";
  const computedWeight = (pieceData.baseWeight * cal.weightFactor + (isVermeil ? 0.3 : 0)).toFixed(1);
  const currentPrice = isVermeil ? pieceData.vermeilPrice : pieceData.silverPrice;
  const purityLabel = isVermeil ? "18k Au / 925 Ag" : "92.5% Ag";
  const alloyFullTitle = isVermeil ? "18k Gold Vermeil (2.5 Microns)" : "925 Sterling Silver";
  const batchCode = isVermeil ? "#CELUK-2026-Au18k" : "#CELUK-2026-Ag925";

  const benchWaText = encodeURIComponent(
    `Hello Bali Handmade / ArtFuli Workshop, I would like to order the ${pieceData.title} (${pieceData.code}) in ${alloyFullTitle}, calibrated to Size US ${benchSize} (${cal.circumference} circumference, ${computedWeight}g). Price: $${currentPrice} USD.`
  );

  const handleAddBenchToBag = () => {
    const sizeStr = `US ${benchSize} (${cal.diameter})`;
    const existingIndex = cartItems.findIndex(
      (it) => it.id === pieceData.code && it.alloy === alloyFullTitle && it.size === sizeStr
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].qty += 1;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: pieceData.code,
          name: pieceData.title,
          alloy: alloyFullTitle,
          size: sizeStr,
          price: currentPrice,
          qty: 1,
          img: pieceData.img,
        },
      ]);
    }

    setIsCartOpen(true);
    setCartTab("bag");
    showToast(`${pieceData.title} added to Collection Bag`);
  };

  // Cart Operations
  const totalCartCount = cartItems.reduce((acc, it) => acc + it.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, it) => acc + it.price * it.qty, 0);

  const updateCartQty = (index: number, delta: number) => {
    const updated = [...cartItems];
    updated[index].qty += delta;
    if (updated[index].qty <= 0) {
      updated.splice(index, 1);
    }
    setCartItems(updated);
  };

  const removeCartItem = (index: number) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    showToast("Piece removed from Collection Bag");
  };

  const moveWishlistToBag = (index: number) => {
    const item = wishlistItems[index];
    const updatedWishlist = [...wishlistItems];
    updatedWishlist.splice(index, 1);
    setWishlistItems(updatedWishlist);

    setCartItems([...cartItems, { ...item, qty: 1 }]);
    setCartTab("bag");
    showToast("Moved piece from Wishlist to Bag");
  };

  const removeWishlistItem = (index: number) => {
    const updatedWishlist = [...wishlistItems];
    updatedWishlist.splice(index, 1);
    setWishlistItems(updatedWishlist);
    showToast("Piece removed from Wishlist");
  };

  const handleCheckoutWa = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    let text = "Hello Bali Handmade / ArtFuli Workshop, I would like to order the following pieces from your collection:\n\n";
    cartItems.forEach((it, idx) => {
      text += `${idx + 1}. ${it.name} (${it.alloy}, ${it.size}) x${it.qty} = $${it.price * it.qty} USD\n`;
    });
    text += `\nEstimated Total: $${cartSubtotal} USD\nShipped directly from Bali via DHL Express / EMS.\nPlease advise on current production timeline and payment details.`;
    window.open(`https://wa.me/6287883992277?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCheckoutEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    let text = "Hello Bali Handmade / ArtFuli Workshop,\n\nI would like to order the following pieces:\n\n";
    cartItems.forEach((it, idx) => {
      text += `${idx + 1}. ${it.name} (${it.alloy}, ${it.size}) x${it.qty} = $${it.price * it.qty} USD\n`;
    });
    text += `\nEstimated Total: $${cartSubtotal} USD\n\nPlease reply with order confirmation and shipping estimate.`;
    const subject = encodeURIComponent("Bali Handmade / ArtFuli Order Inquiry");
    const body = encodeURIComponent(text);
    window.location.href = `mailto:sales@bali-handmade.com?subject=${subject}&body=${body}`;
  };

  // Ring Sizer Operations
  const sizerMetric = ringSizeMetrics[sizerVal] || ringSizeMetrics["7"];

  const handleApplySizerToBench = () => {
    const rounded = Math.round(parseFloat(sizerVal));
    const clamped = Math.min(Math.max(rounded, 5), 10);
    setBenchSize(String(clamped));
    setIsRingSizerOpen(false);
    showToast(`Applied calibrated size US ${clamped} to Sizing Guide`);
    document.getElementById("assay-bench")?.scrollIntoView({ behavior: "smooth" });
  };

  // Bespoke Brief WhatsApp & Mailto
  const bespokeBriefText = `Hello Bali Handmade / ArtFuli Celuk Workshop, I am inquiring about a custom ${briefType} in ${briefMetal}. Specifications: ${briefNotes}`;
  const bespokeWaUrl = `https://wa.me/6287883992277?text=${encodeURIComponent(bespokeBriefText)}`;
  const bespokeEmailUrl = `mailto:sales@bali-handmade.com?subject=${encodeURIComponent("Custom CAD Inquiry: " + briefType)}&body=${encodeURIComponent(bespokeBriefText)}`;

  return (
    <>


      {/* Leedlime Framed Canvas Architecture */}
      <div className="page-canvas" ref={pageRef}>
        {/* SECTION 1: STICKY HEADER NAV WITH MEGA MENU */}
        <header className="site-header" id="siteHeader" ref={megaMenuRef}>
          <div className="header-inner">
            <a
              href="#top"
              className="brand-lockup"
              aria-label="Artfuli Jewelry Home"
              onClick={() => {
                setIsMegaMenuOpen(false);
                setIsMobileMenuOpen(false);
              }}
            >
              <img
                src="/images/artfuli-emblem.png"
                alt="Artfuli Balinese Spiral Emblem"
                className="header-emblem"
                id="headerEmblem"
              />
              <img
                src={theme === "dark" ? "/images/artfuli-wordmark-white.png" : "/images/artfuli-wordmark.png"}
                alt="Artfuli Jewelry"
                className="header-wordmark"
                id="headerWordmark"
              />
            </a>

            <nav aria-label="Primary Editorial Navigation">
              <ul className="primary-nav">
                <li
                  className="nav-item-has-mega"
                  onMouseEnter={() => setIsMegaMenuOpen(true)}
                >
                  <button
                    type="button"
                    className={`nav-link-btn ${isMegaMenuOpen ? "active" : ""}`}
                    onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                    aria-expanded={isMegaMenuOpen}
                    aria-controls="collections-mega-panel"
                  >
                    <span>Collections</span>
                    <ChevronDown
                      className={`nav-chevron ${isMegaMenuOpen ? "is-open" : ""}`}
                      style={{ width: 14, height: 14 }}
                    />
                  </button>
                </li>
                <li>
                  <a href="#heritage" onClick={() => setIsMegaMenuOpen(false)}>
                    Workshop &amp; Craft
                  </a>
                </li>
                <li>
                  <a href="#bespoke" onClick={() => setIsMegaMenuOpen(false)}>
                    Services
                  </a>
                </li>
                <li>
                  <a href="#lookbook" onClick={() => setIsMegaMenuOpen(false)}>
                    Lookbook
                  </a>
                </li>
              </ul>
            </nav>

            <div className="header-cta-group">
              <button
                type="button"
                className="header-bag-btn"
                onClick={() => setIsCartOpen(true)}
                aria-label="Open Collection Bag"
              >
                <ShoppingBag style={{ width: 15, height: 15 }} />
                <span>Bag ({totalCartCount})</span>
              </button>
              <a
                href="#bespoke"
                className="btn-primary header-cta"
                onClick={() => {
                  setIsMegaMenuOpen(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                Custom Order
              </a>
              <button
                type="button"
                className="header-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
              </button>
            </div>
          </div>

          {/* DESKTOP MEGA MENU PANEL */}
          <div
            id="collections-mega-panel"
            className={`mega-menu-panel ${isMegaMenuOpen ? "is-open" : ""}`}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
            role="region"
            aria-label="Collections Mega Menu"
          >
            <div className="mega-menu-inner">
              {/* Column 1: By Category */}
              <div className="mega-col">
                <span className="mega-col-heading">By Category</span>
                <ul className="mega-links">
                  <li>
                    <a href="#collections" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Rings &amp; Signets</span>
                      </div>
                      <span className="mega-link-desc">Subak, signet, &amp; carved bands</span>
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Earrings &amp; Hoops</span>
                      </div>
                      <span className="mega-link-desc">Jawan drops &amp; sculptural ear posts</span>
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Pendants &amp; Necklaces</span>
                      </div>
                      <span className="mega-link-desc">Sacred geometry &amp; floral medallions</span>
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Cuffs &amp; Bangles</span>
                      </div>
                      <span className="mega-link-desc">Heavy cast wrists &amp; hand-finished cuffs</span>
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Wire Jewellery</span>
                        <span className="mega-badge">Heritage</span>
                      </div>
                      <span className="mega-link-desc">Intricate Celuk hand-twisted filigree</span>
                    </a>
                  </li>
                </ul>
                <a href="#collections" className="mega-view-all" onClick={() => setIsMegaMenuOpen(false)}>
                  <span>Explore Full Archive</span>
                  <ArrowRight style={{ width: 13, height: 13 }} />
                </a>
              </div>

              {/* Column 2: By Precious Metal */}
              <div className="mega-col">
                <span className="mega-col-heading">By Precious Metal</span>
                <ul className="mega-links">
                  <li>
                    <a href="#assay" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">925 Sterling Silver</span>
                      </div>
                      <span className="mega-link-desc">92.5% certified Sukawati silver + copper</span>
                    </a>
                  </li>
                  <li>
                    <a href="#assay" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">18k Gold Vermeil</span>
                      </div>
                      <span className="mega-link-desc">2.5µm solid gold bonded over silver core</span>
                    </a>
                  </li>
                  <li>
                    <a href="#assay" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Artisan Brass &amp; Bronze</span>
                      </div>
                      <span className="mega-link-desc">Centuries-old lost-wax alloy tradition</span>
                    </a>
                  </li>
                  <li>
                    <a href="#bespoke" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Solid 14k / 18k Gold</span>
                      </div>
                      <span className="mega-link-desc">Custom heirloom casting by commission</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Curations */}
              <div className="mega-col">
                <span className="mega-col-heading">Curations</span>
                <ul className="mega-links">
                  <li>
                    <a href="#collections" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">New Additions</span>
                      </div>
                      <span className="mega-link-desc">Latest handcrafted arrivals from our benches</span>
                    </a>
                  </li>
                  <li>
                    <a href="#heritage" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Signature Celuk Motifs</span>
                      </div>
                      <span className="mega-link-desc">Granulation, bun, &amp; jawan masterworks</span>
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Re-Stocked Pieces</span>
                      </div>
                      <span className="mega-link-desc">Restocked editions cast for immediate transit</span>
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mega-link-item" onClick={() => setIsMegaMenuOpen(false)}>
                      <div className="mega-link-row">
                        <span className="mega-link-title">Archive Vault</span>
                      </div>
                      <span className="mega-link-desc">Legacy catalog editions &amp; special pricing</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4: Featured Visual Card */}
              <div className="mega-col mega-col-featured">
                <a
                  href="#lookbook"
                  className="mega-featured-link"
                  onClick={() => setIsMegaMenuOpen(false)}
                >
                  <div className="mega-featured-img-wrap">
                    <img
                      src="/images/lookbook-hero-1.webp"
                      alt="Artfuli High Jewelry Lookbook"
                      className="mega-featured-img"
                    />
                    <span className="mega-featured-tag">Editorial Lookbook</span>
                  </div>
                  <h4 className="mega-featured-title">The Celuk High Jewelry Series</h4>
                  <p className="mega-featured-desc">
                    Handcrafted sterling silver and 18k gold vermeil creations photographed in Gianyar.
                  </p>
                  <span className="mega-featured-cta">
                    <span>Explore Lookbook</span>
                    <ArrowUpRight style={{ width: 14, height: 14 }} />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* MOBILE NAVIGATION DRAWER */}
          {isMobileMenuOpen && (
            <div className="mobile-nav-drawer" role="dialog" aria-label="Mobile Navigation">
              <div className="mobile-nav-group">
                <span className="mobile-nav-heading">Collections by Category</span>
                <ul className="mobile-nav-links">
                  <li>
                    <a href="#collections" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Rings &amp; Signets</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Earrings &amp; Hoops</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Pendants &amp; Necklaces</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Cuffs &amp; Bangles</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Wire Jewellery (Heritage)</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mobile-nav-group">
                <span className="mobile-nav-heading">By Precious Metal</span>
                <ul className="mobile-nav-links">
                  <li>
                    <a href="#assay" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>925 Sterling Silver</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#assay" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>18k Gold Vermeil</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#assay" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Artisan Brass &amp; Bronze</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#bespoke" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Solid 14k / 18k Gold</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mobile-nav-group">
                <span className="mobile-nav-heading">Curations</span>
                <ul className="mobile-nav-links">
                  <li>
                    <a href="#collections" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>New Additions</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#heritage" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Signature Celuk Motifs</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Re-Stocked Pieces</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#collections" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Archive Vault</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mobile-nav-group">
                <span className="mobile-nav-heading">Workshop Navigation</span>
                <ul className="mobile-nav-links">
                  <li>
                    <a href="#heritage" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Celuk Workshop &amp; Craft</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#bespoke" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>One-Stop Services (Custom &amp; 3D CAD)</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                  <li>
                    <a href="#lookbook" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>Fine Jewelry Lookbook</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: 12 }}>
                <a
                  href="#bespoke"
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Custom Order
                </a>
              </div>
            </div>
          )}
        </header>

        <main id="top">
          {/* SECTION 2: LEEDLIME 50/50 HERO ARCHITECTURE */}
          <section className="hero-section" aria-labelledby="hero-heading">
            <div className="hero-grid-leedlime">
              {/* Left Column: Copy, CTAs, Assurances, Facts */}
              <div className="hero-copy-col">
                <h1 className="display-hero lines" id="hero-heading">
                  <span className="line"><span>Handmade in</span></span>
                  <span className="line"><span>Celuk, Bali.</span></span>
                </h1>

                <p className="hero-subtext" data-hero-reveal>
                  Solid 925 sterling silver, FTC standard 24k and 18k gold vermeil, and cast brass direct from our Celuk, Bali workshop. Established 2004.
                </p>

                <div className="hero-actions" data-hero-reveal>
                  <a href="#collections" className="btn-primary">
                    <span>Explore Collections</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </a>
                  <a href="#assay-bench" className="btn-secondary">Inspect Alloy &amp; Weight</a>
                </div>

                {/* Assurances List */}
                <div className="hero-assurances" data-hero-reveal>
                  <div className="assurance-item">
                    <CheckCircle className="assurance-icon" />
                    <span>Worldwide tracked delivery via DHL Express and EMS</span>
                  </div>
                  <div className="assurance-item">
                    <CheckCircle className="assurance-icon" />
                    <span>Genuine solid 925 silver &amp; FTC standard gold vermeil guaranteed</span>
                  </div>
                </div>

                {/* Facts row */}
                <div className="hero-facts" data-hero-reveal>
                  <div>
                    <div className="hero-fact-title">Solid 925 Silver</div>
                    <p className="caption-note">Genuine sterling silver hand-crafted by Celuk artisans with authentic granulation.</p>
                  </div>
                  <div>
                    <div className="hero-fact-title">FTC Vermeil Standard</div>
                    <p className="caption-note">Heavy gold layering of 100 millionths of an inch over solid silver, never hollow stamping.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Full-Bleed Editorial Carousel */}
              <div
                className="hero-stage-col"
                onMouseEnter={() => setIsHeroPaused(true)}
                onMouseLeave={() => setIsHeroPaused(false)}
                role="region"
                aria-roledescription="carousel"
                aria-label="Fine Jewelry Highlights"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") handlePrevHeroSlide();
                  if (e.key === "ArrowRight") handleNextHeroSlide();
                }}
                onTouchStart={(e) => {
                  heroTouchStartX.current = e.touches[0].clientX;
                  setIsHeroPaused(true);
                }}
                onTouchEnd={(e) => {
                  if (heroTouchStartX.current !== null) {
                    const diff = heroTouchStartX.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 40) {
                      if (diff > 0) handleNextHeroSlide();
                      else handlePrevHeroSlide();
                    }
                    heroTouchStartX.current = null;
                  }
                  setIsHeroPaused(false);
                }}
              >
                <div className="hero-carousel-slides">
                  {HERO_SLIDES.map((slide, idx) => (
                    <div
                      key={slide.src}
                      ref={(el) => { heroSlideRefs.current[idx] = el; }}
                      className={`hero-slide ${idx === 0 ? "is-active" : ""}`}
                      aria-hidden={idx !== heroSlideIdx}
                    >
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="hero-stage-backdrop"
                        style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
                        id={idx === 0 ? "heroMainImage" : undefined}
                      />
                      <div className="hero-slide-scrim" aria-hidden="true" />
                    </div>
                  ))}
                </div>

                {/* Architectural Editorial Controller Bar */}
                <div className="hero-carousel-bar" data-ui>
                  <div className="hero-carousel-meta">
                    <span className="hero-carousel-index">
                      {Math.min(heroSlideIdx + 1, HERO_SLIDES.length)} / {HERO_SLIDES.length}
                    </span>
                    <div className="hero-carousel-desc">
                      <span className="hero-carousel-title">{(HERO_SLIDES[heroSlideIdx] ?? HERO_SLIDES[0]).title}</span>
                      <span className="hero-carousel-sub">{(HERO_SLIDES[heroSlideIdx] ?? HERO_SLIDES[0]).subtitle}</span>
                    </div>
                  </div>

                  <div className="hero-carousel-controls">
                    <div className="hero-progress-group" role="tablist" aria-label="Carousel pagination">
                      {HERO_SLIDES.map((slide, idx) => (
                        <button
                          key={slide.src}
                          type="button"
                          className={`hero-progress-pill ${idx === heroSlideIdx ? "is-active" : ""}`}
                          onClick={() => handleSelectHeroSlide(idx)}
                          role="tab"
                          aria-selected={idx === heroSlideIdx}
                          aria-label={`Show ${slide.title}`}
                        >
                          <span
                            className="hero-progress-fill"
                            ref={(el) => { heroProgressRefs.current[idx] = el; }}
                          />
                        </button>
                      ))}
                    </div>

                    <div className="hero-arrow-group">
                      <button
                        type="button"
                        className="hero-arrow-btn"
                        onClick={handlePrevHeroSlide}
                        aria-label="Previous photograph"
                      >
                        <ChevronLeft style={{ width: 14, height: 14 }} />
                      </button>
                      <button
                        type="button"
                        className="hero-arrow-btn"
                        onClick={handleNextHeroSlide}
                        aria-label="Next photograph"
                      >
                        <ChevronRight style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TRUST RIBBON: FEATURED IN & TRUSTED BY (Deep Obsidian Marquee) */}
          <section className="trust-ribbon-section" aria-label="Authentic Capabilities and Global Reach">
            <div className="trust-ribbon-inner">
              <p className="trust-ribbon-title">CRAFTED IN BALI · TRUSTED WORLDWIDE</p>
              <div className="marquee-viewport">
                <div className="marquee-track">
                  {/* Set 1 */}
                  <div className="trust-logo-item">
                    <span className="logo-bold">EST. 2004</span>
                    <span className="logo-sub">20+ Years in Celuk</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-serif">50+ Countries</span>
                    <span className="logo-sub">Worldwide Wholesale &amp; Retail</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-display">DHL EXPRESS</span>
                    <span className="logo-sub">Official Courier Partner</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-bold">SOLID 925</span>
                    <span className="logo-sub">Genuine Sterling Silver</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-display">EMS POS INDONESIA</span>
                    <span className="logo-sub">Tracked Global Transit</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-serif">FTC Standard</span>
                    <span className="logo-sub">Certified Gold Vermeil</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-bold">DUAL FOUNDRY</span>
                    <span className="logo-sub">2 In-House Casting Lines</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-display">ONE-STOP SERVICES</span>
                    <span className="logo-sub">3D CAD, Laser &amp; Plating</span>
                  </div>

                  {/* Set 2 (Identical for continuous infinite marquee loop) */}
                  <div className="trust-logo-item">
                    <span className="logo-bold">EST. 2004</span>
                    <span className="logo-sub">20+ Years in Celuk</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-serif">50+ Countries</span>
                    <span className="logo-sub">Worldwide Wholesale &amp; Retail</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-display">DHL EXPRESS</span>
                    <span className="logo-sub">Official Courier Partner</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-bold">SOLID 925</span>
                    <span className="logo-sub">Genuine Sterling Silver</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-display">EMS POS INDONESIA</span>
                    <span className="logo-sub">Tracked Global Transit</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-serif">FTC Standard</span>
                    <span className="logo-sub">Certified Gold Vermeil</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-bold">DUAL FOUNDRY</span>
                    <span className="logo-sub">2 In-House Casting Lines</span>
                  </div>
                  <div className="trust-logo-item">
                    <span className="logo-display">ONE-STOP SERVICES</span>
                    <span className="logo-sub">3D CAD, Laser &amp; Plating</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="trust-ruler-grid" aria-hidden="true"></div>
          </section>

          {/* SECTION 3: WORKSHOP HERITAGE NARRATIVE (Celuk Metallurgy) */}
          <section className="heritage-section" id="heritage" aria-labelledby="heritage-heading">
            <div className="container">
              <div className="heritage-layout">
                <div className="heritage-photo-column">
                  <div className="heritage-frame">
                    <img
                      src="/images/atelier-heritage.webp"
                      alt="Master silversmith shaping precious metal in Celuk Village, Bali"
                      id="heritageParallaxImg"
                    />
                  </div>
                </div>

                <div className="heritage-content-column">
                  <span className="caption-note" style={{ color: "var(--brand-accent)", fontWeight: 600, letterSpacing: "0.08em" }}>
                    ESTABLISHED 2004 · CELUK, BALI
                  </span>
                  <h2 className="section-heading" id="heritage-heading" style={{ marginTop: 12, marginBottom: 24 }}>
                    Two Decades of Authentic Balinese Metallurgy.
                  </h2>
                  <p className="body-copy">
                    Established in 2004 in Celuk Village, Bali Handmade (ArtFuli Jewellery) began as a dedicated artisan workshop producing solid 925 sterling silver beads, spacers, clasps, and fine jewelry. Over two decades, our workshop has grown into a comprehensive manufacturing house with dual in-house casting lines.
                  </p>
                  <blockquote className="atelier-statement">
                    Every handmade piece has its own soul and story, crafted with patience by artisans whose families have shaped precious metals in Celuk for generations.
                  </blockquote>
                  <p className="body-copy">
                    We offer direct island wholesale and retail pricing to everyone, from individual jewelry lovers and hobbyists to boutique studio owners in over 50 countries worldwide, with no reseller license required.
                  </p>

                  <div className="heritage-ledger" id="heritageCounters">
                    <div className="ledger-entry">
                      <div className="metric-figure" data-count="2004">2004</div>
                      <p className="caption-note">Founded in Celuk Village, the heart of Bali silversmithing.</p>
                    </div>
                    <div className="ledger-entry">
                      <div className="metric-figure" data-count="20" data-suffix="+ Years">20+ Years</div>
                      <p className="caption-note">Continuous export and custom manufacturing worldwide.</p>
                    </div>
                    <div className="ledger-entry">
                      <div className="metric-figure" data-count="4550" data-suffix="+">4,550+</div>
                      <p className="caption-note">Original archival molds and designs preserved in our master catalog.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: CURATED SIGNATURE COLLECTIONS & INTERACTIVE ASSAY BENCH */}
          <section className="collections-section" id="collections" aria-labelledby="collections-heading">
            <div className="container">
              <div className="collections-header" data-reveal>
                <div>
                  <h2 className="section-heading" id="collections-heading">
                    Signature Collections
                  </h2>
                </div>
                <p className="body-copy">
                  Four foundational silhouettes drawn from our 4,550-piece archive, available in solid 925 sterling silver and heavy 18k gold vermeil.
                </p>
              </div>

              {/* Asymmetric 2-Column Editorial Mosaic */}
              <div className="collections-mosaic">
                <div className="mosaic-col-left">
                  <a
                    href="#assay-bench"
                    className="collection-plate"
                    onClick={(e) => {
                      e.preventDefault();
                      setBenchPiece("signet");
                      document.getElementById("assay-bench")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <div className="plate-visual tall">
                      <img src="/images/edition-rings.webp" alt="Artfuli Architectural Rings and Bands Collection" />
                    </div>
                    <div className="plate-meta">
                      <h3 className="subhead">Rings and Bands</h3>
                      <span className="caption-note">48 Archival Designs · 6.4g to 18.2g</span>
                    </div>
                    <p className="caption-note">
                      Heavy signets, granulated stacking bands, and bezel-set cabochon rings hand-finished for daily structural permanence.
                    </p>
                  </a>

                  <a
                    href="#assay-bench"
                    className="collection-plate"
                    onClick={(e) => {
                      e.preventDefault();
                      setBenchPiece("pendant");
                      document.getElementById("assay-bench")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <div className="plate-visual wide">
                      <img src="/images/edition-pendants.webp" alt="Artfuli Chains and Pendants Collection" />
                    </div>
                    <div className="plate-meta">
                      <h3 className="subhead">Chains and Pendants</h3>
                      <span className="caption-note">29 Archival Designs · 11.0g to 34.5g</span>
                    </div>
                    <p className="caption-note">
                      Hand-sculpted botanical collars, raw gemstone druzy settings, and talismanic pendants cast from solid precious metal ingots.
                    </p>
                  </a>
                </div>

                <div className="mosaic-col-right">
                  <a
                    href="#assay-bench"
                    className="collection-plate"
                    onClick={(e) => {
                      e.preventDefault();
                      setBenchPiece("earrings");
                      document.getElementById("assay-bench")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <div className="plate-visual wide">
                      <img src="/images/edition-earrings.webp" alt="Artfuli Sculptural Earrings Collection" />
                    </div>
                    <div className="plate-meta">
                      <h3 className="subhead">Sculptural Earrings</h3>
                      <span className="caption-note">36 Archival Designs · 4.8g to 14.0g</span>
                    </div>
                    <p className="caption-note">
                      Balanced architectural drops, botanical frames, and ear cuffs engineered with hypoallergenic solid sterling posts.
                    </p>
                  </a>

                  <a
                    href="#assay-bench"
                    className="collection-plate"
                    onClick={(e) => {
                      e.preventDefault();
                      setBenchPiece("cuff");
                      document.getElementById("assay-bench")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <div className="plate-visual tall">
                      <img src="/images/edition-cuffs.webp" alt="Artfuli Cuffs and Bangles Collection" />
                    </div>
                    <div className="plate-meta">
                      <h3 className="subhead">Cuffs and Bangles</h3>
                      <span className="caption-note">22 Archival Designs · 24.0g to 62.0g</span>
                    </div>
                    <p className="caption-note">
                      Substantial open-shank wrist cuffs, woven wire armlets, and bezel-set heirloom bangles hand-shaped to retain their form.
                    </p>
                  </a>
                </div>
              </div>

              {/* THE ONE LIVE THING: Interactive Precious Metal & Ring Size Assay Bench */}
              <div className="interactive-bench" id="assay-bench">
                <div className="bench-preview-stage">
                  <div className="bench-image-box">
                    <img src={pieceData.img} alt={pieceData.title} id="benchImage" />
                  </div>
                  <div>
                    <p className="subhead" id="benchTitle">{pieceData.title}</p>
                    <p className="caption-note" id="benchSubtitle">
                      Archive Code: {pieceData.code} · {pieceData.desc}
                    </p>
                  </div>
                </div>

                <div className="bench-controls">
                  <div>
                    <h3 className="subhead">Interactive Assay &amp; Sizing Bench</h3>
                    <p className="caption-note">
                      Select an edition, precious metal alloy, and size to inspect exact gram weight, millimeter dimensions, and laboratory XRF certification before commissioning.
                    </p>
                  </div>

                  <div className="control-group">
                    <span className="control-label">Select Archival Edition</span>
                    <div className="button-group-row" id="pieceButtons">
                      <button
                        type="button"
                        className={`choice-btn ${benchPiece === "signet" ? "active" : ""}`}
                        onClick={() => setBenchPiece("signet")}
                      >
                        Subak Signet Ring
                      </button>
                      <button
                        type="button"
                        className={`choice-btn ${benchPiece === "earrings" ? "active" : ""}`}
                        onClick={() => setBenchPiece("earrings")}
                      >
                        Jawan Botanical Drops
                      </button>
                      <button
                        type="button"
                        className={`choice-btn ${benchPiece === "pendant" ? "active" : ""}`}
                        onClick={() => setBenchPiece("pendant")}
                      >
                        Amethyst Druzy Collar
                      </button>
                      <button
                        type="button"
                        className={`choice-btn ${benchPiece === "cuff" ? "active" : ""}`}
                        onClick={() => setBenchPiece("cuff")}
                      >
                        Klotok Heavy Cuff
                      </button>
                    </div>
                  </div>

                  <div className="control-group">
                    <span className="control-label">Select Precious Metal Alloy</span>
                    <div className="button-group-row" id="alloyButtons">
                      <button
                        type="button"
                        className={`choice-btn ${benchAlloy === "silver" ? "active" : ""}`}
                        onClick={() => setBenchAlloy("silver")}
                      >
                        925 Sterling Silver
                      </button>
                      <button
                        type="button"
                        className={`choice-btn ${benchAlloy === "vermeil" ? "active" : ""}`}
                        onClick={() => setBenchAlloy("vermeil")}
                      >
                        18k Gold Vermeil (2.5 µm)
                      </button>
                    </div>
                  </div>

                  <div className="control-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span className="control-label">Ring Size Calibration</span>
                      <button
                        type="button"
                        className="bench-sizer-btn"
                        onClick={() => setIsRingSizerOpen(true)}
                      >
                        Open Sizing Guide
                      </button>
                    </div>
                    <div className="button-group-row" id="sizeButtons">
                      {["5", "6", "7", "8", "9", "10"].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          className={`choice-btn ${benchSize === sz ? "active" : ""}`}
                          onClick={() => setBenchSize(sz)}
                        >
                          US {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Real-time Readout Strip */}
                  <div className="bench-readout-strip" id="benchReadoutStrip">
                    <div>
                      <div className="readout-val" id="readoutWeight">{computedWeight} g</div>
                      <div className="readout-key">Net Weight</div>
                    </div>
                    <div>
                      <div className="readout-val" id="readoutPurity">{purityLabel}</div>
                      <div className="readout-key">Assay Purity</div>
                    </div>
                    <div>
                      <div className="readout-val" id="readoutCircumference">{cal.circumference}</div>
                      <div className="readout-key">Inner Circumference</div>
                    </div>
                    <div>
                      <div className="readout-val" id="readoutPrice" style={{ color: "var(--brand-accent)" }}>${currentPrice} USD</div>
                      <div className="readout-key">Direct Workshop Price</div>
                    </div>
                  </div>

                  <div className="bench-actions">
                    <a
                      href={`https://wa.me/6287883992277?text=${benchWaText}`}
                      target="_blank"
                      className="btn-primary"
                      id="benchAcquireLink"
                      style={{ justifyContent: "center" }}
                    >
                      <span>Inquire via WhatsApp</span>
                      <ArrowUpRight style={{ width: 16, height: 16 }} />
                    </a>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleAddBenchToBag}
                      style={{ justifyContent: "center" }}
                    >
                      <ShoppingBag style={{ width: 15, height: 15 }} />
                      <span>Add to Collection Bag</span>
                    </button>
                  </div>

                  <div className="bench-batch-ledger">
                    <span className="ledger-label">Assay Certificate Included</span>
                    <span className="ledger-dot">·</span>
                    <span className="ledger-sub">Batch Ledger:</span>
                    <code className="ledger-code" id="benchBatchCode">{batchCode}</code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: MATERIAL ASSAY & XRF TRANSPARENCY LEDGER */}
          <section className="assay-section" id="assay" aria-labelledby="assay-heading">
            <div className="container">
              <div className="assay-layout">
                <div className="assay-intro-col">
                  <h2 className="section-heading" id="assay-heading">
                    Radical Material Transparency
                  </h2>
                  <p className="body-copy">
                    Fine jewelry requires scientific proof, not marketing adjectives. Every melt batch in our Celuk foundry undergoes non-destructive X-Ray Fluorescence (XRF) analysis prior to hallmarking.
                  </p>
                  <p className="caption-note">
                    Each acquired piece ships with its printed XRF batch card recording silver fineness, gold micron thickness, and zero-allergen compliance.
                  </p>
                </div>

                <div className="assay-tabs-stage">
                  <div className="assay-tab-bar" role="tablist" aria-label="Metallurgical Specifications">
                    <button
                      type="button"
                      className={`assay-tab-btn ${assayTab === "silver" ? "active" : ""}`}
                      onClick={() => setAssayTab("silver")}
                    >
                      925 Sterling Core
                    </button>
                    <button
                      type="button"
                      className={`assay-tab-btn ${assayTab === "vermeil" ? "active" : ""}`}
                      onClick={() => setAssayTab("vermeil")}
                    >
                      18k Gold Vermeil
                    </button>
                    <button
                      type="button"
                      className={`assay-tab-btn ${assayTab === "hypoallergenic" ? "active" : ""}`}
                      onClick={() => setAssayTab("hypoallergenic")}
                    >
                      Hypoallergenic Purity
                    </button>
                    <button
                      type="button"
                      className={`assay-tab-btn ${assayTab === "solder" ? "active" : ""}`}
                      onClick={() => setAssayTab("solder")}
                    >
                      Hard Solder Assay
                    </button>
                  </div>

                  <div className="assay-detail-surface" id="assayDetailSurface" aria-live="polite">
                    <div>
                      <h3 className="subhead" id="assaySpecTitle" style={{ marginBottom: 12 }}>
                        {assaySpecifications[assayTab].title}
                      </h3>
                      <p className="body-copy" id="assaySpecDesc">
                        {assaySpecifications[assayTab].desc}
                      </p>
                      <p className="caption-note" id="assaySpecMethod" style={{ marginTop: 16 }}>
                        {assaySpecifications[assayTab].method}
                      </p>
                    </div>

                    <div className="assay-comparison-block">
                      <p className="caption-note">Conventional Industry Norm</p>
                      <p className="body-copy" id="assayIndustryNorm">
                        {assaySpecifications[assayTab].norm}
                      </p>
                      <p className="caption-note" id="assayCertificateTag" style={{ color: "var(--brand-accent)", fontWeight: 600 }}>
                        {assaySpecifications[assayTab].status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: MASTER CRAFTSMEN & LOST-WAX CASTING PROCESS */}
          <section className="craft-section" id="casting" aria-labelledby="casting-heading">
            <div className="container">
              <div className="craft-pinned-grid">
                <div className="craft-sticky-col">
                  <h2 className="section-heading" id="casting-heading">
                    Hand-carved wax to molten silver.
                  </h2>
                  <p className="body-copy">
                    Our workshop unites ancestral Balinese silversmithing with vacuum-assisted lost-wax casting, allowing architectural precision without sacrificing the warmth of human touch.
                  </p>
                  <div className="craft-featured-photo">
                    <img src="/images/direct-casting.jpg" alt="Lost-wax tree casting and precious metal preparation in Bali" />
                  </div>
                </div>

                <ol className="craft-list">
                  <li className="craft-step-block" data-craft-step>
                    <h3 className="subhead">Hand-Carved Wax and Granulation</h3>
                    <p className="body-copy">
                      Every form begins as a hand-carved jewelers wax master or an arrangement of individually rolled silver spheres (<em>jawan</em>) placed one by one with a fine bamboo nib.
                    </p>
                    <span className="caption-note">Bench Stage: Sukawati Carving Studio · 6 to 18 Hours per Master</span>
                  </li>
                  <li className="craft-step-block" data-craft-step>
                    <h3 className="subhead">Vacuum Lost-Wax Investment</h3>
                    <p className="body-copy">
                      Wax trees are encased in fine gypsum investment, burned out in kiln cycles over 12 hours, and cast with de-oxidized 925 sterling silver to prevent porosity.
                    </p>
                    <span className="caption-note">Foundry Stage: 960°C Melt Crucible · Argon Shielded Pour</span>
                  </li>
                  <li className="craft-step-block" data-craft-step>
                    <h3 className="subhead">Agate Burnishing and Assay Stamp</h3>
                    <p className="body-copy">
                      After hand-filing and triple ultrasonic cleansing, artisans burnish the metal edges with smooth Balinese river agate stones before stamping the AJ crucible hallmark.
                    </p>
                    <span className="caption-note">Finishing Stage: Natural River Agate Compression · Final XRF Scan</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* SECTION 7: LOOKBOOK VISUAL GALLERY (Large Editorial Plates) */}
          <section className="lookbook-section" id="lookbook" aria-labelledby="lookbook-heading">
            <div className="container">
              <div className="lookbook-header" data-reveal>
                <div>
                  <h2 className="section-heading" id="lookbook-heading">
                    The 2026 Celuk Archive Lookbook
                  </h2>
                </div>
                <p className="body-copy">
                  Photographed in natural tropical daylight across Gianyar, showcasing the interplay of raw volcanic stone, linen, and high-karat gold vermeil.
                </p>
              </div>

              <div className="lookbook-triptych">
                <article className="lookbook-plate" data-lookbook-plate>
                  <div className="lookbook-img-wrap">
                    <img src="/images/lookbook-hero-2.webp" alt="Editorial Portrait wearing Artfuli 18k Gold Vermeil Collar and Drop Earrings" />
                  </div>
                  <h3 className="subhead">Tirta Empul Sculptural Collar</h3>
                  <p className="caption-note">
                    Handcrafted 925 sterling silver drenched in 3.0 microns of 18k yellow gold. Net weight: 42.8 grams.
                  </p>
                </article>

                <article className="lookbook-plate" data-lookbook-plate>
                  <div className="lookbook-img-wrap">
                    <img src="/images/lookbook-plate-1.webp" alt="Editorial study of layered Balinese silver and gold vermeil bands" />
                  </div>
                  <h3 className="subhead">Stacked Jawan Signets</h3>
                  <p className="caption-note">
                    Architectural signet rings paired with traditional Balinese granulated guard bands. Net weight: 16.4 grams.
                  </p>
                </article>

                <article className="lookbook-plate" data-lookbook-plate>
                  <div className="lookbook-img-wrap">
                    <img src="/images/lookbook-plate-2.webp" alt="Close portrait of sculptural gold vermeil ear cuff and pendant" />
                  </div>
                  <h3 className="subhead">Sukawati Vessel Pendant</h3>
                  <p className="caption-note">
                    Lost-wax botanical bell set with unheated honey citrine and hand-drawn foxtail chain. Net weight: 28.5 grams.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* SECTION 8: CLIENT SERVICES & BESPOKE 3D CAD INQUIRIES */}
          <section className="cad-section" id="bespoke" aria-labelledby="cad-heading">
            <div className="container">
              <div className="cad-grid">
                <div>
                  <h2 className="section-heading" id="cad-heading">
                    Custom Design &amp; 3D Casting
                  </h2>
                  <p className="body-copy" style={{ marginTop: 16, marginBottom: 28 }}>
                    Whether modifying an archival Celuk master or drafting a 3D CAD prototype from your napkin sketch, our smiths and digital modelers bring custom heirloom designs to fruition.
                  </p>

                  <div className="cad-visual-pair">
                    <div className="cad-card">
                      <div className="cad-photo-box">
                        <img src="/images/cad-design.jpg" alt="Jewelry 3D CAD Prototyping and Photorealistic Rendering in Bali" />
                      </div>
                      <h3 className="subhead">1. Precision 3D CAD Modeling</h3>
                      <p className="caption-note">
                        Dimensionally accurate Rhino CAD files with photorealistic stone render previews prior to carving.
                      </p>
                    </div>

                    <div className="cad-card">
                      <div className="cad-photo-box">
                        <img src="/images/cad-printing.jpg" alt="High-Resolution Wax 3D Printing for Fine Jewelry in Celuk" />
                      </div>
                      <h3 className="subhead">2. High-Res Wax Printing</h3>
                      <p className="caption-note">
                        Castable 25-micron resin prints guaranteeing micro-prong sharpness and zero print layering marks.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Bespoke Inquiry Generator */}
                <div className="cad-inquiry-panel">
                  <h3 className="subhead" style={{ marginBottom: 4 }}>Send Custom Order Brief</h3>
                  <p className="caption-note" style={{ marginBottom: 18 }}>
                    Select your commissioned silhouette and precious metal to generate a tailored WhatsApp inquiry directly to our Sukawati head caster.
                  </p>

                  <div className="form-row">
                    <label htmlFor="briefTypeSelect">Silhouette Classification</label>
                    <select
                      id="briefTypeSelect"
                      className="form-select"
                      value={briefType}
                      onChange={(e) => setBriefType(e.target.value)}
                    >
                      <option value="Signet Ring with Intaglio Engraving">Signet Ring with Intaglio Engraving</option>
                      <option value="Sculptural Jawan Earring Pair">Sculptural Jawan Earring Pair</option>
                      <option value="Custom Botanical Pendant / Collar">Custom Botanical Pendant / Collar</option>
                      <option value="Cold-Hammered Heavy Wrist Cuff">Cold-Hammered Heavy Wrist Cuff</option>
                      <option value="Private Label Production (Wholesale Multiples)">Private Label Production (Wholesale Multiples)</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label htmlFor="briefMetalSelect">Metallurgy Alloy</label>
                    <select
                      id="briefMetalSelect"
                      className="form-select"
                      value={briefMetal}
                      onChange={(e) => setBriefMetal(e.target.value)}
                    >
                      <option value="925 Sterling Silver">925 Sterling Silver (Oxygen-Free Copper)</option>
                      <option value="18k Gold Vermeil (2.5 Microns)">18k Gold Vermeil (2.5 Microns Heavy Deposit)</option>
                      <option value="Solid 18k Yellow Gold">Solid 18k Yellow Gold (Sukawati Crucible Melt)</option>
                      <option value="Raw 999 Fine Silver Bullion">Raw 999 Fine Silver Bullion (Eutectic Fused)</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label htmlFor="briefNotesInput">Custom Order Notes &amp; Approximate Dimensions</label>
                    <textarea
                      id="briefNotesInput"
                      className="form-textarea"
                      value={briefNotes}
                      onChange={(e) => setBriefNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="brief-actions">
                    <a
                      href={bespokeWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      id="briefWhatsappBtn"
                    >
                      <span>Send Brief via WhatsApp</span>
                      <ArrowUpRight style={{ width: 16, height: 16 }} />
                    </a>
                    <a
                      href={bespokeEmailUrl}
                      className="btn-secondary"
                      id="briefEmailBtn"
                    >
                      <span>Dispatch to sales@bali-handmade.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 9: QUALITY ASSURANCES & WORLDWIDE CLIENT CARE */}
          <section className="guarantee-section" id="warranty" aria-labelledby="guarantee-heading">
            <div className="container">
              <div className="guarantee-layout">
                <div>
                  <h2 className="section-heading" id="guarantee-heading">
                    Quality Guarantee &amp; Worldwide Care
                  </h2>
                  <p className="body-copy" style={{ marginTop: 20 }}>
                    Every piece leaving our Celuk workshop represents over 20 years of Balinese metalsmithing integrity. We stand behind our craftsmanship with direct manufacturer guarantees.
                  </p>
                </div>

                <div className="guarantee-editorial-flow">
                  <div className="guarantee-lead-banner">
                    <h3 className="subhead">7-Day Inspection &amp; Full Refund Guarantee</h3>
                    <p className="body-copy">
                      We are committed to delivering the highest quality handmade jewelry. If you are not satisfied with the quality of your order upon receipt, you may return the merchandise within 7 days for a full merchandise refund.
                    </p>
                  </div>

                  <div className="guarantee-two-col">
                    <div>
                      <h3 className="subhead" style={{ marginBottom: 10 }}>Solid 925 &amp; FTC Standard Vermeil</h3>
                      <p className="body-copy">
                        All silver items are guaranteed solid 925 sterling silver. Our gold vermeil meets strict FTC standards of 100 millionths of an inch of fine gold over solid silver, never hollow stamping.
                      </p>
                    </div>

                    <div>
                      <h3 className="subhead" style={{ marginBottom: 10 }}>Free Worldwide Shipping Above $2.0K</h3>
                      <p className="body-copy">
                        Orders ship directly from Bali via DHL Express and EMS Pos Indonesia. Complimentary tracked shipping is provided for purchases above $2,000 USD to USA, Europe, Australia, and Asia.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* SECTION 10: LEEDLIME SOFT-BLEND PANORAMIC FOOTER */}
        <footer className="atelier-footer" id="footer">
          <div className="container">
            {/* Upper Directory Grid */}
            <div className="directory-grid">
              {/* Brand Column */}
              <div className="brand-col">
                <div className="brand-mark-row">
                  <img src="/images/artfuli-emblem.png" alt="Artfuli Emblem" className="brand-emblem" />
                  <img
                    src={theme === "dark" ? "/images/artfuli-wordmark-white.png" : "/images/artfuli-wordmark.png"}
                    alt="Artfuli Jewelry"
                    className="brand-wordmark"
                    id="footerWordmark"
                  />
                </div>
                <p className="brand-summary">
                  ArtFuli Jewellery &amp; Manufacturer (Bali Handmade). Established in 2004 in Celuk Village, Bali. Professional fine jewelry manufacturing in solid 925 sterling silver, gold vermeil, brass, and bespoke 3D casting services.
                </p>
                <div className="brand-socials">
                  <a href="https://www.instagram.com/artfulijewelry/" target="_blank" rel="noopener noreferrer" className="brand-social-link">
                    <span>Instagram (@artfulijewelry)</span>
                    <ArrowUpRight style={{ width: 13, height: 13 }} />
                  </a>
                  <a href="https://www.facebook.com/balihandmade" target="_blank" rel="noopener noreferrer" className="brand-social-link">
                    <span>Facebook (Bali Handmade)</span>
                    <ArrowUpRight style={{ width: 13, height: 13 }} />
                  </a>
                  <a href="#assay" className="brand-social-link">
                    <span>Assay Ledger</span>
                    <ArrowUpRight style={{ width: 13, height: 13 }} />
                  </a>
                </div>
              </div>

              {/* The Collections */}
              <div>
                <h2 className="directory-col-title">The Collections</h2>
                <ul className="directory-links">
                  <li><a href="#collections">Rings and Bands</a></li>
                  <li><a href="#collections">Sculptural Earrings</a></li>
                  <li><a href="#collections">Chains and Pendants</a></li>
                  <li><a href="#collections">Cuffs and Bangles</a></li>
                  <li><a href="#assay">Material Assay Matrix</a></li>
                  <li><a href="#lookbook">Lookbook 2026</a></li>
                </ul>
              </div>

              {/* Workshop & Craft */}
              <div>
                <h2 className="directory-col-title">Our Workshop</h2>
                <ul className="directory-links">
                  <li><a href="#heritage">Heritage of Celuk</a></li>
                  <li><a href="#casting">Master Silversmiths</a></li>
                  <li><a href="#bespoke">Custom 3D CAD Modeling</a></li>
                  <li><a href="#assay">Traceable Silver and Gold</a></li>
                  <li><a href="#heritage">Sukawati Workshop</a></li>
                  <li><a href="#warranty">Provenance Archive</a></li>
                </ul>
              </div>

              {/* Client Care */}
              <div>
                <h2 className="directory-col-title">Client Care</h2>
                <ul className="directory-links">
                  <li><a href="https://wa.me/6287883992277" target="_blank" rel="noopener noreferrer">WhatsApp (+62 878-8399-2277)</a></li>
                  <li><a href="https://wa.me/628123992277" target="_blank" rel="noopener noreferrer">WhatsApp (+62 812-399-2277)</a></li>
                  <li><a href="#assay-bench" onClick={() => setIsRingSizerOpen(true)}>Ring Sizing Guide</a></li>
                  <li><a href="#warranty">7-Day Quality Guarantee</a></li>
                  <li><a href="#bespoke">DHL &amp; EMS Global Shipping</a></li>
                  <li><a href="mailto:sales@bali-handmade.com">sales@bali-handmade.com</a></li>
                </ul>
              </div>
            </div>

            {/* Utility Row */}
            <div className="utility-bar">
              <div>
                <span>© 2004 - 2026 Bali Handmade / Artfuli Jewelry. Celuk Village, Sukawati, Gianyar, Bali, Indonesia.</span>
              </div>
              <div className="utility-actions">
                <span>Certified 925 Ag · FTC Standard Vermeil</span>
                <a href="https://wa.me/6287883992277" target="_blank" rel="noopener noreferrer" className="utility-cta">
                  <span>Contact Workshop</span>
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </a>
                <button
                  type="button"
                  className="btn-top"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <span>Back to top</span>
                  <ArrowUp style={{ width: 13, height: 13 }} />
                </button>
              </div>
            </div>
          </div>

          {/* Panoramic Artwork Stage with Feathered Soft Blend */}
          <div className="artwork-stage">
            <div className="artwork-mask">
              <img
                src="/images/footer-beads-clean.webp"
                alt="Artfuli Handcrafted Balinese Silver, Gold Vermeil, and Rose Gold Creations"
                className="artwork-image"
                id="footerArtwork"
              />
              <div className="artwork-scrim"></div>
            </div>
          </div>
        </footer>
      </div>

      {/* CART & WISHLIST SLIDE-OVER DRAWER */}
      <div
        id="cartDrawerOverlay"
        className={`drawer-overlay ${isCartOpen ? "is-open" : ""}`}
        onClick={() => setIsCartOpen(false)}
        data-ui
      ></div>
      <aside
        id="cartDrawer"
        className={`cart-drawer ${isCartOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Artfuli Collection Bag"
        data-ui
      >
        <div className="drawer-head">
          <div className="drawer-title-group">
            <button
              type="button"
              className={`drawer-tab-btn ${cartTab === "bag" ? "active" : ""}`}
              onClick={() => setCartTab("bag")}
            >
              Bag ({totalCartCount})
            </button>
            <button
              type="button"
              className={`drawer-tab-btn ${cartTab === "wishlist" ? "active" : ""}`}
              onClick={() => setCartTab("wishlist")}
            >
              Wishlist ({wishlistItems.length})
            </button>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="drawer-body" id="drawerBody">
          {cartTab === "bag" ? (
            cartItems.length === 0 ? (
              <div className="drawer-empty">
                <p className="subhead" style={{ fontSize: "1.25rem", marginBottom: 8 }}>Your Collection Bag is Empty</p>
                <p className="caption-note" style={{ marginBottom: 24 }}>
                  Explore our signature editions on the bench to select your size and alloy calibration.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setIsCartOpen(false);
                    document.getElementById("assay-bench")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{ margin: "0 auto" }}
                >
                  <span>Explore Signature Editions</span>
                </button>
              </div>
            ) : (
              cartItems.map((it, idx) => (
                <div key={idx} className="drawer-item">
                  <img src={it.img} alt={it.name} className="drawer-item-img" />
                  <div>
                    <p className="drawer-item-name">{it.name}</p>
                    <p className="drawer-item-spec">{it.alloy}<br />{it.size}</p>
                    <div className="drawer-qty-row">
                      <button
                        type="button"
                        className="drawer-qty-btn"
                        onClick={() => updateCartQty(idx, -1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="drawer-qty-val">{it.qty}</span>
                      <button
                        type="button"
                        className="drawer-qty-btn"
                        onClick={() => updateCartQty(idx, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div className="drawer-item-price">${it.price * it.qty} USD</div>
                    <button
                      type="button"
                      className="drawer-remove-btn"
                      onClick={() => removeCartItem(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
            wishlistItems.length === 0 ? (
              <div className="drawer-empty">
                <p className="subhead" style={{ fontSize: "1.25rem", marginBottom: 8 }}>No Saved Pieces Yet</p>
                <p className="caption-note">Save your favorite Celuk heirloom pieces to inspect or commission later.</p>
              </div>
            ) : (
              wishlistItems.map((it, idx) => (
                <div key={idx} className="drawer-item">
                  <img src={it.img} alt={it.name} className="drawer-item-img" />
                  <div>
                    <p className="drawer-item-name">{it.name}</p>
                    <p className="drawer-item-spec">{it.alloy}<br />{it.size}</p>
                    <div className="drawer-item-price">${it.price} USD</div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => moveWishlistToBag(idx)}
                      style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                    >
                      <span>Add to Bag</span>
                    </button>
                    <button
                      type="button"
                      className="drawer-remove-btn"
                      onClick={() => removeWishlistItem(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {cartTab === "bag" && cartItems.length > 0 && (
          <div className="drawer-foot" id="drawerFoot">
            <div className="drawer-summary-row">
              <span>Insured Worldwide Transit</span>
              <span style={{ color: "var(--brand-accent)", fontWeight: 500 }}>Complimentary</span>
            </div>
            <div className="drawer-summary-row">
              <span>Celuk Assay Certification</span>
              <span>Included (#CELUK-2026)</span>
            </div>
            <div className="drawer-summary-total">
              <span>Estimated Total</span>
              <span id="drawerTotalPrice">${cartSubtotal} USD</span>
            </div>
            <a
              href="#"
              onClick={handleCheckoutWa}
              className="btn-primary"
              style={{ justifyContent: "center" }}
            >
              <span>Commission via WhatsApp Concierge</span>
              <ArrowUpRight style={{ width: 16, height: 16 }} />
            </a>
            <a
              href="#"
              onClick={handleCheckoutEmail}
              className="btn-secondary"
              style={{ justifyContent: "center", fontSize: "0.85rem" }}
            >
              <span>Email Order to sales@bali-handmade.com</span>
            </a>
          </div>
        )}
      </aside>

      {/* INTERACTIVE RING SIZER MODAL */}
      <div
        id="ringSizerModal"
        className={`modal-overlay ${isRingSizerOpen ? "is-open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsRingSizerOpen(false);
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Ring Sizing Guide"
        data-ui
      >
        <div className="ring-sizer-dialog">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div>
              <h2 className="subhead" style={{ fontSize: "1.6rem", marginBottom: 6 }}>Ring Sizing Guide &amp; Calibration</h2>
              <p className="caption-note">
                Calibrated to international millimeter circumference and US sizing standards. Celuk rings feature comfort-fit contoured inner galleries.
              </p>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setIsRingSizerOpen(false)}
              aria-label="Close sizing guide"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>

          {/* Live Sizer Slider */}
          <div className="sizer-slider-wrap">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink-primary)" }}>Select US Ring Size:</span>
              <span style={{ fontSize: "1.25rem", fontFamily: "var(--font-sans)", fontWeight: 600, color: "var(--brand-accent)" }}>
                US {parseFloat(sizerVal).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="11"
              step="0.5"
              value={sizerVal}
              className="sizer-slider"
              onChange={(e) => setSizerVal(e.target.value)}
            />
          </div>

          {/* Live Metric Grid */}
          <div className="sizer-metric-grid">
            <div>
              <div className="sizer-metric-val">{sizerMetric.dia}</div>
              <div className="sizer-metric-key">Inner Diameter</div>
            </div>
            <div>
              <div className="sizer-metric-val">{sizerMetric.circ}</div>
              <div className="sizer-metric-key">Circumference</div>
            </div>
            <div>
              <div className="sizer-metric-val">{sizerMetric.uk}</div>
              <div className="sizer-metric-key">British / AU</div>
            </div>
            <div>
              <div className="sizer-metric-val">{sizerMetric.eu}</div>
              <div className="sizer-metric-key">European</div>
            </div>
          </div>

          {/* Sizing Methods */}
          <div className="sizer-methods-grid">
            <div className="sizer-method-card">
              <p className="sizer-method-title">Method 1: Measure an Existing Ring</p>
              <p className="caption-note" style={{ lineHeight: 1.5 }}>
                Place your favorite ring on a flat ruler. Measure the widest inside edge to edge in millimeters (inner diameter). Compare directly to the metric readout above.
              </p>
            </div>
            <div className="sizer-method-card">
              <p className="sizer-method-title">Method 2: Paper Strip Sizing</p>
              <p className="caption-note" style={{ lineHeight: 1.5 }}>
                Wrap a 10mm wide strip of paper snugly around your knuckle. Mark the exact overlap point with a pencil, then measure flat in millimeters (circumference).
              </p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", paddingTop: 16 }}>
            <span className="caption-note">Tip: If between two sizes, we advise selecting the larger size.</span>
            <button type="button" className="btn-primary" onClick={handleApplySizerToBench}>
              <span>Apply Size to Assay Bench</span>
              <Check style={{ width: 15, height: 15 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Atelier Toast Notification */}
      <div id="atelierToast" className={`atelier-toast ${isToastVisible ? "is-visible" : ""}`} data-ui>
        <CheckCircle style={{ width: 18, height: 18, color: "#C5A059" }} />
        <span>{toastMsg}</span>
      </div>
    </>
  );
}
