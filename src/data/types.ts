export type RecipeCategory = 'Завтраки' | 'Обеды' | 'Ужины' | 'Десерты' | 'Перекусы' | 'Соусы' | 'Хлеб' | 'Закуски' | 'Напитки';
export type CookingMethod =
  | 'Thermomix'
  | 'Varoma'
  | 'Духовка'
  | 'Сковорода'
  | 'Плита'
  | 'Без нагрева'
  | 'Только Thermomix'
  | 'Только чаша'
  | 'До 30 минут';

export type Ingredient = {
  productId: string;
  name: string;
  group: string;
  includeInShopping: boolean;
  amount: number | null;
  minAmount: number | null;
  unit: string | null;
  quantity: string;
};

export type NutritionValues = { kcal: number; protein: number; fat: number; carbs: number };

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: RecipeCategory;
  day: number;
  servings: number;
  portions: string;
  activeMinutes: number | null;
  totalMinutes: number | null;
  equipment: string[];
  methods: CookingMethod[];
  ingredients: Ingredient[];
  steps: string[];
  storage: string;
  substitutions: string;
  tolerance: string;
  nutritionNote?: string;
  status: 'approved' | 'testing';
  source: string;
  collection?: 'fodmap' | 'home' | 'dietitians';
  menu?: 'document' | 'variety' | 'extras';
  meal?: string;
  // Reference serving values retained only for planned daily totals.
  nutrition?: NutritionValues;
  nutritionTotal?: NutritionValues;
  estimatedYieldGrams?: number;
  nutritionVariations?: Array<{ title: string; additions: Ingredient[]; nutritionTotal: NutritionValues; estimatedYieldGrams: number }>;
  portionWeight?: string;
  batchNote?: string;
};
