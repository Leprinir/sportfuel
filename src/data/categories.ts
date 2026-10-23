import type { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'protein',
    slug: 'protein',
    name: 'Протеин',
    description:
      'Белковые добавки для набора мышечной массы, восстановления и восполнения белка в рационе.',
    color: ['#84CC16', '#3F6212'],
    icon: 'GlassWater',
  },
  {
    id: 'creatine',
    slug: 'creatine',
    name: 'Креатин',
    description:
      'Моногидрат креатина для повышения силы, мощности и работоспособности на тренировках.',
    color: ['#F59E0B', '#B45309'],
    icon: 'Zap',
  },
  {
    id: 'gainers',
    slug: 'gainers',
    name: 'Гейнеры',
    description:
      'Углеводно-белковые смеси для набора массы людям с ускоренным обменом веществ.',
    color: ['#F97316', '#C2410C'],
    icon: 'Weight',
  },
  {
    id: 'amino',
    slug: 'amino',
    name: 'Аминокислоты и BCAA',
    description:
      'Комплексы аминокислот и BCAA для восстановления мышц и защиты от катаболизма.',
    color: ['#06B6D4', '#0E7490'],
    icon: 'Dna',
  },
  {
    id: 'preworkout',
    slug: 'preworkout',
    name: 'Предтренировочные комплексы',
    description:
      'Стимулирующие комплексы для энергии, концентрации и выносливости перед тренировкой.',
    color: ['#EF4444', '#B91C1C'],
    icon: 'Flame',
  },
  {
    id: 'vitamins',
    slug: 'vitamins',
    name: 'Витамины и минералы',
    description:
      'Витаминно-минеральные комплексы для поддержки здоровья, иммунитета и энергии.',
    color: ['#10B981', '#047857'],
    icon: 'Pill',
  },
  {
    id: 'omega',
    slug: 'omega',
    name: 'Омега-3 и ежедневные добавки',
    description:
      'Жирные кислоты Омега-3 и добавки для повседневного рациона и общего самочувствия.',
    color: ['#3B82F6', '#1D4ED8'],
    icon: 'Fish',
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: 'Спортивные аксессуары',
    description:
      'Перчатки, пояса, бинты и другие аксессуары для силовых и функциональных тренировок.',
    color: ['#64748B', '#334155'],
    icon: 'Dumbbell',
  },
  {
    id: 'isotonic',
    slug: 'isotonic',
    name: 'Изотоники и электролиты',
    description:
      'Напитки для восполнения жидкости, электролитов и энергии во время нагрузок.',
    color: ['#14B8A6', '#0F766E'],
    icon: 'Droplets',
  },
  {
    id: 'bars',
    slug: 'bars',
    name: 'Батончики и перекусы',
    description:
      'Протеиновые батончики и перекусы для быстрого перекуса между тренировками.',
    color: ['#A855F7', '#7E22CE'],
    icon: 'Cookie',
  },
  {
    id: 'l-carnitine',
    slug: 'l-carnitine',
    name: 'L-карнитин',
    description:
      'L-карнитин для поддержки энергетического обмена и восстановления после нагрузок.',
    color: ['#EC4899', '#BE185D'],
    icon: 'Leaf',
  },
  {
    id: 'shakers',
    slug: 'shakers',
    name: 'Шейкеры и бутылки',
    description:
      'Шейкеры, бутылки и ёмкости для приготовления и хранения спортивных напитков.',
    color: ['#0EA5E9', '#0369A1'],
    icon: 'CupSoda',
  },
];

export const categoryById = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);

export const categoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
