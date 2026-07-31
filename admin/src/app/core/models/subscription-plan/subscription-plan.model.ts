export interface SubscriptionPlan {
  id: number;
  uuid: string;
  plan_code: string;
  plan_name: string;
  slug: string;
  description: string | null;
  plan_type: string;
  billing_cycle: string;
  duration_days: number;
  meal_category_id: number;
  meal_category_name?: string;
  kitchen_id: number | null;
  kitchen_name?: string;
  display_order: number;
  price: number;
  offer_price: number;
  effective_price: number;
  security_deposit: number;
  tax_percentage: number;
  delivery_charge: number;
  joining_fee: number;
  minimum_order_amount: number;
  maximum_skip_days: number;
  maximum_pause_days: number;
  maximum_active_subscriptions: number;
  meal_selection_enabled: boolean;
  custom_meal_selection: boolean;
  default_meal_assignment: boolean;
  carry_forward_skipped_meals: boolean;
  weekend_delivery: boolean;
  holiday_delivery: boolean;
  allow_upgrade: boolean;
  allow_downgrade: boolean;
  allow_pause: boolean;
  allow_resume: boolean;
  allow_skip: boolean;
  allow_cancel: boolean;
  auto_renew: boolean;
  renewal_discount: number;
  trial_days: number;
  is_popular: boolean;
  is_recommended: boolean;
  status: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  deleted_at: string | null;
  remarks: string | null;
  created_by: number | null;
  created_by_name?: string;
  updated_by: number | null;
  updated_by_name?: string;
  created_at: string;
  updated_at: string;
  items_count?: number;
  plan_meals?: SubscriptionPlanMeal[];
  kitchen?: any;
  meal_category?: any;
}

export interface SubscriptionPlanMeal {
  id: number;
  uuid: string;
  subscription_plan_id: number;
  meal_category_id: number;
  meal_category_name?: string;
  meal_type_id: number | null;
  meal_type_name?: string;
  meal_id: number;
  meal_name?: string;
  day_of_week: string | null;
  quantity: number;
  is_optional: boolean;
  is_default: boolean;
}

export type PlanType = 'daily' | 'weekly' | '15_days' | 'monthly' | 'quarterly' | 'half_yearly' | 'yearly' | 'custom';
export type BillingCycle = 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type PlanStatus = 'active' | 'inactive' | 'draft';

export const PLAN_TYPES: { value: PlanType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: '15_days', label: '15 Days' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'custom', label: 'Custom' },
];

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: 'one_time', label: 'One Time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export const PLAN_STATUSES: { value: PlanStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'draft', label: 'Draft' },
];

export const DAYS_OF_WEEK: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
