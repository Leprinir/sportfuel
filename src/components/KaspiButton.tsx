import { ExternalLink } from 'lucide-react';

interface Props {
  href: string;
  label?: string;
  className?: string;
  block?: boolean;
}

/** Кнопка перехода к товару на Kaspi.kz (внешняя ссылка). */
export function KaspiButton({
  href,
  label = 'Смотреть на Kaspi',
  className = '',
  block = false,
}: Props) {
  const isExternal = /^https?:\/\//i.test(href);

  if (!isExternal) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 active:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
        block ? 'w-full' : ''
      } ${className}`}
    >
      {label}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
