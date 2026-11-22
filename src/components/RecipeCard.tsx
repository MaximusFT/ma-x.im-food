'use client';

import Link from 'next/link';
import { Check, ChevronRight, Clock3, ShoppingBasket } from 'lucide-react';
import type { Recipe } from '@/data/types';
import { useBasket } from './BasketProvider';
import { formatNutrition, recipeNutritionPer100g } from '@/lib/nutrition';

export function RecipeCard({ recipe, onOpen }: { recipe: Recipe; onOpen?: () => void }) {
  const { basket, addRecipe, removeRecipe } = useBasket();
  const isSelected = basket.some((item) => item.recipeId === recipe.id);
  const usefulMethods = recipe.methods.filter((method) => method !== 'Thermomix').slice(0, 3);
  const per100 = recipeNutritionPer100g(recipe);

  return (
    <article className="group flex min-h-80 flex-col rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-lg hover:shadow-green-950/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">{recipe.category}</span>
        {recipe.totalMinutes !== null && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock3 size={16} />
            {recipe.totalMinutes} мин
          </div>
        )}
      </div>

      {onOpen ? <button type="button" onClick={onOpen} className="mt-6 block text-left outline-none focus-visible:ring-4 focus-visible:ring-green-100">
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-gray-950 transition group-hover:text-[#15803d]">
          {recipe.title}
        </h3>
      </button> : <Link href={`/recipes/${recipe.slug}`} className="mt-6 block outline-none focus-visible:ring-4 focus-visible:ring-green-100">
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-gray-950 transition group-hover:text-[#15803d]">
          {recipe.title}
        </h3>
      </Link>}
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{recipe.description}</p>
      {per100 && <><p className="mt-3 text-sm font-semibold leading-6 text-[#15803d]">На 100 г: {formatNutrition(per100)}</p><p className="mt-1 text-sm text-gray-500">При ориентировочном выходе {recipe.estimatedYieldGrams} г</p></>}
      {recipe.collection === 'fodmap' && <p className="mt-2 text-sm text-gray-500">На двоих · пробный рецепт</p>}
      {recipe.collection === 'home' && <p className="mt-2 text-sm text-gray-500">{recipe.portions}</p>}

      <div className="mt-5 flex flex-wrap gap-2">
        {usefulMethods.length > 0 ? (
          usefulMethods.map((item) => (
            <span key={item} className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500">
              {item}
            </span>
          ))
        ) : (
          <span className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500">Thermomix</span>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-6">
        <button
          type="button"
          onClick={() => (isSelected ? removeRecipe(recipe.id) : addRecipe(recipe.id, recipe.servings))}
          className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition ${
            isSelected
              ? 'bg-green-50 text-[#15803d] ring-1 ring-inset ring-green-200'
              : 'bg-[#22c55e] text-white hover:bg-[#16a34a] hover:shadow-md hover:shadow-green-500/20'
          }`}
        >
          {isSelected ? <Check size={18} /> : <ShoppingBasket size={18} />}
          {isSelected ? 'В корзине' : 'Добавить'}
        </button>
        {onOpen ? <button
          type="button"
          onClick={onOpen}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
          aria-label={`Открыть рецепт «${recipe.title}»`}
        >
          <ChevronRight size={20} />
        </button> : <Link href={`/recipes/${recipe.slug}`} className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950" aria-label={`Открыть рецепт «${recipe.title}»`}><ChevronRight size={20} /></Link>}
      </div>
    </article>
  );
}
