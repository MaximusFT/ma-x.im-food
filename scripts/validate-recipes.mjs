import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../content/fodmap/catalog.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const recipes = JSON.parse(await readFile(path.join(projectRoot, 'src', 'generated', 'recipes.json'), 'utf8'));
const errors = [];
const slugs = new Set();
const allowedGroups = new Set([
  'Овощи и зелень',
  'Фрукты и ягоды',
  'Мясо и птица',
  'Рыба',
  'Яйца',
  'Молочные и безлактозные продукты',
  'Крупы и сухие продукты',
  'Масла и приправы',
  'Дополнительные товары',
  'Не учитывать',
]);

for (const recipe of recipes) {
  if (slugs.has(recipe.slug)) errors.push(`Повторяется slug: ${recipe.slug}`);
  slugs.add(recipe.slug);
  if (!recipe.title || !recipe.description) errors.push(`Нет названия или описания: ${recipe.slug}`);
  if (!Number.isInteger(recipe.day) || (recipe.menu === 'extras' || recipe.collection === 'home' ? recipe.day !== 0 : recipe.day < 1)) errors.push(`Не распознан день: ${recipe.title}`);
  if (!['Завтраки', 'Обеды', 'Ужины', 'Десерты', 'Перекусы', 'Соусы', 'Хлеб', 'Закуски', 'Напитки'].includes(recipe.category)) errors.push(`Некорректная категория: ${recipe.title}`);
  if (!Number.isInteger(recipe.servings) || recipe.servings < 1) errors.push(`Некорректные порции: ${recipe.title}`);
  if (!Number.isFinite(recipe.totalMinutes) || recipe.totalMinutes < 1) errors.push(`Не распознано общее время: ${recipe.title}`);
  if (recipe.activeMinutes !== null && recipe.activeMinutes > recipe.totalMinutes) errors.push(`Активное время больше общего: ${recipe.title}`);
  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) errors.push(`Нет шагов: ${recipe.title}`);
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) errors.push(`Нет ингредиентов: ${recipe.title}`);
  if (!Array.isArray(recipe.methods) || recipe.methods.length === 0) errors.push(`Нет способов приготовления: ${recipe.title}`);

  for (const ingredient of recipe.ingredients) {
    if (!ingredient.productId || !ingredient.name) errors.push(`Некорректный ингредиент: ${recipe.title}`);
    if (!allowedGroups.has(ingredient.group)) errors.push(`Неизвестная группа «${ingredient.group}»: ${ingredient.name}`);
    if (ingredient.amount !== null && (!Number.isFinite(ingredient.amount) || ingredient.amount <= 0)) {
      errors.push(`Некорректное количество: ${recipe.title} / ${ingredient.name}`);
    }
  }

  if (recipe.collection === 'fodmap') {
    if (recipe.servings !== 2 || recipe.status !== 'testing') errors.push(`FODMAP: ожидаются 2 порции и пробный статус: ${recipe.id}`);
    if (!recipe.storage || !recipe.tolerance || !recipe.portionWeight) errors.push(`FODMAP: не хватает пояснений: ${recipe.id}`);
    const sums = [0, 0, 0, 0];
    for (const ingredient of recipe.ingredients) {
      const reference = products[ingredient.productId];
      if (!reference || !Number.isFinite(ingredient.amount)) { errors.push(`FODMAP: нет справочных данных: ${recipe.id}/${ingredient.productId}`); continue; }
      if (ingredient.productId === 'water' && ingredient.includeInShopping) errors.push(`Вода попала в покупки: ${recipe.id}`);
      const factor = ingredient.productId === 'eggs' ? ingredient.amount * 0.5 / recipe.servings : ingredient.amount / 100 / recipe.servings;
      sums.forEach((_, i) => { sums[i] += reference[i + 2] * factor; });
      if (/томат|помидор|редис/i.test(ingredient.name)) errors.push(`Исключённый продукт: ${recipe.id}`);
    }
    ['kcal', 'protein', 'fat', 'carbs'].forEach((key, i) => {
      if (!Number.isFinite(recipe.nutrition?.[key]) || Math.abs(recipe.nutrition[key] - sums[i]) > (i === 0 ? 1 : 0.2)) errors.push(`FODMAP: КБЖУ не сходятся с ингредиентами: ${recipe.id}/${key}`);
      if (!Number.isFinite(recipe.nutritionTotal?.[key]) || Math.abs(recipe.nutritionTotal[key] - sums[i] * recipe.servings) > 0.01) errors.push(`FODMAP: суммарные КБЖУ не сходятся: ${recipe.id}/${key}`);
    });
    if (!Number.isFinite(recipe.estimatedYieldGrams) || recipe.estimatedYieldGrams <= 0) errors.push(`Нет ориентировочного выхода: ${recipe.id}`);
  }
}

for (const menu of ['document', 'variety']) {
  for (let day = 1; day <= 7; day += 1) {
    const meals = recipes.filter((recipe) => recipe.menu === menu && recipe.day === day);
    const count = menu === 'variety' && day === 5 ? 5 : 4;
    if (meals.length !== count) errors.push(`Неполный день ${menu}/${day}: ${meals.length}`);
    if (new Set(meals.map((recipe) => recipe.meal)).size !== count) errors.push(`Повторён приём пищи ${menu}/${day}`);
    const kcal = meals.reduce((sum, recipe) => sum + recipe.nutrition.kcal, 0);
    if (kcal < 1300 || kcal > 1350) errors.push(`День вне ориентира: ${menu}/${day} = ${kcal}`);
  }
}
if (recipes.filter((recipe) => recipe.menu === 'extras').length !== 7) errors.push('Ожидается 7 дополнительных рецептов');

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${recipes.length} recipes, ${slugs.size} unique routes.`);
