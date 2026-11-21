import products from '../../content/food-table/products.json';

export type FoodTableProduct = {
  id: string;
  name: string;
  group: 'Low' | 'Medium' | 'High' | null;
  safeDose: string | null;
  mediumDose: string | null;
  highDose: string | null;
  combinedDose: string | null;
  aliases: string[];
  note: string;
  source: { document: string; page: number; row: number };
};

export const foodTableProducts = products as FoodTableProduct[];

export function normalizeFoodSearch(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/\s+/g, ' ').trim();
}

export function matchesFoodSearch(product: FoodTableProduct, query: string) {
  const normalized = normalizeFoodSearch(query);
  return !normalized || normalizeFoodSearch([
    product.name, ...product.aliases, product.group ?? '',
    product.safeDose ?? '', product.mediumDose ?? '', product.highDose ?? '',
    product.combinedDose ?? '', product.note,
  ].join(' ')).includes(normalized);
}

export function filterFoodProducts(products: FoodTableProduct[], query: string, lowOnly: boolean, unrestrictedOnly: boolean) {
  return products.filter((product) =>
    matchesFoodSearch(product, query) &&
    (!lowOnly || product.group === 'Low') &&
    (!unrestrictedOnly || normalizeFoodSearch(product.combinedDose ?? '') === 'без ограничений'),
  );
}
