export interface CartItem {
  id: number;
  meal_id: number;
  meal_name: string;
  meal_slug: string;
  meal_image: string | null;
  meal_type: string | null;
  category_name: string | null;
  quantity: number;
  unit_price: number;
  original_price: number;
  discount_amount: number;
  total_price: number;
  special_instructions: string | null;
  is_available: boolean;
  dietary_type: string | null;
  meal_status: string;
}

export interface Cart {
  id: number;
  customer_id: number;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  tax_amount: number;
  tax_percentage: number;
  delivery_charge: number;
  discount_amount: number;
  coupon_amount: number;
  coupon_code: string | null;
  wallet_amount: number;
  total_amount: number;
  created_at: string | null;
  updated_at: string | null;
}
