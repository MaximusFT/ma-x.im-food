import generatedRecipes from '@/generated/recipes.json';
import { currentMenuRecipes } from './current-menu';
import type { Recipe } from './types';

export const approvedRecipes = generatedRecipes as Recipe[];
export const recipes = [...currentMenuRecipes, ...approvedRecipes];

export function getRecipeBySlug(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug);
}
