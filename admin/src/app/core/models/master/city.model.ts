export interface City {
  id: number;
  uuid: string;
  country_id: number;
  state_id: number;
  country: any;
  state: any;
  name: string;
  city_code: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  population: number | null;
  pincode: string | null;
  area: number | null;
  sort_order: number;
  is_metro: boolean;
  status: 'active' | 'inactive' | 'pending';
  is_default: boolean;
  remarks: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateCity {
  country_id: number;
  state_id: number;
  name: string;
  city_code: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  population?: number;
  pincode?: string;
  area?: number;
  display_order?: number;
  is_metro?: boolean;
  status?: string;
  is_default?: boolean;
  remarks?: string;
}

export type UpdateCity = Partial<CreateCity>;

export interface CityImportResult {
  success_count: number;
  error_count: number;
  errors: string[];
}
