import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardApiService } from '../../core/services/dashboard-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { ChartCardComponent } from './components/chart-card/chart-card.component';
import { RecentWidgetComponent } from './components/recent-widget/recent-widget.component';
import { DashboardFiltersComponent } from './components/dashboard-filters/dashboard-filters.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { SystemHealthComponent } from './components/system-health/system-health.component';
import { SupportWidgetComponent } from './components/support-widget/support-widget.component';
import { DashboardSummary } from '../../core/models/dashboard/dashboard-summary.model';
import { ChartData } from '../../core/models/dashboard/dashboard-charts.model';
import { DashboardFilter } from '../../core/models/dashboard/dashboard-types.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, KpiCardComponent, ChartCardComponent,
    RecentWidgetComponent, DashboardFiltersComponent, QuickActionsComponent, SystemHealthComponent,
    SupportWidgetComponent,
  ],
  template: `
    <!-- Gradient Hero Header -->
    <div [style.background]="'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)'"
         [style.borderRadius]="'20px'" [style.padding]="'28px 32px'" [style.marginBottom]="'24px'"
         [style.position]="'relative'" [style.overflow]="'hidden'">
      <div [style.position]="'absolute'" [style.top]="'-50px'" [style.right]="'-30px'"
           [style.width]="'220px'" [style.height]="'220px'" [style.borderRadius]="'50%'"
           [style.background]="'rgba(255,255,255,0.07)'"></div>
      <div [style.position]="'absolute'" [style.bottom]="'-70px'" [style.left]="'40%'"
           [style.width]="'300px'" [style.height]="'300px'" [style.borderRadius]="'50%'"
           [style.background]="'rgba(255,255,255,0.04)'"></div>
      <div [style.position]="'relative'" [style.zIndex]="'1'"
           [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'space-between'">
        <div>
          <p [style.color]="'rgba(255,255,255,0.7)'" [style.fontSize]="'12px'" [style.fontWeight]="'600'"
             [style.letterSpacing]="'1px'" [style.margin]="'0 0 4px 0'">DASHBOARD</p>
          <h1 [style.color]="'#fff'" [style.fontSize]="'24px'" [style.fontWeight]="'700'"
              [style.margin]="'0 0 4px 0'">Good {{ greeting }}, Admin</h1>
          <p [style.color]="'rgba(255,255,255,0.8)'" [style.fontSize]="'14px'" [style.margin]="'0'">
            {{ currentDate }} &middot; Viewing: <strong [style.textTransform]="'capitalize'">{{ currentFilter.period.replace('_', ' ') }}</strong>
          </p>
        </div>
        <app-dashboard-filters (periodChange)="onPeriodChange($event)" (exportData)="onExport()" />
      </div>
    </div>

    <!-- Summary Loading Shimmer -->
    @if (summaryLoading) {
      <div [style.display]="'grid'" [style.gridTemplateColumns]="'repeat(4, 1fr)'" [style.gap]="'16px'" [style.marginBottom]="'24px'">
        @for (i of [1,2,3,4]; track i) {
          <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.padding]="'24px'"
               [style.border]="'1px solid #f0f0f0'">
            <div [style.animation]="'pulse 2s infinite'" [style.display]="'flex'" [style.justifyContent]="'space-between'">
              <div [style.flex]="'1'">
                <div [style.height]="'12px'" [style.background]="'#e5e7eb'" [style.borderRadius]="'6px'" [style.width]="'60%'" [style.marginBottom]="'10px'"></div>
                <div [style.height]="'28px'" [style.background]="'#f3f4f6'" [style.borderRadius]="'8px'" [style.width]="'40%'"></div>
              </div>
              <div [style.width]="'44px'" [style.height]="'44px'" [style.background]="'#e5e7eb'" [style.borderRadius]="'12px'"></div>
            </div>
          </div>
        }
      </div>
    }

    <!-- Revenue KPI Row -->
    @if (!summaryLoading && summary) {
      <div [style.display]="'grid'" [style.gridTemplateColumns]="'repeat(4, 1fr)'" [style.gap]="'16px'" [style.marginBottom]="'24px'">
        <app-kpi-card label="Today's Revenue" [value]="formatCurrency(summary.revenue.today)" [change]="summary.revenue.change_percentage" icon="payments" gradient="linear-gradient(135deg, #6366F1, #8B5CF6)" />
        <app-kpi-card label="Monthly Revenue" [value]="formatCurrency(summary.revenue.month)" icon="trending_up" gradient="linear-gradient(135deg, #059669, #10b981)" />
        <app-kpi-card label="Total Revenue" [value]="formatCurrency(summary.revenue.total)" icon="account_balance_wallet" gradient="linear-gradient(135deg, #F59E0B, #FBBF24)" />
        <app-kpi-card label="Net Profit" [value]="formatCurrency(summary.expenses.net_profit)" icon="savings" gradient="linear-gradient(135deg, #06B6D4, #22D3EE)" />
      </div>

      <!-- Order Status Row -->
      <div [style.display]="'grid'" [style.gridTemplateColumns]="'repeat(6, 1fr)'" [style.gap]="'12px'" [style.marginBottom]="'24px'">
        <app-kpi-card label="Today's Orders" [value]="formatNumber(summary.orders.today)" icon="receipt_long" gradient="linear-gradient(135deg, #8B5CF6, #A78BFA)" size="small" />
        <app-kpi-card label="Pending" [value]="formatNumber(summary.orders.pending)" icon="pending_actions" gradient="linear-gradient(135deg, #F59E0B, #FBBF24)" size="small" />
        <app-kpi-card label="Preparing" [value]="formatNumber(summary.orders.preparing)" icon="cooking" gradient="linear-gradient(135deg, #3B82F6, #60A5FA)" size="small" />
        <app-kpi-card label="Out for Delivery" [value]="formatNumber(summary.orders.out_for_delivery)" icon="local_shipping" gradient="linear-gradient(135deg, #EF4444, #F87171)" size="small" />
        <app-kpi-card label="Delivered" [value]="formatNumber(summary.orders.delivered)" icon="check_circle" gradient="linear-gradient(135deg, #10B981, #34D399)" size="small" />
        <app-kpi-card label="Cancelled" [value]="formatNumber(summary.orders.cancelled)" icon="cancel" gradient="linear-gradient(135deg, #6B7280, #9CA3AF)" size="small" />
      </div>

      <!-- Secondary Stats Row -->
      <div [style.display]="'grid'" [style.gridTemplateColumns]="'repeat(4, 1fr)'" [style.gap]="'12px'" [style.marginBottom]="'24px'">
        <app-kpi-card label="Total Customers" [value]="formatNumber(summary.customers.total)" icon="people" gradient="linear-gradient(135deg, #3B82F6, #60A5FA)" size="small" />
        <app-kpi-card label="New Today" [value]="formatNumber(summary.customers.new_today)" icon="person_add" gradient="linear-gradient(135deg, #10B981, #34D399)" size="small" />
        <app-kpi-card label="Active Subscriptions" [value]="formatNumber(summary.subscriptions.active)" icon="card_membership" gradient="linear-gradient(135deg, #F59E0B, #FBBF24)" size="small" />
        <app-kpi-card label="Low Stock Alerts" [value]="formatNumber(summary.meals.low_stock_ingredients)" icon="warning" gradient="linear-gradient(135deg, #EF4444, #F87171)" size="small" />
      </div>
    }

    <!-- Charts Row -->
    <div [style.display]="'grid'" [style.gridTemplateColumns]="'1fr 1fr'" [style.gap]="'20px'" [style.marginBottom]="'24px'">
      <app-chart-card title="Revenue Trend" subtitle="Daily revenue for selected period" chartType="area"
        [chartData]="revenueChartData" [chartCategories]="revenueChartLabels" [loading]="chartsLoading" [height]="280"
        [colors]="['#10B981', '#34D399']" />
      <app-chart-card title="Orders by Status" subtitle="Order distribution" chartType="donut"
        [chartData]="orderStatusChartData" [chartCategories]="orderStatusLabels" [loading]="chartsLoading" [height]="280"
        [colors]="['#F59E0B', '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#6B7280']" />
    </div>

    <div [style.display]="'grid'" [style.gridTemplateColumns]="'1fr 1fr'" [style.gap]="'20px'" [style.marginBottom]="'24px'">
      <app-chart-card title="Orders by Hour" subtitle="Peak ordering hours" chartType="bar"
        [chartData]="ordersHourlyChartData" [chartCategories]="ordersHourlyLabels" [loading]="chartsLoading" [height]="280"
        [colors]="['#059669']" />
      <app-chart-card title="Expense Trend" subtitle="Daily expenses" chartType="line"
        [chartData]="expenseChartData" [chartCategories]="expenseChartLabels" [loading]="chartsLoading" [height]="280"
        [colors]="['#EF4444', '#F97316']" />
    </div>

    <!-- Bottom Row: Recent Orders, Recent Customers, Sidebar -->
    <div [style.display]="'grid'" [style.gridTemplateColumns]="'1fr 1fr 1fr'" [style.gap]="'20px'" [style.marginBottom]="'24px'">
      <app-recent-widget title="Latest Orders" [items]="recentOrders" [loading]="widgetsLoading"
        emptyIcon="receipt_long" emptyMessage="No orders yet" viewAllRoute="/admin/orders" />
      <app-recent-widget title="Latest Customers" [items]="recentCustomers" [loading]="widgetsLoading"
        emptyIcon="people" emptyMessage="No customers yet" viewAllRoute="/admin/customers" />
      <div [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'16px'">
        <app-support-widget />
        <app-quick-actions />
        <app-system-health />
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  `],
})
export class DashboardComponent implements OnInit {
  private dashboardApi = inject(DashboardApiService);
  private notification = inject(NotificationService);

  summary: DashboardSummary | null = null;
  chartsData: ChartData | null = null;
  recentOrders: Array<Record<string, unknown>> = [];
  recentCustomers: Array<Record<string, unknown>> = [];

  summaryLoading = true;
  chartsLoading = true;
  widgetsLoading = true;
  currentFilter: DashboardFilter = { period: 'last_7_days' };

  revenueChartData: { series: Array<{ name: string; data: number[] }> } = { series: [] };
  revenueChartLabels: string[] = [];
  expenseChartData: { series: Array<{ name: string; data: number[] }> } = { series: [] };
  expenseChartLabels: string[] = [];
  orderStatusChartData: { series: number[] } = { series: [] };
  orderStatusLabels: string[] = [];
  ordersHourlyChartData: { series: Array<{ name: string; data: number[] }> } = { series: [] };
  ordersHourlyLabels: string[] = [];

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    return 'Evening';
  }

  get currentDate(): string {
    return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  formatNumber(value: number | undefined): string {
    return String(value ?? 0);
  }

  ngOnInit(): void {
    this.loadSummary();
    this.loadCharts();
    this.loadRecentData();
  }

  onPeriodChange(filter: { period: string; start_date?: string; end_date?: string }): void {
    this.currentFilter = filter as DashboardFilter;
    this.loadSummary();
    this.loadCharts();
  }

  onExport(): void {
    this.dashboardApi.exportSummary(this.currentFilter).subscribe({
      next: (res) => {
        if (!res.data) return;
        this.notification.success('Dashboard data exported successfully');
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-export-${this.currentFilter.period}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.notification.error('Export failed'),
    });
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) return '0';
    if (value >= 10000000) return (value / 10000000).toFixed(1) + 'Cr';
    if (value >= 100000) return (value / 100000).toFixed(1) + 'L';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toLocaleString('en-IN');
  }

  private loadSummary(): void {
    this.summaryLoading = true;
    this.dashboardApi.getSummary(this.currentFilter).subscribe({
      next: (res) => { this.summary = res.data ?? null; this.summaryLoading = false; },
      error: () => { this.summaryLoading = false; },
    });
  }

  private loadCharts(): void {
    this.chartsLoading = true;
    this.dashboardApi.getCharts(this.currentFilter).subscribe({
      next: (res) => {
        this.chartsData = res.data ?? null;
        this.buildChartData();
        this.chartsLoading = false;
      },
      error: () => { this.chartsLoading = false; },
    });
  }

  private loadRecentData(): void {
    this.widgetsLoading = true;
    forkJoin({
      orders: this.dashboardApi.getRecentOrders(),
      customers: this.dashboardApi.getRecentCustomers(),
    }).subscribe({
      next: (res) => {
        this.recentOrders = (res.orders.data ?? []) as Array<Record<string, unknown>>;
        this.recentCustomers = (res.customers.data ?? []) as Array<Record<string, unknown>>;
        this.widgetsLoading = false;
      },
      error: () => { this.widgetsLoading = false; },
    });
  }

  private buildChartData(): void {
    if (!this.chartsData) return;

    this.revenueChartLabels = this.chartsData.revenue_trend.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    });
    this.revenueChartData = {
      series: [{ name: 'Revenue', data: this.chartsData.revenue_trend.map((d) => d.revenue ?? 0) }],
    };

    this.expenseChartLabels = this.chartsData.expense_trend.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    });
    this.expenseChartData = {
      series: [{ name: 'Expenses', data: this.chartsData.expense_trend.map((d) => d.amount ?? 0) }],
    };

    this.orderStatusLabels = this.chartsData.order_status.map((s) =>
      s.status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    );
    this.orderStatusChartData = {
      series: this.chartsData.order_status.map((s) => s.count),
    };

    this.ordersHourlyLabels = this.chartsData.orders_by_hour.map((h) => `${h.hour}:00`);
    this.ordersHourlyChartData = {
      series: [{ name: 'Orders', data: this.chartsData.orders_by_hour.map((h) => h.count) }],
    };
  }
}
