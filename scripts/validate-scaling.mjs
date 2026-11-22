import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
async function load(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
}
const { servingsForIngredient } = await load('../src/lib/scaling.ts');
const { aggregateShoppingList } = await load('../src/lib/shopping.ts');
const { formatIngredientQuantity } = await load('../src/lib/format.ts');
const { nutritionPer100g } = await load('../src/lib/nutrition.ts');
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
near(servingsForIngredient(200, '230', 2), 2.3);
near(servingsForIngredient(200, '250', 2), 2.5);
near(servingsForIngredient(200, ' 230,5 ', 2), 2.305);
near(servingsForIngredient(200, '50', 2), 0.5);
near(servingsForIngredient(2, '3', 2), 3);
for (const target of ['', ' ', '0', '-1', 'NaN', 'Infinity', '1e5', '1,2,3']) assert.equal(servingsForIngredient(200, target, 2), null);
assert.equal(servingsForIngredient(0, '230', 2), null);
assert.equal(servingsForIngredient(200, '230', 0), null);
const ingredient = { productId: 'curd', name: 'Творог', group: 'Молочные и безлактозные продукты', includeInShopping: true, amount: 200, minAmount: null, unit: 'г', quantity: '200 г' };
const recipe = { id: 'bread', title: 'Хлеб', servings: 2, ingredients: [ingredient, { ...ingredient, productId: 'flour', amount: 150 }] };
const servings = servingsForIngredient(200, '230', 2);
// Exact fractional batch survives browser storage and drives the shopping list.
const basket = JSON.parse(JSON.stringify([{ recipeId: recipe.id, servings }]));
const list = aggregateShoppingList(basket, [recipe]);
near(list.find(i => i.productId === 'curd').amount, 230);
near(list.find(i => i.productId === 'flour').amount, 172.5);
assert.equal(formatIngredientQuantity({ ...ingredient, minAmount: 100 }, 2.5, 2), '125–250 г');
assert.equal(formatIngredientQuantity({ ...ingredient, amount: null, quantity: 'по вкусу' }, 2.5, 2), 'по вкусу');
const total = { kcal: 1200, protein: 80, fat: 40, carbs: 130 };
const factor = servings / 2;
const scaled = Object.fromEntries(Object.entries(total).map(([key, value]) => [key, value * factor]));
for (const key of Object.keys(total)) near(nutritionPer100g(scaled, 600 * factor)[key], nutritionPer100g(total, 600)[key]);
console.log('Validated ingredient scaling, invalid amounts, ranges, fractional shopping persistence and nutrition per 100 g.');
