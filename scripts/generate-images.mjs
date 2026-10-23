// Генерирует локальные SVG-изображения товаров в public/images/products/.
// Изображения демонстрационные: градиент категории + название + бренд + масса.
// Запуск: npm run images
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const colorMap = {
  protein: ['#84CC16', '#3F6212'],
  creatine: ['#F59E0B', '#B45309'],
  gainers: ['#F97316', '#C2410C'],
  amino: ['#06B6D4', '#0E7490'],
  preworkout: ['#EF4444', '#B91C1C'],
  vitamins: ['#10B981', '#047857'],
  omega: ['#3B82F6', '#1D4ED8'],
  accessories: ['#64748B', '#334155'],
  isotonic: ['#14B8A6', '#0F766E'],
  bars: ['#A855F7', '#7E22CE'],
  'l-carnitine': ['#EC4899', '#BE185D'],
  shakers: ['#0EA5E9', '#0369A1'],
};

// slug, categoryId, brand, name, meta (масса/объём для подписи)
const items = [
  ['gold-standard-100-whey', 'protein', 'Optimum Nutrition', 'Gold Standard 100% Whey', '2,27 кг'],
  ['maxler-100-golden-whey', 'protein', 'Maxler', '100% Golden Whey', '908 г'],
  ['rline-whey', 'protein', 'RLine', 'Whey Protein', '900 г'],
  ['biotech-iso-whey-zero', 'protein', 'BioTechUSA', 'Iso Whey Zero', '2,27 кг'],
  ['maxler-creatine-100', 'creatine', 'Maxler', 'Creatine 100%', '300 г'],
  ['on-micronized-creatine', 'creatine', 'Optimum Nutrition', 'Micronized Creatine', '300 г'],
  ['rline-creatine-monohydrate', 'creatine', 'RLine', 'Creatine Monohydrate', '500 г'],
  ['maxler-mega-gainer', 'gainers', 'Maxler', 'Mega Gainer', '3 кг'],
  ['rline-mass-gainer', 'gainers', 'RLine', 'Mass Gainer', '3,3 кг'],
  ['biotech-hyper-mass', 'gainers', 'BioTechUSA', 'Hyper Mass', '2,27 кг'],
  ['on-serious-mass', 'gainers', 'Optimum Nutrition', 'Serious Mass', '2,72 кг'],
  ['maxler-bcaa-211', 'amino', 'Maxler', 'BCAA 2:1:1', '300 г'],
  ['on-bcaa-1000', 'amino', 'Optimum Nutrition', 'BCAA 1000', '200 капсул'],
  ['rline-bcaa-12000', 'amino', 'RLine', 'BCAA 12000', '300 г'],
  ['scitec-amino-5600', 'amino', 'Scitec Nutrition', 'Amino 5600', '1000 таблеток'],
  ['maxler-preworkout', 'preworkout', 'Maxler', 'Pre-Workout', '250 г'],
  ['biotech-black-blood', 'preworkout', 'BioTechUSA', 'Black Blood', '300 г'],
  ['rline-pump-up', 'preworkout', 'RLine', 'Pump Up', '300 г'],
  ['scitec-hot-blood', 'preworkout', 'Scitec Nutrition', 'Hot Blood', '350 г'],
  ['maxler-daily-multivitamin', 'vitamins', 'Maxler', 'Daily Multivitamin', '90 таблеток'],
  ['on-opti-men', 'vitamins', 'Optimum Nutrition', 'Opti-Men', '90 таблеток'],
  ['rline-vitamin-d3', 'vitamins', 'RLine', 'Vitamin D3', '120 капсул'],
  ['biotech-multivitamin-men', 'vitamins', 'BioTechUSA', 'Multivitamin for Men', '60 капсул'],
  ['maxler-omega-3', 'omega', 'Maxler', 'Omega-3', '100 капсул'],
  ['on-fish-oil', 'omega', 'Optimum Nutrition', 'Fish Oil', '100 капсул'],
  ['rline-omega-3', 'omega', 'RLine', 'Omega-3', '90 капсул'],
  ['biotech-omega-3', 'omega', 'BioTechUSA', 'Omega-3', '120 капсул'],
  ['irongrip-training-gloves', 'accessories', 'IronGrip', 'Перчатки для тренировок', 'Размер L'],
  ['fittools-lifting-belt', 'accessories', 'FitTools', 'Пояс для тренировок', '10 см'],
  ['irongrip-wrist-wraps', 'accessories', 'IronGrip', 'Кистевые бинты', '50 см'],
  ['nordic-fitness-gym-backpack', 'accessories', 'Nordic Fitness', 'Спортивный рюкзак', '25 л'],
  ['maxler-isodrink', 'isotonic', 'Maxler', 'Isodrink', '500 г'],
  ['biotech-isotonic', 'isotonic', 'BioTechUSA', 'IsoTonic', '640 г'],
  ['rline-iso', 'isotonic', 'RLine', 'Iso', '500 г'],
  ['maxler-protein-bar', 'bars', 'Maxler', 'Protein Bar', '12 × 60 г'],
  ['rline-protein-bar', 'bars', 'RLine', 'Protein Bar', '12 × 50 г'],
  ['biotech-protein-bar', 'bars', 'BioTechUSA', 'Protein Bar', '12 × 60 г'],
  ['on-protein-bar', 'bars', 'Optimum Nutrition', 'Protein Bar', '12 × 60 г'],
  ['maxler-l-carnitine-3000', 'l-carnitine', 'Maxler', 'L-Carnitine 3000', '1000 мл'],
  ['rline-l-carnitine', 'l-carnitine', 'RLine', 'L-Carnitine', '500 мл'],
  ['biotech-l-carnitine-100000', 'l-carnitine', 'BioTechUSA', 'L-Carnitine 100000', '500 мл'],
  ['maxler-shaker-700', 'shakers', 'Maxler', 'Шейкер', '700 мл'],
  ['rline-shaker-600', 'shakers', 'RLine', 'Шейкер', '600 мл'],
  ['sportline-water-bottle-750', 'shakers', 'SportLine', 'Бутылка для воды', '750 мл'],
];

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const initials = (brand) => {
  const words = brand.split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0][0] || '?').toUpperCase();
};

function wrap(text, maxLen) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = '';
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length <= maxLen || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function productSvg(slug, categoryId, brand, name, meta) {
  const [c1, c2] = colorMap[categoryId] || ['#64748B', '#334155'];
  const nameLines = wrap(name, 24);
  const init = initials(brand);

  const nameText = nameLines
    .map((line, i) => {
      const y = nameLines.length === 1 ? 640 : 606 + i * 40;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="30" font-weight="600" fill="#ffffff" opacity="0.95">${esc(line)}</text>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${esc(`${brand} ${name}`)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <circle cx="690" cy="110" r="230" fill="#ffffff" opacity="0.07"/>
  <circle cx="90" cy="730" r="260" fill="#ffffff" opacity="0.05"/>
  <polygon points="660 130 585 305 645 305 625 470 745 285 680 285 700 130" fill="#ffffff" opacity="0.10"/>
  <circle cx="400" cy="330" r="150" fill="#ffffff" opacity="0.16"/>
  <text x="400" y="392" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="130" font-weight="800" fill="#ffffff" opacity="0.92">${esc(init)}</text>
  <text x="400" y="560" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="40" font-weight="700" fill="#ffffff" letter-spacing="5">${esc(brand.toUpperCase())}</text>
  ${nameText}
  <rect x="336" y="692" width="128" height="44" rx="22" fill="#ffffff" opacity="0.95"/>
  <text x="400" y="720" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="22" font-weight="700" fill="#0F172A">${esc(meta)}</text>
</svg>`;
}

const outDir = join(root, 'public', 'images', 'products');
mkdirSync(outDir, { recursive: true });

let count = 0;
for (const [slug, categoryId, brand, name, meta] of items) {
  writeFileSync(join(outDir, `${slug}.svg`), productSvg(slug, categoryId, brand, name, meta), 'utf8');
  count += 1;
}

// Проверка: убедимся, что все slug из products.ts покрыты.
const productsSrc = readFileSync(join(root, 'src', 'data', 'products.ts'), 'utf8');
const slugRegex = /slug:\s*'([^']+)'/g;
const sourceSlugs = new Set();
let m;
while ((m = slugRegex.exec(productsSrc))) sourceSlugs.add(m[1]);

const generatedSlugs = new Set(items.map((i) => i[0]));
const missing = [...sourceSlugs].filter((s) => !generatedSlugs.has(s));

console.log(`Сгенерировано изображений: ${count}`);
if (missing.length > 0) {
  console.warn('ВНИМАНИЕ: нет изображений для слагов:', missing.join(', '));
} else {
  console.log('Все слаги товаров покрыты изображениями.');
}
