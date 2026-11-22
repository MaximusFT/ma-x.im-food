'use client';

import { useState } from 'react';
import { Check, Leaf, Plus, Search, Users } from 'lucide-react';
import { recipes } from '@/data/recipes';
import type { Recipe } from '@/data/types';
import { RecipeCard } from './RecipeCard';
import { useBasket } from './BasketProvider';
import { RecipeModal } from './RecipeModal';

const collection = recipes.filter((recipe) => recipe.collection === 'fodmap');
const menus = [
  { id: 'document', title: 'Меню из файла', detail: '7 дней · 4 приёма пищи' },
  { id: 'variety', title: 'Разнообразное меню', detail: '7 дней · супы, котлеты, паста' },
  { id: 'extras', title: 'Дополнительные блюда', detail: 'Хлеб, пудинг и соусы' },
] as const;

function nutritionSummary(dayRecipes: Recipe[]) {
  const sum = dayRecipes.reduce((s, recipe) => ({
    kcal: s.kcal + (recipe.nutrition?.kcal ?? 0),
    protein: s.protein + (recipe.nutrition?.protein ?? 0),
    fat: s.fat + (recipe.nutrition?.fat ?? 0),
    carbs: s.carbs + (recipe.nutrition?.carbs ?? 0),
  }), { kcal: 0, protein: 0, fat: 0, carbs: 0 });
  return `≈ ${sum.kcal} ккал · Б ${sum.protein.toFixed(1)} · Ж ${sum.fat.toFixed(1)} · У ${sum.carbs.toFixed(1)} г`;
}

export function FodmapPage() {
  const [menu, setMenu] = useState<'document' | 'variety' | 'extras'>('document');
  const [day, setDay] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { basket, addRecipe } = useBasket();
  const dayRecipes = collection.filter((recipe) => recipe.menu === menu && (menu === 'extras' || recipe.day === day));
  const visible = dayRecipes.filter((recipe) => `${recipe.title} ${recipe.ingredients.map((i) => i.name).join(' ')}`.toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')));
  const allSelected = dayRecipes.every((recipe) => basket.some((item) => item.recipeId === recipe.id && item.servings === 2));

  return <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-[#15803d]"><Leaf size={17} /> Пробный набор</span>
      <h1 className="mt-5 text-4xl font-medium tracking-tight sm:text-6xl">FODMAP</h1>
      <p className="mt-5 text-lg leading-8 text-gray-600">Выберите готовый день или соберите свой из дополнительных блюд. Все закладки на двоих. В рецептах КБЖУ указаны на 100 г; итог дня — по запланированным количествам для одного человека. Ориентир дня для Маши: 1300–1350 ккал; Максим дополняет свою порцию отдельно.</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-gray-600"><span className="inline-flex items-center gap-2"><Users size={17} /> 2 человека</span><span>TM6 + духовка + плита</span><span>Яйца варим отдельно</span></div>
    </div>

    <div className="mt-8 rounded-3xl border border-green-200 bg-green-50/70 p-5 text-sm leading-6 text-gray-700 sm:p-6">
      <p>Порции проверяем по переносимости и приложению Monash. Дополнительные блюда и напитки в итог дня не включены.</p>
      <details className="mt-3"><summary className="min-h-11 cursor-pointer py-2 font-semibold text-[#15803d]">Что изменено и как считать</summary>
        <div className="space-y-3 pt-2">
          <p>Строгая фаза Low FODMAP обычно длится 2–6 недель, затем продукты постепенно возвращают со специалистом. Диета может уменьшать симптомы, но не является доказанным лечением СИБР. Калорийность — выбранный ориентир; её достаточность стоит обсудить со специалистом. Низкогистаминовая диета здесь не предполагается.</p>
          <p>VIANESSE и другие напитки, начинки и дополнительные блюда в итоги дней не входят. При замене блюда вычтите его КБЖУ из суммы дня и добавьте КБЖУ замены.</p>
          <p>Вариант из файла сохранён по дням. Порции круп, картофеля, масла и орехов скорректированы к 1325 ккал; клубника в двух перекусах уменьшена со 100 до 65 г. В ужине первого дня неясное «масло 90%» заменено безлактозным сливочным маслом 82%. Сухая масса риса и киноа первоначально получена из готовой с приблизительным выходом 1:3, затем порции пересчитаны. Делите фактический готовый выход пополам.</p>
          <p>В разнообразном меню томаты заменены морковным соусом или огурцом. Лосось используется свежий и запечённый. Лимон оставлен только в отдельной необязательной заправке. Банан — плотный, не переспелый. Рецепты пока не проверены домашним приготовлением.</p>
          <p>КБЖУ рассчитаны по открытой справочной таблице в исходниках, по средним значениям; для молока, творога, йогурта, лосося и креветок использованы ранее сообщённые этикетки. Фактические бренды, испарение и замены дают погрешность. Два меню — альтернативы, складывать их за один день не нужно.</p>
          <p>У нас один TM6: крупа, овощи и соус готовятся последовательно. Птица запекается в духовке параллельно. Время в карточках учитывает эти этапы; для нескольких блюд одного дня циклы TM6 придётся распределить по времени.</p>
          <p>Утка в приложенных рецептах не встречалась, отдельный рецепт не добавлен. Если включать её позже, готовить в духовке с отдельным расчётом.</p>
        </div>
      </details>
    </div>

    <div className="mt-8 grid gap-3 sm:grid-cols-3" role="group" aria-label="Вариант меню">
      {menus.map((item) => <button key={item.id} type="button" aria-pressed={menu === item.id} onClick={() => { setMenu(item.id); setQuery(''); }} className={`rounded-2xl border p-4 text-left transition ${menu === item.id ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'}`}><span className="block font-semibold">{item.title}</span><span className={`mt-1 block text-sm ${menu === item.id ? 'text-gray-300' : 'text-gray-500'}`}>{item.detail}</span></button>)}
    </div>

    {menu !== 'extras' && <nav className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Выбор дня">{Array.from({ length: 7 }, (_, i) => i + 1).map((n) => <button type="button" key={n} aria-pressed={day === n} onClick={() => { setDay(n); setQuery(''); }} className={`min-h-12 shrink-0 rounded-xl border px-5 text-sm font-semibold ${day === n ? 'border-green-600 bg-green-50 text-[#15803d]' : 'border-gray-200 bg-white text-gray-600'}`}>День {n}</button>)}</nav>}

    <section className="mt-8" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div><h2 className="text-3xl font-semibold tracking-tight">{menu === 'extras' ? 'Дополнительные блюда' : `День ${day}`}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{menu === 'extras' ? 'Выбирайте вместо одного из блюд дня или учитывайте отдельно.' : `${nutritionSummary(dayRecipes)} · на одного человека`}</p></div>
        {menu !== 'extras' && <button type="button" onClick={() => dayRecipes.forEach((recipe) => addRecipe(recipe.id, 2))} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#22c55e] px-5 text-sm font-semibold text-white hover:bg-[#16a34a]">{allSelected ? <Check size={18} /> : <Plus size={18} />}{allSelected ? 'День в корзине на двоих' : 'Добавить день на двоих'}</button>}
      </div>
      <label className="mt-6 flex min-h-12 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4"><Search size={19} className="shrink-0 text-gray-400" /><span className="sr-only">Найти в выбранном дне или дополнительных блюдах</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 outline-none" placeholder="Найти в этом наборе…" /></label>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} onOpen={() => setSelectedRecipe(recipe)} />)}</div>
      {visible.length === 0 && <p className="py-10 text-center text-gray-600">Ничего не найдено. Попробуйте другое название или ингредиент.</p>}
    </section>

    <footer className="mt-12 border-t border-gray-200 pt-6 text-sm leading-6 text-gray-500"><p>Проверка рекомендаций: 21 ноября 2026. Источники:</p><div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 underline underline-offset-4">
      <a href="https://www.monashfodmap.com/blog/3-phases-low-fodmap-diet/">Этапы Low FODMAP — Monash</a>
      <a href="https://www.monashfodmap.com/blog/update-label-reading/">Состав продуктов — Monash</a>
      <a href="https://patient.gastro.org/small-intestinal-bacterial-overgrowth-sibo-managing-with-diet/">Диета при СИБР — AGA</a>
      <a href="https://support-gb.vorwerk.com/hc/en-us/articles/18202627837468-What-you-need-to-know-regarding-the-use-of-the-TM6-measuring-cup">TM6: мерный стаканчик — Vorwerk</a>
      <a href="https://www.food.gov.uk/safety-hygiene/cooking-your-food">Готовность и хранение — FSA</a>
      <a href="https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker">Хранение риса</a>
    </div></footer>
    {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
  </div>;
}
