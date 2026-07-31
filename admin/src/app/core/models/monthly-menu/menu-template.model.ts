export interface MenuTemplate {
  id: number;
  uuid: string;
  template_name: string;
  description?: string;
  kitchen_id: number;
  kitchen_name?: string;
  is_default: boolean;
  status: 'active' | 'inactive';
  status_label?: string;
  items_count?: number;
  items?: MenuTemplateItem[];
  kitchen?: { id: number; uuid: string; name: string; kitchen_code: string };
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface MenuTemplateItem {
  id: number;
  uuid: string;
  menu_template_id: number;
  day_name: string;
  meal_category_id: number;
  meal_category_name?: string;
  meal_id: number;
  meal_name?: string;
  meal_type_id?: number;
  meal_type_name?: string;
  display_order: number;
  meal_category?: { id: number; uuid: string; name: string };
  meal?: { id: number; uuid: string; name: string; meal_code: string; price: number; offer_price: number; meal_image: string };
  meal_type?: { id: number; uuid: string; name: string };
  created_at: string;
  updated_at: string;
}

export interface CreateMenuTemplate {
  template_name: string;
  description?: string;
  kitchen_id?: number;
  is_default?: boolean;
  status?: string;
}

export type UpdateMenuTemplate = Partial<CreateMenuTemplate>;

export interface CreateMenuTemplateItem {
  menu_template_id: number;
  day_name: string;
  meal_category_id: number;
  meal_id: number;
  meal_type_id?: number;
  display_order?: number;
}

export type UpdateMenuTemplateItem = Partial<CreateMenuTemplateItem>;
