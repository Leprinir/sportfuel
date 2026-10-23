# SportFuel

Каталог спортивного питания с переходом на товары внешней площадки **Kaspi.kz**.

**SportFuel — демонстрационный проект.** Это не интернет-магазин: здесь нет корзины,
оформления заказа и оплаты. Посетитель изучает ассортимент, сравнивает характеристики
и переходит к товару на Kaspi.kz по внешней ссылке.

## Технологии

- **React 18** + **TypeScript**
- **Vite** — сборка и dev-сервер
- **Tailwind CSS** — стилизация
- **React Router** — маршрутизация
- **Lucide** — иконки
- **localStorage** — избранное
- Локальные структурированные данные товаров (TypeScript)

## Запуск

```bash
npm install
npm run images   # генерация локальных SVG-изображений товаров (один раз)
npm run dev      # dev-сервер: http://localhost:5173
```

## Сборка

```bash
npm run build    # проверка типов + production-сборка в dist/
npm run preview  # локальный предпросмотр собранной версии
npm run typecheck
```

## Структура

```
src/
  components/   Header, Footer, ProductCard, ProductGrid, ProductCatalog,
                FilterPanel, SortSelect, Breadcrumbs, FavoriteButton, EmptyState, …
  pages/        HomePage, CatalogPage, CategoryPage, ProductPage,
                FavoritesPage, AboutPage, NotFoundPage
  data/         products.ts, categories.ts   (единый источник данных)
  hooks/        useFavorites, useDebounce, useDocumentTitle
  utils/        currency, filtering, sorting
  types/        product, category, filters
scripts/
  generate-images.mjs   генерация демо-изображений товаров
```

## Данные и ссылки Kaspi

- Все товары хранятся в `src/data/products.ts` с полем `kaspiUrl` (единая точка управления ссылками).
- Демо-ссылки имеют тип `kaspiLinkType: 'search'` и ведут на поиск Kaspi
  (`https://kaspi.kz/shop/search/?text=…`).
- Чтобы заменить ссылку на точную карточку товара, измените `kaspiUrl` на
  `https://kaspi.kz/shop/p/<идентификатор>` и укажите `kaspiLinkType: 'product'`.

## Добавление товара

1. Добавьте запись через `makeProduct({…})` в `src/data/products.ts`.
2. Добавьте слагу соответствующую строку в `scripts/generate-images.mjs` (массив `items`).
3. Выполните `npm run images`.
4. Проверьте страницу товара по адресу `/product/<slug>`.

## Ограничения

- Цены, характеристики и метки «Популярное»/«Новинка» — демонстрационные.
- Изображения товаров — сгенерированные SVG-заглушки (не фото реальных продуктов).
- Ссылки Kaspi ведут на поиск, а не на конкретные карточки товаров.
