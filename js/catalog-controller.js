(() => {
  "use strict";

  const brands = Array.isArray(window.catalogBrandData) ? window.catalogBrandData : [];
  const catalogList = document.querySelector(".catalog-list--brands");
  if (!brands.length || !catalogList) return;

  window.catalogBrandCatalogManaged = true;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 780px)");
  const controllers = [];

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const productMarkup = (product) => `
    <li class="product-card" data-product-source="${escapeHtml(product.source)}">
      <figure>
        <img src="${(window.catalogBase || "") + "images/placeholder-di-nucci.png"}" alt="" loading="lazy" decoding="async">
        <span class="product-brand-badge" aria-hidden="true">${escapeHtml(product.badge)}</span>
      </figure>
      <small>${escapeHtml(product.brand)} &middot; ${escapeHtml(product.collection || product.category)}</small>
      <h4>${escapeHtml(product.title)}</h4>
    </li>
  `;

  const exhibitorMarkup = (brand, brandIndex) => {
    const titleId = `catalog-${brand.id}-title`;
    const trackId = `catalog-track-${brand.id}`;
    const categoryTrackId = `catalog-categories-${brand.id}`;

    return `
      <article class="catalog-exhibitor catalog-exhibitor--brand reveal is-visible"
        id="catalog-${escapeHtml(brand.id)}"
        data-catalog-exhibitor
        data-catalog-brand="${escapeHtml(brand.id)}"
        aria-labelledby="${titleId}">
        ${brand.page
          ? `<a class="catalog-exhibitor__cover" href="${escapeHtml(brand.page)}" aria-label="Scopri la collezione ${escapeHtml(brand.name)}">`
          : `<div class="catalog-exhibitor__cover">`}
          <img src="${(window.catalogBase || "") + "images/placeholder-di-nucci.png"}" alt="" loading="lazy" decoding="async">
          <span class="catalog-exhibitor__wash" aria-hidden="true"></span>
          <div class="catalog-exhibitor__label">
            <h3 id="${titleId}">${escapeHtml(brand.name)}</h3>
            ${brand.page ? `<span class="catalog-exhibitor__link-arrow" aria-hidden="true">↗</span>` : ""}
          </div>
        ${brand.page ? `</a>` : `</div>`}
        <nav class="catalog-category-selector" aria-label="Categorie ${escapeHtml(brand.name)}">
          <span class="catalog-category-indicator" aria-hidden="true"></span>
          <button class="catalog-category-control catalog-category-control--previous" type="button"
            aria-label="Categorie precedenti ${escapeHtml(brand.name)}" aria-controls="${categoryTrackId}">‹</button>
          <div class="catalog-category-selector__track" id="${categoryTrackId}" role="tablist" aria-orientation="vertical"
            data-catalog-category-tabs data-brand-index="${brandIndex}"></div>
          <button class="catalog-category-control catalog-category-control--next" type="button"
            aria-label="Categorie successive ${escapeHtml(brand.name)}" aria-controls="${categoryTrackId}">›</button>
        </nav>
        <div class="catalog-rail" role="region" aria-roledescription="carosello"
          aria-label="Prodotti ${escapeHtml(brand.name)}">
          <div class="catalog-viewport" data-catalog-viewport tabindex="0">
            <ul class="catalog-track" id="${trackId}"></ul>
          </div>
          <div class="catalog-progress" aria-hidden="true"><span data-catalog-progress></span></div>
          <p class="sr-only" data-catalog-status aria-live="polite"></p>
        </div>
      </article>
    `;
  };

  catalogList.innerHTML = brands.map(exhibitorMarkup).join("");

  const getItemsPerView = () => window.innerWidth <= 1020 ? 2 : 3;

  brands.forEach((brand, brandIndex) => {
    const exhibitor = catalogList.querySelector(`[data-catalog-brand="${brand.id}"]`);
    const categorySelector = exhibitor.querySelector(".catalog-category-selector");
    const categoryTablist = exhibitor.querySelector("[data-catalog-category-tabs]");
    const categoryIndicator = exhibitor.querySelector(".catalog-category-indicator");
    const categoryPreviousButton = exhibitor.querySelector(".catalog-category-control--previous");
    const categoryNextButton = exhibitor.querySelector(".catalog-category-control--next");
    const rail = exhibitor.querySelector(".catalog-rail");
    const viewport = exhibitor.querySelector("[data-catalog-viewport]");
    const track = viewport.querySelector(".catalog-track");
    const status = exhibitor.querySelector("[data-catalog-status]");
    const progress = exhibitor.querySelector("[data-catalog-progress]");
    let activeCategoryIndex = 0;
    let firstVisible = 0;
    let scrollFrame = 0;
    let focusFrame = 0;
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
    previousButton.textContent = "\u2039";
    nextButton.textContent = "\u203a";
    previousButton.setAttribute("aria-controls", track.id);
    nextButton.setAttribute("aria-controls", track.id);
    rail.append(previousButton, nextButton);

    const getCards = () => [...track.querySelectorAll(".product-card")];
    const getCategory = () => brand.categories[activeCategoryIndex];

    const updateOrientation = () => {
      categoryTablist.setAttribute("aria-orientation", mobileQuery.matches ? "horizontal" : "vertical");
      categorySelector.classList.toggle("is-horizontal", mobileQuery.matches);
    };

    const updateCategoryIndicator = () => {
      const activeTab = categoryTablist.querySelector('[aria-selected="true"]');
      if (!activeTab) return;

      if (mobileQuery.matches) {
        const indicatorWidth = 48;
        const x = categoryTablist.offsetLeft + activeTab.offsetLeft - categoryTablist.scrollLeft
          + Math.max(0, (activeTab.offsetWidth - indicatorWidth) / 2);
        const y = categoryTablist.offsetTop + categoryTablist.clientHeight - 2;
        categoryIndicator.style.setProperty("--category-indicator-x", `${x}px`);
        categoryIndicator.style.setProperty("--category-indicator-y", `${y}px`);
      } else {
        const y = categoryTablist.offsetTop + activeTab.offsetTop - categoryTablist.scrollTop
          + Math.max(0, (activeTab.offsetHeight - 28) / 2);
        categoryIndicator.style.setProperty("--category-indicator-x", "0px");
        categoryIndicator.style.setProperty("--category-indicator-y", `${y}px`);
      }
    };

    const updateCategoryControls = () => {
      const maximum = Math.max(0, categoryTablist.scrollWidth - categoryTablist.clientWidth);
      categoryPreviousButton.disabled = !mobileQuery.matches || categoryTablist.scrollLeft <= 1;
      categoryNextButton.disabled = !mobileQuery.matches || categoryTablist.scrollLeft >= maximum - 1;
      updateCategoryIndicator();
    };

    const scrollCategories = (direction) => {
      categoryTablist.scrollBy({
        left: direction * Math.max(116, categoryTablist.clientWidth * 0.72),
        behavior: reducedMotionQuery.matches ? "auto" : "smooth"
      });
    };

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

    const updateMobileFocus = () => {
      window.cancelAnimationFrame(focusFrame);
      focusFrame = window.requestAnimationFrame(() => {
        if (!mobileQuery.matches) {
          exhibitor.classList.remove("is-mobile-focus");
          exhibitor.style.removeProperty("--catalog-image-scale");
          exhibitor.style.removeProperty("--catalog-figure-scale");
          exhibitor.style.removeProperty("--catalog-product-cut");
          return;
        }

        const rect = rail.getBoundingClientRect();
        const center = (rect.top + rect.bottom) / 2;
        const distance = Math.abs(center - window.innerHeight / 2);
        const focus = Math.max(0, Math.min(1, 1 - distance / (window.innerHeight * 0.62)));
        const figureWidth = getCards()[0]?.querySelector("figure")?.offsetWidth || 1;
        exhibitor.style.setProperty("--catalog-image-scale", (1.08 + focus * 0.12).toFixed(4));
        exhibitor.style.setProperty("--catalog-figure-scale", (1 + (12 / figureWidth) * focus).toFixed(4));
        exhibitor.style.setProperty("--catalog-product-cut", `${(18 * (1 - focus)).toFixed(2)}px`);
        exhibitor.classList.toggle("is-mobile-focus", focus > 0.55);
      });
    };

    const renderProducts = () => {
      const category = getCategory();
      track.innerHTML = category.products.map(productMarkup).join("");
      rail.setAttribute("aria-label", `Prodotti ${category.name} di ${brand.name}`);
      previousButton.setAttribute("aria-label", `Prodotti precedenti di ${category.name}, ${brand.name}`);
      nextButton.setAttribute("aria-label", `Altri prodotti di ${category.name}, ${brand.name}`);
      firstVisible = 0;
      viewport.scrollTo({ left: 0, behavior: "auto" });
      window.requestAnimationFrame(() => {
        updateControls();
        updateMobileFocus();
      });
    };

    const updateCategoryTabs = () => {
      categoryTablist.querySelectorAll(".catalog-category-tab").forEach((tab, index) => {
        const active = index === activeCategoryIndex;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      window.requestAnimationFrame(updateCategoryIndicator);
    };

    const selectCategory = (index, moveFocus = false) => {
      activeCategoryIndex = Math.max(0, Math.min(index, brand.categories.length - 1));
      updateCategoryTabs();
      renderProducts();
      const activeTab = categoryTablist.querySelector(`[data-category-index="${activeCategoryIndex}"]`);
      activeTab?.scrollIntoView({
        behavior: reducedMotionQuery.matches ? "auto" : "smooth",
        block: "nearest",
        inline: "nearest"
      });
      if (moveFocus) activeTab?.focus();
    };

    categoryTablist.innerHTML = brand.categories.map((category, categoryIndex) => `
      <button class="catalog-category-tab" type="button" role="tab"
        id="catalog-tab-${escapeHtml(brand.id)}-${escapeHtml(category.id)}"
        aria-controls="${track.id}"
        aria-selected="${categoryIndex === 0}"
        tabindex="${categoryIndex === 0 ? 0 : -1}"
        data-category-index="${categoryIndex}">
        ${escapeHtml(category.name)}
      </button>
    `).join("");

    categoryTablist.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-category-index]");
      if (tab) selectCategory(Number(tab.dataset.categoryIndex));
    });

    categoryPreviousButton.addEventListener("click", () => scrollCategories(-1));
    categoryNextButton.addEventListener("click", () => scrollCategories(1));
    categoryTablist.addEventListener("scroll", () => window.requestAnimationFrame(updateCategoryControls), { passive: true });

    categoryTablist.addEventListener("keydown", (event) => {
      const tab = event.target.closest("[data-category-index]");
      if (!tab) return;
      const current = Number(tab.dataset.categoryIndex);
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % brand.categories.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + brand.categories.length) % brand.categories.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = brand.categories.length - 1;
      else return;
      event.preventDefault();
      selectCategory(next, true);
    });

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

    updateOrientation();
    renderProducts();
    window.requestAnimationFrame(updateCategoryControls);
    controllers.push({
      brand,
      exhibitor,
      selectCategory,
      updateOrientation,
      updateCategoryControls,
      updateCategoryIndicator,
      updateMobileFocus,
      refresh: () => goTo(firstVisible, false, true)
    });
  });

  const jumpMap = Object.fromEntries(
    brands.map((brand) => [brand.id, [brand.id, brand.categories[0]?.id]])
  );

  document.querySelectorAll("[data-catalog-jump]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const destination = jumpMap[link.dataset.catalogJump];
      if (!destination) return;
      const controller = controllers.find((item) => item.brand.id === destination[0]);
      const categoryIndex = controller?.brand.categories.findIndex((category) => category.id === destination[1]) ?? -1;
      if (!controller || categoryIndex < 0) return;
      event.preventDefault();
      controller.selectCategory(categoryIndex);
      controller.exhibitor.scrollIntoView({ behavior: reducedMotionQuery.matches ? "auto" : "smooth" });
    });
  });

  const updateAllMobileFocus = () => controllers.forEach((controller) => controller.updateMobileFocus());
  window.addEventListener("scroll", updateAllMobileFocus, { passive: true });
  window.addEventListener("resize", () => {
    controllers.forEach((controller) => {
      controller.updateOrientation();
      controller.updateCategoryControls();
      controller.updateCategoryIndicator();
      controller.refresh();
      controller.updateMobileFocus();
    });
  }, { passive: true });
  mobileQuery.addEventListener?.("change", () => controllers.forEach((controller) => {
    controller.updateOrientation();
    controller.updateCategoryControls();
    controller.updateCategoryIndicator();
  }));
  reducedMotionQuery.addEventListener?.("change", () => controllers.forEach((controller) => controller.refresh()));
  updateAllMobileFocus();

  window.catalogBrandController = {
    controllers,
    selectCategory: (brandId, categoryIndex) => controllers.find((item) => item.brand.id === brandId)?.selectCategory(categoryIndex),
    refresh: () => controllers.forEach((controller) => controller.refresh())
  };
})();
