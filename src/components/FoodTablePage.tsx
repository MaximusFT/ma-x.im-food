'use client';

import { Search, TableProperties, X } from 'lucide-react';
import { useState } from 'react';
import { foodTableProducts, matchesFoodSearch, type FoodTableProduct } from '@/data/food-table';

const badgeColors = {
  Low: 'bg-green-50 text-green-800 ring-green-200',
  Medium: 'bg-amber-50 text-amber-900 ring-amber-200',
  High: 'bg-rose-50 text-rose-800 ring-rose-200',
};

function GroupBadge({ group }: { group: FoodTableProduct['group'] }) {
  return group ? <span className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold ring-1 ring-inset ${badgeColors[group]}`}>{group}</span> : <span className="text-sm text-gray-500">Не указана</span>;
}

export function FoodTablePage() {
  const [query, setQuery] = useState('');
  const visible = foodTableProducts.filter((product) => matchesFoodSearch(product, query));

  return <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-[#15803d]"><TableProperties size={17} /> Справочник</span>
      <h1 className="mt-5 text-4xl font-medium tracking-tight text-gray-950 sm:text-5xl">Таблица продуктов</h1>
      <p className="mt-4 text-lg leading-8 text-gray-600">Вся таблица Low FODMAP из присланного PDF. Листайте список или ищите по части слова: «рис» найдёт и «рисовые».</p>
    </div>

    <details className="mt-5 max-w-3xl rounded-2xl border border-gray-200 bg-white px-5 py-1 text-sm leading-6 text-gray-600">
      <summary className="min-h-11 cursor-pointer py-3 font-semibold text-gray-700">О данных и обозначениях</summary>
      <div className="space-y-3 pb-4">
        <p>Названия, группы и дозы перенесены из исходника без пересчёта. Заголовок «Безопасная доза», слова «Без ограничений» и «Безопасной дозы нет» — формулировки PDF, а не персональное разрешение или запрет. Актуальность всех значений независимо не подтверждена.</p>
        <p>Группа и три дозы — разные колонки исходника. Объединённая запись на три дозы сохранена целиком. Индивидуальная переносимость может отличаться; таблица не заменяет рекомендации специалиста.</p>
        <p className="flex flex-wrap gap-x-5 gap-y-2"><a className="font-semibold text-[#15803d] underline underline-offset-4" href="/reference/low-fodmap-table.pdf" target="_blank" rel="noreferrer">Открыть исходный PDF</a><a className="text-[#15803d] underline underline-offset-4" href="https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/" target="_blank" rel="noreferrer">О продуктах и порциях — Monash</a></p>
      </div>
    </details>

    <div className="sticky top-16 z-20 -mx-1 mt-7 bg-white/95 px-1 py-3 backdrop-blur-xl">
      <label htmlFor="food-search" className="sr-only">Поиск по таблице продуктов</label>
      <div className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 shadow-sm focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100">
        <Search size={21} className="shrink-0 text-gray-400" />
        <input id="food-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти продукт, например: рис" autoComplete="off" spellCheck={false} className="min-h-14 min-w-0 flex-1 bg-transparent py-3 text-base outline-none [&::-webkit-search-cancel-button]:hidden" />
        {query && <button type="button" aria-label="Очистить поиск" onClick={() => setQuery('')} className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"><X size={20} /></button>}
      </div>
      <p role="status" className="mt-3 text-sm text-gray-500">{query.trim() ? `Найдено ${visible.length} из ${foodTableProducts.length}` : `Все продукты: ${foodTableProducts.length}`}</p>
    </div>

    <div className="mt-3 hidden overflow-x-auto rounded-3xl border border-gray-200 bg-white md:block">
      <table className="w-full border-collapse text-left text-base">
        <caption className="sr-only">Таблица Low FODMAP: продукт, группа и дозы из PDF</caption>
        <thead className="bg-gray-50 text-sm text-gray-600"><tr>
          <th scope="col" className="px-4 py-4 font-semibold">№</th>
          <th scope="col" className="px-4 py-4 font-semibold">Наименование продукта</th>
          <th scope="col" className="px-4 py-4 font-semibold">Группа</th>
          <th scope="col" className="px-4 py-4 font-semibold">«Безопасная» доза</th>
          <th scope="col" className="px-4 py-4 font-semibold">Средняя доза</th>
          <th scope="col" className="px-4 py-4 font-semibold">Высокая доза</th>
        </tr></thead>
        <tbody className="divide-y divide-gray-100">
          {visible.map((product) => <tr key={product.id} className="align-top hover:bg-gray-50/70">
            <td className="px-4 py-4 text-sm tabular-nums text-gray-400">{product.source.row}</td>
            <th scope="row" className="max-w-sm px-4 py-4 font-medium text-gray-950">{product.name}{product.note && <span className="mt-1 block text-sm font-normal leading-6 text-gray-500">{product.note}</span>}</th>
            <td className="px-4 py-4"><GroupBadge group={product.group} /></td>
            {product.combinedDose ? <td colSpan={3} className="px-4 py-4 text-center text-gray-600">{product.combinedDose}</td> : <>
              <td className="bg-green-50/40 px-4 py-4 text-gray-800">{product.safeDose || '—'}</td>
              <td className="bg-amber-50/40 px-4 py-4 text-gray-800">{product.mediumDose || '—'}</td>
              <td className="bg-rose-50/40 px-4 py-4 text-gray-800">{product.highDose || '—'}</td>
            </>}
          </tr>)}
        </tbody>
      </table>
    </div>

    <div className="mt-3 space-y-3 md:hidden">
      {visible.map((product) => <article key={product.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-start justify-between gap-3 p-4"><h2 className="min-w-0 text-base font-semibold leading-6 text-gray-950"><span className="mr-2 text-sm font-normal text-gray-400">{product.source.row}.</span>{product.name}</h2><GroupBadge group={product.group} /></div>
        {product.combinedDose ? <p className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-600">{product.combinedDose}</p> : <dl className="grid grid-cols-3 border-t border-gray-100 text-center">
          {[[ '«Безопасная»',product.safeDose,'bg-green-50/60'],['Средняя',product.mediumDose,'bg-amber-50/60'],['Высокая',product.highDose,'bg-rose-50/60']].map(([label,dose,color]) => <div key={label} className={`min-w-0 px-2 py-3 ${color}`}><dt className="break-words text-sm text-gray-600">{label}</dt><dd className="mt-1 text-base font-semibold text-gray-950">{dose || '—'}</dd></div>)}
        </dl>}
        {product.note && <p className="px-4 pb-4 text-sm leading-6 text-gray-500">{product.note}</p>}
      </article>)}
    </div>

    {visible.length === 0 && <div className="mt-4 rounded-3xl border border-dashed border-gray-300 px-5 py-12 text-center"><p className="text-lg font-semibold text-gray-900">Ничего не найдено</p><p className="mt-2 text-gray-500">Попробуйте более короткое слово или другую часть названия.</p><button type="button" onClick={() => setQuery('')} className="mt-5 min-h-11 rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white">Показать всю таблицу</button></div>}
  </div>;
}
