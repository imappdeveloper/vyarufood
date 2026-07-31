export interface KitchenCapacity {
  id: number;
  uuid: string;
  kitchen_id: number;
  capacity_date: string;
  breakfast_capacity: number;
  lunch_capacity: number;
  dinner_capacity: number;
  healthy_meal_capacity: number;
  snack_capacity: number;
  total_meal_capacity: number;
  maximum_orders: number;
  reserved_orders: number;
  available_orders: number;
  capacity_percentage: number;
  status: 'active' | 'inactive';
  status_label: string;
  created_at: string;
  updated_at: string;
  kitchen?: any;
}

export interface CreateKitchenCapacity {
  kitchen_id: number;
  capacity_date: string;
  breakfast_capacity?: number;
  lunch_capacity?: number;
  dinner_capacity?: number;
  healthy_meal_capacity?: number;
  snack_capacity?: number;
  maximum_orders?: number;
  reserved_orders?: number;
  status?: string;
}

export type UpdateKitchenCapacity = Partial<Omit<CreateKitchenCapacity, 'kitchen_id'>>;
