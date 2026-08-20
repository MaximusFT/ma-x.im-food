'use client';

import Link from 'next/link';
import { ArrowLeft, Check, ChefHat, Clock3, Minus, Plus, ShoppingBasket, Users } from 'lucide-react';
import { useState } from 'react';
import type { Recipe } from '@/data/types';
import { formatIngredientQuantity } from '@/lib/format';
import { useBasket } from './BasketProvider';

export function RecipeDetails({ recipe }: { recipe: Recipe }) {
  const { basket, addRecipe, removeRecipe } = useBasket();
  const basketItem = basket.find((item) => item.recipeId === recipe.id);
  const [servings, setServings] = useState(basketItem?.servings ?? recipe.servings);
  const isInBasket = Boolean(basketItem);

  const decreaseServings = () => setServings((current) => Math.max(1, current - 1));
  const increaseServings = () => setServings((current) => Math.min(12, current + 1));

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-14">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-gray-600 transition hover:text-gray-950"
      >
        <ArrowLeft size={18} />
        Все рецепты
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.7fr)] lg:gap-14">
        <article>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#15803d]">
              {recipe.category}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">Одобрено</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-medium leading-tight tracking-tight text-gray-950 sm:text-5xl">
            {recipe.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">{recipe.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {recipe.totalMinutes !== null && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                <Clock3 size={18} className="text-[#16a34a]" />
                {recipe.totalMinutes} минут
              </div>
            )}
            <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
              <Users size={18} className="text-[#16a34a]" />
              {recipe.portions}
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
              <ChefHat size={18} className="text-[#16a34a]" />
              {recipe.equipment.slice(0, 2).join(' · ')}
            </div>
          </div>

          <section className="mt-12">
            <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803d]">Подготовьте</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">Ингредиенты</h2>
              </div>
              <div className="flex items-center rounded-2xl border border-gray-200 bg-white p-1 shadow-sm" aria-label="Количество порций">
                <button
                  type="button"
                  onClick={decreaseServings}
                  className="inline-flex size-11 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                  disabled={servings <= 1}
                  aria-label="Уменьшить количество порций"
                >
                  <Minus size={18} />
                </button>
                <span className="min-w-20 text-center text-sm font-semibold">{servings} порц.</span>
                <button
                  type="button"
                  onClick={increaseServings}
                  className="inline-flex size-11 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                  disabled={servings >= 12}
                  aria-label="Увеличить количество порций"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <ul className="divide-y divide-gray-100">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={`${ingredient.productId}-${index}`} className="flex items-start justify-between gap-5 py-4">
                  <span className="text-gray-800">{ingredient.name}</span>
                  <span className="shrink-0 font-semibold text-gray-950">
                    {formatIngredientQuantity(ingredient, servings, recipe.servings)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803d]">Шаг за шагом</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">Приготовление</h2>
            <ol className="mt-7 space-y-5">
              {recipe.steps.map((step, index) => (
                <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-4 text-base leading-7 text-gray-700">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-gray-950 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1.5">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              ['Хранение', recipe.storage],
              ['Замены', recipe.substitutions],
              ['Переносимость', recipe.tolerance],
            ].map(([title, content]) => (
              <div key={title} className="rounded-3xl border border-gray-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-gray-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{content}</p>
              </div>
            ))}
          </section>
        </article>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl shadow-gray-950/5 sm:p-6">
            <p className="text-sm font-semibold text-gray-950">Добавить в меню</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Количество продуктов в покупках пересчитается для {servings} порций.
            </p>
            <button
              type="button"
              onClick={() => addRecipe(recipe.id, servings)}
              className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition ${
                isInBasket
                  ? 'bg-green-50 text-[#15803d] ring-1 ring-inset ring-green-200'
                  : 'bg-[#22c55e] text-white hover:bg-[#16a34a] hover:shadow-lg hover:shadow-green-500/20'
              }`}
            >
              {isInBasket ? <Check size={19} /> : <ShoppingBasket size={19} />}
              {isInBasket ? 'Обновить порции' : 'Добавить в корзину'}
            </button>
            {isInBasket && (
              <button
                type="button"
                onClick={() => removeRecipe(recipe.id)}
                className="mt-2 min-h-11 w-full rounded-xl text-sm font-semibold text-gray-500 transition hover:bg-gray-50 hover:text-gray-950"
              >
                Удалить из корзины
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
