import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartCardComponent } from '../../../../features/dashboard/components/chart-card/chart-card.component';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { DashboardKPIs, ExecutiveReport } from '../../../../core/models/report/report.model';

@Component({
  selector: 'app-executive-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ChartCardComponent],
  template: `
    <div *ngIf="loading && !kpis && !executiveReport" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading dashboard...</p>
      </div>
    </div>

    <div *ngIf="!loading || kpis || executiveReport" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <a routerLink="/admin/reports" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Reports</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Executive Dashboard</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Executive Dashboard</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Overview of key business metrics and performance indicators</p>
        </div>
      </div>

      <div *ngIf="kpis" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div *ngFor="let kpi of kpiList" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
            [style.background]="kpi.bgColor">
            <span class="material-icons" style="font-size: 22px;" [style.color]="kpi.iconColor">{{ kpi.icon }}</span>
          </div>
          <div style="flex: 1; min-width: 0;">
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ kpi.label }}</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ kpi.value }}</p>
            <p *ngIf="kpi.change !== undefined && kpi.change !== null" style="font-size: 12px; font-weight: 600; margin: 2px 0 0 0; display: flex; align-items: center; gap: 2px;"
              [style.color]="kpi.change >= 0 ? '#059669' : '#dc2626'">
              <span class="material-icons" style="font-size: 13px;">{{ kpi.change >= 0 ? 'trending_up' : 'trending_down' }}</span>
              {{ kpi.change >= 0 ? '+' : '' }}{{ kpi.change | number:'1.1-1' }}%
            </p>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
        <app-chart-card
          title="Sales Trend"
          subtitle="Daily sales over time"
          chartType="area"
          [chartData]="salesChartData"
          [chartCategories]="salesChartLabels"
          [loading]="chartsLoading"
          [height]="300"
        />
        <app-chart-card
          title="Order Distribution"
          subtitle="Orders by status"
          chartType="donut"
          [chartData]="orderChartData"
          [chartCategories]="orderChartLabels"
          [loading]="chartsLoading"
          [height]="300"
        />
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
        <app-chart-card
          title="Expenses by Category"
          subtitle="Expense breakdown"
          chartType="bar"
          [chartData]="expenseChartData"
          [chartCategories]="expenseChartLabels"
          [loading]="chartsLoading"
          [colors]="['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6']"
          [height]="300"
        />
        <app-chart-card
          title="Revenue Trend"
          subtitle="Revenue over time"
          chartType="line"
          [chartData]="revenueChartData"
          [chartCategories]="revenueChartLabels"
          [loading]="chartsLoading"
          [colors]="['#059669', '#22C55E']"
          [height]="300"
        />
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class ExecutiveDashboardComponent implements OnInit {
  private reportApi = inject(ReportApiService);

  kpis: DashboardKPIs | null = null;
  executiveReport: ExecutiveReport | null = null;

  loading = true;
  chartsLoading = true;

  salesChartData: any = null;
  salesChartLabels: string[] = [];
  orderChartData: any = null;
  orderChartLabels: string[] = [];
  expenseChartData: any = null;
  expenseChartLabels: string[] = [];
  revenueChartData: any = null;
  revenueChartLabels: string[] = [];

  get kpiList() {
    if (!this.kpis) return [];
    return [
      { label: 'Today Revenue', value: this.formatCurrency(this.kpis.today_revenue), icon: 'payments', bgColor: '#EEF2FF', iconColor: '#6366F1', change: this.kpis.revenue_change_pct },
      { label: 'Today Orders', value: this.kpis.today_orders.toLocaleString('en-IN'), icon: 'receipt_long', bgColor: '#EDE9FE', iconColor: '#8B5CF6', change: this.kpis.orders_change_pct },
      { label: 'Active Customers', value: this.kpis.active_customers.toLocaleString('en-IN'), icon: 'people', bgColor: '#EFF6FF', iconColor: '#3B82F6', change: undefined },
      { label: 'Active Subscriptions', value: this.kpis.active_subscriptions.toLocaleString('en-IN'), icon: 'card_membership', bgColor: '#FEF3C7', iconColor: '#F59E0B', change: undefined },
      { label: 'Pending Orders', value: this.kpis.pending_orders.toLocaleString('en-IN'), icon: 'pending_actions', bgColor: '#FEF2F2', iconColor: '#EF4444', change: undefined },
      { label: 'Production Batches', value: this.kpis.kitchen_production_batches.toLocaleString('en-IN'), icon: 'cooking', bgColor: '#DBEAFE', iconColor: '#3B82F6', change: undefined },
      { label: 'Inventory Value', value: this.formatCurrency(this.kpis.inventory_value), icon: 'inventory_2', bgColor: '#F0FDF4', iconColor: '#22C55E', change: undefined },
      { label: 'Low Stock Items', value: this.kpis.low_stock_items.toLocaleString('en-IN'), icon: 'warning', bgColor: '#FEF2F2', iconColor: '#EF4444', change: undefined },
      { label: 'Total Expenses', value: this.formatCurrency(this.kpis.total_expenses), icon: 'money_off', bgColor: '#FFF1F2', iconColor: '#F43F5E', change: undefined },
      { label: 'Net Profit', value: this.formatCurrency(this.kpis.net_profit), icon: 'savings', bgColor: '#ECFDF5', iconColor: '#14B8A6', change: undefined },
    ];
  }

  ngOnInit(): void {
    this.loadData();
  }

  formatCurrency(value: number): string {
    if (value === undefined || value === null) return '₹0';
    return '₹' + value.toLocaleString('en-IN');
  }

  private loadData(): void {
    this.loading = true;
    this.chartsLoading = true;

    this.reportApi.getDashboardKPIs().subscribe({
      next: (res) => {
        this.kpis = res.data ?? null;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });

    this.reportApi.getExecutiveReport().subscribe({
      next: (res) => {
        this.executiveReport = res.data ?? null;
        this.buildChartData();
        this.chartsLoading = false;
      },
      error: () => { this.chartsLoading = false; },
    });

    this.reportApi.getSalesChart().subscribe({
      next: (res) => {
        if (res.data) {
          this.buildSalesChart(res.data);
        }
      },
    });

    this.reportApi.getOrderChart().subscribe({
      next: (res) => {
        if (res.data) {
          this.buildOrderChart(res.data);
        }
      },
    });

    this.reportApi.getExpenseChart().subscribe({
      next: (res) => {
        if (res.data) {
          this.buildExpenseChart(res.data);
        }
      },
    });

    this.reportApi.getRevenueChart().subscribe({
      next: (res) => {
        if (res.data) {
          this.buildRevenueChart(res.data);
        }
      },
    });
  }

  private buildChartData(): void {
    if (!this.executiveReport) return;

    if (this.executiveReport.sales?.chart) {
      this.buildSalesChart(this.executiveReport.sales.chart);
    }
    if (this.executiveReport.orders?.chart) {
      this.buildOrderChart(this.executiveReport.orders.chart);
    }
    if (this.executiveReport.expenses?.chart) {
      this.buildExpenseChart(this.executiveReport.expenses.chart);
    }
    if (this.executiveReport.finance?.chart) {
      this.buildRevenueChart(this.executiveReport.finance.chart);
    }
  }

  private buildSalesChart(data: any): void {
    if (data.categories) {
      this.salesChartLabels = data.categories;
    } else if (Array.isArray(data)) {
      this.salesChartLabels = data.map((d: any) => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      });
      this.salesChartData = {
        series: [{ name: 'Sales', data: data.map((d: any) => d.amount ?? d.value ?? 0) }],
      };
      return;
    }
    this.salesChartData = data.series ? data : { series: [{ name: 'Sales', data: data.data ?? [] }] };
  }

  private buildOrderChart(data: any): void {
    if (data.labels) {
      this.orderChartLabels = data.labels;
      this.orderChartData = data.series ?? data.data;
    } else if (Array.isArray(data)) {
      this.orderChartLabels = data.map((d: any) => d.status?.replace('_', ' ') ?? d.label ?? '');
      this.orderChartData = { series: data.map((d: any) => d.count ?? d.value ?? 0) };
    } else {
      this.orderChartData = data.series ? data : data;
    }
  }

  private buildExpenseChart(data: any): void {
    if (data.categories) {
      this.expenseChartLabels = data.categories;
      this.expenseChartData = data.series ? data : { series: [{ name: 'Expenses', data: data.data ?? [] }] };
    } else if (Array.isArray(data)) {
      this.expenseChartLabels = data.map((d: any) => d.category ?? d.label ?? '');
      this.expenseChartData = {
        series: [{ name: 'Expenses', data: data.map((d: any) => d.amount ?? d.value ?? 0) }],
      };
    } else {
      this.expenseChartData = data;
    }
  }

  private buildRevenueChart(data: any): void {
    if (data.categories) {
      this.revenueChartLabels = data.categories;
      this.revenueChartData = data.series ? data : { series: [{ name: 'Revenue', data: data.data ?? [] }] };
    } else if (Array.isArray(data)) {
      this.revenueChartLabels = data.map((d: any) => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      });
      this.revenueChartData = {
        series: [{ name: 'Revenue', data: data.map((d: any) => d.amount ?? d.revenue ?? 0) }],
      };
    } else {
      this.revenueChartData = data;
    }
  }
}
