export interface Meal {
  id: number;
  uuid: string;
  meal_code: string;
  category_id: number;
  meal_type_id: number;
  kitchen_id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  ingredients: string[] | null;
  allergens: string[] | null;
  spice_level: number;
  serving_size: string | null;
  unit: string | null;
  meal_image: string | null;
  thumbnail: string | null;
  gallery: string[] | null;
  barcode: string | null;
  sku: string | null;
  hsn_code: string | null;
  preparation_time: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  price: number;
  offer_price: number | null;
  cost_price: number | null;
  tax_percentage: number;
  display_order: number;
  availability_type: string;
  availability_slots: string[] | null;
  is_featured: boolean;
  is_recommended: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_customizable: boolean;
  requires_preparation: boolean;
  average_rating: number;
  reviews_count: number;
  status: 'active' | 'inactive';
  status_label: string;
  remarks: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_by_name: string | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category: any;
  meal_type: any;
  kitchen: any;
  effective_price: number;
  spice_level_label: string;
  availability_type_label: string;
  discount_percentage: number;
  has_discount: boolean;
  dietary_type?: string;
}

export interface CreateMeal {
  meal_code: string;
  name: string;
  slug?: string;
  category_id: number;
  meal_type_id: number;
  kitchen_id: number;
  short_description?: string;
  description?: string;
  ingredients?: string[];
  allergens?: string[];
  spice_level?: number;
  serving_size?: string;
  unit?: string;
  meal_image?: string;
  thumbnail?: string;
  gallery?: string[];
  barcode?: string;
  sku?: string;
  hsn_code?: string;
  preparation_time?: number;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  price: number;
  offer_price?: number;
  cost_price?: number;
  tax_percentage?: number;
  display_order?: number;
  availability_type?: string;
  availability_slots?: string[];
  is_featured?: boolean;
  is_recommended?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  is_customizable?: boolean;
  requires_preparation?: boolean;
  status?: string;
  remarks?: string;
}

export type UpdateMeal = Partial<CreateMeal>;

export interface MealStats {
  total: Record<string, number>;
  default_count: number;
}

export interface MealImportResult {
  successes: number;
  failures: { row: number; error: string; data: any }[];
  total: number;
}
