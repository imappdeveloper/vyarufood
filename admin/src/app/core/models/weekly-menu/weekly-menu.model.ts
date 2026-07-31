export interface WeeklyMenu {
  id: number;
  uuid: string;
  kitchen_id: number;
  kitchen_name?: string;
  title: string;
  description?: string;
  week_start_date: string;
  week_end_date: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  cut_off_hours: number;
  is_published: boolean;
  is_editable: boolean;
  duration_days: number;
  items?: WeeklyMenuItem[];
  created_at: string;
  updated_at: string;
}

export interface WeeklyMenuItem {
  id: number;
  uuid: string;
  weekly_menu_id: number;
  menu_date: string;
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
  is_recommended: boolean;
  is_active: boolean;
  status: 'active' | 'inactive';
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  meal?: {
    id: number;
    uuid: string;
    slug?: string;
    name: string;
    meal_code: string;
    price: string;
    offer_price: string;
    calories?: number;
    meal_image: string | null;
  };
  meal_category?: { id: number; uuid: string; name: string };
}

export interface CustomerMealSelection {
  id: number;
  uuid: string;
  customer_id: number;
  customer_name?: string;
  customer_email?: string;
  subscription_id?: number;
  weekly_menu_item_id: number;
  weekly_menu_id: number;
  menu_date: string;
  meal_id: number;
  meal_name?: string;
  meal_category_id: number;
  meal_category_name?: string;
  selection_status: 'selected' | 'default' | 'skipped';
  selected_at?: string;
  remarks?: string;
  created_at: string;
}

export interface WeeklyMenuStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  upcoming: number;
}

export interface SelectionSummary {
  menu_id: number;
  total_selections: number;
  selected_count: number;
  default_count: number;
  skipped_count: number;
  by_date: { [date: string]: { total: number; selected: number; default: number; skipped: number } };
  by_category: { [category: string]: { total: number; selected: number; default: number; skipped: number } };
}

export interface CreateWeeklyMenu {
  title: string;
  description?: string;
  week_start_date: string;
  week_end_date: string;
  kitchen_id?: number;
  cut_off_hours?: number;
  status?: string;
}

export type UpdateWeeklyMenu = Partial<CreateWeeklyMenu>;

export interface CreateWeeklyMenuItem {
  weekly_menu_id: number;
  menu_date: string;
  meal_category_id: number;
  meal_id: number;
  meal_type_id?: number;
  display_order?: number;
  meal_limit?: number;
  is_default?: boolean;
  is_optional?: boolean;
  is_recommended?: boolean;
}

export type UpdateWeeklyMenuItem = Partial<CreateWeeklyMenuItem>;

export interface CreateCustomerMealSelection {
  customer_id: number;
  weekly_menu_item_id: number;
  subscription_id?: number;
  meal_id: number;
  meal_category_id: number;
  selection_status?: string;
  remarks?: string;
}
