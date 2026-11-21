import { CalendarDays, ChefHat } from 'lucide-react';
import { approvedRecipes as recipes } from '@/data/recipes';
import type { RecipeCategory } from '@/data/types';
import { RecipeCard } from './RecipeCard';

const categoryOrder: RecipeCategory[] = ['Завтраки', 'Обеды', 'Ужины', 'Десерты'];
const originalRecipes = recipes.filter((recipe) => !recipe.collection);
const days = [...new Set(originalRecipes.map((recipe) => recipe.day))].sort((left, right) => left - right);

export function DaysPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-[#15803d]">
          <CalendarDays size={16} />
          Готовое меню
        </div>
        <h1 className="mt-5 text-4xl font-medium tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">Рецепты по дням</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          Каждый день собран целиком: завтрак, обед, ужин и десерт. Блюда можно добавлять в корзину по одному.
        </p>
      </div>

      <nav className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Перейти к дню">
        {days.map((day) => (
          <a
            key={day}
            href={`#day-${day}`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-300 hover:text-[#15803d]"
          >
            <CalendarDays size={17} />
            День {day}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-16">
        {days.map((day) => {
          const dayRecipes = originalRecipes
            .filter((recipe) => recipe.day === day)
            .sort((left, right) => categoryOrder.indexOf(left.category) - categoryOrder.indexOf(right.category));

          return (
            <section key={day} id={`day-${day}`} className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-4">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gray-950 text-white">
                  <ChefHat size={22} />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803d]">Меню</p>
                  <h2 className="text-3xl font-semibold tracking-tight text-gray-950">День {day}</h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {dayRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
