import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  if (!Number.isInteger(recipe.day) || recipe.day < 1) errors.push(`Не распознан день: ${recipe.title}`);
  if (!['Завтраки', 'Обеды', 'Ужины', 'Десерты'].includes(recipe.category)) errors.push(`Некорректная категория: ${recipe.title}`);
  if (!Number.isInteger(recipe.servings) || recipe.servings < 1) errors.push(`Некорректные порции: ${recipe.title}`);
  if (!Number.isFinite(recipe.totalMinutes) || recipe.totalMinutes < 1) errors.push(`Не распознано общее время: ${recipe.title}`);
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
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${recipes.length} recipes, ${slugs.size} unique routes.`);
