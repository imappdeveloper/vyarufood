export interface Supplier {
  id: number;
  uuid: string;
  supplier_code: string;
  supplier_name: string | null;
  supplier_type: string;
  company_name: string;
  contact_person: string | null;
  mobile: string | null;
  alternate_mobile: string | null;
  email: string | null;
  website: string | null;
  gst_number: string | null;
  pan_number: string | null;
  fssai_license: string | null;
  drug_license: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  country_id: number | null;
  country_name: string | null;
  state_id: number | null;
  state_name: string | null;
  city_id: number | null;
  city_name: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  branch_name: string | null;
  credit_limit: number;
  credit_days: number;
  payment_terms: string | null;
  opening_balance: number;
  current_balance: number;
  rating: number;
  status: string;
  is_preferred: boolean;
  remarks: string | null;
  products_count?: number;
  documents_count?: number;
  contacts_count?: number;
  products?: SupplierProduct[];
  documents?: SupplierDocument[];
  contacts?: SupplierContact[];
  created_at: string;
  updated_at: string;
}

export interface SupplierProduct {
  id: number;
  uuid: string;
  supplier_id: number;
  inventory_item_id: number;
  inventory_item_name?: string;
  supplier_product_code: string | null;
  supplier_product_name: string | null;
  purchase_price: number;
  minimum_order_quantity: number;
  maximum_order_quantity: number | null;
  lead_time_days: number;
  unit_id: number | null;
  unit_name?: string;
  is_primary_supplier: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierDocument {
  id: number;
  uuid: string;
  supplier_id: number;
  document_type: string;
  document_name: string;
  document_path: string;
  expiry_date: string | null;
  status: string;
  created_at: string;
}

export interface SupplierContact {
  id: number;
  uuid: string;
  supplier_id: number;
  name: string;
  designation: string | null;
  mobile: string | null;
  email: string | null;
  is_primary: boolean;
  created_at: string;
}

export interface SupplierPriceHistory {
  id: number;
  uuid: string;
  supplier_id: number;
  inventory_item_id: number;
  inventory_item_name?: string;
  old_price: number;
  new_price: number;
  effective_from: string;
  remarks: string | null;
  created_at: string;
}

export type SupplierType = 'raw_material' | 'packaging' | 'gas' | 'cleaning' | 'equipment' | 'general';

export const SUPPLIER_TYPES: { value: SupplierType; label: string }[] = [
  { value: 'raw_material', label: 'Raw Material Supplier' },
  { value: 'packaging', label: 'Packaging Supplier' },
  { value: 'gas', label: 'Gas Supplier' },
  { value: 'cleaning', label: 'Cleaning Material Supplier' },
  { value: 'equipment', label: 'Equipment Supplier' },
  { value: 'general', label: 'General Supplier' },
];

export type SupplierStatus = 'active' | 'inactive' | 'blocked' | 'blacklisted';

export const SUPPLIER_STATUSES: { value: SupplierStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'blacklisted', label: 'Blacklisted' },
];

export const DOCUMENT_TYPES: { value: string; label: string }[] = [
  { value: 'gst_certificate', label: 'GST Certificate' },
  { value: 'pan_card', label: 'PAN Card' },
  { value: 'fssai_license', label: 'FSSAI License' },
  { value: 'drug_license', label: 'Drug License' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'agreement', label: 'Agreement' },
  { value: 'quality_certificate', label: 'Quality Certificate' },
  { value: 'other', label: 'Other' },
];
