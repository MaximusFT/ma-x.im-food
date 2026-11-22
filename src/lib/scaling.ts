/** Always scale from the original recipe, without compounding display rounding. */
export function servingsForIngredient(baseAmount: number, target: string, baseServings: number): number | null {
  const normalized = target.trim().replace(',', '.');
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;
  const amount = Number(normalized);
  const servings = amount / baseAmount * baseServings;
  return Number.isFinite(baseAmount) && baseAmount > 0 && Number.isFinite(baseServings) && baseServings > 0 && Number.isFinite(servings) && servings > 0 ? servings : null;
}

export function formatScale(value: number) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 3 }).format(value);
}
