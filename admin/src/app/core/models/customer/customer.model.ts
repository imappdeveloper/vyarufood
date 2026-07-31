export interface Customer {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  country_code: string;
  profile_photo: string | null;
  gender: 'male' | 'female' | 'other' | null;
  date_of_birth: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  status: 'active' | 'inactive' | 'suspended';
  status_label: string;
  is_blocked: boolean;
  block_reason: string | null;
  wallet_balance: number;
  wallet_currency: string;
  referral_code: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  last_login_at: string | null;
  last_login_ip: string | null;
  country: any;
  state: any;
  city: any;
  area: any;
  referrer: Customer | null;
  referralsCount: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code?: string;
  password?: string;
  password_confirmation?: string;
  profile_photo?: string;
  gender?: string;
  date_of_birth?: string;
  address_line_1?: string;
  address_line_2?: string;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  area_id?: number;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  referral_code?: string;
  referred_by?: number;
}

export type UpdateCustomer = Partial<CreateCustomer>;

export interface CustomerStats {
  total: Record<string, number>;
  blocked: number;
}

export interface CustomerImportResult {
  successes: number;
  failures: { row: number; error: string; data: any }[];
  total: number;
}
