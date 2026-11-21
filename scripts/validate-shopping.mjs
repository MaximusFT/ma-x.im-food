import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/shopping.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { aggregateShoppingList } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const recipes = JSON.parse(await readFile(new URL('../src/generated/recipes.json', import.meta.url), 'utf8'));

// Independent expected quantities for a complete two-person day, including repeat products.
for (const menu of ['document', 'variety']) for (let day = 1; day <= 7; day += 1) {
  const selected = recipes.filter((recipe) => recipe.menu === menu && recipe.day === day);
  const basket = selected.map((recipe) => ({ recipeId: recipe.id, servings: 2 }));
  const actual = aggregateShoppingList(basket, recipes);
  const expected = new Map();
  for (const recipe of selected) for (const item of recipe.ingredients) {
    if (!item.includeInShopping) continue;
    const key = `${item.productId}:${item.unit}`;
    expected.set(key, (expected.get(key) ?? 0) + item.amount);
  }
  assert.equal(actual.length, expected.size);
  for (const row of actual) {
    assert.ok(Math.abs(row.amount - expected.get(`${row.productId}:${row.unit}`)) < 0.001);
    assert.notEqual(row.productId, 'water');
  }
  const onePerson = aggregateShoppingList(basket.map((item) => ({ ...item, servings: 1 })), recipes);
  for (const row of onePerson) assert.ok(Math.abs(row.amount * 2 - actual.find((other) => other.key === row.key).amount) < 0.001);
}

// Mixing the old collection and FODMAP must not silently discard a different unit.
const milk = (id, amount, unit) => ({ id, title: id, servings: 2, ingredients: [{ productId: 'milk', name: 'Молоко', group: 'Молочные и безлактозные продукты', includeInShopping: true, amount, unit }] });
const mixed = [milk('old', 100, 'г'), milk('new', 200, 'мл'), milk('other', 50, 'г')];
const rows = aggregateShoppingList(mixed.map((r) => ({ recipeId: r.id, servings: 2 })), mixed);
assert.equal(rows.length, 2);
assert.equal(rows.find((row) => row.unit === 'г').amount, 150);
assert.equal(rows.find((row) => row.unit === 'мл').amount, 200);
assert.equal(new Set(rows.map((row) => row.key)).size, 2);
assert.equal(aggregateShoppingList([{ recipeId: 'old', servings: 2 }], mixed)[0].key, 'milk');
console.log('Validated shopping totals and portion scaling for 14 days; mixed units preserved.');
