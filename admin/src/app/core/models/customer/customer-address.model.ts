export interface CustomerAddress {
  id: number;
  uuid: string;
  customer_id: number;
  label: string;
  address_type: string;
  address_line_1: string;
  address_line_2: string | null;
  house_no: string | null;
  building_name: string | null;
  floor: string | null;
  street: string | null;
  landmark: string | null;
  country_id: number;
  state_id: number;
  city_id: number;
  area_id: number | null;
  pincode: any;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  is_verified: boolean;
  status: 'active' | 'inactive';
  contact_person: string | null;
  contact_mobile: string | null;
  delivery_instruction: string | null;
  customer: any;
  country: any;
  state: any;
  city: any;
  area: any;
  delivery_zone: any;
  address_type_label: string;
  full_address: string;
  google_place_id: string | null;
  status_label: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerAddress {
  label?: string;
  address_type?: string;
  address_line_1: string;
  address_line_2?: string;
  house_no?: string;
  building_name?: string;
  floor?: string;
  street?: string;
  landmark?: string;
  country_id: number;
  state_id: number;
  city_id: number;
  area_id?: number;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
  contact_person?: string;
  contact_mobile?: string;
  delivery_instruction?: string;
}

export interface UpdateCustomerAddress extends Partial<CreateCustomerAddress> {}

export interface CustomerAddressStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
}

export interface ServiceAvailability {
  available: boolean;
  message: string;
}
