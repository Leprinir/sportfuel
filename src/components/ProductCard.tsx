import { Link } from 'react-router-dom';
import { categoryById } from '../data/categories';
import { formatPrice } from '../utils/currency';
import type { Product } from '../types';
import { ProductImage } from './ProductImage';
import { FavoriteButton } from './FavoriteButton';
import { KaspiButton } from './KaspiButton';

/** Карточка товара: изображение, метки, название, бренд, цена и кнопки. */
export function ProductCard({ product }: { product: Product }) {
  const category = categoryById(product.categoryId);
  const meta = product.weight || product.volume || product.servings;

  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-card-hover">
      <div className="relative">
        <Link
          to={`/product/${product.slug}`}
          className="block aspect-square overflow-hidden bg-slate-100"
          aria-label={product.name}
        >
          <ProductImage
            src={product.imageUrl}
            alt={`${product.brand} ${product.name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Метки */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.tags.includes('popular') && (
            <span className="chip bg-amber-400 text-amber-950">Популярное</span>
          )}
          {product.tags.includes('new') && (
            <span className="chip bg-sky-500 text-white">Новинка</span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <FavoriteButton productId={product.id} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {category && (
          <Link
            to={`/category/${category.slug}`}
            className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400 transition-colors hover:text-brand-600"
          >
            {category.name}
          </Link>
        )}
        <h3 className="text-sm font-semibold leading-snug text-slate-900">
          <Link
            to={`/product/${product.slug}`}
            className="line-clamp-2 transition-colors hover:text-brand-700"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-slate-500">{product.brand}</p>
        {meta && <p className="mt-1 text-xs text-slate-400">{meta}</p>}

        <div className="mt-auto pt-4">
          <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
          <div className="mt-3 flex items-center gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="min-w-0 inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-700"
            >
              Подробнее
            </Link>
            <KaspiButton
              href={product.kaspiUrl}
              label="Kaspi"
              className="shrink-0 px-3 py-2"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
