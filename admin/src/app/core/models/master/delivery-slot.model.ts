export interface DeliverySlot {
  id: number;
  uuid: string;
  slot_name: string;
  start_time: string;
  end_time: string;
  maximum_orders: number | null;
  cutoff_time: string | null;
  status: 'active' | 'inactive' | 'pending';
  status_label: string;
  deliveryZone: any;
  created_at: string;
  updated_at: string;
}

export interface CreateDeliverySlot {
  slot_name: string;
  start_time: string;
  end_time: string;
  maximum_orders?: number;
  cutoff_time?: string;
  status?: string;
}

export type UpdateDeliverySlot = Partial<CreateDeliverySlot>;
