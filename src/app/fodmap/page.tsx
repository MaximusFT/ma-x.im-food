import type { Metadata } from 'next';
import { FodmapPage } from '@/components/FodmapPage';

export const metadata: Metadata = {
  title: 'FODMAP — меню на двоих и дополнительные блюда',
  description: 'Два варианта меню по дням, рецепты для Thermomix TM6 и духовки, приблизительные КБЖУ и покупки на двоих.',
};

export default function Page() {
  return <FodmapPage />;
}
