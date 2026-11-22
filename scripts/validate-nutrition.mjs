import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { products } from '../content/fodmap/catalog.mjs';

const source = await readFile(new URL('../src/lib/nutrition.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { nutritionPer100g } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const total = { kcal: 1200, protein: 60, fat: 40, carbs: 150 };
assert.deepEqual(nutritionPer100g(total, 600), { kcal: 200, protein: 10, fat: 40 / 6, carbs: 25 });
assert.equal(nutritionPer100g(total, 1200).kcal, 100); // same energy, more water
assert.equal(nutritionPer100g({ kcal: 1500, protein: 75, fat: 50, carbs: 187.5 }, 750).kcal, 200); // proportional scaling keeps density
for (const weight of [undefined, 0, -1, NaN, Infinity]) assert.equal(nutritionPer100g(total, weight), null);
assert.equal(nutritionPer100g(undefined, 600), null);

const recipes = JSON.parse(await readFile(new URL('../src/generated/recipes.json', import.meta.url), 'utf8'));
const pudding = recipes.find((r) => r.id === 'fodmap-extra-strawberry-vanilla-pudding');
assert.equal(pudding.servings, 2);
assert.equal(pudding.menu, 'extras');
assert.equal(pudding.nutritionVariations.length, 2);
assert.ok(pudding.storage.includes('24 часа'));
assert.equal(pudding.ingredients.find((i) => i.productId === 'rice').amount, 60);
assert.equal(pudding.ingredients.find((i) => i.productId === 'sugar').amount, 22.5);
const base = pudding.nutritionTotal;
for (const variant of pudding.nutritionVariations) {
  for (const [index, key] of ['kcal', 'protein', 'fat', 'carbs'].entries()) {
    const addition = variant.additions.reduce((sum, i) => sum + products[i.productId][index + 2] * i.amount / 100, 0);
    assert.ok(Math.abs(variant.nutritionTotal[key] - base[key] - addition) < 0.001);
  }
  const addedMass = variant.additions.reduce((sum,i) => sum + i.amount, 0);
  assert.equal(variant.estimatedYieldGrams, pudding.estimatedYieldGrams + addedMass);
}
console.log('Validated nutrition per 100 g, cooked-weight adjustments and both pudding variations.');
