export interface State {
  id: number;
  uuid: string;
  country_id: number;
  country: any;
  name: string;
  state_code: string | null;
  abbreviation: string | null;
  gst_code: string | null;
  latitude: number | null;
  longitude: number | null;
  status: 'active' | 'inactive' | 'pending';
  sort_order: number;
  is_default: boolean;
  remarks: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateState {
  country_id: number;
  name: string;
  state_code?: string;
  abbreviation?: string;
  gst_code?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  sort_order?: number;
  is_default?: boolean;
  remarks?: string;
}

export type UpdateState = Partial<CreateState>;

export interface StateImportResult {
  success_count: number;
  error_count: number;
  errors: string[];
}
