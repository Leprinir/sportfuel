import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCatalog } from '../components/ProductCatalog';

export function CatalogPage() {
  useDocumentTitle('Каталог');

  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог' }]} />
      <div className="mt-4 mb-6">
        <h1 className="text-3xl font-bold">Каталог спортивного питания</h1>
        <p className="mt-2 text-sm text-slate-500">
          Протеины, креатин, аминокислоты, витамины и аксессуары. Переходите к товарам на Kaspi.kz.
        </p>
      </div>
      <ProductCatalog />
    </div>
  );
}
