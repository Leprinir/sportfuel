import type { Product, SortKey } from '../types';

/** Сортирует копию списка товаров по заданному ключу. */
export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const result = [...products];

  switch (sort) {
    case 'price-asc':
      return result.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return result.sort((a, b) => b.price - a.price);
    case 'name':
      return result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    case 'popular':
    default:
      return result.sort((a, b) => b.popularity - a.popularity);
  }
}
