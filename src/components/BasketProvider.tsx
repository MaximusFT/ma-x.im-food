'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { BasketItem } from '@/lib/shopping';

type StoredState = {
  version: 1;
  basket: BasketItem[];
  checkedShoppingItems: string[];
};

type BasketContextValue = {
  basket: BasketItem[];
  checkedShoppingItems: string[];
  hydrated: boolean;
  addRecipe: (recipeId: string, servings: number) => void;
  removeRecipe: (recipeId: string) => void;
  setRecipeServings: (recipeId: string, servings: number) => void;
  clearBasket: () => void;
  toggleShoppingItem: (key: string) => void;
  clearShoppingChecks: () => void;
};

const storageKey = 'ma-x-im-recipes:v1';
const initialState: StoredState = { version: 1, basket: [], checkedShoppingItems: [] };
const BasketContext = createContext<BasketContextValue | null>(null);

function readStoredState(): StoredState {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (parsed.version !== 1 || !Array.isArray(parsed.basket)) return initialState;
    return {
      version: 1,
      basket: parsed.basket.filter(
        (item): item is BasketItem =>
          typeof item === 'object' && item !== null && typeof item.recipeId === 'string' && Number.isFinite(item.servings) && item.servings > 0,
      ),
      checkedShoppingItems: Array.isArray(parsed.checkedShoppingItems)
        ? parsed.checkedShoppingItems.filter((item): item is string => typeof item === 'string')
        : [],
    };
  } catch {
    return initialState;
  }
}

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setState(readStoredState());
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydrated, state]);

  const value = useMemo<BasketContextValue>(
    () => ({
      basket: state.basket,
      checkedShoppingItems: state.checkedShoppingItems,
      hydrated,
      addRecipe: (recipeId, servings) =>
        setState((current) => {
          const existing = current.basket.find((item) => item.recipeId === recipeId);
          return {
            ...current,
            basket: existing
              ? current.basket.map((item) => (item.recipeId === recipeId ? { ...item, servings } : item))
              : [...current.basket, { recipeId, servings }],
          };
        }),
      removeRecipe: (recipeId) =>
        setState((current) => ({
          ...current,
          basket: current.basket.filter((item) => item.recipeId !== recipeId),
        })),
      setRecipeServings: (recipeId, servings) =>
        setState((current) => ({
          ...current,
          basket: current.basket.map((item) => (item.recipeId === recipeId ? { ...item, servings } : item)),
        })),
      clearBasket: () => setState((current) => ({ ...current, basket: [], checkedShoppingItems: [] })),
      toggleShoppingItem: (key) =>
        setState((current) => ({
          ...current,
          checkedShoppingItems: current.checkedShoppingItems.includes(key)
            ? current.checkedShoppingItems.filter((item) => item !== key)
            : [...current.checkedShoppingItems, key],
        })),
      clearShoppingChecks: () => setState((current) => ({ ...current, checkedShoppingItems: [] })),
    }),
    [hydrated, state],
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) throw new Error('useBasket must be used inside BasketProvider');
  return context;
}
