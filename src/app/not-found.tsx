import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803d]">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">Такого рецепта нет</h1>
      <p className="mt-3 text-gray-600">Возможно, ссылка устарела или рецепт пока не добавлен в библиотеку.</p>
      <Link href="/" className="mt-7 inline-flex min-h-12 items-center rounded-2xl bg-[#22c55e] px-6 text-sm font-semibold text-white">
        Вернуться к рецептам
      </Link>
    </div>
  );
}
