import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecipeDetails } from '@/components/RecipeDetails';
import { getRecipeBySlug, recipes } from '@/data/recipes';

export const dynamicParams = false;

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return {};

  return {
    title: `${recipe.title} — рецепты ma-x.im`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: 'article',
      images: [],
    },
    twitter: {
      card: 'summary',
      title: recipe.title,
      description: recipe.description,
      images: [],
    },
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();
  return <RecipeDetails recipe={recipe} />;
}
