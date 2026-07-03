(() => {
  "use strict";

  /*=============== SCROLL PROGRESS & HEADER ===============*/
  const siteHeader = document.querySelector(".site-header");
  const progressBar = document.getElementById("scroll-progress");
  const backToTop = document.querySelector(".back-to-top");

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const top = window.scrollY;
      const progress = max > 0 ? top / max : 0;
      const scrolled = top > 30;

      // Solid background on the header once the page has scrolled a bit
      if (siteHeader) siteHeader.classList.toggle("is-scrolled", scrolled);
      // Same threshold reveals the back-to-top button
      backToTop.classList.toggle("is-visible", scrolled);
      // Amber bar at the very top tracks overall scroll progress
      progressBar.style.width = (Math.round(progress * 1000) / 10) + "%";
      // Fecha o menu mobile caso o usuário role a página com ele aberto
      if (document.body.classList.contains("menu-open")) closeMenu();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /*=============== MENU MOBILE (HAMBÚRGUER) ===============*/
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const navBackdrop = document.getElementById("nav-backdrop");

  function closeMenu() {
    document.body.classList.remove("menu-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    document.body.classList.add("menu-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "true");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      if (document.body.classList.contains("menu-open")) closeMenu();
      else openMenu();
    });

    if (navBackdrop) {
      navBackdrop.addEventListener("click", closeMenu);
    }

    // Fecha ao clicar em qualquer link/CTA dentro do menu
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  /*=============== SCROLL REVEAL (SEÇÕES) ===============*/
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const key = entry.target.getAttribute("data-observe");
      entry.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-revealed"));
      const line = entry.target.querySelector(".timeline-line");
      if (line) line.classList.add("is-revealed");
      if (key === "sobre") startCounters();
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll("[data-observe]").forEach((el) => io.observe(el));

  /*=============== CONTADORES ANIMADOS ===============*/
  const countersDone = { value: false };
  function startCounters() {
    if (countersDone.value) return;
    countersDone.value = true;
    const targets = { years: 3, companies: 2, techs: 10 };
    const els = {
      years: document.getElementById("count-years"),
      companies: document.getElementById("count-companies"),
      techs: document.getElementById("count-techs")
    };
    const t0 = performance.now();
    const duration = 1100;
    function step(t) {
      const p = Math.min(1, (t - t0) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      els.years.textContent = Math.round(targets.years * ease) + "+";
      els.companies.textContent = Math.round(targets.companies * ease);
      els.techs.textContent = Math.round(targets.techs * ease) + "+";
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /*=============== CURSOR CUSTOMIZADO ===============*/
  // Só ativa em dispositivos com ponteiro fino (mouse), nunca em touch
  if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("has-custom-cursor");
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    let hoverActive = false;

    window.addEventListener("mousemove", (e) => {
      dot.style.transform = "translate(" + e.clientX + "px, " + e.clientY + "px) translate(-50%, -50%)";
      const scale = hoverActive ? 2.1 : 1;
      ring.style.transform = "translate(" + e.clientX + "px, " + e.clientY + "px) translate(-50%, -50%) scale(" + scale + ")";
    });
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest && e.target.closest("[data-cursor-hover]")) hoverActive = true;
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest && e.target.closest("[data-cursor-hover]")) hoverActive = false;
    });
  }

  /*=============== EFEITOS DE MOUSE (SÓ EM PONTEIRO FINO) ===============*/
  // Tilt da foto e botões magnéticos ficam desativados em telas de celular/touch
  const hasFinePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  if (hasFinePointer) {
    /*=============== TILT DA FOTO NO HERO ===============*/
    const heroSection = document.getElementById("hero-section");
    const heroPhoto = document.getElementById("hero-photo-tilt");
    // Validate if both elements exist
    if (heroSection && heroPhoto) {
      heroSection.addEventListener("mousemove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        heroPhoto.style.transform = "rotate(" + (dx * 4) + "deg) translate(" + (dx * 10) + "px, " + (dy * 10) + "px)";
      });
      heroSection.addEventListener("mouseleave", () => {
        heroPhoto.style.transform = "rotate(0deg) translate(0,0)";
      });
    }

    /*=============== BOTÕES MAGNÉTICOS ===============*/
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + (dx * 0.22) + "px, " + (dy * 0.32) + "px)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  /*=============== SELETOR DE IDIOMA (GOOGLE TRANSLATE) ===============*/
  function getSiteBasePath() {
    const path = window.location.pathname;
    if (path.includes(".html")) {
      return path.slice(0, path.lastIndexOf("/") + 1) || "/";
    }
    return path.endsWith("/") ? path : path + "/";
  }

  function getCookiePaths() {
    const base = getSiteBasePath();
    return base === "/" ? ["/"] : ["/", base];
  }

  function getGoogtransCookie() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : "";
  }

  function setGoogtransCookie(value) {
    const maxAge = value ? ";max-age=31536000" : ";expires=Thu, 01 Jan 1970 00:00:00 UTC";
    getCookiePaths().forEach((cookiePath) => {
      document.cookie = "googtrans=" + value + ";path=" + cookiePath + maxAge;
    });
  }

  function clearGoogtransCookies() {
    setGoogtransCookie("");
  }

  function initLanguageCookie() {
    if (getGoogtransCookie()) return;
    const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || "pt").toLowerCase();
    if (!browserLang.startsWith("pt")) {
      setGoogtransCookie("/pt/en");
    }
  }

  function loadGoogleTranslateScript() {
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement(
        { pageLanguage: "pt", includedLanguages: "pt,en", autoDisplay: false },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }

  initLanguageCookie();
  loadGoogleTranslateScript();

  function currentLang() {
    return getGoogtransCookie().includes("/en") ? "en" : "pt";
  }

  function setActiveLangButton(lang) {
    document.querySelectorAll(".lang-btn").forEach((b) => {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
    });
  }

  function restoreOriginalLanguage(combo) {
    const originalOption = Array.from(combo.options).find((option) => {
      return option.value === "" || option.value === "pt";
    });
    combo.value = originalOption ? originalOption.value : "";
    combo.dispatchEvent(new Event("change"));
    document.documentElement.classList.remove("translated-ltr", "translated-rtl");
    document.body.classList.remove("translated-ltr", "translated-rtl");
  }

  // Aguarda o widget do Google Translate ficar pronto antes de aplicar
  function applyTranslation(lang, attempt) {
    attempt = attempt || 0;
    const combo = document.querySelector("select.goog-te-combo");
    if (combo) {
      if (lang === "pt") {
        restoreOriginalLanguage(combo);
      } else if (combo.value !== lang) {
        combo.value = lang;
        combo.dispatchEvent(new Event("change"));
      }
      setActiveLangButton(lang);
    } else if (attempt < 10) {
      setTimeout(() => applyTranslation(lang, attempt + 1), 300);
    }
  }

  function translateTo(lang) {
    setGoogtransCookie("/pt/" + lang);
    applyTranslation(lang);
  }

  function resetToOriginal() {
    clearGoogtransCookies();
    setActiveLangButton("pt");

    const combo = document.querySelector("select.goog-te-combo");
    if (combo) {
      restoreOriginalLanguage(combo);
      return;
    }

    window.location.reload();
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (lang === "pt") {
        resetToOriginal();
        return;
      }
      if (lang === currentLang()) return;
      translateTo(lang);
    });
  });

  // Idioma definido pelo cookie googtrans
  const initialLang = currentLang();
  setActiveLangButton(initialLang);
  applyTranslation(initialLang);
})();
