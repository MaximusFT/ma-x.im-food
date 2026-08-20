import type { Metadata } from 'next';
import { DaysPage } from '@/components/DaysPage';

export const metadata: Metadata = {
  title: 'Рецепты по дням — ma-x.im',
  description: 'Завтраки, обеды, ужины и десерты, сгруппированные по дням.',
};

export default function Page() {
  return <DaysPage />;
}
