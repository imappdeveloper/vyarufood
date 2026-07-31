export interface Pincode {
  id: number;
  uuid: string;
  pincode: string;
  office_name: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  status: 'active' | 'inactive' | 'pending';
  status_label: string;
  is_serviceable: boolean;
  delivery_zone_id: number;
  country_id: number;
  state_id: number;
  city_id: number;
  area_id: number | null;
  deliveryZone: any;
  country: any;
  state: any;
  city: any;
  area: any;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreatePincode {
  delivery_zone_id: number;
  country_id: number;
  state_id: number;
  city_id: number;
  area_id?: number;
  pincode: string;
  office_name?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  is_serviceable?: boolean;
}

export type UpdatePincode = Partial<CreatePincode>;

export interface PincodeImportResult {
  success_count: number;
  error_count: number;
  errors: string[];
}
