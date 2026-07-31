export interface CheckoutSummaryResponse {
  cart: any;
  has_unavailable_items: boolean;
  addresses: any[];
  wallet_balance: number;
}

export interface CheckoutOrder {
  id: number;
  uuid: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  payment_method: string | null;
  total_amount: number;
  delivery_date: string;
  delivery_slot: string | null;
  address: any;
  order_items: any[];
  created_at: string;
}
