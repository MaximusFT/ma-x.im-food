import type { Metadata } from 'next';
import { BasketPage } from '@/components/BasketPage';

export const metadata: Metadata = {
  title: 'Корзина блюд — рецепты ma-x.im',
  description: 'Выбранные блюда и количество порций.',
};

export default function Page() {
  return <BasketPage />;
}
