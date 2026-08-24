'use client';

import { Check, ChefHat, Clock3, Minus, Plus, ShoppingBasket, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Recipe } from '@/data/types';
import { formatIngredientQuantity } from '@/lib/format';
import { useBasket } from './BasketProvider';

export function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const { basket, addRecipe, removeRecipe } = useBasket();
  const basketItem = basket.find((item) => item.recipeId === recipe.id);
  const [servings, setServings] = useState(basketItem?.servings ?? recipe.servings);
  const savedServings = basketItem?.servings;
  const isSaved = savedServings === servings;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950/55 sm:p-5" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        className="relative mx-auto h-full max-w-6xl overflow-y-auto bg-white shadow-2xl sm:rounded-[2rem]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="sticky top-4 z-10 ml-auto mr-4 flex size-12 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg backdrop-blur transition hover:bg-gray-100"
          aria-label="Закрыть рецепт"
        >
          <X size={22} />
        </button>

        <div className="-mt-8 grid gap-10 px-5 pb-12 pt-2 sm:px-9 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.7fr)] lg:px-12">
          <article>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#15803d]">{recipe.category}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">1 человек</span>
            </div>
            <h1 id="recipe-modal-title" className="mt-5 text-3xl font-medium leading-tight tracking-tight text-gray-950 sm:text-5xl">{recipe.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">{recipe.description}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              {recipe.totalMinutes !== null && <span className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700"><Clock3 size={18} className="text-[#16a34a]" />{recipe.totalMinutes} минут</span>}
              <span className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700"><Users size={18} className="text-[#16a34a]" />{servings} порц.</span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700"><ChefHat size={18} className="text-[#16a34a]" />{recipe.equipment.slice(0, 2).join(' · ')}</span>
            </div>

            <section className="mt-10">
              <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
                <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">Подготовьте</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">Ингредиенты</h2></div>
                <div className="flex items-center rounded-2xl border border-gray-200 p-1" aria-label="Количество порций">
                  <button type="button" onClick={() => setServings((value) => Math.max(1, value - 1))} disabled={servings <= 1} className="flex size-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-30" aria-label="Уменьшить количество порций"><Minus size={17} /></button>
                  <span className="min-w-16 text-center text-sm font-semibold">{servings}</span>
                  <button type="button" onClick={() => setServings((value) => Math.min(12, value + 1))} disabled={servings >= 12} className="flex size-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-30" aria-label="Увеличить количество порций"><Plus size={17} /></button>
                </div>
              </div>
              <ul className="divide-y divide-gray-100">
                {recipe.ingredients.map((item, index) => <li key={`${item.productId}-${index}`} className="flex items-start justify-between gap-5 py-4"><span className="text-gray-800">{item.name}</span><strong className="shrink-0 text-gray-950">{formatIngredientQuantity(item, servings, recipe.servings)}</strong></li>)}
              </ul>
            </section>

            <section className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">Шаг за шагом</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">Приготовление</h2>
              <ol className="mt-6 space-y-5">
                {recipe.steps.map((step, index) => <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-4 leading-7 text-gray-700"><span className="flex size-10 items-center justify-center rounded-full bg-gray-950 text-sm font-semibold text-white">{index + 1}</span><p className="pt-1.5">{step}</p></li>)}
              </ol>
            </section>

            <section className="mt-10 grid gap-4 sm:grid-cols-3">
              {[['Хранение', recipe.storage], ['Замены', recipe.substitutions], ['Переносимость', recipe.tolerance]].map(([title, text]) => <div key={title} className="rounded-3xl border border-gray-200 p-5"><h2 className="text-sm font-semibold text-gray-950">{title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{text}</p></div>)}
            </section>
          </article>

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
              <p className="font-semibold text-gray-950">Корзина и покупки</p>
              <p className="mt-2 text-sm leading-6 text-gray-500">В списке покупок продукты будут рассчитаны для {servings} порц.</p>
              <button
                type="button"
                onClick={() => addRecipe(recipe.id, servings)}
                disabled={isSaved}
                className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition ${isSaved ? 'cursor-default bg-green-50 text-[#15803d] ring-1 ring-inset ring-green-200' : 'bg-[#22c55e] text-white hover:bg-[#16a34a]'}`}
              >
                {isSaved ? <Check size={19} /> : <ShoppingBasket size={19} />}
                {isSaved ? `В корзине: ${servings} порц.` : savedServings ? `Обновить до ${servings} порц.` : `Добавить ${servings} порц.`}
              </button>
              {savedServings && <button type="button" onClick={() => removeRecipe(recipe.id)} className="mt-2 min-h-11 w-full rounded-xl text-sm font-semibold text-gray-500 hover:bg-white hover:text-red-600">Удалить из корзины</button>}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
