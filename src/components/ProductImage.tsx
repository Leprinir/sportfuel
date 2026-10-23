import { useState } from 'react';
import { PackageX } from 'lucide-react';

const FALLBACK = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><rect width="800" height="800" fill="#F1F5F9"/><g fill="none" stroke="#CBD5E1" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"><path d="M400 300l150 60v120l-150 60-150-60V360z"/><path d="M250 360l150 60 150-60M400 480v120"/></g><text x="400" y="620" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="36" fill="#94A3B8">Нет изображения</text></svg>`,
)}`;

interface Props {
  src: string;
  alt: string;
  className?: string;
}

/** Изображение товара с ленивой загрузкой и резервной заглушкой при ошибке. */
export function ProductImage({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={800}
      height={800}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
