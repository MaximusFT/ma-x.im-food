import type { Ingredient } from '@/data/types';

export function formatAmount(value: number) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(value);
}

export function formatIngredientQuantity(ingredient: Ingredient, servings: number, baseServings: number) {
  if (ingredient.amount === null || ingredient.unit === null) return ingredient.quantity;
  const ratio = servings / baseServings;
  const maximum = ingredient.amount * ratio;
  if (ingredient.minAmount !== null) {
    return `${formatAmount(ingredient.minAmount * ratio)}–${formatAmount(maximum)} ${ingredient.unit}`;
  }
  return `${formatAmount(maximum)} ${ingredient.unit}`;
}
