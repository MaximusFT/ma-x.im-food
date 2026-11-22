'use client';

import { useId, useState } from 'react';
import type { Recipe } from '@/data/types';
import { formatScale, servingsForIngredient } from '@/lib/scaling';

export function RecipeScaleControl({ recipe, servings, onChange }: { recipe: Recipe; servings: number; onChange: (servings: number) => void }) {
  const id = useId();
  const choices = recipe.ingredients.map((ingredient, index) => ({ ingredient, index })).filter(({ ingredient }) => ingredient.amount !== null && ingredient.amount > 0 && ingredient.unit !== null);
  const [selected, setSelected] = useState(choices[0]?.index ?? 0);
  const [target, setTarget] = useState('');
  const ingredient = recipe.ingredients[selected];
  const nextServings = ingredient?.amount ? servingsForIngredient(ingredient.amount, target, recipe.servings) : null;
  const invalid = target !== '' && nextServings === null;
  if (!choices.length) return null;

  return <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm leading-6">
    <h3 className="font-semibold text-gray-950">Пересчитать по ингредиенту</h3>
    <p className="mt-1 text-gray-600">Укажите, сколько продукта у вас есть. Все остальные количества изменятся в той же пропорции.</p>
    <form className="mt-4 space-y-3" onSubmit={(event) => { event.preventDefault(); if (nextServings !== null) onChange(nextServings); }}>
      <div>
        <label htmlFor={`${id}-ingredient`} className="block font-semibold">Опорный ингредиент</label>
        <select id={`${id}-ingredient`} value={selected} onChange={(event) => { setSelected(Number(event.target.value)); setTarget(''); }} className="mt-1 min-h-11 w-full min-w-0 rounded-xl border border-green-200 bg-white px-3 text-base">
          {choices.map(({ ingredient: item, index }) => <option key={index} value={index}>{item.name} · {item.amount} {item.unit}{item.minAmount !== null ? ' (верхняя граница)' : ''}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-amount`} className="block font-semibold">Нужное количество, {ingredient.unit}</label>
        <input id={`${id}-amount`} type="text" inputMode="decimal" value={target} placeholder={formatScale(ingredient.amount! * servings / recipe.servings)} onChange={(event) => setTarget(event.target.value)} aria-invalid={invalid} aria-describedby={`${id}-help`} className="mt-1 min-h-11 w-full rounded-xl border border-green-200 bg-white px-3 text-base focus:outline-none focus:ring-2 focus:ring-green-300" />
        <p id={`${id}-help`} className="mt-1 text-gray-600">{invalid ? 'Введите положительное число, например 230 или 230,5.' : ingredient.minAmount !== null ? 'Для диапазона расчёт ведётся от верхней границы; обе границы изменятся пропорционально.' : `В исходном рецепте: ${formatScale(ingredient.amount!)} ${ingredient.unit}.`}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={nextServings === null} className="min-h-11 rounded-xl bg-[#22c55e] px-4 font-semibold text-white hover:bg-[#16a34a] disabled:opacity-40">Пересчитать</button>
        <button type="button" onClick={() => { onChange(recipe.servings); setTarget(''); }} className="min-h-11 rounded-xl border border-green-200 bg-white px-4 font-semibold">Сбросить</button>
      </div>
    </form>
    <p role="status" className="mt-3 font-semibold text-[#15803d]">Размер закладки: ×{formatScale(servings / recipe.servings)} · {formatScale(servings)} порц.</p>
    <p className="mt-2 text-gray-600">В шагах остаются исходные количества; используйте список ниже. Режимы приготовления не пересчитываются.</p>
    <details className="mt-2 text-gray-600"><summary className="cursor-pointer font-semibold">Как готовить изменённую закладку</summary>
    <p className="mt-2">Количества без точной меры («по вкусу») остаются подсказками. Дробное количество яиц можно отмерить после взбивания: 1 яйцо ≈ 50 г без скорлупы.</p>
    <p className="mt-2 text-gray-600">В тексте шагов указана исходная закладка на {recipe.servings} порц.; берите количества из пересчитанного списка. Время, температура и скорости автоматически не меняются. Большой объём готовьте партиями, не превышая MAX 2,2 л в чаше TM6.</p>
    </details>
  </div>;
}
