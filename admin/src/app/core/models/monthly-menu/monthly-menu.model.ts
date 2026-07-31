export interface MonthlyMenu {
  id: number;
  uuid: string;
  month: number;
  year: number;
  month_name?: string;
  kitchen_id: number;
  kitchen_name?: string;
  title: string;
  description?: string;
  menu_template_id?: number;
  template_name?: string;
  status: 'draft' | 'published' | 'approved' | 'archived';
  status_label?: string;
  published_at?: string;
  published_by?: number;
  published_by_name?: string;
  approved_at?: string;
  approved_by?: number;
  approved_by_name?: string;
  is_published: boolean;
  is_approved: boolean;
  is_editable: boolean;
  days_in_month?: number;
  items_count?: number;
  items?: MonthlyMenuItem[];
  kitchen?: { id: number; uuid: string; name: string; kitchen_code: string };
  menu_template?: { id: number; uuid: string; template_name: string };
  created_by?: number;
  created_by_name?: string;
  updated_by?: number;
  updated_by_name?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface MonthlyMenuItem {
  id: number;
  uuid: string;
  monthly_menu_id: number;
  menu_date: string;
  day_name: string;
  meal_category_id: number;
  meal_category_name?: string;
  meal_id: number;
  meal_name?: string;
  meal_type_id?: number;
  meal_type_name?: string;
  display_order: number;
  meal_limit: number;
  remaining_quantity: number;
  is_default: boolean;
  is_optional: boolean;
  is_special: boolean;
  is_festival: boolean;
  status: string;
  meal_category?: { id: number; uuid: string; name: string };
  meal?: {
    id: number; uuid: string; name: string; meal_code: string;
    price: number; offer_price: number; calories: number;
    protein: number; carbohydrates: number; fat: number; meal_image: string;
  };
  meal_type?: { id: number; uuid: string; name: string };
  created_at: string;
  updated_at: string;
}

export interface MonthlyMenuStats {
  total: number;
  draft: number;
  published: number;
  approved: number;
  archived: number;
}

export interface MonthlyMenuForecast {
  total_meals: number;
  production_capacity: number;
  total_calories: number;
  category_distribution: { [key: string]: number };
  type_distribution: { [key: string]: number };
  meal_popularity: { [key: string]: number };
}

export interface CreateMonthlyMenu {
  month: number;
  year: number;
  title: string;
  description?: string;
  kitchen_id?: number;
  menu_template_id?: number;
  status?: string;
}

export type UpdateMonthlyMenu = Partial<CreateMonthlyMenu>;

export interface CreateMonthlyMenuItem {
  monthly_menu_id: number;
  menu_date: string;
  day_name: string;
  meal_category_id: number;
  meal_id: number;
  meal_type_id?: number;
  display_order?: number;
  meal_limit?: number;
  is_default?: boolean;
  is_optional?: boolean;
  is_special?: boolean;
  is_festival?: boolean;
}

export type UpdateMonthlyMenuItem = Partial<CreateMonthlyMenuItem>;
