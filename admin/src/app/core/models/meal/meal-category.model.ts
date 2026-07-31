export interface MealCategory {
  id: number;
  uuid: string;
  category_code: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  icon: string | null;
  image: string | null;
  color_code: string | null;
  status: 'active' | 'inactive';
  status_label: string;
  is_default: boolean;
  remarks: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_by_name: string | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateMealCategory {
  category_code: string;
  name: string;
  slug?: string;
  description?: string;
  display_order?: number;
  icon?: string;
  image?: string;
  color_code?: string;
  status?: string;
  is_default?: boolean;
  remarks?: string;
}

export type UpdateMealCategory = Partial<CreateMealCategory>;

export interface MealCategoryStats {
  total: Record<string, number>;
  default_count: number;
}

export interface MealCategoryImportResult {
  successes: number;
  failures: { row: number; error: string; data: any }[];
  total: number;
}
