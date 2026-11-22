'use client';

import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShoppingBasket, Trash2 } from 'lucide-react';
import { formatScale } from '@/lib/scaling';
import { recipes } from '@/data/recipes';
import { useBasket } from './BasketProvider';

export function BasketPage() {
  const { basket, hydrated, removeRecipe, setRecipeServings, clearBasket } = useBasket();
  const selectedRecipes = basket
    .map((item) => ({ item, recipe: recipes.find((recipe) => recipe.id === item.recipeId) }))
    .filter((entry): entry is { item: (typeof basket)[number]; recipe: (typeof recipes)[number] } => Boolean(entry.recipe));

  if (!hydrated) {
    return <div className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12 lg:px-8" aria-busy="true" />;
  }

  if (selectedRecipes.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-3xl bg-green-50 text-[#16a34a]">
          <ShoppingBasket size={30} />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950">Корзина пока пустая</h1>
        <p className="mt-3 leading-7 text-gray-600">Добавьте несколько блюд — затем мы соберём их ингредиенты в общий список.</p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#22c55e] px-6 text-sm font-semibold text-white transition hover:bg-[#16a34a]"
        >
          Выбрать блюда
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803d]">Ваше меню</p>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-gray-950 sm:text-5xl">Корзина блюд</h1>
          <p className="mt-4 text-gray-600">Выбрано блюд: {selectedRecipes.length}</p>
        </div>
        <button
          type="button"
          onClick={clearBasket}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-950"
        >
          <Trash2 size={17} />
          Очистить
        </button>
      </div>

      <div className="mt-9 space-y-3">
        {selectedRecipes.map(({ item, recipe }) => (
          <article key={recipe.id} className="grid gap-5 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#15803d]">{recipe.category}</span>
              <Link href={`/recipes/${recipe.slug}`} className="mt-2 block text-xl font-semibold tracking-tight text-gray-950 hover:text-[#15803d]">
                {recipe.title}
              </Link>
              <p className="mt-2 text-sm text-gray-500">{recipe.totalMinutes ? `${recipe.totalMinutes} минут · ` : ''}{recipe.ingredients.length} ингредиентов · закладка ×{formatScale(item.servings / recipe.servings)}</p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="flex items-center rounded-2xl border border-gray-200 p-1">
                <button
                  type="button"
                  onClick={() => setRecipeServings(recipe.id, Math.max(0.1, item.servings - 1))}
                  disabled={item.servings <= 0.1}
                  className="inline-flex size-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
                  aria-label={`Уменьшить порции для «${recipe.title}»`}
                >
                  <Minus size={17} />
                </button>
                <span className="min-w-20 text-center text-sm font-semibold">{formatScale(item.servings)} порц.</span>
                <button
                  type="button"
                  onClick={() => setRecipeServings(recipe.id, item.servings + 1)}

                  className="inline-flex size-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
                  aria-label={`Увеличить порции для «${recipe.title}»`}
                >
                  <Plus size={17} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeRecipe(recipe.id)}
                className="inline-flex size-11 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label={`Удалить «${recipe.title}»`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="sticky bottom-20 mt-8 rounded-3xl border border-green-200 bg-green-50/95 p-4 shadow-xl shadow-green-950/10 backdrop-blur sm:flex sm:items-center sm:justify-between sm:p-5 lg:bottom-5">
        <div>
          <p className="font-semibold text-gray-950">Всё выбрали?</p>
          <p className="mt-1 text-sm text-gray-600">Соберём одинаковые продукты и рассчитаем количество.</p>
        </div>
        <Link
          href="/shopping"
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#22c55e] px-6 text-sm font-semibold text-white transition hover:bg-[#16a34a] sm:mt-0 sm:w-auto"
        >
          Перейти к покупкам
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
