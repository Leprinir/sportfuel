// Скачивает реальные изображения товаров с Kaspi.kz.
// Поисковый запрос: «бренд + название» → берётся фото первого (наиболее релевантного) результата.
// Изображение сохраняется в public/images/products/<slug>.jpg.
// Требуется установленный Chrome и puppeteer-core. Запуск: node scripts/fetch-images.mjs
import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

// Парсим товары из единого источника данных.
const src = readFileSync(join(root, 'src', 'data', 'products.ts'), 'utf8');
const blocks = src.split('makeProduct({').slice(1);
const items = blocks
  .map((block) => {
    const grab = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*'([^']*)'`));
      return m ? m[1] : null;
    };
    return { slug: grab('slug'), brand: grab('brand'), name: grab('name') };
  })
  .filter((i) => i.slug && i.brand && i.name);

const outDir = join(root, 'public', 'images', 'products');
mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setUserAgent(UA);
await page.setViewport({ width: 1366, height: 900 });

async function extractImageUrl() {
  await page
    .waitForFunction(
      () => {
        const img = [...document.querySelectorAll('img')].find((i) =>
          /\/img\/m\/p\//.test(i.currentSrc || i.src),
        );
        return !!(img && (img.currentSrc || img.src));
      },
      { timeout: 9000 },
    )
    .catch(() => {});
  return page.evaluate(() => {
    const img = [...document.querySelectorAll('img')].find((i) =>
      /\/img\/m\/p\//.test(i.currentSrc || i.src),
    );
    return img ? (img.currentSrc || img.src) : null;
  });
}

async function download(url, dest) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) return false;
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 8000) return false;
  writeFileSync(dest, buf);
  return true;
}

let ok = 0;
let skipped = 0;
const failures = [];

for (const item of items) {
  const dest = join(outDir, `${item.slug}.jpg`);
  if (existsSync(dest)) {
    skipped += 1;
    continue;
  }
  const query = `${item.brand} ${item.name}`;
  try {
    await page.goto('https://kaspi.kz/shop/search/?text=' + encodeURIComponent(query), {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    const url = await extractImageUrl();
    if (!url) {
      failures.push(`${item.slug} (нет фото)`);
      console.log(`SKIP ${item.slug} — нет изображения`);
    } else {
      const done = await download(url, dest);
      if (done) {
        ok += 1;
        console.log(`OK   ${item.slug}`);
      } else {
        failures.push(`${item.slug} (не скачалось)`);
        console.log(`FAIL ${item.slug}`);
      }
    }
  } catch (err) {
    failures.push(`${item.slug} (${err.message})`);
    console.log(`ERR  ${item.slug} — ${err.message}`);
  }
  await sleep(1300);
}

await browser.close();

console.log(`\nСкачано: ${ok}, пропущено (уже были): ${skipped}, ошибок: ${failures.length}`);
if (failures.length) {
  console.log('Не скачаны:');
  for (const f of failures) console.log('  ' + f);
}
