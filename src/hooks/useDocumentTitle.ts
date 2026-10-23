import { useEffect } from 'react';

/** Устанавливает заголовок вкладки браузера для текущей страницы. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — SportFuel` : 'SportFuel — каталог спортивного питания';
  }, [title]);
}
