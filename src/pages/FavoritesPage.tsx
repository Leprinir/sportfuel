import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { products } from '../data/products';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductGrid';
import { EmptyState } from '../components/EmptyState';

export function FavoritesPage() {
  useDocumentTitle('Избранное');
  const { favoriteIds } = useFavorites();

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Избранное' }]} />
      <div className="mt-4 mb-6">
        <h1 className="text-3xl font-bold">Избранное</h1>
        <p className="mt-2 text-sm text-slate-500">
          {favoriteProducts.length > 0
            ? `Сохранено товаров: ${favoriteProducts.length}`
            : 'Список избранного сохраняется в вашем браузере.'}
        </p>
      </div>

      {favoriteProducts.length > 0 ? (
        <ProductGrid products={favoriteProducts} />
      ) : (
        <EmptyState
          icon={<Heart className="h-7 w-7" aria-hidden="true" />}
          title="В избранном пока пусто"
          description="Нажимайте на значок сердца на карточках товаров, чтобы сохранить их здесь."
          action={
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Перейти в каталог
            </Link>
          }
        />
      )}
    </div>
  );
}
