import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
}

/** Сетка карточек товаров (1–4 колонки в зависимости от ширины экрана). */
export function ProductGrid({ products }: Props) {
  if (products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
