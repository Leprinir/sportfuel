import { useParams } from 'react-router-dom';
import { categoryBySlug } from '../data/categories';
import { products } from '../data/products';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCatalog } from '../components/ProductCatalog';
import { CategoryIcon } from '../components/CategoryIcon';
import { EmptyState } from '../components/EmptyState';

export function CategoryPage() {
  const { slug = '' } = useParams();
  const category = categoryBySlug(slug);
  useDocumentTitle(category ? category.name : 'Категория не найдена');

  if (!category) {
    return (
      <div className="container-x py-10">
        <EmptyState
          title="Категория не найдена"
          description="Такой категории не существует. Возможно, ссылка устарела."
          action={
            <a
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Перейти в каталог
            </a>
          }
        />
      </div>
    );
  }

  const count = products.filter((p) => p.categoryId === category.id).length;
  const [from, to] = category.color;

  return (
    <div className="container-x py-6">
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Каталог', to: '/catalog' },
          { label: category.name },
        ]}
      />

      <div
        className="mt-4 mb-6 flex items-center gap-4 overflow-hidden rounded-2xl p-6 text-white sm:p-8"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <CategoryIcon icon={category.icon} className="h-8 w-8" />
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{category.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/85">{category.description}</p>
          <p className="mt-2 text-sm font-medium text-white/90">
            {count} {count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'}
          </p>
        </div>
      </div>

      <ProductCatalog key={category.id} scopeCategoryId={category.id} />
    </div>
  );
}
