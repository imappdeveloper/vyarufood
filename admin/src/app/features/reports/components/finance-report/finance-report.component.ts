import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartCardComponent } from '../../../../features/dashboard/components/chart-card/chart-card.component';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { GROUP_BY_OPTIONS } from '../../../../core/models/report/report.model';

@Component({
  selector: 'app-finance-report',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ChartCardComponent],
  template: `
    <div *ngIf="loading && !reportData" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading finance report...</p>
      </div>
    </div>

    <div *ngIf="!loading || reportData" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <a routerLink="/admin/reports" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Reports</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Finance Report</span>
      </div>

      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Finance Report</h1>
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">Debit and credit transaction overview</p>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap;">
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0; display: block;">Group By</label>
            <select [(ngModel)]="groupBy"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'">
              <option *ngFor="let opt of groupByOptions" [value]="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0; display: block;">Date From</label>
            <input type="date" [(ngModel)]="selectedDateFrom"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0; display: block;">Date To</label>
            <input type="date" [(ngModel)]="selectedDateTo"
              style="padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
          </div>
          <button (click)="loadReport()"
            style="padding: 9px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">search</span> Search
          </button>
        </div>
      </div>

      <div *ngIf="loading && reportData" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
        <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
      </div>

      <div *ngIf="reportData" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef2f2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #dc2626;">arrow_downward</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Debit</p>
            <p style="font-size: 22px; font-weight: 800; color: #dc2626; margin: 0;">{{ formatCurrency(reportData.summary?.total_debit) }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">arrow_upward</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Credit</p>
            <p style="font-size: 22px; font-weight: 800; color: #059669; margin: 0;">{{ formatCurrency(reportData.summary?.total_credit) }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #eff6ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #2563eb;">balance</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Difference</p>
            <p style="font-size: 22px; font-weight: 800; margin: 0;"
              [style.color]="(reportData.summary?.total_credit - reportData.summary?.total_debit) >= 0 ? '#059669' : '#dc2626'">{{ formatCurrency(reportData.summary?.total_credit - reportData.summary?.total_debit) }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="reportData?.data?.length" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
          <h3 style="font-size: 13px; font-weight: 700; color: #374151; margin: 0;">Finance Transactions</h3>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 12px 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Period</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                <th style="padding: 10px 16px 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of reportData.data; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 12px 12px 16px; color: #374151;">{{ row.period ?? '—' }}</td>
                <td style="padding: 12px 12px;">
                  <span style="display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600;"
                    [style.background]="row.type === 'credit' ? '#ecfdf5' : '#fef2f2'" [style.color]="row.type === 'credit' ? '#047857' : '#b91c1c'">
                    {{ row.type ?? '—' }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: right; font-weight: 700;"
                  [style.color]="row.type === 'credit' ? '#059669' : '#dc2626'">{{ formatCurrency(row.total_amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="reportData && !reportData?.data?.length" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
        <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span class="material-icons" style="font-size: 32px; color: #059669;">search_off</span>
        </div>
        <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No finance data found</h3>
        <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">No records found for the selected filters</p>
      </div>

      <app-chart-card
        *ngIf="chartLabels.length"
        title="Debit vs Credit"
        subtitle="Financial flow comparison over time"
        chartType="bar"
        [chartData]="chartSeries"
        [chartCategories]="chartLabels"
        [loading]="false"
        [height]="350"
      />
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class FinanceReportComponent implements OnInit {
  private reportApi = inject(ReportApiService);

  loading = true;
  reportData: any = null;
  groupBy = 'day';
  selectedDateFrom = '';
  selectedDateTo = '';

  groupByOptions = GROUP_BY_OPTIONS;
  displayedColumns = ['period', 'type', 'total_amount'];

  chartLabels: string[] = [];
  chartSeries: any = null;

  ngOnInit(): void {
    this.loadReport();
  }

  formatCurrency(value: number): string {
    if (value === undefined || value === null) return '₹0';
    return '₹' + value.toLocaleString('en-IN');
  }

  loadReport(): void {
    this.loading = true;
    this.reportApi.getReport('finance', {
      group_by: this.groupBy,
      date_from: this.selectedDateFrom || null,
      date_to: this.selectedDateTo || null,
    }).subscribe({
      next: (res) => {
        this.reportData = res.data ?? null;
        this.buildChartData();
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  private buildChartData(): void {
    const chart = this.reportData?.chart;
    if (!chart || !Array.isArray(chart) || !chart.length) { this.chartLabels = []; this.chartSeries = null; return; }

    const dateMap = new Map<string, { debit: number; credit: number }>();
    for (const entry of chart) {
      const date = entry.date;
      if (!dateMap.has(date)) dateMap.set(date, { debit: 0, credit: 0 });
      const bucket = dateMap.get(date)!;
      if (entry.type === 'debit') {
        bucket.debit += Number(entry.amount) || 0;
      } else {
        bucket.credit += Number(entry.amount) || 0;
      }
    }

    this.chartLabels = Array.from(dateMap.keys());
    const debitData = this.chartLabels.map(d => dateMap.get(d)!.debit);
    const creditData = this.chartLabels.map(d => dateMap.get(d)!.credit);

    this.chartSeries = {
      series: [
        { name: 'Debit', data: debitData },
        { name: 'Credit', data: creditData },
      ],
    };
  }
}
