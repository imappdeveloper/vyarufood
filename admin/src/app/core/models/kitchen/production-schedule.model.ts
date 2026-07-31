export interface ProductionSchedule {
  id: number;
  uuid: string;
  kitchen_id: number;
  production_date: string;
  meal_type: string;
  meal_type_label: string;
  planned_quantity: number;
  produced_quantity: number;
  remaining_quantity: number;
  completion_percentage: number;
  production_start: string | null;
  production_end: string | null;
  status: string;
  status_label: string;
  is_overdue: boolean;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  kitchen?: any;
}

export interface CreateProductionSchedule {
  kitchen_id: number;
  production_date: string;
  meal_type: string;
  planned_quantity?: number;
  produced_quantity?: number;
  production_start?: string;
  production_end?: string;
  status?: string;
  remarks?: string;
}

export type UpdateProductionSchedule = Partial<Omit<CreateProductionSchedule, 'kitchen_id'>>;
