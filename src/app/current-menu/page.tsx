import type { Metadata } from 'next';
import { CurrentMenuPage } from '@/components/CurrentMenuPage';

export const metadata: Metadata = {
  title: 'Меню — ma-x.im',
  description: 'Меню Маши на четыре уникальных дня, дополнительные блюда и единый список покупок.',
};

export default function Page() {
  return <CurrentMenuPage />;
}
