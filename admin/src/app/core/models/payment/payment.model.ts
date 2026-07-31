export interface Wallet {
  id: number;
  uuid: string;
  wallet_number: string;
  customer_id: number;
  current_balance: string;
  blocked_balance: string;
  total_credit: string;
  total_debit: string;
  status: string;
  customer?: any;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: number;
  uuid: string;
  transaction_number: string;
  wallet_id: number;
  transaction_type: 'credit' | 'debit';
  transaction_type_label: string;
  amount: string;
  opening_balance: string;
  closing_balance: string;
  reference_type: string | null;
  reference_type_label: string | null;
  reference_id: number | null;
  remarks: string | null;
  performed_by: { type: 'admin' | 'customer'; name: string } | null;
  created_at: string;
}

export interface PaymentTransaction {
  id: number;
  uuid: string;
  transaction_number: string;
  gateway_name: string;
  gateway_transaction_id: string | null;
  gateway_order_id: string | null;
  customer_id: number;
  order_id: number | null;
  subscription_id: number | null;
  payment_type: string;
  payment_method: string;
  amount: string;
  currency: string;
  gateway_fee: string;
  tax_amount: string;
  status: string;
  payment_date: string | null;
  failure_reason: string | null;
  webhook_verified: boolean;
  customer?: any;
  order?: any;
  subscription?: any;
  refunds?: PaymentRefund[];
  created_at: string;
  updated_at: string;
}

export interface PaymentRefund {
  id: number;
  uuid: string;
  refund_number: string;
  payment_transaction_id: number;
  customer_id: number;
  refund_amount: string;
  refund_reason: string;
  gateway_refund_id: string | null;
  status: string;
  processed_by: number | null;
  processed_at: string | null;
  payment_transaction?: PaymentTransaction;
  customer?: any;
  created_at: string;
  updated_at: string;
}

export interface PaymentWebhookLog {
  id: number;
  uuid: string;
  gateway_name: string;
  event_name: string;
  payload: any;
  signature: string | null;
  verification_status: string;
  processed_at: string | null;
  created_at: string;
}

export interface PaymentDashboardStats {
  total_payments: number;
  successful: number;
  pending: number;
  failed: number;
  refunded: number;
  total_amount: number;
  today_count: number;
  today_amount: number;
}

export interface RevenueSummary {
  daily: any[];
  by_gateway: any[];
  by_method: any[];
  total_revenue: number;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type WalletStatus = 'active' | 'inactive' | 'frozen';
export type GatewayName = 'razorpay' | 'payu' | 'cashfree' | 'stripe' | 'wallet';
export type PaymentType = 'order' | 'subscription' | 'wallet_recharge' | 'topup';
export type PaymentMethod = 'upi' | 'card' | 'net_banking' | 'wallet' | 'cod' | 'emandate';
export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type WebhookVerificationStatus = 'verified' | 'unverified' | 'invalid' | 'error';

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-purple-100 text-purple-800' },
];

export const WALLET_STATUSES: { value: WalletStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  { value: 'frozen', label: 'Frozen', color: 'bg-red-100 text-red-800' },
];

export const GATEWAY_NAMES: { value: GatewayName; label: string }[] = [
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'payu', label: 'PayU' },
  { value: 'cashfree', label: 'Cashfree' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'wallet', label: 'Wallet' },
];

export const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
  { value: 'order', label: 'Order' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'wallet_recharge', label: 'Wallet Recharge' },
  { value: 'topup', label: 'Top-up' },
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'net_banking', label: 'Net Banking' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'cod', label: 'COD' },
  { value: 'emandate', label: 'e-Mandate' },
];

export const REFUND_STATUSES: { value: RefundStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
];

export const WEBHOOK_VERIFICATION_STATUSES: { value: WebhookVerificationStatus; label: string; color: string }[] = [
  { value: 'verified', label: 'Verified', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'unverified', label: 'Unverified', color: 'bg-amber-100 text-amber-800' },
  { value: 'invalid', label: 'Invalid', color: 'bg-red-100 text-red-800' },
  { value: 'error', label: 'Error', color: 'bg-red-100 text-red-800' },
];
