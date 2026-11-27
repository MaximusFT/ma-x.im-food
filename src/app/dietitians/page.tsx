import type { Metadata } from 'next';
import { DietitiansPage } from '@/components/DietitiansPage';

export const metadata: Metadata = {
  title: 'От диетологов — адаптированные рецепты на двоих',
  description: '21 блюдо из присланных меню: адаптация для Thermomix TM6, духовки и сковороды, без помидоров, с учётом порций Low FODMAP.',
};
export default function Page() { return <DietitiansPage />; }
