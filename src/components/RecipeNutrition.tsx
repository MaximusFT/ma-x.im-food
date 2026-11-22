'use client';

import { useId, useState } from 'react';
import type { Recipe, NutritionValues } from '@/data/types';
import { formatNutrition, nutritionPer100g } from '@/lib/nutrition';

export function RecipeNutrition({ recipe, servings }: { recipe: Recipe; servings: number }) {
  const inputId = useId();
  const [weight, setWeight] = useState('');
  const ratio = servings / recipe.servings;
  const referenceWeight = recipe.estimatedYieldGrams ? recipe.estimatedYieldGrams * ratio : undefined;
  const total = recipe.nutritionTotal ? Object.fromEntries(Object.entries(recipe.nutritionTotal).map(([key, value]) => [key, value * ratio])) as NutritionValues : undefined;
  const enteredWeight = Number(weight.replace(',', '.'));
  const invalid = weight !== '' && (!Number.isFinite(enteredWeight) || enteredWeight <= 0);
  const values = nutritionPer100g(total, weight === '' ? referenceWeight : invalid ? undefined : enteredWeight);

  return <section className="mt-5 rounded-2xl bg-green-50 p-5 text-sm leading-6 text-gray-700" aria-label="Пищевая ценность на 100 грамм">
    <h2 className="font-semibold text-gray-950">КБЖУ на 100 г готового блюда</h2>
    {values ? <p role="status" className="mt-2 font-semibold text-[#15803d]">{formatNutrition(values)}</p> : <p className="mt-2">{total ? 'Укажите вес готового блюда для расчёта на 100 г.' : 'Пока не рассчитаны: не хватает данных о составе и пищевой ценности продуктов.'}</p>}
    {total && <>
      <label htmlFor={inputId} className="mt-4 block font-semibold">Вес всего готового блюда для {servings} порц., г</label>
      <input id={inputId} type="text" inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} aria-invalid={invalid} aria-describedby={`${inputId}-help`} placeholder={referenceWeight ? `Ориентир: ${Math.round(referenceWeight)} г` : 'Взвесьте блюдо без посуды'} className="mt-2 min-h-11 w-full rounded-xl border border-green-200 bg-white px-3 text-base outline-none focus:ring-2 focus:ring-green-300" />
      <p id={`${inputId}-help`} className="mt-2">{invalid ? 'Введите положительный вес в граммах.' : weight === '' && referenceWeight ? `Сейчас принят ориентировочный выход ${Math.round(referenceWeight)} г. Он не измерен: взвесьте готовое блюдо без посуды, чтобы уточнить расчёт.` : 'Используется вес готового блюда без посуды. Поле меняет только деление КБЖУ на массу, не состав и не количества ингредиентов.'}</p>
      <p className="mt-2">Для своей порции умножьте показатели на её вес / 100. Например, для 150 г — на 1,5. При изменении ингредиентов или потерях жира исходный расчёт тоже потребуется обновить.</p>
    </>}
    {recipe.nutritionNote && <p className="mt-3">{recipe.nutritionNote}</p>}
    {recipe.batchNote && <p className="mt-3">{recipe.batchNote}</p>}
    {recipe.nutritionVariations && <div className="mt-4 space-y-3"><p className="font-semibold">Варианты добавок — отдельные ориентиры на 100 г</p>{recipe.nutritionVariations.map((variant) => {
      const v = nutritionPer100g(variant.nutritionTotal, variant.estimatedYieldGrams);
      return <div key={variant.title} className="rounded-xl border border-green-200 bg-white p-3"><h3 className="font-semibold">{variant.title}</h3><p>{variant.additions.map((i) => `${i.name}: ${i.quantity}`).join(' · ')} — на базовую закладку {recipe.servings} порц.</p>{v && <p>{formatNutrition(v)} на 100 г при условном выходе {variant.estimatedYieldGrams} г.</p>}</div>;
    })}<p>Добавки и их КБЖУ не включены в основной вариант и покупки. Их фактический выход нужно взвешивать отдельно.</p></div>}
  </section>;
}
