import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import ts from 'typescript';
const compile = async path => ts.transpileModule(await readFile(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const url = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const commerce = url(await compile('src/lib/commerce.ts'));
const { seo } = await import(url((await compile('src/lib/seo.ts')).replace(/(["'])\.\/commerce\1/, JSON.stringify(commerce))));
test('official social artwork has exact 1200 × 630 JPEG dimensions', async () => {
  const data = await readFile('public/og-image.jpg');
  assert.equal(data.readUInt16BE(0), 0xffd8);
  let offset = 2; let dimensions;
  while (offset < data.length) {
    if (data[offset] !== 0xff) break;
    const marker = data[offset + 1];
    if ([0xc0, 0xc1, 0xc2].includes(marker)) { dimensions = [data.readUInt16BE(offset + 7), data.readUInt16BE(offset + 5)]; break; }
    offset += 2 + data.readUInt16BE(offset + 2);
  }
  assert.deepEqual(dimensions, [1200, 630]);
});
test('global metadata uses official image; product images are preserved', () => {
  const general = seo('Produtos', 'Descrição', '/produtos').meta;
  assert.equal(general.find(m => m.property === 'og:image').content, 'https://iyamarlene.com.br/og-image.jpg');
  assert.equal(general.find(m => m.property === 'og:image:width').content, '1200');
  assert.equal(general.find(m => m.property === 'og:image:height').content, '630');
  const product = seo('Produto real', 'Descrição', '/produto/real', 'https://loja.iyamarlene.com.br/real.webp').meta;
  assert.equal(product.find(m => m.property === 'og:image').content, 'https://loja.iyamarlene.com.br/real.webp');
  assert.equal(product.some(m => m.property === 'og:image:width'), false);
});
test('official logo is copied unchanged to the installable WordPress presentation', async () => {
  assert.deepEqual(await readFile('public/logo-iya-marlene.webp'), await readFile('wordpress/iya-storefront/assets/logo-iya-marlene.webp'));
  const manifest = JSON.parse(await readFile('public/site.webmanifest', 'utf8'));
  for (const icon of manifest.icons) await access('public' + icon.src);
  await access('public/favicon.ico'); await access('public/apple-touch-icon.png');
});
