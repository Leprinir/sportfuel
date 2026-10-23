import { Link } from 'react-router-dom';
import type { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  category: Category;
  count: number;
}

/** Плитка категории с иконкой, названием и количеством товаров. */
export function CategoryCard({ category, count }: Props) {
  const [from, to] = category.color;
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-2xl p-5 text-white transition-transform hover:-translate-y-0.5"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div className="pointer-events-none absolute -right-4 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <CategoryIcon
        icon={category.icon}
        className="h-8 w-8 text-white/90 transition-transform duration-300 group-hover:scale-110"
      />
      <div className="mt-6">
        <h3 className="text-base font-semibold leading-snug">{category.name}</h3>
        <p className="mt-0.5 text-xs text-white/80">{count} товаров</p>
      </div>
    </Link>
  );
}
