import type { Metadata } from 'next';
import { FoodTablePage } from '@/components/FoodTablePage';

export const metadata: Metadata = {
  title: 'Таблица продуктов Low FODMAP — ma-x.im',
  description: 'Полная таблица продуктов из PDF: группы, дозы и поиск по части слова.',
};

export default function Page() {
  return <FoodTablePage />;
}
