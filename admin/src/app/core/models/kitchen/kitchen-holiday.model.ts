export interface KitchenHoliday {
  id: number;
  uuid: string;
  kitchen_id: number;
  holiday_name: string;
  holiday_type: string;
  holiday_type_label: string;
  start_date: string;
  end_date: string;
  duration: number;
  reason: string | null;
  status: 'active' | 'inactive';
  status_label: string;
  created_at: string;
  updated_at: string;
  kitchen?: any;
}

export interface CreateKitchenHoliday {
  kitchen_id: number;
  holiday_name: string;
  holiday_type: string;
  start_date: string;
  end_date: string;
  reason?: string;
  status?: string;
}

export type UpdateKitchenHoliday = Partial<Omit<CreateKitchenHoliday, 'kitchen_id'>>;
