import { RotateCcw } from 'lucide-react';
import { categories } from '../data/categories';
import type { Filters } from '../types';

interface Props {
  brands: string[];
  flavors: string[];
  priceBounds: { min: number; max: number };
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  showCategory?: boolean;
  activeCount: number;
}

/** Панель фильтров каталога: категория, бренды, цена, вкус. */
export function FilterPanel({
  brands,
  flavors,
  priceBounds,
  filters,
  onChange,
  onReset,
  showCategory = false,
  activeCount,
}: Props) {
  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ brands: next });
  };

  const toggleFlavor = (flavor: string) => {
    const next = filters.flavors.includes(flavor)
      ? filters.flavors.filter((f) => f !== flavor)
      : [...filters.flavors, flavor];
    onChange({ flavors: next });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Фильтры</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 transition-colors hover:text-brand-800"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Сбросить ({activeCount})
          </button>
        )}
      </div>

      {showCategory && (
        <fieldset>
          <legend className="label">Категория</legend>
          <select
            value={filters.categoryId ?? ''}
            onChange={(e) => onChange({ categoryId: e.target.value || undefined })}
            className="input-base cursor-pointer"
          >
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </fieldset>
      )}

      <fieldset>
        <legend className="label">Цена, ₸</legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={priceBounds.min}
            max={priceBounds.max}
            placeholder={String(priceBounds.min)}
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              onChange({ minPrice: e.target.value === '' ? undefined : Number(e.target.value) })
            }
            aria-label="Минимальная цена"
            className="input-base"
          />
          <span className="text-slate-400">—</span>
          <input
            type="number"
            inputMode="numeric"
            min={priceBounds.min}
            max={priceBounds.max}
            placeholder={String(priceBounds.max)}
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              onChange({ maxPrice: e.target.value === '' ? undefined : Number(e.target.value) })
            }
            aria-label="Максимальная цена"
            className="input-base"
          />
        </div>
      </fieldset>

      {brands.length > 0 && (
        <fieldset>
          <legend className="label">Бренд</legend>
          <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {flavors.length > 0 && (
        <fieldset>
          <legend className="label">Вкус</legend>
          <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
            {flavors.map((flavor) => (
              <label key={flavor} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.flavors.includes(flavor)}
                  onChange={() => toggleFlavor(flavor)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>{flavor}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
