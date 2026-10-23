import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

interface Props {
  productId: string;
  className?: string;
}

/** Кнопка добавления/удаления товара в избранное. */
export function FavoriteButton({ productId, className = '' }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      aria-pressed={active}
      aria-label={active ? 'Удалить из избранного' : 'Добавить в избранное'}
      title={active ? 'Удалить из избранного' : 'Добавить в избранное'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-sm transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        active ? 'text-brand-600' : ''
      } ${className}`}
    >
      <Heart className="h-[18px] w-[18px]" fill={active ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  );
}
