export interface Kitchen {
  id: number;
  uuid: string;
  kitchen_code: string;
  name: string;
  description: string | null;
  kitchen_type: 'main_kitchen' | 'central_kitchen' | 'cloud_kitchen' | 'branch_kitchen' | 'future_kitchen';
  kitchen_type_label: string;
  manager_name: string | null;
  manager_mobile: string | null;
  manager_email: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  landmark: string | null;
  full_address: string;
  latitude: number | null;
  longitude: number | null;
  opening_time: string | null;
  closing_time: string | null;
  preparation_start_time: string | null;
  accept_order_start_time: string | null;
  accept_order_end_time: string | null;
  daily_capacity: number | null;
  maximum_orders: number | null;
  emergency_contact: string | null;
  license_number: string | null;
  fssai_number: string | null;
  gst_number: string | null;
  logo: string | null;
  status: 'active' | 'inactive';
  status_label: string;
  is_default: boolean;
  remarks: string | null;
  country: any;
  state: any;
  city: any;
  area: any;
  delivery_zone: any;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  created_by_name: string | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateKitchen {
  kitchen_code: string;
  name: string;
  description?: string;
  kitchen_type: string;
  manager_name?: string;
  manager_mobile?: string;
  manager_email?: string;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  area_id?: number;
  delivery_zone_id?: number;
  address_line_1?: string;
  address_line_2?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  opening_time?: string;
  closing_time?: string;
  preparation_start_time?: string;
  accept_order_start_time?: string;
  accept_order_end_time?: string;
  daily_capacity?: number;
  maximum_orders?: number;
  emergency_contact?: string;
  license_number?: string;
  fssai_number?: string;
  gst_number?: string;
  logo?: string;
  status?: string;
  is_default?: boolean;
  remarks?: string;
}

export type UpdateKitchen = Partial<CreateKitchen>;

export interface KitchenStats {
  total: Record<string, number>;
  default_count: number;
}

export interface KitchenImportResult {
  successes: number;
  failures: { row: number; error: string; data: any }[];
  total: number;
}
