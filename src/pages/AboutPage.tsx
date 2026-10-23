import { Link } from 'react-router-dom';
import { ExternalLink, Info, Search, Zap } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { products } from '../data/products';
import { categories } from '../data/categories';

export function AboutPage() {
  useDocumentTitle('О проекте');

  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'О проекте' }]} />

      <div className="mx-auto mt-6 max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Zap className="h-6 w-6" fill="currentColor" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-bold">О проекте SportFuel</h1>
        </div>

        <div className="space-y-6 text-slate-600">
          <p className="leading-relaxed">
            <strong className="text-slate-900">SportFuel</strong> — это каталог спортивного питания,
            созданный для удобного изучения ассортимента: протеинов, креатина, аминокислот,
            витаминов и спортивных аксессуаров. Мы помогаем разобраться в категориях, сравнить
            характеристики и найти подходящий продукт.
          </p>

          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Info className="h-5 w-5 text-brand-600" aria-hidden="true" />
              Как это работает
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Сайт предназначен для ознакомления с ассортиментом спортивного питания.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Заказы на SportFuel не оформляются — здесь нет корзины и оплаты.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Покупка происходит на внешней площадке Kaspi.kz после перехода по ссылке товара.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Цены и наличие товаров на внешней площадке могут меняться.
              </li>
            </ul>
          </div>

          <div className="card border-amber-200 bg-amber-50 p-6">
            <h2 className="mb-3 text-lg font-semibold text-amber-900">Демонстрационный проект</h2>
            <p className="text-sm leading-relaxed text-amber-800">
              SportFuel — демонстрационный проект. Все товары, цены и характеристики являются
              примерными и не представляют собой актуальные коммерческие сведения. Ссылки ведут
              на поиск соответствующих товаров на Kaspi.kz и могут быть заменены на точные карточки
              товаров в будущем.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5 text-center">
              <p className="text-3xl font-bold text-brand-600">{products.length}</p>
              <p className="mt-1 text-sm text-slate-500">демонстрационных товаров</p>
            </div>
            <div className="card p-5 text-center">
              <p className="text-3xl font-bold text-brand-600">{categories.length}</p>
              <p className="mt-1 text-sm text-slate-500">категорий</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Перейти в каталог
            </Link>
            <a
              href="https://kaspi.kz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-700"
            >
              Открыть Kaspi.kz
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
