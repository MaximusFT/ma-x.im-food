import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fodmapRecipes } from '../content/fodmap/catalog.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDirectory = path.join(projectRoot, 'content', 'approved');
const outputDirectory = path.join(projectRoot, 'src', 'generated');
const outputFile = path.join(outputDirectory, 'recipes.json');

const descriptions = {
  'Паровой омлет с укропом и безлактозным йогуртом':
    'Нежный завтрак в порционных формах, приготовленный на пару в Varoma.',
  'Куриные бёдра с картофелем, кабачком и морковью':
    'Курица, картофель и мягкие овощи готовятся одновременно в Thermomix и Varoma.',
  'Шоколадно-голубичный творожный крем':
    'Быстрый мягкий десерт с голубикой, какао и безлактозным творожным продуктом.',
  'Гречка с индейкой и стручковой фасолью':
    'Простое основное блюдо, которое собирается за один цикл приготовления на пару.',
  'Гречневые оладьи с голубичным творожным кремом':
    'Мягкие небольшие оладьи и свежий творожный крем с цельными ягодами.',
  'Говяжьи тефтели с картофельным пюре и овощным соусом':
    'Паровые тефтели, мягкое пюре и тёплый овощной соус без сильной обжарки.',
  'Дорада с рисом, брокколи и укропным соусом':
    'Запечённая рыба с рисом, овощами на пару и тёплым укропным соусом.',
  'Ванильный рисовый пудинг с голубикой':
    'Тёплый сливочный пудинг с мягким рисом, ванилью и свежей голубикой.',
  'Яичная запеканка с брокколи и творожным сыром':
    'Мягкая запеканка с овощами на пару и свежим безлактозным сыром.',
  'Рулетики из индейки с рисом и морковно-кабачковым соусом':
    'Нежные паровые рулетики с рисом и гладким овощным соусом.',
  'Кнели из трески с картофельным кремом и зелёной фасолью':
    'Воздушные рыбные кнели, мягкий картофельный крем и фасоль на пару.',
  'Тёплый персик с ванильным творожным кремом':
    'Небольшой тёплый десерт из запечённого персика и ванильного крема.',
};

const breakfasts = new Set([
  'Паровой омлет с укропом и безлактозным йогуртом',
  'Гречневые оладьи с голубичным творожным кремом',
  'Яичная запеканка с брокколи и творожным сыром',
]);

const lunches = new Set([
  'Куриные бёдра с картофелем, кабачком и морковью',
  'Говяжьи тефтели с картофельным пюре и овощным соусом',
  'Рулетики из индейки с рисом и морковно-кабачковым соусом',
]);

const desserts = new Set([
  'Шоколадно-голубичный творожный крем',
  'Ванильный рисовый пудинг с голубикой',
  'Тёплый персик с ванильным творожным кремом',
]);

const products = [
  ['eggs', 'Яйца', 'Яйца', ['яйца', 'яйцо']],
  ['lactose-free-milk', 'Безлактозное молоко', 'Молочные и безлактозные продукты', ['безлактозное молоко']],
  ['dill', 'Укроп', 'Овощи и зелень', ['укроп']],
  ['olive-oil', 'Оливковое масло', 'Масла и приправы', ['оливковое масло']],
  ['salt', 'Соль', 'Масла и приправы', ['соль', 'щепотка соли']],
  ['greek-yogurt', 'Безлактозный греческий йогурт', 'Молочные и безлактозные продукты', ['безлактозный греческий йогурт']],
  ['water', 'Вода', 'Не учитывать', ['вода']],
  ['chicken-thigh', 'Филе куриного бедра', 'Мясо и птица', ['филе куриного бедра без кожи']],
  ['potato', 'Картофель', 'Овощи и зелень', ['картофель']],
  ['zucchini', 'Кабачок', 'Овощи и зелень', ['кабачок']],
  ['carrot', 'Морковь', 'Овощи и зелень', ['морковь']],
  ['curd-product', 'Безлактозный творожный продукт', 'Молочные и безлактозные продукты', ['безлактозный творожный продукт']],
  ['lactose-free-curd', 'Безлактозный творог', 'Молочные и безлактозные продукты', ['безлактозный творог']],
  ['fresh-curd-cheese', 'Безлактозный свежий творожный сыр', 'Молочные и безлактозные продукты', ['безлактозный свежий творожный сыр']],
  ['blueberry', 'Голубика', 'Фрукты и ягоды', ['голубика']],
  ['cocoa', 'Какао', 'Крупы и сухие продукты', ['какао']],
  ['sugar', 'Сахар', 'Крупы и сухие продукты', ['сахар']],
  ['vanilla', 'Ваниль', 'Масла и приправы', ['ваниль']],
  ['turkey-fillet', 'Филе индейки', 'Мясо и птица', ['филе индейки', 'тонкие ломтики филе индейки']],
  ['buckwheat', 'Гречка', 'Крупы и сухие продукты', ['гречка']],
  ['green-beans', 'Стручковая фасоль', 'Овощи и зелень', ['стручковая фасоль']],
  ['buckwheat-flour', 'Гречневая мука', 'Крупы и сухие продукты', ['гречневая мука']],
  ['beef-mince', 'Постный говяжий фарш', 'Мясо и птица', ['постный говяжий фарш']],
  ['rice-flour', 'Рисовая мука', 'Крупы и сухие продукты', ['рисовая мука']],
  ['broccoli', 'Брокколи', 'Овощи и зелень', ['брокколи']],
  ['gilthead', 'Дорада', 'Рыба', ['две небольшие очищенные дорады']],
  ['rice', 'Рис', 'Крупы и сухие продукты', ['рис', 'круглозёрный рис']],
  ['cod-fillet', 'Филе трески', 'Рыба', ['филе трески без кожи и костей']],
  ['peach', 'Персик', 'Фрукты и ягоды', ['крупный спелый персик']],
];

const productLookup = new Map();
for (const [id, name, group, aliases] of products) {
  for (const alias of aliases) productLookup.set(alias, { id, name, group });
}

const transliteration = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

function slugify(value) {
  return value
    .toLocaleLowerCase('ru')
    .split('')
    .map((character) => transliteration[character] ?? character)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function cleanMarkdown(value) {
  return value.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim().replace(/;$/, '');
}

function extractField(block, label) {
  const line = block.split('\n').find((candidate) => candidate.startsWith(`**${label}:**`));
  return line ? cleanMarkdown(line.replace(`**${label}:**`, '')) : '';
}

function extractSection(block, startHeading, endHeadings) {
  const startIndex = block.indexOf(startHeading);
  if (startIndex < 0) return '';
  const contentStart = startIndex + startHeading.length;
  const endIndexes = endHeadings
    .map((heading) => block.indexOf(heading, contentStart))
    .filter((index) => index >= 0);
  const contentEnd = endIndexes.length > 0 ? Math.min(...endIndexes) : block.length;
  return block.slice(contentStart, contentEnd).trim();
}

function parseQuantity(value) {
  const normalized = value.replace(',', '.');
  const match = normalized.match(/(?:всего\s*)?(\d+(?:\.\d+)?)\s*(?:[–-]\s*(\d+(?:\.\d+)?))?\s*(г|мл|шт\.)/i);
  if (!match) {
    return { amount: null, minAmount: null, unit: null, quantity: cleanMarkdown(value) || 'по вкусу' };
  }

  const first = Number(match[1]);
  const second = match[2] ? Number(match[2]) : null;
  return {
    amount: second ?? first,
    minAmount: second ? first : null,
    unit: match[3].toLocaleLowerCase('ru'),
    quantity: cleanMarkdown(value),
  };
}

function parseIngredient(line) {
  const raw = cleanMarkdown(line.replace(/^-\s*/, '')).replace(/\.$/, '');
  const separator = raw.indexOf(' — ');
  const rawName = separator >= 0 ? raw.slice(0, separator).trim() : raw;
  const rawQuantity = separator >= 0 ? raw.slice(separator + 3).trim() : 'по вкусу';
  if (rawName.toLocaleLowerCase('ru') === 'ваниль и щепотка соли') {
    return [
      { productId: 'vanilla', name: 'Ваниль', group: 'Масла и приправы', includeInShopping: true, amount: null, minAmount: null, unit: null, quantity: 'по вкусу' },
      { productId: 'salt', name: 'Соль', group: 'Масла и приправы', includeInShopping: true, amount: null, minAmount: null, unit: null, quantity: 'щепотка' },
    ];
  }
  const product = productLookup.get(rawName.toLocaleLowerCase('ru')) ?? {
    id: slugify(rawName),
    name: rawName.charAt(0).toLocaleUpperCase('ru') + rawName.slice(1),
    group: 'Дополнительные товары',
  };
  const quantity = parseQuantity(rawQuantity);

  return [{
    productId: product.id,
    name: product.name,
    group: product.group,
    includeInShopping: product.id !== 'water',
    ...quantity,
  }];
}

function parseRecipe(title, block, source) {
  const portions = extractField(block, 'Порции');
  const time = extractField(block, 'Время');
  const equipmentText = extractField(block, 'Оборудование');
  const ingredientsText = extractSection(block, '### Ингредиенты', ['### Приготовление']);
  const preparationText = extractSection(block, '### Приготовление', ['**Хранение:**']);
  const ingredients = ingredientsText
    .split('\n')
    .filter((line) => line.trim().startsWith('-'))
    .flatMap(parseIngredient);
  const steps = preparationText
    .split('\n')
    .filter((line) => /^\d+\.\s/.test(line.trim()))
    .map((line) => cleanMarkdown(line.replace(/^\d+\.\s*/, '')));
  const servingsMatch = portions.match(/(\d+)/);
  const activeMatch = time.match(/(\d+)\s+минут[^,]*актив/i) ?? time.match(/активно\s+(\d+)/i);
  const totalMatch = time.match(/(\d+)\s+минут(?:а|ы)?\s+всего/i) ?? time.match(/всего\s+(\d+)/i);
  const timeNumbers = [...time.matchAll(/\d+/g)].map((match) => Number(match[0]));
  const totalMinutes = totalMatch ? Number(totalMatch[1]) : timeNumbers.length === 1 ? timeNumbers[0] : null;
  const cookingText = `${equipmentText} ${preparationText}`.toLocaleLowerCase('ru');
  const methods = [];
  if (cookingText.includes('чаш')) methods.push('Thermomix');
  if (cookingText.includes('varoma')) methods.push('Varoma');
  if (cookingText.includes('духовк') || cookingText.includes('запекать')) methods.push('Духовка');
  if (cookingText.includes('сковород')) methods.push('Сковорода');
  if (cookingText.includes('чаш') && !cookingText.includes('духовк') && !cookingText.includes('сковород')) {
    methods.push('Только Thermomix');
  }
  if (cookingText.includes('чаш') && !cookingText.includes('varoma') && !cookingText.includes('духовк') && !cookingText.includes('сковород')) {
    methods.push('Только чаша');
  }
  if (totalMinutes !== null && totalMinutes <= 30) methods.push('До 30 минут');
  const dayMatch = source.match(/day-(\d+)/);

  return {
    id: slugify(title),
    slug: slugify(title),
    title,
    description: descriptions[title] ?? 'Домашний рецепт, адаптированный для спокойного приготовления.',
    category: breakfasts.has(title) ? 'Завтраки' : lunches.has(title) ? 'Обеды' : desserts.has(title) ? 'Десерты' : 'Ужины',
    day: dayMatch ? Number(dayMatch[1]) : 0,
    servings: servingsMatch ? Number(servingsMatch[1]) : 2,
    portions,
    activeMinutes: activeMatch ? Number(activeMatch[1]) : null,
    totalMinutes,
    equipment: equipmentText.split(',').map((item) => item.trim()).filter(Boolean),
    methods,
    ingredients,
    steps,
    storage: extractField(block, 'Хранение'),
    substitutions: extractField(block, 'Замены'),
    tolerance: extractField(block, 'Наблюдение'),
    status: 'approved',
    source,
  };
}

async function generateRecipes() {
  const files = (await readdir(contentDirectory)).filter((file) => file.endsWith('.md')).sort();
  const recipes = [];

  for (const file of files) {
    const markdown = await readFile(path.join(contentDirectory, file), 'utf8');
    const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)];
    for (let index = 0; index < matches.length; index += 1) {
      const title = matches[index][1].trim();
      const start = matches[index].index + matches[index][0].length;
      const end = matches[index + 1]?.index ?? markdown.length;
      recipes.push(parseRecipe(title, markdown.slice(start, end), file));
    }
  }

  recipes.push(...fodmapRecipes);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(recipes, null, 2)}\n`, 'utf8');
  console.log(`Generated ${recipes.length} recipes → ${path.relative(projectRoot, outputFile)}`);
}

await generateRecipes();
