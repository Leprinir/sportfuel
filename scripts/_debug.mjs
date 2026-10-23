import { writeFileSync } from 'node:fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const q = encodeURIComponent('Maxler Creatine 100%');
const r = await fetch('https://kaspi.kz/shop/search/?text=' + q, { headers: { 'User-Agent': UA } });
const t = await r.text();
writeFileSync('_debug.html', t);
const imgs = [...t.matchAll(/https:\/\/resources\.cdn-kaspi\.kz\/[^"'\s\\)]+/g)].map((m) => m[0]);
const uniq = [...new Set(imgs)];
console.log('total img urls:', uniq.length);
uniq.slice(0, 30).forEach((u) => console.log(u));
