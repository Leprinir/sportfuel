import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { categories } from '../data/categories';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2" aria-label="SportFuel — на главную">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Zap className="h-5 w-5" fill="currentColor" aria-hidden="true" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Sport<span className="text-brand-600">Fuel</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
              Каталог спортивного питания для тренировок, восстановления и достижения целей.
              Покупка осуществляется на внешней площадке Kaspi.kz.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Навигация</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="text-slate-500 transition-colors hover:text-brand-700">Главная</Link></li>
              <li><Link to="/catalog" className="text-slate-500 transition-colors hover:text-brand-700">Каталог</Link></li>
              <li><Link to="/favorites" className="text-slate-500 transition-colors hover:text-brand-700">Избранное</Link></li>
              <li><Link to="/about" className="text-slate-500 transition-colors hover:text-brand-700">О проекте</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Категории</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-slate-500 transition-colors hover:text-brand-700"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} SportFuel — демонстрационный проект. Не является интернет-магазином.
            Цены и наличие товаров на Kaspi.kz могут меняться.
          </p>
        </div>
      </div>
    </footer>
  );
}
