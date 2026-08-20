<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ma-x.im recipes

- Next.js App Router, TypeScript, Tailwind CSS 4.
- Полный статический экспорт в `out/`; не добавлять серверные маршруты, cookies или базу данных без отдельного решения пользователя.
- Деплой планируется на Railway Static Hosting.
- Сохранять визуальный стиль ma-x.im: белый фон, графитовый текст, зелёный акцент `#22c55e`, мягкие границы и скругления.
- Проектировать mobile-first; главный сценарий — список покупок на телефоне в магазине.
- Рецепты лежат в `content/approved/*.md`; `scripts/generate-recipes.mjs` создаёт `src/generated/recipes.json`.
- Не редактировать сгенерированный JSON вручную.
- Корзина и покупки остаются локальными и хранятся через `BasketProvider` в `localStorage`.
- После изменений запускать `npm run build`; prebuild сам обновит и проверит данные рецептов.
- Для web manifest использовать статический `public/manifest.webmanifest`: генерируемый `app/manifest.ts` в Next.js 16 требует дополнительной static route-конфигурации при `output: 'export'`.
- ESLint использует flat config Next.js 16 и явно игнорирует `.next/`, `out/` и `src/generated/`; без этих исключений `eslint .` сканирует результаты сборки и работает неоправданно долго.
- Версии `next` и `eslint-config-next` держать одинаковыми; смешивание 15.x и 16.x ломает импорт flat config.
