/* ================================================
   BioClean Experts — script.js
   ================================================ */

/* ===== ACTIVE NAV LINK ===== */
const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-link").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href) return;
  const linkPage = href.split("/").pop();
  if (currentPage === linkPage) {
    link.classList.add("active");
  } else if (
    (currentPage === "" || currentPage === "index.html") &&
    (href === "index.html" || href === "#home")
  ) {
    link.classList.add("active");
  }
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navLinks");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    navMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    // prevent body scroll when overlay is open
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
  // close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hamburger.classList.contains("open")) {
      hamburger.classList.remove("open");
      navMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

/* ===== NAVBAR SCROLL SHADOW ===== */
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("scrolled", window.scrollY > 10);
    },
    { passive: true },
  );
}

/* ===== COUNTER ANIMATION (homepage hero) ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counters = document.querySelectorAll(".stat-val[data-target]");
let countersStarted = false;
if (counters.length) {
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          counters.forEach(animateCounter);
        }
      });
    },
    { threshold: 0.4 },
  ).observe(document.querySelector(".hero") || counters[0]);
}

/* ===== QUOTE FORM (index.html) ===== */
const quoteForm = document.getElementById("quoteForm");
const formNote = document.getElementById("formNote");
if (quoteForm) {
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fname").value.trim();
    const phone = document.getElementById("fphone").value.trim();
    const service = document.getElementById("fservice").value;
    if (!name || !phone || !service) {
      formNote.textContent = "Please fill in your name, phone, and service.";
      formNote.className = "form-note error";
      return;
    }
    const btn = quoteForm.querySelector(".btn-submit");
    btn.textContent = "Sending…";
    btn.disabled = true;
    setTimeout(() => {
      formNote.textContent = "✓ Thanks! We'll be in touch within 24 hours.";
      formNote.className = "form-note success";
      quoteForm.reset();
      btn.textContent = "Get my quote";
      btn.disabled = false;
    }, 1200);
  });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ================================================
   SCROLL ANIMATIONS
   Classes applied to elements in HTML:
     .anim-fade-up     — fade in + rise up
     .anim-fade-down   — fade in + drop down
     .anim-fade-left   — fade in from left
     .anim-fade-right  — fade in from right
     .anim-scale-up    — fade in + scale from 0.92
     .anim-stagger     — parent; children animate one-by-one
   All become visible by adding class .anim-visible
   Optional: data-delay="200" (ms) on individual elements
   ================================================ */

const ANIM_CLASSES = [
  "anim-fade-up",
  "anim-fade-down",
  "anim-fade-left",
  "anim-fade-right",
  "anim-scale-up",
];

/* Collect all animatable elements */
function getAnimEls() {
  return document.querySelectorAll(ANIM_CLASSES.map((c) => "." + c).join(","));
}

/* Stagger: assign delay to direct children of .anim-stagger */
document.querySelectorAll(".anim-stagger").forEach((parent) => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.setProperty("--stagger-i", i);
  });
});

/* IntersectionObserver for .anim-stagger children */
const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.style.getPropertyValue("--stagger-i")
        ? parseInt(el.style.getPropertyValue("--stagger-i")) * 90
        : 0;
      setTimeout(() => el.classList.add("anim-visible"), delay);
      staggerObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".anim-stagger > *").forEach((el) => {
  staggerObserver.observe(el);
});

/* IntersectionObserver */
const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay
        ? parseInt(el.dataset.delay, 10)
        : el.style.getPropertyValue("--stagger-i")
          ? parseInt(el.style.getPropertyValue("--stagger-i")) * 90
          : 0;
      setTimeout(() => el.classList.add("anim-visible"), delay);
      animObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

getAnimEls().forEach((el) => animObserver.observe(el));
