export interface ProductionBatch {
  id: number;
  uuid: string;
  batch_number: string;
  production_date: string;
  kitchen_id: number;
  kitchen_name?: string;
  batch_name: string;
  batch_type: string;
  total_orders: number;
  total_meals: number;
  planned_start_time: string | null;
  planned_end_time: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  production_status: string;
  production_status_label: string;
  prepared_by: number | null;
  prepared_by_name?: string;
  approved_by: number | null;
  approved_by_name?: string;
  remarks: string | null;
  is_draft: boolean;
  is_completed: boolean;
  is_locked: boolean;
  created_by: number | null;
  created_by_name?: string;
  updated_by: number | null;
  updated_by_name?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items?: ProductionBatchItem[];
  packing_lists?: MealPackingListItem[];
  status_history?: ProductionStatusHistoryEntry[];
}

export interface ProductionBatchItem {
  id: number;
  uuid: string;
  production_batch_id: number;
  meal_id: number;
  meal_name?: string;
  meal_category_id: number | null;
  meal_category_name?: string;
  meal_type_id: number | null;
  meal_type_name?: string;
  planned_quantity: number;
  prepared_quantity: number;
  packed_quantity: number;
  wastage_quantity: number;
  remaining_quantity: number;
  status: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface MealPackingListItem {
  id: number;
  uuid: string;
  production_batch_id: number;
  order_id: number;
  order_number?: string;
  customer_id: number;
  customer_name?: string;
  meal_id: number;
  meal_name?: string;
  quantity: number;
  packing_status: string;
  packed_at: string | null;
  packed_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductionStatusHistoryEntry {
  id: number;
  uuid: string;
  production_batch_id: number;
  from_status: string | null;
  to_status: string;
  reason: string | null;
  changed_by: number | null;
  changed_by_name?: string;
  metadata: any;
  created_at: string;
}

export type ProductionStatus = 'draft' | 'planned' | 'cooking' | 'prepared' | 'packing' | 'packed' | 'completed' | 'cancelled';

export const PRODUCTION_STATUSES: { value: ProductionStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'planned', label: 'Planned' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'prepared', label: 'Prepared' },
  { value: 'packing', label: 'Packing' },
  { value: 'packed', label: 'Packed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const BATCH_TYPES: { value: string; label: string }[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'special', label: 'Special' },
  { value: 'bulk', label: 'Bulk' },
  { value: 'emergency', label: 'Emergency' },
];
