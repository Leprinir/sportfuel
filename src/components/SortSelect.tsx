import { SORT_OPTIONS, type SortKey } from '../types';

interface Props {
  value: SortKey;
  onChange: (value: SortKey) => void;
  className?: string;
}

/** Выбор сортировки товаров. */
export function SortSelect({ value, onChange, className = '' }: Props) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <label htmlFor="sort" className="shrink-0 text-sm text-slate-500">
        Сортировка
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="input-base min-w-0 flex-1 cursor-pointer py-2"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
