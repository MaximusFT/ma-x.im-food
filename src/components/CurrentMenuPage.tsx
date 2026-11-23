'use client';

import { CalendarCheck2, ChevronRight, ShoppingBasket, Utensils } from 'lucide-react';
import { useState } from 'react';
import type { Recipe } from '@/data/types';
import { currentMenuBonusRecipes, currentMenuDays, currentMenuExtraRecipes, currentMenuMainRecipes, currentMenuRecipes } from '@/data/current-menu';
import { useBasket } from './BasketProvider';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import { recipes } from '@/data/recipes';

const byId = new Map(currentMenuRecipes.map((recipe) => [recipe.id, recipe]));
const extraRecipes = [...recipes.filter((recipe) => recipe.id === 'fodmap-extra-salmon-cream-soup'), ...currentMenuExtraRecipes, ...recipes.filter((recipe) => recipe.collection === 'home')];

export function CurrentMenuPage() {
  const { basket, addRecipe } = useBasket();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const addDay = (recipeIds: string[]) => {
    for (const recipeId of recipeIds) {
      const current = basket.find((item) => item.recipeId === recipeId)?.servings ?? 0;
      addRecipe(recipeId, Math.min(12, current + 1));
    }
  };

  const addAll = () => {
    for (const recipe of currentMenuMainRecipes) addRecipe(recipe.id, 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
      <section className="grid gap-8 rounded-[2rem] border border-green-200 bg-gradient-to-br from-green-50 via-white to-white p-6 shadow-sm sm:p-9 lg:grid-cols-[1fr_20rem] lg:items-end">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#15803d]">
            <CalendarCheck2 size={16} /> Для Маши · 1 человек
          </div>
          <h1 className="mt-5 text-4xl font-medium tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">Меню</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Четыре уникальных дня по присланному плану — без повторяющихся карточек. В каждом дне есть завтрак / обед и ужин.
          </p>
        </div>
        <aside className="rounded-3xl bg-gray-950 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-400">План</p>
          <p className="mt-2 text-2xl font-semibold">4 дня</p>
          <p className="mt-3 text-sm leading-6 text-gray-300">Все количества рассчитаны на одну порцию. Общие советы и таблицы замен с фото не включены как назначения.</p>
          <button type="button" onClick={addAll} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#22c55e] px-4 text-sm font-semibold text-white transition hover:bg-[#16a34a]">
            <ShoppingBasket size={18} /> Добавить все 4 дня
          </button>
        </aside>
      </section>

      <nav className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Перейти к дню">
        {currentMenuDays.map(({ day }) => <a key={day} href={`#current-day-${day}`} className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm">День {day}</a>)}
      </nav>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {currentMenuDays.map(({ day, recipeIds }) => (
          <section key={day} id={`current-day-${day}`} className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <header className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803d]">Меню</p><h2 className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">День {day}</h2></div>
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-green-50 text-[#16a34a]"><Utensils size={21}/></span>
            </header>
            <div className="mt-5 divide-y divide-gray-100 border-y border-gray-100">
              {recipeIds.map((recipeId, index) => {
                const recipe = byId.get(recipeId);
                if (!recipe) return null;
                return <button type="button" onClick={() => setSelectedRecipe(recipe)} key={recipe.id} className="grid min-h-24 w-full grid-cols-[1fr_auto] items-center gap-4 py-4 text-left">
                  <span><small className="block text-xs font-semibold uppercase tracking-wider text-gray-400">{index === 0 ? 'Завтрак / обед' : 'Ужин'}</small><strong className="mt-1 block text-lg leading-6 text-gray-950">{recipe.title}</strong><small className="mt-1 block text-gray-500">{recipe.totalMinutes} минут · 1 порция</small></span>
                  <ChevronRight className="text-gray-400" size={20}/>
                </button>;
              })}
            </div>
            <button type="button" onClick={() => addDay(recipeIds)} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 text-sm font-semibold text-[#15803d] transition hover:bg-green-100">
              <ShoppingBasket size={18}/> Добавить день в корзину
            </button>
          </section>
        ))}
      </div>

      <section id="additional-dishes" className="mt-14 scroll-mt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803d]">Можно добавить к плану</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">Дополнительные блюда</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">Эти блюда не привязаны к конкретному дню. Добавляйте их в корзину отдельно, когда решите приготовить.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{extraRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} onOpen={() => setSelectedRecipe(recipe)}/>)}</div>
      </section>

      <section className="mt-14">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803d]">Отдельный лист с фото</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">Дополнительные десерты</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">Эти рецепты пересчитаны на одного человека, но не добавляются в основное меню четырёх дней автоматически.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{currentMenuBonusRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} onOpen={() => setSelectedRecipe(recipe)}/>)}</div>
      </section>

      <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 sm:p-6">
        <strong>Важно о переносе меню:</strong> количества продуктов сохранены с присланных листов. Это не подтверждает, что весь рацион соответствует Low FODMAP или строгому низкогистаминовому питанию; индивидуально спорные продукты отмечены внутри рецептов.
      </section>

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
}
