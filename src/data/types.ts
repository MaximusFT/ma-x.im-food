export type RecipeCategory = 'Завтраки' | 'Обеды' | 'Ужины' | 'Десерты';
export type CookingMethod =
  | 'Thermomix'
  | 'Varoma'
  | 'Духовка'
  | 'Сковорода'
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
};
