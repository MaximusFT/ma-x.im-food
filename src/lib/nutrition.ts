import type { NutritionValues, Recipe } from '@/data/types';

export function nutritionPer100g(total: NutritionValues | undefined, cookedWeight: number | undefined): NutritionValues | null {
  if (!total || !cookedWeight || !Number.isFinite(cookedWeight) || cookedWeight <= 0) return null;
  return Object.fromEntries(Object.entries(total).map(([key, value]) => [key, value * 100 / cookedWeight])) as NutritionValues;
}

export function formatNutrition(values: NutritionValues) {
  const format = (value: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(value);
  return `≈ ${format(values.kcal)} ккал · Б ${format(values.protein)} г · Ж ${format(values.fat)} г · У ${format(values.carbs)} г`;
}

export function recipeNutritionPer100g(recipe: Recipe) {
  return nutritionPer100g(recipe.nutritionTotal, recipe.estimatedYieldGrams);
}
