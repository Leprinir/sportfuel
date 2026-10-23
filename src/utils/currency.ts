/**
 * Форматирует цену в казахстанских тенге.
 * Гарантированно использует символ «₸» независимо от локали браузера.
 */
export function formatPrice(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  return `${Math.round(value).toLocaleString('ru-RU')} ₸`;
}
