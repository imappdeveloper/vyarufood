export interface ChartData {
  revenue_trend: ChartPoint[];
  expense_trend: ChartPoint[];
  order_status: StatusCount[];
  orders_by_hour: HourlyCount[];
  orders_by_day: DailyCount[];
  sales_by_category: CategorySales[];
  top_meals: TopMeal[];
}

export interface ChartPoint {
  date: string;
  revenue?: number;
  amount?: number;
  count?: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface HourlyCount {
  hour: number;
  count: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface CategorySales {
  category: string;
  total: number;
}

export interface TopMeal {
  meal_id: number;
  total_qty: number;
}

export interface RevenueData {
  daily: ChartPoint[];
  monthly: { year: number; month: number; revenue: number }[];
}

export interface OrderAnalytics {
  status_distribution: StatusCount[];
  hourly: HourlyCount[];
  daily: DailyCount[];
  average_value: number;
}

export interface CustomerAnalytics {
  growth: { date: string; count: number }[];
  top_customers: any[];
  subscription_customers: number;
  retention_rate: number;
}

export interface InventoryAnalytics {
  low_stock_items: any[];
  top_consumed: any[];
  total_value: number;
  low_stock_count: number;
}
