export interface MealType {
  id: number;
  uuid: string;
  type_code: string;
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
  deleted_by: number | null;
  created_by_name?: string;
  updated_by_name?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateMealType {
  type_code: string;
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

export type UpdateMealType = Partial<CreateMealType>;

export interface MealTypeStats {
  total: Record<string, number>;
  default_count: number;
}

export interface MealTypeImportResult {
  successes: number;
  failures: { row: number; error: string; data: any }[];
  total: number;
}

export interface MealQueryParams {
  search?: string;
  category_id?: number;
  meal_type_id?: number;
  featured?: boolean | number;
  recommended?: boolean | number;
  bestseller?: boolean | number;
  new?: boolean | number;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}
