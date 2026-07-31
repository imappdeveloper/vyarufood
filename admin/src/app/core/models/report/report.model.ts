export interface DashboardKPIs {
  today_revenue: number;
  today_orders: number;
  active_customers: number;
  active_subscriptions: number;
  pending_orders: number;
  kitchen_production_batches: number;
  inventory_value: number;
  low_stock_items: number;
  total_expenses: number;
  net_profit: number;
  revenue_change_pct: number;
  orders_change_pct: number;
}

export interface ChartDataPoint {
  date: string;
  [key: string]: any;
}

export interface ReportSummary {
  [key: string]: any;
}

export interface ReportResponse {
  data: any[];
  summary: any;
  chart: any;
}

export interface ExecutiveReport {
  sales: ReportResponse;
  orders: ReportResponse;
  finance: ReportResponse;
  expenses: ReportResponse;
}

export interface SavedReport {
  id: number;
  uuid: string;
  report_code: string;
  report_name: string;
  report_type: string;
  filters: Record<string, any>;
  is_public: boolean;
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduledReport {
  id: number;
  uuid: string;
  report_name: string;
  report_type: string;
  frequency: string;
  next_run_at: string;
  last_run_at: string | null;
  is_active: boolean;
  delivery_channels: string[];
  recipients: string[];
  created_at: string;
  updated_at: string;
}

export interface ReportExport {
  id: number;
  uuid: string;
  export_code: string;
  report_type: string;
  format: string;
  status: string;
  file_path: string | null;
  file_size: number | null;
  generated_at: string;
  completed_at: string | null;
  created_at: string;
}

export type ReportType = 'executive' | 'sales' | 'orders' | 'customers' | 'subscriptions' | 'kitchen' | 'inventory' | 'purchases' | 'finance' | 'payments' | 'gst' | 'expenses' | 'suppliers' | 'notifications';

export const REPORT_TYPES: { value: ReportType; label: string; icon: string }[] = [
  { value: 'executive', label: 'Executive Summary', icon: 'assessment' },
  { value: 'sales', label: 'Sales Report', icon: 'point_of_sale' },
  { value: 'orders', label: 'Order Report', icon: 'shopping_cart' },
  { value: 'customers', label: 'Customer Report', icon: 'people' },
  { value: 'subscriptions', label: 'Subscription Report', icon: 'subscriptions' },
  { value: 'kitchen', label: 'Kitchen Report', icon: 'restaurant' },
  { value: 'inventory', label: 'Inventory Report', icon: 'inventory_2' },
  { value: 'purchases', label: 'Purchase Report', icon: 'local_shipping' },
  { value: 'finance', label: 'Finance Report', icon: 'account_balance' },
  { value: 'payments', label: 'Payment Report', icon: 'payment' },
  { value: 'gst', label: 'GST Report', icon: 'receipt' },
  { value: 'expenses', label: 'Expense Report', icon: 'money_off' },
  { value: 'suppliers', label: 'Supplier Report', icon: 'store' },
  { value: 'notifications', label: 'Notification Report', icon: 'notifications' },
];

export const GROUP_BY_OPTIONS: { value: string; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];
