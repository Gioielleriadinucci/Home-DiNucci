(() => {
  "use strict";

  document.documentElement.classList.add("has-js");

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionPreference.matches;

  /* Header e menu desktop */
  const header = document.querySelector("#site-header");
  const setHeaderState = () => header?.classList.toggle("is-scrolled", window.scrollY > 18);
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* Pulsante discreto per tornare all'inizio della pagina. */
  const backToTop = document.querySelector(".back-to-top");
  const setBackToTopState = () => {
    const isVisible = window.scrollY > 520;
    backToTop?.classList.toggle("is-visible", isVisible);
    if (backToTop) backToTop.tabIndex = isVisible ? 0 : -1;
  };

  setBackToTopState();
  window.addEventListener("scroll", setBackToTopState, { passive: true });
  backToTop?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  const desktopDropdownTriggers = [...document.querySelectorAll(".nav-dropdown__trigger")];
  const pinnedDesktopDropdowns = new WeakSet();
  const closeDesktopDropdowns = (except = null) => {
    desktopDropdownTriggers.forEach((trigger) => {
      if (trigger === except) return;
      pinnedDesktopDropdowns.delete(trigger);
      trigger.setAttribute("aria-expanded", "false");
    });
  };

  desktopDropdownTriggers.forEach((trigger) => {
    const dropdown = trigger.closest(".nav-dropdown");

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const wasPinned = pinnedDesktopDropdowns.has(trigger);
      closeDesktopDropdowns();

      if (wasPinned) return;

      pinnedDesktopDropdowns.add(trigger);
      trigger.setAttribute("aria-expanded", "true");
    });

    trigger.addEventListener("focus", () => {
      closeDesktopDropdowns(trigger);
      trigger.setAttribute("aria-expanded", "true");
    });

    dropdown?.addEventListener("mouseenter", () => {
      closeDesktopDropdowns(trigger);
      trigger.setAttribute("aria-expanded", "true");
    });

    dropdown?.addEventListener("mouseleave", () => {
      if (!pinnedDesktopDropdowns.has(trigger) && !dropdown.contains(document.activeElement)) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    dropdown?.addEventListener("focusout", (event) => {
      if (!pinnedDesktopDropdowns.has(trigger) && !dropdown.contains(event.relatedTarget)) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    trigger.nextElementSibling?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        pinnedDesktopDropdowns.delete(trigger);
        trigger.setAttribute("aria-expanded", "false");
      });
    });
  });

  document.addEventListener("click", () => closeDesktopDropdowns());

  /* Menu mobile */
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  let mobileMenuReturnFocus = null;

  const closeMobileMenu = (restoreFocus = true) => {
    if (!menuToggle || !mobileMenu) return;
    const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Apri il menu");
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");

    mobileMenu.querySelectorAll(".mobile-submenu-trigger").forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
      if (trigger.nextElementSibling) trigger.nextElementSibling.hidden = true;
    });

    if (wasOpen && restoreFocus && mobileMenuReturnFocus instanceof HTMLElement) {
      mobileMenuReturnFocus.focus({ preventScroll: true });
    }
  };

  menuToggle?.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    if (!willOpen) {
      closeMobileMenu();
      return;
    }

    mobileMenuReturnFocus = document.activeElement;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Chiudi il menu");
    mobileMenu.hidden = false;
    document.body.classList.add("menu-open");
    window.requestAnimationFrame(() => mobileMenu.querySelector("button, a")?.focus());
  });

  document.addEventListener("click", (event) => {
    if (
      menuToggle?.getAttribute("aria-expanded") !== "true" ||
      !mobileMenu ||
      mobileMenu.contains(event.target) ||
      menuToggle.contains(event.target)
    ) return;

    closeMobileMenu(false);
  });

  document.querySelectorAll(".mobile-submenu-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const submenu = trigger.nextElementSibling;
      const willOpen = trigger.getAttribute("aria-expanded") !== "true";

      document.querySelectorAll(".mobile-submenu-trigger").forEach((other) => {
        if (other === trigger) return;
        other.setAttribute("aria-expanded", "false");
        if (other.nextElementSibling) other.nextElementSibling.hidden = true;
      });

      trigger.setAttribute("aria-expanded", String(willOpen));
      if (submenu) submenu.hidden = !willOpen;
    });
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMobileMenu()));
  document.querySelectorAll(".brand, .mobile-catalog").forEach((link) => {
    link.addEventListener("click", () => {
      if (menuToggle?.getAttribute("aria-expanded") === "true") closeMobileMenu(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const activeDropdown = document.activeElement?.closest?.(".nav-dropdown");
      const activeTrigger = activeDropdown?.querySelector(".nav-dropdown__trigger");
      closeDesktopDropdowns();
      if (activeTrigger) {
        activeTrigger.focus({ preventScroll: true });
        activeTrigger.setAttribute("aria-expanded", "false");
      }
      closeMobileMenu();
      return;
    }

    if (event.key !== "Tab" || menuToggle?.getAttribute("aria-expanded") !== "true" || !mobileMenu) return;
    const menuFocusables = [...mobileMenu.querySelectorAll("button:not([disabled]), a[href]")]
      .filter((element) => !element.closest("[hidden]"));
    const brand = document.querySelector(".site-header .brand");
    const mobileCatalog = document.querySelector(".mobile-catalog");
    const focusable = [menuToggle, brand, mobileCatalog, ...menuFocusables]
      .filter((element) => element instanceof HTMLElement && window.getComputedStyle(element).display !== "none");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1020) closeMobileMenu(false);
  });

  /* Entrate: si riattivano a ogni nuovo passaggio nella visuale */
  const earlyRevealElements = [...document.querySelectorAll(".duo-section .reveal, .duo-section .reveal-photo--rise")];
  const revealElements = [...document.querySelectorAll(".reveal, .reveal-photo")]
    .filter((element) => !earlyRevealElements.includes(element));
  const fadeSections = [...document.querySelectorAll(".fade-section")];

  if (reducedMotion || !("IntersectionObserver" in window)) {
    earlyRevealElements.forEach((element) => element.classList.add("is-visible"));
    revealElements.forEach((element) => element.classList.add("is-visible"));
    fadeSections.forEach((section) => section.classList.add("section-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.requestAnimationFrame(() => entry.target.classList.add("is-visible"));
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -4%" });

    revealElements.forEach((element) => revealObserver.observe(element));

    const earlyRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.requestAnimationFrame(() => entry.target.classList.add("is-visible"));
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.02, rootMargin: "0px 0px 10% 0px" });

    earlyRevealElements.forEach((element) => earlyRevealObserver.observe(element));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("section-visible", entry.isIntersecting));
    }, { threshold: 0.08 });

    fadeSections.forEach((section) => sectionObserver.observe(section));
  }

  /* Hero: sei categorie, cambio ogni 2,5 secondi */
  const heroSlides = [...document.querySelectorAll(".hero-slide")];
  let heroIndex = 0;
  let heroTimer;

  // La prima foto e' l'unica necessaria al paint iniziale. Le successive vengono
  // richieste solo quando stanno per essere mostrate, evitando una raffica di
  // download concorrenti al caricamento della pagina.
  const loadHeroSlide = (index) => {
    if (!heroSlides.length) return;
    const slide = heroSlides[(index + heroSlides.length) % heroSlides.length];
    if (slide?.dataset.src && !slide.getAttribute("src")) slide.src = slide.dataset.src;
  };

  const showHeroSlide = (nextIndex) => {
    if (!heroSlides.length) return;
    heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
    loadHeroSlide(heroIndex);
    heroSlides.forEach((slide, index) => slide.classList.toggle("is-active", index === heroIndex));
  };

  const restartHeroTimer = () => {
    window.clearInterval(heroTimer);
    if (reducedMotion || heroSlides.length < 2) return;
    heroTimer = window.setInterval(() => showHeroSlide(heroIndex + 1), 2500);
  };

  restartHeroTimer();
  window.setTimeout(() => loadHeroSlide(heroIndex + 1), 1200);

  /* In mobile allinea il bordo superiore della foto a quello dei CTA. */
  const hero = document.querySelector(".hero");
  const heroActions = document.querySelector(".hero__actions");
  const heroAside = document.querySelector(".hero__aside");
  let heroAsideFrame;

  const syncMobileHeroAsideTop = () => {
    if (!hero || !heroActions || !heroAside) return;

    window.cancelAnimationFrame(heroAsideFrame);
    heroAsideFrame = window.requestAnimationFrame(() => {
      if (window.innerWidth > 780) {
        heroAside.style.removeProperty("--hero-mobile-aside-top");
        return;
      }

      const heroTop = hero.getBoundingClientRect().top;
      const actionsTop = heroActions.getBoundingClientRect().top;
      heroAside.style.setProperty("--hero-mobile-aside-top", `${Math.round(actionsTop - heroTop)}px`);
    });
  };

  syncMobileHeroAsideTop();
  document.fonts?.ready?.then(syncMobileHeroAsideTop);
  window.addEventListener("load", syncMobileHeroAsideTop, { once: true });
  window.addEventListener("resize", syncMobileHeroAsideTop, { passive: true });

  /* Informazioni finanziamento */
  const setFinanceState = (wrap, open) => {
    const button = wrap.querySelector(".finance-note");
    const text = document.querySelector(`#${button?.getAttribute("aria-controls")}`);
    wrap.classList.toggle("is-open", open);
    if (button) {
      if (!button.dataset.closedLabel) button.dataset.closedLabel = button.getAttribute("aria-label") || "Mostra le informazioni sul finanziamento";
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? button.dataset.closedLabel.replace(/^Mostra/, "Nascondi") : button.dataset.closedLabel);
    }
    text?.setAttribute("aria-hidden", String(!open));
  };

  const financeHoverQuery = window.matchMedia("(min-width: 781px) and (hover: hover) and (pointer: fine)");

  document.querySelectorAll(".finance-wrap").forEach((wrap) => {
    const button = wrap.querySelector(".finance-note");
    button?.addEventListener("pointerdown", () => {
      if (financeHoverQuery.matches) {
        button.dataset.pointerWasOpen = button.getAttribute("aria-expanded") || "false";
      }
    });
    button?.addEventListener("click", () => {
      if (!financeHoverQuery.matches) {
        delete button.dataset.pointerWasOpen;
        setFinanceState(wrap, button.getAttribute("aria-expanded") !== "true");
        return;
      }
      const wasOpen = button.dataset.pointerWasOpen;
      delete button.dataset.pointerWasOpen;
      setFinanceState(wrap, wasOpen ? wasOpen !== "true" : button.getAttribute("aria-expanded") !== "true");
    });
    button?.addEventListener("mouseenter", () => {
      if (financeHoverQuery.matches) setFinanceState(wrap, true);
    });
    button?.addEventListener("mouseleave", () => {
      if (financeHoverQuery.matches && !wrap.contains(document.activeElement)) setFinanceState(wrap, false);
    });
    wrap.addEventListener("focusin", () => {
      if (financeHoverQuery.matches) setFinanceState(wrap, true);
    });
    wrap.addEventListener("focusout", (event) => {
      if (financeHoverQuery.matches && !wrap.contains(event.relatedTarget)) setFinanceState(wrap, false);
    });
  });

  /* Fedi e fidanzamento: quattro caroselli di catalogo, sincronizzati in sequenza. */
  const featureCarousels = [...document.querySelectorAll("[data-feature-carousel]")].map((carousel) => {
    const slides = [...carousel.querySelectorAll(".feature-photo__slide")];
    const pagination = [...carousel.querySelectorAll(".feature-photo__pagination i")];
    const previousButton = carousel.querySelector(".feature-photo__arrow--previous");
    const nextButton = carousel.querySelector(".feature-photo__arrow--next");
    const card = carousel.closest(".feature-photo");
    let activeIndex = 0;
    let intervalTimer;
    let initialTimer;
    let pointerId = null;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isDragging = false;
    let suppressNextClick = false;

    if (slides.length) {
      const slideWidth = 100 / slides.length;
      carousel.style.setProperty("--feature-track-width", `${slides.length * 100}%`);
      carousel.style.setProperty("--feature-slide-width", `${slideWidth}%`);
    }

    const show = (nextIndex) => {
      if (!slides.length) return;
      activeIndex = (nextIndex + slides.length) % slides.length;
      carousel.style.setProperty("--feature-slide-offset", `${activeIndex * -(100 / slides.length)}%`);
      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      pagination.forEach((dot, index) => dot.classList.toggle("is-active", index === activeIndex));
    };

    const stop = () => {
      window.clearInterval(intervalTimer);
      window.clearTimeout(initialTimer);
    };

    const start = (firstChangeDelay = 6000, cycleDelay = 24000) => {
      stop();
      if (reducedMotion || document.hidden || slides.length < 2) return;
      initialTimer = window.setTimeout(() => {
        show(activeIndex + 1);
        intervalTimer = window.setInterval(() => show(activeIndex + 1), cycleDelay);
      }, firstChangeDelay);
    };

    previousButton?.addEventListener("click", () => {
      show(activeIndex - 1);
      start();
    });

    nextButton?.addEventListener("click", () => {
      show(activeIndex + 1);
      start();
    });

    carousel.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button") || slides.length < 2) return;
      pointerId = event.pointerId;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      isDragging = false;
      carousel.setPointerCapture?.(pointerId);
      stop();
    });

    carousel.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const horizontalDistance = event.clientX - pointerStartX;
      const verticalDistance = event.clientY - pointerStartY;
      if (Math.abs(horizontalDistance) > 10 && Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
        isDragging = true;
        event.preventDefault();
      }
    });

    const finishSwipe = (event) => {
      if (event.pointerId !== pointerId) return;
      const horizontalDistance = event.clientX - pointerStartX;
      const verticalDistance = event.clientY - pointerStartY;
      const wasSwipe = isDragging && Math.abs(horizontalDistance) > 40 && Math.abs(horizontalDistance) > Math.abs(verticalDistance);
      if (wasSwipe) show(activeIndex + (horizontalDistance < 0 ? 1 : -1));
      suppressNextClick = isDragging;
      pointerId = null;
      isDragging = false;
      window.setTimeout(() => { suppressNextClick = false; }, 0);
      start();
    };

    carousel.addEventListener("pointerup", finishSwipe);
    carousel.addEventListener("pointercancel", (event) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      isDragging = false;
      start();
    });

    carousel.addEventListener("click", (event) => {
      if (!suppressNextClick) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);

    card?.addEventListener("mouseenter", stop);
    card?.addEventListener("mouseleave", start);
    card?.addEventListener("focusin", stop);
    card?.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) start();
    });

    show(0);
    return { start, stop };
  });

  const startFeatureCarousels = () => {
    const changeDelay = 6000;
    const cycleDelay = featureCarousels.length * changeDelay;
    featureCarousels.forEach((carousel, index) => carousel.start((index + 1) * changeDelay, cycleDelay));
  };

  const stopFeatureCarousels = () => featureCarousels.forEach((carousel) => carousel.stop());

  startFeatureCarousels();

  /* Cinque immagini della storia, senza selettore */
  const storySlides = [...document.querySelectorAll(".story-slide")];
  const storyPlay = document.querySelector("#story-play");
  let storyIndex = 0;
  let storyTimer;
  let storyPaused = false;

  const showStorySlide = (nextIndex) => {
    if (!storySlides.length) return;
    storyIndex = (nextIndex + storySlides.length) % storySlides.length;
    storySlides.forEach((slide, index) => {
      const active = index === storyIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
  };

  const restartStoryTimer = () => {
    window.clearInterval(storyTimer);
    if (reducedMotion || storyPaused || storySlides.length < 2) return;
    storyTimer = window.setInterval(() => showStorySlide(storyIndex + 1), 4500);
  };

  storyPlay?.addEventListener("click", () => {
    storyPaused = !storyPaused;
    storyPlay.setAttribute("aria-pressed", String(storyPaused));
    storyPlay.setAttribute("aria-label", storyPaused ? "Riprendi le immagini della storia" : "Metti in pausa le immagini della storia");
    if (storyPaused) window.clearInterval(storyTimer);
    else restartStoryTimer();
  });

  if (reducedMotion && storyPlay) {
    storyPlay.hidden = true;
    storyPlay.disabled = true;
  }

  showStorySlide(0);
  restartStoryTimer();


  /* Recensioni miste: scorrimento continuo e lettura estesa senza alzare la sezione. */
  const reviewsCarousel = document.querySelector("[data-review-carousel]");
  const reviewsTrack = document.querySelector("[data-review-track]");
  const reviewCards = [...(reviewsTrack?.querySelectorAll(".google-review-card") || [])];
  const reviewReader = document.querySelector("[data-review-reader]");
  const reviewReaderTitle = reviewReader?.querySelector("[data-review-reader-title]");
  const reviewReaderSource = reviewReader?.querySelector("[data-review-reader-source]");
  const reviewReaderMeta = reviewReader?.querySelector("[data-review-reader-meta]");
  const reviewReaderText = reviewReader?.querySelector("[data-review-reader-text]");
  const reviewsMobileQuery = window.matchMedia("(max-width: 780px)");
  const reviewAutoScrollSpeed = 62;
  const reviewLongPressDelay = 2000;
  let reviewsResumeTimer;
  let reviewsAutoFrame;
  let reviewsAutoTimestamp;
  let reviewLongPressTimer;
  let reviewClickGuardTimer;
  let reviewPointerId = null;
  let reviewPointerStartX = 0;
  let reviewPointerStartY = 0;
  let reviewPointerActive = false;
  let reviewLongPressActive = false;
  let suppressReviewClick = false;
  let reviewReaderTrigger;
  let reviewReaderCard;

  if (reviewReader && reviewReader.parentElement !== document.body) {
    document.body.append(reviewReader);
  }

  reviewCards.forEach((card) => {
    const authorElement = card.querySelector(".google-review-card__head strong");
    const metaElement = card.querySelector(".google-review-card__head small");
    if (!authorElement || !metaElement) return;

    const source = authorElement.textContent.trim();
    const [author, ...dateParts] = metaElement.textContent.trim().split(/\s*\u00b7\s*/);
    const date = dateParts.join(" \u00b7 ");

    authorElement.textContent = author;
    metaElement.textContent = [source, date].filter(Boolean).join(" \u00b7 ");
  });

  const pauseReviews = () => {
    window.clearTimeout(reviewsResumeTimer);
    reviewsCarousel?.classList.add("is-paused");
  };

  const resumeReviews = (delay = 900, force = false) => {
    window.clearTimeout(reviewsResumeTimer);
    reviewsResumeTimer = window.setTimeout(() => {
      if (reviewsCarousel?.classList.contains("has-open-review")) return;
      if (!force && reviewsCarousel?.contains(document.activeElement)) return;
      reviewsCarousel?.classList.remove("is-paused");
    }, delay);
  };

  const normalizeReviewScroll = () => {
    if (!reviewsCarousel || !reviewsTrack || !reviewsMobileQuery.matches) return;
    const loopWidth = reviewsTrack.scrollWidth / 2;
    if (!loopWidth) return;
    while (reviewsCarousel.scrollLeft >= loopWidth) reviewsCarousel.scrollLeft -= loopWidth;
  };

  const runReviewsAutoScroll = (timestamp) => {
    if (reviewsAutoTimestamp === undefined) reviewsAutoTimestamp = timestamp;
    const elapsed = Math.min(timestamp - reviewsAutoTimestamp, 64);
    reviewsAutoTimestamp = timestamp;

    if (
      reviewsMobileQuery.matches &&
      !reducedMotion &&
      !document.hidden &&
      !reviewPointerActive &&
      !reviewsCarousel?.classList.contains("is-paused")
    ) {
      reviewsCarousel.scrollLeft += reviewAutoScrollSpeed * (elapsed / 1000);
      normalizeReviewScroll();
    }

    reviewsAutoFrame = window.requestAnimationFrame(runReviewsAutoScroll);
  };

  const restartReviewsAutoScroll = () => {
    window.cancelAnimationFrame(reviewsAutoFrame);
    reviewsAutoTimestamp = undefined;
    if (!reviewsMobileQuery.matches || reducedMotion || document.hidden || !reviewsCarousel) return;
    reviewsAutoFrame = window.requestAnimationFrame(runReviewsAutoScroll);
  };

  const stopReviewsAutoScroll = () => {
    window.cancelAnimationFrame(reviewsAutoFrame);
    reviewsAutoFrame = undefined;
    reviewsAutoTimestamp = undefined;
  };

  const syncReviewsMode = () => {
    if (!reviewsCarousel) return;
    reviewsCarousel.scrollLeft = 0;
    restartReviewsAutoScroll();
  };

  const positionReviewReader = (card) => {
    if (!reviewReader || !card) return;
    const cardRect = card.getBoundingClientRect();
    const viewportGutter = 12;
    const width = Math.min(cardRect.width, window.innerWidth - viewportGutter * 2);
    const left = Math.min(
      Math.max(cardRect.left, viewportGutter),
      window.innerWidth - width - viewportGutter
    );

    reviewReader.style.setProperty("--review-reader-top", `${cardRect.bottom + window.scrollY + 8}px`);
    reviewReader.style.setProperty("--review-reader-left", `${left + window.scrollX}px`);
    reviewReader.style.setProperty("--review-reader-width", `${width}px`);
  };

  reviewCards.forEach((card) => {
    const review = card.querySelector("[data-review-text]");
    if (!review) return;

    if (card.dataset.reviewTitle) {
      const cardTitle = document.createElement("h3");
      cardTitle.className = "google-review-card__title";
      cardTitle.textContent = card.dataset.reviewTitle;
      review.insertAdjacentElement("beforebegin", cardTitle);
    }

    const fullText = review.textContent.trim().replace(/\s+/g, " ");
    review.textContent = fullText;
    review.dataset.fullText = fullText;

    const moreButton = document.createElement("button");
    moreButton.className = "review-more";
    moreButton.type = "button";
    moreButton.textContent = "Leggi tutto";
    moreButton.hidden = true;
    moreButton.setAttribute("aria-controls", "review-reader");
    moreButton.setAttribute("aria-expanded", "false");
    review.insertAdjacentElement("afterend", moreButton);
  });

  const openReviewReader = (card, trigger) => {
    if (!reviewReader || !card || !trigger) return;
    const author = card.querySelector(".google-review-card__head strong")?.textContent.trim() || "Esperienza del cliente";
    const meta = card.querySelector(".google-review-card__head small")?.textContent.trim() || "Recensione";
    const [source, ...dateParts] = meta.split(/\s*\u00b7\s*/);
    const date = dateParts.join(" \u00b7 ");
    const rating = card.querySelector(".google-review-card__head i")?.textContent.trim();
    const fullText = card.querySelector("[data-review-text]")?.dataset.fullText || "";

    if (reviewReaderSource) reviewReaderSource.textContent = rating && rating !== "—" ? `${source} · ${rating} su 5` : source;
    if (reviewReaderTitle) reviewReaderTitle.textContent = card.dataset.reviewTitle || `Recensione di ${author}`;
    if (reviewReaderMeta) reviewReaderMeta.textContent = [author, date].filter(Boolean).join(" · ");
    if (reviewReaderText) {
      reviewReaderText.textContent = fullText;
      reviewReaderText.scrollTop = 0;
    }

    reviewReaderTrigger?.setAttribute("aria-expanded", "false");
    reviewReaderTrigger = trigger;
    reviewReaderCard = card;
    reviewReaderTrigger.setAttribute("aria-expanded", "true");
    pauseReviews();
    positionReviewReader(card);
    reviewReader.hidden = false;
    reviewsCarousel?.classList.add("has-open-review");
    reviewReader.querySelector("[data-review-reader-close]")?.focus({ preventScroll: true });
  };

  const closeReviewReader = ({ restoreFocus = true } = {}) => {
    if (!reviewReader || reviewReader.hidden) return;
    reviewReader.hidden = true;
    reviewsCarousel?.classList.remove("has-open-review");
    reviewReaderTrigger?.setAttribute("aria-expanded", "false");

    if (restoreFocus && reviewReaderTrigger?.isConnected && !reviewReaderTrigger.closest("[data-review-clone]")) {
      reviewReaderTrigger.focus({ preventScroll: true });
    } else if (restoreFocus) {
      reviewsCarousel?.focus({ preventScroll: true });
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    reviewReaderTrigger = null;
    reviewReaderCard = null;
    resumeReviews(350);
  };

  reviewsTrack?.addEventListener("click", (event) => {
    const trigger = event.target.closest(".review-more");
    if (!trigger) return;
    openReviewReader(trigger.closest(".google-review-card"), trigger);
  });

  const updateReviewOverflow = () => {
    reviewsTrack?.querySelectorAll(".google-review-card").forEach((card) => {
      const review = card.querySelector("[data-review-text]");
      const moreButton = card.querySelector(".review-more");
      if (!review || !moreButton) return;
      moreButton.hidden = review.scrollHeight <= review.clientHeight + 1;
    });
  };

  if (reviewsTrack && reviewCards.length) {
    reviewsTrack.style.setProperty("--review-duration", `${Math.max(42, reviewCards.length * 5)}s`);

    reviewCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("aria-label");
      clone.dataset.reviewClone = "true";
      clone.querySelectorAll("a, button").forEach((control) => { control.tabIndex = -1; });
      reviewsTrack.appendChild(clone);
    });

    window.requestAnimationFrame(updateReviewOverflow);
    document.fonts?.ready?.then(updateReviewOverflow);
    window.addEventListener("resize", () => {
      updateReviewOverflow();
      if (reviewReaderCard && reviewReader && !reviewReader.hidden) positionReviewReader(reviewReaderCard);
    }, { passive: true });

    restartReviewsAutoScroll();
  }

  reviewsMobileQuery.addEventListener?.("change", syncReviewsMode);
  reviewsCarousel?.addEventListener("focusin", () => {
    if (reviewsMobileQuery.matches && reviewPointerActive) return;
    pauseReviews();
  });
  reviewsCarousel?.addEventListener("focusout", (event) => {
    if (reviewsCarousel.contains(event.relatedTarget)) return;
    resumeReviews();
  });
  reviewsCarousel?.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary) return;

    if (!reviewsMobileQuery.matches || event.pointerType === "mouse") {
      pauseReviews();
      return;
    }

    window.clearTimeout(reviewLongPressTimer);
    window.clearTimeout(reviewClickGuardTimer);
    suppressReviewClick = false;
    reviewPointerId = event.pointerId;
    reviewPointerStartX = event.clientX;
    reviewPointerStartY = event.clientY;
    reviewPointerActive = true;
    reviewLongPressActive = false;
    reviewLongPressTimer = window.setTimeout(() => {
      if (!reviewPointerActive) return;
      reviewLongPressActive = true;
      suppressReviewClick = true;
      pauseReviews();
    }, reviewLongPressDelay);
  });

  reviewsCarousel?.addEventListener("pointermove", (event) => {
    if (!reviewPointerActive || event.pointerId !== reviewPointerId) return;
    const movedX = event.clientX - reviewPointerStartX;
    const movedY = event.clientY - reviewPointerStartY;
    if (Math.hypot(movedX, movedY) > 10) window.clearTimeout(reviewLongPressTimer);
  });

  const finishReviewPointer = (event) => {
    if (!reviewsMobileQuery.matches || event.pointerType === "mouse") {
      resumeReviews(300);
      return;
    }
    if (event.pointerId !== reviewPointerId) return;

    window.clearTimeout(reviewLongPressTimer);
    reviewPointerActive = false;
    reviewPointerId = null;
    normalizeReviewScroll();
    if (reviewLongPressActive) {
      resumeReviews(120, true);
      reviewClickGuardTimer = window.setTimeout(() => { suppressReviewClick = false; }, 500);
    }
    reviewLongPressActive = false;
  };

  reviewsCarousel?.addEventListener("pointerup", finishReviewPointer);
  reviewsCarousel?.addEventListener("pointercancel", finishReviewPointer);
  reviewsCarousel?.addEventListener("click", (event) => {
    if (!suppressReviewClick) return;
    suppressReviewClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  reviewReader?.querySelector("[data-review-reader-close]")?.addEventListener("click", (event) => {
    closeReviewReader({ restoreFocus: event.detail === 0 });
  });
  document.addEventListener("pointerdown", (event) => {
    if (!reviewReader || reviewReader.hidden || reviewReader.contains(event.target)) return;
    closeReviewReader({ restoreFocus: false });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !reviewReader?.hidden) closeReviewReader();
  });

  /* Timeline Novara: quattro tappe, passaggio ogni 12 secondi */
  const timelineData = [
    {
      titleLead: "Le origini",
      titleEmphasis: "a Novara",
      image: null,
      alt: "Corso Cavour a Novara nei primi del Novecento",
      caption: "Corso Cavour · primi del Novecento",
      description: "Nel dopoguerra Pacifico e Giulia diventano un punto di riferimento per l'oreficeria e l'argenteria piemontese, con sede in Corso Cavour 11.",
      position: "12.5%",
      photoLeft: "calc(var(--timeline-control-rail) + var(--timeline-control-gap))",
      descriptionSide: "right",
      contain: false,
      objectPosition: "center 20%",
      enterFrom: "left"
    },
    {
      titleLead: "La gioielleria",
      titleEmphasis: "di famiglia",
      image: null,
      alt: "Veduta aerea in bianco e nero di Viale Roma a Novara nel 1991",
      caption: "Viale Roma vista dall'alto, 1991",
      description: "A metà degli anni '70 la famiglia lascia l'attività di grossista e apre la Gioielleria-Argenteria Di Nucci in Viale Roma, dove resterà per 45 anni.",
      position: "37.5%",
      photoLeft: "calc(var(--timeline-control-rail) + var(--timeline-control-gap) + clamp(0px, 1.5vw, 24px))",
      descriptionSide: "right",
      contain: false,
      objectPosition: "center center",
      enterFrom: "left"
    },
    {
      titleLead: "La terza",
      titleEmphasis: "generazione",
      image: null,
      alt: "Mani che sistemano anelli in un espositore",
      caption: "L'ingresso della terza generazione",
      description: "Nel 2000 Giorgia entra in gioielleria e raccoglie un patrimonio fatto di onestà, professionalità, serietà e competenza.",
      position: "62.5%",
      photoLeft: "calc(100% - var(--timeline-control-rail) - var(--timeline-control-gap) - var(--timeline-photo-width) - clamp(0px, 1.5vw, 24px))",
      descriptionSide: "left",
      contain: false,
      enterFrom: "left"
    },
    {
      titleLead: "Il ritorno in centro a",
      titleEmphasis: "Novara",
      image: "images/esterno-di-nucci-hero.webp",
      alt: "L'ingresso della Gioielleria Di Nucci in Corso Cavour 10C",
      caption: "2018 · Il ritorno in Corso Cavour",
      description: "Nel settembre 2018 la gioielleria torna dove tutto ha avuto origine: la nuova sede apre in Corso Cavour 10C, nel cuore di Novara.",
      position: "87.5%",
      photoLeft: "calc(100% - var(--timeline-control-rail) - var(--timeline-control-gap) - var(--timeline-photo-width))",
      descriptionSide: "left",
      contain: true,
      objectPosition: "center center",
      enterFrom: "right"
    }
  ];

  const timelineSteps = [...document.querySelectorAll(".timeline-step")];
  const timelineSection = document.querySelector(".novara-section");
  const timelineImage = document.querySelector("#timeline-image");
  const timelineCaption = document.querySelector("#timeline-caption");
  const timelineDescription = document.querySelector("#timeline-description");
  const timelineFeature = document.querySelector(".timeline-feature");
  const timelineVisual = document.querySelector("#timeline-visual");
  const timelineTitleLead = document.querySelector("#timeline-title-lead");
  const timelineTitleEmphasis = document.querySelector("#timeline-title-emphasis");
  const timelineProgress = document.querySelector(".timeline__line i");
  const timelineScroller = document.querySelector(".timeline");
  const timelineControls = document.querySelector(".timeline-controls");
  const timelinePrevious = document.querySelector("#timeline-previous");
  const timelineNext = document.querySelector("#timeline-next");
  const timelineWhatsapp = document.querySelector("#timeline-whatsapp");
  let timelineIndex = 0;
  let timelineTimer;
  let timelineTransitionTimer;
  let timelineScrollFrame;
  let timelineScrollUnlockTimer;
  let timelineProgrammaticScroll = false;

  const syncTimelineNarrativeTop = () => {
    if (!timelineFeature || !timelineVisual || !timelineImage || window.innerWidth <= 780) {
      timelineFeature?.style.removeProperty("--timeline-narrative-top");
      return;
    }

    const imageTop = timelineVisual.offsetTop + timelineImage.offsetTop;
    timelineFeature.style.setProperty("--timeline-narrative-top", `${imageTop}px`);
  };

  const showTimeline = (nextIndex, restart = false, immediate = false, syncScroller = true) => {
    const targetIndex = (nextIndex + timelineData.length) % timelineData.length;
    const data = timelineData[targetIndex];
    timelineIndex = targetIndex;
    window.clearTimeout(timelineTransitionTimer);

    timelineSteps.forEach((step, index) => {
      const active = index === targetIndex;
      step.classList.toggle("is-active", active);
      step.setAttribute("aria-pressed", String(active));
    });

    timelineSection?.style.setProperty("--timeline-position", data.position);
    timelineSection?.style.setProperty("--timeline-photo-left", data.photoLeft);
    timelineFeature?.classList.toggle("is-description-left", data.descriptionSide === "left");
    timelineFeature?.classList.toggle("is-description-right", data.descriptionSide !== "left");
    timelineFeature?.classList.toggle("is-mobile-reversed", targetIndex % 2 === 1);
    window.requestAnimationFrame(syncTimelineNarrativeTop);
    if (timelineProgress) timelineProgress.style.width = `${(targetIndex * 25) + 12.5}%`;
    timelineDescription?.classList.add("is-changing");
    timelineControls?.classList.add("is-changing");

    if (timelineScroller && window.innerWidth <= 780 && syncScroller) {
      const activeStep = timelineSteps[targetIndex];
      const targetLeft = activeStep.offsetLeft + activeStep.offsetWidth / 2 - timelineScroller.clientWidth / 2;
      timelineProgrammaticScroll = true;
      window.clearTimeout(timelineScrollUnlockTimer);
      timelineScroller.scrollTo({ left: Math.max(0, targetLeft), behavior: immediate || reducedMotion ? "auto" : "smooth" });
      timelineScrollUnlockTimer = window.setTimeout(() => {
        timelineProgrammaticScroll = false;
      }, immediate || reducedMotion ? 80 : 750);
    }

    const updateContent = () => {
      const focusedControl = document.activeElement;
      if (timelineTitleLead) timelineTitleLead.textContent = data.titleLead;
      if (timelineTitleEmphasis) timelineTitleEmphasis.textContent = data.titleEmphasis;
      if (timelineDescription) {
        timelineDescription.textContent = data.description;
        timelineDescription.classList.remove("is-changing");
      }
      if (timelinePrevious) timelinePrevious.hidden = targetIndex === 0;
      if (timelineNext) timelineNext.hidden = targetIndex === timelineData.length - 1;
      if (timelineWhatsapp) timelineWhatsapp.hidden = targetIndex !== timelineData.length - 1;
      timelineControls?.classList.remove("is-changing");

      if (focusedControl === timelinePrevious && timelinePrevious?.hidden) {
        timelineNext?.focus({ preventScroll: true });
      } else if (focusedControl === timelineNext && timelineNext?.hidden) {
        timelineWhatsapp?.focus({ preventScroll: true });
      }
      if (timelineCaption) timelineCaption.textContent = data.caption;
      timelineVisual?.style.setProperty("--timeline-frame-aspect", data.frameAspect || "16 / 9");
      if (timelineImage) {
        timelineImage.hidden = !data.image;
        if (!data.image) {
          timelineImage.removeAttribute("src");
          timelineImage.alt = "";
          return;
        }
        timelineImage.classList.remove("from-left", "from-right", "fit-contain");
        timelineImage.onerror = data.fallbackImage
          ? () => {
              timelineImage.onerror = null;
              timelineImage.src = data.fallbackImage;
            }
          : null;
        timelineImage.src = data.image;
        timelineImage.alt = data.alt;
        timelineImage.style.objectPosition = data.objectPosition || "center";
        timelineImage.classList.toggle("fit-contain", data.contain);
        void timelineImage.offsetWidth;
        if (!immediate && !reducedMotion) timelineImage.classList.add(data.enterFrom === "right" ? "from-right" : "from-left");
      }
    };

    if (immediate || reducedMotion) updateContent();
    else timelineTransitionTimer = window.setTimeout(updateContent, 190);

    if (restart) restartTimelineTimer();
  };

  const restartTimelineTimer = () => {
    window.clearInterval(timelineTimer);
    if (reducedMotion || timelineData.length < 2) return;
    timelineTimer = window.setInterval(() => showTimeline(timelineIndex + 1), 12000);
  };

  timelineSteps.forEach((step) => {
    step.addEventListener("click", () => showTimeline(Number(step.dataset.timelineIndex), true));
  });

  timelinePrevious?.addEventListener("click", () => {
    if (timelineIndex > 0) showTimeline(timelineIndex - 1, true);
  });

  timelineNext?.addEventListener("click", () => {
    if (timelineIndex < timelineData.length - 1) showTimeline(timelineIndex + 1, true);
  });

  timelineScroller?.addEventListener("pointerdown", () => {
    timelineProgrammaticScroll = false;
    window.clearTimeout(timelineScrollUnlockTimer);
  }, { passive: true });

  timelineScroller?.addEventListener("scroll", () => {
    if (window.innerWidth > 780 || timelineProgrammaticScroll) return;
    window.cancelAnimationFrame(timelineScrollFrame);
    timelineScrollFrame = window.requestAnimationFrame(() => {
      if (timelineProgrammaticScroll) return;
      const scrollerCenter = timelineScroller.scrollLeft + (timelineScroller.clientWidth / 2);
      const nearestIndex = timelineSteps.reduce((closestIndex, step, index) => {
        const stepCenter = step.offsetLeft + (step.offsetWidth / 2);
        const closestStep = timelineSteps[closestIndex];
        const closestCenter = closestStep.offsetLeft + (closestStep.offsetWidth / 2);
        return Math.abs(stepCenter - scrollerCenter) < Math.abs(closestCenter - scrollerCenter) ? index : closestIndex;
      }, 0);

      if (nearestIndex !== timelineIndex) showTimeline(nearestIndex, true, false, false);
    });
  }, { passive: true });

  showTimeline(0, false, true);
  restartTimelineTimer();

  /* Contatti: tre fotografie alternate */
  const contactBackgrounds = [...document.querySelectorAll(".contact-bg")];
  const contactIndicators = [...document.querySelectorAll(".contact-slides-indicator span")];
  let contactIndex = 0;
  let contactTimer;

  const showContactBackground = (nextIndex) => {
    if (!contactBackgrounds.length) return;
    contactIndex = (nextIndex + contactBackgrounds.length) % contactBackgrounds.length;
    contactBackgrounds.forEach((image, index) => image.classList.toggle("is-active", index === contactIndex));
    contactIndicators.forEach((indicator, index) => indicator.classList.toggle("is-active", index === contactIndex));
  };

  const restartContactTimer = () => {
    window.clearInterval(contactTimer);
    if (reducedMotion || contactBackgrounds.length < 2) return;
    contactTimer = window.setInterval(() => showContactBackground(contactIndex + 1), 5200);
  };

  restartContactTimer();

  /* Sospende gli automatismi quando la pagina non è visibile. */
  const stopAutomaticMotion = () => {
    [heroTimer, storyTimer, timelineTimer, contactTimer].forEach((timer) => window.clearInterval(timer));
    stopFeatureCarousels();
    stopReviewsAutoScroll();
    window.clearTimeout(reviewsResumeTimer);
    window.clearTimeout(reviewLongPressTimer);
    window.clearTimeout(timelineTransitionTimer);
    showTimeline(timelineIndex, false, true);
  };

  const startAutomaticMotion = () => {
    restartHeroTimer();
    restartStoryTimer();
    startFeatureCarousels();
    restartReviewsAutoScroll();
    restartTimelineTimer();
    restartContactTimer();
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutomaticMotion();
    else if (!reducedMotion) startAutomaticMotion();
  });

  motionPreference.addEventListener?.("change", (event) => {
    reducedMotion = event.matches;
    if (storyPlay) {
      storyPlay.hidden = reducedMotion;
      storyPlay.disabled = reducedMotion;
    }

    if (reducedMotion) {
      stopAutomaticMotion();
      document.querySelectorAll(".reveal, .reveal-photo").forEach((element) => element.classList.add("is-visible"));
      document.querySelectorAll(".fade-section").forEach((section) => section.classList.add("section-visible"));
    } else if (!document.hidden) {
      startAutomaticMotion();
    }

  });

  /* Mantiene allineati i componenti quando cambia il breakpoint. */
  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      normalizeReviewScroll();
      syncTimelineNarrativeTop();
    }, 140);
  });

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
