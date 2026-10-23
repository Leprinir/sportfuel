import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Страница не найдена');

  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-10">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Страница не найдена</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Похоже, вы перешли по несуществующему адресу. Проверьте ссылку или вернитесь в каталог.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            На главную
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-700"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            В каталог
          </Link>
        </div>
      </div>
    </div>
  );
}
