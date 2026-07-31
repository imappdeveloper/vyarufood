export interface KitchenWorkingDay {
  id: number;
  uuid: string;
  kitchen_id: number;
  day_of_week: string;
  day_of_week_label: string;
  is_working: boolean;
  opening_time: string | null;
  closing_time: string | null;
  preparation_start_time: string | null;
  accept_order_start: string | null;
  accept_order_end: string | null;
  created_at: string;
  updated_at: string;
  kitchen?: any;
}

export interface CreateKitchenWorkingDay {
  kitchen_id: number;
  day_of_week: string;
  is_working?: boolean;
  opening_time?: string;
  closing_time?: string;
  preparation_start_time?: string;
  accept_order_start?: string;
  accept_order_end?: string;
}

export type UpdateKitchenWorkingDay = Partial<Omit<CreateKitchenWorkingDay, 'kitchen_id'>>;

export interface BulkUpdateWorkingDay {
  kitchen_id: number;
  days: {
    day_of_week: string;
    is_working: boolean;
    open_time?: string;
    close_time?: string;
    break_start_time?: string;
    break_end_time?: string;
  }[];
}
