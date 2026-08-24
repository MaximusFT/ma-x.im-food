import type { Metadata } from 'next';
import { CurrentMenuPage } from '@/components/CurrentMenuPage';

export const metadata: Metadata = {
  title: 'Актуальное меню — ma-x.im',
  description: 'Меню Маши на восемь дней, рецепты на одну порцию и единый список покупок.',
};

export default function Page() {
  return <CurrentMenuPage />;
}
