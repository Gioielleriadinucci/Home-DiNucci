(() => {
  "use strict";

  const brands = window.catalogBrandData;
  const additions = window.catalogExtraProducts;

  if (!Array.isArray(brands) || !Array.isArray(additions)) return;

  additions.forEach((item) => {
    const brand = brands.find((entry) => entry.id === item.brand);
    const category = brand?.categories.find((entry) => entry.id === item.category);

    if (!brand || !category) return;

    category.products.push({
      brand: brand.name,
      category: category.name,
      title: item.title,
      image: `images/catalog-brands/${item.image}`,
      collection: category.collection,
      alt: `${item.title}, ${brand.name}`,
      source: item.source || category.source || brand.source,
      badge: brand.name
    });
  });
})();
