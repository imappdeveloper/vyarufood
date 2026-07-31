export interface Area {
  id: number;
  uuid: string;
  country_id: number;
  state_id: number;
  city_id: number;
  country: any;
  state: any;
  city: any;
  name: string;
  area_code: string;
  postal_zone: string | null;
  latitude: number | null;
  longitude: number | null;
  delivery_radius: number | null;
  minimum_order_amount: number | null;
  delivery_charge: number | null;
  estimated_delivery_time: number | null;
  is_serviceable: boolean;
  is_default: boolean;
  sort_order: number;
  status: 'active' | 'inactive' | 'pending';
  remarks: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateArea {
  country_id: number;
  state_id: number;
  city_id: number;
  name: string;
  area_code: string;
  postal_zone?: string;
  latitude?: number;
  longitude?: number;
  delivery_radius?: number;
  minimum_order_amount?: number;
  delivery_charge?: number;
  estimated_delivery_time?: number;
  is_serviceable?: boolean;
  display_order?: number;
  is_default?: boolean;
  status?: string;
  remarks?: string;
}

export type UpdateArea = Partial<CreateArea>;

export interface AreaImportResult {
  success_count: number;
  error_count: number;
  errors: string[];
}
