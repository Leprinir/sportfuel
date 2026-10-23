import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { products } from '../data/products';
import type { Filters, Product, SortKey } from '../types';
import { collectBrands, collectFlavors, filterProducts, priceBounds } from '../utils/filtering';
import { sortProducts } from '../utils/sorting';
import { useDebounce } from '../hooks/useDebounce';
import { ProductGrid } from './ProductGrid';
import { FilterPanel } from './FilterPanel';
import { SortSelect } from './SortSelect';
import { EmptyState } from './EmptyState';

const PAGE_SIZE = 12;

interface Props {
  /** Если задано — каталог ограничен одной категорией (страница категории). */
  scopeCategoryId?: string;
}

const emptyFilters: Omit<Filters, 'search'> = {
  categoryId: undefined,
  brands: [],
  minPrice: undefined,
  maxPrice: undefined,
  flavors: [],
};

/** Полноценный каталог: поиск, фильтры, сортировка, счётчик и подгрузка. */
export function ProductCatalog({ scopeCategoryId }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';

  const [filters, setFilters] = useState<Omit<Filters, 'search'>>({
    ...emptyFilters,
    categoryId: scopeCategoryId,
  });
  const [search, setSearch] = useState(urlQuery);
  const [sort, setSort] = useState<SortKey>('popular');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Синхронизация поиска из шапки (через URL) с состоянием каталога.
  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  const scopeProducts = useMemo<Product[]>(
    () => (scopeCategoryId ? products.filter((p) => p.categoryId === scopeCategoryId) : products),
    [scopeCategoryId],
  );

  const brands = useMemo(() => collectBrands(scopeProducts), [scopeProducts]);
  const flavors = useMemo(() => collectFlavors(scopeProducts), [scopeProducts]);
  const bounds = useMemo(() => priceBounds(scopeProducts), [scopeProducts]);

  const results = useMemo(() => {
    const filtered = filterProducts(scopeProducts, { ...filters, search: debouncedSearch });
    return sortProducts(filtered, sort);
  }, [scopeProducts, filters, debouncedSearch, sort]);

  // Сбрасываем «показать ещё» при изменении условий отображения.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters, debouncedSearch, sort, scopeCategoryId]);

  const visibleProducts = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  const activeCount =
    (filters.categoryId && !scopeCategoryId ? 1 : 0) +
    filters.brands.length +
    filters.flavors.length +
    (filters.minPrice != null ? 1 : 0) +
    (filters.maxPrice != null ? 1 : 0);

  const handlePatch = (patch: Partial<Omit<Filters, 'search'>>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setFilters({ ...emptyFilters, categoryId: scopeCategoryId });
    setSearch('');
    setSort('popular');
    setSearchParams({}, { replace: true });
  };

  const clearSearch = () => {
    setSearch('');
    setSearchParams({}, { replace: true });
  };

  const panel = (
    <FilterPanel
      brands={brands}
      flavors={flavors}
      priceBounds={bounds}
      filters={{ ...filters, search }}
      onChange={handlePatch}
      onReset={handleReset}
      showCategory={!scopeCategoryId}
      activeCount={activeCount}
    />
  );

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
      {/* Фильтры на десктопе */}
      <aside className="hidden lg:block lg:sticky lg:top-24">
        <div className="card p-5">{panel}</div>
      </aside>

      {/* Панель инструментов + результаты */}
      <div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию, бренду…"
              aria-label="Поиск в каталоге"
              className="input-base pl-9"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Очистить поиск"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:text-slate-600"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Фильтры
              {activeCount > 0 && (
                <span className="rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
                  {activeCount}
                </span>
              )}
            </button>
            <SortSelect value={sort} onChange={setSort} className="min-w-0 flex-1 sm:flex-none" />
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-500" role="status">
          Найдено: <span className="font-semibold text-slate-800">{results.length}</span>{' '}
          {plural(results.length, 'товар', 'товара', 'товаров')}
          {debouncedSearch.trim() && <> по запросу «{debouncedSearch.trim()}»</>}
        </p>

        {visibleProducts.length > 0 ? (
          <>
            <ProductGrid products={visibleProducts} />
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  Показать ещё ({results.length - visibleCount})
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Ничего не найдено"
            description="Попробуйте изменить запрос или сбросить фильтры, чтобы увидеть больше товаров."
            action={
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Сбросить фильтры
              </button>
            }
          />
        )}
      </div>

      {/* Мобильная панель фильтров */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Фильтры">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">Фильтры</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Закрыть фильтры"
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{panel}</div>
            <div className="border-t border-slate-200 p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Показать {results.length} {plural(results.length, 'товар', 'товара', 'товаров')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}
