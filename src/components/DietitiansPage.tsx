'use client';

import Link from 'next/link';
import { Search, Users, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { recipes } from '@/data/recipes';
import type { Recipe } from '@/data/types';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import { useBasket } from './BasketProvider';

const collection = recipes.filter((recipe) => recipe.collection === 'dietitians');
const days = [...new Set(collection.map((recipe) => recipe.day))].sort((a,b)=>a-b);

export function DietitiansPage() {
  const [day, setDay] = useState(3);
  const [query, setQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { basket, addRecipe } = useBasket();
  const search = query.trim().toLocaleLowerCase('ru-RU');
  const visible = collection.filter((recipe) => (day === 0 || recipe.day === day) && (!search || `${recipe.title} ${recipe.ingredients.map((i)=>i.name).join(' ')}`.toLocaleLowerCase('ru-RU').includes(search)));

  return <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-sm font-semibold text-[#15803d]"><Users size={17} /> Адаптации присланных меню</span>
      <h1 className="mt-5 text-4xl font-medium tracking-tight sm:text-6xl">От диетологов</h1>
      <p className="mt-5 text-lg leading-8 text-gray-600">21 блюдо с семи фотографий. Сохранены номера дней 3, 4, 5, 7, 8, 9 и 10. Каждый рецепт адаптирован на двоих, с КБЖУ на 100 г, пересчётом ингредиентов и общими покупками.</p>
      <p className="mt-3 leading-7 text-gray-600">Thermomix готовит гарниры, суп, тесто и соусы. Яйца варим отдельно на плите; рыбу запекаем в духовке, птицу — в духовке или на сковороде по рецепту. Омлеты, креветки и лепёшки готовим на сковороде. Количества на фотографиях приняты за одну порцию; изменения перечислены внутри карточек.</p>
    </div>
    <section className="mt-7 rounded-3xl border border-green-200 bg-green-50/70 p-5 text-sm leading-6 text-gray-700 sm:p-6" aria-label="Что изменено в рецептах">
      <h2 className="font-semibold text-gray-950">Без помидоров, с конкретными заменами</h2>
      <p className="mt-2">Помидоры заменены огурцом и морковью с учётом личной реакции. Лук из исходника заменён только зелёными перьями — белая часть и репчатая луковица не используются. Это наша адаптация, а не предположение о том, что имел в виду автор.</p>
      <details className="mt-3">
        <summary className="cursor-pointer py-2 font-semibold text-[#15803d]">Остальные изменения и ограничения порций</summary>
        <div className="mt-2 space-y-3">
          <p>По нашей таблице выбраны консервативные количества на одного человека: авокадо 30 г; зелёный сладкий перец 50 г в дне 10; брокколи — 60 г только соцветий; кабачок — 60 г. Красный перец в базовые рецепты не включён. Зелёные перья лука — обычно 3–5 г как приправа, а не равная по массе замена луковицы. Увеличение закладки не увеличивает переносимую порцию на человека.</p>
          <p>Свежие шампиньоны заменены вешенками по 60 г на человека. Обычные хлеб, тортильи и паста заменены вариантами с подходящим составом без инулина, лука и чеснока; булгур и кускус — рисом. Это выбор для этих рецептов: глютен и FODMAP — разные вопросы, а маркировка «без глютена» сама по себе не гарантирует подходящий состав.</p>
          <p>Молоко, йогурт, сливки, сметана и мягкие сыры — без лактозы. Чеснок в соусах убран, добавлены зелёные перья. Состав ветчины, горчицы, соевого соуса и лепёшек проверяется отдельно. Слабосолёный лосось в завтраках заменён свежим запечённым; в карточках указана масса сырой рыбы.</p>
          <p>Готовые веса из фото переведены в рабочие количества сухой крупы и сырого мяса с пояснениями; это ориентиры, а не точные коэффициенты выхода. После замен калорийность исходного дня меняется. Эта коллекция помогает выбирать блюда и порции по вашему плану, а не задаёт новую суточную норму.</p>
          <p>Все рецепты пробные: они не проверены лабораторно и пока не проверены домашним приготовлением. Личная реакция важнее цвета строки; отдельная низкогистаминовая пригодность не заявляется. Вода, чай и кофе из фотографий не добавлены как «без ограничений»: напитки оценивайте по своей переносимости.</p>
          <Link href="/food-table" className="inline-block min-h-11 py-2 font-semibold text-[#15803d] underline underline-offset-4">Открыть нашу таблицу продуктов</Link>
        </div>
      </details>
    </section>
    <nav className="mt-7 flex gap-2 overflow-x-auto pb-2" aria-label="Дни от диетологов">
      {[0,...days].map((n)=><button key={n} type="button" aria-pressed={day===n} onClick={()=>setDay(n)} className={`min-h-11 shrink-0 rounded-xl border px-4 text-sm font-semibold ${day===n?'border-green-600 bg-green-50 text-[#15803d]':'border-gray-200 bg-white text-gray-600'}`}>{n===0?'Все дни':`День ${n}`}</button>)}
    </nav>
    <label className="mt-5 block text-sm font-semibold text-gray-700" htmlFor="dietitian-search">Найти блюдо или ингредиент</label>
    <div className="relative mt-2"><Search size={19} className="pointer-events-none absolute left-4 top-4 text-gray-400" /><input id="dietitian-search" type="search" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Например, рис или вешенки…" className="min-h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-base outline-none focus:ring-2 focus:ring-green-300" /></div>
    <div className="mt-9 space-y-12">
      {days.filter((n)=>visible.some((recipe)=>recipe.day===n)).map((n)=>{
        const dayRecipes=collection.filter((recipe)=>recipe.day===n);
        const saved=dayRecipes.every((recipe)=>basket.some((item)=>item.recipeId===recipe.id && item.servings===2));
        return <section key={n} aria-labelledby={`dietitian-day-${n}`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 id={`dietitian-day-${n}`} className="text-3xl font-semibold tracking-tight">День {n}</h2><p className="mt-2 text-sm text-gray-500">Завтрак, обед и ужин · закладки на двоих</p></div><button type="button" disabled={saved} onClick={()=>dayRecipes.forEach((recipe)=>addRecipe(recipe.id,2))} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#22c55e] px-4 text-sm font-semibold text-white hover:bg-[#16a34a] disabled:bg-green-100 disabled:text-[#15803d]">{saved?<Check size={18}/>:<Plus size={18}/>} {saved?'День в корзине':'Добавить день на двоих'}</button></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.filter((recipe)=>recipe.day===n).map((recipe)=><RecipeCard key={recipe.id} recipe={recipe} onOpen={()=>setSelectedRecipe(recipe)}/>)}</div>
        </section>;
      })}
      {visible.length===0 && <p className="rounded-2xl bg-gray-50 p-6 text-gray-600">В выбранном дне ничего не найдено. Попробуйте «Все дни» или другое слово.</p>}
    </div>
    <p className="mt-10 text-sm leading-6 text-gray-500">Проверка источников: 27 ноября 2026. <a className="underline" href="https://www.monashfodmap.com/blog/low-fodmap-shopping-list/">Monash: выбор продуктов</a>, <a className="underline" href="https://www.monashfodmap.com/blog/cooking-with-onion-and-garlic-myths-and/">зелёные перья, лук и чеснок</a>, <a className="underline" href="https://globalsupport.vorwerk.com/hc/en-us/articles/5616394562076-What-you-need-to-know-regarding-the-use-of-the-TM6-measuring-cup">Vorwerk: аксессуары при нагреве</a>, <a className="underline" href="https://www.food.gov.uk/safety-hygiene/cooking-your-food">FSA: готовность и хранение</a>. Точные порции конкретных продуктов сверяйте с актуальным приложением Monash.</p>
    {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={()=>setSelectedRecipe(null)}/>}
  </div>;
}
