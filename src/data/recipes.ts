import generatedRecipes from '@/generated/recipes.json';
import type { Recipe } from './types';

export const recipes = generatedRecipes as Recipe[];

export function getRecipeBySlug(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug);
}
