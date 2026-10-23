import { Link, useParams } from 'react-router-dom';
import { Info, ShieldCheck } from 'lucide-react';
import { productBySlug } from '../data/products';
import { categoryById } from '../data/categories';
import { products } from '../data/products';
import { formatPrice } from '../utils/currency';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductImage } from '../components/ProductImage';
import { FavoriteButton } from '../components/FavoriteButton';
import { KaspiButton } from '../components/KaspiButton';
import { ProductGrid } from '../components/ProductGrid';
import { EmptyState } from '../components/EmptyState';

export function ProductPage() {
  const { slug = '' } = useParams();
  const product = productBySlug(slug);
  useDocumentTitle(product ? `${product.name} — ${product.brand}` : 'Товар не найден');

  if (!product) {
    return (
      <div className="container-x py-10">
        <EmptyState
          title="Товар не найден"
          description="Товар с таким адресом не существует. Возможно, ссылка устарела."
          action={
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Перейти в каталог
            </Link>
          }
        />
      </div>
    );
  }

  const category = categoryById(product.categoryId);
  const quickFacts = [
    product.weight && { label: 'Масса', value: product.weight },
    product.volume && { label: 'Объём', value: product.volume },
    product.servings && { label: 'Порций', value: product.servings },
    product.flavor && { label: 'Вкус', value: product.flavor },
  ].filter(Boolean) as { label: string; value: string }[];

  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-x py-6">
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Каталог', to: '/catalog' },
          ...(category ? [{ label: category.name, to: `/category/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Изображение */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <ProductImage
            src={product.imageUrl}
            alt={`${product.brand} ${product.name}`}
            className="aspect-square w-full object-cover"
          />
          <div className="absolute right-4 top-4">
            <FavoriteButton productId={product.id} className="h-11 w-11" />
          </div>
        </div>

        {/* Информация */}
        <div>
          {category && (
            <Link
              to={`/category/${category.slug}`}
              className="text-xs font-semibold uppercase tracking-wide text-brand-700 hover:text-brand-800"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-1 text-3xl font-bold leading-tight text-slate-900">{product.name}</h1>
          <p className="mt-1 text-slate-500">{product.brand}</p>

          <p className="mt-5 text-3xl font-extrabold text-slate-900">{formatPrice(product.price)}</p>

          {quickFacts.length > 0 && (
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickFacts.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <dt className="text-xs text-slate-400">{fact.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-800">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className="mt-6 leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-6">
            <KaspiButton href={product.kaspiUrl} label="Смотреть на Kaspi" block className="py-3" />
            {product.kaspiLinkType === 'search' && (
              <p className="mt-2 text-xs text-slate-400">
                Демонстрационная ссылка — ведёт на поиск товара на Kaspi.kz.
              </p>
            )}
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              Данные о товаре (цена, характеристики, состав) — демонстрационные и не являются
              актуальными сведениями Kaspi.kz или производителя.
            </p>
          </div>
        </div>
      </div>

      {/* Характеристики */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Характеристики</h2>
        <div className="card overflow-hidden">
          <dl className="divide-y divide-slate-100">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex gap-4 px-5 py-3.5 sm:px-6">
                <dt className="w-1/2 shrink-0 text-sm text-slate-500 sm:w-64">{spec.label}</dt>
                <dd className="text-sm font-medium text-slate-800">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Состав / пищевая ценность / применение */}
      {(product.ingredients || product.nutrition || product.usage) && (
        <section className="mt-12">
          <h2 className="mb-1 text-xl font-bold">Состав и применение</h2>
          <p className="mb-4 text-xs text-slate-400">
            Демонстрационные данные. Не являются официальными сведениями производителя.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {product.ingredients && (
              <div className="card p-6">
                <h3 className="mb-3 text-base font-semibold text-slate-900">Состав</h3>
                <p className="text-sm leading-relaxed text-slate-600">{product.ingredients}</p>
              </div>
            )}
            {product.nutrition && product.nutrition.length > 0 && (
              <div className="card p-6">
                <h3 className="mb-3 text-base font-semibold text-slate-900">Пищевая ценность</h3>
                <dl className="space-y-2">
                  {product.nutrition.map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <dt className="text-slate-500">{item.label}</dt>
                      <dd className="font-medium text-slate-800">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {product.usage && (
              <div className="card p-6 md:col-span-2">
                <h3 className="mb-3 text-base font-semibold text-slate-900">Способ применения</h3>
                <p className="text-sm leading-relaxed text-slate-600">{product.usage}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Связанные товары */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Похожие товары</h2>
          <ProductGrid products={related} />
        </section>
      )}

      <p className="mt-12 flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        SportFuel — каталог. Покупка и оплата происходят на внешней площадке Kaspi.kz после перехода по ссылке.
      </p>
    </div>
  );
}
