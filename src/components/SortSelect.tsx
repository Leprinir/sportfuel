import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SortKey } from '../types';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'name', label: 'По названию (А–Я)' },
];

interface Props {
  value: SortKey;
  onChange: (value: SortKey) => void;
  className?: string;
}

/** Кастомный выпадающий список сортировки (без нативного <select> с его белым артефактом). */
export function SortSelect({ value, onChange, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Закрыть при клике вне
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = SORT_OPTIONS.find((o) => o.value === value)?.label ?? '';

  return (
    <div className={`flex items-center gap-2 ${className}`} ref={ref}>
      <label className="shrink-0 text-sm text-slate-500">Сортировка</label>
      <div className="relative max-w-full">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`inline-flex w-full items-center justify-between overflow-hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition-colors hover:border-brand-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 ${open ? 'min-w-[160px]' : 'min-w-0'}`}
        >
          <span>{current}</span>
          <ChevronDown
            className={`ml-1.5 h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute left-0 top-full z-30 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card-hover"
          >
            {SORT_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    option.value === value
                      ? 'bg-brand-50 font-semibold text-brand-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
