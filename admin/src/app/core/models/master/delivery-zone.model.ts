export interface DeliveryZone {
  id: number;
  uuid: string;
  country_id: number;
  state_id: number;
  city_id: number;
  area_id: number | null;
  country: any;
  state: any;
  city: any;
  area: any;
  zone_name: string;
  zone_code: string;
  description: string | null;
  delivery_radius: number | null;
  minimum_order_amount: number;
  delivery_charge: number;
  free_delivery_above: number | null;
  estimated_delivery_time: number | null;
  maximum_orders_per_slot: number | null;
  priority: number;
  status: 'active' | 'inactive' | 'pending';
  status_label: string;
  is_default: boolean;
  remarks: string | null;
  pincodesCount: number;
  deliverySlotsCount: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateDeliveryZone {
  country_id: number;
  state_id: number;
  city_id: number;
  area_id?: number;
  zone_name: string;
  zone_code: string;
  description?: string;
  delivery_radius?: number;
  minimum_order_amount?: number;
  delivery_charge?: number;
  free_delivery_above?: number;
  estimated_delivery_time?: number;
  maximum_orders_per_slot?: number;
  priority?: number;
  status?: string;
  is_default?: boolean;
  remarks?: string;
}

export type UpdateDeliveryZone = Partial<CreateDeliveryZone>;

export interface DeliveryZoneImportResult {
  success_count: number;
  error_count: number;
  errors: string[];
}
