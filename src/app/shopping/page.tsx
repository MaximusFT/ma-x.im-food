import type { Metadata } from 'next';
import { ShoppingPage } from '@/components/ShoppingPage';

export const metadata: Metadata = {
  title: 'Покупки — рецепты ma-x.im',
  description: 'Объединённый список продуктов для выбранных блюд.',
};

export default function Page() {
  return <ShoppingPage />;
}
