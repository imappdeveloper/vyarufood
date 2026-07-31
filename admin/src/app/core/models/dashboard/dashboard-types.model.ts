export interface SystemHealth {
  app_version: string;
  laravel_version: string;
  php_version: string;
  mysql_status: string;
  redis_status: string;
  queue_size: number;
  storage_used: number;
  server_time: string;
  timezone: string;
}

export interface KpiCard {
  label: string;
  value: string;
  change: number;
  icon: string;
  bgColor: string;
  shadow: string;
  prefix?: string;
}

export type DashboardPeriod = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'last_month' | 'this_year' | 'custom';

export interface DashboardFilter {
  period: DashboardPeriod;
  start_date?: string;
  end_date?: string;
}
