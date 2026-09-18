/*
 * Catalogo delle pagine marchio: dato un marchio e una categoria, stampa i prodotti nel rail
 * corrispondente. Nessuna copertina e nessun selettore di categoria — ogni categoria è una
 * sezione della pagina, con il suo H2. Markup della scheda, frecce, snap, trascinamento e barra
 * di avanzamento sono quelli di catalog-controller.js.
 */
(() => {
  "use strict";

  const brands = Array.isArray(window.catalogBrandData) ? window.catalogBrandData : [];
  const rails = [...document.querySelectorAll("[data-brand-rail]")];
  if (!brands.length || !rails.length) return;

  // main.js non monta il proprio controller su un catalogo già gestito.
  window.catalogBrandCatalogManaged = true;

  // In catalog-data.js le immagini sono relative alla radice del sito. Le pagine marchio stanno
  // due livelli sotto: window.catalogBase, dichiarato nella pagina, riporta i percorsi a posto.
  const assetBase = window.catalogBase || "";
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const refreshers = [];

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const productMarkup = (product) => `
    <li class="product-card" data-product-source="${escapeHtml(product.source)}">
      <figure>
        <img src="${assetBase + "images/placeholder-di-nucci.png"}" alt="" loading="lazy" decoding="async">
        <span class="product-brand-badge" aria-hidden="true">${escapeHtml(product.badge)}</span>
      </figure>
      <small>${escapeHtml(product.brand)} &middot; ${escapeHtml(product.collection || product.category)}</small>
      <h4>${escapeHtml(product.title)}</h4>
    </li>
  `;

  const getItemsPerView = () => window.innerWidth <= 1020 ? 2 : 3;

  rails.forEach((rail) => {
    const brand = brands.find((entry) => entry.id === rail.dataset.brandRail);
    const category = brand?.categories.find((entry) => entry.id === rail.dataset.brandCategory);
    const viewport = rail.querySelector("[data-catalog-viewport]");
    const track = viewport?.querySelector(".catalog-track");
    const status = rail.querySelector("[data-catalog-status]");
    const progress = rail.querySelector("[data-catalog-progress]");
    if (!category || !track || !status || !progress) return;

    let firstVisible = 0;
    let scrollFrame = 0;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let isDragging = false;
    let didDrag = false;

    const previousButton = document.createElement("button");
    const nextButton = document.createElement("button");
    previousButton.className = "catalog-control catalog-control--previous";
    nextButton.className = "catalog-control catalog-control--next";
    previousButton.type = "button";
    nextButton.type = "button";
    previousButton.textContent = "‹";
    nextButton.textContent = "›";
    previousButton.setAttribute("aria-controls", track.id);
    nextButton.setAttribute("aria-controls", track.id);
    previousButton.setAttribute("aria-label", `Prodotti precedenti di ${category.name}, ${brand.name}`);
    nextButton.setAttribute("aria-label", `Altri prodotti di ${category.name}, ${brand.name}`);
    rail.append(previousButton, nextButton);

    const getCards = () => [...track.querySelectorAll(".product-card")];

    const updateControls = () => {
      const cards = getCards();
      const visible = getItemsPerView();
      const maximum = Math.max(0, cards.length - visible);
      firstVisible = Math.min(firstVisible, maximum);
      const lastVisible = Math.min(cards.length, firstVisible + visible);

      status.textContent = cards.length ? `${firstVisible + 1}–${lastVisible} di ${cards.length}` : "";
      const maximumScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const scrollProgress = maximumScroll ? Math.min(1, Math.max(0, viewport.scrollLeft / maximumScroll)) : 1;
      const visibleRatio = viewport.scrollWidth ? Math.min(1, viewport.clientWidth / viewport.scrollWidth) : 1;
      progress.style.width = `${(visibleRatio + scrollProgress * (1 - visibleRatio)) * 100}%`;
      previousButton.disabled = firstVisible <= 0;
      nextButton.disabled = firstVisible >= maximum;
      rail.classList.toggle("is-static", cards.length <= visible);
    };

    const goTo = (index, announce = true, immediate = false) => {
      const cards = getCards();
      const maximum = Math.max(0, cards.length - getItemsPerView());
      firstVisible = Math.max(0, Math.min(index, maximum));
      const target = cards[firstVisible];

      if (target) {
        viewport.scrollTo({
          left: target.offsetLeft - (cards[0]?.offsetLeft || 0),
          behavior: immediate || reducedMotionQuery.matches ? "auto" : "smooth"
        });
      }

      if (!announce) status.setAttribute("aria-live", "off");
      updateControls();
      window.requestAnimationFrame(() => status.removeAttribute("aria-live"));
    };

    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      goTo(firstVisible + (event.key === "ArrowRight" ? 1 : -1) * getItemsPerView());
    });

    previousButton.addEventListener("click", () => goTo(firstVisible - getItemsPerView()));
    nextButton.addEventListener("click", () => goTo(firstVisible + getItemsPerView()));

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      isDragging = true;
      didDrag = false;
      dragStartX = event.clientX;
      dragStartScroll = viewport.scrollLeft;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      const distance = event.clientX - dragStartX;
      if (Math.abs(distance) > 4) didDrag = true;
      viewport.scrollLeft = dragStartScroll - distance * 1.45;
    });

    const finishDrag = (event) => {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove("is-dragging");
      if (viewport.hasPointerCapture?.(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    };

    viewport.addEventListener("pointerup", finishDrag);
    viewport.addEventListener("pointercancel", finishDrag);
    viewport.addEventListener("click", (event) => {
      if (!didDrag) return;
      event.preventDefault();
      didDrag = false;
    }, true);

    viewport.addEventListener("wheel", (event) => {
      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!horizontalIntent && !event.shiftKey) return;
      const distance = event.shiftKey ? event.deltaY : event.deltaX;
      if (!distance) return;
      event.preventDefault();
      viewport.scrollLeft += distance * 1.25;
    }, { passive: false });

    viewport.addEventListener("scroll", () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const cards = getCards();
        let closest = 0;
        let distance = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const nextDistance = Math.abs((card.offsetLeft - (cards[0]?.offsetLeft || 0)) - viewport.scrollLeft);
          if (nextDistance < distance) {
            closest = index;
            distance = nextDistance;
          }
        });
        firstVisible = Math.min(closest, Math.max(0, cards.length - getItemsPerView()));
        updateControls();
      });
    }, { passive: true });

    track.innerHTML = category.products.map(productMarkup).join("");
    window.requestAnimationFrame(updateControls);
    refreshers.push(() => goTo(firstVisible, false, true));
  });

  const refreshAll = () => refreshers.forEach((refresh) => refresh());
  window.addEventListener("resize", refreshAll, { passive: true });
  reducedMotionQuery.addEventListener?.("change", refreshAll);
})();
