export type KaspiLinkType = 'search' | 'product';

export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductTag = 'popular' | 'new';

export interface Product {
  /** Уникальный идентификатор товара. */
  id: string;
  /** URL-friendly идентификатор для маршрутов. */
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  /** Цена в казахстанских тенге (демонстрационная). */
  price: number;
  imageUrl: string;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  /** Масса, например «900 г». */
  weight?: string;
  /** Объём, например «500 мл». */
  volume?: string;
  flavor?: string;
  /** Количество порций, например «30 порций». */
  servings?: string;
  /** Состав (демонстрационные данные, если указано). */
  ingredients?: string;
  /** Пищевая ценность (демонстрационные данные, если указано). */
  nutrition?: ProductSpec[];
  /** Способ применения (демонстрационные данные, если указано). */
  usage?: string;
  kaspiUrl: string;
  kaspiLinkType: KaspiLinkType;
  tags: ProductTag[];
  /** Показатель популярности для сортировки (демонстрационный). */
  popularity: number;
  /** Признак демонстрационных данных. */
  isDemo: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Градиент для оформления плитки категории: [начало, конец]. */
  color: [string, string];
  icon: string;
}

export type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'name';

export interface Filters {
  categoryId?: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  flavors: string[];
  search: string;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'name', label: 'По названию (А–Я)' },
];
