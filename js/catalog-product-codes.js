/*
 * Keeps catalogue/reference codes out of customer-facing product titles.
 * The complete name-to-code register is kept in CODICI_PRODOTTI.md.
 */
(function () {
  "use strict";

  function getCode(title) {
    const unoaerreCode = title.match(/(?:9\.0\s+)?\d{2}\s+(?:AFN|AFC)\s+[\d/]+(?:\s+\d+){0,3}/i);
    if (unoaerreCode) return unoaerreCode[0];

    const trailingCode = title.match(/(?:\s+—\s*|\s+)(?:\d{4}(?:DB(?:[GR])?|DCH)?|\d{5,6}[A-Z]?(?:-\d+)?)$/i);
    if (trailingCode) return trailingCode[0].replace(/^\s+—\s*|^\s+/, "");

    const trilogyCode = title.match(/\b(?:1689|2132)$/);
    return trilogyCode ? trilogyCode[0] : null;
  }

  function cleanTitle(title, code) {
    if (!code) return title;

    let clean = title;
    const unoaerreCode = code.match(/^(?:9\.0\s+)?(\d{2})\s+(AF[NC])\s+([\d/]+)((?:\s+\d+)*)$/i);
    if (unoaerreCode) {
      const [, widthCode, series, model, variant] = unoaerreCode;
      const width = Number.parseInt(widthCode, 10) / 10;
      const differentiator = `${width} mm · ${series.toUpperCase()} ${model}${variant.trim() ? ` · variante ${variant.trim().replace(/\s+/g, "-")}` : ""}`;
      clean = clean.replace(code, differentiator);
    } else {
      clean = clean.replace(new RegExp("(?:\\s+—\\s*|\\s+)" + code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i"), "");
    }

    return clean.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
  }

  if (!Array.isArray(window.catalogBrandData)) return;

  window.catalogBrandData.forEach((brand) => {
    brand.categories.forEach((category) => {
      category.products.forEach((product) => {
        const code = getCode(product.title);
        if (!code) return;

        const title = cleanTitle(product.title, code);
        product.title = title;
        product.alt = `${title}, ${brand.name}`;
      });
    });
  });
})();
