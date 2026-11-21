'use client';

import {
  Ban,
  Check,
  ChevronDown,
  CookingPot,
  PackageSearch,
  Search,
  SlidersHorizontal,
  Utensils,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { recipes } from '@/data/recipes';
import type { CookingMethod, Recipe, RecipeCategory } from '@/data/types';
import { RecipeCard } from './RecipeCard';

type CategoryFilter = 'Все' | RecipeCategory;
type FilterPanel = 'products' | 'methods' | null;
type ProductMode = 'include' | 'exclude';

type ProductFilterOption = {
  id: string;
  label: string;
  productIds: string[];
  count: number;
  featured: boolean;
};

const categories: CategoryFilter[] = ['Все', 'Завтраки', 'Обеды', 'Ужины', 'Перекусы', 'Десерты', 'Соусы', 'Хлеб'];
const methodOptions: CookingMethod[] = [
  'Только чаша',
  'Только Thermomix',
  'До 30 минут',
  'Varoma',
  'Духовка',
  'Сковорода',
];

const featuredProductFilters: Array<Omit<ProductFilterOption, 'count' | 'featured'>> = [
  { id: 'chicken', label: 'Курица', productIds: ['chicken-thigh', 'chicken-breast'] },
  { id: 'turkey', label: 'Индейка', productIds: ['turkey-fillet'] },
  { id: 'beef', label: 'Говядина', productIds: ['beef-mince'] },
  { id: 'fish', label: 'Рыба', productIds: ['cod-fillet', 'gilthead', 'salmon', 'tuna'] },
  { id: 'eggs', label: 'Яйца', productIds: ['eggs'] },
  { id: 'cheese', label: 'Сыр', productIds: ['fresh-curd-cheese'] },
  { id: 'curd', label: 'Творог', productIds: ['lactose-free-curd', 'curd-product'] },
  { id: 'potato', label: 'Картофель', productIds: ['potato'] },
  { id: 'rice', label: 'Рис', productIds: ['rice'] },
  { id: 'buckwheat', label: 'Гречка', productIds: ['buckwheat', 'buckwheat-flour'] },
  { id: 'zucchini', label: 'Кабачок', productIds: ['zucchini'] },
  { id: 'broccoli', label: 'Брокколи', productIds: ['broccoli'] },
];

function recipeHasProductFilter(recipe: Recipe, filter: ProductFilterOption) {
  return recipe.ingredients.some((ingredient) => filter.productIds.includes(ingredient.productId));
}

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function RecipeCatalog() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('Все');
  const [openPanel, setOpenPanel] = useState<FilterPanel>(null);
  const [productMode, setProductMode] = useState<ProductMode>('include');
  const [productQuery, setProductQuery] = useState('');
  const [includedProducts, setIncludedProducts] = useState<string[]>([]);
  const [excludedProducts, setExcludedProducts] = useState<string[]>([]);
  const [methods, setMethods] = useState<CookingMethod[]>([]);

  const productFilters = useMemo<ProductFilterOption[]>(() => {
    const actualProducts = new Map<string, { label: string }>();
    for (const recipe of recipes) {
      for (const ingredient of recipe.ingredients) {
        if (!ingredient.includeInShopping) continue;
        actualProducts.set(ingredient.productId, {
          label: ingredient.name,
        });
      }
    }

    const featuredIds = new Set(featuredProductFilters.flatMap((filter) => (filter.productIds.length === 1 ? filter.productIds : [])));
    const featured = featuredProductFilters.map((filter) => ({
      ...filter,
      featured: true,
      count: recipes.filter((recipe) => recipe.ingredients.some((ingredient) => filter.productIds.includes(ingredient.productId))).length,
    }));
    const remaining = [...actualProducts.entries()]
      .filter(([productId]) => !featuredIds.has(productId))
      .map(([productId, product]) => ({
        id: `product:${productId}`,
        label: product.label,
        productIds: [productId],
        count: recipes.filter((recipe) => recipe.ingredients.some((ingredient) => ingredient.productId === productId)).length,
        featured: false,
      }))
      .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, 'ru'));

    return [...featured, ...remaining];
  }, []);

  const productFilterMap = useMemo(() => new Map(productFilters.map((filter) => [filter.id, filter])), [productFilters]);
  const visibleProductFilters = useMemo(() => {
    const normalized = productQuery.trim().toLocaleLowerCase('ru');
    return productFilters.filter((filter) => !normalized || filter.label.toLocaleLowerCase('ru').includes(normalized));
  }, [productFilters, productQuery]);

  const visibleRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru');

    return recipes.filter((recipe) => {
      const searchable = [
        recipe.title,
        recipe.description,
        recipe.category,
        ...recipe.ingredients.map((ingredient) => ingredient.name),
        ...recipe.methods,
      ]
        .join(' ')
        .toLocaleLowerCase('ru');
      const matchesCategory = category === 'Все' || recipe.category === category;
      const matchesIncluded = includedProducts.every((filterId) => {
        const filter = productFilterMap.get(filterId);
        return filter ? recipeHasProductFilter(recipe, filter) : true;
      });
      const matchesExcluded = excludedProducts.every((filterId) => {
        const filter = productFilterMap.get(filterId);
        return filter ? !recipeHasProductFilter(recipe, filter) : true;
      });
      const matchesMethods = methods.every((method) => recipe.methods.includes(method));

      return (
        matchesCategory &&
        matchesIncluded &&
        matchesExcluded &&
        matchesMethods &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [category, excludedProducts, includedProducts, methods, productFilterMap, query]);

  const activeFilterCount =
    (category === 'Все' ? 0 : 1) + includedProducts.length + excludedProducts.length + methods.length;

  const selectProduct = (filterId: string) => {
    if (productMode === 'include') {
      setIncludedProducts((current) => toggleValue(current, filterId));
      setExcludedProducts((current) => current.filter((item) => item !== filterId));
      return;
    }
    setExcludedProducts((current) => toggleValue(current, filterId));
    setIncludedProducts((current) => current.filter((item) => item !== filterId));
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('Все');
    setIncludedProducts([]);
    setExcludedProducts([]);
    setMethods([]);
    setProductQuery('');
    setOpenPanel(null);
  };

  const renderProductLabel = (filterId: string) => productFilterMap.get(filterId)?.label ?? filterId;

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-12 lg:px-8 lg:pb-14 lg:pt-20">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-[#15803d]">
            <Utensils size={15} />
            Личная семейная кухня
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            Любимые блюда.<br />
            <span className="text-[#16a34a]">Покупки без подсчётов.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Найдите рецепт по продуктам в холодильнике, исключите то, чего нет, и выберите удобный способ приготовления.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <span className="sr-only">Поиск по блюдам и ингредиентам</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например: курица, картофель или Varoma"
              className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-[#22c55e] focus:bg-white focus:ring-4 focus:ring-green-100"
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Категории рецептов">
            <span className="flex shrink-0 items-center px-2 text-gray-400" aria-hidden="true">
              <SlidersHorizontal size={18} />
            </span>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition ${
                  category === item
                    ? 'bg-gray-950 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-950'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setOpenPanel((current) => (current === 'products' ? null : 'products'))}
              className={`flex min-h-12 items-center justify-between rounded-2xl border px-4 text-left text-sm font-semibold transition ${
                openPanel === 'products' || includedProducts.length + excludedProducts.length > 0
                  ? 'border-green-300 bg-green-50 text-[#15803d]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
              aria-expanded={openPanel === 'products'}
            >
              <span className="inline-flex items-center gap-2">
                <PackageSearch size={19} />
                Продукты
                {includedProducts.length + excludedProducts.length > 0 && (
                  <span className="rounded-full bg-[#22c55e] px-2 py-0.5 text-xs text-white">
                    {includedProducts.length + excludedProducts.length}
                  </span>
                )}
              </span>
              <ChevronDown size={18} className={`transition ${openPanel === 'products' ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setOpenPanel((current) => (current === 'methods' ? null : 'methods'))}
              className={`flex min-h-12 items-center justify-between rounded-2xl border px-4 text-left text-sm font-semibold transition ${
                openPanel === 'methods' || methods.length > 0
                  ? 'border-green-300 bg-green-50 text-[#15803d]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
              aria-expanded={openPanel === 'methods'}
            >
              <span className="inline-flex items-center gap-2">
                <CookingPot size={19} />
                Способ приготовления
                {methods.length > 0 && <span className="rounded-full bg-[#22c55e] px-2 py-0.5 text-xs text-white">{methods.length}</span>}
              </span>
              <ChevronDown size={18} className={`transition ${openPanel === 'methods' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {openPanel === 'products' && (
            <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
              <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                <div className="grid grid-cols-2 rounded-xl bg-gray-200/70 p-1">
                  <button
                    type="button"
                    onClick={() => setProductMode('include')}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
                      productMode === 'include' ? 'bg-white text-[#15803d] shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Check size={17} />
                    Есть
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductMode('exclude')}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
                      productMode === 'exclude' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Ban size={17} />
                    Без
                  </button>
                </div>
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <span className="sr-only">Найти продукт для фильтра</span>
                  <input
                    type="search"
                    value={productQuery}
                    onChange={(event) => setProductQuery(event.target.value)}
                    placeholder="Найти продукт"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#22c55e] focus:ring-4 focus:ring-green-100"
                  />
                </label>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                {productMode === 'include'
                  ? 'Покажем блюда, где есть каждый выбранный продукт.'
                  : 'Скроем все блюда, где встречается хотя бы один выбранный продукт.'}
              </p>

              <div className="mt-3 max-h-64 overflow-y-auto pr-1">
                <div className="flex flex-wrap gap-2">
                  {visibleProductFilters.map((filter) => {
                    const included = includedProducts.includes(filter.id);
                    const excluded = excludedProducts.includes(filter.id);
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => selectProduct(filter.id)}
                        className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${
                          included
                            ? 'border-green-300 bg-green-100 text-[#15803d]'
                            : excluded
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-950'
                        }`}
                        aria-pressed={included || excluded}
                      >
                        {included && <Check size={15} />}
                        {excluded && <Ban size={15} />}
                        {filter.label}
                        <span className="text-xs opacity-60">{filter.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {openPanel === 'methods' && (
            <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
              <p className="text-sm font-semibold text-gray-800">Как хочется готовить</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">Если выбрать несколько вариантов, рецепт должен подходить под каждый из них.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {methodOptions.map((method) => {
                  const selected = methods.includes(method);
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setMethods((current) => toggleValue(current, method))}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                        selected
                          ? 'border-green-300 bg-green-100 text-[#15803d]'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-950'
                      }`}
                      aria-pressed={selected}
                    >
                      {selected && <Check size={16} />}
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {(activeFilterCount > 0 || query) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {includedProducts.map((filterId) => (
              <button
                key={`include-${filterId}`}
                type="button"
                onClick={() => setIncludedProducts((current) => current.filter((item) => item !== filterId))}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-green-50 px-3 text-xs font-semibold text-[#15803d] ring-1 ring-inset ring-green-200"
              >
                Есть: {renderProductLabel(filterId)}
                <X size={14} />
              </button>
            ))}
            {excludedProducts.map((filterId) => (
              <button
                key={`exclude-${filterId}`}
                type="button"
                onClick={() => setExcludedProducts((current) => current.filter((item) => item !== filterId))}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-red-50 px-3 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200"
              >
                Без: {renderProductLabel(filterId)}
                <X size={14} />
              </button>
            ))}
            {methods.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setMethods((current) => current.filter((item) => item !== method))}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-gray-100 px-3 text-xs font-semibold text-gray-700"
              >
                {method}
                <X size={14} />
              </button>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-9 rounded-full px-3 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-950"
            >
              Сбросить всё
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803d]">Проверенные рецепты</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              {visibleRecipes.length === recipes.length ? 'Что приготовить' : `Подходит рецептов: ${visibleRecipes.length}`}
            </h2>
          </div>
          <p className="hidden text-sm text-gray-500 sm:block">Фильтров выбрано: {activeFilterCount}</p>
        </div>

        {visibleRecipes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-gray-900">Под такую комбинацию рецептов пока нет</p>
            <p className="mt-2 text-sm text-gray-500">Уберите один из фильтров «без» или способ приготовления.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
