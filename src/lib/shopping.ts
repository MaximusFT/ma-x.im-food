import type { Recipe } from '@/data/types';

export type BasketItem = {
  recipeId: string;
  servings: number;
};

export type ShoppingItem = {
  key: string;
  productId: string;
  name: string;
  group: string;
  amount: number | null;
  unit: string | null;
  hasUnquantifiedAmount: boolean;
  recipeTitles: string[];
};

export const shoppingGroupOrder = [
  'Овощи и зелень',
  'Фрукты и ягоды',
  'Мясо и птица',
  'Рыба',
  'Яйца',
  'Молочные и безлактозные продукты',
  'Крупы и сухие продукты',
  'Масла и приправы',
  'Дополнительные товары',
];

export function aggregateShoppingList(basket: BasketItem[], recipes: Recipe[]) {
  const items = new Map<string, ShoppingItem>();

  for (const basketItem of basket) {
    const recipe = recipes.find((candidate) => candidate.id === basketItem.recipeId);
    if (!recipe) continue;
    const ratio = basketItem.servings / recipe.servings;

    for (const ingredient of recipe.ingredients) {
      if (!ingredient.includeInShopping) continue;
      // Keep incompatible units on separate rows (e.g. milk in g and ml).
      const key = `${ingredient.productId}:${ingredient.unit ?? 'quantity'}`;
      const existing = items.get(key);
      const scaledAmount = ingredient.amount === null ? null : ingredient.amount * ratio;

      if (existing) {
        if (scaledAmount !== null) {
          if (existing.unit === null || existing.unit === ingredient.unit) {
            existing.amount = (existing.amount ?? 0) + scaledAmount;
            existing.unit = ingredient.unit;
          }
        } else {
          existing.hasUnquantifiedAmount = true;
        }
        if (!existing.recipeTitles.includes(recipe.title)) existing.recipeTitles.push(recipe.title);
        continue;
      }

      items.set(key, {
        key,
        productId: ingredient.productId,
        name: ingredient.name,
        group: ingredient.group,
        amount: scaledAmount,
        unit: ingredient.unit,
        hasUnquantifiedAmount: scaledAmount === null,
        recipeTitles: [recipe.title],
      });
    }
  }

  const rows = [...items.values()];
  const unitCounts = new Map<string, number>();
  for (const row of rows) unitCounts.set(row.productId, (unitCounts.get(row.productId) ?? 0) + 1);
  // Preserve existing checked-item keys when a product uses just one unit.
  for (const row of rows) if (unitCounts.get(row.productId) === 1) row.key = row.productId;
  return rows.sort((left, right) => {
    const groupDifference = shoppingGroupOrder.indexOf(left.group) - shoppingGroupOrder.indexOf(right.group);
    return groupDifference || left.name.localeCompare(right.name, 'ru');
  });
}
