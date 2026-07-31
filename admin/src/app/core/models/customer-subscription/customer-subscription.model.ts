export interface CustomerSubscription {
  id: number;
  uuid: string;
  subscription_number: string;
  subscription_number_display: string;
  customer_id: number;
  customer_name?: string;
  customer_email?: string;
  subscription_plan_id: number;
  plan_name?: string;
  plan_code?: string;
  plan_price?: string;
  plan_duration_days?: number;
  plan_allow_skip?: boolean;
  plan_allow_pause?: boolean;
  plan_allow_resume?: boolean;
  plan_allow_cancel?: boolean;
  plan_allow_upgrade?: boolean;
  plan_allow_downgrade?: boolean;
  kitchen_id: number | null;
  kitchen_name?: string;
  meal_category_id: number | null;
  meal_category_name?: string;
  start_date: string;
  end_date: string;
  activation_date: string | null;
  billing_cycle: string;
  subscription_status: string;
  subscription_status_label?: string;
  payment_status: string;
  payment_status_label?: string;
  wallet_adjustment: string;
  remaining_meals: number;
  consumed_meals: number;
  skipped_meals: number;
  total_meals: number;
  progress_percentage: number;
  days_remaining: number;
  paused_days: number;
  pause_start: string | null;
  pause_end: string | null;
  next_delivery_date: string | null;
  auto_renew: boolean;
  renewal_date: string | null;
  cancellation_date: string | null;
  cancellation_reason: string | null;
  refund_amount: string;
  remarks: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_by: number | null;
  created_by_name?: string;
  updated_by: number | null;
  updated_by_name?: string;
  created_at: string;
  updated_at: string;
  pause_history?: SubscriptionPauseHistory[];
  skip_history?: SubscriptionSkipHistory[];
  upgrade_history?: SubscriptionUpgradeHistory[];
  renew_history?: SubscriptionRenewHistory[];
  status_history?: SubscriptionStatusHistory[];
}

export interface SubscriptionPauseHistory {
  id: number;
  uuid: string;
  customer_subscription_id: number;
  action: string;
  pause_start: string | null;
  pause_end: string | null;
  pause_days: number;
  new_end_date: string | null;
  reason: string | null;
  status: string;
  approved_by_name?: string;
  remarks: string | null;
  created_at: string;
}

export interface SubscriptionSkipHistory {
  id: number;
  uuid: string;
  customer_subscription_id: number;
  skip_type: string;
  skip_date: string;
  meal_id: number | null;
  meal_name?: string;
  meals_credited: number;
  credit_amount: string;
  reason: string | null;
  status: string;
  remarks: string | null;
  created_at: string;
}

export interface SubscriptionUpgradeHistory {
  id: number;
  uuid: string;
  customer_subscription_id: number;
  action: string;
  from_plan_id: number;
  from_plan_name?: string;
  to_plan_id: number;
  to_plan_name?: string;
  price_difference: string;
  remaining_meals_before: number;
  remaining_meals_after: number;
  reason: string | null;
  status: string;
  approved_by_name?: string;
  refund_amount: string;
  additional_charge: string;
  remarks: string | null;
  created_at: string;
}

export interface SubscriptionRenewHistory {
  id: number;
  uuid: string;
  customer_subscription_id: number;
  from_plan_id: number;
  from_plan_name?: string;
  to_plan_id: number;
  to_plan_name?: string;
  old_end_date: string;
  new_end_date: string;
  old_remaining_meals: number;
  new_remaining_meals: number;
  renewal_amount: string;
  discount_amount: string;
  final_amount: string;
  renewal_type: string;
  reason: string | null;
  remarks: string | null;
  created_at: string;
}

export interface SubscriptionStatusHistory {
  id: number;
  uuid: string;
  customer_subscription_id: number;
  from_status: string;
  to_status: string;
  reason: string | null;
  changed_by_name?: string;
  metadata: any;
  created_at: string;
}

export type SubscriptionStatus = 'pending' | 'active' | 'paused' | 'skipped' | 'expired' | 'completed' | 'cancelled' | 'suspended';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';

export const SUBSCRIPTION_STATUSES: { value: SubscriptionStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'skipped', label: 'Skipped' },
  { value: 'expired', label: 'Expired' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'suspended', label: 'Suspended' },
];

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'partial_refund', label: 'Partial Refund' },
];

export const BILLING_CYCLES: { value: string; label: string }[] = [
  { value: 'one_time', label: 'One Time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];
