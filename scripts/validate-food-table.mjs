import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const products = JSON.parse(await readFile(new URL('../content/food-table/products.json', import.meta.url), 'utf8'));
const ids = new Set();
for (const p of products) {
  assert.ok(p.id && !ids.has(p.id), `Duplicate or missing id: ${p.id}`);
  ids.add(p.id);
  assert.ok(typeof p.name === 'string' && p.name.trim(), `Missing name: ${p.id}`);
  assert.ok(['Low', 'Medium', 'High', null].includes(p.group), `Invalid group: ${p.id}`);
  assert.ok(Array.isArray(p.aliases) && p.aliases.every((a) => typeof a === 'string'), `Invalid aliases: ${p.id}`);
  assert.equal(typeof p.note, 'string');
  const separate = [p.safeDose, p.mediumDose, p.highDose];
  assert.ok(p.combinedDose ? separate.every((v) => v === null) : separate.every((v) => typeof v === 'string' && v.trim()), `Mixed or missing dose cells: ${p.id}`);
  assert.ok(p.source.document && p.source.page > 0 && p.source.row > 0, `Missing provenance: ${p.id}`);
}
const imported = products.filter((p) => p.source.document === 'low-fodmap-table.pdf');
assert.deepEqual(imported.map((p) => p.source.row), Array.from({ length: 492 }, (_, i) => i + 1));
assert.equal(imported.filter((p) => p.combinedDose).length, 106);
assert.equal(products.find((p) => p.id === 'pdf-050').highDose, '270 гр.');
assert.equal(products.find((p) => p.id === 'pdf-206').highDose, '75 гр.');

// Exercise the search actually imported by the UI, including normalization and future aliases.
const code = (await readFile(new URL('../src/data/food-table.ts', import.meta.url), 'utf8')).replace(/^import products from .+;\r?\n/m, `const products = ${JSON.stringify(products)};\n`);
const compiled = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { matchesFoodSearch, filterFoodProducts } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const search = (query) => products.filter((p) => matchesFoodSearch(p, query));
assert.equal(search('').length, products.length);
assert.equal(search('   ').length, products.length);
assert.deepEqual(search('  РИС  '), search('рис'));
assert.ok(search('рис').some((p) => p.name === 'Рисовые хлебцы'));
assert.ok(search('рис').some((p) => p.name === 'Белый рис'));
assert.ok(search('МЕД').some((p) => p.name === 'Мёд'));
assert.equal(search('несуществующийпродукт123').length, 0);
assert.ok(matchesFoodSearch({ ...products[0], aliases: ['тестовый синоним'] }, 'синоним'));
assert.equal(search('').length, products.length); // clearing restores the whole table
assert.deepEqual(filterFoodProducts(products, '', false, false), products);
const low = filterFoodProducts(products, '', true, false);
assert.ok(low.length > 0 && low.length < products.length);
assert.ok(low.every((p) => p.group === 'Low'));
const unlimited = filterFoodProducts(products, '', false, true);
assert.ok(unlimited.length > 0 && unlimited.length < low.length);
assert.ok(unlimited.every((p) => p.combinedDose === 'Без ограничений'));
assert.ok(!unlimited.some((p) => p.name === 'Бренди')); // numeric merged dose is not unlimited
assert.ok(!unlimited.some((p) => p.combinedDose === 'Безопасной дозы нет'));
const combined = filterFoodProducts(products, 'рис', true, true);
assert.ok(combined.some((p) => p.name === 'Белый рис'));
assert.ok(!combined.some((p) => p.name === 'Рисовые хлебцы')); // Low, but portion-limited
assert.ok(!combined.some((p) => p.name === 'Рисовое молоко')); // High
assert.deepEqual(combined, unlimited.filter((p) => p.group === 'Low' && matchesFoodSearch(p, 'рис')));
assert.equal(filterFoodProducts(products, 'несуществующийпродукт123', true, true).length, 0);
console.log(`Validated ${products.length} food-table entries and substring search (${search('рис').length} matches for «рис»).`);
console.log(`Validated filters: Low ${low.length}, unlimited ${unlimited.length}, combined rice query ${combined.length}.`);
