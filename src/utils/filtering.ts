import type { Filters, Product } from '../types';

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Применяет фильтры (категория, бренды, диапазон цены, вкус, поиск)
 * к списку товаров. Поиск учитывает название, бренд и описание.
 */
export function filterProducts(products: Product[], filters: Filters): Product[] {
  const q = normalize(filters.search);

  return products.filter((product) => {
    if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
    if (filters.minPrice != null && product.price < filters.minPrice) return false;
    if (filters.maxPrice != null && product.price > filters.maxPrice) return false;
    if (filters.flavors.length > 0 && (!product.flavor || !filters.flavors.includes(product.flavor))) {
      return false;
    }

    if (q) {
      const haystack = normalize(`${product.name} ${product.brand} ${product.shortDescription}`);
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

/** Возвращает уникальный список брендов (отсортированный). */
export function collectBrands(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort((a, b) =>
    a.localeCompare(b, 'ru'),
  );
}

/** Возвращает уникальный список вкусов (отсортированный). */
export function collectFlavors(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.flavor).filter(Boolean) as string[])).sort(
    (a, b) => a.localeCompare(b, 'ru'),
  );
}

/** Возвращает минимальную и максимальную цену в списке. */
export function priceBounds(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
