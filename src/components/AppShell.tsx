'use client';

import Link from 'next/link';
import { BookOpen, CalendarDays, CheckSquare2, ClipboardList, ShoppingBasket, Leaf, TableProperties } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { BasketProvider, useBasket } from './BasketProvider';

const navigation = [
  { href: '/', label: 'Рецепты', icon: BookOpen },
  { href: '/current-menu', label: 'Меню', icon: ClipboardList },
  { href: '/days', label: 'Дни', icon: CalendarDays },
  { href: '/fodmap', label: 'FODMAP', icon: Leaf },
  { href: '/food-table', label: 'Таблица', icon: TableProperties },
  { href: '/basket', label: 'Корзина', icon: ShoppingBasket },
  { href: '/shopping', label: 'Покупки', icon: CheckSquare2 },
];
const mobileNavigation = navigation.filter((item) => item.href !== '/food-table');

function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { basket } = useBasket();

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="На главную страницу рецептов">
            <span className="text-lg font-bold tracking-tight">ma-x.im</span>
            <span className="h-5 w-px bg-gray-300" aria-hidden="true" />
            <span className="text-sm font-semibold text-[#15803d]">рецепты</span>
          </Link>
          <Link href="/food-table" className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold lg:hidden ${pathname === '/food-table' ? 'bg-gray-950 text-white' : 'bg-green-50 text-[#15803d]'}`}><TableProperties size={18} />Таблица</Link>
          <nav className="hidden items-center gap-2 lg:flex" aria-label="Основная навигация">
            {navigation.map((item) => {
              const active = item.href === '/' ? pathname === '/' || pathname.startsWith('/recipes/') : pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${
                    active ? 'bg-gray-950 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                  {item.href === '/basket' && basket.length > 0 && (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#22c55e] px-1.5 py-0.5 text-xs text-white">
                      {basket.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"
        aria-label="Мобильная навигация"
      >
        <div className="mx-auto grid max-w-lg grid-cols-6">
          {mobileNavigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' || pathname.startsWith('/recipes/') : pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition ${
                  active ? 'text-[#15803d]' : 'text-gray-500'
                }`}
              >
                <span className={`relative rounded-xl px-2 py-1 ${active ? 'bg-green-50' : ''}`}>
                  <Icon size={21} />
                  {item.href === '/basket' && basket.length > 0 && (
                    <span className="absolute -right-0.5 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-[#22c55e] px-1 text-[10px] leading-4 text-white">
                      {basket.length}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <BasketProvider>
      <NavigationShell>{children}</NavigationShell>
    </BasketProvider>
  );
}
