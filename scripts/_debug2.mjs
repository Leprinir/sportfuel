import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setUserAgent(UA);
await page.setViewport({ width: 1440, height: 900 });

const q = encodeURIComponent('Maxler Creatine 100%');
await page.goto('https://kaspi.kz/shop/search/?text=' + q, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise((r) => setTimeout(r, 3000));

const info = await page.evaluate(() => {
  const bodyText = document.body.innerText.slice(0, 1500);
  const imgs = [...document.querySelectorAll('img')].map((i) => i.currentSrc || i.src).filter(Boolean);
  const cardCount = document.querySelectorAll('[class*="item-card"], [class*="ItemCard"], article, [data-testid*="card"]').length;
  const links = [...document.querySelectorAll('a')].map((a) => a.href).filter((h) => /\/shop\/p\/|product/.test(h)).slice(0, 10);
  return { bodyText, imgCount: imgs.length, sampleImgs: imgs.slice(0, 15), cardCount, links };
});

console.log('title:', await page.title());
console.log('cardCount:', info.cardCount);
console.log('imgCount:', info.imgCount);
console.log('sampleImgs:');
info.sampleImgs.forEach((u) => console.log('  ' + u));
console.log('product links:');
info.links.forEach((u) => console.log('  ' + u));
console.log('--- BODY TEXT ---');
console.log(info.bodyText);

await browser.close();
