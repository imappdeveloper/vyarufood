export interface Order {
  id: number;
  uuid: string;
  order_number: string;
  order_number_display: string;
  order_type: string;
  customer_id: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  subscription_id: number | null;
  subscription_number?: string;
  kitchen_id: number | null;
  kitchen_name?: string;
  address_id: number | null;
  address_line1?: string;
  address_city?: string;
  delivery_zone_id: number | null;
  delivery_zone_name?: string;
  order_date: string;
  delivery_date: string;
  delivery_slot: string | null;
  delivery_instruction: string | null;
  meal_category_id: number | null;
  meal_category_name?: string;
  meal_type_id: number | null;
  meal_type_name?: string;
  meal_id: number | null;
  meal_name?: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  discount_amount: string;
  coupon_amount: string;
  tax_amount: string;
  delivery_charge: string;
  total_amount: string;
  payment_status: string;
  payment_method: string | null;
  order_status: string;
  wallet_amount: string;
  reward_points_used: number;
  reward_points_earned: number;
  notes: string | null;
  cancelled_at: string | null;
  cancelled_by: number | null;
  cancellation_reason: string | null;
  is_pending: boolean;
  is_active: boolean;
  created_by: number | null;
  created_by_name?: string;
  updated_by: number | null;
  updated_by_name?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  order_items?: OrderItem[];
  status_history?: OrderStatusHistory[];
  cancellations?: OrderCancellation[];
  refunds?: OrderRefund[];
}

export interface OrderItem {
  id: number;
  uuid: string;
  order_id: number;
  meal_id: number;
  meal_name: string;
  meal_category_id: number | null;
  meal_category_name?: string;
  meal_type_id: number | null;
  meal_type_name?: string;
  quantity: number;
  unit_price: string;
  tax: string;
  discount: string;
  total: string;
  remarks: string | null;
}

export interface OrderStatusHistory {
  id: number;
  uuid: string;
  order_id: number;
  from_status: string;
  to_status: string;
  reason: string | null;
  changed_by_name?: string;
  metadata: any;
  created_at: string;
}

export interface OrderCancellation {
  id: number;
  uuid: string;
  order_id: number;
  cancelled_by: number | null;
  cancelled_by_name?: string;
  cancellation_reason: string;
  cancellation_charge: string;
  refund_amount: string;
  refund_status: string;
  remarks: string | null;
  created_at: string;
}

export interface OrderRefund {
  id: number;
  uuid: string;
  order_id: number;
  refund_number: string;
  refund_amount: string;
  refund_method: string;
  refund_status: string;
  refund_reason: string | null;
  processed_by_name?: string;
  processed_at: string | null;
  remarks: string | null;
  created_at: string;
}

export interface CustomerOrder {
  id: number;
  uuid: string;
  order_number: string;
  order_number_display: string;
  order_type: string;
  order_date: string;
  delivery_date: string;
  delivery_slot: string | null;
  delivery_instruction: string | null;
  quantity: number;
  subtotal: string;
  discount_amount: string;
  coupon_amount: string;
  tax_amount: string;
  delivery_charge: string;
  total_amount: string;
  wallet_amount: string;
  payment_status: string;
  payment_method: string | null;
  order_status: string;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  is_pending: boolean;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  address?: CustomerOrderAddress;
  kitchen?: { id: number; name: string } | null;
  order_items?: CustomerOrderItem[];
  status_history?: OrderStatusHistory[];
  cancellations?: OrderCancellation[];
  refunds?: OrderRefund[];
}

export interface CustomerOrderItem {
  id: number;
  uuid: string;
  meal_id: number | null;
  meal_name: string;
  meal_image?: string;
  meal_slug?: string;
  meal_category?: string;
  meal_type?: string;
  quantity: number;
  unit_price: string;
  tax: string;
  discount: string;
  total: string;
  remarks: string | null;
}

export interface CustomerOrderAddress {
  id: number;
  uuid: string;
  label: string;
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  full_address?: string;
}

export interface OrderTrackingStep {
  status: string;
  label: string;
  description: string;
  timestamp: string | null;
  completed: boolean;
  current: boolean;
}

export interface CustomerOrderListResponse {
  success: boolean;
  message?: string;
  data: CustomerOrder[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface CancelOrderPayload {
  reason?: string;
}

export type OrderTab = 'all' | 'active' | 'completed' | 'cancelled';

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'
];

export const COMPLETED_ORDER_STATUSES: OrderStatus[] = [
  'delivered', 'completed'
];

export const CANCELLED_ORDER_STATUSES: OrderStatus[] = [
  'cancelled', 'refunded'
];

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; icon: string; color: string; description: string }> = {
  pending: { label: 'Pending', icon: 'schedule', color: 'yellow', description: 'Your order has been placed and is awaiting confirmation.' },
  confirmed: { label: 'Confirmed', icon: 'check_circle', color: 'indigo', description: 'Your order has been confirmed by the kitchen.' },
  preparing: { label: 'Preparing', icon: 'cooking', color: 'yellow', description: 'Your meal is being freshly prepared.' },
  ready: { label: 'Ready', icon: 'restaurant', color: 'purple', description: 'Your meal is ready and will be picked up for delivery soon.' },
  out_for_delivery: { label: 'Out for Delivery', icon: 'local_shipping', color: 'orange', description: 'Your meal is on its way to you!' },
  delivered: { label: 'Delivered', icon: 'check_circle_outline', color: 'green', description: 'Your meal has been delivered. Enjoy!' },
  completed: { label: 'Completed', icon: 'task_alt', color: 'green', description: 'Your order has been completed.' },
  cancelled: { label: 'Cancelled', icon: 'cancel', color: 'red', description: 'This order has been cancelled.' },
  refunded: { label: 'Refunded', icon: 'replay', color: 'gray', description: 'This order has been refunded.' },
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled' | 'refunded';

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export const ORDER_TYPES: { value: string; label: string }[] = [
  { value: 'subscription', label: 'Subscription' },
  { value: 'single_meal', label: 'Single Meal' },
  { value: 'guest', label: 'Guest' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'custom', label: 'Custom' },
];

export const PAYMENT_STATUSES: { value: string; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'partial_refund', label: 'Partial Refund' },
];
