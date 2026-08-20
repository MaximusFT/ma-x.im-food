'use client';

import Link from 'next/link';
import { Check, CheckCheck, ChevronDown, RotateCcw, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { recipes } from '@/data/recipes';
import { formatAmount } from '@/lib/format';
import { aggregateShoppingList, shoppingGroupOrder } from '@/lib/shopping';
import { useBasket } from './BasketProvider';

export function ShoppingPage() {
  const { basket, checkedShoppingItems, hydrated, toggleShoppingItem, clearShoppingChecks } = useBasket();
  const [showPurchased, setShowPurchased] = useState(true);
  const shoppingItems = useMemo(() => aggregateShoppingList(basket, recipes), [basket]);
  const checkedCount = shoppingItems.filter((item) => checkedShoppingItems.includes(item.key)).length;
  const progress = shoppingItems.length > 0 ? Math.round((checkedCount / shoppingItems.length) * 100) : 0;

  if (!hydrated) {
    return <div className="mx-auto min-h-[60vh] max-w-5xl px-5 py-12 lg:px-8" aria-busy="true" />;
  }

  if (shoppingItems.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-3xl bg-green-50 text-[#16a34a]">
          <ShoppingCart size={30} />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950">Список покупок пуст</h1>
        <p className="mt-3 leading-7 text-gray-600">Сначала добавьте блюда в корзину — продукты появятся здесь автоматически.</p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#22c55e] px-6 text-sm font-semibold text-white transition hover:bg-[#16a34a]"
        >
          Перейти к рецептам
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-5 lg:px-8 lg:py-14">
      <div className="rounded-3xl bg-gray-950 p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-green-400">Поход в магазин</p>
            <h1 className="mt-2 text-4xl font-medium tracking-tight sm:text-5xl">Покупки</h1>
            <p className="mt-4 text-sm text-gray-300">{checkedCount} из {shoppingItems.length} позиций куплено</p>
          </div>
          {checkedCount > 0 && (
            <button
              type="button"
              onClick={clearShoppingChecks}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <RotateCcw size={17} />
              Сбросить галочки
            </button>
          )}
        </div>
        <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/15" aria-label={`Куплено ${progress}%`}>
          <div className="h-full rounded-full bg-[#22c55e] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowPurchased((current) => !current)}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-950"
      >
        <ChevronDown size={17} className={`transition ${showPurchased ? 'rotate-180' : ''}`} />
        {showPurchased ? 'Скрыть купленное' : 'Показать купленное'}
      </button>

      <div className="mt-4 space-y-8">
        {shoppingGroupOrder.map((group) => {
          const groupItems = shoppingItems.filter(
            (item) => item.group === group && (showPurchased || !checkedShoppingItems.includes(item.key)),
          );
          if (groupItems.length === 0) return null;

          return (
            <section key={group}>
              <h2 className="px-2 text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">{group}</h2>
              <div className="mt-3 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                {groupItems.map((item, index) => {
                  const checked = checkedShoppingItems.includes(item.key);
                  return (
                    <label
                      key={item.key}
                      className={`flex min-h-20 cursor-pointer items-center gap-4 px-4 py-3 transition active:bg-gray-50 sm:px-5 ${
                        index > 0 ? 'border-t border-gray-100' : ''
                      } ${checked ? 'bg-gray-50' : 'hover:bg-green-50/40'}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleShoppingItem(item.key)}
                        className="peer sr-only"
                      />
                      <span
                        className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg border-2 transition ${
                          checked ? 'border-[#22c55e] bg-[#22c55e] text-white' : 'border-gray-300 bg-white text-transparent'
                        }`}
                        aria-hidden="true"
                      >
                        <Check size={17} strokeWidth={3} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block font-semibold transition ${checked ? 'text-gray-400 line-through' : 'text-gray-950'}`}>
                          {item.name}
                        </span>
                        <span className="mt-1 block truncate text-xs text-gray-400" title={item.recipeTitles.join(', ')}>
                          {item.recipeTitles.join(' · ')}
                        </span>
                      </span>
                      <span className={`shrink-0 text-base font-semibold ${checked ? 'text-gray-400' : 'text-gray-950'}`}>
                        {item.amount !== null && item.unit
                          ? `${formatAmount(item.amount)} ${item.unit}${item.hasUnquantifiedAmount ? ' + по вкусу' : ''}`
                          : 'по вкусу'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {checkedCount === shoppingItems.length && (
        <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-6 text-center">
          <CheckCheck className="mx-auto text-[#16a34a]" size={30} />
          <p className="mt-3 text-lg font-semibold text-gray-950">Всё куплено</p>
          <p className="mt-1 text-sm text-gray-600">Галочки останутся на этом телефоне после закрытия страницы.</p>
        </div>
      )}

      <p className="mt-10 text-center text-xs leading-5 text-gray-400">
        Корзина и отметки хранятся только в этом браузере и не передаются на сервер.
      </p>
    </div>
  );
}
