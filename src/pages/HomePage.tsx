import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  ListChecks,
  Search,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ProductGrid } from '../components/ProductGrid';
import { CategoryCard } from '../components/CategoryCard';

const ADVANTAGES = [
  {
    icon: SlidersHorizontal,
    title: 'Удобный каталог',
    text: 'Категории, фильтры и сортировка помогают быстро найти нужный продукт.',
  },
  {
    icon: ListChecks,
    title: 'Подробные характеристики',
    text: 'Масса, объём, порции и состав — всё в карточке товара.',
  },
  {
    icon: Search,
    title: 'Быстрый поиск',
    text: 'Поиск по названию и бренду с мгновенным обновлением результатов.',
  },
  {
    icon: ExternalLink,
    title: 'Переход на Kaspi.kz',
    text: 'Каждый товар ведёт на соответствующую страницу внешней площадки.',
  },
];

const GUIDES = [
  {
    title: 'Определите цель',
    text: 'Набор массы, восстановление, выносливость или общее самочувствие — от цели зависит выбор категории.',
  },
  {
    title: 'Выберите категорию',
    text: 'Протеин для белка, креатин для силы, BCAA для восстановления, витамины и Омега-3 для здоровья.',
  },
  {
    title: 'Проверьте характеристики',
    text: 'Обратите внимание на массу, количество порций, вкус и форму выпуска перед покупкой.',
  },
];

export function HomePage() {
  useDocumentTitle();

  const popular = products
    .filter((p) => p.tags.includes('popular'))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);
  const newest = products
    .filter((p) => p.tags.includes('new'))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  const categoryCounts = new Map<string, number>();
  for (const p of products) categoryCounts.set(p.categoryId, (categoryCounts.get(p.categoryId) ?? 0) + 1);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(132,204,22,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(77,124,15,0.35),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-16 top-8 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="container-x relative flex min-h-[440px] flex-col justify-center py-16">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-300">
            <Zap className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" />
            Спортивное питание
          </span>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Твоё питание. <span className="text-brand-400">Твой результат.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-300">
            Подбирай спортивное питание для тренировок, восстановления и достижения своих целей.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
            >
              Перейти в каталог
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400 hover:text-white"
            >
              О проекте
            </Link>
          </div>
        </div>
      </section>

      {/* Популярные категории */}
      <section className="container-x py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Популярные категории</h2>
            <p className="mt-1 text-sm text-slate-500">Основные разделы каталога спортивного питания</p>
          </div>
          <Link to="/catalog" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex">
            Все товары <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard key={category.id} category={category} count={categoryCounts.get(category.id) ?? 0} />
          ))}
        </div>
      </section>

      {/* Популярные товары */}
      <section className="bg-slate-50 py-14">
        <div className="container-x">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Популярные товары</h2>
              <p className="mt-1 text-sm text-slate-500">Часто выбираемые позиции каталога</p>
            </div>
            <Link to="/catalog" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex">
              Весь каталог <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid products={popular} />
        </div>
      </section>

      {/* Новинки */}
      <section className="container-x py-14">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Новинки и рекомендации</h2>
          <p className="mt-1 text-sm text-slate-500">Новые позиции в демонстрационном каталоге</p>
        </div>
        <ProductGrid products={newest} />
      </section>

      {/* Преимущества */}
      <section className="bg-slate-950 py-14">
        <div className="container-x">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white">Почему SportFuel</h2>
            <p className="mt-2 text-sm text-slate-400">Каталог, созданный для удобного выбора спортивного питания</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map((adv) => (
              <div key={adv.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15 text-brand-400">
                  <adv.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-white">{adv.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{adv.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Как выбрать */}
      <section className="container-x py-14">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold">Как выбрать спортивное питание</h2>
          <p className="mt-2 text-sm text-slate-500">Три простых шага для осознанного выбора</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {GUIDES.map((guide, index) => (
            <div key={guide.title} className="card p-6">
              <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold text-slate-900">{guide.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
