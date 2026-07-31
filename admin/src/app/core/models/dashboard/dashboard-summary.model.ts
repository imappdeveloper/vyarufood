export interface DashboardSummary {
  revenue: RevenueSummary;
  orders: OrderSummary;
  customers: CustomerSummary;
  subscriptions: SubscriptionSummary;
  meals: MealSummary;
  expenses: ExpenseSummary;
}

export interface RevenueSummary {
  today: number;
  month: number;
  total: number;
  period: number;
  change_percentage: number;
}

export interface OrderSummary {
  today: number;
  pending: number;
  preparing: number;
  ready: number;
  out_for_delivery: number;
  delivered: number;
  cancelled: number;
  refund_requested: number;
  period_total: number;
}

export interface CustomerSummary {
  total: number;
  new_today: number;
  active: number;
  inactive: number;
  period_new: number;
}

export interface SubscriptionSummary {
  total_plans: number;
  active: number;
  expired: number;
  new_today: number;
  total: number;
}

export interface MealSummary {
  total: number;
  available: number;
  out_of_stock: number;
  low_stock_ingredients: number;
  kitchen_capacity: number;
}

export interface ExpenseSummary {
  today: number;
  month: number;
  period: number;
  net_profit: number;
}
