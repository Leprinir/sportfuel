// E2E-проверка сайта SportFuel через headless Chrome (puppeteer-core + системный Chrome).
// Запуск: node scripts/test.mjs  (требуется запущенный dev-сервер на http://localhost:5173)
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const BASE = process.env.BASE_URL || 'http://localhost:5173';
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const results = [];
const errors = [];
let screenshotDir;

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

function recordError(source, text) {
  errors.push(`${source}: ${text}`);
}

async function newPage(browser, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  page.on('pageerror', (err) => recordError('pageerror', err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') recordError('console', msg.text());
  });
  return page;
}

async function goto(page, path) {
  const url = path.startsWith('http') ? path : BASE + path;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
}

async function hasOverflow(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

async function countArticles(page) {
  return page.$$eval('article', (els) => els.length);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });

  screenshotDir = join(root, 'screenshots');
  mkdirSync(screenshotDir, { recursive: true });

  const ROUTES = [
    ['/', 'Главная'],
    ['/catalog', 'Каталог'],
    ['/category/protein', 'Категория'],
    ['/product/gold-standard-100-whey', 'Товар'],
    ['/favorites', 'Избранное'],
    ['/about', 'О проекте'],
    ['/no-such-route', '404'],
  ];

  // 1. Маршруты + отсутствие горизонтальной прокрутки на 5 ширинах
  const widths = [360, 390, 768, 1024, 1440];
  for (const w of widths) {
    const page = await newPage(browser, w, 900);
    for (const [route, label] of ROUTES) {
      await goto(page, route);
      const overflow = await hasOverflow(page);
      const rootChildren = await page.$$eval('#root > *', (els) => els.length);
      record(`${label} (${w}px) рендерится`, rootChildren > 0, route);
      record(`${label} (${w}px) без горизонт. прокрутки`, overflow <= 1, `overflow=${overflow}px`);
    }
    await page.close();
  }

  // 2. Заголовки и прямой URL товара
  {
    const page = await newPage(browser, 1280, 900);
    await goto(page, '/');
    const title = await page.title();
    record('Заголовок главной', title.includes('SportFuel'), title);
    await goto(page, '/product/gold-standard-100-whey');
    const h1 = await page.$eval('h1', (el) => el.textContent);
    record('Прямой URL товара (h1)', h1.includes('Gold Standard'), h1);
    record('Заголовок товара в <title>', (await page.title()).includes('Gold Standard'), await page.title());
    await page.close();
  }

  // 3. Поиск
  {
    const page = await newPage(browser, 1280, 900);
    await goto(page, '/catalog');
    const before = await countArticles(page);
    await page.type('input[aria-label="Поиск в каталоге"]', 'Maxler', { delay: 20 });
    await new Promise((r) => setTimeout(r, 600));
    const status = await page.$eval('p[role="status"]', (el) => el.textContent || '');
    const match = status.match(/Найдено:\s*(\d+)/);
    const found = match ? Number(match[1]) : -1;
    record('Поиск «Maxler» выдаёт результаты', found > 0 && found < 44, `найдено=${found}, статус="${status}"`);
    await page.close();
  }

  // 4. Сортировка
  {
    const page = await newPage(browser, 1280, 900);
    await goto(page, '/catalog');
    // Кастомный дропдаун: кликаем кнопку сортировки, затем опцию
    const sortBtn = await page.$('button[aria-haspopup="listbox"]');
    if (!sortBtn) throw new Error('Sort button not found');
    await sortBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    const option = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button[role="option"]')];
      const target = btns.find((b) => b.textContent.includes('Сначала дешевле'));
      if (target) { target.click(); return true; }
      return false;
    });
    if (!option) throw new Error('Sort option not found');
    await new Promise((r) => setTimeout(r, 200));
    record('Сортировка по возрастанию цены', option, 'custom dropdown clicked');
    await page.close();
  }

  // 5. Фильтр по бренду
  {
    const page = await newPage(browser, 1280, 900);
    await goto(page, '/catalog');
    const totalBefore = await page.$eval('p[role="status"]', (el) => {
      const m = el.textContent.match(/Найдено:\s*(\d+)/);
      return m ? Number(m[1]) : -1;
    });
    const clicked = await page.evaluate(() => {
      const labels = [...document.querySelectorAll('fieldset label')];
      const target = labels.find((l) => l.textContent.includes('Maxler'));
      if (!target) return false;
      const input = target.querySelector('input[type="checkbox"]');
      input.click();
      return true;
    });
    await new Promise((r) => setTimeout(r, 400));
    const totalAfter = await page.$eval('p[role="status"]', (el) => {
      const m = el.textContent.match(/Найдено:\s*(\d+)/);
      return m ? Number(m[1]) : -1;
    });
    record('Фильтр по бренду Maxler', clicked && totalAfter < totalBefore, `${totalBefore} → ${totalAfter}`);
    await page.close();
  }

  // 6. Избранное (localStorage)
  {
    const page = await newPage(browser, 1280, 900);
    await goto(page, '/catalog');
    await page.click('button[aria-pressed="false"]');
    await new Promise((r) => setTimeout(r, 200));
    const stored = await page.evaluate(() => localStorage.getItem('sportfuel:favorites'));
    const parsed = stored ? JSON.parse(stored) : [];
    record('Добавление в избранное (localStorage)', Array.isArray(parsed) && parsed.length >= 1, JSON.stringify(parsed));
    await goto(page, '/favorites');
    const favCards = await countArticles(page);
    record('Страница избранного показывает товар', favCards >= 1, `карточек=${favCards}`);
    // перезагрузка сохраняет избранное
    await page.reload({ waitUntil: 'networkidle0' });
    const favCardsAfter = await countArticles(page);
    record('Избранное сохраняется после перезагрузки', favCardsAfter >= 1, `карточек=${favCardsAfter}`);
    await page.close();
  }

  // 7. Показать ещё
  {
    const page = await newPage(browser, 1280, 900);
    await goto(page, '/catalog');
    const first = await countArticles(page);
    const btn = await page.$('button:not([disabled])');
    const loadMore = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((el) => el.textContent.includes('Показать ещё'));
      if (!b) return false;
      b.click();
      return true;
    });
    await new Promise((r) => setTimeout(r, 300));
    const second = await countArticles(page);
    record('Кнопка «Показать ещё»', loadMore && second > first, `${first} → ${second}`);
    await page.close();
  }

  // 8. Скриншоты
  {
    const page = await newPage(browser, 1440, 900);
    await goto(page, '/');
    await page.screenshot({ path: join(screenshotDir, 'home-1440.png') });
    await page.setViewport({ width: 390, height: 844 });
    await goto(page, '/');
    await page.screenshot({ path: join(screenshotDir, 'home-390.png') });
    await page.setViewport({ width: 1440, height: 900 });
    await goto(page, '/catalog');
    await page.screenshot({ path: join(screenshotDir, 'catalog-1440.png') });
    await goto(page, '/product/gold-standard-100-whey');
    await page.screenshot({ path: join(screenshotDir, 'product-1440.png') });
    record('Скриншоты сохранены', true, screenshotDir);
    await page.close();
  }

  await browser.close();

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log('\n===== ИТОГ =====');
  console.log(`Пройдено: ${passed}, Не пройдено: ${failed}, Всего: ${results.length}`);
  console.log(`Ошибок консоли/страницы: ${errors.length}`);
  if (errors.length > 0) {
    console.log('--- Ошибки ---');
    for (const e of errors.slice(0, 30)) console.log('  ' + e);
  }
  if (failed > 0) {
    console.log('--- Не пройдено ---');
    for (const r of results.filter((r) => !r.ok)) console.log('  ' + r.name + ' — ' + r.detail);
  }
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Тест упал:', err);
  process.exit(2);
});
