import { writeFileSync } from 'node:fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const base = 'https://resources.cdn-kaspi.kz/img/m/p/p4a/p09/142006993.jpg';

for (const fmt of ['preview-large', 'medium', 'large', 'zoom', 'original']) {
  const r = await fetch(base + '?format=' + fmt, { headers: { 'User-Agent': UA } });
  const b = Buffer.from(await r.arrayBuffer());
  writeFileSync('_test_' + fmt + '.jpg', b);
  console.log(fmt, '->', r.status, r.headers.get('content-type'), b.length, 'bytes');
}
