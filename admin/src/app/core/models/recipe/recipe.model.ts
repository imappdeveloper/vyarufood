export interface Recipe {
  id: number;
  uuid: string;
  recipe_code: string;
  meal_id: number;
  meal_name?: string;
  recipe_name: string;
  version: number;
  yield_quantity: number;
  yield_unit: string;
  preparation_time: number | null;
  cooking_time: number | null;
  serving_size: number;
  recipe_cost: number;
  food_cost_percentage: number;
  status: string;
  remarks: string | null;
  items?: RecipeItem[];
  items_count?: number;
  created_by_name?: string;
  updated_by_name?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RecipeItem {
  id: number;
  uuid: string;
  recipe_id: number;
  inventory_item_id: number;
  inventory_item_name?: string;
  unit_id: number;
  unit_name?: string;
  required_quantity: number;
  wastage_percentage: number;
  actual_quantity: number | null;
  cost: number;
  display_order: number;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecipeVersion {
  id: number;
  uuid: string;
  recipe_id: number;
  version: number;
  approved_by: number | null;
  approved_by_name?: string;
  approved_at: string | null;
  change_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryConsumptionLog {
  id: number;
  uuid: string;
  production_batch_id: number;
  recipe_id: number | null;
  recipe_name?: string;
  meal_id: number | null;
  meal_name?: string;
  inventory_item_id: number;
  inventory_item_name?: string;
  consumed_quantity: number;
  unit_cost: number;
  total_cost: number;
  consumption_date: string;
  created_at: string;
}

export interface Unit {
  id: number;
  uuid: string;
  name: string;
  symbol: string;
  type: string;
  base_unit_id: number | null;
  conversion_factor: number;
  sort_order: number;
  status: string;
}

export interface InventoryItem {
  id: number;
  uuid: string;
  item_code: string;
  name: string;
  description: string | null;
  category: string | null;
  unit_id: number;
  unit_name?: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  cost_price: number;
  status: string;
}

export type RecipeStatus = 'draft' | 'active' | 'inactive' | 'archived';

export const RECIPE_STATUSES: { value: RecipeStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

export const YIELD_UNITS: { value: string; label: string }[] = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'g', label: 'Gram' },
  { value: 'L', label: 'Liter' },
  { value: 'ml', label: 'Milliliter' },
  { value: 'pcs', label: 'Piece' },
  { value: 'packet', label: 'Packet' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'box', label: 'Box' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'custom', label: 'Custom' },
];
